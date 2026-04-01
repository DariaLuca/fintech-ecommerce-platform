import React, { useState } from 'react';
import { TrendingUp, PieChart } from 'lucide-react';

const PORTFOLIO_DATA: Record<string, any> = {
  '4': {
    title: 'Starter Investment Portfolio',
    description: 'Complete transparency into what you own. Engineered for balanced growth and risk mitigation.',
    rate: 0.08,
    assets: [
      { name: 'Tech Stocks', percent: 40, color: '#3B82F6', twColor: 'bg-blue-600', shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
      { name: 'Bonds', percent: 30, color: '#8B5CF6', twColor: 'bg-violet-500', shadow: 'shadow-[0_0_12px_rgba(139,92,246,0.6)]' },
      { name: 'Gold ETFs', percent: 20, color: '#F59E0B', twColor: 'bg-amber-500', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]' },
      { name: 'Commodities', percent: 10, color: '#10B981', twColor: 'bg-emerald-500', shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]', sub: '(6% gold, 4% silver)' },
    ]
  },
  '14': {
    title: 'Dividend Aristocrats Portfolio',
    description: 'Focus: Passive Income and Stability. Engineered for users looking for regular cash flow.',
    rate: 0.06, 
    assets: [
      { name: 'Global Stocks', percent: 70, color: '#3B82F6', twColor: 'bg-blue-600', shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
      { name: 'REITs', percent: 20, color: '#8B5CF6', twColor: 'bg-violet-500', shadow: 'shadow-[0_0_12px_rgba(139,92,246,0.6)]' },
      { name: 'Cash/Liquidity', percent: 10, color: '#10B981', twColor: 'bg-emerald-500', shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]' },
    ]
  },
  '15': {
    title: 'The "Inflation Shield" Portfolio',
    description: 'Focus: Protecting purchasing power for conservative users worried about currency devaluation.',
    rate: 0.07,
    assets: [
      { name: 'Gold & Metals', percent: 40, color: '#F59E0B', twColor: 'bg-amber-500', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]' },
      { name: 'TIPS Bonds', percent: 30, color: '#8B5CF6', twColor: 'bg-violet-500', shadow: 'shadow-[0_0_12px_rgba(139,92,246,0.6)]' },
      { name: 'Commodities', percent: 20, color: '#EF4444', twColor: 'bg-red-500', shadow: 'shadow-[0_0_12px_rgba(239,68,68,0.6)]' },
      { name: 'Real Estate', percent: 10, color: '#3B82F6', twColor: 'bg-blue-600', shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
    ]
  },
  '16': {
    title: 'Global Tech Giants Portfolio',
    description: 'Focus: High Growth and Innovation. For users with a high risk tolerance wanting future exposure.',
    rate: 0.12,
    assets: [
      { name: 'Mega-Cap Tech', percent: 60, color: '#3B82F6', twColor: 'bg-blue-600', shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
      { name: 'Emerging Tech', percent: 20, color: '#8B5CF6', twColor: 'bg-violet-500', shadow: 'shadow-[0_0_12px_rgba(139,92,246,0.6)]' },
      { name: 'Cybersecurity', percent: 15, color: '#10B981', twColor: 'bg-emerald-500', shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]' },
      { name: 'Cloud ETFs', percent: 5, color: '#F59E0B', twColor: 'bg-amber-500', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]' },
    ]
  },
  '17': {
    title: 'The "Recession-Proof" Defensive Portfolio',
    description: 'Focus: Security and Low Volatility. A portfolio that stays stable even when the market crashes.',
    rate: 0.05,
    assets: [
      { name: 'Consumer Staples', percent: 40, color: '#3B82F6', twColor: 'bg-blue-600', shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
      { name: 'Utilities', percent: 30, color: '#F59E0B', twColor: 'bg-amber-500', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]' },
      { name: 'Govt Bonds', percent: 25, color: '#8B5CF6', twColor: 'bg-violet-500', shadow: 'shadow-[0_0_12px_rgba(139,92,246,0.6)]' },
      { name: 'Cash', percent: 5, color: '#10B981', twColor: 'bg-emerald-500', shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]' },
    ]
  }
};

export default function InvestmentVisualizer({ portfolioId }: { portfolioId: string }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(200);
  const [years, setYears] = useState(5);
  
  const portfolio = PORTFOLIO_DATA[portfolioId] || PORTFOLIO_DATA['4'];
  const estimatedReturnRate = portfolio.rate;

  // Future Value Formula: FV = PMT * (((1 + r/n)^(nt) - 1) / (r/n))
  const monthlyRate = estimatedReturnRate / 12;
  const totalMonths = years * 12;
  const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  const totalInvested = monthlyInvestment * totalMonths;
  const projectedProfit = futureValue - totalInvested;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

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
            {portfolio.description}
          </p>

          <div className="flex-1 flex items-center justify-center space-x-8 flex-wrap lg:flex-nowrap gap-y-8 mt-8">
            {/* Donut Chart SVG */}
            <div className="relative w-36 h-36 flex-shrink-0 drop-shadow-xl z-20 mx-auto">
              <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" strokeWidth="6" style={{ stroke: 'var(--card-border)' }}></circle>
                
                {portfolio.assets.reduce((acc: any, asset: any, index: number) => {
                  const currentOffset = acc.currentOffset;
                  acc.currentOffset -= asset.percent;
                  
                  acc.elements.push(
                    <circle 
                      key={index}
                      cx="21" cy="21" r="15.91549430918954" 
                      fill="transparent" 
                      stroke={asset.color} 
                      strokeWidth="6" 
                      strokeDasharray={`${asset.percent} ${100 - asset.percent}`} 
                      strokeDashoffset={currentOffset} 
                      className="transition-all duration-1000 ease-out drop-shadow-sm"
                    />
                  );
                  return acc;
                }, { currentOffset: 0, elements: [] }).elements}
              </svg>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-heading">{portfolio.assets.length}</span>
                <span className="text-[9px] text-foreground font-medium uppercase tracking-widest text-center mt-1">Assets</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-5 z-20">
              {portfolio.assets.map((asset: any, index: number) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${asset.twColor} ${asset.shadow} mt-0.5`}></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-heading leading-none">{asset.name}</span>
                      {asset.sub && <span className="text-xs text-foreground font-light mt-1.5">{asset.sub}</span>}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-heading leading-none">{asset.percent}%</span>
                </div>
              ))}
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
                <span className="text-xl font-bold text-blue-600">{monthlyInvestment} EUR</span>
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
               &quot;If I invest <b className="text-heading">{monthlyInvestment} EUR</b> monthly 
               for <b className="text-heading">{years} years</b>, with an estimated return of <b className="text-emerald-500">{(portfolio.rate * 100).toFixed(0)}%</b>, I will have...&quot;
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
