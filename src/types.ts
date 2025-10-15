import type { Address, ChainContract, Chain as OriginalEvmChain } from 'viem'

type SVGIcon = React.FC<React.SVGProps<SVGSVGElement>>

type ExtendedChainData = {
  icon?: SVGIcon
  contracts: {
    bridge: ChainContract
  }
}

export type EVMChain = OriginalEvmChain & ExtendedChainData

export type Chain = EVMChain

export type NativeToken = {
  id: string
  name: string
  symbol: string
  decimals: number
  icon: SVGIcon
  type: 'native'
  contract: Address
}

export type ERC20Token = {
  id: string
  name: string
  symbol: string
  decimals: number
  icon: SVGIcon
  type: 'erc20'
  contract: Address
}

export type Token = NativeToken | ERC20Token
