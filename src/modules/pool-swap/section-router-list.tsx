import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { btrTestnet } from 'viem/chains'
import { Spinner } from '@/components/ui/spinner'
import { useRouterSwap } from './quick-swap-context'
import { getTokenImageUrl, shortAddress } from '@/lib/utils'
import { btr_testnet_btc, btr_testnet_usdt, btr_testnet_yusd } from './constant'
import { Token } from '@/types'

export function SectionRouterList() {
  // const [selectedChainId, setSelectedChainId] = useState<string>(btrTestnet.id.toString())
  const { chainId } = useAccount()
  const { routerSwapAsync, isPending: isRouterPending } = useRouterSwap();

  const onRouterSwap = (fromToken: Token, toToken: Token, amount: number) => {
    return routerSwapAsync({
      inputToken: fromToken,
      outputToken: toToken,
      amount,
      slippage: 0.005,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Router Swap</CardTitle>
        <CardDescription>Connect wallet to enable other functions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 mb-6">
          {[
            {
              fromToken: btr_testnet_btc,
              toToken: btr_testnet_yusd,
              amount: 0.001,
            },
            {
              fromToken: btr_testnet_yusd,
              toToken: btr_testnet_btc,
              amount: 200,
            },
            {
              fromToken: btr_testnet_btc,
              toToken: btr_testnet_usdt,
              amount: 0.001,
            },
            {
              fromToken: btr_testnet_usdt,
              toToken: btr_testnet_btc,
              amount: 200,
            },
          ].map((item) => (
            <div className="flex gap-2 items-center justify-between border-b pb-2">
              <div>
                <div className='flex items-center text-sm'>
                  <img
                    src={getTokenImageUrl(item.fromToken.contract.toLowerCase(), chainId)}
                    alt={item.fromToken.contract}
                    className="size-6 md:size-7"
                    loading="lazy"
                    decoding="async"
                  // onError={(e) => {
                  //   e.currentTarget.src = 'https://bitzap.ai/images/default-crypto.png'
                  // }}
                  />
                  <span className='ml-1 flex items-center'>
                    {item.fromToken.symbol}({shortAddress(item.fromToken.contract)})
                  </span>
                </div>
              </div>
              <div>
                <div className='flex items-center text-sm'>
                  <img
                    src={getTokenImageUrl(item.toToken.contract.toLowerCase(), chainId)}
                    alt={item.toToken.contract}
                    className="size-6 md:size-7"
                    loading="lazy"
                    decoding="async"
                  // onError={(e) => {
                  //   e.currentTarget.src = 'https://bitzap.ai/images/default-crypto.png'
                  // }}
                  />
                  <span className='ml-1 flex items-center'>
                    {item.toToken.symbol}({shortAddress(item.toToken.contract)})
                  </span>
                </div>
              </div>
              <div>{item.amount}</div>
              <Button
                variant="default"
                onClick={() => onRouterSwap(item.fromToken, item.toToken, item.amount)}
                disabled={isRouterPending}
              >
                <div className='flex items-center'>
                  Swap
                  {isRouterPending && <Spinner className="size-4 ml-2" />}
                </div>
              </Button>
            </div>
          ))}

        </div>
      </CardContent>
    </Card>
  )
}
