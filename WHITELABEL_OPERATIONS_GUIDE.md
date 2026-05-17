# Whitelabel Operations Guide (Detailed)

This repo contains:

- Your real wedding site (repo root): `/`
- A sellable whitelabel/template version: `/whitelabel`

The whitelabel is multi-tenant using a single Firebase project. Each client/site is separated by a `tenantId`.

## 0) Core concepts (don’t skip)

### What is a “tenant” here?

A tenant = one customer site (one couple/wedding instance).

We store tenant-specific data in a shared Firebase project by adding a `tenantId` to documents (or by using tenant-specific doc IDs).

### What is `VITE_TENANT_ID`?

`VITE_TENANT_ID` is the identifier for a tenant, for example:

- `client_acme_2026`
- `brenda_mike`
- `tenant_7f3a2c9d`

In the current architecture:

- **One deployment = one tenant**, because `VITE_TENANT_ID` is a Vite environment variable baked into the build.
- **Many deployments can share the same repo and the same Firebase project**, with different `VITE_TENANT_ID` values.

### Where data is stored (per tenant)

For a given `tenantId`, the whitelabel uses:

- `siteConfig/{tenantId}` (single doc)
- `comments` collection, documents include `tenantId`
- `rsvps` collection, documents include `tenantId`
- `registryItems` collection, documents include `tenantId`
- `page_stats/registry_visits_{tenantId}` for the registry page view counter

## 1) Running the whitelabel locally

### 1.1 Install & start

From the repo root:

```bash
cd whitelabel
npm install
npm run dev
```

Open:

- Main site: http://localhost:3000/
- Admin panel: http://localhost:3000/admin.html
- Registry page: http://localhost:3000/registry.html

### 1.2 Tenant ID during local dev

You have two options:

#### Option A (Recommended): set a tenant explicitly

Create `whitelabel/.env.local`:

```env
VITE_TENANT_ID=local_demo
VITE_ADMIN_PASSWORD=some-password
```

Then restart:

```bash
npm run dev
```

#### Option B: don’t set it (dev-only fallback)

If `VITE_TENANT_ID` is missing in local dev, the whitelabel will auto-generate one like:

`local_ab12cd34`

and store it in browser localStorage.

This is only meant to prevent “blank screen” while you’re iterating locally.

## 2) Configuring the whitelabel

There are two ways to configure:

### 2.1 Configure via Admin UI (recommended)

Go to:

http://localhost:3000/admin.html

The admin has a **Site** tab for editing:

- Bride/groom names (display and full name)
- Wedding date labels
- Location:
  - Google Maps URL
  - Map Lat/Lng
- Wording (copy):
  - Quick fields (common text)
  - Advanced overrides (any translation key)
- Import/Export JSON config

When you click **Save Changes**, it writes to:

- `siteConfig/{tenantId}`

### 2.2 Configure default template values (code)

If you want to ship the whitelabel with different defaults, edit:

- `whitelabel/services/siteConfig.ts` → `DEFAULT_SITE_CONFIG`

This affects what shows up when there is no saved `siteConfig/{tenantId}` yet.

## 3) Admin panel access & authentication

### 3.1 The “two layers” of admin access

The admin panel supports:

1) Optional **admin password gate** (simple shared password, not real security)
2) Required **Firebase Auth login** (real auth for Firestore rules)

#### Admin password gate (optional)

Set:

```env
VITE_ADMIN_PASSWORD=some-password
```

This protects `/admin.html` with a simple password prompt.

It is not a security boundary by itself (the password is still client-side).

#### Firebase Auth login (recommended / required for real security)

The admin page requires signing into Firebase Auth to perform write operations when Firestore rules require `request.auth != null`.

If you see:

`permission-denied: Missing or insufficient permissions`

that means your Firestore rules are blocking writes for unauthenticated users.

### 3.2 Enable Firebase Authentication (Email/Password)

In Firebase Console:

1) Go to **Authentication**
2) Click **Get started** (if shown)
3) Open **Sign-in method**
4) Enable **Email/Password**

Then create your admin user:

1) Authentication → **Users**
2) **Add user**
3) Enter email + password

### 3.3 Firestore rules (recommended baseline)

In Firebase Console:

Firestore Database → **Rules**

If you want:

- Anyone can view the site content
- Only signed-in admin can write anything (including RSVP/comments)

Use this baseline:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Important tradeoff

If you use the baseline above, public visitors cannot submit RSVP/comments unless they sign in.

If you want public RSVP/comments, you must explicitly allow it in rules, but be aware:

- Without a backend or auth claims, you cannot perfectly prevent a malicious user from writing to another tenant by faking `tenantId`.
- “Tenant isolation” for public writes requires stronger infrastructure (Cloud Functions + validation, or Auth + custom claims).

## 4) Creating a new client (tenant) without forking the repo

This is the recommended commercial workflow.

### 4.1 Choose a tenant ID

Pick a stable, unique string, e.g.:

- `client_acme_2026`
- `client_john_jane`

Avoid spaces. Use lowercase + underscores or dashes.

### 4.2 Create a new Vercel project (same repo)

In Vercel:

1) Add **New Project**
2) Select the same Git repository
3) Set **Root Directory** = `whitelabel`
4) Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 4.3 Set environment variables (per client)

In Vercel Project → Settings → Environment Variables:

Required:

- `VITE_TENANT_ID=client_acme_2026`

Recommended:

- `VITE_ADMIN_PASSWORD=...` (optional password gate)

Firebase config:

- If you keep using the same Firebase project, you can leave Firebase values as defaults (already embedded in the code).
- If you want to override them, set:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID`

### 4.4 Deploy and configure

After deploying:

1) Open the deployed admin page:
   - `https://<client-domain>/admin.html`
2) Sign in with Firebase Auth (admin user)
3) Configure the site in the **Site** tab
4) Save

Everything saves into the tenant’s namespace (by `tenantId`).

## 5) Do clients need different domains?

You don’t technically need different domains for tenant separation (tenant is determined by `VITE_TENANT_ID`).

But for a sellable wedding invitation, clients will almost always need their own URL, so in practice:

- Yes, use a different domain/subdomain per client deployment:
  - `acme.yourdomain.com`
  - `brenda-mike.yourdomain.com`

Each domain typically maps to a different Vercel Project (one project per client).

## 6) Troubleshooting (common issues)

### 6.1 “Save failed — invalid-argument: Unsupported field value: undefined”

Cause: Firestore rejects `undefined`.

Fix: the code strips `undefined` before saving config. If you still see it, restart your dev server and try again.

### 6.2 “Save failed — permission-denied: Missing or insufficient permissions”

Cause: Firestore rules are blocking writes.

Fix:

- Enable Firebase Auth Email/Password
- Create a user
- Sign in on `/admin.html`
- Update Firestore rules to allow authenticated writes

### 6.3 “This query requires an index”

Cause: Firestore composite index required for `where + orderBy` queries.

Fix: the current code avoids composite indexes by sorting client-side.

If you see it again, it means some other query path still includes `orderBy` with a `where` clause.

## 7) Where to change things in code (reference)

- Tenant ID resolution:
  - `whitelabel/services/tenant.ts`
- Tenant-scoped config doc:
  - `whitelabel/services/siteConfig.ts`
- Tenant-scoped collections:
  - `whitelabel/services/comments.ts`
  - `whitelabel/services/rsvp.ts`
  - `whitelabel/services/registry.ts`
- Admin page entry:
  - `whitelabel/admin.html` and `whitelabel/admin.tsx`

