# `@umbongo/use-progress`

A [React hook](https://reactjs.org/docs/hooks-intro.html) that makes it easier to track the progress of asynchronous tasks.


## Installation

```shell
npm i --save @umbongo/use-progress
```

## Usage

In this simple example below, the user clicks a button to trigger a timer. Every second the timer 
updates the current progress shown on screen. After 5 seconds the timer either throws an error or marks 
the process as completed, i.e. succcessful.

```js
import { UseProgressHook, useProgress } from '@umbongo/use-progress`

export const RandomTimer = () => {
  const progress = useProgress()

  const run = useCallback(() => {
    // reset progress state from last iteration
    progress.reset()

    let iteration = 0

    setInterval(() => {
      iteration++

      progress.setActiveStep(`Time elapsed: ${iteration} seconds`)

      if (iteration >= 5) {
        // error 50% of time, success 50% of time
        if (Math.random() > 0.5) {
          progress.setError(new Error('Timer failed'))
        } else {
          progress.setCompleted()
        }
      }
    }, 1000)
  }, [progress])

  return (
    <div>
      <button onClick={run}>Run again</button>
      {progress.error ? <div>Error: {progress.error.message}</div> : null}
      {progress.inProgress ? <div>Step: {progress.activeStep}</div> : null}
      {progress.completed ? <div>Success!</div> : null}
    </div>
  )
} 
```

## License

MIT