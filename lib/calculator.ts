import { CalculatorState, CalculationResult, Instrument, TradeDirection } from './types';
import { getAssetById } from './assets';

export const calculateRisk = (state: CalculatorState): CalculationResult => {
  const asset = getAssetById(state.assetId);
  const errors: string[] = [];

  // Initialize default result
  const result: CalculationResult = {
    isValid: false,
    errors: [],
    riskAmount: 0,
    riskPercentage: state.riskPercentage,
    positionSize: 0,
    lotSize: null,
    units: 0,
    notionalValue: 0,
    marginRequired: 0,
    stopLossDistance: 0,
    takeProfitDistance: 0,
    pipDistance: null,
    pipValue: null,
    potentialLoss: 0,
    potentialProfit: 0,
    riskRewardRatio: 0,
  };

  if (!asset) {
    errors.push('Please select a valid asset.');
    result.errors = errors;
    return result;
  }

  // Validations
  if (state.accountBalance <= 0) {
    errors.push('Account balance must be greater than zero.');
  }
  if (state.riskPercentage <= 0) {
    errors.push('Risk percentage must be greater than zero.');
  }
  if (state.entryPrice <= 0) {
    errors.push('Entry price must be greater than zero.');
  }
  if (state.stopLoss <= 0) {
    errors.push('Stop loss must be greater than zero.');
  }
  if (state.stopLoss === state.entryPrice) {
    errors.push('Stop loss cannot be equal to entry price.');
  }

  if (state.direction === 'BUY') {
    if (state.stopLoss > state.entryPrice) {
      errors.push('For a BUY trade, stop loss should be below entry price.');
    }
    if (state.takeProfit > 0 && state.takeProfit <= state.entryPrice) {
      errors.push('For a BUY trade, take profit should be above entry price.');
    }
  } else {
    // SELL
    if (state.stopLoss < state.entryPrice) {
      errors.push('For a SELL trade, stop loss should be above entry price.');
    }
    if (state.takeProfit > 0 && state.takeProfit >= state.entryPrice) {
      errors.push('For a SELL trade, take profit should be below entry price.');
    }
  }

  if (errors.length > 0) {
    result.errors = errors;
    return result;
  }

  // 1. Risk Amount
  const riskAmount = state.accountBalance * (state.riskPercentage / 100);
  result.riskAmount = riskAmount;
  result.potentialLoss = riskAmount; // By definition of position sizing

  // 2. Distances
  const slDistance = Math.abs(state.entryPrice - state.stopLoss);
  result.stopLossDistance = slDistance;

  if (state.takeProfit > 0) {
    const tpDistance = Math.abs(state.takeProfit - state.entryPrice);
    result.takeProfitDistance = tpDistance;
    result.riskRewardRatio = slDistance > 0 ? tpDistance / slDistance : 0;
  }

  // 3. Position Sizing
  // Assume Account Currency is same as Quote Currency for this V1 without live data.
  // Risk = Position Size (Units) * SL Distance
  // Units = Risk / SL Distance
  const rawUnits = riskAmount / slDistance;
  
  // Floor units based on quantity step
  const unitsStep = asset.quantityStep;
  let units = Math.floor(rawUnits / unitsStep) * unitsStep;
  
  if (units < asset.minQuantity) {
    errors.push(`Calculated position size is smaller than the minimum allowed quantity (${asset.minQuantity}).`);
    result.errors = errors;
    return result;
  }

  result.units = units;
  result.positionSize = units; // General term

  // Lot size for Forex/Commodities
  if (asset.assetClass !== 'crypto') {
    result.lotSize = units / asset.contractSize;
  }

  // 4. Pip calculations (mostly relevant for Forex, but useful for all)
  result.pipDistance = slDistance / asset.pipSize;
  result.pipValue = units * asset.pipSize;

  // 5. PnL
  if (state.takeProfit > 0) {
    result.potentialProfit = units * result.takeProfitDistance;
  }

  // 6. Value and Margin
  result.notionalValue = units * state.entryPrice;
  if (state.leverage > 0) {
    result.marginRequired = result.notionalValue / state.leverage;
  } else {
    result.marginRequired = result.notionalValue; // 1:1
  }

  result.isValid = true;
  return result;
};
