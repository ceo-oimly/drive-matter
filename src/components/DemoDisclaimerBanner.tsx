import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, Info } from 'lucide-react';

export const DemoDisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-50 border-b border-slate-200 text-slate-600 px-4 py-2 text-xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px] shrink-0 border border-emerald-300">
            !
          </span>
          <p className="font-medium text-slate-700">
            <strong className="text-emerald-700 font-bold">DriveMate Prototype:</strong> Designated driver booking demonstration for customer-owned vehicles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1 transition-colors min-h-[32px] px-2 py-0.5 rounded-lg hover:bg-emerald-50"
        >
          <span>{expanded ? 'Hide Safety Notice' : 'Safeguards Notice'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5 leading-relaxed animate-fade-in">
          <p>
            • <strong className="text-slate-700">Simulated Chauffeur Dispatch:</strong> Driver profiles, ratings, arrival times, and vehicle handovers in this prototype are demonstration models for product evaluation.
          </p>
          <p>
            • <strong className="text-slate-700">Customer Vehicle Safeguard:</strong> In commercial deployment, DriveMate requires active commercial designated-driver insurance coverage, verified biometric licensing, and mutual sober handover checklists before departure.
          </p>
          <p>
            • <strong className="text-slate-700">No Live Payment Processing:</strong> No actual monetary charges or financial data transactions occur in this prototype.
          </p>
        </div>
      )}
    </div>
  );
};
