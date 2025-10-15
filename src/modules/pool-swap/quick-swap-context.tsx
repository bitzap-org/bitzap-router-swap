import React, { useEffect, useState } from 'react'
import { useAccount, useConfig, useReadContract, useConnect, useSwitchChain } from 'wagmi'
import { useMutation, useQuery } from '@tanstack/react-query'
import poolAbi from '@/abis/pool-swap.json'
import routerAbi from '@/abis/router-swap.json'
import {
  Address,
  BaseError,
  encodeFunctionData,
  Hex,
  InsufficientFundsError,
  parseEther,
  UserRejectedRequestError,
  formatUnits,
  parseUnits,
} from 'viem'
import axios from 'axios'
import { estimateFeesPerGas, estimateGas, waitForTransactionReceipt, readContract, writeContract, readContracts } from 'wagmi/actions'
import { useToast } from '@/components/ui/toast'
import { btr, btrTestnet } from 'wagmi/chains'
import { btr_btc, btr_testnet_btc, btr_testnet_usdt, btr_usdt, SWAP_POOLS } from './constant'
import { Pool, PoolSwapRequest, RouterSwapRequest } from './interface'
import { getCoinIdx, swapCheck, swapMinAmount } from './utils'
import { RouterMap } from './router-map'
import { Token } from '@/types'
import { useBalance } from '@/hooks/use-balance'
import { CURVE_API_BASE_URL, CURVE_NETWORK, CURVE_ROUTER_SWAP_ADDRESS, isProduction } from '@/lib/utils'

export const RouterContractAddress = CURVE_ROUTER_SWAP_ADDRESS
export const expectedChain = isProduction ? btr : btrTestnet
export const defaultTokens = isProduction
  ? {
    fromToken: btr_btc,
    toToken: btr_usdt,
  }
  : {
    fromToken: btr_testnet_btc,
    toToken: btr_testnet_usdt,
  }

export type WalletBalance = {
  decimals: number
  symbol: string
  value: bigint
  formatted: string
}

type PriceMap = undefined | {
  [key: string]: string;
}

type QuickSwapContextData = {
  formValues: {
    fromToken: Token
    toToken: Token
    fromAmount: string
    toAmount: string
  }
  setFormValues: (values: QuickSwapContextData['formValues']) => void
  txHash: string | undefined
  setTxHash: (txHash: string | undefined) => void
  userBalanceFrom: WalletBalance | undefined
  userBalanceTo: WalletBalance | undefined
  refreshBalance: () => Promise<void>
  resetFormValuesAndTxHash: () => void
  isSwapPending: boolean
  setIsSwapPending?: (isPending: boolean) => void

  priceMap: PriceMap
  // refreshPool: (poolId: bigint) => void
}

const QuickSwapContext = React.createContext<QuickSwapContextData>({} as QuickSwapContextData)

export function QuickSwapProvider({ children }: { children: React.ReactNode }) {
  const { address, chain, chainId } = useAccount()
  const [formValues, setFormValues] = useState<QuickSwapContextData['formValues']>({
    ...defaultTokens,
    fromAmount: '',
    toAmount: '',
  })
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [isSwapPending, setIsSwapPending] = useState<boolean>(false)
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()

  const { getPriceMap } = useUtils()

  const { data: priceMap = null } = useQuery<any, Error>({
    queryKey: ['quick-swap/getPrice'],
    queryFn: async () => {
      const _priceMap = await getPriceMap()
      return _priceMap
    },
  })

  const { data: userBalanceFrom, refetch: refetchBalanceFrom } = useBalance({
    address,
    token: formValues.fromToken,
    chain,
  })
  const { data: userBalanceTo, refetch: refetchBalanceTo } = useBalance({
    address,
    token: formValues.toToken,
    chain,
  })

  const refreshBalance = async () => {
    await refetchBalanceFrom()
    await refetchBalanceTo()
  }

  const resetFormValuesAndTxHash = () => {
    setFormValues({
      ...formValues,
      fromAmount: '',
      toAmount: '',
    })
    setTxHash('')
  }

  return (
    <QuickSwapContext.Provider
      value={{
        formValues,
        setFormValues,
        txHash,
        setTxHash,
        userBalanceFrom,
        userBalanceTo,
        refreshBalance,
        resetFormValuesAndTxHash,
        isSwapPending,
        setIsSwapPending,
        priceMap,
      }}
    >
      {children}
    </QuickSwapContext.Provider>
  )
}

export function useQuickSwapContext() {
  return React.useContext(QuickSwapContext)
}

