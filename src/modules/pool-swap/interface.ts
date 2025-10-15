import { Token } from '@/types';

export interface Pool {
  address: string;
  poolUrl: string;
  underlyingCoins: Token[];
}

export interface PoolSwapRequest {
  inputCoin: string;
  outputCoin: string;
  amount: number | string;
  slippage: number;
  poolAddress: string;
}

export interface RouterSwapRequest {
  inputToken: Token;
  outputToken: Token;
  amount: number | string;
  slippage?: number;
}
