/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Booking,
  BookingStatus,
  Driver,
  ActivityLogItem,
  Vehicle,
} from './types';
import {
  loadBookings,
  saveBookings,
  loadLogs,
  saveLogs,
  DEMO_DRIVERS,
  loadSavedVehicle,
} from './services/bookingStore';

import { DemoDisclaimerBanner } from './components/DemoDisclaimerBanner';
import { CustomerHome } from './components/CustomerHome';
import { EnterDestinationScreen } from './components/EnterDestinationScreen';
import { ChooseDriverScreen } from './components/ChooseDriverScreen';
import { ConfirmBookingScreen } from './components/ConfirmBookingScreen';
import { HandoverScreen } from './components/HandoverScreen';
import { TripTrackingScreen } from './components/TripTrackingScreen';
import { TripCompletedScreen } from './components/TripCompletedScreen';
import { SafetyCentre } from './components/SafetyCentre';
import { DriverProfileModal } from './components/DriverProfileModal';

import {
  ShieldCheck,
  Home,
  PlusCircle,
  Clock,
  Phone,
  CheckCircle2,
  Car,
  KeyRound,
  Zap,
} from 'lucide-react';

type ScreenView =
  | 'home'
  | 'enter_destination'
  | 'choose_driver'
  | 'confirm_booking'
  | 'handover'
  | 'trip_tracking'
  | 'trip_completed'
  | 'safety';

const SCREEN_STORAGE_KEY = 'drivemate_current_screen_v1';
const DRAFT_STORAGE_KEY = 'drivemate_booking_draft_v1';
const VALID_SCREENS: ScreenView[] = [
  'home',
  'enter_destination',
  'choose_driver',
  'confirm_booking',
  'handover',
  'trip_tracking',
  'trip_completed',
  'safety',
];

function readSavedScreen(): ScreenView {
  try {
    const saved = localStorage.getItem(SCREEN_STORAGE_KEY) as ScreenView | null;
    return saved && VALID_SCREENS.includes(saved) ? saved : 'home';
  } catch {
    return 'home';
  }
}

