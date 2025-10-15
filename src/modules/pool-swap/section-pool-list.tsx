import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { usePoolSwap, useTokens } from './quick-swap-context'
import { shortAddress } from '@/lib/utils'
import { Pool } from './interface'
import { Spinner } from '@/components/ui/spinner'

export function SectionPoolList() {
  // const [selectedChainId, setSelectedChainId] = useState<string>(btrTestnet.id.toString())
  // const { address, connector, chain, chainId } = useAccount()
  // const { chains, switchChain } = useSwitchChain()
  const { tokens, swapPools } = useTokens();
  const { poolSwapAsync, isPending } = usePoolSwap();

  const onPoolSwap = (pool: Pool) => {
    return poolSwapAsync({
      inputCoin: pool.underlyingCoins[0].contract,
      outputCoin: pool.underlyingCoins[1].contract,
      amount: 3,
      slippage: 0.005,
      poolAddress: pool.address,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pool Swap</CardTitle>
        <CardDescription>Connect wallet to enable other functions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 mb-6">
          {swapPools.map((item: any, index: number) => {
            return (
              <div key={index} className="flex gap-2 items-center justify-between border-b pb-2">
                <div>
                  <div className='flex items-center text-sm'>
                    {/* <img
                      src={getTokenImageUrl(item.underlyingCoins[0].address.toLowerCase(), chainId)}
                      alt={item.tokenAddress}
                      className="size-6 md:size-7"
                      loading="lazy"
                      decoding="async"
                      // onError={(e) => {
                      //   e.currentTarget.src = 'https://bitzap.ai/images/default-crypto.png'
                      // }}
                    /> */}
                    <span className='ml-1 flex items-center'>
                      {item.underlyingCoins[0].symbol}({shortAddress(item.underlyingCoins[0].address)})
                    </span>
                  </div>
                  <div className='text-sm'>Balance: {item.balance}</div>
                </div>
                <div>
                  <div className='flex items-center text-sm'>
                    {/* <img
                      src={getTokenImageUrl(item.underlyingCoins[1].address.toLowerCase(), chainId)}
                      alt={item.tokenAddress}
                      className="size-6 md:size-7"
                      loading="lazy"
                      decoding="async"
                      // onError={(e) => {
                      //   e.currentTarget.src = 'https://bitzap.ai/images/default-crypto.png'
                      // }}
                    /> */}
                    <span className='ml-1 flex items-center'>
                      {item.underlyingCoins[1].symbol}({shortAddress(item.underlyingCoins[1].address)})
                    </span>
                  </div>
                  <div className='text-sm'>Balance: {item.balance}</div>
                </div>
                <Button variant="default" onClick={() => onPoolSwap(item)} disabled={isPending}>
                  <div className='flex items-center'>
                    Swap
                    {isPending && <Spinner className="size-4 ml-2" />}
                  </div>
                </Button>
              </div>
            )
          })}
        </div>

      </CardContent>
    </Card>
  )
}
