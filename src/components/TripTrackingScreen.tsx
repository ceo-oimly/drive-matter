import React from 'react';
import { Booking, Driver } from '../types';
import { RoutePreviewMap } from './RoutePreviewMap';
import {
  Car,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Navigation,
} from 'lucide-react';

interface TripTrackingScreenProps {
  booking: Booking;
  driver: Driver;
  onArriveDestination: () => void;
}

export const TripTrackingScreen: React.FC<TripTrackingScreenProps> = ({
  booking,
  driver,
  onArriveDestination,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {booking.id}
          </span>
          <span className="text-xs font-extrabold text-[#0E1626]">· Trip In Transit</span>
        </div>

        <a
          href="tel:08003748362"
          className="text-xs font-bold text-[#0E1626] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors min-h-[36px]"
        >
          <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Support Desk</span>
        </a>
      </div>

      {/* Live Trip Status Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A]">
              Trip in Transit
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            ~8 mins remaining
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-[#0E1626] leading-tight">
          Chauffeur driving your vehicle to destination
        </h2>

        {/* Minimal Progress Line */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <div className="bg-[#16A34A] h-full rounded-full w-3/4 transition-all" />
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          En route to <strong>{booking.destinationAddress}</strong>. Relax in the passenger seat while {driver.name} navigates your vehicle safely home.
        </p>
      </div>

      {/* Driver & Vehicle Quick Summary */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={driver.photo}
            alt={driver.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-[#0E1626] truncate">
              {driver.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Badge: {driver.badgeNumber}
            </p>
            <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
              Driving your {booking.vehicle.color} {booking.vehicle.make}
            </p>
          </div>
        </div>

        <a
          href={`tel:${driver.phone}`}
          className="p-3 bg-slate-50 hover:bg-slate-100 text-[#0E1626] border border-slate-200 rounded-xl flex items-center justify-center transition-colors shrink-0"
          title="Call Chauffeur"
        >
          <Phone className="w-4 h-4 text-[#16A34A]" />
        </a>
      </div>

      {/* Route Corridor Map */}
      <RoutePreviewMap
        origin={booking.eventVenue || booking.pickupAddress}
        destination={booking.destinationAddress}
        distanceKm={booking.distanceKm}
        durationMins={booking.durationMins}
        statusText="Corridor Active — Vehicle Driving Home"
      />

      {/* Simulated Arrival Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onArriveDestination}
          className="w-full py-4 px-6 bg-[#B4F34C] hover:bg-[#A3E635] active:bg-[#8FD624] text-[#080D17] font-extrabold text-base rounded-full shadow-sm flex items-center justify-center gap-2.5 transition-all btn-press cursor-pointer min-h-[54px]"
        >
          <span>Simulate Arrival & Key Return</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Honest Prototype Notice */}
      <p className="text-center text-[11px] text-slate-400">
        Simulated Trip Demonstration · Tap the button above to test safe arrival and key return.
      </p>
    </div>
  );
};
