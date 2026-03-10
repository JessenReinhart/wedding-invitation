import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBYS5Apl_32tnrWB267boU0dBjmCOdh7pk",
    authDomain: "vj-wedding-registry.firebaseapp.com",
    projectId: "vj-wedding-registry",
    storageBucket: "vj-wedding-registry.firebasestorage.app",
    messagingSenderId: "682042806746",
    appId: "1:682042806746:web:52cf6cc20069d2b1b230e3",
    measurementId: "G-ZNMV0JVEYS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const items = [
    {
        name_id: 'Set Peralatan Dapur KitchenAid',
        name_en: 'KitchenAid Cookware Set',
        name_ko: 'KitchenAid 조리기구 세트',
        link: 'https://www.tokopedia.com',
        bought: false,
        boughtBy: '',
        order: 1,
    },
    {
        name_id: 'Set Handuk Mewah',
        name_en: 'Luxury Towel Set',
        name_ko: '럭셔리 타월 세트',
        link: 'https://www.tokopedia.com',
        bought: false,
        boughtBy: '',
        order: 2,
    },
    {
        name_id: 'Koper Samsonite',
        name_en: 'Samsonite Luggage',
        name_ko: 'Samsonite 여행가방',
        link: 'https://www.tokopedia.com',
        bought: false,
        boughtBy: '',
        order: 3,
    },
    {
        name_id: 'Set Perlengkapan Tempat Tidur',
        name_en: 'Premium Bedding Set',
        name_ko: '프리미엄 침구 세트',
        link: 'https://www.tokopedia.com',
        bought: false,
        boughtBy: '',
        order: 4,
    },
    {
        name_id: 'Mesin Kopi Espresso',
        name_en: 'Espresso Coffee Machine',
        name_ko: '에스프레소 커피 머신',
        link: 'https://www.tokopedia.com',
        bought: false,
        boughtBy: '',
        order: 5,
    },
    {
        name_id: "Set Piring 'Fine Dining'",
        name_en: 'Fine Dining Plate Set',
        name_ko: '파인 다이닝 식기 세트',
        link: 'https://www.tokopedia.com',
        bought: false,
        boughtBy: '',
        order: 6,
    },
];

async function seed() {
    console.log('Seeding registry items...');
    const col = collection(db, 'registryItems');

    for (const item of items) {
        const docRef = await addDoc(col, item);
        console.log(`  Added: ${item.name_en} (${docRef.id})`);
    }

    console.log('Done! All items seeded.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
