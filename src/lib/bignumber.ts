// bignumber.js

import { BigNumber } from 'bignumber.js'
import { formatUnits, parseUnits } from 'viem'

export { BigNumber }

export const checkNumber = (n: number | string): number | string => {
  if (Number(n) !== Number(n)) throw Error(`${n} is not a number`) // NaN
  return n
}

export const BN = (val: number | string): BigNumber => new BigNumber(checkNumber(val))

export const toBN = (n: bigint, decimals = 18): BigNumber => {
  return BN(formatUnits(n, decimals))
}

export const toStringFromBN = (bn: BigNumber, decimals = 18): string => {
  return bn.toFixed(decimals)
}

export const fromBN = (bn: BigNumber, decimals = 18): bigint => {
  return parseUnits(toStringFromBN(bn, decimals), decimals)
}
