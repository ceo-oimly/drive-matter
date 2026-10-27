import React from 'react';
import { Booking } from '../types';
import heroLagosChauffeur from '../assets/images/hero_lagos_chauffeur.jpg';
import {
  Car,
  Shield,
  Clock,
  MapPin,
  ArrowRight,
  Phone,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Lock,
  Compass,
} from 'lucide-react';

interface CustomerHomeProps {
  onStartBooking: () => void;
  onTrackBooking: (booking: Booking) => void;
  activeBooking?: Booking;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onStartBooking,
  onTrackBooking,
  activeBooking,
}) => {
  const hasActiveBooking =
    activeBooking &&
    activeBooking.status !== 'trip_completed' &&
    activeBooking.status !== 'cancelled';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-10">
      {/* Active Trip Banner if currently booked */}
      {hasActiveBooking && (
        <button
          type="button"
          onClick={() => onTrackBooking(activeBooking)}
          className="w-full bg-white border-2 border-[#22C55E] rounded-2xl p-4 text-left flex items-center justify-between gap-3 shadow-sm hover:bg-emerald-50/40 transition-all btn-press group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#16A34A]">
                  {activeBooking.id}
                </span>
                <span className="text-xs font-bold text-[#0E1626]">
                  · Your Trip is In Progress
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Destination: {activeBooking.destinationAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A] shrink-0 group-hover:translate-x-1 transition-transform">
            <span>View Active Trip</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      )}

      {/* HERO SECTION MATCHING REFERENCE EXACTLY */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[520px]">
          {/* Left Column: Narrative & Action */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 z-10 space-y-6">
            {/* Tag Badge with Line */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50/80 text-[11px] font-bold tracking-wider text-[#16A34A] uppercase">
                <Shield className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>DESIGNATED DRIVER SERVICE</span>
              </div>
              <div className="h-0.5 w-16 bg-gradient-to-r from-[#22C55E] to-slate-200 rounded-full hidden sm:block" />
            </div>

            {/* Headline matching screenshot */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-[#0E1626] leading-[1.08] tracking-tight">
              Enjoy your night.
              <br />
              We’ll drive you and your{' '}
              <span className="text-[#16A34A]">car home.</span>
            </h1>

            {/* Specific supporting sentence */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Book a vetted, professional chauffeur to meet you at your venue, take the wheel of your own vehicle, and drive you safely to your doorstep.
            </p>

            {/* Action Group */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={onStartBooking}
                className="w-full sm:w-auto px-7 py-4 bg-[#B4F34C] hover:bg-[#A3E635] active:bg-[#8FD624] text-[#080D17] font-extrabold text-base rounded-full shadow-sm flex items-center justify-center gap-3 transition-all btn-press cursor-pointer min-h-[54px]"
              >
                <Car className="w-5 h-5 text-[#080D17]" />
                <span>Get me a driver</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <a
                href="tel:08003748362"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-800 hover:text-[#16A34A] transition-colors py-3 px-2 min-h-[48px]"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>24/7 Desk: 0800-DRIVEMATE</span>
              </a>
            </div>
          </div>

          {/* Right Column: Authentic African-inspired Photography */}
          <div className="lg:col-span-5 relative h-full min-h-[360px] lg:min-h-[520px]">
            <img
              src={heroLagosChauffeur}
              alt="Professional African chauffeur standing with smartphone by luxury black car in Lagos at sunset"
              className="w-full h-full object-cover object-center absolute inset-0"
            />
            {/* Subtle soft gradient fade into the left white area on large screens */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white via-white/40 to-transparent" />

            {/* Stylized City Badge matching reference overlay */}
            <div className="absolute bottom-6 right-6 text-right z-10 drop-shadow-md">
              <p className="font-serif italic text-white/95 text-lg sm:text-xl font-bold tracking-wide leading-tight">
                Lagos
              </p>
              <p className="font-serif italic text-white/85 text-sm sm:text-base font-semibold leading-tight">
                Abuja
              </p>
              <p className="font-serif italic text-white/90 text-sm sm:text-base font-semibold leading-tight">
                Port Harcourt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-COLUMN TRUST / VALUE PROPOSITION BAR MATCHING REFERENCE */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
          {/* Pillar 1 */}
          <div className="flex items-start gap-4 lg:px-6 first:lg:pl-0">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0E1626] shrink-0">
              <Shield className="w-5 h-5 text-[#0E1626]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0E1626]">
                Your car. Your control.
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Keep your own vehicle.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-4 lg:px-6">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0E1626] shrink-0">
              <UserCheck className="w-5 h-5 text-[#0E1626]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0E1626]">
                Professional drivers
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Vetted and trained.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-4 lg:px-6">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0E1626] shrink-0">
              <Clock className="w-5 h-5 text-[#0E1626]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0E1626]">
                On time, always
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                When you need us.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-4 lg:px-6 last:lg:pr-0">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0E1626] shrink-0">
              <MapPin className="w-5 h-5 text-[#0E1626]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0E1626]">
                Safe and reliable
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Get home with peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION MATCHING REFERENCE */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: 4 Simple Steps */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-8 bg-[#22C55E] rounded-full" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#16A34A] uppercase">
                HOW IT WORKS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0E1626] tracking-tight">
              A safer way home in 4 simple steps.
            </h2>

            <div className="space-y-4 pt-2">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#16A34A] font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#0E1626]">
                    Enter pickup & destination
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Specify where your vehicle is currently parked and your final destination address.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#16A34A] font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#0E1626]">
                    Choose vetted chauffeur
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select an accredited commercial driver based on rating, ETA, and transparent fixed pricing.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#16A34A] font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#0E1626]">
                    Verify 4-digit PIN at handover
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Meet your chauffeur at your car and confirm your secret pickup code before handing over keys.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-emerald-50 text-[#16A34A] font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#0E1626]">
                    Relax & ride home safely
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Enjoy the passenger seat. Your chauffeur parks your vehicle safely and returns keys at your door.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onStartBooking}
                className="px-6 py-3.5 bg-[#B4F34C] hover:bg-[#A3E635] text-[#080D17] font-extrabold text-sm rounded-full shadow-xs flex items-center gap-2 transition-all btn-press cursor-pointer"
              >
                <span>Book your driver now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right Column: Floating Mobile App Mockup matching reference */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Soft pale-lime organic background blob */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-emerald-100/60 blur-2xl -z-0" />

            {/* Smartphone device frame */}
            <div className="relative z-10 w-64 sm:w-72 bg-[#0E1626] p-3 rounded-[36px] shadow-2xl border-4 border-slate-800">
              {/* Screen Content */}
              <div className="bg-white rounded-[28px] overflow-hidden p-4 space-y-3.5 text-[#0E1626]">
                {/* Status Bar */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 px-1">
                  <span>11:41</span>
                  <div className="w-14 h-3.5 bg-slate-200 rounded-full mx-auto" />
                  <span>5G</span>
                </div>

                {/* App Header */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#22C55E] flex items-center justify-center text-white text-[10px] font-bold">
                      D
                    </div>
                    <span className="text-xs font-black">DriveMate</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* Slogan */}
                <div>
                  <p className="text-[11px] font-extrabold text-[#0E1626]">
                    Your journey, our priority.
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Live corridor tracking
                  </p>
                </div>

                {/* Simulated Mini Map */}
                <div className="w-full h-28 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 p-2">
                  <svg width="100%" height="100%" className="opacity-40">
                    <path
                      d="M 10 90 Q 60 20 120 70 T 220 30"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                    />
                  </svg>
                  {/* Origin */}
                  <div className="absolute top-4 left-3 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded shadow-xs text-[9px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    <span>Genesis Sky Bar</span>
                  </div>
                  {/* Destination */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#0E1626] text-white px-1.5 py-0.5 rounded shadow-xs text-[9px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B4F34C]" />
                    <span>Home compound</span>
                  </div>
                </div>

                {/* Chauffeur card in mobile frame */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#0E1626] truncate">
                      Tunde Adebayo
                    </p>
                    <p className="text-[9px] text-slate-500">
                      FRSC Verified · Toyota Camry
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#16A34A] shrink-0">
                    ~8 mins
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Prototype Footer Note */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-slate-400 max-w-lg mx-auto">
          DriveMate Mobility Prototype · Lagos, Abuja, Port Harcourt · Driver profiles and ETAs are simulated demonstration records.
        </p>
      </div>
    </div>
  );
};
