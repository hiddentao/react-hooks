import { useCallback, useEffect, useMemo, useState } from "react"
import { Contract } from 'ethers'
import { TransactionOptions, useContractFunction as useContractFunctionBase } from "@usedapp/core"
import { useProgress, ProgressHookResult } from "@rjshooks/use-progress"


interface ContractFunctionHookResult {
  exec: (...args: any[]) => Promise<unknown>,
  progress: ProgressHookResult,
}

interface ContractFunctionHookInput {
  contract: Contract,
  functionName: string,
  options?: TransactionOptions,
  progress?: ProgressHookResult,
}

interface PromiseResolvers {
  resolve: (v: any) => void,
  reject: (e: Error) => void,
}

export const useContractFunction = (opts: ContractFunctionHookInput): ContractFunctionHookResult => {
  const { contract, functionName, options, progress: inputProgress } = opts

  const selfProgress = useProgress()
  const progress = useMemo(() => inputProgress || selfProgress, [inputProgress, selfProgress])

  const { send, state, resetState } = useContractFunctionBase(
    contract, functionName, {
    transactionName: functionName,
    ...options,
  }
  )

  const [promiseResolvers, setPromiseResolvers] = useState<PromiseResolvers>()

  const exec = useCallback(async (...args: any[]) => {
    return new Promise((resolve, reject) => {
      setPromiseResolvers({ resolve, reject })
      resetState()
      progress.reset()
      progress.setActiveStep('sending')
      send(...args).catch(e => {
        progress.setError(e)
        reject(e)
      })
    })
  }, [progress, resetState, send])

  const error = useMemo(() => state?.errorMessage ? new Error(state?.errorMessage) : null, [state])
  const completed = useMemo(() => (state?.status === 'Success') && !error, [error, state?.status])
  const mining = useMemo(() => (state?.status === 'Mining') && !error, [state?.status, error])

  useEffect(() => {
    if (mining) {
      progress.setActiveStep('mining')
    } else if (completed || error) {
      if (completed) {
        progress.setCompleted()
        promiseResolvers?.resolve(undefined)
      } if (error) {
        progress.setError(error)
        promiseResolvers?.reject(error)
      }

      setPromiseResolvers(undefined)
    }
  }, [completed, error, mining, progress, promiseResolvers])

  return {
    exec,
    progress,
  }
}
