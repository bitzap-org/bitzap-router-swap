import { cn } from '@/lib/utils'
import { useQuickSwapContext, useRouterSwap } from './quick-swap-context'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Address, parseUnits } from 'viem'
import { maxAllowance, useApprove } from '@/hooks/approve'
import TokenSelectDialog from './token-select-dialog'
import { ArrowDown } from '@/components/icons/ArrowDown'
import { Spinner } from '@/components/ui/spinner'
import { InfoSquareIcon } from '@/components/icons/info'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HashInfoBar } from '@/components/hash-info-bar'
import { AlertInfoBar } from '@/components/alert-info-bar'
import { useToast } from '@/components/ui/toast'
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input'

export function SectionQuickSwap() {
  const { toast } = useToast()

  const { formValues, setFormValues, txHash, setTxHash, userBalanceFrom, userBalanceTo, resetFormValuesAndTxHash, isSwapPending } = useQuickSwapContext()
  const { fromAmount, fromToken, toAmount, toToken } = formValues

  const { expectedAsync, isExpectedPending } = useRouterSwap();

  const handleToAmountChange = async (value: string) => {
    const expected = await expectedAsync({
      inputToken: fromToken,
      outputToken: toToken,
      amount: value,
    })
    let _toAmount = expected || ''
    if (expected === '-1') {
      toast.error('Swap failed, please check the token pair')
      _toAmount = ''
    }
    setFormValues({
      ...formValues,
      toAmount: _toAmount,
    })
  }

  const debouncedHandleToAmountChange = useDebouncedCallback(handleToAmountChange, 700);

  const onChangeFromAmount = async (value: string) => {
    setFormValues({
      ...formValues,
      fromAmount: value,
    })

    debouncedHandleToAmountChange(value)
  }

  const onMaxClick = () => {
    if (userBalanceFrom) {
      const maxValue = userBalanceFrom.formatted
      onChangeFromAmount(maxValue)
    }
  }

  return (
    <div className='w-full'>
      <div className="relative flex flex-col gap-4">
        {/* From Token */}
        <div
          className={cn('border-[1px] border-solid border-input bg-input px-5 py-5 md:py-6 rounded-xs', {
            'border-error': Number(userBalanceFrom?.formatted || 0) < Number(fromAmount),
          })}
        >
          <div className={cn('bg-input rounded-xs flex gap-2 relative py-0 px-0 items-start')}>
            <div className='grid gap-1 grow'>
              <label className="inline-block text-[11px]/4 text-foreground font-light" >
                Avail. <span>{userBalanceFrom?.formatted || 0}</span>
              </label>
              <Input
                id="inpFromAmount"
                type="text"
                value={fromAmount}
                className="w-full bg-transparent disabled:opacity-100 focus:outline-0 focus:border-none focus-within:border-none focus-within:ring-0 focus-visible:border-none focus-visible:ring-0 font-[700] md:text-3xl placeholder:text-muted placeholder:font-[700] placeholder:font-sans md:placeholder:text-3xl px-0 border-none shadow-none md:focus:text-3xl md:focus-within:text-3xl md:focus-visible:text-3xl"
                placeholder="0"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeFromAmount(e.target.value)}
                autoComplete='off'
                autoFocus
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <TokenSelectDialog tokenType="from" />
              <div className='flex items-center justify-center'>
                <Button
                  onClick={onMaxClick}
                  size="default"
                  className={cn(
                    'bg-transparent !rounded-[10px] !px-3 !py-1 font-title !font-[300] w-fit h-fit !text-xs/[1] text-foreground border-foreground',

                  )}
                  variant="outline"
                  light
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>
          <div className={cn('text-error text-xs opacity-0', {
            "opacity-100": Number(userBalanceFrom?.formatted || 0) < Number(fromAmount)
          })}>
            {`Amount > wallet balance ${userBalanceFrom?.formatted}`}
          </div>
        </div>

        {/* SWAP ICON */}
        <div className="flex justify-center items-centerw-10 h-10 w-10 rounded-full bg-background absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-10%]">
          <div
            className="flex justify-center items-center h-10 w-10 border-[2px] border-border-stroke border-solid box-border rounded-full overflow-hidden"
          >
            <ArrowDown className="text-secondary-foreground w-4 h-4" />
          </div>
        </div>

        {/* TO Token */}
        <div
          className={cn('border-[1px] border-solid border-input bg-input px-5 py-5 md:py-6 rounded-xs')}
        >
          <div className={cn('bg-input rounded-xs flex gap-2 relative py-0 px-0 items-start')}>
            <div className='grid gap-1 grow'>
              <label className="inline-block text-[11px]/4 text-foreground font-light" >
                Avail. <span>{userBalanceTo?.formatted || 0}</span>
              </label>
              <Input
                id="inpToAmount"
                type="text"
                value={toAmount}
                className="w-full bg-transparent disabled:opacity-100 focus:outline-0 focus:border-none focus-within:border-none focus-within:ring-0 focus-visible:border-none focus-visible:ring-0 font-[700] !text-3xl placeholder:!text-muted placeholder:font-[700] placeholder:!font-sans px-0 border-none shadow-none"
                placeholder="0"
                // onChange={onChangeFromAmount}
                autoComplete='off'
                disabled
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <TokenSelectDialog tokenType="to" />
            </div>
          </div>
        </div>
      </div>

      <Slippage />

      <div className='w-full mt-10'>
        {txHash && <HashInfoBar
          description="Transaction complete."
          txHash={txHash}
          onClose={resetFormValuesAndTxHash}
        />}
        {isSwapPending && <AlertInfoBar
          description={`Pending swap ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol} at max slippage 0.5%`}
        />}
      </div>
      <ActionButton />
    </div>
  )
}

