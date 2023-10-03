# `@rjshooks/use-async-task`

[React hook](https://reactjs.org/docs/hooks-intro.html) for performing async tasks with progress tracking. It's especially suitable for tasks which may be called repeatedly without input, and perfect for use with [useProgress](https://www.npmjs.com/package/@rjshooks/use-progress).


## Installation

```shell
npm i --save @rjshooks/use-async-tasks react@20
```

## Usage

In this simple example below, the async task is to call an external URL to fetch some data.

```js
import { useCallback } from 'react'
import { useAsyncTask } from '@rjshooks/use-async-task'

export const GetSomeDataAsync = () => {
  const { progress, data, reload } = useAsyncTask<object>({
    load: () => window.fetch('/some/api/that/returns/json').then(r => r.json()),
  })

  const run = useCallback(() => {
    reload()
  }, [reload])

  return (
    <div>
      <button onClick={run}>Run again</button>
      {progress.error ? <div>Error: {progress.error.message}</div> : null}
      {progress.inProgress ? <div>Step: {progress.activeStep}</div> : null}
      {progress.completed ? <div>Success!</div> : null}
      {data ? <div>Data: {data}</div> : null}
    </div>
  )
} 
```

The task can be set to run as soon as the component mount using the `loadOnCreation` option:

```js
useAsyncTask<object>({
  load: () => ...//do something,
  loadOnCreation: true
})
```


## License

MIT