export type AssetClass = 'forex' | 'commodity' | 'crypto';

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  quoteCurrency: string;
  baseCurrency?: string;
  contractSize: number;
  lotSize: number;
  pipSize: number;
  tickSize: number;
  decimalPrecision: number;
  minQuantity: number;
  quantityStep: number;
}

export type TradeDirection = 'BUY' | 'SELL';

export interface CalculatorState {
  // Account
  accountBalance: number;
  accountCurrency: string;
  riskPercentage: number;
  
  // Trade
  assetId: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
}

export interface CalculationResult {
  isValid: boolean;
  errors: string[];
  
  // Core Risk Metrics
  riskAmount: number;
  riskPercentage: number;
  
  // Position
  positionSize: number;
  lotSize: number | null;
  units: number;
  notionalValue: number;
  marginRequired: number;
  
  // Distances
  stopLossDistance: number;
  takeProfitDistance: number;
  pipDistance: number | null;
  pipValue: number | null;
  
  // PnL & Reward
  potentialLoss: number;
  potentialProfit: number;
  riskRewardRatio: number;
}
