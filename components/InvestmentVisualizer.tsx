import React, { useState } from 'react';
import { TrendingUp, PieChart } from 'lucide-react';

export default function InvestmentVisualizer() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(200);
  const [years, setYears] = useState(5);
  const estimatedReturnRate = 0.08; // 8%

  // Future Value Formula: FV = PMT * (((1 + r/n)^(nt) - 1) / (r/n))
  const monthlyRate = estimatedReturnRate / 12;
  const totalMonths = years * 12;
  const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  const totalInvested = monthlyInvestment * totalMonths;
  const projectedProfit = futureValue - totalInvested;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="text-heading rounded-2xl p-6 lg:p-8 w-full max-w-5xl mx-auto shadow-2xl overflow-hidden relative border border-card-border" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Left Col: Portfolio Composition */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-6 relative z-10">
            <PieChart className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-bold tracking-tight">Portfolio Composition</h3>
          </div>
          <p className="text-foreground text-sm font-light mb-6 relative z-10">
            Complete transparency into what you own. Engineered for balanced growth and risk mitigation.
          </p>

          <div className="flex items-center space-x-8 mt-auto flex-wrap lg:flex-nowrap gap-y-8">
            {/* Donut Chart SVG */}
            <div className="relative w-36 h-36 flex-shrink-0 drop-shadow-xl z-20 mx-auto">
              <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" strokeWidth="6" style={{ stroke: 'var(--card-border)' }}></circle>
                
                {/* Tech Stocks: 40% */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" strokeWidth="6" 
                  strokeDasharray="40 60" strokeDashoffset="0" style={{ stroke: 'var(--color-blue-600, #3B82F6)' }} className="transition-all duration-1000 ease-out drop-shadow-sm"></circle>
                  
                {/* Bonds: 30% */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#8B5CF6" strokeWidth="6" 
                  strokeDasharray="30 70" strokeDashoffset="-40" className="transition-all duration-1000 ease-out drop-shadow-sm"></circle>
                  
                {/* Gold ETFs: 20% */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F59E0B" strokeWidth="6" 
                  strokeDasharray="20 80" strokeDashoffset="-70" className="transition-all duration-1000 ease-out drop-shadow-sm"></circle>

                {/* Crypto: 10% */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="6" 
                  strokeDasharray="10 90" strokeDashoffset="-90" className="transition-all duration-1000 ease-out drop-shadow-sm"></circle>
              </svg>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-heading">4</span>
                <span className="text-[9px] text-foreground font-medium uppercase tracking-widest text-center mt-1">Assets</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-5 z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.3)]"></div>
                  <span className="text-sm font-medium text-heading">Tech Stocks</span>
                </div>
                <span className="text-sm font-bold text-heading">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]"></div>
                  <span className="text-sm font-medium text-heading">Bonds</span>
                </div>
                <span className="text-sm font-bold text-heading">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"></div>
                  <span className="text-sm font-medium text-heading">Gold ETFs</span>
                </div>
                <span className="text-sm font-bold text-heading">20%</span>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] mt-0.5"></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-heading leading-none">Crypto</span>
                    <span className="text-xs text-foreground font-light mt-1.5">(6% Bitcoin, 4% Ethereum)</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-heading leading-none">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Returns Simulator */}
        <div className="flex flex-col backdrop-blur-md rounded-2xl p-6 border border-card-border shadow-inner z-20" style={{ backgroundColor: 'var(--inv-panel)' }}>
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold tracking-tight">Returns Simulator</h3>
          </div>
          
          <div className="space-y-8 flex-1">
            {/* Monthly Investment Slider */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="text-sm text-foreground font-medium">Monthly Investment</label>
                <span className="text-xl font-bold text-blue-600">{monthlyInvestment} RON</span>
              </div>
              <input 
                type="range" 
                min="50" max="2000" step="50" 
                value={monthlyInvestment} 
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2.5 bg-card-border rounded-full appearance-none cursor-pointer hover:opacity-80 transition-all accent-blue-600"
              />
            </div>

            {/* Years Slider */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="text-sm text-foreground font-medium">Time Horizon</label>
                <span className="text-xl font-bold text-blue-600">{years} Years</span>
              </div>
              <input 
                type="range" 
                min="1" max="30" step="1" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2.5 bg-card-border rounded-full appearance-none cursor-pointer hover:opacity-80 transition-all accent-blue-600"
              />
            </div>

            {/* Dynamic Sentence */}
            <div className="rounded-xl p-4 border border-card-border font-light text-foreground text-[13px] leading-relaxed shadow-lg" style={{ backgroundColor: 'var(--inv-sentence)' }}>
               &quot;If I invest <b className="text-heading">{monthlyInvestment} RON</b> monthly 
               for <b className="text-heading">{years} years</b>, with an estimated return of <b className="text-emerald-500">8%</b>, I will have...&quot;
            </div>

            {/* Stats */}
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] text-foreground mb-1 uppercase tracking-wider font-semibold">Total Invested</span>
                <span className="text-xl font-medium text-heading">{formatCurrency(totalInvested)}</span>
              </div>
              <div>
                <span className="block text-[10px] text-emerald-500/80 mb-1 uppercase tracking-wider font-semibold">
                  Projected Profit
                </span>
                <span className="text-xl font-bold text-emerald-500">+{formatCurrency(projectedProfit)}</span>
              </div>
            </div>

            {/* Big Total */}
            <div className="pt-4 border-t border-card-border mt-auto">
              <span className="block text-[11px] text-foreground mb-1">Estimated Portfolio Value</span>
              <span className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text tracking-tight block pb-1"
                style={{ backgroundImage: 'linear-gradient(to right, var(--grad-start), var(--grad-end))' }}>
                {formatCurrency(futureValue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
