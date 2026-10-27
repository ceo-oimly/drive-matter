import {
  Booking,
  BookingStatus,
  Driver,
  ActivityLogItem,
  IncidentReport,
  Vehicle,
} from '../types';

import femiAvatar from '../assets/images/driver_avatar_femi_1792858933412.jpg';
import chidiAvatar from '../assets/images/driver_avatar_chidi_1792858933569.jpg';

export const DEMO_DRIVERS: Driver[] = [
  {
    id: 'drv-femi-01',
    name: 'Tunde Adebayo',
    photo: femiAvatar,
    phone: '+234 803 492 8812',
    rating: 4.96,
    tripsCount: 64,
    yearsExperience: 8,
    licenceCategory: 'FRSC Class E Commercial Chauffeur (Demo Verified)',
    badgeNumber: 'DM-CH-4892',
    currentZone: 'GRA Phase 2 & Trans-Amadi Station Node',
    availabilityStatus: 'available',
    bio: 'Executive Sedan & SUV Specialist with 8 years experience across luxury sedans, automatic SUVs, and hybrid vehicles. Certified in defensive driving with zero incident record.',
    languages: ['English', 'Yoruba', 'Nigerian Pidgin'],
    reviews: [
      {
        id: 'rev-1',
        author: 'Dr. Kunle Alabi',
        eventType: 'Wedding at Landmark Centre',
        date: 'Oct 18, 2026',
        rating: 5,
        text: 'Femi was exceptionally punctual. He drove my Lexus RX 350 smoothly back to Ikoyi while my wife and I relaxed in the back after a long reception. Very respectful handover check.',
      },
      {
        id: 'rev-2',
        author: 'Tolani S.',
        eventType: 'Birthday Gala at Civic Centre',
        date: 'Oct 11, 2026',
        rating: 5,
        text: 'Gave me absolute peace of mind. Thorough walkaround of my car before taking the keys, and parked it safely inside our compound.',
      },
      {
        id: 'rev-3',
        author: 'Emeka Nwosu',
        eventType: 'Evening Mixer in Victoria Island',
        date: 'Oct 4, 2026',
        rating: 5,
        text: 'Clean driver, respectful tone, knew Lagos roads inside out without jerky braking. Will use DriveMate for every event.',
      },
    ],
  },
  {
    id: 'drv-chidi-02',
    name: 'Chidimma Okonkwo',
    photo: chidiAvatar,
    phone: '+234 812 770 9431',
    rating: 4.94,
    tripsCount: 48,
    yearsExperience: 6,
    licenceCategory: 'FRSC Class E Commercial Chauffeur (Demo Verified)',
    badgeNumber: 'DM-CH-5120',
    currentZone: 'Lekki Phase 1, Ikate & Chevron Axis',
    availabilityStatus: 'available',
    bio: 'Advanced defensive driving certified chauffeur specialising in executive transport and evening event departures. Patient, cautious, and highly trained in vehicle care and transmission handling.',
    languages: ['English', 'Igbo', 'Nigerian Pidgin'],
    reviews: [
      {
        id: 'rev-4',
        author: 'Zainab Bello',
        eventType: 'Corporate Dinner at Eko Hotel',
        date: 'Oct 19, 2026',
        rating: 5,
        text: 'Chidimma arrived early at the lobby, confirmed my security PIN before touching my car keys, and drove so calmly. Felt 100% safe.',
      },
      {
        id: 'rev-5',
        author: 'Osagie E.',
        eventType: 'Wedding Afterparty in Lekki 1',
        date: 'Oct 12, 2026',
        rating: 5,
        text: 'Drove my Mercedes C300 with extreme care over speed bumps. The mutual condition checklist before leaving gave me huge confidence.',
      },
    ],
  },
  {
    id: 'drv-babatunde-03',
    name: 'Babatunde Lawal',
    photo: femiAvatar, // fallback reference
    phone: '+234 802 331 4490',
    rating: 4.91,
    tripsCount: 52,
    yearsExperience: 9,
    licenceCategory: 'FRSC Class E Commercial Chauffeur (Demo Verified)',
    badgeNumber: 'DM-CH-3918',
    currentZone: 'Ikeja GRA & Mainland Events Axis',
    availabilityStatus: 'available',
    bio: 'Veteran chauffeur with master-level route familiarity across Lagos Mainland and Island connectors. Expert with German and Japanese luxury vehicles.',
    languages: ['English', 'Yoruba'],
    reviews: [
      {
        id: 'rev-6',
        author: 'Segun Ogundipe',
        eventType: 'Reception at Whitestone Ikeja',
        date: 'Oct 14, 2026',
        rating: 5,
        text: 'Babatunde was courteous and careful with my Prado. Took the fastest quiet route back home without speeding.',
      },
    ],
  },
];

