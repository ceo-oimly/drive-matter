import React, { useState } from 'react';
import { Booking, BookingStatus, Driver } from '../types';
import {
  STATUS_ORDER,
  STATUS_CONFIG,
  DEMO_DRIVERS,
} from '../services/bookingStore';
import { RoutePreviewMap } from './RoutePreviewMap';
import {
  CheckCircle2,
  Clock,
  Car,
  MapPin,
  ShieldCheck,
  Phone,
  Share2,
  AlertTriangle,
  XCircle,
  Key,
  ArrowRight,
  SlidersHorizontal,
  Lock,
  Star,
  Award,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface BookingTrackingProps {
  booking: Booking;
  onUpdateStatus: (bookingId: string, nextStatus: BookingStatus, note?: string) => void;
  onCancelBooking: (bookingId: string, reason: string) => void;
  onOpenDriverProfile: (driver: Driver) => void;
  onOpenHandoverModal: () => void;
  onOpenOps: () => void;
  onOpenSafetyCentre: () => void;
}

export const BookingTracking: React.FC<BookingTrackingProps> = ({
  booking,
  onUpdateStatus,
  onCancelBooking,
  onOpenDriverProfile,
  onOpenHandoverModal,
  onOpenOps,
  onOpenSafetyCentre,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans / sober designated driver found');
  const [copiedShare, setCopiedShare] = useState(false);
  const [callAlert, setCallAlert] = useState(false);

  const assignedDriver = DEMO_DRIVERS.find((d) => d.id === booking.assignedDriverId);
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'trip_completed';

  const currentStepIndex = STATUS_ORDER.indexOf(booking.status);

  // Next status transition
  const nextStatus =
    currentStepIndex >= 0 && currentStepIndex < STATUS_ORDER.length - 1
      ? STATUS_ORDER[currentStepIndex + 1]
      : null;

  const handleAdvanceStep = () => {
    if (!nextStatus) return;

    if (nextStatus === 'handover_completed') {
      onOpenHandoverModal();
      return;
    }

    onUpdateStatus(booking.id, nextStatus);
  };

  const handleShareTrip = () => {
    const shareText = `DriveMate Live Chauffeur Escort: Tracking ride home in my ${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.registrationNumber}). Reference: ${booking.id}. Status: ${STATUS_CONFIG[booking.status].label}`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleConfirmCancel = () => {
    onCancelBooking(booking.id, cancelReason);
    setShowCancelModal(false);
  };

  const pinDigits = booking.handoverChecklist.handoverPin.split('');

  // 4-step high-level progress pipeline matching Mockup 2
  // Steps: 1. Waiting, 2. En Route, 3. In Transit, 4. Complete
  const getPipelineStep = () => {
    if (booking.status === 'request_submitted') return 1;
    if (booking.status === 'driver_assigned' || booking.status === 'driver_arriving') return 2;
    if (booking.status === 'handover_completed' || booking.status === 'trip_started') return 3;
    if (booking.status === 'trip_completed') return 4;
    return 1;
  };
  const activePipelineStep = getPipelineStep();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-5 animate-fade-in text-[#101B2D]">
      {/* Top Header Bar (matches Mockup 2: "← Active Trip Tracking") */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenOps}
            className="p-1.5 -ml-1.5 text-slate-500 hover:text-[#101B2D] rounded-lg hover:bg-slate-100 transition-colors"
            title="Back to Operations Desk"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#101B2D]">
                Active Trip Tracking
              </span>
              <span className="font-mono font-bold text-xs text-[#19A974] bg-[#19A974]/10 px-2 py-0.5 rounded border border-[#19A974]/20">
                {booking.id}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Client: {booking.customerName} · {booking.vehicle.make} {booking.vehicle.model}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareTrip}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm min-h-[38px]"
          >
            <Share2 className="w-3.5 h-3.5 text-[#19A974]" />
            <span>{copiedShare ? 'Copied Link!' : 'Share Trip'}</span>
          </button>

          <button
            onClick={onOpenSafetyCentre}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm min-h-[38px]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#19A974]" />
            <span>Safety Guide</span>
          </button>
        </div>
      </div>

      {/* 4-Step Stepper Header (from Mockup 2: 1. Waiting -> 2. En Route -> 3. In Transit -> 4. Complete) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-4 items-center gap-2 relative">
          {[
            { num: 1, label: 'Waiting' },
            { num: 2, label: 'En Route' },
            { num: 3, label: 'In Transit' },
            { num: 4, label: 'Complete' },
          ].map((step, idx) => {
            const isPast = activePipelineStep > step.num;
            const isCurrent = activePipelineStep === step.num;

            return (
              <div key={step.num} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isPast
                      ? 'bg-[#19A974] text-white'
                      : isCurrent
                      ? 'bg-[#19A974] text-white ring-4 ring-[#19A974]/20 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 ${
                    isCurrent
                      ? 'text-[#19A974]'
                      : isPast
                      ? 'text-[#101B2D]'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* High-Visibility Status Pill Banner (Mockup 2 style) */}
        <div className="bg-[#19A974]/10 border border-[#19A974]/30 rounded-xl p-3 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#19A974] shrink-0 animate-pulse" />
          <p className="text-xs font-semibold text-[#101B2D]">
            {booking.status === 'driver_arriving'
              ? `Driver arriving in ~8 mins · Pickup: ${booking.eventVenue || booking.pickupAddress}`
              : `${STATUS_CONFIG[booking.status].label} · ${STATUS_CONFIG[booking.status].description}`}
          </p>
        </div>
      </div>

      {/* Cancelled Banner if applicable */}
      {isCancelled && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <XCircle className="w-5 h-5 text-rose-600" />
            Booking Cancelled
          </div>
          <p className="text-xs text-rose-600">
            Reason: {booking.cancellationReason || 'Customer requested cancellation.'}
          </p>
        </div>
      )}

      {/* Awaiting Driver Assignment Card (Simple status when newly submitted) */}
      {!assignedDriver && !isCancelled && (
        <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Matching Chauffeur
                  </span>
                  <span className="text-xs font-mono font-bold text-[#19A974]">{booking.id}</span>
                </div>
                <h3 className="text-base font-extrabold text-[#101B2D] mt-0.5">
                  Awaiting Driver Assignment
                </h3>
              </div>
            </div>

            <a
              href="tel:08003748362"
              className="px-2.5 py-1.5 text-xs font-bold text-[#19A974] bg-[#19A974]/10 hover:bg-[#19A974]/20 border border-[#19A974]/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Support</span>
            </a>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Our Port Harcourt operations hub is assigning the nearest vetted chauffeur for your {booking.vehicle.color} {booking.vehicle.make}. You will see their live credentials here as soon as they are assigned.
          </p>

          {/* Next Expected Step Notice */}
          <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E8F0] space-y-1 text-xs">
            <span className="font-bold text-[#101B2D] block">Next Expected Step:</span>
            <p className="text-slate-600">
              1. Stay with your car at <strong>{booking.eventVenue || booking.pickupAddress}</strong>.<br />
              2. Inspect the driver's lanyard badge when they arrive.<br />
              3. Recite your secret 4-digit PIN below to release keys.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-[11px] text-slate-500">
              Demo Simulation: Assign driver via Operations Console or simulation bar below.
            </span>
            <button
              onClick={onOpenOps}
              className="px-3 py-1.5 bg-[#F7F8FA] hover:bg-slate-100 text-slate-700 font-bold border border-[#E2E8F0] rounded-lg text-xs"
            >
              Open Ops Desk
            </button>
          </div>
        </div>
      )}

      {/* Assigned Chauffeur Card (Mockup 2) */}
      {assignedDriver && !isCancelled && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={assignedDriver.photo}
                  alt={assignedDriver.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-[#E2E8F0]"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#19A974] text-white p-0.5 rounded-full shadow">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#101B2D]">{assignedDriver.name}</h3>
                  <span className="text-[10px] font-bold text-[#19A974] bg-[#19A974]/10 px-2 py-0.5 rounded border border-[#19A974]/30">
                    Vetted Chauffeur
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Executive Sedan & SUV Specialist
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <span className="text-amber-500 font-bold flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {assignedDriver.rating.toFixed(2)}
                  </span>
                  <span>·</span>
                  <span>{assignedDriver.tripsCount} trips</span>
                  <span>·</span>
                  <span>{assignedDriver.yearsExperience} yrs exp</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenDriverProfile(assignedDriver)}
              className="px-3 py-1.5 text-xs font-semibold text-[#19A974] hover:text-[#101B2D] bg-[#F7F8FA] hover:bg-slate-100 border border-[#E2E8F0] rounded-lg transition-colors min-h-[38px] flex items-center"
            >
              Profile
            </button>
          </div>

          {/* Certification Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              FRSC Class E Commercial
            </span>
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              Defensive Driving Cert.
            </span>
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-mono">
              Badge: {assignedDriver.badgeNumber}
            </span>
          </div>

          {/* Action Row: Direct Call Driver & Dispatch Desk */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0]">
            <button
              onClick={() => {
                setCallAlert(true);
                setTimeout(() => setCallAlert(false), 3000);
              }}
              className="py-2.5 px-3 bg-[#F7F8FA] hover:bg-slate-100 border border-[#E2E8F0] text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <Phone className="w-3.5 h-3.5 text-[#19A974]" />
              <span>Call Driver ({assignedDriver.phone.slice(-4)})</span>
            </button>

            <button
              onClick={onOpenOps}
              className="py-2.5 px-3 bg-[#F7F8FA] hover:bg-slate-100 border border-[#E2E8F0] text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
              <span>Dispatch Desk</span>
            </button>
          </div>
          {callAlert && (
            <p className="text-[11px] text-[#19A974] bg-[#19A974]/10 p-2 rounded-lg text-center border border-[#19A974]/20">
              Connecting demo call to chauffeur {assignedDriver.name} at {assignedDriver.phone}...
            </p>
          )}
        </div>
      )}

      {/* KEY HANDOVER PROTOCOL CARD (Exact Mockup 2 format) */}
      {!isCancelled && (
        <div className="bg-white border-2 border-[#19A974]/30 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#101B2D] flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" /> Key Handover Security Protocol
            </span>
            <span className="text-[11px] font-mono text-[#19A974] bg-[#19A974]/10 px-2 py-0.5 rounded border border-[#19A974]/20 font-bold">
              {booking.handoverChecklist.keyHandedOver ? 'Handover Complete' : 'Verification Required'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-[#101B2D]">Strict Customer Rule:</strong> Do NOT share this PIN or surrender your keys until you have inspected the driver's FRSC physical license and confirmed vehicle condition.
          </p>

          {/* 4-Digit Secret PIN Display in Segmented Boxes (from Mockup 2) */}
          <div className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl p-4 text-center space-y-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              YOUR VEHICLE RELEASE PIN
            </span>
            <div className="flex justify-center items-center gap-3 py-1">
              {pinDigits.map((digit, i) => (
                <div
                  key={i}
                  className="w-12 h-14 rounded-xl bg-white border-2 border-[#19A974] text-[#19A974] font-mono font-extrabold text-2xl flex items-center justify-center shadow-sm"
                >
                  {digit}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              The chauffeur will recite this exact PIN to you before taking the keys.
            </p>
          </div>

          {/* 3 Inspection Checkpoints */}
          <div className="space-y-2 text-xs">
            <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <span className="text-slate-700 flex items-center gap-2 font-medium">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    booking.handoverChecklist.driverIdentityVerified
                      ? 'text-[#19A974]'
                      : 'text-slate-300'
                  }`}
                />
                1. Inspect Driver ID Lanyard & App Photo Match
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                {booking.handoverChecklist.driverIdentityVerified ? 'Verified' : 'Pending'}
              </span>
            </div>

            <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <span className="text-slate-700 flex items-center gap-2 font-medium">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    booking.handoverChecklist.securityPinConfirmed
                      ? 'text-[#19A974]'
                      : 'text-slate-300'
                  }`}
                />
                2. Exchange & Verify 4-Digit Handover PIN
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                {booking.handoverChecklist.securityPinConfirmed ? 'Verified' : 'Pending'}
              </span>
            </div>

            <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <span className="text-slate-700 flex items-center gap-2 font-medium">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    booking.handoverChecklist.walkaroundCompleted
                      ? 'text-[#19A974]'
                      : 'text-slate-300'
                  }`}
                />
                3. 2-Minute Joint Vehicle Exterior Walkaround
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                {booking.handoverChecklist.walkaroundCompleted ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Trigger Handover Modal */}
          <button
            onClick={onOpenHandoverModal}
            className="w-full py-3 px-4 bg-[#19A974] hover:bg-[#159364] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-sm"
          >
            <Key className="w-4 h-4" />
            <span>
              {booking.handoverChecklist.keyHandedOver
                ? 'Review Completed Handover Checklist'
                : 'Perform 5-Point Handover Inspection'}
            </span>
          </button>
        </div>
      )}

      {/* Corridor Map Preview */}
      <RoutePreviewMap
        origin={booking.eventVenue || booking.pickupAddress}
        destination={booking.destinationAddress}
        distanceKm={booking.distanceKm}
        durationMins={booking.durationMins}
      />

      {/* Sequential Dispatch Journey Timeline */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#19A974]" />
            Sequential Dispatch Journey
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Strict Order</span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2E8F0]">
          {STATUS_ORDER.map((stepKey, idx) => {
            const stepConfig = STATUS_CONFIG[stepKey];
            const isPast = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;
            const eventMatch = booking.timeline.find((t) => t.status === stepKey);

            return (
              <div key={stepKey} className="relative group">
                <div
                  className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isPast
                      ? 'bg-[#19A974] text-white shadow-sm'
                      : isCurrent
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 shadow-sm'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-[#101B2D]' : isPast ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {stepConfig.label}
                    </h4>
                    {eventMatch && (
                      <span className="text-[11px] font-mono text-slate-500">
                        {eventMatch.timestamp}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs ${
                      isCurrent ? 'text-slate-600' : isPast ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {stepConfig.description}
                  </p>

                  {eventMatch?.note && (
                    <p className="text-[11px] text-[#19A974] bg-[#19A974]/10 p-2 rounded-lg border border-[#19A974]/20 mt-1 italic">
                      "{eventMatch.note}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Advance & Dispatcher Actions for Evaluator */}
      {!isCancelled && !isCompleted && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4.5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#19A974]" />
              Simulation Controls:
            </span>
            <button
              onClick={onOpenOps}
              className="text-xs text-[#19A974] hover:underline font-semibold"
            >
              Open Dispatch Desk
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {nextStatus && (
              <button
                onClick={handleAdvanceStep}
                className="flex-1 py-3 px-4 bg-[#19A974] hover:bg-[#159364] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors min-h-[44px] shadow-sm"
              >
                <span>Advance to Step {currentStepIndex + 2}: {STATUS_CONFIG[nextStatus].label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setShowCancelModal(true)}
              className="py-3 px-4 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-[#E2E8F0] hover:border-rose-300 text-xs font-semibold rounded-xl transition-colors min-h-[44px]"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#101B2D] tracking-tight">
              Cancel Chauffeur Request
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you wish to cancel this designated driver booking for your {booking.vehicle.make} {booking.vehicle.model}?
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Select Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#101B2D] focus:outline-none focus:border-[#19A974]"
              >
                <option value="Change of plans / sober designated driver found">Change of plans / sober designated driver found</option>
                <option value="Staying overnight at venue hotel">Staying overnight at venue hotel</option>
                <option value="Event ended earlier than expected">Event ended earlier than expected</option>
                <option value="Customer vehicle mechanical issue">Customer vehicle mechanical issue</option>
                <option value="Other / emergency">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#101B2D] bg-[#F7F8FA] rounded-lg min-h-[44px]"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg min-h-[44px]"
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
