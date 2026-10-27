import React, { useState } from 'react';
import { Booking, Driver } from '../types';
import {
  ShieldCheck,
  Key,
  Car,
  Lock,
  Phone,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  FileCheck2,
} from 'lucide-react';

interface HandoverScreenProps {
  booking: Booking;
  driver: Driver;
  onStartTrip: () => void;
  onCancelBooking: (reason: string) => void;
}

export const HandoverScreen: React.FC<HandoverScreenProps> = ({
  booking,
  driver,
  onStartTrip,
  onCancelBooking,
}) => {
  const [driverArrived, setDriverArrived] = useState(true);
  const [conditionRecordStatus, setConditionRecordStatus] = useState<
    'unselected' | 'created' | 'skipped'
  >('unselected');
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [conditionNotes, setConditionNotes] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [callAlert, setCallAlert] = useState(false);

  const pinDigits = (booking.handoverChecklist?.handoverPin || '4912').split('');

  const handleSaveConditionRecord = () => {
    setConditionRecordStatus('created');
    setShowConditionModal(false);
  };

  const handleSkipConditionRecord = () => {
    setConditionRecordStatus('skipped');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Top Header & Status */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {booking.id}
          </span>
          <span className="text-xs text-slate-500 font-medium">· Arrival & Handover</span>
        </div>

        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold p-1 rounded hover:bg-rose-50 transition-colors"
        >
          Cancel Request
        </button>
      </div>

      {/* Arrival Status Banner */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#0E1626]">
              {driverArrived ? 'Chauffeur Arrived at Your Vehicle' : 'Chauffeur En Route (~8 mins)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Meet at your {booking.vehicle.color} {booking.vehicle.make} ({booking.vehicle.registrationNumber})
            </p>
          </div>
        </div>

        {/* Prototype Toggle */}
        <button
          type="button"
          onClick={() => setDriverArrived(!driverArrived)}
          className="text-[10px] font-mono font-semibold text-slate-600 hover:text-[#0E1626] border border-slate-200 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"
          title="Toggle arrived status in prototype"
        >
          {driverArrived ? 'En Route' : 'Arrived'}
        </button>
      </div>

      {/* THE 4-DIGIT PICKUP CODE (PIN) CARD (Navy and Lime Brand Identity) */}
      <div className="bg-[#0E1626] border border-slate-800 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm text-white">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono font-bold text-[#B4F34C] uppercase tracking-wider">
          <Lock className="w-3 h-3 text-[#B4F34C]" />
          <span>Vehicle Handover Security Code</span>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Your 4-Digit Pickup PIN
          </h3>

          {/* 4 Large Digit Blocks */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 py-3">
            {pinDigits.map((digit, i) => (
              <div
                key={i}
                className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl bg-[#141F33] border border-[#1E2D4A] text-[#B4F34C] font-mono font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xs"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
          Show or state this 4-digit code to your arriving chauffeur. It verifies your identity before transferring vehicle keys.
        </p>
      </div>

      {/* Assigned Driver Profile Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={driver.photo}
                alt={driver.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white p-1 rounded-full shadow-xs">
                <ShieldCheck className="w-3 h-3 text-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-[#0E1626] truncate">
                  {driver.name}
                </h4>
                <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Assigned
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Badge: {driver.badgeNumber}
              </p>
              <p className="text-xs text-slate-600 mt-0.5 truncate">
                {driver.licenceCategory.split(' ')[0]} Commercial Chauffeur
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setCallAlert(true);
              setTimeout(() => setCallAlert(false), 3000);
            }}
            className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0E1626] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs min-h-[42px] shrink-0"
          >
            <Phone className="w-4 h-4 text-[#16A34A]" />
            <span>Call Driver</span>
          </button>
        </div>

        {callAlert && (
          <div className="text-xs text-[#0E1626] bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center font-medium animate-fade-in">
            Connecting demo phone call to {driver.name} at {driver.phone}...
          </div>
        )}
      </div>

      {/* Optional Vehicle Condition Record Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-slate-500" />
            <span>Vehicle Condition Walkaround</span>
          </span>

          {conditionRecordStatus === 'created' ? (
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Recorded
            </span>
          ) : conditionRecordStatus === 'skipped' ? (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              Skipped
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">Optional</span>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Conduct a quick 60-second inspection with your driver to note any pre-existing scratches, or skip for a faster departure.
        </p>

        {conditionRecordStatus === 'unselected' ? (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowConditionModal(true)}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-[#16A34A] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Camera className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Note scratches</span>
            </button>

            <button
              type="button"
              onClick={handleSkipConditionRecord}
              className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center transition-colors min-h-[44px]"
            >
              <span>Skip walkaround</span>
            </button>
          </div>
        ) : (
          <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate max-w-[280px]">
              {conditionRecordStatus === 'created'
                ? `Note: ${conditionNotes || 'Exterior verified OK'}`
                : 'Walkaround skipped for immediate departure'}
            </span>
            <button
              type="button"
              onClick={() => setShowConditionModal(true)}
              className="text-xs font-bold text-[#16A34A] hover:underline"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Primary CTA: "Hand over keys & Start trip" */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onStartTrip}
          className="w-full py-4 px-6 bg-[#B4F34C] hover:bg-[#A3E635] active:bg-[#8FD624] text-[#080D17] font-extrabold text-base rounded-full shadow-sm flex items-center justify-center gap-2.5 transition-all btn-press cursor-pointer min-h-[54px]"
        >
          <Key className="w-5 h-5 text-[#080D17]" />
          <span>Hand over keys & Start trip</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Condition Record Modal */}
      {showConditionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080D17]/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0E1626]">
                Vehicle Walkaround Record
              </h3>
              <button
                type="button"
                onClick={() => setShowConditionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-[#0E1626]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Record pre-existing body or rim conditions on your {booking.vehicle.make} {booking.vehicle.model}.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Condition Notes
              </label>
              <textarea
                rows={3}
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                placeholder="e.g. Scuff on rear passenger bumper; fuel at 65%"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#0E1626] focus:border-[#16A34A] focus:bg-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveConditionRecord}
                className="flex-1 py-3 bg-[#0E1626] hover:bg-[#141F33] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#B4F34C]" />
                <span>Save Condition</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowConditionModal(false);
                  handleSkipConditionRecord();
                }}
                className="px-4 py-3 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl min-h-[44px]"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080D17]/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-[#0E1626]">Cancel Booking?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel this driver request for your {booking.vehicle.make}? Free cancellation applies before vehicle departure.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl min-h-[40px]"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  onCancelBooking('Customer cancelled prior to trip departure');
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl min-h-[40px]"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