function readSavedDraft(fallback: {
  pickup: string;
  destination: string;
  vehicle: Vehicle;
  driver?: Driver;
  quotedPrice: number;
  etaMins: number;
}) {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw);
    return {
      ...fallback,
      ...saved,
      vehicle:
        saved.vehicle && typeof saved.vehicle === 'object'
          ? saved.vehicle
          : fallback.vehicle,
      driver:
        saved.driver && typeof saved.driver === 'object'
          ? saved.driver
          : fallback.driver,
    };
  } catch {
    return fallback;
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>(readSavedScreen);
  const [bookings, setBookings] = useState<Booking[]>(() => loadBookings());
  const [logs, setLogs] = useState<ActivityLogItem[]>(() => loadLogs());

  // Active / Selected booking id
  const [selectedBookingId, setSelectedBookingId] = useState<string>(() => {
    const initial = loadBookings();
    return initial[0]?.id || '';
  });

  // Draft state for in-progress customer booking
  const [bookingDraft, setBookingDraft] = useState<{
    pickup: string;
    destination: string;
    vehicle: Vehicle;
    driver?: Driver;
    quotedPrice: number;
    etaMins: number;
  }>(() =>
    readSavedDraft({
      pickup: 'Genesis Sky Bar, GRA Phase 2',
      destination: '14 Peter Odili Road, Port Harcourt',
      vehicle: loadSavedVehicle(),
      driver: DEMO_DRIVERS[0],
      quotedPrice: 8500,
      etaMins: 8,
    })
  );

  // Modal inspection state
  const [inspectingDriver, setInspectingDriver] = useState<Driver | null>(null);

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist current screen and draft
  useEffect(() => {
    try {
      localStorage.setItem(SCREEN_STORAGE_KEY, currentScreen);
    } catch (error) {
      console.warn('DriveMate could not save the current screen.', error);
    }
  }, [currentScreen]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(bookingDraft));
    } catch (error) {
      console.warn('DriveMate could not save the booking draft.', error);
    }
  }, [bookingDraft]);

  // Sync to localStorage
  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  // Active selected booking lookup
  const currentBooking =
    bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== 'trip_completed' && b.status !== 'cancelled'
  ).length;

  const appendLog = (
    action: string,
    bookingId: string,
    detail: string,
    actor: 'Customer' | 'Chauffeur' | 'Operations Desk'
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      action,
      bookingId,
      detail,
      actor,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Step 1 -> Step 2: Customer taps "Get me a driver"
  const handleStartBooking = () => {
    setCurrentScreen('enter_destination');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 -> Step 3: Customer enters destination & taps "Find drivers"
  const handleProceedToDrivers = (params: {
    pickup: string;
    destination: string;
    vehicle: Vehicle;
  }) => {
    setBookingDraft((prev) => ({
      ...prev,
      pickup: params.pickup,
      destination: params.destination,
      vehicle: params.vehicle,
    }));
    setCurrentScreen('choose_driver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 -> Step 4: Customer chooses a driver
  const handleSelectDriver = (
    driver: Driver,
    quotedPrice: number,
    etaMins: number
  ) => {
    setBookingDraft((prev) => ({
      ...prev,
      driver,
      quotedPrice,
      etaMins,
    }));
    setCurrentScreen('confirm_booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 4 -> Step 5: Customer confirms booking
  const handleConfirmBooking = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    setSelectedBookingId(newBooking.id);
    appendLog(
      'Booking Request Created',
      newBooking.id,
      `${newBooking.customerName} requested designated chauffeur for ${newBooking.vehicle.make} ${newBooking.vehicle.model}.`,
      'Customer'
    );
    showToast(`Booking ${newBooking.id} secured! Driver assigned.`);
    setCurrentScreen('handover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 5 -> Step 6: Customer completes key handover & starts trip
  const handleStartTrip = () => {
    if (!currentBooking) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated = bookings.map((b) => {
      if (b.id === currentBooking.id) {
        return {
          ...b,
          status: 'trip_started' as BookingStatus,
          handoverChecklist: {
            ...b.handoverChecklist,
            keyHandedOver: true,
            driverIdentityVerified: true,
            securityPinConfirmed: true,
            verifiedAt: timeStr,
          },
          timeline: [
            ...b.timeline,
            {
              status: 'trip_started' as BookingStatus,
              label: 'Trip Started & Keys Handed Over',
              timestamp: timeStr,
              note: 'Keys transferred safely to chauffeur. Trip in transit.',
            },
          ],
        };
      }
      return b;
    });

    setBookings(updated);
    appendLog(
      'Trip Started',
      currentBooking.id,
      'Keys safely transferred to chauffeur. Trip in transit.',
      'Customer'
    );
    showToast('Keys transferred safely! Trip in progress.');
    setCurrentScreen('trip_tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 6 -> Step 7: Chauffeur arrives at destination
  const handleArriveDestination = () => {
    if (!currentBooking) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated = bookings.map((b) => {
      if (b.id === currentBooking.id) {
        return {
          ...b,
          status: 'trip_completed' as BookingStatus,
          timeline: [
            ...b.timeline,
            {
              status: 'trip_completed' as BookingStatus,
              label: 'Trip Completed & Keys Returned',
              timestamp: timeStr,
              note: 'Vehicle parked safely and keys returned directly to owner.',
            },
          ],
        };
      }
      return b;
    });

    setBookings(updated);
    appendLog(
      'Trip Completed',
      currentBooking.id,
      'Vehicle parked safely and keys returned to owner.',
      'Chauffeur'
    );
    showToast('Arrived safely! Keys returned to owner.');
    setCurrentScreen('trip_completed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 7 -> Home: Customer finishes
  const handleFinishAndHome = () => {
    setCurrentScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel booking handler
  const handleCancelBooking = (reason: string) => {
    if (!currentBooking) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated = bookings.map((b) => {
      if (b.id === currentBooking.id) {
        return {
          ...b,
          status: 'cancelled' as BookingStatus,
          cancellationReason: reason,
          cancelledAt: timeStr,
          timeline: [
            ...b.timeline,
            {
              status: 'cancelled' as BookingStatus,
              label: 'Booking Cancelled',
              timestamp: timeStr,
              note: `Reason: ${reason}`,
            },
          ],
        };
      }
      return b;
    });

    setBookings(updated);
    appendLog(
      'Booking Cancelled',
      currentBooking.id,
      `Cancelled: ${reason}`,
      'Customer'
    );
    showToast('Booking cancelled.');
    setCurrentScreen('home');
  };

  // Route back to active trip screen
  const handleTrackActiveTrip = (booking: Booking) => {
    setSelectedBookingId(booking.id);
    if (booking.status === 'trip_completed') {
      setCurrentScreen('trip_completed');
    } else if (booking.status === 'trip_started') {
      setCurrentScreen('trip_tracking');
    } else {
      setCurrentScreen('handover');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active driver lookup for handover/tracking
  const activeDriver =
    (currentBooking?.assignedDriverId &&
      DEMO_DRIVERS.find((d) => d.id === currentBooking.assignedDriverId)) ||
    bookingDraft.driver ||
    DEMO_DRIVERS[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0E1626] flex flex-col selection:bg-[#22C55E] selection:text-white">
      {/* Disclaimer Banner */}
      <DemoDisclaimerBanner />

      {/* Clean White Brand Header Matching Reference */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo & Wordmark */}
          <button
            type="button"
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2.5 text-left shrink-0 group min-h-[44px] cursor-pointer"
          >
            {/* Distinctive green speed/steering icon badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0E1626] group-hover:text-[#16A34A] transition-colors">
              DriveMate
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setCurrentScreen('home')}
              className={`py-2 transition-colors cursor-pointer relative ${
                currentScreen === 'home'
                  ? 'text-[#16A34A] font-bold'
                  : 'text-slate-600 hover:text-[#0E1626]'
              }`}
            >
              <span>Home</span>
              {currentScreen === 'home' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#16A34A] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={handleStartBooking}
              className={`py-2 transition-colors cursor-pointer relative ${
                currentScreen === 'enter_destination' ||
                currentScreen === 'choose_driver' ||
                currentScreen === 'confirm_booking'
                  ? 'text-[#16A34A] font-bold'
                  : 'text-slate-600 hover:text-[#0E1626]'
              }`}
            >
              <span>Book a Driver</span>
              {(currentScreen === 'enter_destination' ||
                currentScreen === 'choose_driver' ||
                currentScreen === 'confirm_booking') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#16A34A] rounded-full" />
              )}
            </button>

            {activeBookingsCount > 0 && (
              <button
                type="button"
                onClick={() => handleTrackActiveTrip(currentBooking)}
                className={`py-2 transition-colors cursor-pointer flex items-center gap-2 relative ${
                  currentScreen === 'handover' ||
                  currentScreen === 'trip_tracking' ||
                  currentScreen === 'trip_completed'
                    ? 'text-[#16A34A] font-bold'
                    : 'text-slate-600 hover:text-[#0E1626]'
                }`}
              >
                <span>Active Trip</span>
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentScreen('safety')}
              className={`py-2 transition-colors cursor-pointer relative ${
                currentScreen === 'safety'
                  ? 'text-[#16A34A] font-bold'
                  : 'text-slate-600 hover:text-[#0E1626]'
              }`}
            >
              <span>Safety Guide</span>
              {currentScreen === 'safety' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#16A34A] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right: Phone Hotline (Exact match to reference) */}
          <div className="flex items-center gap-3">
            <a
              href="tel:08003748362"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#16A34A] transition-colors py-2 px-1 min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-slate-700" />
              <span>0800-DRIVEMATE</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {/* Screen 1: Home */}
        {currentScreen === 'home' && (
          <CustomerHome
            onStartBooking={handleStartBooking}
            onTrackBooking={handleTrackActiveTrip}
            activeBooking={
              activeBookingsCount > 0 && currentBooking?.status !== 'trip_completed'
                ? currentBooking
                : undefined
            }
          />
        )}

        {/* Screen 2: Enter Destination */}
        {currentScreen === 'enter_destination' && (
          <EnterDestinationScreen
            initialPickup={bookingDraft.pickup}
            initialDestination={bookingDraft.destination}
            onProceedToDrivers={handleProceedToDrivers}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {/* Screen 3: Choose Driver */}
        {currentScreen === 'choose_driver' && (
          <ChooseDriverScreen
            pickup={bookingDraft.pickup}
            destination={bookingDraft.destination}
            onSelectDriver={handleSelectDriver}
            onBack={() => setCurrentScreen('enter_destination')}
          />
        )}

        {/* Screen 4: Confirm Booking */}
        {currentScreen === 'confirm_booking' && bookingDraft.driver && (
          <ConfirmBookingScreen
            pickup={bookingDraft.pickup}
            destination={bookingDraft.destination}
            driver={bookingDraft.driver}
            quotedPrice={bookingDraft.quotedPrice}
            etaMins={bookingDraft.etaMins}
            vehicle={bookingDraft.vehicle}
            onConfirmSuccess={handleConfirmBooking}
            onBack={() => setCurrentScreen('choose_driver')}
          />
        )}

        {/* Screen 5: Handover & Pickup Code */}
        {currentScreen === 'handover' && currentBooking && (
          <HandoverScreen
            booking={currentBooking}
            driver={activeDriver}
            onStartTrip={handleStartTrip}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {/* Screen 6: Trip Tracking */}
        {currentScreen === 'trip_tracking' && currentBooking && (
          <TripTrackingScreen
            booking={currentBooking}
            driver={activeDriver}
            onArriveDestination={handleArriveDestination}
          />
        )}

        {/* Screen 7: Trip Completed */}
        {currentScreen === 'trip_completed' && currentBooking && (
          <TripCompletedScreen
            booking={currentBooking}
            driver={activeDriver}
            onFinishAndHome={handleFinishAndHome}
          />
        )}

        {/* Safety Guide Screen */}
        {currentScreen === 'safety' && <SafetyCentre />}
      </main>

      {/* Driver Profile Modal */}
      {inspectingDriver && (
        <DriverProfileModal
          driver={inspectingDriver}
          isOpen={!!inspectingDriver}
          onClose={() => setInspectingDriver(null)}
        />
      )}

      {/* Refined Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0E1626] border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Clean White Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center h-16 px-1 shadow-lg">
        <button
          type="button"
          onClick={() => {
            setCurrentScreen('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentScreen === 'home' ? 'text-[#16A34A] font-extrabold' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </button>

        <button
          type="button"
          onClick={handleStartBooking}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentScreen === 'enter_destination' ||
            currentScreen === 'choose_driver' ||
            currentScreen === 'confirm_booking'
              ? 'text-[#16A34A] font-extrabold'
              : 'text-slate-500'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Book</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (currentBooking) {
              handleTrackActiveTrip(currentBooking);
            } else {
              handleStartBooking();
            }
          }}
          className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentScreen === 'handover' ||
            currentScreen === 'trip_tracking' ||
            currentScreen === 'trip_completed'
              ? 'text-[#16A34A] font-extrabold'
              : 'text-slate-500'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Active Trip</span>
          {activeBookingsCount > 0 && (
            <span className="absolute top-2.5 right-4 w-2 h-2 rounded-full bg-[#22C55E]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentScreen('safety');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentScreen === 'safety' ? 'text-[#16A34A] font-extrabold' : 'text-slate-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Safety</span>
        </button>
      </nav>
    </div>
  );
}
