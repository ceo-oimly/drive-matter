import React, { useState } from 'react';
import { Booking, Driver } from '../types';
import {
  X,
  ShieldCheck,
  CheckSquare,
  Square,
  Key,
  Car,
  AlertTriangle,
  UserCheck,
  Fuel,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface VehicleHandoverModalProps {
  booking: Booking;
  driver?: Driver;
  isOpen: boolean;
  onClose: () => void;
  onCompleteHandover: (updatedBooking: Booking) => void;
}

export const VehicleHandoverModal: React.FC<VehicleHandoverModalProps> = ({
  booking,
  driver,
  isOpen,
  onClose,
  onCompleteHandover,
}) => {
  const [checklist, setChecklist] = useState({
    driverIdentityVerified: booking.handoverChecklist.driverIdentityVerified,
    securityPinConfirmed: booking.handoverChecklist.securityPinConfirmed,
    walkaroundCompleted: booking.handoverChecklist.walkaroundCompleted,
    fuelAndOdometerRecorded: booking.handoverChecklist.fuelAndOdometerRecorded,
    keyHandedOver: booking.handoverChecklist.keyHandedOver,
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [inspectionNotes, setInspectionNotes] = useState(booking.handoverChecklist.notes || '');
  const [soberCompanionConfirmed, setSoberCompanionConfirmed] = useState(false);
  const [customerUnwellActive, setCustomerUnwellActive] = useState(false);

  if (!isOpen) return null;

  const targetPin = booking.handoverChecklist.handoverPin;
  const allCoreChecked =
    checklist.driverIdentityVerified &&
    checklist.securityPinConfirmed &&
    checklist.walkaroundCompleted &&
    checklist.fuelAndOdometerRecorded &&
    checklist.keyHandedOver &&
    (!customerUnwellActive || soberCompanionConfirmed);

  const handleVerifyPin = () => {
    if (enteredPin.trim() === targetPin) {
      setChecklist((prev) => ({ ...prev, securityPinConfirmed: true }));
      setPinError('');
    } else {
      setPinError(`Incorrect PIN. Confirm with customer app display (PIN is ${targetPin}).`);
    }
  };

  const handleToggle = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    if (!allCoreChecked) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedBooking: Booking = {
      ...booking,
      status: 'handover_completed',
      handoverChecklist: {
        ...checklist,
        handoverPin: targetPin,
        verifiedAt: timeStr,
        notes: customerUnwellActive
          ? `[Sober Companion Co-Sign] ${inspectionNotes || 'Standard pre-trip vehicle walkaround completed.'}`
          : inspectionNotes || 'Standard pre-trip vehicle walkaround completed without unrecorded damage.',
      },
      timeline: [
        ...booking.timeline,
        {
          status: 'handover_completed',
          label: 'Identity & Vehicle Handover verified',
          timestamp: timeStr,
          note: customerUnwellActive
            ? 'Handover completed with authorized sober companion co-sign. Vehicle keys transferred safely.'
            : 'PIN confirmed, vehicle exterior checked, and keys transferred to chauffeur.',
        },
      ],
    };

    onCompleteHandover(updatedBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden my-6 text-[#101B2D]">
        {/* Header */}
        <div className="p-5 bg-[#F7F8FA] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#19A974]/10 border border-[#19A974]/30 flex items-center justify-center text-[#19A974]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#101B2D] tracking-tight">
                Vehicle & Key Handover Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Mutual 5-Point Safety Check before Chauffeur operates customer vehicle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-[#E2E8F0] flex items-center justify-center text-slate-400 hover:text-[#101B2D] transition-colors min-h-[44px] min-w-[44px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle & Chauffeur Summary Bar */}
        <div className="bg-white px-5 py-3 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#19A974]" />
            <span className="text-[#101B2D] font-bold">
              {booking.vehicle.color} {booking.vehicle.make} {booking.vehicle.model}
            </span>
            <span className="font-mono text-[#19A974] bg-[#19A974]/10 px-1.5 py-0.5 rounded border border-[#19A974]/20 font-semibold">
              {booking.vehicle.registrationNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span>Chauffeur:</span>
            <span className="font-semibold text-[#101B2D]">
              {driver ? driver.name : 'Assigned Chauffeur'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Step 1: Security PIN Exchange */}
          <div className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101B2D]">
                  1. Two-Way Security PIN Exchange
                </h4>
              </div>
              {checklist.securityPinConfirmed ? (
                <span className="text-xs text-[#19A974] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> PIN Verified
                </span>
              ) : (
                <span className="text-xs text-amber-600 font-mono font-bold">
                  Secret PIN: {targetPin}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Verify the 4-digit code shown on the customer app. The chauffeur must confirm this PIN in person before taking car keys.
            </p>

            {!checklist.securityPinConfirmed && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="4-digit PIN"
                  className="bg-white border border-[#E2E8F0] text-[#101B2D] rounded-xl px-3 py-2 text-sm font-mono tracking-widest text-center w-36 focus:outline-none focus:border-[#19A974]"
                />
                <button
                  type="button"
                  onClick={handleVerifyPin}
                  className="px-4 py-2 bg-[#19A974] hover:bg-[#159364] text-white text-xs font-bold rounded-xl transition-colors min-h-[44px]"
                >
                  Verify Handover PIN
                </button>
              </div>
            )}
            {pinError && <p className="text-xs text-rose-500">{pinError}</p>}
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mandatory Mutual Handover Checks
            </h4>

            {/* Check 2: Driver Identity */}
            <button
              type="button"
              onClick={() => handleToggle('driverIdentityVerified')}
              className="w-full flex items-start gap-3 p-3.5 bg-white hover:bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl text-left transition-colors cursor-pointer min-h-[44px]"
            >
              {checklist.driverIdentityVerified ? (
                <CheckSquare className="w-5 h-5 text-[#19A974] shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold text-[#101B2D]">
                  2. Chauffeur Identity & Badge Inspected
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Customer verified physical driver matches app photo ({driver?.name || 'Driver'}) and wears physical DriveMate badge ({driver?.badgeNumber || 'DM-CH-4892'}).
                </p>
              </div>
            </button>

            {/* Check 3: Vehicle Walkaround */}
            <button
              type="button"
              onClick={() => handleToggle('walkaroundCompleted')}
              className="w-full flex items-start gap-3 p-3.5 bg-white hover:bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl text-left transition-colors cursor-pointer min-h-[44px]"
            >
              {checklist.walkaroundCompleted ? (
                <CheckSquare className="w-5 h-5 text-[#19A974] shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold text-[#101B2D]">
                  3. 360° Exterior Bodywork Walkaround Completed
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Both parties walked around the car to confirm baseline condition (bumpers, mirrors, rims, glass) and verify no new unrecorded damage occurs.
                </p>
              </div>
            </button>

            {/* Check 4: Fuel and Odometer */}
            <button
              type="button"
              onClick={() => handleToggle('fuelAndOdometerRecorded')}
              className="w-full flex items-start gap-3 p-3.5 bg-white hover:bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl text-left transition-colors cursor-pointer min-h-[44px]"
            >
              {checklist.fuelAndOdometerRecorded ? (
                <CheckSquare className="w-5 h-5 text-[#19A974] shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold text-[#101B2D]">
                  4. Fuel Level & Initial Odometer Noted
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dashboard fuel gauge verified sufficient for {booking.distanceKm} km route home. Transmission in Park.
                </p>
              </div>
            </button>

            {/* Check 5: Key Handover */}
            <button
              type="button"
              onClick={() => handleToggle('keyHandedOver')}
              className="w-full flex items-start gap-3 p-3.5 bg-white hover:bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl text-left transition-colors cursor-pointer min-h-[44px]"
            >
              {checklist.keyHandedOver ? (
                <CheckSquare className="w-5 h-5 text-[#19A974] shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold text-[#101B2D]">
                  5. Physical Car Key Safely Transferred
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Owner passed {booking.vehicle.keyType} to driver. Customer takes their seat in passenger or rear seat.
                </p>
              </div>
            </button>
          </div>

          {/* Condition Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Handover Inspection Notes (Optional)
            </label>
            <input
              type="text"
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              placeholder="e.g. Minor pre-existing scratch on rear right bumper noted; fuel 60%"
              className="w-full bg-[#F7F8FA] border border-[#E2E8F0] text-[#101B2D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#19A974]"
            />
          </div>

          {/* Critical Safeguard: Customer Impairment / Unwell Protocol */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                DriveMate Impairment / Unwell Customer Protocol
              </span>
              <button
                type="button"
                onClick={() => setCustomerUnwellActive(!customerUnwellActive)}
                className={`text-[11px] px-2.5 py-1 rounded font-bold transition-colors ${
                  customerUnwellActive
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white border border-amber-200 text-slate-700 hover:text-black'
                }`}
              >
                {customerUnwellActive ? 'Protocol Active' : 'Activate if Unwell'}
              </button>
            </div>

            <p className="text-[11px] text-amber-950 leading-relaxed">
              <strong>Non-Negotiable Rule:</strong> A customer's intoxication or illness is <em>never</em> a reason to bypass identity or vehicle handover checks.
            </p>

            {customerUnwellActive && (
              <div className="pt-2 border-t border-amber-200 space-y-2 text-xs text-amber-900">
                <p>
                  • If the customer is unable to clearly respond, an authorized designated sober companion or verified event host must co-sign the handover.
                </p>
                <label className="flex items-start gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={soberCompanionConfirmed}
                    onChange={(e) => setSoberCompanionConfirmed(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 bg-white text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-amber-950">
                    I confirm an authorized sober companion or venue security official has co-signed this vehicle handover and will accompany the passenger.
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F8FA] border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#101B2D] bg-white border border-[#E2E8F0] rounded-xl transition-colors min-h-[44px]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!allCoreChecked}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all min-h-[44px] ${
              allCoreChecked
                ? 'bg-[#19A974] hover:bg-[#159364] text-white shadow-md shadow-[#19A974]/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Handover & Authorize Drive
          </button>
        </div>
      </div>
    </div>
  );
};
