/**
 * Core domain types for DriveMate Designated Driver Booking MVP
 */

export type BookingStatus =
  | 'request_submitted'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'handover_completed'
  | 'trip_started'
  | 'trip_completed'
  | 'cancelled';

export interface DriverReview {
  id: string;
  author: string;
  eventType: string;
  date: string;
  rating: number;
  text: string;
}

export interface Driver {
  id: string;
  name: string;
  photo: string;
  phone: string;
  rating: number;
  tripsCount: number;
  yearsExperience: number;
  licenceCategory: string;
  badgeNumber: string;
  currentZone: string;
  availabilityStatus: 'available' | 'assigned' | 'off_duty';
  bio: string;
  languages: string[];
  reviews: DriverReview[];
}

export interface Vehicle {
  make: string;
  model: string;
  color: string;
  registrationNumber: string;
  transmission: 'Automatic' | 'Manual';
  keyType: 'Keyless Push-Start' | 'Traditional Blade Key';
}

export interface HandoverChecklist {
  driverIdentityVerified: boolean;
  securityPinConfirmed: boolean;
  walkaroundCompleted: boolean;
  fuelAndOdometerRecorded: boolean;
  keyHandedOver: boolean;
  handoverPin: string;
  verifiedAt?: string;
  notes?: string;
}

export interface BookingPricing {
  baseBookingFee: number;
  distanceFare: number;
  lateNightSafetyAllowance: number;
  totalEstimatedFare: number;
  currency: string;
}

export interface StatusTimelineEvent {
  status: BookingStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  destinationAddress: string;
  eventVenue: string;
  bookingTime: string;
  isImmediate: boolean;
  passengerCount: number;
  vehicle: Vehicle;
  distanceKm: number;
  durationMins: number;
  pricing: BookingPricing;
  status: BookingStatus;
  assignedDriverId?: string;
  handoverChecklist: HandoverChecklist;
  cancellationReason?: string;
  cancelledAt?: string;
  timeline: StatusTimelineEvent[];
}

export interface IncidentReport {
  id: string;
  createdAt: string;
  bookingId?: string;
  category: 'driver_conduct' | 'vehicle_condition' | 'lost_item' | 'safety_handover' | 'other';
  severity: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  contactEmailOrPhone: string;
  status: 'received' | 'investigating' | 'resolved';
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: string;
  bookingId: string;
  detail: string;
  actor: 'Customer' | 'Chauffeur' | 'Operations Desk';
}