interface ActionButtonProps {
  onSuccess?: (tx: string) => Promise<void>;
}
const ActionButton = ({ onSuccess }: ActionButtonProps) => {
  const { address } = useAccount()
  const { approveAsync, isPending: isApproving, getIsNeedApproveAsync } = useApprove()
  const { routerSwapAsync, isPending: isSwapPending } = useRouterSwap();
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(false);
  const { formValues, setFormValues, txHash, setTxHash } = useQuickSwapContext()
  const { fromAmount, fromToken, toAmount, toToken } = formValues

  const getApprove = () => {
    if (fromToken.symbol.toLowerCase() === 'btc') {
      setIsNeedApprove(false);
      return true;
    }
    
    if (fromAmount && Number(fromAmount) > 0) {
      getIsNeedApproveAsync({
        spender: address as Address,
        contract: fromToken.contract as Address,
        amount: parseUnits(fromAmount, fromToken.decimals),
      }).then(res => {
        setIsNeedApprove(res);
      })
    } else {
      setIsNeedApprove(false);
    }
  }

  const handleApprove = async () => {
    await approveAsync({
      spender: address as Address,
      contract: fromToken.contract as Address,
      amount: parseUnits(fromAmount, fromToken.decimals),
      allowance: maxAllowance
    }, {
      onSuccess: () => {
        getApprove();
      }
    })
  }

  const onRouterSwap = async () => {
    const tx = await routerSwapAsync({
      inputToken: fromToken,
      outputToken: toToken,
      amount: fromAmount,
      slippage: 0.005,
    })
    setTxHash(tx as string);
    onSuccess?.(tx as string)
  }

  useEffect(() => {
    getApprove();
  }, [fromAmount, fromToken, getIsNeedApproveAsync])


  if (isNeedApprove) {
    return (
      <Button
        onClick={handleApprove}
        size="default"
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-11 text-base font-title italic font-black uppercase shadow-none disabled:bg-muted disabled:text-muted-foreground disabled:hover:bg-muted/80',
          { 'border border-solid border-primary !bg-primary/10 text-primary disabled:opacity-100': isApproving },
        )}
        variant="default"
      >
        {isApproving ? <Spinner /> : null}
        <span>Approve</span>
      </Button>
    )
  }

  return (
    <Button
      onClick={onRouterSwap}
      size="default"
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-11 text-base font-title italic font-black uppercase shadow-none disabled:bg-muted disabled:text-muted-foreground disabled:hover:bg-muted/80',
        { 'border border-solid border-primary !bg-primary/10 text-primary disabled:opacity-100': isSwapPending },
      )}
      variant="default"
      disabled={!fromAmount || Number(fromAmount) <= 0 || !toAmount}
    >
      {isSwapPending ? <Spinner /> : null}
      <span>Swap</span>
    </Button>
  )
}

export const Slippage = () => {
  return (<div className="mt-4 w-full flex items-center justify-end cursor-pointer hover:text-primary gap-1 text-foreground">
    <span className="text-sm">
      0.5%
    </span>
    <Tooltip>
      <TooltipTrigger>
        <InfoSquareIcon className="w-4 h-4" />
      </TooltipTrigger>
      <TooltipContent>
        <div className='flex items-center gap-2 max-w-80'>
          Maximum difference between expected price of the trade, versus the price when the trade is executed.
        </div>
      </TooltipContent>
    </Tooltip>

  </div>)
}