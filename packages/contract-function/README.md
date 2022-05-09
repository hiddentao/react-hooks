# `@rjshooks/use-contract-function`

[React hook](https://reactjs.org/docs/hooks-intro.html) for calling Ethereum contract functions with precise error handling and progress tracking. Intended as a replacement for [useContractFunction](https://usedapp-docs.netlify.app/docs/API%20Reference/Hooks#usecontractfunction) from the [useDapp](https://usedapp.io/) package.


## Installation

```shell
npm i --save @rjshooks/use-contract-function @ethersproject/contracts @usedapp/core react@18
```

## Usage

In this simple example below, the user clicks a button to trigger 3 separate async steps. The progress indicator text updates as each subsequent step gets executed. 50% of the time any of the steps can fail, at which point an error will be shown. If all steps pass then a success message gets shown. Finally, the user can click the button again to restart the sequence from scratch.

```js
import { useMemo, useCallback } from 'react'
import { useEthers  } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts"
import { useContractFunction } from '@rjshooks/use-contract-function'

// USDC ERC-20 token
const CONTRACT_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

const CONTRACT_ABI = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]

export const CallContract = () => {
  const { library } = useEthers()

  const contract = useMemo(() => new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, library), [ library ])

  const method = useContractFunction({ 
    contract, 
    functionName: 'transfer' 
  })

  const run = useCallback(async () => {
    await method.exec('0x....', '0x100')
  }, [ method ])

  return (
    <div>
      <button onClick={run}>Run</button>
      {method.progress.error ? <div>Error: {method.progress.error.message}</div> : null}
      {method.progress.completed ? <div>Success!</div> : null}
    </div>
  )
} 
```

This hook internally uses the [useProgress](https://www.npmjs.com/package/@rjshooks/use-progress) hook to keep track of the sequence progress. If you wish you can supply your own instance of this hook in case you want more fine-grained control over the progress tracking:

```js
import { useMemo, useCallback } from 'react'
import { useEthers  } from "@usedapp/core"
import { Contract } from "@ethersproject/contracts"
import { useContractFunction } from '@rjshooks/use-contract-function'
import { useProgress } from '@rjshooks/use-progress'

// USDC ERC-20 token
// ....

export const CallContract = () => {
  // ...

  const progress = useProgress()
  const method = useContractFunction({ 
    contract, 
    functionName: 'transfer', 
    progress 
  })

  const run = useCallback(async () => {
    progress.reset()

    if (Math.random() > 0.5) {
      progress.setError(new Error('failed'))
      return
    }

    await method.exec('0x....', '0x100')
  }, [ method ])

  return (
    <div>
      <button onClick={run}>Run</button>
      {method.progress.error ? <div>Error: {method.progress.error.message}</div> : null}
      {method.progress.completed ? <div>Success!</div> : null}
    </div>
  )
} 
```

You can also override the [transaction parameters](https://docs.ethers.io/v5/api/contract/contract/#contract-functionsSend):

```js
const method = useContractFunction({ 
  contract, 
  functionName: 'transfer',  
  options: {
    gasPrice: 1,
    // ...etc
  }
})
```


## License

MIT