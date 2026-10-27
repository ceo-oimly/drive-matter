import React, { useState, useEffect } from 'react';
import { Booking, Vehicle } from '../types';
import {
  calculateDemoPricing,
  POPULAR_VENUES,
  COMMON_DESTINATIONS,
  loadSavedVehicle,
  saveSavedVehicle,
  loadSavedUser,
  saveSavedUser,
} from '../services/bookingStore';
import {
  Car,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  Crosshair,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface BookingFormProps {
  initialPickup?: string;
  initialDestination?: string;
  initialVenue?: string;
  onSubmitSuccess: (newBooking: Booking) => void;
  onCancel: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialPickup = '',
  initialDestination = '',
  initialVenue = '',
  onSubmitSuccess,
  onCancel,
}) => {
  // Saved vehicle & user from local storage
  const [vehicle, setVehicle] = useState<Vehicle>(() => loadSavedVehicle());
  const [showVehicleEdit, setShowVehicleEdit] = useState(false);
  const [userName, setUserName] = useState(() => loadSavedUser().name);
  const [userPhone, setUserPhone] = useState(() => loadSavedUser().phone);
  const [showContactEdit, setShowContactEdit] = useState(false);

  // Route State
  const [pickup, setPickup] = useState(
    initialPickup || initialVenue || 'Genesis Centre, Tombia St, GRA Phase 2'
  );
  const [destination, setDestination] = useState(
    initialDestination || '14 Peter Odili Road, Port Harcourt'
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  // Timing
  const [timingOption, setTimingOption] = useState<'now' | 'scheduled'>('now');
  const [scheduledHour, setScheduledHour] = useState('22:30');

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Fixed transparent demo pricing
  const distanceKm = 11.6;
  const pricing = calculateDemoPricing(distanceKm);

  // Handle browser Geolocation
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setLocationSuccess(false);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setLocationSuccess(true);
          setPickup('Genesis Centre, Tombia St, GRA Phase 2 (Current Location)');
        },
        () => {
          // Fallback gracefully without frustrating the user
          setIsLocating(false);
          setLocationSuccess(true);
          setPickup('Genesis Centre, Tombia St, GRA Phase 2 (Current Venue)');
        },
        { timeout: 4000 }
      );
    } else {
      setIsLocating(false);
      setPickup('Genesis Centre, Tombia St, GRA Phase 2 (Current Venue)');
      setLocationSuccess(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim()) {
      setFormError('Please enter or select your pickup location.');
      return;
    }
    if (!destination.trim()) {
      setFormError('Please enter or select where you want to be driven home.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    // Save vehicle & user for frictionless future re-use
    saveSavedVehicle(vehicle);
    saveSavedUser({ name: userName, phone: userPhone });

    // Generate random 4-digit PIN for handover
    const randomPin = String(Math.floor(1000 + Math.random() * 9000));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `DM-PHC-${randomSuffix}`;

    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBooking: Booking = {
      id: bookingId,
      createdAt: now.toISOString(),
      customerName: userName.trim() || 'Valued Client',
      customerPhone: userPhone.trim() || '+234 803 123 4567',
      eventVenue: pickup.includes(',') ? pickup.split(',')[0].trim() : 'Event Venue',
      pickupAddress: pickup.trim(),
      destinationAddress: destination.trim(),
      bookingTime: timingOption === 'now' ? 'Immediate (~15-20 mins)' : `Tonight, ${scheduledHour}`,
      isImmediate: timingOption === 'now',
      passengerCount: 2,
      vehicle: {
        make: vehicle.make.trim() || 'Toyota',
        model: vehicle.model.trim() || 'Camry',
        color: vehicle.color.trim() || 'Silver',
        registrationNumber: vehicle.registrationNumber.trim() || 'PHC 456 AA',
        transmission: vehicle.transmission,
        keyType: vehicle.keyType,
      },
      distanceKm,
      durationMins: 22,
      pricing: {
        baseBookingFee: pricing.baseBookingFee,
        distanceFare: pricing.distanceFare,
        lateNightSafetyAllowance: pricing.lateNightSafetyAllowance,
        totalEstimatedFare: pricing.totalEstimatedFare,
        currency: '₦',
      },
      status: 'request_submitted',
      handoverChecklist: {
        driverIdentityVerified: false,
        securityPinConfirmed: false,
        walkaroundCompleted: false,
        fuelAndOdometerRecorded: false,
        keyHandedOver: false,
        handoverPin: randomPin,
      },
      timeline: [
        {
          status: 'request_submitted',
          label: 'Driver Request Received',
          timestamp: `${timeFormatted} PM`,
          note: 'Booking submitted and matching with nearest vetted chauffeur.',
        },
      ],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(newBooking);
    }, 450);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-5 pb-24 space-y-5 animate-fade-in text-[#101B2D]">
      {/* Top Bar with Assisted Booking Callout */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#101B2D] -ml-1 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs font-extrabold text-[#101B2D]">
          Quick Driver Booking
        </span>

        <a
          href="tel:08003748362"
          className="px-2.5 py-1 text-[11px] font-bold text-[#19A974] bg-[#19A974]/10 hover:bg-[#19A974]/20 rounded-lg border border-[#19A974]/20 flex items-center gap-1 transition-colors"
        >
          <Phone className="w-3 h-3" />
          <span>Call Dispatch</span>
        </a>
      </div>

      {/* Prominent Assisted Booking Banner (Helpful for impaired/tired guests) */}
      <div className="bg-[#19A974]/10 border border-[#19A974]/25 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#19A974] text-white flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#101B2D]">Need help booking?</p>
            <p className="text-slate-600 text-[11px]">
              Call <strong>0800-DRIVEMATE</strong> for phone-assisted booking
            </p>
          </div>
        </div>

        <a
          href="tel:08003748362"
          className="px-3 py-1.5 bg-[#19A974] hover:bg-[#159364] text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-xs"
        >
          Call Now
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* 1. PICKUP LOCATION */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#19A974]" />
              <span>1. Where is your car now? (Pickup)</span>
            </label>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="text-[11px] font-bold text-[#19A974] hover:underline flex items-center gap-1"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : locationSuccess ? 'Location Set' : 'Use Current Location'}</span>
            </button>
          </div>

          <input
            type="text"
            required
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="e.g. Genesis Sky Bar, GRA Phase 2"
            className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3.5 py-3 text-sm text-[#101B2D] font-medium placeholder-slate-400 focus:outline-none focus:border-[#19A974] focus:bg-white transition-all"
          />

          {/* Quick 1-Tap Pickup Venue Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {[
              'Genesis Sky Bar, GRA',
              'Hotel Presidential',
              'Polo Club, Old GRA',
              'The Glass House',
            ].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setPickup(v)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors min-h-[32px] ${
                  pickup.includes(v.split(',')[0])
                    ? 'bg-[#19A974] text-white border-[#19A974]'
                    : 'bg-[#F7F8FA] hover:bg-slate-100 text-slate-700 border-[#E2E8F0]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* 2. DESTINATION */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-2.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>2. Where should we drive you? (Destination)</span>
          </label>

          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Home, 14 Peter Odili Road"
            className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3.5 py-3 text-sm text-[#101B2D] font-medium placeholder-slate-400 focus:outline-none focus:border-[#19A974] focus:bg-white transition-all"
          />

          {/* Quick 1-Tap Destination Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {[
              '14 Peter Odili Road',
              'Woji Estate Gate',
              'Old GRA',
              'Trans-Amadi',
            ].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDestination(d)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors min-h-[32px] ${
                  destination.includes(d)
                    ? 'bg-[#19A974] text-white border-[#19A974]'
                    : 'bg-[#F7F8FA] hover:bg-slate-100 text-slate-700 border-[#E2E8F0]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* 3. YOUR VEHICLE (Re-used from local storage with 1-tap edit) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-[#19A974]" />
              <span>3. Vehicle to be Driven</span>
            </span>

            <button
              type="button"
              onClick={() => setShowVehicleEdit(!showVehicleEdit)}
              className="text-[11px] font-bold text-[#19A974] hover:underline"
            >
              {showVehicleEdit ? 'Save / Done' : 'Change Car'}
            </button>
          </div>

          {/* Compact Saved Vehicle Display Card */}
          <div className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0">
                <Car className="w-4 h-4 text-[#19A974]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#101B2D]">
                  {vehicle.color} {vehicle.make} {vehicle.model}
                </p>
                <p className="text-[11px] font-mono font-semibold text-[#19A974]">
                  {vehicle.registrationNumber} · {vehicle.transmission}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
              Owner-Driven
            </span>
          </div>

          {/* Expandable Simple Vehicle Editor if user needs to switch cars */}
          {showVehicleEdit && (
            <div className="pt-2 border-t border-[#E2E8F0] space-y-3 animate-fade-in text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Make & Model</label>
                  <input
                    type="text"
                    value={`${vehicle.make} ${vehicle.model}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(' ');
                      setVehicle({
                        ...vehicle,
                        make: parts[0] || '',
                        model: parts.slice(1).join(' ') || '',
                      });
                    }}
                    placeholder="e.g. Toyota Camry"
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Plate Number</label>
                  <input
                    type="text"
                    value={vehicle.registrationNumber}
                    onChange={(e) => setVehicle({ ...vehicle, registrationNumber: e.target.value })}
                    placeholder="e.g. PHC 456 AA"
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* Transmission 1-Tap Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Transmission</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Automatic', 'Manual'] as const).map((trans) => (
                    <button
                      key={trans}
                      type="button"
                      onClick={() => setVehicle({ ...vehicle, transmission: trans })}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition-colors ${
                        vehicle.transmission === trans
                          ? 'bg-[#19A974] text-white border-[#19A974]'
                          : 'bg-[#F7F8FA] text-slate-700 border-[#E2E8F0]'
                      }`}
                    >
                      {trans} Transmission
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. TIMING & CONTACT SHORTCUT */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#19A974]" />
              <span>4. Pickup Timing</span>
            </span>

            <button
              type="button"
              onClick={() => setShowContactEdit(!showContactEdit)}
              className="text-[11px] font-semibold text-slate-500 hover:text-[#101B2D]"
            >
              Contact: {userName.split(' ')[0]} ({userPhone.slice(-4)})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTimingOption('now')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs border text-left transition-all ${
                timingOption === 'now'
                  ? 'bg-[#19A974] text-white border-[#19A974] shadow-xs'
                  : 'bg-[#F7F8FA] text-slate-700 border-[#E2E8F0]'
              }`}
            >
              <span className="block">Now (Immediate)</span>
              <span className={`text-[10px] block font-normal ${timingOption === 'now' ? 'text-white/80' : 'text-slate-500'}`}>
                Driver arrives in ~15-20m
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTimingOption('scheduled')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs border text-left transition-all ${
                timingOption === 'scheduled'
                  ? 'bg-[#19A974] text-white border-[#19A974] shadow-xs'
                  : 'bg-[#F7F8FA] text-slate-700 border-[#E2E8F0]'
              }`}
            >
              <span className="block">Later Tonight</span>
              <span className={`text-[10px] block font-normal ${timingOption === 'scheduled' ? 'text-white/80' : 'text-slate-500'}`}>
                Pick departure time
              </span>
            </button>
          </div>

          {/* Optional inline contact editor */}
          {showContactEdit && (
            <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 animate-fade-in text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* 5. REVIEW AND CONFIRM (Combined Together - No extra confirmation screens!) */}
        <div className="bg-white border-2 border-[#19A974]/30 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                TRIP & PRICE ESTIMATE
              </span>
              <p className="text-xs font-bold text-[#101B2D] mt-0.5">
                ~11.6 km route · Est. 22 mins travel time
              </p>
            </div>

            <div className="text-right">
              <span className="text-lg font-black text-[#19A974] font-mono block">
                ₦8,500
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Fixed Demo Rate
              </span>
            </div>
          </div>

          {/* Safety Rule Note */}
          <div className="bg-[#F7F8FA] p-3 rounded-xl text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-[#101B2D] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Vehicle Release PIN Handover</span>
            </p>
            <p>
              After confirmation, you'll receive a 4-digit PIN. Only give this PIN to your driver after verifying their physical ID at your car.
            </p>
          </div>

          {/* ONE DOMINANT CLEAR CTA: "Confirm driver request" */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-[#19A974] hover:bg-[#159364] active:scale-[0.99] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-[#19A974]/25 flex items-center justify-center gap-2 transition-all min-h-[56px] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Submitting Request...</span>
            ) : (
              <>
                <span>Confirm driver request</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            No card or payment required for this demo. Free cancellation anytime.
          </p>
        </div>
      </form>
    </div>
  );
};
