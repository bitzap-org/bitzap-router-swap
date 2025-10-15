import { scanTxPath } from '@/lib/utils'
import { ExternalLinkIcon } from '@/components/icons/link'
import * as React from 'react'
import { Close } from './icons/Close'

type Props = {
  description: string | React.ReactNode
  txHash: string | string[]
  onClose?: () => void
}

export const HashInfoBar = ({ description, txHash, onClose }: Props) => {
  return (
    <div className="w-full bg-success-background px-6 py-5 rounded-sm my-4 flex items-center justify-between"  >
      <div className="font-sans text-foreground font-[400] text-sm ">
        {description}{' '}
        {Array.isArray(txHash) ? (
          txHash.map((tx) => (
            <a href={scanTxPath(tx)} target="_blank" key={tx} className="!text-subtitle hover:!text-primary">
              <ExternalLinkIcon className="inline size-4 my-0.5" />
            </a>
          ))
        ) : (
          <a href={scanTxPath(txHash)} target="_blank" className="!text-subtitle hover:!text-primary">
            <ExternalLinkIcon className="inline size-4 my-0.5" />
          </a>
        )}
      </div>
      {onClose && <button onClick={onClose} className="text-[#c1c1c1] hover:text-primary cursor-pointer">
        <Close className="size-4 cursor-pointer" />
      </button>}
    </div>
  )
}