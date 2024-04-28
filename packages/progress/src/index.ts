import { useCallback, useMemo, useState } from "react"

export interface ProgressHookResult {
  inProgress?: boolean,
  activeStep?: any,
  completed?: boolean,
  error?: Error,
  setActiveStep: (v: any) => void,
  setCompleted: () => void,
  setError: (e: Error) => void,
  reset: () => void,
}

export const useProgress = (): ProgressHookResult => {
  const [ obj ] = useState({})
  const [inProgress, setInProgressState] = useState<boolean>()
  const [activeStep, setActiveStepState] = useState<any>()
  const [completed, setCompletedState] = useState<boolean>(false)
  const [error, setErrorState] = useState<Error>()

  const reset = useCallback(() => {
    setInProgressState(false)
    setActiveStepState(undefined)
    setErrorState(undefined)
    setCompletedState(false)
  }, [])

  const setCompleted = useCallback(() => {
    setInProgressState(false)
    setActiveStepState(undefined)
    setCompletedState(true)
  }, [])

  const setError = useCallback((e: Error) => {
    setInProgressState(false)
    setActiveStepState(undefined)
    setErrorState(e)
  }, [])

  const setActiveStep = useCallback((v: any) => {
    setInProgressState(true)
    setActiveStepState(v)
  }, [])

  const finalObj = useMemo(() => {
    Object.assign(obj, {
      inProgress,
      activeStep,
      completed,
      error,
      setActiveStep,
      setCompleted,
      setError,
      reset,
    })
    return obj
  }, [inProgress, activeStep, completed, error, setActiveStep, setCompleted, setError, reset])

  return finalObj as ProgressHookResult
}