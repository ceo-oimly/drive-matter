import React, { useState } from 'react';
import { Booking, BookingStatus, Driver, ActivityLogItem } from '../types';
import {
  STATUS_ORDER,
  STATUS_CONFIG,
  DEMO_DRIVERS,
} from '../services/bookingStore';
import { RoutePreviewMap } from './RoutePreviewMap';
import {
  SlidersHorizontal,
  Car,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Filter,
  Search,
  History,
  Key,
  Phone,
  Lock,
  Compass,
  Star,
  Users,
  Radio,
  FileCheck2,
} from 'lucide-react';

interface OperationsDashboardProps {
  bookings: Booking[];
  logs: ActivityLogItem[];
  onAssignDriver: (bookingId: string, driverId: string) => void;
  onAdvanceStatus: (bookingId: string, nextStatus: BookingStatus, note?: string) => void;
  onCancelBooking: (bookingId: string, reason: string) => void;
  onSelectBookingForTracking: (booking: Booking) => void;
  onOpenDriverProfile: (driver: Driver, booking?: Booking, mode?: 'view' | 'assign') => void;
  onOpenHandoverModal: (booking: Booking) => void;
  onResetDemoData: () => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  bookings,
  logs,
  onAssignDriver,
  onAdvanceStatus,
  onCancelBooking,
  onSelectBookingForTracking,
  onOpenDriverProfile,
  onOpenHandoverModal,
  onResetDemoData,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'history' | 'drivers'>('bookings');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');

  // Cancel modal state
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState('Customer vehicle mechanical defect observed');

  // Selected booking for side inspector panel
  const selectedBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? b.status !== 'trip_completed' && b.status !== 'cancelled'
        : b.status === filterStatus;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      b.id.toLowerCase().includes(query) ||
      b.customerName.toLowerCase().includes(query) ||
      b.eventVenue.toLowerCase().includes(query) ||
      b.vehicle.make.toLowerCase().includes(query) ||
      b.vehicle.registrationNumber.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const handleCancelSubmit = () => {
    if (!cancellingBookingId) return;
    onCancelBooking(cancellingBookingId, cancelReasonText);
    setCancellingBookingId(null);
  };

