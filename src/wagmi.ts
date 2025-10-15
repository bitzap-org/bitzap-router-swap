import { createConfig, http } from 'wagmi';
import { btr, btrTestnet } from 'wagmi/chains';
import { baseAccount, injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [btr, btrTestnet],
  connectors: [injected(), baseAccount()],
  transports: {
    [btr.id]: http(),
    [btrTestnet.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
