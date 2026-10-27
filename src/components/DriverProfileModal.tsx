import React, { useState } from 'react';
import { Driver, Booking } from '../types';
import {
  X,
  ShieldCheck,
  Star,
  Award,
  Phone,
  Clock,
  Car,
  MapPin,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

interface DriverProfileModalProps {
  driver: Driver;
  booking?: Booking;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAssignment?: (driverId: string) => void;
  mode?: 'view' | 'assign';
}

export const DriverProfileModal: React.FC<DriverProfileModalProps> = ({
  driver,
  booking,
  isOpen,
  onClose,
  onConfirmAssignment,
  mode = 'view',
}) => {
  const [confirmedSafeguards, setConfirmedSafeguards] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080D17]/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden my-8 text-[#0E1626]">
        {/* Top Header Banner */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close driver profile"
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-[#0E1626] border border-slate-200 transition-colors min-h-[44px] min-w-[44px] shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={driver.photo}
                alt={`Portrait of chauffeur ${driver.name}`}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white p-1 rounded-full shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div className="text-center sm:text-left min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-[#0E1626] tracking-tight">
                  {driver.name}
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  Accredited
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Badge: {driver.badgeNumber}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1 font-bold text-[#16A34A]">
                  <Star className="w-3.5 h-3.5 fill-[#16A34A] text-[#16A34A]" />
                  <span>{driver.rating.toFixed(2)}</span>
                </div>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600 font-medium">
                  {driver.tripsCount} pilot trips
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600">{driver.yearsExperience} yrs exp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Licence & Certification */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-[#16A34A]" />
              Licence Verification & Credentials
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Licence Class:</span>
                <span className="font-semibold text-[#0E1626] text-right">
                  {driver.licenceCategory}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Accreditation:</span>
                <span className="text-[#16A34A] font-semibold">Defensive Driving Certified</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Operating Zone:</span>
                <span className="text-[#0E1626]">{driver.currentZone}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Languages:</span>
                <span className="text-[#0E1626]">{driver.languages.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Chauffeur Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Chauffeur Profile
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {driver.bio}
            </p>
          </div>

          {/* Customer Reviews */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Customer Reviews ({driver.reviews.length})
              </h4>
              <span className="text-[11px] text-slate-500">Verified designated drives</span>
            </div>

            <div className="space-y-2.5">
              {driver.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0E1626]">{rev.author}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{rev.text}"</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                    <span>{rev.eventType}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            ID: {driver.badgeNumber}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-[#0E1626] text-xs font-bold rounded-xl transition-colors min-h-[40px] shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
