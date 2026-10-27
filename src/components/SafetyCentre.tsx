import React, { useState } from 'react';
import { IncidentReport } from '../types';
import {
  loadIncidents,
  saveIncidents,
} from '../services/bookingStore';
import {
  ShieldCheck,
  Key,
  Car,
  AlertTriangle,
  UserCheck,
  Share2,
  PhoneCall,
  Send,
  FileCheck2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Lock,
} from 'lucide-react';

export const SafetyCentre: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => loadIncidents());
  const [reportCategory, setReportCategory] = useState<IncidentReport['category']>('safety_handover');
  const [reportSeverity, setReportSeverity] = useState<IncidentReport['severity']>('medium');
  const [reportBookingId, setReportBookingId] = useState('');
  const [reportContact, setReportContact] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const [expandedSection, setExpandedSection] = useState<'unwell' | 'handover' | 'identity' | 'sharing'>('unwell');

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim() || !reportContact.trim()) return;

    const newReport: IncidentReport = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString(),
      bookingId: reportBookingId.trim() || undefined,
      category: reportCategory,
      severity: reportSeverity,
      description: reportDescription.trim(),
      contactEmailOrPhone: reportContact.trim(),
      status: 'received',
    };

    const updated = [newReport, ...incidents];
    setIncidents(updated);
    saveIncidents(updated);
    setSubmittedMessage(true);
    setReportDescription('');
    setReportBookingId('');
    setTimeout(() => setSubmittedMessage(false), 5000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
          <ShieldCheck className="w-6 h-6 text-[#16A34A]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0E1626] tracking-tight">
          Safety & Safeguards Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Because our chauffeurs operate your personal vehicle, our identity, vehicle condition, and passenger wellbeing standards are strictly uncompromising.
        </p>
      </div>

      {/* Critical Core Safeguard Banner: Passenger Impairment Protocol */}
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">
              Core Passenger Safeguard
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0E1626]">
              Protocol for Unwell or Intoxicated Passengers
            </h2>
          </div>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-2 text-xs text-amber-950 leading-relaxed">
          <p className="font-bold text-amber-900">
            Rule 1: Intoxication or illness is never a justification to bypass identity verification or vehicle condition checks.
          </p>
          <p>
            • <strong className="text-amber-900">Designated Sober Companion:</strong> If a customer is visibly incapacitated or unable to coherently verify their vehicle, a designated sober companion, family member, or verified event host must co-sign the handover and accompany the journey.
          </p>
          <p>
            • <strong className="text-amber-900">Medical Priority over Transport:</strong> If an event attendee exhibits symptoms of acute distress, chauffeurs are instructed to immediately summon venue medical personnel. Driving an acutely unwell passenger in a private vehicle without medical clearance is prohibited.
          </p>
          <p>
            • <strong className="text-amber-900">Safe Vehicle Custody:</strong> If a customer cannot safely complete handover and has no companion present, the vehicle is safely parked in the venue valet/parking area and keys are entrusted to venue security with an official physical custody receipt.
          </p>
        </div>
      </div>

      {/* Accordion Safeguards Guide */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Core Safety Pillars & Verification Procedures
        </h3>

        {/* Pillar 1 */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setExpandedSection(expandedSection === 'identity' ? 'unwell' : 'identity')}
            className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0E1626]">
                <UserCheck className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0E1626]">
                  1. Two-Way Identity & 4-Digit Handover PIN
                </h4>
                <p className="text-xs text-slate-500">
                  Confirming your chauffeur's badge before handing over keys
                </p>
              </div>
            </div>
            {expandedSection === 'identity' ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {expandedSection === 'identity' && (
            <div className="px-5 pb-5 pt-2 text-xs text-slate-600 space-y-2 border-t border-slate-100 bg-slate-50">
              <p>
                Every booking generates a unique 4-digit secret Handover PIN. When the chauffeur arrives:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Compare the driver’s face and official lanyard badge against the profile in your app.</li>
                <li>Ask the driver to state your vehicle registration and provide your secret 4-digit PIN.</li>
                <li>Never give keys to any individual who cannot produce the exact PIN and matching badge.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Pillar 2 */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setExpandedSection(expandedSection === 'handover' ? 'unwell' : 'handover')}
            className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0E1626]">
                <FileCheck2 className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0E1626]">
                  2. Vehicle Walkaround Condition Checklist
                </h4>
                <p className="text-xs text-slate-500">
                  Documenting pre-trip vehicle state, fuel levels, and rims
                </p>
              </div>
            </div>
            {expandedSection === 'handover' ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {expandedSection === 'handover' && (
            <div className="px-5 pb-5 pt-2 text-xs text-slate-600 space-y-2 border-t border-slate-100 bg-slate-50">
              <p>
                Both you (or your companion) and the chauffeur conduct a quick inspection before turning the ignition:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Inspect front and rear bumpers, wing mirrors, and wheel rims for pre-existing scuffs.</li>
                <li>Confirm fuel gauge is sufficient to reach the destination.</li>
                <li>Upon reaching your driveway or compound, the driver returns the keys directly into your hands.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Pillar 3 */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setExpandedSection(expandedSection === 'sharing' ? 'unwell' : 'sharing')}
            className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0E1626]">
                <Share2 className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0E1626]">
                  3. Live Journey Sharing for Friends & Family
                </h4>
                <p className="text-xs text-slate-500">
                  Keeping your loved ones updated throughout your transit home
                </p>
              </div>
            </div>
            {expandedSection === 'sharing' ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {expandedSection === 'sharing' && (
            <div className="px-5 pb-5 pt-2 text-xs text-slate-600 space-y-2 border-t border-slate-100 bg-slate-50">
              <p>
                Share trip details with loved ones via WhatsApp or SMS:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Displays your chauffeur’s verified name, photo, and badge number.</li>
                <li>Shows vehicle make, color, and plate number.</li>
                <li>Provides milestone updates from departure to safe doorstep arrival.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Support & Incident Reporting Form */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-5 h-5 text-[#16A34A]" />
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0E1626]">
                Incident & Support Reporting
              </h3>
              <p className="text-xs text-slate-500">
                Direct conduit to DriveMate Safety Operations Desk
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            24/7 Operations Desk
          </span>
        </div>

        {submittedMessage && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Your safety report has been logged. Our operations supervisor has been notified.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0E1626] focus:border-[#16A34A] focus:bg-white"
              >
                <option value="safety_handover">Safety & Key Handover</option>
                <option value="driver_conduct">Chauffeur Conduct & Etiquette</option>
                <option value="vehicle_condition">Vehicle Condition Concern</option>
                <option value="lost_item">Lost Item in Customer Vehicle</option>
                <option value="other">General Operational Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Severity Level
              </label>
              <select
                value={reportSeverity}
                onChange={(e) => setReportSeverity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0E1626] focus:border-[#16A34A] focus:bg-white"
              >
                <option value="low">Low (Feedback / Non-urgent)</option>
                <option value="medium">Medium (Investigation requested)</option>
                <option value="high">High (Prompt action required)</option>
                <option value="urgent">Urgent (Immediate escort priority)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Booking Reference (Optional)
              </label>
              <input
                type="text"
                value={reportBookingId}
                onChange={(e) => setReportBookingId(e.target.value)}
                placeholder="e.g. DM-PHC-8921"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0E1626] placeholder-slate-400 font-mono focus:border-[#16A34A] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contact Phone or Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={reportContact}
              onChange={(e) => setReportContact(e.target.value)}
              placeholder="e.g. +234 803 123 4567 or user@email.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0E1626] focus:border-[#16A34A] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Please describe what happened, including venue, driver details, or vehicle condition..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#0E1626] focus:border-[#16A34A] focus:bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0E1626] hover:bg-[#1B2942] text-white font-bold text-xs rounded-full flex items-center gap-2 transition-colors min-h-[44px] shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#B4F34C]" />
              <span>Submit Safety Report</span>
            </button>
          </div>
        </form>

        {/* Recent Submitted Reports */}
        {incidents.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recorded Incident Logs ({incidents.length})
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#16A34A] font-bold">{inc.id}</span>
                    <span className="text-[11px] text-slate-500">{inc.createdAt}</span>
                  </div>
                  <p className="text-slate-700">{inc.description}</p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Category: {inc.category.replace('_', ' ')}</span>
                    <span>·</span>
                    <span className="uppercase text-amber-700 font-semibold">{inc.severity} priority</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
