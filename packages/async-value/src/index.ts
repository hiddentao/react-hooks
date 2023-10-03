import { useCallback, useState, useMemo } from "react"

export interface AsyncValue<T, U> {
  error?: Error
  isLoading: boolean
  value?: T
  transformedValue?: U,
  setError: (e: Error) => void
  setValue: (v: T | undefined) => void
  reset: () => void
}

export const useAsyncValue = <T, U>(
  initialValue?: T,
  valueTransformer?: (v: T) => U
): AsyncValue<T, U> => {
  const [error, _setError] = useState<Error>()
  const [isLoading, _setLoading] = useState<boolean>(false)
  const [value, _setValue] = useState<T | undefined>(initialValue)

  const reset = useCallback(() => {
    _setLoading(true)
    _setError(undefined)
  }, [])

  const setError = useCallback((e: Error) => {
    _setLoading(false)
    _setValue(undefined)
    _setError(e)
  }, [])

  const setValue = useCallback((v: T | undefined) => {
    _setLoading(false)
    _setError(undefined)
    _setValue(v)
  }, [])

  const transformedValue = useMemo(() => {  
    if (value && valueTransformer) {
      return valueTransformer(value)
    }
  }, [value, valueTransformer])

  return { error, setError, isLoading, reset, value, setValue, transformedValue }
}

