import { BigNumber, fromBN, toBN } from '@/lib/bignumber'
import { parseUnits } from 'viem'
import { Pool } from './interface'

export const swapCheck = async (
  inputCoin: string,
  outputCoin: string,
  amount: number | string,
  pool: Pool,
): Promise<[number, number, bigint]> => {
  const i = getCoinIdx(inputCoin, pool)
  const j = getCoinIdx(outputCoin, pool)
  const _amount = parseUnits(amount.toString(), pool.underlyingCoins[i].decimals)

  return [i, j, _amount]
}

export const getCoinIdx = (coinAddress: string, pool: Pool): number => {
  const lowerCaseCoinAddress = coinAddress.toLowerCase()
  const lowerCaseCoinAddresses = pool?.underlyingCoins.map((c) => (c.contract || (c as any).address).toLowerCase()) || []

  const idx = lowerCaseCoinAddresses.indexOf(lowerCaseCoinAddress)
  return idx
}

export const swapMinAmount = (_amount: bigint, slippage = 0.5, decimals: number): bigint => {
  const minAmountBN: BigNumber = toBN(_amount, decimals)
    .times(100 - slippage)
    .div(100)

  return fromBN(minAmountBN, decimals)
}