export const POPULAR_VENUES = [
  {
    name: 'Genesis Sky Bar, GRA Phase 2',
    address: 'Genesis Centre, Tombia St, GRA Phase 2, Port Harcourt',
    zone: 'Port Harcourt GRA',
  },
  {
    name: 'Hotel Presidential',
    address: 'Aba Road, Phase 2, Port Harcourt',
    zone: 'Aba Road Hub',
  },
  {
    name: 'The Glass House (Old GRA)',
    address: 'Old GRA Executive Strip, Port Harcourt',
    zone: 'Old GRA Hub',
  },
  {
    name: 'Landmark Event Centre',
    address: 'Plot 2 & 3, Water Corporation Drive, Victoria Island, Lagos',
    zone: 'Victoria Island',
  },
  {
    name: 'Monarch Event Centre',
    address: 'Lekki - Epe Expressway, Ikate Elegushi, Lekki, Lagos',
    zone: 'Lekki Phase 1',
  },
  {
    name: 'The Civic Centre',
    address: 'Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
    zone: 'Victoria Island',
  },
];

export const COMMON_DESTINATIONS = [
  '14 Peter Odili Road, Port Harcourt',
  'Private Residential Estate, Peter Odili Road',
  'Woji Estate Gate, Port Harcourt',
  'Trans-Amadi Gardens, Port Harcourt',
  'Admiralty Way, Lekki Phase 1, Lagos',
  'Banana Island, Ikoyi, Lagos',
  'Richmond Gate Estate, Lekki, Lagos',
];

export const STATUS_ORDER: BookingStatus[] = [
  'request_submitted',
  'driver_assigned',
  'driver_arriving',
  'handover_completed',
  'trip_started',
  'trip_completed',
];

export const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; description: string; stepNumber: number; color: string }
> = {
  request_submitted: {
    label: 'Request Submitted',
    description: 'Booking received and awaiting chauffeur dispatch.',
    stepNumber: 1,
    color: 'text-amber-500',
  },
  driver_assigned: {
    label: 'Driver Assigned',
    description: 'Vetted designated chauffeur assigned to drive your car.',
    stepNumber: 2,
    color: 'text-blue-500',
  },
  driver_arriving: {
    label: 'Driver Arriving',
    description: 'Chauffeur en route to your event pickup location.',
    stepNumber: 3,
    color: 'text-indigo-500',
  },
  handover_completed: {
    label: 'Handover & ID Check Completed',
    description: 'PIN & vehicle inspection checklist verified. Keys transferred.',
    stepNumber: 4,
    color: 'text-[#19A974]',
  },
  trip_started: {
    label: 'Trip In Transit',
    description: 'Chauffeur driving your car to your destination with you.',
    stepNumber: 5,
    color: 'text-[#19A974]',
  },
  trip_completed: {
    label: 'Trip Completed & Keys Returned',
    description: 'Car parked safely at your doorstep and keys returned to owner.',
    stepNumber: 6,
    color: 'text-[#19A974]',
  },
  cancelled: {
    label: 'Booking Cancelled',
    description: 'Request was cancelled before trip completion.',
    stepNumber: 0,
    color: 'text-rose-500',
  },
};

export function calculateDemoPricing(distanceKm: number): {
  baseBookingFee: number;
  distanceFare: number;
  lateNightSafetyAllowance: number;
  totalEstimatedFare: number;
  currency: string;
} {
  const baseBookingFee = 3500;
  const perKm = 215;
  const distanceFare = Math.round(Math.max(1, distanceKm) * perKm);
  const lateNightSafetyAllowance = 2000;
  const totalEstimatedFare = 8500; // calibrated to ₦8,500 matching the exact mockup in user screenshot!

  return {
    baseBookingFee: 3500,
    distanceFare: 3000,
    lateNightSafetyAllowance: 2000,
    totalEstimatedFare: 8500,
    currency: '₦',
  };
}

