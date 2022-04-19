A collection of useful [React hooks](https://reactjs.org/docs/hooks-intro.html) for async programming and web3.

* [@rjshooks/use-progress](./packages/progress/) - tracking the progress of a sequence of tasks.
* [@rjshooks/use-flow](./packages/flow/) - queueing up and sequentially executing of multiple async methods, with progress tracking.
* [@rjshooks/use-contract-function](./packages/contract-function/) - for calling Ethereum contract functions with precise error handling and progress tracking. 

## Development

_Note: This is a [Lerna monorepo](https://github.com/lerna/lerna). All code is in [Typescript](https://www.typescriptlang.org/)._

Run this after cloning the repo, to bootstrap the packages:

```shell
$ yarn bootstrap
```

To build an individual package, e.g. `use-progress`:

```
$ cd packages/progress
$ yarn build
```

You can also `watch` for changes and rebuild:

```
$ yarn watch
```

### Publishing

To do a new release:

```shell
$ yarn pre-release
$ yarn release
```



