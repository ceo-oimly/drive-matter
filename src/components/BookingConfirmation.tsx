import React, { useState } from 'react';
import { Booking } from '../types';
import { RoutePreviewMap } from './RoutePreviewMap';
import { DEMO_DRIVERS } from '../services/bookingStore';
import {
  CheckCircle2,
  Clock,
  Car,
  MapPin,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  Home,
  Copy,
  Check,
  Award,
  Users,
  AlertCircle,
  Phone,
  Edit3,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface BookingConfirmationProps {
  booking: Booking;
  onTrackBooking: () => void;
  onOpenOps: () => void;
  onGoHome: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onTrackBooking,
  onOpenOps,
  onGoHome,
}) => {
  const [copied, setCopied] = useState(false);
  const assignedDriver = DEMO_DRIVERS[0]; // Tunde Adebayo

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-4 animate-fade-in">
      {/* Top Breadcrumb Header (from Mockup 1) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 text-xs font-bold text-[#101B2D] hover:text-[#19A974] transition-colors"
        >
          <span>←</span>
          <span>Active Trip Tracking</span>
        </button>
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
          EO
        </div>
      </div>

      {/* Demo Prototype Operational Window Notice Banner (from Mockup 1) */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-white border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-[#101B2D]">Demo Prototype Operational Window</h4>
          <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
            Carefully review your designated driver trip details before finalising. You keep your vehicle; our vetted driver safely taxis your car.
          </p>
        </div>
      </div>

      {/* Reference Banner (from Mockup 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">REF ID:</span>
          <span className="font-mono text-sm font-extrabold text-[#101B2D]">
            {booking.id}
          </span>
          <button
            onClick={handleCopyRef}
            title="Copy reference code"
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#19A974]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <span className="text-[11px] font-bold text-[#19A974] bg-[#E8F8F2] px-2.5 py-1 rounded-full border border-[#19A974]/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#19A974] animate-pulse" />
          Ready to lock
        </span>
      </div>

      {/* Corridor Map Box (from Mockup 1) */}
      <RoutePreviewMap
        origin={booking.eventVenue || booking.pickupAddress}
        destination={booking.destinationAddress}
        distanceKm={booking.distanceKm}
        durationMins={booking.durationMins}
      />

      {/* TRIP PARAMETERS (from Mockup 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            TRIP PARAMETERS
          </span>
          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Port Harcourt Hub
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              PICKUP LOCATION
            </span>
            <p className="font-bold text-[#101B2D] text-sm mt-0.5">
              {booking.eventVenue || 'Genesis Sky Bar'}
            </p>
            <p className="text-slate-500 text-[11px]">{booking.pickupAddress}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              DESTINATION
            </span>
            <p className="font-bold text-[#101B2D] text-sm mt-0.5">
              {booking.destinationAddress}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              SCHEDULED DEPARTURE
            </span>
            <p className="font-bold text-[#101B2D] text-xs mt-0.5">
              {booking.bookingTime}
            </p>
          </div>

          <div className="bg-[#E8F8F2] text-[#19A974] p-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-2 border border-[#19A974]/20">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Driver arrives 15 minutes prior for vehicle inspection & handover.</span>
          </div>
        </div>
      </div>

      {/* CLIENT VEHICLE & CONTACT (from Mockup 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs text-xs">
        <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] border-b border-slate-100 pb-2 block">
          CLIENT VEHICLE & CONTACT
        </span>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              VEHICLE MAKE & MODEL
            </span>
            <p className="font-bold text-[#101B2D] mt-0.5">
              {booking.vehicle.make} {booking.vehicle.model}
            </p>
            <p className="text-slate-500 text-[11px]">{booking.vehicle.color}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              PLATE / REGISTRATION
            </span>
            <p className="font-mono font-bold text-[#101B2D] mt-0.5">
              {booking.vehicle.registrationNumber}
            </p>
            <span className="text-[10px] text-[#19A974] font-semibold">
              ✓ Verified Record
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              TRANSMISSION
            </span>
            <p className="font-bold text-[#101B2D] mt-0.5">
              {booking.vehicle.transmission} (AT)
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              PASSENGERS
            </span>
            <p className="font-bold text-[#101B2D] mt-0.5">
              {booking.passengerCount} (Excl. Driver)
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-[#101B2D]">{booking.customerName}</span>
          <span className="font-mono text-slate-600">{booking.customerPhone}</span>
        </div>
      </div>

      {/* DRIVER STANDARDS OBLIGATION (from Mockup 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src={assignedDriver.photo}
            alt={assignedDriver.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
          />
          <div className="text-xs">
            <span className="font-bold text-[#101B2D] block">
              Trained Designated Specialist
            </span>
            <p className="text-[11px] text-slate-500">
              Executive Sedan & SUV Specialist · GRA Phase 2 Node
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-[#19A974] bg-[#E8F8F2] px-2.5 py-1 rounded-full border border-[#19A974]/30 shrink-0">
          Class E Officer
        </span>
      </div>

      {/* PRICING BREAKDOWN (from Mockup 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            PRICING BREAKDOWN
          </span>
          <span className="text-[10px] text-slate-400">Illustrative Demo Rate</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-base text-[#101B2D]">Total Estimate</span>
          <span className="font-mono text-xl font-extrabold text-[#19A974]">
            ₦8,500 <span className="text-xs font-normal text-slate-500">NGN (Demo)</span>
          </span>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-slate-600">
          <div className="flex justify-between">
            <span>Base dispatch fee (GRA Zone 1):</span>
            <span className="font-mono font-semibold text-slate-800">₦3,500</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated route transit (~14 km):</span>
            <span className="font-mono font-semibold text-slate-800">₦3,000</span>
          </div>
          <div className="flex justify-between">
            <span>Late-night driver return allowance:</span>
            <span className="font-mono font-semibold text-slate-800">₦2,000</span>
          </div>
        </div>
      </div>

      {/* PILOT PHASE NOTICE & GUARANTEE (from Mockup 1) */}
      <div className="bg-[#F7F8FA] border border-slate-200 rounded-2xl p-4 text-[11px] text-slate-600 space-y-2">
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <p>
            <strong>Pilot Phase Notice:</strong> Final commercial pricing and electronic settlement will be activated during the official launch. No card or payment is required for this demo trial.
          </p>
        </div>
        <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#19A974] shrink-0 mt-0.5" />
          <p>
            <strong>Flexible Cancellation Guarantee:</strong> Free cancellation up to 30 minutes before the scheduled pickup time.
          </p>
        </div>
      </div>

      {/* Actions (from Mockup 1) */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={onTrackBooking}
          className="w-full py-4 px-6 bg-[#19A974] hover:bg-[#159364] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#19A974]/30 flex items-center justify-center gap-2 transition-all min-h-[48px] active:scale-[0.99]"
        >
          <span>● Confirm Demo Booking</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-6 pt-1 text-xs">
          <button
            onClick={onTrackBooking}
            className="text-slate-600 hover:text-[#19A974] font-semibold flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify Details</span>
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={onGoHome}
            className="text-slate-600 hover:text-[#19A974] font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
