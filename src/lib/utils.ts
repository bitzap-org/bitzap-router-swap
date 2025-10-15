import { btr, btrTestnet } from 'viem/chains';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export enum Chain {
  BitlayerTestnet = 200810,
  Bitlayer = 200901,
}

export const CURVE_ASSETS_URL =
  'https://cdn.jsdelivr.net/gh/bitlayer-org/curve-assets';

export const expectedChain =
  import.meta.env.MODE === 'development' ? btrTestnet : btr;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string) {
  if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    var textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Adds the '' prefix to a URL if it doesn't already have it.
 * @param url - The URL to add the prefix to
 * @returns The URL with the '' prefix
 */
export function sitePath(url: string): string {
  if (!url) {
    return '';
  }

  const prefix = '';

  // If URL already starts with the prefix, return it as is
  if (url.startsWith(prefix)) {
    return url;
  }

  // Handle URLs that start with a slash
  if (url.startsWith('/')) {
    return `${prefix}${url}`;
  }

  // Handle URLs without a leading slash
  return `${prefix}/${url}`;
}

type ShortAddressOptions = {
  prefixLength?: number;
  suffixLength?: number;
};

export function shortAddress(
  address: string | undefined,
  options: ShortAddressOptions = {}
): string {
  if (!address) {
    return '';
  }

  const { prefixLength = 6, suffixLength = 4 } = options;
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

export function getImageBaseUrl(rChainId = Chain.Bitlayer) {
  //https://cdn.jsdelivr.net/gh/bitlayer-org/curve-assets/images/assets-bitlayer-testnet/0x41e339b18952bb74cc19e2cd1c59e8d0ca69812b.png
  const chainLabel =
    expectedChain.id === Chain.BitlayerTestnet
      ? 'assets-bitlayer-testnet'
      : 'assets-bitlayer';
  return `${CURVE_ASSETS_URL}/images/${chainLabel}/`;
}

export function getTokenImageUrl(
  tokenAddress: string,
  rChainId = Chain.Bitlayer
) {
  //https://cdn.jsdelivr.net/gh/bitlayer-org/curve-assets/images/assets-bitlayer-testnet/0x41e339b18952bb74cc19e2cd1c59e8d0ca69812b.png
  const chainLabel =
    expectedChain.id === Chain.BitlayerTestnet
      ? 'assets-bitlayer-testnet'
      : 'assets-bitlayer';
  return `${CURVE_ASSETS_URL}/images/${chainLabel}/${tokenAddress}.png`;
}

export const scanTxPath = (hash: string) => {
  const scanDomain = import.meta.env.VITE_CURVE_EXPLORER;
  return `${scanDomain}/tx/${hash}`;
};
