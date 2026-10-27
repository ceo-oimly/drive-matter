import React from 'react';
import { MapPin, Navigation, Shield } from 'lucide-react';

interface RoutePreviewMapProps {
  origin: string;
  destination: string;
  distanceKm: number;
  durationMins: number;
  statusText?: string;
  className?: string;
}

export const RoutePreviewMap: React.FC<RoutePreviewMapProps> = ({
  origin,
  destination,
  distanceKm,
  durationMins,
  statusText = 'Route Corridor Active',
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-[#0E1626] border border-[#1B2942] p-5 text-white ${className}`}
    >
      {/* Background SVG Grid and Schematic Roads */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-pattern"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="#1B2942"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          {/* Schematic Corridor Roads */}
          <path
            d="M -20 80 Q 140 30 280 85 T 560 50"
            fill="none"
            stroke="#B4F34C"
            strokeWidth="3"
            strokeDasharray="6 4"
            strokeOpacity="0.8"
          />
          <path
            d="M 30 160 L 420 20"
            fill="none"
            stroke="#1B2942"
            strokeWidth="2"
          />
          <path
            d="M 0 120 L 500 120"
            fill="none"
            stroke="#1B2942"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B4F34C] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#B4F34C] uppercase">
            Corridor Route Simulation
          </span>
        </div>

        <span className="text-[11px] font-mono font-bold text-slate-300 bg-[#141F33] px-2.5 py-1 rounded-lg border border-[#1B2942]">
          {distanceKm} km · ~{durationMins} min
        </span>
      </div>

      {/* Visual Route Points */}
      <div className="relative z-10 space-y-3.5 py-1">
        {/* Origin */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-6 h-6 rounded-full bg-[#141F33] border border-[#B4F34C] flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#B4F34C]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Pickup Point (Valet / Gate)
            </span>
            <p className="text-xs font-bold text-white truncate">{origin}</p>
          </div>
        </div>

        {/* Route In-Between Indicator */}
        <div className="ml-3 pl-3.5 border-l-2 border-dashed border-[#B4F34C]/40 py-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141F33] border border-[#1B2942] text-[10px] font-semibold text-slate-300">
            <Navigation className="w-3 h-3 text-[#B4F34C]" />
            <span>Dedicated customer-vehicle corridor</span>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-6 h-6 rounded-full bg-[#B4F34C] border border-white flex items-center justify-center shrink-0">
            <MapPin className="w-3 h-3 text-[#080D17]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Destination (Home / Compound)
            </span>
            <p className="text-xs font-bold text-white truncate">{destination}</p>
          </div>
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="relative z-10 mt-4 pt-3 border-t border-[#1B2942] flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#B4F34C]" />
          <span>Vehicle driven home safely</span>
        </span>
        <span className="text-slate-500 text-[10px] font-mono">
          Simulated Route Track
        </span>
      </div>
    </div>
  );
};
