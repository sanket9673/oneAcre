'use client';

import React from 'react';
import { FeasibilityReport } from '@/types/planning';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Building2, Ruler, IndianRupee, Award, CheckCircle } from 'lucide-react';

interface FeasibilityViewProps {
  report: FeasibilityReport;
}

export function FeasibilityView({ report }: FeasibilityViewProps) {
  const chartData = [
    {
      name: 'JV Revenue Breakdown',
      'Landowner Share (40%)': report.financials.landownerRevenueShare / 10000000,
      'Developer Gross (60%)': report.financials.developerRevenueShare / 10000000,
      'Construction Cost': report.financials.totalConstructionCost / 10000000,
      'Developer Net Profit': report.financials.developerNetProfit / 10000000,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Feasibility Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-zinc-100">Architect Feasibility Rating</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{report.summary}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-zinc-400">Score</p>
            <p className="text-2xl font-black text-emerald-400">{report.feasibilityScore}/100</p>
          </div>
          <div className="bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-bold px-4 py-2 rounded-lg text-sm">
            {report.viabilityRating}
          </div>
        </div>
      </div>

      {/* Statutory Planning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Ruler className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gross Area</span>
          </div>
          <p className="text-base font-bold text-zinc-100">
            {report.normalizedUnits.acres} Acres
          </p>
          <p className="text-[11px] text-zinc-500">{report.planning.grossPlotAreaSqYards.toLocaleString()} Sq. Yds</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Statutory Surrender</span>
          </div>
          <p className="text-base font-bold text-amber-400">
            {(report.planning.openSpaceSurrenderPct * 100)}% (GO 168)
          </p>
          <p className="text-[11px] text-zinc-500">{report.planning.surrenderedAreaSqYards.toLocaleString()} Sq Yds Surrendered</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Permissible BUA</span>
          </div>
          <p className="text-base font-bold text-emerald-400">
            {report.planning.permissibleBuaSqFt.toLocaleString()} sqft
          </p>
          <p className="text-[11px] text-zinc-500">Applicable FSI: {report.planning.applicableFsi}x</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gross Dev Value (GDV)</span>
          </div>
          <p className="text-base font-bold text-zinc-100">
            ₹{(report.financials.gdv / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-emerald-400 font-medium">Dev Net Margin: {report.financials.developerNetMarginPct}%</p>
        </div>
      </div>

      {/* Financial Bar Chart Visualizer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-zinc-200 mb-4">
          JV Financial Matrix Breakdown (in ₹ Crores)
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} unit=" Cr" />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Landowner Share (40%)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Developer Gross (60%)" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Construction Cost" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Developer Net Profit" fill="#a7f3d0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