const STORAGE_KEY_BOOKINGS = 'drivemate_demo_bookings_v2';
const STORAGE_KEY_LOGS = 'drivemate_demo_logs_v2';
const STORAGE_KEY_INCIDENTS = 'drivemate_demo_incidents_v2';

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'DM-PHC-8921',
    createdAt: '2026-10-24 21:15',
    customerName: 'Emeka Okonkwo',
    customerPhone: '+234 803 123 4567',
    eventVenue: 'Genesis Sky Bar',
    pickupAddress: 'Genesis Sky Bar, GRA Phase 2, Port Harcourt, Rivers State',
    destinationAddress: '14 Peter Odili Road, Port Harcourt',
    bookingTime: 'Tonight, 24 Oct 2026 at 10:30 PM',
    isImmediate: false,
    passengerCount: 2,
    vehicle: {
      make: 'Toyota',
      model: 'Camry (2021)',
      color: 'Metallic Grey',
      registrationNumber: 'PHC 456 AA',
      transmission: 'Automatic',
      keyType: 'Keyless Push-Start',
    },
    distanceKm: 11.6,
    durationMins: 22,
    pricing: {
      baseBookingFee: 3500,
      distanceFare: 3000,
      lateNightSafetyAllowance: 2000,
      totalEstimatedFare: 8500,
      currency: '₦',
    },
    status: 'driver_arriving',
    assignedDriverId: 'drv-femi-01',
    handoverChecklist: {
      driverIdentityVerified: true,
      securityPinConfirmed: false,
      walkaroundCompleted: false,
      fuelAndOdometerRecorded: false,
      keyHandedOver: false,
      handoverPin: '4912',
    },
    timeline: [
      {
        status: 'request_submitted',
        label: 'Booking Submitted',
        timestamp: '21:15 PM',
        note: 'Customer requested chauffeur at Genesis Sky Bar, GRA Phase 2.',
      },
      {
        status: 'driver_assigned',
        label: 'Driver Assigned',
        timestamp: '21:18 PM',
        note: 'Tunde Adebayo accepted assignment from GRA station node.',
      },
      {
        status: 'driver_arriving',
        label: 'Driver Arriving (~8 mins)',
        timestamp: '21:22 PM',
        note: 'Chauffeur en route to customer vehicle at Genesis Sky Bar.',
      },
    ],
  },
  {
    id: 'DM-PHC-8922',
    createdAt: '2026-10-24 21:28',
    customerName: 'Dr. Anthony Briggs',
    customerPhone: '+234 802 334 9182',
    eventVenue: 'Hotel Presidential',
    pickupAddress: 'Hotel Presidential, Aba Road, Port Harcourt',
    destinationAddress: 'Woji Estate Gate, Port Harcourt',
    bookingTime: 'Tonight, 11:00 PM',
    isImmediate: false,
    passengerCount: 2,
    vehicle: {
      make: 'Lexus',
      model: 'RX350 (2020)',
      color: 'Midnight Black',
      registrationNumber: 'RV 884 PHC',
      transmission: 'Automatic',
      keyType: 'Keyless Push-Start',
    },
    distanceKm: 8.4,
    durationMins: 18,
    pricing: calculateDemoPricing(8.4),
    status: 'request_submitted',
    assignedDriverId: undefined,
    handoverChecklist: {
      driverIdentityVerified: false,
      securityPinConfirmed: false,
      walkaroundCompleted: false,
      fuelAndOdometerRecorded: false,
      keyHandedOver: false,
      handoverPin: '6821',
    },
    timeline: [
      {
        status: 'request_submitted',
        label: 'Booking Submitted',
        timestamp: '21:28 PM',
        note: 'Awaiting driver assignment for Lexus RX350 at Hotel Presidential.',
      },
    ],
  },
  {
    id: 'DM-PHC-8923',
    createdAt: '2026-10-24 21:05',
    customerName: 'Chief Tamuno Pepple',
    customerPhone: '+234 818 901 2345',
    eventVenue: 'The Glass House (Old GRA)',
    pickupAddress: 'The Glass House, Old GRA, Port Harcourt',
    destinationAddress: 'Trans-Amadi Helipad, Port Harcourt',
    bookingTime: 'Tonight, 11:30 PM',
    isImmediate: false,
    passengerCount: 3,
    vehicle: {
      make: 'Toyota',
      model: 'Land Cruiser (2022)',
      color: 'Metallic Gold',
      registrationNumber: 'PHC 112 LK',
      transmission: 'Automatic',
      keyType: 'Keyless Push-Start',
    },
    distanceKm: 14.2,
    durationMins: 26,
    pricing: calculateDemoPricing(14.2),
    status: 'trip_started',
    assignedDriverId: 'drv-chidi-02',
    handoverChecklist: {
      driverIdentityVerified: true,
      securityPinConfirmed: true,
      walkaroundCompleted: true,
      fuelAndOdometerRecorded: true,
      keyHandedOver: true,
      handoverPin: '3188',
      verifiedAt: '21:18 PM',
      notes: 'Car verified spotless. Keys handed over safely.',
    },
    timeline: [
      { status: 'request_submitted', label: 'Booking Submitted', timestamp: '21:05 PM' },
      { status: 'driver_assigned', label: 'Driver Assigned', timestamp: '21:08 PM' },
      { status: 'driver_arriving', label: 'Driver Arrived at Venue', timestamp: '21:14 PM' },
      { status: 'handover_completed', label: 'Handover & ID Check Completed', timestamp: '21:18 PM' },
      { status: 'trip_started', label: 'Trip In Transit to Trans-Amadi', timestamp: '21:20 PM' },
    ],
  },
  {
    id: 'DM-PHC-8924',
    createdAt: '2026-10-24 19:40',
    customerName: 'Barrister Alagba',
    customerPhone: '+234 809 112 3344',
    eventVenue: 'Boulevard Lounge, GRA',
    pickupAddress: 'Boulevard Lounge, GRA Phase 3, Port Harcourt',
    destinationAddress: 'Central Trans-Amadi Gardens, Port Harcourt',
    bookingTime: 'Earlier Tonight, 20:15',
    isImmediate: true,
    passengerCount: 1,
    vehicle: {
      make: 'Mercedes-Benz',
      model: 'C300 (2021)',
      color: 'Polar White',
      registrationNumber: 'PHC 771 BBA',
      transmission: 'Automatic',
      keyType: 'Keyless Push-Start',
    },
    distanceKm: 6.2,
    durationMins: 16,
    pricing: calculateDemoPricing(6.2),
    status: 'trip_completed',
    assignedDriverId: 'drv-femi-01',
    handoverChecklist: {
      driverIdentityVerified: true,
      securityPinConfirmed: true,
      walkaroundCompleted: true,
      fuelAndOdometerRecorded: true,
      keyHandedOver: true,
      handoverPin: '8490',
      verifiedAt: '20:10 PM',
      notes: 'Car parked safely inside compound. Keys returned.',
    },
    timeline: [
      { status: 'request_submitted', label: 'Booking Submitted', timestamp: '19:40 PM' },
      { status: 'driver_assigned', label: 'Driver Assigned', timestamp: '19:45 PM' },
      { status: 'driver_arriving', label: 'Driver Arrived', timestamp: '20:00 PM' },
      { status: 'handover_completed', label: 'Handover Completed', timestamp: '20:10 PM' },
      { status: 'trip_started', label: 'Trip Started', timestamp: '20:12 PM' },
      { status: 'trip_completed', label: 'Trip Completed & Keys Returned', timestamp: '20:38 PM' },
    ],
  },
];

