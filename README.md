# Router Swap 简化实例

Online address: [bitzap-router-swap](https://bitzap-router-swap.pages.dev/)

- Only support Btr mainnet.
- For swap between Btc and others.

## 运行项目

- Clone code `git@github.com:bitzap-org/bitzap-router-swap.git`
- Install dependencies `pnpm install`
- Run demo `pnpm dev` and open [http://localhost:5573/](http://localhost:5573/)

## 关键逻辑

### Swap routes 本地化

- 将Swap路径遍历出来并存到本地, 在Swap的时候不需要再计算最优路径, 仅使用本地提供的币对对应的路径. 详细路径参考 `src/modules/pool-swap/router-map.ts` 文件所示.
- 测试网 BtrTestnet 仅支持BTC/WBTC/USDT/USDC之间的兑换.
- 主网 Btr 支持目前生产环境的所有币对之间的兑换.

### Expected 值获取

参考 `src/modules/pool-swap/quick-swap-context.tsx` 文件中的 `useRouterSwap` 的 `expectedAsync` 方法, 该方法根据当前币对对应的路径算出来对应的预期值并返回.

### Swap 操作

参考 `src/modules/pool-swap/quick-swap-context.tsx` 文件中的 `useRouterSwap` 的 `routerSwapAsync` 方法, 该方法会经过计算后并上链进行真正的Swap兑换.

## Others

详细可以参考 [https://bitzap.ai/](https://bitzap.ai/) 官网交易.
