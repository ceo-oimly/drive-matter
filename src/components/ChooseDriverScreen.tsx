import React, { useState } from 'react';
import { Driver } from '../types';
import { DEMO_DRIVERS } from '../services/bookingStore';
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  MapPin,
  Info,
  Car,
  ChevronRight,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

interface ChooseDriverScreenProps {
  pickup: string;
  destination: string;
  onSelectDriver: (driver: Driver, quotedPrice: number, etaMins: number) => void;
  onBack: () => void;
}

interface DriverMarketplaceOption {
  driver: Driver;
  etaMins: number;
  price: number;
  specialtyTag: string;
  experienceTag: string;
}

export const ChooseDriverScreen: React.FC<ChooseDriverScreenProps> = ({
  pickup,
  destination,
  onSelectDriver,
  onBack,
}) => {
  const driverOptions: DriverMarketplaceOption[] = [
    {
      driver: DEMO_DRIVERS[0],
      etaMins: 8,
      price: 8500,
      specialtyTag: 'Executive Sedan & SUV Specialist',
      experienceTag: '8 yrs experience',
    },
    {
      driver: DEMO_DRIVERS[1],
      etaMins: 12,
      price: 8500,
      specialtyTag: 'Automatic & Hybrid Certified',
      experienceTag: '6 yrs experience',
    },
    {
      driver: DEMO_DRIVERS[2],
      etaMins: 15,
      price: 8000,
      specialtyTag: 'German & Japanese Vehicle Specialist',
      experienceTag: '9 yrs experience',
    },
  ];

  const [selectedDriverId, setSelectedDriverId] = useState<string>(DEMO_DRIVERS[0].id);

  const activeOption =
    driverOptions.find((opt) => opt.driver.id === selectedDriverId) || driverOptions[0];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0E1626] p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Route</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0E1626]">
          <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-mono">
            2
          </span>
          <span>Select Driver</span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">Step 2 of 3</span>
      </div>

      {/* Corridor Summary Pill */}
      <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span className="truncate font-semibold text-[#0E1626]">
            {pickup.split(',')[0]} → {destination.split(',')[0]}
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-slate-500 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          ~11.6 km
        </span>
      </div>

      {/* Honest Prototype Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#0E1626]">Simulated Chauffeur Profiles:</strong> Drivers, arrival estimates, and ratings shown here reflect demo evaluation records.
        </p>
      </div>

      {/* Drivers List */}
      <div className="space-y-3">
        {driverOptions.map(({ driver, etaMins, price, specialtyTag, experienceTag }) => {
          const isSelected = driver.id === selectedDriverId;

          return (
            <div
              key={driver.id}
              onClick={() => setSelectedDriverId(driver.id)}
              className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer relative shadow-sm ${
                isSelected
                  ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20'
                  : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
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
                      <h3 className="text-base font-extrabold text-[#0E1626] truncate">
                        {driver.name}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold text-[#080D17] bg-[#B4F34C] px-2 py-0.5 rounded-full border border-[#A3E635]">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                      {specialtyTag}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-[#0E1626]">
                        <Star className="w-3.5 h-3.5 fill-[#16A34A] text-[#16A34A]" />
                        {driver.rating.toFixed(2)}
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">{driver.tripsCount} trips</span>
                      <span>·</span>
                      <span>{experienceTag}</span>
                    </div>
                  </div>
                </div>

                {/* Price & ETA */}
                <div className="text-right shrink-0">
                  <span className="text-base sm:text-lg font-black text-[#0E1626] font-mono block">
                    ₦{price.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    ~{etaMins}m away
                  </span>
                </div>
              </div>

              {/* Bottom Credentials & Zone */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono text-slate-600">
                  Badge: {driver.badgeNumber}
                </span>
                <span className="text-slate-600 truncate max-w-[200px]">
                  {driver.currentZone.split('&')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() =>
            onSelectDriver(
              activeOption.driver,
              activeOption.price,
              activeOption.etaMins
            )
          }
          className="w-full py-4 px-6 bg-[#B4F34C] hover:bg-[#A3E635] active:bg-[#8FD624] text-[#080D17] font-extrabold text-base rounded-full shadow-sm flex items-center justify-center gap-2.5 transition-all btn-press cursor-pointer min-h-[54px]"
        >
          <span>Continue with {activeOption.driver.name.split(' ')[0]}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
