'use client';

import React, { useState } from 'react';
import { DeveloperMatch } from '@/types/api';
import { FeasibilityReport } from '@/types/planning';
import { X, Copy, Send, Printer, Check, Shield, MapPin, Target } from 'lucide-react';

interface DealRoutingModalProps {
  dev: DeveloperMatch;
  report: FeasibilityReport;
  onClose: () => void;
}

export function DealRoutingModal({ dev, report, onClose }: DealRoutingModalProps) {
  const [copied, setCopied] = useState(false);

  const matchPct = Math.min(99, Math.round((dev.similarity ?? 0.85) * 100));
  const buaLakhSqFt = (report.planning.permissibleBuaSqFt / 100000).toFixed(2);
  const gdvCr = (report.financials.gdv / 10000000).toFixed(2);
  const devMargin = report.financials.developerNetMarginPct.toFixed(2);
  const devProfitCr = (report.financials.developerNetProfit / 10000000).toFixed(2);
  const landownerShareCr = (report.financials.landownerRevenueShare / 10000000).toFixed(2);
  const grossAreaYards = report.planning.grossPlotAreaSqYards.toLocaleString();

  const dealStructureText = report.input.dealType || `${dev.ideal_deal_type} (40/60 Share)`;

  const formattedText = `📍 *NEW LAND DEAL MATCH — 1acre Smart Deal Engine*
• Developer: ${dev.developer_name}
• Location: ${report.input.location || 'Shadnagar'}
• Extent: ${report.normalizedUnits.acres} Acres (${grossAreaYards} Sq. Yds)
• Road Width: ${report.input.roadWidthFt} Feet
• Permissible BUA: ${buaLakhSqFt} Lakh Sq. Ft (FSI ${report.planning.applicableFsi}x)
• Financial Yield: GDV ₹${gdvCr} Cr | Developer Net Margin: ${devMargin}%
• Deal Structure: ${dealStructureText}
• Match Confidence: ${matchPct}%`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleWhatsAppSend = () => {
    const encodedText = encodeURIComponent(formattedText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      {/* Self-contained Print Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body > * {
            display: none !important;
          }
          #printable-dossier {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
          }
        }
      `}} />

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="border-b border-zinc-800 p-5 flex items-center justify-between bg-zinc-950/40">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-zinc-400">Deal Router Workspace</h3>
            </div>
            <h2 className="text-base font-bold text-zinc-100 mt-0.5">{dev.developer_name}</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold">
              {matchPct}% Match
            </span>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 p-1.5 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[70vh]">
          
          {/* Pitchslip Preview */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Generated WhatsApp Executive Pitch Slip
            </label>
            <div className="relative">
              <pre className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {formattedText}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 p-2 rounded-lg transition flex items-center space-x-1"
                title="Copy to Clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-semibold px-0.5">Copied!</span>
                  </>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Core Matching Criteria Metadata */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-2.5">
              <Target className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Mandate Limits</p>
                <p className="text-xs text-zinc-300 font-medium mt-0.5">
                  {dev.min_acres} - {dev.max_acres} Acres | {dev.min_road_width_ft}ft Rd
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Preferred Hubs</p>
                <p className="text-xs text-zinc-300 font-medium mt-0.5 truncate" title={dev.preferred_locations.join(', ')}>
                  {dev.preferred_locations.join(', ')}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="border-t border-zinc-800 p-5 bg-zinc-950/40 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs py-3 px-4 rounded-xl border border-zinc-700/50 transition flex items-center justify-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy WhatsApp Pitch</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppSend}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black text-xs py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40"
          >
            <Send className="w-4 h-4 fill-zinc-950 text-zinc-950" />
            <span>Route via WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-3 rounded-xl border border-zinc-700/60 transition"
            title="Export Deal Dossier (Print / PDF)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ======================================================================= */}
      {/* PRINT-ONLY DOSSIER LAYOUT (Hidden on screen, styled cleanly for print)  */}
      {/* ======================================================================= */}
      <div id="printable-dossier" className="hidden p-10 bg-white text-zinc-900 font-serif w-full max-w-4xl mx-auto">
        <div className="border-b-4 border-zinc-900 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950">1ACRE.IN DEAL DOSSIER</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-sans">
              AI Feasibility, statutory planning & buy-side mandate match
            </p>
          </div>
          <div className="text-right font-sans">
            <span className="text-xs font-bold text-zinc-400">MATCH RELEVANCE</span>
            <div className="text-2xl font-black text-emerald-600">{matchPct}% Match</div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Section: Overview */}
          <div>
            <h2 className="text-lg font-bold border-b border-zinc-300 pb-1 font-sans text-zinc-800 mb-3">1. Executive Overview</h2>
            <table className="w-full text-left text-sm font-sans border-collapse">
              <tbody>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 text-zinc-500 font-semibold w-1/3">Target Developer</th>
                  <td className="py-2 text-zinc-900 font-bold">{dev.developer_name}</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 text-zinc-500 font-semibold">Location / Micro-market</th>
                  <td className="py-2 text-zinc-900 font-bold">{report.input.location || 'Shadnagar'}</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 text-zinc-500 font-semibold">Target Deal Structure</th>
                  <td className="py-2 text-zinc-900 font-bold">{dealStructureText}</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 text-zinc-500 font-semibold">Total Land Extent</th>
                  <td className="py-2 text-zinc-900 font-bold">{report.normalizedUnits.acres} Acres ({grossAreaYards} Sq. Yards)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section: Statutory planning parameters */}
          <div>
            <h2 className="text-lg font-bold border-b border-zinc-300 pb-1 font-sans text-zinc-800 mb-3">2. Statutory Planning & FSI (GO 168)</h2>
            <div className="grid grid-cols-2 gap-6 font-sans text-sm">
              <div className="border border-zinc-200 p-4 rounded-lg">
                <span className="text-xs text-zinc-500 uppercase block font-bold">Gross Plot Size</span>
                <span className="text-xl font-bold text-zinc-900">{report.planning.grossPlotAreaSqFt.toLocaleString()} Sq. Ft.</span>
              </div>
              <div className="border border-zinc-200 p-4 rounded-lg">
                <span className="text-xs text-zinc-500 uppercase block font-bold">Road Width & FSI</span>
                <span className="text-xl font-bold text-zinc-900">{report.input.roadWidthFt} Ft Road / {report.planning.applicableFsi}x FSI</span>
              </div>
              <div className="border border-zinc-200 p-4 rounded-lg">
                <span className="text-xs text-zinc-500 uppercase block font-bold">Statutory Deduction (15%)</span>
                <span className="text-xl font-bold text-amber-600">{report.planning.surrenderedAreaSqYards.toLocaleString()} Sq. Yds</span>
              </div>
              <div className="border border-zinc-200 p-4 rounded-lg">
                <span className="text-xs text-zinc-500 uppercase block font-bold">Permissible Built-Up Area (BUA)</span>
                <span className="text-xl font-bold text-emerald-600">{report.planning.permissibleBuaSqFt.toLocaleString()} Sq. Ft.</span>
              </div>
            </div>
          </div>

          {/* Section: Financial breakdown */}
          <div>
            <h2 className="text-lg font-bold border-b border-zinc-300 pb-1 font-sans text-zinc-800 mb-3">3. Joint Venture Financial Model</h2>
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-300 text-zinc-500 uppercase text-xs">
                  <th className="py-2">Metric</th>
                  <th className="py-2 text-right">Value (in INR)</th>
                  <th className="py-2 text-right">Value (in Crores)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-200">
                  <td className="py-2.5 font-medium text-zinc-700">Gross Development Value (GDV)</td>
                  <td className="py-2.5 text-right font-mono">₹{report.financials.gdv.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold text-zinc-950">₹{gdvCr} Cr</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="py-2.5 font-medium text-zinc-700">Total Construction Cost</td>
                  <td className="py-2.5 text-right font-mono">₹{report.financials.totalConstructionCost.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold text-red-650">₹{(report.financials.totalConstructionCost / 10000000).toFixed(2)} Cr</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="py-2.5 font-medium text-zinc-700">Landowner Revenue Share ({report.financials.landownerSharePct}%)</td>
                  <td className="py-2.5 text-right font-mono">₹{report.financials.landownerRevenueShare.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold text-blue-650">₹{landownerShareCr} Cr</td>
                </tr>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <td className="py-2.5 font-bold text-zinc-900">Developer Net Profit</td>
                  <td className="py-2.5 text-right font-mono font-bold">₹{report.financials.developerNetProfit.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-black text-emerald-600">₹{devProfitCr} Cr</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="py-2.5 font-medium text-zinc-700">Developer Net Margin</td>
                  <td className="py-2.5 text-right font-mono">---</td>
                  <td className="py-2.5 text-right font-bold text-purple-600">{devMargin}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section: Mandate Criteria Verification */}
          <div>
            <h2 className="text-lg font-bold border-b border-zinc-300 pb-1 font-sans text-zinc-800 mb-3">4. Developer Mandate Matching Criteria</h2>
            <div className="bg-zinc-50 p-4 rounded-xl font-sans text-sm border border-zinc-200 space-y-2">
              <p className="text-zinc-700 italic">"{dev.requirement_summary}"</p>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-zinc-500">
                <p>• Allowed Extent: {dev.min_acres} to {dev.max_acres} Acres</p>
                <p>• Min. Approach Road: {dev.min_road_width_ft} Ft</p>
              </div>
            </div>
          </div>

        </div>

        {/* Print Footer */}
        <div className="border-t border-zinc-300 mt-12 pt-4 text-center text-xs text-zinc-400 font-sans">
          <p>© 2026 1acre.in Land Intelligence Engine. Confidential Document for Internal Distribution Only.</p>
        </div>
      </div>

    </div>
  );
}
