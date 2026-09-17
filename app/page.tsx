import React from 'react';
import { Calculator } from '@/components/calculator/Calculator';
import { Target, ShieldCheck, Activity, BarChart3, TrendingUp, Info } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-maze-bg selection:bg-gold-500/30">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-maze-border/50 bg-maze-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded border border-gold-500/50 flex items-center justify-center bg-gold-900/20 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              <BarChart3 className="w-4 h-4 text-gold-400" />
            </div>
            <span className="font-heading font-bold text-lg tracking-wide text-ivory">
              TRADING MAZE
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ivory-muted">
            <a href="#calculator" className="hover:text-gold-400 transition-colors">Calculator</a>
            <a href="#how-it-works" className="hover:text-gold-400 transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center">
            <a href="#calculator" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              Start Calculating
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-900/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-8 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
            <Target className="w-4 h-4" /> Professional Risk Management
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-ivory max-w-4xl mb-6 leading-[1.1]">
            Calculate Your Risk.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
              Trade With Precision.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-ivory-muted max-w-2xl mb-10 leading-relaxed">
            Professional position sizing and risk management for Forex, Commodities and Crypto traders. Protect your capital and maximize returns.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="#calculator" className={cn(buttonVariants({ size: 'lg' }), "w-full sm:w-auto text-maze-bg")}>
              Open Calculator
            </a>
            <a href="#how-it-works" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "w-full sm:w-auto")}>
              How It Works
            </a>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="w-full border-y border-maze-border/50 bg-[#0C0A09] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold text-ivory mb-4">Master Your Risk in 4 Steps</h2>
              <p className="text-ivory-muted">A systematic approach to professional trading.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'CHOOSE ASSET', desc: 'Select the instrument you want to trade from our curated list of major pairs, commodities, and crypto.' },
                { step: '02', title: 'DEFINE YOUR RISK', desc: 'Enter your account size and the percentage of capital you are willing to risk on this trade.' },
                { step: '03', title: 'SET YOUR TRADE', desc: 'Input your planned entry price, stop loss, and optional take profit target.' },
                { step: '04', title: 'GET POSITION SIZE', desc: 'Trading Maze instantly calculates your optimal position size, pip value, and risk/reward ratio.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col p-6 rounded-2xl bg-maze-bg/50 border border-maze-border/50">
                  <span className="text-gold-500 font-heading font-bold text-2xl mb-4">{item.step}</span>
                  <h3 className="text-lg font-bold text-ivory mb-3">{item.title}</h3>
                  <p className="text-sm text-ivory-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALCULATOR SECTION */}
        <section id="calculator" className="w-full py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-3xl font-heading font-bold text-ivory mb-2">Position Size Calculator</h2>
              <p className="text-ivory-muted">Configure your trade parameters below to get instant risk metrics.</p>
            </div>
            
            <Calculator />
            
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-maze-border/50 bg-[#0C0A09] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-gold-500" />
            <span className="font-heading font-bold text-xl text-ivory tracking-wide">TRADING MAZE</span>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-maze-bg border border-maze-border rounded-xl max-w-3xl mb-8 text-left">
            <Info className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-ivory-muted/80 leading-relaxed">
              <strong>Disclaimer:</strong> Trading Maze is a calculation and risk-management tool. It does not provide financial advice, investment recommendations, or trading signals. Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. Always verify instrument specifications with your broker before placing a trade.
            </p>
          </div>
          
          <p className="text-sm text-ivory-muted/60">
            &copy; {new Date().getFullYear()} Trading Maze. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
