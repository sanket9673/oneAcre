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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
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

      <div className="bg-[#121417] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="border-b border-white/5 p-5 flex items-center justify-between bg-[#090A0F]/60">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#D96B27]" />
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#A89F91]">Deal Router Workspace</h3>
            </div>
            <h2 className="text-base font-semibold text-white mt-0.5">{dev.developer_name}</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs px-2.5 py-1 rounded-full font-bold">
              {matchPct}% Match
            </span>
            <button
              onClick={onClose}
              className="text-[#A89F91] hover:text-white bg-white/[0.02] hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[70vh]">
          
          {/* Pitchslip Preview */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-[#A89F91]/65 font-bold">
              Generated WhatsApp Executive Pitch Slip
            </label>
            <div className="relative">
              <pre className="w-full bg-[#090A0F] border border-white/10 rounded-xl p-4 font-mono text-[11px] text-white/90 whitespace-pre-wrap leading-relaxed">
                {formattedText}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 bg-[#121417] border border-white/10 hover:bg-white/5 text-zinc-300 p-2 rounded-lg transition flex items-center space-x-1 cursor-pointer"
                title="Copy to Clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[10px] text-[#10B981] font-semibold px-0.5">Copied!</span>
                  </>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#D96B27]" />
                )}
              </button>
            </div>
          </div>

          {/* Core Matching Criteria Metadata */}
          <div className="bg-[#090A0F] p-4 rounded-xl border border-white/5 grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-2.5">
              <Target className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-[#A89F91]/60 uppercase font-bold tracking-wider">Mandate Limits</p>
                <p className="text-xs text-white/90 font-medium mt-0.5">
                  {dev.min_acres} - {dev.max_acres} Acres | {dev.min_road_width_ft}ft Rd
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-[#D96B27] mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-[#A89F91]/60 uppercase font-bold tracking-wider">Preferred Hubs</p>
                <p className="text-xs text-white/90 font-medium mt-0.5 truncate max-w-[150px]" title={dev.preferred_locations.join(', ')}>
                  {dev.preferred_locations.join(', ')}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="border-t border-white/5 p-5 bg-[#090A0F]/60 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-[#121417] hover:bg-white/5 text-white font-semibold text-xs py-3 px-4 rounded-xl border border-white/10 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D96B27]" />
                <span>Copy WhatsApp Pitch</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppSend}
            className="flex-1 bg-gradient-to-r from-[#D96B27] to-[#B8502B] hover:from-[#E07A38] hover:to-[#C55731] text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-[#D96B27]/10 cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Route via WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#121417] hover:bg-white/5 text-zinc-300 p-3 rounded-xl border border-white/10 transition cursor-pointer"
            title="Export Deal Dossier (Print / PDF)"
          >
            <Printer className="w-4 h-4 text-[#F59E0B]" />
          </button>
        </div>

      </div>

      {/* ======================================================================= */}
      {/* PRINT-ONLY DOSSIER LAYOUT (Hidden on screen, styled cleanly for print)  */}
      {/* ======================================================================= */}
      <div id="printable-dossier" className="hidden p-10 bg-white text-zinc-900 font-serif w-full max-w-4xl mx-auto">
        <div className="border-b-4 border-zinc-900 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 animate-none">1ACRE.IN DEAL DOSSIER</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-sans">
              AI Feasibility, statutory planning & buy-side mandate match
            </p>
          </div>
          <div className="text-right font-sans">
            <span className="text-xs font-bold text-zinc-400">MATCH RELEVANCE</span>
            <div className="text-2xl font-black text-[#D96B27]">{matchPct}% Match</div>
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
