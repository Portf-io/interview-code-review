export type InvestorId = string;
export type InvestmentId = string;
export type DrawdownId = string;
export type Currency = string;
export type Amount = number;

export interface DrawdownCalculation {
  drawdownId: DrawdownId;
  originalAmount: Amount;
  convertedAmount: Amount;
  currency: Currency;
}