  const assignedDriver = DEMO_DRIVERS.find((d) => d.id === selectedBooking?.assignedDriverId);
  const selectedStepIndex = selectedBooking ? STATUS_ORDER.indexOf(selectedBooking.status) : -1;
  const nextStatus =
    selectedStepIndex >= 0 && selectedStepIndex < STATUS_ORDER.length - 1
      ? STATUS_ORDER[selectedStepIndex + 1]
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 space-y-6 animate-fade-in text-[#101B2D]">
      {/* Top Operations Hub Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19A974] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#19A974] font-mono">
              Operations Hub · Port Harcourt Dispatch Console
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#101B2D] tracking-tight mt-1">
            Designated Driver Operations Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor incoming event requests, dispatch verified chauffeurs, verify 5-point handovers, and track trips in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onResetDemoData}
            title="Reset to default mock bookings"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 hover:text-[#101B2D] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Tiles (from Mockup 3) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Total Bookings */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
          <span className="text-slate-500 font-medium block">Total Bookings</span>
          <p className="text-2xl font-extrabold text-[#101B2D] mt-1 tabular-nums">48</p>
          <span className="text-[10px] text-[#19A974] font-semibold mt-1 block">
            {bookings.length} in Active Session
          </span>
        </div>

        {/* Awaiting Assignment */}
        <div className="bg-white border border-amber-300 rounded-2xl p-4 shadow-sm">
          <span className="text-amber-600 font-medium block">Awaiting Assignment</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
            6
          </p>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">
            High Priority Dispatch
          </span>
        </div>

        {/* Assigned & En Route */}
        <div className="bg-white border border-[#19A974]/40 rounded-2xl p-4 shadow-sm">
          <span className="text-[#19A974] font-medium block">Assigned & En Route</span>
          <p className="text-2xl font-extrabold text-[#19A974] mt-1 tabular-nums">
            14
          </p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            Active Handover/Trips
          </span>
        </div>

        {/* Completed Trips */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
          <span className="text-slate-500 font-medium block">Completed Safely</span>
          <p className="text-2xl font-extrabold text-[#101B2D] mt-1 tabular-nums">
            28
          </p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            Keys Returned to Owner
          </span>
        </div>

        {/* Chauffeur Pilot Rating */}
        <div className="col-span-2 lg:col-span-1 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
          <span className="text-slate-500 font-medium block">Fleet Rating</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1 tabular-nums flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            4.97
          </p>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            Across 164 Pilot Drives
          </span>
        </div>
      </div>

      {/* Operations Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0]">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors min-h-[44px] ${
            activeTab === 'bookings'
              ? 'border-[#19A974] text-[#19A974]'
              : 'border-transparent text-slate-500 hover:text-[#101B2D]'
          }`}
        >
          Bookings Queue ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors min-h-[44px] ${
            activeTab === 'drivers'
              ? 'border-[#19A974] text-[#19A974]'
              : 'border-transparent text-slate-500 hover:text-[#101B2D]'
          }`}
        >
          Chauffeurs Roster ({DEMO_DRIVERS.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors min-h-[44px] ${
            activeTab === 'history'
              ? 'border-[#19A974] text-[#19A974]'
              : 'border-transparent text-slate-500 hover:text-[#101B2D]'
          }`}
        >
          Audit Activity Log ({logs.length})
        </button>
      </div>

      {/* Tab 1: Bookings Queue + Inspector Split */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference ID, client name, venue, vehicle plate..."
                className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#101B2D] placeholder-slate-400 focus:outline-none focus:border-[#19A974] shadow-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'active', 'request_submitted', 'driver_assigned', 'trip_completed', 'cancelled'].map(
                (statusKey) => (
                  <button
                    key={statusKey}
                    onClick={() => setFilterStatus(statusKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] ${
                      filterStatus === statusKey
                        ? 'bg-[#19A974] text-white'
                        : 'bg-white border border-[#E2E8F0] text-slate-600 hover:text-[#101B2D]'
                    }`}
                  >
                    {statusKey === 'all'
                      ? 'All'
                      : statusKey === 'active'
                      ? 'Active'
                      : STATUS_CONFIG[statusKey as BookingStatus]?.label || statusKey}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Master Table and Inspector Side-by-Side (Desktop) / Stacked (Mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 8 Cols: Bookings Master Table */}
            <div className="lg:col-span-8 space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-2 shadow-sm">
                  <Car className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No requests match this filter</p>
                  <p className="text-xs text-slate-500">
                    Try clearing search or filters to see all bookings.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => {
                    const isSelected = selectedBooking?.id === b.id;
                    const driver = DEMO_DRIVERS.find((d) => d.id === b.assignedDriverId);

                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBookingId(b.id)}
                        className={`bg-white border rounded-2xl p-4.5 cursor-pointer transition-all shadow-sm ${
                          isSelected
                            ? 'border-[#19A974] ring-2 ring-[#19A974]/20 shadow-md'
                            : 'border-[#E2E8F0] hover:border-slate-300'
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-[#19A974] bg-[#19A974]/10 px-2 py-0.5 rounded border border-[#19A974]/20">
                              {b.id}
                            </span>
                            <span className="font-bold text-[#101B2D] text-xs">{b.customerName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ({b.customerPhone})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                b.status === 'request_submitted'
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-700'
                                  : b.status === 'trip_completed'
                                  ? 'bg-[#19A974]/15 border-[#19A974]/30 text-[#19A974]'
                                  : b.status === 'cancelled'
                                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-700'
                                  : 'bg-blue-500/10 border-blue-500/30 text-blue-700'
                              }`}
                            >
                              {STATUS_CONFIG[b.status].label}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectBookingForTracking(b);
                              }}
                              className="px-2.5 py-1 text-[11px] text-slate-600 hover:text-[#101B2D] bg-[#F7F8FA] border border-[#E2E8F0] rounded-lg transition-colors min-h-[36px]"
                            >
                              Track View
                            </button>
                          </div>
                        </div>

                        {/* Middle Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400">
                              Vehicle to Drive
                            </span>
                            <p className="font-semibold text-[#101B2D] mt-0.5 flex items-center gap-1.5">
                              <Car className="w-3.5 h-3.5 text-[#19A974]" />
                              {b.vehicle.color} {b.vehicle.make} {b.vehicle.model}
                            </p>
                            <p className="font-mono text-[#19A974] text-[11px] font-semibold">
                              {b.vehicle.registrationNumber} ({b.vehicle.transmission})
                            </p>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400">
                              Route Corridor
                            </span>
                            <p className="text-slate-600 mt-0.5 truncate">
                              <strong>From:</strong> {b.eventVenue || b.pickupAddress}
                            </p>
                            <p className="text-slate-600 truncate">
                              <strong>To:</strong> {b.destinationAddress}
                            </p>
                          </div>
                        </div>

                        {/* Footer row: Chauffeur & Quick Dispatch */}
                        <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">Chauffeur:</span>
                            {driver ? (
                              <span className="font-semibold text-[#101B2D] flex items-center gap-1">
                                <User className="w-3 h-3 text-[#19A974]" />
                                {driver.name} ({driver.badgeNumber})
                              </span>
                            ) : (
                              <span className="text-amber-600 font-bold">
                                Unassigned
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-mono font-semibold text-slate-600">
                            Fare: ₦{b.pricing.totalEstimatedFare.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 4 Cols: Active Inspection Panel (from Mockup 3) */}
            <div className="lg:col-span-4 space-y-4">
              {selectedBooking ? (
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 sticky top-20 shadow-lg">
                  {/* Panel Header */}
                  <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#19A974] font-bold block">
                        ACTIVE DISPATCH INSPECTOR
                      </span>
                      <h3 className="text-base font-extrabold text-[#101B2D] mt-0.5">
                        {selectedBooking.id}
                      </h3>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        selectedBooking.status === 'request_submitted'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-700'
                          : 'bg-[#19A974]/15 border-[#19A974]/30 text-[#19A974]'
                      }`}
                    >
                      {STATUS_CONFIG[selectedBooking.status].label}
                    </span>
                  </div>

                  {/* Client Profile */}
                  <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Client Profile
                    </span>
                    <p className="font-bold text-[#101B2D] text-sm">{selectedBooking.customerName}</p>
                    <p className="font-mono text-slate-600 text-xs">{selectedBooking.customerPhone}</p>
                    <p className="text-[11px] text-slate-500">
                      {selectedBooking.passengerCount} Passengers · {selectedBooking.bookingTime}
                    </p>
                  </div>

                  {/* Vehicle Details */}
                  <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Customer Vehicle to Drive
                    </span>
                    <p className="font-bold text-[#101B2D]">
                      {selectedBooking.vehicle.color} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
                    </p>
                    <p className="font-mono text-[#19A974] text-xs font-semibold">
                      Plate: {selectedBooking.vehicle.registrationNumber} ({selectedBooking.vehicle.transmission})
                    </p>
                  </div>

                  {/* Chauffeur Assignment Control */}
                  <div className="space-y-2 text-xs">
                    <label className="block font-bold text-slate-700">
                      Assigned Demo Chauffeur
                    </label>

                    <select
                      value={selectedBooking.assignedDriverId || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          onAssignDriver(selectedBooking.id, e.target.value);
                        }
                      }}
                      className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#101B2D] focus:outline-none focus:border-[#19A974]"
                    >
                      <option value="" disabled>
                        -- Select Chauffeur to Assign --
                      </option>
                      {DEMO_DRIVERS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.badgeNumber} · {d.currentZone.split(' ')[0]})
                        </option>
                      ))}
                    </select>

                    {assignedDriver && (
                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                        <span>Chauffeur Rating: ★ {assignedDriver.rating.toFixed(2)}</span>
                        <button
                          onClick={() => onOpenDriverProfile(assignedDriver, selectedBooking, 'view')}
                          className="text-[#19A974] hover:underline font-semibold"
                        >
                          View Full Profile
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Handover Verification Status Checklist */}
                  <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        5-Point Key Handover
                      </span>
                      <span className="font-mono text-amber-600 text-[11px] font-bold">
                        PIN: {selectedBooking.handoverChecklist.handoverPin}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Driver Lanyard Verified:</span>
                        <span className="font-mono font-semibold text-slate-700">
                          {selectedBooking.handoverChecklist.driverIdentityVerified ? '✅ Done' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Exterior Walkaround:</span>
                        <span className="font-mono font-semibold text-slate-700">
                          {selectedBooking.handoverChecklist.walkaroundCompleted ? '✅ Done' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Physical Key Handed Over:</span>
                        <span className="font-mono font-semibold text-slate-700">
                          {selectedBooking.handoverChecklist.keyHandedOver ? '✅ Done' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenHandoverModal(selectedBooking)}
                      className="w-full py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Key className="w-3.5 h-3.5 text-[#19A974]" />
                      <span>Open Handover Checklist</span>
                    </button>
                  </div>

                  {/* Corridor Mini Route Map */}
                  <RoutePreviewMap
                    origin={selectedBooking.eventVenue || selectedBooking.pickupAddress}
                    destination={selectedBooking.destinationAddress}
                    distanceKm={selectedBooking.distanceKm}
                    durationMins={selectedBooking.durationMins}
                  />

                  {/* Status Progression Button */}
                  {nextStatus && (
                    <button
                      onClick={() => {
                        if (nextStatus === 'handover_completed') {
                          onOpenHandoverModal(selectedBooking);
                        } else {
                          onAdvanceStatus(selectedBooking.id, nextStatus);
                        }
                      }}
                      className="w-full py-3 bg-[#19A974] hover:bg-[#159364] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#19A974]/20 min-h-[44px]"
                    >
                      <span>Step Forward: {STATUS_CONFIG[nextStatus].label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Cancel Request Action */}
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'trip_completed' && (
                    <button
                      onClick={() => setCancellingBookingId(selectedBooking.id)}
                      className="w-full py-2 text-rose-600 hover:text-rose-700 text-xs font-semibold text-center block transition-colors"
                    >
                      Cancel This Booking
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Chauffeurs Roster */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_DRIVERS.map((driver) => (
            <div
              key={driver.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover border border-[#E2E8F0]"
                />
                <div>
                  <h3 className="text-base font-bold text-[#101B2D]">{driver.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{driver.badgeNumber}</p>
                  <p className="text-xs text-[#19A974] font-semibold">{driver.currentZone}</p>
                </div>
              </div>

              <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Rating:</span>
                  <span className="text-amber-500 font-semibold">
                    ★ {driver.rating.toFixed(2)} ({driver.tripsCount} trips)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Experience:</span>
                  <span className="text-slate-700">{driver.yearsExperience} Years Luxury Chauffeur</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Licence:</span>
                  <span className="text-slate-700">{driver.licenceCategory.split(' ')[0]} Verified</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {driver.bio}
              </p>

              <button
                onClick={() => onOpenDriverProfile(driver)}
                className="w-full py-2.5 bg-[#F7F8FA] hover:bg-slate-100 border border-[#E2E8F0] text-slate-700 text-xs font-bold rounded-xl transition-colors min-h-[44px]"
              >
                Inspect Driver Profile & Reviews
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Activity Log */}
      {activeTab === 'history' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <History className="w-4 h-4 text-[#19A974]" />
              Real-Time Audit & Dispatch Log
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Append-Only Timeline</span>
          </div>

          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-semibold">{log.timestamp}</span>
                    <span className="font-bold text-[#101B2D]">{log.action}</span>
                    <span className="font-mono text-[#19A974] text-[11px] bg-[#19A974]/10 px-1.5 py-0.5 rounded border border-[#19A974]/20">
                      {log.bookingId}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.detail}</p>
                </div>

                <span className="text-[10px] font-semibold text-slate-600 bg-white border border-[#E2E8F0] px-2 py-0.5 rounded self-start sm:self-center shadow-xs">
                  Actor: {log.actor}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Modal with Reason */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#101B2D] tracking-tight">
              Cancel Booking: {cancellingBookingId}
            </h3>
            <p className="text-xs text-slate-600">
              Operations must record a mandatory reason for cancelling this designated driver dispatch.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Cancellation Reason
              </label>
              <select
                value={cancelReasonText}
                onChange={(e) => setCancelReasonText(e.target.value)}
                className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#101B2D] focus:outline-none focus:border-rose-500"
              >
                <option value="Customer vehicle mechanical defect observed">Customer vehicle mechanical defect observed</option>
                <option value="Customer requested cancellation">Customer requested cancellation</option>
                <option value="Unreachable at venue gate / valet">Unreachable at venue gate / valet</option>
                <option value="Vehicle registration or documentation mismatch">Vehicle registration or documentation mismatch</option>
                <option value="Road corridor emergency closure">Road corridor emergency closure</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#101B2D] bg-[#F7F8FA] rounded-lg min-h-[44px]"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelSubmit}
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
