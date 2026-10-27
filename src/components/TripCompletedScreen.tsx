import React, { useState } from 'react';
import { Booking, Driver } from '../types';
import {
  CheckCircle2,
  Key,
  Star,
  Car,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface TripCompletedScreenProps {
  booking: Booking;
  driver: Driver;
  onFinishAndHome: () => void;
}

export const TripCompletedScreen: React.FC<TripCompletedScreenProps> = ({
  booking,
  driver,
  onFinishAndHome,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedFeedback(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Arrival Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-[#22C55E] flex items-center justify-center text-[#16A34A] mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0E1626] tracking-tight">
          You have arrived safely!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Trip completed to <strong>{booking.destinationAddress}</strong>
        </p>
      </div>

      {/* Key Return Confirmation */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#16A34A] shrink-0 mt-0.5">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#0E1626]">
              Vehicle Parked & Keys Returned
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {driver.name} has safely parked your {booking.vehicle.color} {booking.vehicle.make} ({booking.vehicle.registrationNumber}) and returned your vehicle keys directly into your hands.
            </p>
          </div>
        </div>
      </div>

      {/* Agreed Fare & Settlement Summary */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Agreed Total Fare
          </span>
          <span className="text-xl font-black text-[#16A34A] font-mono">
            ₦{booking.pricing.totalEstimatedFare.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Settlement Status:</span>
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Prototype Pilot · No charge
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal">
          In production, commercial card billing or cash settlement occurs upon safe vehicle handover.
        </p>
      </div>

      {/* Driver Rating Form */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Rate Your Chauffeur ({driver.name})
        </h3>

        {submittedFeedback ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs text-[#16A34A] font-bold">
            Thank you! Your rating has been recorded for {driver.name}.
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
            {/* 5-Star Selection */}
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      rating >= star
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Leave optional feedback (e.g. Smooth driving, very punctual)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0E1626] focus:border-[#16A34A] focus:bg-white"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0E1626] font-bold text-xs rounded-xl border border-slate-200 min-h-[36px] cursor-pointer"
              >
                Submit Rating
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onFinishAndHome}
          className="w-full py-4 px-6 bg-[#B4F34C] hover:bg-[#A3E635] active:bg-[#8FD624] text-[#080D17] font-extrabold text-base rounded-full shadow-sm flex items-center justify-center gap-2.5 transition-all btn-press cursor-pointer min-h-[54px]"
        >
          <span>Done & Return Home</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
