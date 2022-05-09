# `@rjshooks/use-flow`

[React hook](https://reactjs.org/docs/hooks-intro.html) for queueing up and sequentially executing of multiple async methods, with progress tracking.


## Installation

```shell
npm i --save @rjshooks/use-flow react@18
```

## Usage

In this simple example below, the user clicks a button to trigger 3 separate async steps. The progress indicator text updates as each subsequent step gets executed. 50% of the time any of the steps can fail, at which point an error will be shown. If all steps pass then a success message gets shown. Finally, the user can click the button again to restart the sequence from scratch.

```js
import { useCallback } from 'react'
import delay from 'delay'
import { useFlow } from '@rjshooks/use-flow'

export const RunSteps = () => {
  const flow = useFlow()

  const run = useCallback(async () => {
    flow.reset()

    flow.add('Wait 5 seconds', async () => {
      await delay(5000)

      if (Math.random() > 0.5) {
        throw new Error('Step 1 failed')
      }
    })

    flow.add('Then wait 3 seconds', async () => {
      await delay(3000)

      if (Math.random() > 0.5) {
        throw new Error('Step 2 failed')
      }
    })

    await flow.run()
  }, [flow])

  return (
    <div>
      <button onClick={run}>Run</button>
      {flow.progress.error ? <div>Error: {flow.progress.error.message}</div> : null}
      {flow.progress.inProgress ? <div>Step: {flow.progress.activeStep}</div> : null}
      {flow.progress.completed ? <div>Success!</div> : null}
    </div>
  )
} 
```

This hook internally uses the [useProgress](https://www.npmjs.com/package/@rjshooks/use-progress) hook to keep track of the sequence progress. If you wish you can supply your own instance of this hook in case you want more fine-grained control over the progress tracking:

```js
import React from 'react'
import delay from 'delay'
import { useProgress } from '@rjshooks/use-progress'
import { useFlow } from '@rjshooks/use-flow'

export const RunSteps = () => {
  const progress = useProgress()
  const flow = useFlow(progress)

  const run = useCallback(async () => {
    flow.reset()

    flow.add('Wait 5 seconds', async () => {
      await delay(5000)

      if (Math.random() > 0.5) {
        throw new Error('Step 1 failed')
      }
    })

    flow.add('Then wait 3 seconds, unless we can finish early', async () => {
      await delay(3000)

      progress.setActiveStep('Step 2 timer elapsed')

      if (Math.random() > 0.5) {
        throw new Error('Step 2 failed')
      }
    })

    await flow.run()
  }, [flow, progress])

  return (
    <div>
      <button onClick={run}>Run</button>
      {progress.error ? <div>Error: {progress.error.message}</div> : null}
      {progress.inProgress ? <div>Step: {progress.activeStep}</div> : null}
      {progress.completed ? <div>Success!</div> : null}
    </div>
  )
} 
```


## License

MIT