export function useTokens() {
  const tokens = SWAP_POOLS
    .map((item) => item.underlyingCoins)
    .flat()
    .reduce((pre: Token[], cur: Token) => {
      if (pre.find((token: Token) => token.contract === cur.contract)) {
        return pre;
      }
      return [...pre, cur]
    }, [btr_testnet_btc] as Token[])

  return {
    swapPools: SWAP_POOLS,
    tokens
  }
}

export function usePoolSwap() {
  const { address, chainId } = useAccount()
  const config = useConfig()
  const { toast } = useToast()
  const { } = React.useContext(QuickSwapContext)
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { handleException } = useHandleException()
  const { swapPools } = useTokens()


  const handleConnect = async () => {
    if (chainId !== expectedChain.id) {
      await switchChainAsync({ chainId: expectedChain.id })
    }

    const connector = connectors.find((c) => c.id === 'web3-onboard')
    if (!connector) {
      return
    }
    await connect({ connector, chainId: expectedChain.id })
  }

  const {
    mutate: poolSwap,
    mutateAsync: poolSwapAsync,
    isPending,
    ...mutation
  } = useMutation({
    mutationFn: async ({ inputCoin, outputCoin, amount, slippage, poolAddress, }: PoolSwapRequest) => {
      if (!address) {
        return handleConnect()
      }

      if (!poolAddress || !amount) {
        throw new Error('Swap not ready')
      }

      try {
        const pool = (swapPools.find((pool) => pool.address === poolAddress)) as Pool
        console.log(99991, 'pool:', pool)
        const [i, j, in_amount] = await swapCheck(inputCoin, outputCoin, amount, pool);
        console.log(99992, 'i, j, in_amount:', i, j, in_amount, 'config:', config)

        const _expected = await readContract(config, {
          abi: poolAbi,
          address: poolAddress as Address,
          functionName: 'get_dy',
          args: [i, j, in_amount],
          chainId: expectedChain.id,
        })
        console.log(99993, '_expected:', _expected)
        const min_amount = await swapMinAmount(_expected as bigint, slippage, pool.underlyingCoins[j].decimals);
        console.log(99994, 'min_amount:', min_amount)

        const functionName = 'exchange'
        const args = [i, j, in_amount, min_amount] as const
        console.log(99995, 'args:', args)

        // const feesPerGas = await estimateFeesPerGas(config)
        // const gas = await estimateGas(config, {
        //   data: encodeFunctionData({
        //     ...ContractInfo,
        //     functionName,
        //     args,
        //   }),
        // })

        let result: Hex = await writeContract(config, {
          abi: poolAbi,
          address: poolAddress as Address,
          functionName,
          args,
          // gas: gas,
          // maxFeePerGas: feesPerGas.maxFeePerGas,
          // maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas,
        })
        console.log(99996, 'result:', result)

        await waitForTransactionReceipt(config, {
          hash: result,
        })

        // await refreshPool(params.poolId)
        toast.success('Swap success', { duration: 5000 })
        return result

      } catch (e: unknown) {
        handleException({
          e,
          customErrorMessage: 'Swap failed',
        })
      } finally {
      }
    },
  })

  return {
    poolSwap,
    poolSwapAsync,
    isPending: isPending,
    ...mutation,
  }
}

