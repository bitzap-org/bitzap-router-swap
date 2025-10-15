import { Token } from '@/types'
import { Pool } from './interface'
import BitlayerIcon from '@/components/icons/BitlayerB'

export const btr_testnet_btc: Token = {
  id: 'btr_testnet_btc',
  icon: BitlayerIcon,
  type: 'native',
  name: 'Bitcoin',
  symbol: 'BTC',
  decimals: 18,
  contract: '0x0000000000000000000000000000000000000000',
}

export const btr_testnet_yusd: Token = {
  id: 'btr_testnet_yusd',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'BitZap Yeild USD',
  symbol: 'yUSD',
  decimals: 18,
  contract: '0x41e339b18952bb74cc19e2cd1c59e8d0ca69812b',
}
const btr_testnet_wbtc: Token = {
  id: 'btr_testnet_wbtc',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'Wrapped BTC',
  symbol: 'WBTC',
  decimals: 18,
  contract: '0x83f62399f2a417db8ad34a4fc54d58240fc898e9',
}
export const btr_testnet_usdt: Token = {
  id: 'btr_testnet_usdt',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'Tether USD',
  symbol: 'USDT',
  decimals: 6,
  contract: '0x67d4b8c97cf54539c1e80767201b5571e831342a',
}
const btr_testnet_usdc: Token = {
  id: 'btr_testnet_usdc',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  contract: '0x40b45d6d774a0cc6eec380ed55528f3c9edb1e2c',
}

export const btr_btc: Token = {
  ...btr_testnet_btc,
  id: 'btr_btc',
}
const btr_eth: Token = {
  id: 'btr_eth',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'Ethereum Token',
  symbol: 'ETH',
  decimals: 18,
  contract: '0xef63d4e178b3180beec9b0e143e0f37f4c93f4c2',
}
export const btr_usdt: Token = {
  id: 'btr_usdt',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'Tether',
  symbol: 'USDT',
  decimals: 6,
  contract: '0xfe9f969faf8ad72a83b761138bf25de87eff9dd2',
}
const btr_usdc: Token = {
  id: 'btr_usdc',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  contract: '0xf8c374ce88a3be3d374e8888349c7768b607c755',
}
const btr_wbtc: Token = {
  id: 'btr_wbtc',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'Wrapped BTC',
  symbol: 'WBTC',
  decimals: 18,
  contract: '0xff204e2681a6fa0e2c3fade68a1b28fb90e4fc5f',
}
const btr_yusd: Token = {
  id: 'btr_yusd',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'BitZap Yeild USD',
  symbol: 'yUSD',
  decimals: 18,
  contract: '0x5edf3a83da9a1ab77b91ff11e2bbe663bab45f59',
}
const btr_usda: Token = {
  id: 'btr_usda',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'BitZap USD',
  symbol: 'USDa',
  decimals: 18,
  contract: '0x91bd7f5e328aecd1024e4118ade0ccb786f55db1',
}
const btr_avl: Token = {
  id: 'btr_avl',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'AVL',
  symbol: 'AVL',
  decimals: 18,
  contract: '0x3228995749610bea00b59c44f8d1df21c14027f1',
}
const btr_ola: Token = {
  id: 'btr_ola',
  icon: BitlayerIcon,
  type: 'erc20',
  name: 'Ola',
  symbol: 'OLA',
  decimals: 18,
  contract: '0xb168a53a9114e03297931f664aae5d38dbd73b8c',
}

export const BTR_TESTNET_Pools: Pool[] = [
  {
    address: '0xd2825021628b63350a48ac597c9082ef1998c373',
    poolUrl: 'https://develop.bitzap-test.pages.dev/#/bitlayer_testnet/pools/factory-twocrypto-29/deposit',
    underlyingCoins: [btr_testnet_yusd, btr_testnet_wbtc],
  },
  {
    address: '0x43b4ff3f00654424a8ed1cf55e6a83ecc482904d',
    poolUrl: 'https://develop.bitzap-test.pages.dev/#/bitlayer_testnet/pools/factory-stable-ng-0/deposit',
    underlyingCoins: [btr_testnet_usdt, btr_testnet_usdc],
  },
  {
    address: '0x67d575811f38101c1bd922ce891be9d19721bacb',
    poolUrl: 'https://develop.bitzap-test.pages.dev/#/bitlayer_testnet/pools/factory-stable-ng-40/deposit',
    underlyingCoins: [btr_testnet_yusd, btr_testnet_usdt],
  },
]
export const BTR_Pools = [
  {
    address: '0x3aa4bf93d3ae4239c57913b05406bac530bd7cc3',
    poolUrl: 'https://bitzap.ai/#/bitlayer/pools/factory-twocrypto-3/deposit',
    underlyingCoins: [btr_usdt, btr_wbtc],
  },
  {
    address: '0xe0c37a0e8cc168f0f14bdf084d1fa9ff6d8e3aae',
    poolUrl: 'https://bitzap.ai/#/bitlayer/pools/factory-stable-ng-4/deposit',
    underlyingCoins: [btr_yusd, btr_usdt],
  },
  {
    address: '0x35801ce032e24100c75f26909bd0a3efc76c0308',
    poolUrl: 'https://bitzap.ai/#/bitlayer/pools/factory-twocrypto-6/deposit',
    underlyingCoins: [btr_yusd, btr_wbtc],
  },
  {
    address: '0xf14b154b7675c555d1e61e3a7cc36397a0e14c76',
    poolUrl: 'https://bitzap.ai/#/bitlayer/pools/factory-twocrypto-7/deposit',
    underlyingCoins: [btr_usdt, btr_eth],
  },
  {
    address: '0x62dabbf75ce3ff48f925c92af9f1e47711b2f879',
    poolUrl: 'https://bitzap.ai/#/bitlayer/pools/factory-twocrypto-1/deposit',
    underlyingCoins: [btr_avl, btr_usdt],
  },
  {
    address: '0x032cea960f6e30f831da0c31c6fb9d88dff7b18e',
    poolUrl: 'https://bitzap.ai/#/bitlayer/pools/factory-stable-ng-2/deposit',
    underlyingCoins: [btr_usdt, btr_usda],
  },
  {
    address: '0xbe4c89d08dce6f6311f14d82e665c4e9d484ce70',
    poolUrl: 'https://bitzap.ai/#/bitlayer/pools/factory-twocrypto-0/deposit',
    underlyingCoins: [btr_ola, btr_usdt],
  },
]

export const SWAP_POOLS = import.meta.env.MODE === 'development' ? BTR_TESTNET_Pools : BTR_Pools
