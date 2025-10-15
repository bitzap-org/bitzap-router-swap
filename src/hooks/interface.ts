export interface LPRewardsToken {
  claimedRewards: bigint
  decimals: number
  formattedPendingRewards: string
  pendingRewards: bigint
  tokenAddress: string
}

export interface lpCoin {
  address: string
  decimals: number
  name?: string
  symbol: string
}

export interface LPPoolInfo {
  decimals: number
  endTime: bigint
  formattedUserStakeAmount: string
  lockSeconds: bigint
  lpTokens: string[]
  lpCoins: lpCoin[]
  maxStakeAmount: bigint
  participantCounts: bigint
  poolId: bigint
  poolType: bigint
  stakeAmount: bigint
  startTime: bigint
  token: string
  userStakeAmount: bigint
  userStakePower: bigint
  userStakeRewardsTokens: LPRewardsToken[]
  withdrawRewardAllow: bigint
  lpPrice: bigint
  formattedLpPrice: string
  userStakeAmountUsd: string
  apr: string;
  powerRatio: bigint
  formattedPowerRatio: string
  formattedMaxStakeAmount: string
}