export function useRouterSwap() {
  const { address, chainId } = useAccount()
  const config = useConfig()
  const { toast } = useToast()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { handleException } = useHandleException()
  const {
    formValues,
    setTxHash,
    refreshBalance,
    setIsSwapPending,
  } = React.useContext(QuickSwapContext)

  const handleConnect = async () => {
    if (chainId !== expectedChain.id) {
      await switchChainAsync({ chainId: expectedChain.id })
    }

    const connector = connectors.find((c) => c.id === 'web3-onboard')
    if (!connector) {
      return
    }
    await connect({ connector, chainId: expectedChain.id })
  }

  const {
    mutateAsync: expectedAsync,
    isPending: isExpectedPending,
  } = useMutation({
    mutationFn: async ({ inputToken, outputToken, amount }: RouterSwapRequest) => {
      if (!address || !amount) {
        return ''
      }

      try {
        const routerMap = RouterMap
        const routeKey = `${inputToken.symbol.toLowerCase()}-${outputToken.symbol.toLowerCase()}`
        console.log(99991, `routeKey: ${routeKey}`, 'routerMap:', RouterContractAddress, routerMap)

        if (!routerMap[routeKey]) {
          return '-1';
        }

        const _route: string[] = routerMap[routeKey]._route;
        const _swap_params: number[][] = routerMap[routeKey]._swap_params

        const in_amount = parseUnits(amount.toString(), inputToken.decimals)

        const _expected: any = await readContract(config, {
          abi: routerAbi,
          address: RouterContractAddress as Address,
          functionName: 'get_dy',
          args: [_route, _swap_params, in_amount],
        })
        return formatUnits(_expected, outputToken.decimals)

      } catch (e: unknown) {
        console.log('get_dy error:', e)
      }
    },
  })

  const {
    mutate: routerSwap,
    mutateAsync: routerSwapAsync,
    isPending,
    ...mutation
  } = useMutation({
    mutationFn: async ({ inputToken, outputToken, amount, slippage, }: RouterSwapRequest) => {
      if (!address) {
        return handleConnect()
      }

      if (!amount) {
        throw new Error('Swap not ready')
      }

      try {
        const routerMap = RouterMap
        console.log(99991, 'routerMap:', RouterContractAddress, routerMap)

        const routeKey = `${inputToken.symbol.toLowerCase()}-${outputToken.symbol.toLowerCase()}`
        console.log(99991, `routeKey: ${routeKey}`, 'routerMap:', RouterContractAddress, routerMap)
        const _route: string[] = routerMap[routeKey]._route;
        const _swap_params: number[][] = routerMap[routeKey]._swap_params
        const in_amount = parseUnits(amount.toString(), inputToken.decimals)
        console.log(99992, [_route, _swap_params, in_amount])

        const _expected = await readContract(config, {
          abi: routerAbi,
          address: RouterContractAddress as Address,
          functionName: 'get_dy',
          args: [_route, _swap_params, in_amount],
        })
        // const _expected = 129137903500549264380n
        console.log(99993, '_expected:', _expected)
        const min_amount = await swapMinAmount(_expected as bigint, slippage, outputToken.decimals);
        console.log(99994, 'min_amount:', min_amount)

        const functionName = 'exchange'
        const args = [_route, _swap_params, in_amount, min_amount] as const
        console.log(99995, 'args:', args)

        const params = {
          abi: routerAbi,
          address: RouterContractAddress as Address,
          functionName,
          args,
          value: inputToken.symbol.toLowerCase() === 'btc' ? in_amount : 0n,
        }

        // const feesPerGas = await estimateFeesPerGas(config)
        // console.log(99996, 'feesPerGas:', feesPerGas)
        // const gas = await estimateGas(config, {
        //   data: encodeFunctionData({
        //     ...params,
        //   }),
        // })
        // console.log(99997, 'gas:', gas)

        let result: Hex = await writeContract(config, {
          ...params,
          // gas: gas,
          // maxFeePerGas: feesPerGas.maxFeePerGas,
          // maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas,
        })
        console.log(99998, 'result:', result)

        await waitForTransactionReceipt(config, {
          hash: result,
        })

        // await refreshPool(params.poolId)
        toast.success('Swap success', { duration: 5000 })
        return result

      } catch (e: unknown) {
        handleException({
          e,
          customErrorMessage: 'Swap failed',
        })
      } finally {
        refreshBalance()
      }
    },
  })

  useEffect(() => {
    setIsSwapPending?.(isPending)
  }, [isPending, setIsSwapPending])

  return {
    routerSwap,
    routerSwapAsync,
    expectedAsync,
    isExpectedPending,
    isPending: isPending,
    ...mutation,
  }
}

export const useUtils = () => {
  const config = useConfig()

  const getPriceMap = async () => {
    const res = await getTokensPrice()
    const priceMap = res.reduce((acc: any, item: any) => {
      acc[item.address.toLowerCase()] = item.price
      return acc
    }, {})
    return priceMap as PriceMap
  }

  return {
    getPriceMap,
  }
}

export const useHandleException = () => {
  const { toast } = useToast()

  const handleException = ({
    e,
    customErrorMessage,
  }: { e: unknown, customErrorMessage?: string }) => {
    if (e instanceof BaseError) {
      const userRejected = e.walk(
        (error) => error instanceof UserRejectedRequestError
      ) as UserRejectedRequestError | null
      if (userRejected) {
        return toast.info('User rejected request', { duration: 5000 })
      }

      const insufficientFunds = e.walk(
        (error) => error instanceof InsufficientFundsError
      ) as InsufficientFundsError | null
      if (insufficientFunds) {
        console.warn('InsufficientFundsError:', insufficientFunds.details)
        return toast.error('Insufficient BTC Balance', { duration: 5000 })
      }
    }

    if (e instanceof Error) {
      toast.error(customErrorMessage || e?.message, { duration: 5000 })
    }
    console.error('Error:', e)
  }

  return { handleException }
}

export const getTokensPrice = async () => {
  const url = `${CURVE_API_BASE_URL}/v1/getPrice/${CURVE_NETWORK}`
  const response = await axios.get(url, { validateStatus: () => true })
  return response.data?.data?.list ?? []
}
