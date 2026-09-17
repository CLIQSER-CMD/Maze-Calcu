"use client"

import React, { useState } from 'react';
import { AssetClass, CalculatorState, CalculationResult, Instrument, TradeDirection } from '@/lib/types';
import { ASSETS } from '@/lib/assets';
import { calculateRisk } from '@/lib/calculator';
import { formatCurrency, formatNumber, formatCompactNumber, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, AlertCircle, Settings2, Wallet, Target, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Calculator() {
  const [activeTab, setActiveTab] = useState<AssetClass>('forex');
  const [state, setState] = useState<CalculatorState>({
    accountBalance: 10000,
    accountCurrency: 'USD',
    riskPercentage: 1,
    assetId: 'eurusd',
    direction: 'BUY',
    entryPrice: 1.10000,
    stopLoss: 1.09500,
    takeProfit: 1.11500,
    leverage: 100,
  });

  const result = calculateRisk(state);

  // Update defaults when asset changes
  const handleAssetSelect = (asset: Instrument) => {
    // Generate some fake default prices based on the asset for UX
    let entryPrice = 0;
    let stopLoss = 0;
    let takeProfit = 0;

    if (asset.symbol === 'EUR/USD') { entryPrice = 1.10000; stopLoss = 1.09500; takeProfit = 1.11500; }
    else if (asset.symbol === 'GBP/USD') { entryPrice = 1.25000; stopLoss = 1.24500; takeProfit = 1.26500; }
    else if (asset.symbol === 'USD/JPY') { entryPrice = 150.000; stopLoss = 149.500; takeProfit = 151.500; }
    else if (asset.symbol === 'XAU/USD') { entryPrice = 2000.00; stopLoss = 1990.00; takeProfit = 2030.00; }
    else if (asset.symbol === 'BTC/USD') { entryPrice = 65000.00; stopLoss = 64000.00; takeProfit = 68000.00; }
    else if (asset.symbol === 'ETH/USD') { entryPrice = 3500.00; stopLoss = 3400.00; takeProfit = 3800.00; }
    else { entryPrice = 100; stopLoss = 95; takeProfit = 115; }

    setState(prev => ({
      ...prev,
      assetId: asset.id,
      direction: 'BUY',
      entryPrice,
      stopLoss,
      takeProfit,
      leverage: asset.assetClass === 'crypto' ? 1 : (asset.assetClass === 'commodity' ? 20 : 100)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const selectedAsset = ASSETS.find(a => a.id === state.assetId);
  const filteredAssets = ASSETS.filter(a => a.assetClass === activeTab);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto">
      
      {/* Left Column: Configuration */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Asset Selection */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-heading font-semibold text-ivory">01 — Select Asset</h2>
          </div>
          
          <div className="flex space-x-2 mb-4 p-1 bg-maze-card rounded-xl border border-maze-border w-fit">
            {(['forex', 'commodity', 'crypto'] as AssetClass[]).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  const firstAsset = ASSETS.find(a => a.assetClass === tab);
                  if (firstAsset) handleAssetSelect(firstAsset);
                }}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                  activeTab === tab 
                    ? "bg-maze-border text-ivory shadow-sm" 
                    : "text-ivory-muted hover:text-ivory hover:bg-maze-border/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredAssets.map(asset => {
              const isSelected = state.assetId === asset.id;
              return (
                <button
                  key={asset.id}
                  onClick={() => handleAssetSelect(asset)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-xl border transition-all text-left group",
                    isSelected 
                      ? "border-gold-500 bg-gold-900/10 shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                      : "border-maze-border bg-maze-card hover:border-gold-500/50 hover:bg-maze-border/30"
                  )}
                >
                  <span className={cn("font-heading font-semibold text-lg leading-tight transition-colors", isSelected ? "text-gold-400" : "text-ivory")}>
                    {asset.symbol}
                  </span>
                  <span className="text-xs text-ivory-muted/70 mt-1 truncate w-full">
                    {asset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Configuration Form */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold text-ivory">02 — Trade Parameters</h2>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              
              {/* Account / Risk Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-maze-border/50">
                <div className="space-y-3">
                  <Label htmlFor="accountBalance" className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gold-500" /> Account Balance
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-muted">$</span>
                    <Input 
                      id="accountBalance"
                      name="accountBalance"
                      type="number" 
                      className="pl-7"
                      value={state.accountBalance || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="riskPercentage" className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gold-500" /> Risk Percentage (%)
                  </Label>
                  <div className="relative">
                    <Input 
                      id="riskPercentage"
                      name="riskPercentage"
                      type="number" 
                      step="0.1"
                      className="pr-8"
                      value={state.riskPercentage || ''} 
                      onChange={handleInputChange} 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-muted">%</span>
                  </div>
                </div>
              </div>

              {/* Direction Selection */}
              <div className="flex items-center gap-4">
                <Button 
                  type="button"
                  variant={state.direction === 'BUY' ? 'default' : 'outline'}
                  className={cn("flex-1", state.direction === 'BUY' && "bg-green-600 hover:bg-green-500 text-white border-green-600")}
                  onClick={() => setState(p => ({ ...p, direction: 'BUY' }))}
                >
                  <ArrowUp className="w-4 h-4" /> LONG / BUY
                </Button>
                <Button 
                  type="button"
                  variant={state.direction === 'SELL' ? 'default' : 'outline'}
                  className={cn("flex-1", state.direction === 'SELL' && "bg-red-600 hover:bg-red-500 text-white border-red-600")}
                  onClick={() => setState(p => ({ ...p, direction: 'SELL' }))}
                >
                  <ArrowDown className="w-4 h-4" /> SHORT / SELL
                </Button>
              </div>

              {/* Prices Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input 
                    id="entryPrice"
                    name="entryPrice"
                    type="number" 
                    step="any"
                    value={state.entryPrice || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input 
                    id="stopLoss"
                    name="stopLoss"
                    type="number" 
                    step="any"
                    value={state.stopLoss || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit (Opt.)</Label>
                  <Input 
                    id="takeProfit"
                    name="takeProfit"
                    type="number" 
                    step="any"
                    value={state.takeProfit || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </section>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-5 relative">
        <div className="sticky top-8 space-y-6">
          <h2 className="text-xl font-heading font-semibold text-ivory">03 — Position Size & Risk</h2>
          
          <AnimatePresence mode="popLayout">
            {!result?.isValid && result?.errors.length ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-950/40 border border-red-900/50 text-red-200 p-4 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-red-400">Invalid Configuration</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-red-200/80">{err}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Card className="overflow-hidden border-gold-900/30 bg-gradient-to-b from-maze-card to-maze-bg relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 opacity-50" />
            
            <CardContent className="p-6 md:p-8 space-y-8 mt-2">
              
              {/* Primary Metric: Position Size */}
              <div className="text-center">
                <p className="text-sm font-medium text-gold-400 tracking-widest uppercase mb-2">Recommended Position</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl md:text-6xl font-heading font-bold text-ivory tabular-nums tracking-tight">
                    {result?.isValid ? formatNumber(selectedAsset?.assetClass === 'forex' ? (result.lotSize || 0) : result.units, 2) : '0.00'}
                  </span>
                  <span className="text-xl text-ivory-muted font-medium">
                    {selectedAsset?.assetClass === 'forex' ? 'Lots' : 'Units'}
                  </span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1715] p-4 rounded-xl border border-maze-border/50">
                  <p className="text-xs text-ivory-muted uppercase tracking-wider mb-1">Risk Amount</p>
                  <p className="text-xl font-heading font-semibold text-red-400">
                    -{result?.isValid ? formatCurrency(result.riskAmount, 'USD', 2) : '$0.00'}
                  </p>
                  <p className="text-xs text-ivory-muted/60 mt-1">{state.riskPercentage}% of account</p>
                </div>
                
                <div className="bg-[#1A1715] p-4 rounded-xl border border-maze-border/50">
                  <p className="text-xs text-ivory-muted uppercase tracking-wider mb-1">Potential Profit</p>
                  <p className="text-xl font-heading font-semibold text-green-400">
                    +{result?.isValid ? formatCurrency(result.potentialProfit, 'USD', 2) : '$0.00'}
                  </p>
                  <p className="text-xs text-ivory-muted/60 mt-1">At Take Profit</p>
                </div>
              </div>

              {/* Risk / Reward Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ivory-muted font-medium">Risk : Reward Ratio</span>
                  <span className="font-heading font-bold text-ivory">
                    1 : {result?.isValid ? formatNumber(result.riskRewardRatio, 2) : '0.00'}
                  </span>
                </div>
                <div className="h-2 w-full bg-maze-border rounded-full overflow-hidden flex">
                  {result?.isValid && result.riskRewardRatio > 0 ? (
                    <>
                      <div className="bg-red-500 h-full" style={{ width: `${100 / (1 + result.riskRewardRatio)}%` }} />
                      <div className="bg-green-500 h-full" style={{ width: `${(result.riskRewardRatio * 100) / (1 + result.riskRewardRatio)}%` }} />
                    </>
                  ) : (
                    <div className="bg-maze-border w-full h-full" />
                  )}
                </div>
              </div>

              {/* Secondary Details */}
              <div className="pt-6 border-t border-maze-border/50 grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-xs text-ivory-muted mb-0.5">Notional Value</p>
                  <p className="font-medium text-sm text-ivory">{result?.isValid ? formatCurrency(result.notionalValue) : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-ivory-muted mb-0.5">Quantity</p>
                  <p className="font-medium text-sm text-ivory">{result?.isValid ? formatNumber(result.units) : '-'}</p>
                </div>
                {selectedAsset?.assetClass === 'forex' && (
                  <>
                    <div>
                      <p className="text-xs text-ivory-muted mb-0.5">Pip Distance (SL)</p>
                      <p className="font-medium text-sm text-ivory">{result?.isValid && result.pipDistance ? formatNumber(result.pipDistance, 1) : '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ivory-muted mb-0.5">Pip Value</p>
                      <p className="font-medium text-sm text-ivory">{result?.isValid && result.pipValue ? formatCurrency(result.pipValue) : '-'}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
