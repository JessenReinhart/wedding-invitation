export interface NavItem {
  label: string;
  href: string;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface GuestInput {
  firstName: string;
  lastName: string;
  email: string;
  dietary: string;
  attendance: 'yes' | 'no' | null;
}
