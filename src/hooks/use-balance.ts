import { type Config, useChainId, useConfig } from 'wagmi'
import { getBalanceQueryOptions, hashFn, readContractQueryOptions } from 'wagmi/query'
import { type Address, type Chain, erc20Abi, formatUnits } from 'viem'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { Token, ERC20Token } from '@/types'

export type WalletBalance = {
  decimals: number
  symbol: string
  value: bigint
  formatted: string
}

const evmNativeBalanceQueryOptions = (config: Config, address?: Address, chainId?: number) => {
  return getBalanceQueryOptions(config, {
    address: address,
    chainId,
  }) as unknown as UseQueryOptions<WalletBalance>
}

const evmContractBalanceQueryOptions = (config: Config, address: Address, chainId: number, token: ERC20Token) => {
  const options = readContractQueryOptions(config, {
    abi: erc20Abi,
    chainId,
    address: token.contract,
    functionName: 'balanceOf',
    args: [address],
  })

  const queryFn = options.queryFn
  return {
    ...options,
    queryFn: async (args: Parameters<typeof queryFn>[0]) => {
      const res = await queryFn(args)
      return {
        decimals: token.decimals,
        symbol: token.symbol,
        value: res,
        formatted: formatUnits(res, token.decimals),
      }
    },
  } as unknown as UseQueryOptions<WalletBalance>
}

export function useBalance({ address, token, chain }: { address?: Address; token?: Token; chain?: Chain }) {
  const config = useConfig()
  const chainId = useChainId()
  let options: UseQueryOptions<WalletBalance> = {
    queryKey: ['balance', { address, token, chainId }],
  }

  if (token?.type === 'erc20') {
    options = evmContractBalanceQueryOptions(config, address as Address, chain?.id || chainId, token)
  } else {
    options = evmNativeBalanceQueryOptions(config, address, chain?.id || chainId)
  }
  options.enabled = !!address && !!token && !!chain
  options.queryKeyHashFn = hashFn

  return useQuery<WalletBalance>({ ...options })
}
