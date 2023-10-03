# `@rjshooks/use-async-value`

[React hook](https://reactjs.org/docs/hooks-intro.html) for storing values which result from async calls, providing a way to keep track of call progress and errors. 

It's perfect for use with [useAsyncTask](https://www.npmjs.com/package/@rjshooks/use-async-task).


## Installation

```shell
npm i --save @rjshooks/use-async-value react@20
```

## Usage

In this simple example below, the async value will store the result of an async call. The call returns an object, and so a transformer will be used to extract the specific property from the object. Errors and progress tracking are also shown.

```js
import { useCallback } from 'react'
import { useAsyncValue } from '@rjshooks/use-async-value'

export const LoadAsyncValue = () => {
  const { 
    error,
    isLoading,
    value,
    transformedValue,
    setError,
    setValue,
    reset,
  } = useAsyncValue<object, number>({
    valueTransformer: (v: object) => v.count as number
  })

  const { progress, data, reload } = useAsyncTask<object>({
    load: () => window.fetch('/some/api/that/returns/json').then(r => r.json()),
  })

  const run = useCallback(async () => {
    // After this, `inProgress` will be true and `error`, `value` and `transformedValue` will be undefined.
    reset()

    try {
      const ret = window.fetch('/some/api/')
      const json = await ret.json()
      // After this, `inProgress` will be false and `error` will be undefined.
      setValue(json as object)
    } catch (err) {
      // After this, `inProgress` will be false and `value` and `transformedValue` will be undefined.
      setError(err)
    }
  }, [reload])

  return (
    <div>
      <button onClick={run}>Run again</button>
      {error ? <div>Error: {error.message}</div> : null}
      {inProgress ? <div>Running...</div> : null}
      {transformedValue ? <div>Count: {transformedValue}</div> : null}
    </div>
  )
} 
```

## License

MIT