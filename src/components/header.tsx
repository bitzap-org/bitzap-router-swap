import { shortAddress, sitePath } from '@/lib/utils'
import BitlayerIcon from '@/components/icons/BitlayerB'
import Logout from '@/components/icons/logout'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { btr, btrTestnet } from 'wagmi/chains'
import { cn } from '@/lib/utils'

export function Header() {
  return (
      <DesktopHeader />
  )
}

function ConnectWalletButton() {
  const { address, chain } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  const expectedChain = import.meta.env.MODE === 'development' ? btrTestnet : btr
  const handleConnect = async () => {
    const connector = connectors.find((c) => c.id === 'web3-onboard')
    if (!connector) {
      return
    }
    connect({ connector, chainId: expectedChain.id })
  }

  const handleDisconnect = async () => {
    disconnect()
  }

  const baseClassName = 'font-medium h-14 px-6 rounded-full text-primary bg-primary/[0.08] flex items-center gap-2'

  if (!address) {
    return (
      <button className={baseClassName} onClick={handleConnect} disabled={isConnecting}>
        Connect Wallet
      </button>
    )
  }

  if (chain?.id !== expectedChain.id) {
    return (
      <button className={baseClassName} onClick={handleDisconnect}>
        {shortAddress(address)}
      </button>
    )
  }

  return (
    <div className={cn(baseClassName, 'text-[#1f1f1f] bg-[#f9f9f9]')}>
      <BitlayerIcon className="size-5 shrink-0 min-w-0" />
      <span className="text-lg">{shortAddress(address)}</span>
      <div className="w-0.5 h-4 bg-[#c1c1c1]"></div>
      <button onClick={handleDisconnect} className="text-[#c1c1c1] hover:text-primary">
        <Logout className="size-5 shrink-0 min-w-0" />
      </button>
    </div>
  )
}

function DesktopHeader() {
  return (
    <header className="container justify-between items-center h-[74px] hidden md:flex md:max-w-[1200px] md:mx-auto">
      <div className="flex items-center gap-4">
        <img src={sitePath('/images/logo-brand.png')} alt="Bitzap" className="w-40 h-12" />
      </div>
      <div>
        <ConnectWalletButton />
      </div>
    </header>
  )
}