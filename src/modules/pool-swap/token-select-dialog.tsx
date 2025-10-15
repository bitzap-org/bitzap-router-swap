import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { useQuickSwapContext, useTokens } from './quick-swap-context'
import { Token } from '@/types'
import { RouterMap } from './router-map'
import { ChevronDown } from 'lucide-react'

interface TokenSelectDialogProps {
  tokenType: 'from' | 'to';
}

export default function TokenSelectDialog({ tokenType }: TokenSelectDialogProps) {
  const [open, setOpen] = useState(false)
  const { tokens } = useTokens()
  const { formValues, setFormValues, refreshBalance } = useQuickSwapContext()
  const { fromToken, toToken } = formValues
  const token = tokenType === 'from' ? fromToken : toToken
  const routerMap = RouterMap

  const tokenList = useMemo(() => {
    if (tokenType === 'from') {
      return tokens
    } else {
      return tokens.filter((_token) => {
        const routeKey = `${fromToken.symbol.toLowerCase()}-${_token.symbol.toLowerCase()}`
        return routerMap[routeKey]
      })
    }
  }, [tokens, tokenType])

  const onOpenChange = (_open: boolean) => {
    setOpen(_open)
  }

  const onTokenItemClick = (token: Token) => {
    if (tokenType === 'from') {
      const toTokens = tokens.filter((_token) => {
        const routeKey = `${token.symbol.toLowerCase()}-${_token.symbol.toLowerCase()}`
        return routerMap[routeKey]
      })
      setFormValues({ ...formValues, fromToken: token, toToken: toTokens[0] })
    } else {
      setFormValues({ ...formValues, toToken: token })
    }
    refreshBalance()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="flex-1">
        <Button variant="ghost" className="w-full h-10 text-lg tracking-040 gap-0 bg-background rounded-3xl flex items-center justify-between min-w-30 px-3 py-2">
          {token ? <SelectedTokenItem key={token.contract} token={token} /> : <span className='px-3'>Select</span>}
          <ChevronDown name="ChevronDown" size={16} className="text-[#B6B6B6]" />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-full md:max-w-[632px]'>
        <DialogHeader>
          <DialogTitle className="font-title italic color-foreground text-lg md:text-xl font-semibold flex items-center justify-start">Token Select</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row justify-between items-center mt-1 md:mt-0 rounded-xl py-2 px-3">
          <div className="w-fit flex items-center gap-4 bg-white p-1 md:p-3 rounded-xl flex-wrap">
            {tokenList.map((token) => (
              <TokenItem key={token.contract} token={token} onClick={() => onTokenItemClick(token)} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const SelectedTokenItem = ({ token, className }: { token: Token; className?: string }) => {
  return (
    <div className={cn("flex items-center text-foreground text-xs/none md:text-base/none font-[400] gap-2 bg-[#F9F9F9]", className)}>
      <img
        src={`images/tokens/${token.symbol.toLowerCase()}.png`}
        alt={token.contract}
        className="size-4"
        loading="lazy"
        decoding="async"
      />
      <span key={token.contract} className="">
        {token.symbol}
      </span>
    </div>
  )
}

export const TokenItem = ({ token, onClick }: { token: Token; onClick: () => void }) => {
  return (
    <Button variant="ghost" className="flex flex-col gap-2 bg-[#F9F9F9]" onClick={onClick}>
      <div className="flex items-center text-foreground text-xs/none md:text-base/none font-[400] gap-2">
        <img
          src={`images/tokens/${token.symbol.toLowerCase()}.png`}
          alt={token.contract}
          className="size-4"
          loading="lazy"
          decoding="async"
        />
        <span key={token.contract} className="">
          {token.symbol}
        </span>
      </div>
    </Button>
  )
}
