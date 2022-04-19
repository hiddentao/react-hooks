import { useCallback, useMemo, useState } from "react"
import { useProgress, UseProgressHook } from "@rjshooks/use-progress"

interface Step {
  label: string,
  callback: Function,
  done: boolean,
}

interface UseFlowHook {
  reset: () => void,
  add: (label: string, callback: () => Promise<void>) => void,
  run: () => Promise<void>,
  progress: UseProgressHook,
}

export const useFlow = (inputProgress?: UseProgressHook): UseFlowHook => {
  const selfProgress = useProgress()
  const progress = useMemo(() => inputProgress || selfProgress, [inputProgress, selfProgress])

  const [steps, setSteps] = useState<Step[]>([])

  const reset = useCallback(() => {
    setSteps([])
    progress.reset()
  }, [progress])

  const add = useCallback((label: string, callback: Function) => {
    setSteps([...steps, {
      label,
      callback,
      done: false
    }])
  }, [steps])

  const run = useCallback(async () => {
    for (let i = 0; i < steps.length; i += 1) {
      progress.setActiveStep(steps[i].label)
      try {
        await steps[i].callback()
      } catch (err) {
        progress.setError(new Error(`Error [${steps[i].label}]: ${(err as Error).message}`))
        throw err
      }
    }

    progress.setCompleted()
  }, [progress, steps])

  return {
    reset,
    add,
    run,
    progress,
  }
}
