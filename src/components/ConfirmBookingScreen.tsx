import React, { useState } from 'react';
import { Booking, Driver, Vehicle } from '../types';
import { RoutePreviewMap } from './RoutePreviewMap';
import {
  ArrowLeft,
  MapPin,
  Car,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Loader2,
} from 'lucide-react';

interface ConfirmBookingScreenProps {
  pickup: string;
  destination: string;
  driver: Driver;
  quotedPrice: number;
  etaMins: number;
  vehicle: Vehicle;
  onConfirmSuccess: (booking: Booking) => void;
  onBack: () => void;
}

export const ConfirmBookingScreen: React.FC<ConfirmBookingScreenProps> = ({
  pickup,
  destination,
  driver,
  quotedPrice,
  etaMins,
  vehicle,
  onConfirmSuccess,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const randomPin = String(Math.floor(1000 + Math.random() * 9000));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `DM-PHC-${randomSuffix}`;

    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBooking: Booking = {
      id: bookingId,
      createdAt: now.toISOString(),
      customerName: 'Emeka Okonkwo',
      customerPhone: '+234 803 123 4567',
      eventVenue: pickup.includes(',') ? pickup.split(',')[0].trim() : 'Event Venue',
      pickupAddress: pickup,
      destinationAddress: destination,
      bookingTime: 'Immediate (~15-20 mins)',
      isImmediate: true,
      passengerCount: 2,
      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        registrationNumber: vehicle.registrationNumber,
        transmission: vehicle.transmission,
        keyType: vehicle.keyType,
      },
      distanceKm: 11.6,
      durationMins: 22,
      pricing: {
        baseBookingFee: 3500,
        distanceFare: 3000,
        lateNightSafetyAllowance: 2000,
        totalEstimatedFare: quotedPrice,
        currency: '₦',
      },
      status: 'driver_assigned',
      assignedDriverId: driver.id,
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
          label: 'Booking Request Submitted',
          timestamp: `${timeFormatted}`,
          note: `Selected designated driver ${driver.name}.`,
        },
        {
          status: 'driver_assigned',
          label: 'Driver Assigned (Prototype Simulation)',
          timestamp: `${timeFormatted}`,
          note: `${driver.name} accepted assignment and is dispatched to your vehicle.`,
        },
      ],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmSuccess(newBooking);
    }, 450);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0E1626] p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors min-h-[44px] disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Drivers</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0E1626]">
          <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-mono">
            3
          </span>
          <span>Review & Confirm</span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">Step 3 of 3</span>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#0E1626] uppercase tracking-wider">
            Booking Summary
          </h2>
          <span className="text-[11px] font-mono font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Immediate Dispatch
          </span>
        </div>

        {/* Route Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                Pickup Point (Your car)
              </span>
              <p className="font-bold text-[#0E1626] truncate">{pickup}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2.5 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B4F34C] border border-[#16A34A] mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                Destination
              </span>
              <p className="font-bold text-[#0E1626] truncate">{destination}</p>
            </div>
          </div>
        </div>

        {/* Assigned Driver Preview */}
        <div className="flex items-center justify-between gap-3 border border-slate-200 rounded-2xl p-3.5 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={driver.photo}
              alt={driver.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Selected Driver
              </span>
              <h3 className="text-sm font-extrabold text-[#0E1626] truncate">
                {driver.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {driver.badgeNumber} · ~{etaMins} mins away
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Quoted Fare
            </span>
            <span className="text-lg font-black text-[#0E1626] font-mono">
              ₦{quotedPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Customer Vehicle */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#16A34A]" />
            <span className="font-bold text-[#0E1626]">
              {vehicle.color} {vehicle.make} {vehicle.model}
            </span>
          </div>
          <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
            {vehicle.registrationNumber} · {vehicle.transmission}
          </span>
        </div>

        {/* Fare Breakdown Details */}
        <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px]">
            <span>Base Chauffeur Callout Fee:</span>
            <span className="font-mono">₦3,500</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>Distance Estimate (~11.6 km):</span>
            <span className="font-mono">₦3,000</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>Late Night / Weekend Safety Allowance:</span>
            <span className="font-mono">₦2,000</span>
          </div>
          <div className="flex items-center justify-between text-sm font-extrabold text-[#0E1626] pt-2 border-t border-slate-200">
            <span>Total Estimated Fare:</span>
            <span className="font-mono text-base text-[#16A34A] font-black">
              ₦{quotedPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Prototype Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Prototype Demo:</strong> Booking assigns a demo driver record. No live credit card charge or payment gateway is invoked.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-[#B4F34C] hover:bg-[#A3E635] active:bg-[#8FD624] text-[#080D17] font-extrabold text-base rounded-full shadow-sm flex items-center justify-center gap-2.5 transition-all btn-press cursor-pointer min-h-[54px] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#080D17]" />
                <span>Securing Chauffeur...</span>
              </>
            ) : (
              <>
                <span>Confirm booking</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Corridor Map Preview */}
      <RoutePreviewMap
        origin={pickup}
        destination={destination}
        distanceKm={11.6}
        durationMins={22}
      />
    </div>
  );
};
