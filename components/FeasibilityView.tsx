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
import { Building2, Ruler, IndianRupee, Award, CheckCircle, Percent } from 'lucide-react';

interface FeasibilityViewProps {
  report: FeasibilityReport;
}

export function FeasibilityView({ report }: FeasibilityViewProps) {
  const landownerPct = report.financials.landownerSharePct;
  const developerPct = 100 - landownerPct;

  const landownerLabel = `Landowner Share (${landownerPct}%)`;
  const developerGrossLabel = `Developer Gross (${developerPct}%)`;

  const chartData = [
    {
      name: 'JV Revenue Breakdown',
      [landownerLabel]: report.financials.landownerRevenueShare / 10000000,
      [developerGrossLabel]: report.financials.developerRevenueShare / 10000000,
      'Construction Cost': report.financials.totalConstructionCost / 10000000,
      'Developer Net Profit': report.financials.developerNetProfit / 10000000,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Feasibility Header */}
      <div className="bg-[#24201C] border border-[#332D28] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        {/* Top Gold Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#C5A059]" />
            <h3 className="text-lg font-serif-heading font-bold text-[#F7F4EE]">Architect Feasibility Rating</h3>
          </div>
          <p className="text-xs text-[#A89F91] mt-1.5 leading-relaxed">{report.summary}</p>
        </div>

        <div className="flex items-center space-x-6 shrink-0">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#A89F91]">Score</p>
            <p className="text-3xl font-mono-data font-black text-[#C5A059] mt-0.5">{report.feasibilityScore}/100</p>
          </div>
          <div className="bg-[#3E4A36]/40 border border-[#3E4A36] text-[#A8C39B] font-bold px-4 py-2 rounded-xl text-sm">
            {report.viabilityRating}
          </div>
        </div>
      </div>

      {/* Statutory Planning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#24201C] border border-[#332D28] rounded-xl p-5 hover:border-[#C5A059]/40 transition-colors">
          <div className="flex items-center space-x-2 text-[#A89F91] text-xs mb-1.5">
            <Ruler className="w-4 h-4 text-[#C5A059]" />
            <span className="uppercase font-bold tracking-wider text-[10px]">Gross Area</span>
          </div>
          <p className="text-lg font-serif-heading font-bold text-[#F7F4EE]">
            {report.normalizedUnits.acres} Acres
          </p>
          <p className="text-xs font-mono-data text-[#A89F91] mt-1">
            {report.planning.grossPlotAreaSqYards.toLocaleString()} Sq. Yds
          </p>
        </div>

        <div className="bg-[#24201C] border border-[#332D28] rounded-xl p-5 hover:border-[#C5A059]/40 transition-colors">
          <div className="flex items-center space-x-2 text-[#A89F91] text-xs mb-1.5">
            <Building2 className="w-4 h-4 text-[#C5A059]" />
            <span className="uppercase font-bold tracking-wider text-[10px]">Statutory Surrender</span>
          </div>
          <p className="text-lg font-serif-heading font-bold text-[#B8502B]">
            {(report.planning.openSpaceSurrenderPct * 100)}% (GO 168)
          </p>
          <p className="text-xs font-mono-data text-[#A89F91] mt-1">
            {report.planning.surrenderedAreaSqYards.toLocaleString()} Sq Yds
          </p>
        </div>

        <div className="bg-[#24201C] border border-[#332D28] rounded-xl p-5 hover:border-[#C5A059]/40 transition-colors">
          <div className="flex items-center space-x-2 text-[#A89F91] text-xs mb-1.5">
            <CheckCircle className="w-4 h-4 text-[#C5A059]" />
            <span className="uppercase font-bold tracking-wider text-[10px]">Permissible BUA</span>
          </div>
          <p className="text-lg font-serif-heading font-bold text-[#A8C39B]">
            {(report.planning.permissibleBuaSqFt / 100000).toFixed(2)} L sqft
          </p>
          <p className="text-xs font-mono-data text-[#A89F91] mt-1">
            FSI Yield: {report.planning.applicableFsi}x
          </p>
        </div>

        <div className="bg-[#24201C] border border-[#332D28] rounded-xl p-5 hover:border-[#C5A059]/40 transition-colors">
          <div className="flex items-center space-x-2 text-[#A89F91] text-xs mb-1.5">
            <IndianRupee className="w-4 h-4 text-[#C5A059]" />
            <span className="uppercase font-bold tracking-wider text-[10px]">Gross Dev Value</span>
          </div>
          <p className="text-lg font-serif-heading font-bold text-[#F7F4EE]">
            ₹{(report.financials.gdv / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-xs font-mono-data text-[#A8C39B] mt-1">
            Margin: {report.financials.developerNetMarginPct.toFixed(2)}%
          </p>
        </div>
        
      </div>

      {/* Financial Bar Chart Visualizer */}
      <div className="bg-[#24201C] border border-[#332D28] rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <h4 className="text-sm font-serif-heading font-bold text-[#F7F4EE] mb-5">
          JV Financial Matrix Breakdown (in ₹ Crores)
        </h4>
        <div className="h-72 w-full font-mono-data">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332D28" />
              <XAxis dataKey="name" stroke="#A89F91" fontSize={11} />
              <YAxis stroke="#A89F91" fontSize={11} unit=" Cr" />
              <Tooltip
                contentStyle={{ backgroundColor: '#181512', borderColor: '#332D28', borderRadius: '12px', color: '#F7F4EE' }}
                itemStyle={{ color: '#F7F4EE' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px', color: '#A89F91' }} />
              <Bar dataKey={landownerLabel} fill="#B8502B" radius={[4, 4, 0, 0]} />
              <Bar dataKey={developerGrossLabel} fill="#A89F91" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Construction Cost" fill="#3E4A36" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Developer Net Profit" fill="#C5A059" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
