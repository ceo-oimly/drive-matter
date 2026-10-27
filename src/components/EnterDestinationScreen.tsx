import React, { useState } from 'react';
import { Vehicle } from '../types';
import { loadSavedVehicle, saveSavedVehicle } from '../services/bookingStore';
import {
  MapPin,
  Crosshair,
  ArrowRight,
  ArrowLeft,
  Car,
  AlertCircle,
  Shield,
} from 'lucide-react';

interface EnterDestinationScreenProps {
  initialPickup?: string;
  initialDestination?: string;
  onProceedToDrivers: (params: {
    pickup: string;
    destination: string;
    vehicle: Vehicle;
  }) => void;
  onBack: () => void;
}

const ROUTE_DRAFT_KEY = 'drivemate_route_form_v1';

function loadRouteDraft(initialPickup: string, initialDestination: string) {
  try {
    const saved = localStorage.getItem(ROUTE_DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        pickup: typeof parsed.pickup === 'string' && parsed.pickup ? parsed.pickup : initialPickup,
        destination: typeof parsed.destination === 'string' && parsed.destination ? parsed.destination : initialDestination,
      };
    }
  } catch {}
  return { pickup: initialPickup, destination: initialDestination };
}

export const EnterDestinationScreen: React.FC<EnterDestinationScreenProps> = ({
  initialPickup = 'Genesis Sky Bar, GRA Phase 2',
  initialDestination = '14 Peter Odili Road, Port Harcourt',
  onProceedToDrivers,
  onBack,
}) => {
  const [savedRoute] = useState(() => loadRouteDraft(initialPickup, initialDestination));
  const [pickup, setPickup] = useState(savedRoute.pickup);
  const [destination, setDestination] = useState(savedRoute.destination);

  const persistRouteDraft = (nextPickup: string, nextDestination: string) => {
    try {
      localStorage.setItem(
        ROUTE_DRAFT_KEY,
        JSON.stringify({ pickup: nextPickup, destination: nextDestination })
      );
    } catch {}
  };

  const [vehicle, setVehicle] = useState<Vehicle>(() => loadSavedVehicle());
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setLocationSuccess(false);

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setLocationSuccess(true);
          const loc = 'Genesis Centre, Tombia St, GRA Phase 2 (Current Location)';
          setPickup(loc);
          persistRouteDraft(loc, destination);
        },
        () => {
          setIsLocating(false);
          setLocationSuccess(true);
          const loc = 'Genesis Centre, Tombia St, GRA Phase 2';
          setPickup(loc);
          persistRouteDraft(loc, destination);
        },
        { timeout: 3500 }
      );
    } else {
      setIsLocating(false);
      const loc = 'Genesis Centre, Tombia St, GRA Phase 2';
      setPickup(loc);
      persistRouteDraft(loc, destination);
      setLocationSuccess(true);
    }
  };

  const handleFindDrivers = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim()) {
      setError('Please specify where your vehicle is parked.');
      return;
    }
    if (!destination.trim()) {
      setError('Please specify where you need to be driven.');
      return;
    }
    setError('');
    saveSavedVehicle(vehicle);
    persistRouteDraft(pickup.trim(), destination.trim());
    onProceedToDrivers({ pickup: pickup.trim(), destination: destination.trim(), vehicle });
  };

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
          <span>Home</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0E1626]">
          <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-mono">
            1
          </span>
          <span>Route & Vehicle</span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">Step 1 of 3</span>
      </div>

      <form onSubmit={handleFindDrivers} className="space-y-5">
        {/* Error notification */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Route Card: Connected Origin to Destination */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#0E1626] uppercase tracking-wider">
              Trip Route
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Door-to-door designated transit
            </span>
          </div>

          <div className="relative pl-6 sm:pl-7 space-y-5">
            {/* Connecting Vertical Line */}
            <div className="absolute left-2.5 top-5 bottom-8 w-0.5 border-l-2 border-dashed border-emerald-300 pointer-events-none" />

            {/* 1. Pickup Input */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-6 sm:-left-7 top-3 w-5 h-5 rounded-full bg-emerald-50 border-2 border-[#16A34A] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Pickup Location (Where your car is parked)
                </label>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="text-[11px] font-bold text-[#16A34A] hover:underline flex items-center gap-1 min-h-[32px] px-1"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>
                    {isLocating
                      ? 'Locating...'
                      : locationSuccess
                      ? 'Current Location'
                      : 'Current Location'}
                  </span>
                </button>
              </div>

              <input
                type="text"
                required
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  persistRouteDraft(e.target.value, destination);
                }}
                placeholder="e.g. Genesis Sky Bar, Tombia St, GRA"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-[#0E1626] font-medium placeholder-slate-400 focus:bg-white focus:border-[#16A34A] transition-all min-h-[46px]"
              />

              {/* Quick Venues */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Genesis Sky Bar, GRA',
                  'Hotel Presidential',
                  'The Glass House',
                  'Polo Club, Old GRA',
                ].map((venue) => (
                  <button
                    key={venue}
                    type="button"
                    onClick={() => {
                      setPickup(venue);
                      persistRouteDraft(venue, destination);
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors min-h-[32px] ${
                      pickup.includes(venue.split(',')[0])
                        ? 'bg-[#0E1626] text-white border-[#0E1626]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {venue}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Destination Input */}
            <div className="relative space-y-1.5 pt-2">
              <div className="absolute -left-6 sm:-left-7 top-4 w-5 h-5 rounded-full bg-[#B4F34C] border border-[#16A34A] flex items-center justify-center">
                <MapPin className="w-3 h-3 text-[#0E1626]" />
              </div>

              <label className="block text-xs font-bold text-slate-700">
                Destination (Where we are driving you)
              </label>

              <input
                type="text"
                required
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  persistRouteDraft(pickup, e.target.value);
                }}
                placeholder="e.g. 14 Peter Odili Road, Port Harcourt"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-3.5 text-sm sm:text-base text-[#0E1626] font-bold placeholder-slate-400 focus:bg-white focus:border-[#16A34A] transition-all shadow-xs min-h-[48px]"
              />

              {/* Frequent Destinations */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  '14 Peter Odili Road',
                  'Woji Estate Gate',
                  'Old GRA Executive Strip',
                  'Trans-Amadi Gardens',
                ].map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => {
                      setDestination(place);
                      persistRouteDraft(pickup, place);
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors min-h-[32px] ${
                      destination.includes(place)
                        ? 'bg-[#0E1626] text-white border-[#0E1626]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Vehicle Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0E1626]">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0E1626]">
                  Your Vehicle
                </h3>
                <p className="text-[11px] text-slate-500">
                  The driver operates this car
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingVehicle(!isEditingVehicle)}
              className="text-xs font-bold text-[#16A34A] hover:underline px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors min-h-[36px]"
            >
              {isEditingVehicle ? 'Save Details' : 'Change Vehicle'}
            </button>
          </div>

          {!isEditingVehicle ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-[#0E1626]">
                  {vehicle.color} {vehicle.make} {vehicle.model}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-mono">
                  <span className="font-bold text-[#0E1626] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {vehicle.registrationNumber}
                  </span>
                  <span>·</span>
                  <span>{vehicle.transmission}</span>
                  <span>·</span>
                  <span>{vehicle.keyType}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200 uppercase tracking-wider shrink-0">
                Customer Car
              </span>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fade-in text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Make & Model
                  </label>
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
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0E1626] focus:border-[#16A34A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    value={vehicle.registrationNumber}
                    onChange={(e) =>
                      setVehicle({ ...vehicle, registrationNumber: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. PHC 456 AA"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono uppercase text-[#0E1626] focus:border-[#16A34A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Transmission
                  </label>
                  <select
                    value={vehicle.transmission}
                    onChange={(e) =>
                      setVehicle({ ...vehicle, transmission: e.target.value as any })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0E1626] focus:border-[#16A34A]"
                  >
                    <option value="Automatic">Automatic Transmission</option>
                    <option value="Manual">Manual Transmission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Key Type
                  </label>
                  <select
                    value={vehicle.keyType}
                    onChange={(e) =>
                      setVehicle({ ...vehicle, keyType: e.target.value as any })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0E1626] focus:border-[#16A34A]"
                  >
                    <option value="Keyless Push-Start">Keyless Push-Start Fob</option>
                    <option value="Traditional Blade Key">Traditional Blade Key</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-[#B4F34C] hover:bg-[#A3E635] active:bg-[#8FD624] text-[#080D17] font-extrabold text-base rounded-full shadow-sm flex items-center justify-center gap-2.5 transition-all btn-press cursor-pointer min-h-[54px]"
          >
            <span>Find drivers</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
};
