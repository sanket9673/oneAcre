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
import { Ruler, Building2, CheckCircle, IndianRupee, ArrowUpRight } from 'lucide-react';

interface FeasibilityViewProps {
  report: FeasibilityReport;
}

export function FeasibilityView({ report }: FeasibilityViewProps) {
  const landownerPct = report.financials.landownerSharePct;
  const developerPct = 100 - landownerPct;

  const chartData = [
    {
      name: 'JV Breakdown',
      'Landowner Share': report.financials.landownerRevenueShare / 10000000,
      'Construction Budget': report.financials.totalConstructionCost / 10000000,
      'Developer Net Profit': report.financials.developerNetProfit / 10000000,
    },
  ];

  const score = report.feasibilityScore || 79;
  const maxScore = 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Column: Stat Cards and Gauge */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        {/* Feasibility Gauge */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between flex-1">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-black text-[#A89F91] tracking-widest">
              AI Feasibility Score
            </span>
            <span className="text-[10px] uppercase font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
              {report.viabilityRating}
            </span>
          </div>

          <div className="flex items-center space-x-6 my-auto">
            {/* SVG Circular Gauge */}
            <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="#10B981"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white font-mono-data">{score}</span>
                <span className="text-[8px] uppercase font-bold text-[#A89F91]/50 tracking-wider">Viable</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#F7F4EE] tracking-tight">Viability Assessment</h4>
              <p className="text-[11px] text-[#A89F91] leading-relaxed max-w-[200px]">
                {report.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Planning Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl hover:border-white/20 transition duration-300">
            <div className="flex items-center space-x-1.5 text-[#A89F91] mb-1">
              <Ruler className="w-3.5 h-3.5 text-[#D96B27]" />
              <span className="text-[9px] uppercase font-bold tracking-widest">Gross Extent</span>
            </div>
            <p className="text-sm font-bold text-white font-mono-data">
              {report.normalizedUnits.acres} Acres
            </p>
            <span className="text-[10px] text-[#A89F91]/50 font-mono-data mt-0.5 block">
              {report.planning.grossPlotAreaSqYards.toLocaleString()} Sq Yd
            </span>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl hover:border-white/20 transition duration-300">
            <div className="flex items-center space-x-1.5 text-[#A89F91] mb-1">
              <Building2 className="w-3.5 h-3.5 text-[#D96B27]" />
              <span className="text-[9px] uppercase font-bold tracking-widest">Deduction</span>
            </div>
            <p className="text-sm font-bold text-[#D96B27] font-mono-data">
              -{(report.planning.openSpaceSurrenderPct * 100).toFixed(0)}% Open Space
            </p>
            <span className="text-[10px] text-[#A89F91]/50 font-mono-data mt-0.5 block">
              {report.planning.surrenderedAreaSqYards.toLocaleString()} Sq Yd
            </span>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl hover:border-white/20 transition duration-300">
            <div className="flex items-center space-x-1.5 text-[#A89F91] mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[9px] uppercase font-bold tracking-widest">FSI Level</span>
            </div>
            <p className="text-sm font-bold text-[#F59E0B] font-mono-data">
              {report.planning.applicableFsi}x Ratio
            </p>
            <span className="text-[10px] text-[#A89F91]/50 font-mono-data mt-0.5 block">
              Road: {report.input.roadWidthFt}ft
            </span>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl hover:border-white/20 transition duration-300">
            <div className="flex items-center space-x-1.5 text-[#A89F91] mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[9px] uppercase font-bold tracking-widest">Net BUA</span>
            </div>
            <p className="text-sm font-bold text-[#10B981] font-mono-data">
              {(report.planning.permissibleBuaSqFt / 100000).toFixed(2)} L sqft
            </p>
            <span className="text-[10px] text-[#A89F91]/50 font-mono-data mt-0.5 block">
              {report.planning.permissibleBuaSqFt.toLocaleString()} sqft
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Financial Bar Chart */}
      <div className="lg:col-span-7 bg-[#121417] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">JV Yield Projections</h3>
              <p className="text-xs text-[#A89F91]/60 mt-0.5">Estimated gross development value calculations</p>
            </div>
            <div className="bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1 rounded-xl text-right">
              <span className="text-[9px] text-[#A89F91]/60 font-bold uppercase tracking-wide block">Est. GDV Margin</span>
              <span className="text-xs font-bold text-[#10B981] font-mono-data">{report.financials.developerNetMarginPct.toFixed(2)}%</span>
            </div>
          </div>

          <div className="h-64 w-full font-mono text-[10px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#A89F91" opacity={0.7} />
                <YAxis stroke="#A89F91" opacity={0.7} unit=" Cr" />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{
                    backgroundColor: '#090A0F',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#F7F4EE',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: '#F7F4EE' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Landowner Share" fill="#D96B27" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Construction Budget" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Developer Net Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric Overview Bar */}
        <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4 mt-4">
          <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A89F91] block">Total GDV</span>
            <span className="text-sm font-bold text-white font-mono-data">₹{(report.financials.gdv / 10000000).toFixed(2)} Cr</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A89F91] block">Landowner Share</span>
            <span className="text-sm font-bold text-[#D96B27] font-mono-data">₹{(report.financials.landownerRevenueShare / 10000000).toFixed(2)} Cr</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A89F91] block">Dev Net Profit</span>
            <span className="text-sm font-bold text-[#10B981] font-mono-data">₹{(report.financials.developerNetProfit / 10000000).toFixed(2)} Cr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
