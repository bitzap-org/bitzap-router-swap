import { type Address, encodeFunctionData, erc20Abi } from 'viem'
import { useAccount, useConfig } from 'wagmi'
import { estimateGas, readContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { useMutation } from '@tanstack/react-query'
import { estimateFeesPerGas } from 'wagmi/actions'

export type UseApproveOptions = {
  pollingInterval?: number
}

export type ApproveParams = {
  contract: Address
  spender: Address
  amount: bigint
  allowance?: bigint
}

export const maxAllowance = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn

export const useApprove = (options: UseApproveOptions = {}) => {
  const { address } = useAccount()
  const config = useConfig()
  const { pollingInterval = 5_000 } = options

  const {
    mutate: approve,
    mutateAsync: approveAsync,
    ...mutation
  } = useMutation({
    mutationFn: async ({ contract, spender, amount, allowance }: ApproveParams) => {
      if (!address) {
        throw new Error('Wallet not connected')
      }
      const abi = erc20Abi

      const currentAllowance = await readContract(config, {
        abi,
        address: contract,
        functionName: 'allowance',
        args: [address, spender],
      })

      if (currentAllowance >= amount) {
        return
      }

      if (allowance === undefined) {
        allowance = amount
      }

      const functionName = 'approve'
      const args = [spender, allowance] as const

      const feesPerGas = await estimateFeesPerGas(config)
      const gas = await estimateGas(config, {
        data: encodeFunctionData({
          abi,
          functionName,
          args,
        }),
        to: contract,
        account: address,
      })

      const result = await writeContract(config, {
        abi,
        account: address,
        functionName,
        args,
        address: contract,
        gas: gas,
        maxFeePerGas: feesPerGas.maxFeePerGas,
        maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas,
      })

      await waitForTransactionReceipt(config, {
        hash: result,
        pollingInterval,
      })
    },
  })

  const {
    mutate: getIsNeedApprove,
    mutateAsync: getIsNeedApproveAsync,
  } = useMutation({
    mutationFn: async ({ contract, spender, amount, allowance }: ApproveParams) => {
      if (!address) {
        throw new Error('Wallet not connected')
      }
      const abi = erc20Abi

      const currentAllowance = await readContract(config, {
        abi,
        address: contract,
        functionName: 'allowance',
        args: [address, spender],
      })

      return amount > currentAllowance
    },
  })

  return {
    approve,
    approveAsync,
    getIsNeedApprove,
    getIsNeedApproveAsync,
    ...mutation,
  }
}