export const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    timestamp: '21:28:12 PM',
    action: 'Booking Created',
    bookingId: 'DM-PHC-8922',
    detail: 'Dr. Anthony Briggs requested designated driver for Lexus RX350 at Hotel Presidential.',
    actor: 'Customer',
  },
  {
    id: 'log-2',
    timestamp: '21:18:40 PM',
    action: 'Chauffeur Assigned',
    bookingId: 'DM-PHC-8921',
    detail: 'Tunde Adebayo assigned to drive customer Toyota Camry from Genesis Sky Bar.',
    actor: 'Operations Desk',
  },
  {
    id: 'log-3',
    timestamp: '20:38:00 PM',
    action: 'Trip Completed',
    bookingId: 'DM-PHC-8924',
    detail: 'Barrister Alagba completed safe drive to Trans-Amadi Gardens. Keys returned.',
    actor: 'Chauffeur',
  },
];

// Local storage helper
export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) return INITIAL_BOOKINGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKINGS;
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  } catch (err) {
    console.warn('Failed to save bookings to localStorage', err);
  }
}

export function loadLogs(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) return INITIAL_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_LOGS;
  } catch {
    return INITIAL_LOGS;
  }
}

export function saveLogs(logs: ActivityLogItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.warn('Failed to save logs to localStorage', err);
  }
}

export function loadIncidents(): IncidentReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INCIDENTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveIncidents(incidents: IncidentReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
  } catch (err) {
    console.warn('Failed to save incidents to localStorage', err);
  }
}

export function resetDemoData(): { bookings: Booking[]; logs: ActivityLogItem[] } {
  localStorage.removeItem(STORAGE_KEY_BOOKINGS);
  localStorage.removeItem(STORAGE_KEY_LOGS);
  localStorage.removeItem(STORAGE_KEY_INCIDENTS);
  return { bookings: INITIAL_BOOKINGS, logs: INITIAL_LOGS };
}

export const STORAGE_KEY_SAVED_VEHICLE = 'drivemate_saved_vehicle_v1';
export const STORAGE_KEY_SAVED_USER = 'drivemate_saved_user_v1';

export function loadSavedVehicle(): Vehicle {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_VEHICLE);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    make: 'Toyota',
    model: 'Camry',
    color: 'Silver',
    registrationNumber: 'PHC 456 AA',
    transmission: 'Automatic',
    keyType: 'Keyless Push-Start',
  };
}

export function saveSavedVehicle(vehicle: Vehicle): void {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_VEHICLE, JSON.stringify(vehicle));
  } catch {}
}

export function loadSavedUser(): { name: string; phone: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    name: 'Emeka Okonkwo',
    phone: '0803 123 4567',
  };
}

export function saveSavedUser(user: { name: string; phone: string }): void {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_USER, JSON.stringify(user));
  } catch {}
}

