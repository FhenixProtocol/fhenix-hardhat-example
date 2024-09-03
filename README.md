# Fhenix Hardhat Example [![Open in Gitpod][gitpod-badge]][gitpod]

[gitpod]: https://gitpod.io/#https://github.com/fhenixprotocol/fhenix-hardhat-example
[gitpod-badge]: https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-FFB45B?logo=gitpod

This repository contains a sample project that you can use as the starting point
for your Fhenix project. It's also a great fit for learning the basics of
Fhenix smart contract development.

This project is intended to be used with the
[Fhenix Hardhat Beginners Tutorial](TODO), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts`, `tests`, `deploy` and `tasks` directories.

It comes with two fhenix-specific hardhat plugins:

- `fhenix-hardhat-plugin`: The main plugin for fhenix development in hardhat. It injects `fhenixjs` into the hardhat runtime environment, which allows you to interact with encrypted data in your tests and tasks.
- `fhenix-hardhat-docker`: A plugin that allows you to run a local Fhenix testnet in a docker container. This is useful for testing your contracts in a sandbox before deploying them on a testnet or on mainnet.

## Quick start

The first things you need to do are cloning this repository and installing its dependencies:

```sh
git clone https://github.com/FhenixProtocol/fhenix-hardhat-example.git
cd fhenix-hardhat-example
pnpm install
```

Next, you need an .env file containing your mnemonics or keys. You can use .env.example that comes with a predefined mnemonic, or use your own

```sh
cp .env.example .env
```

Once the file exists, let's run a LocalFhenix instance:

```sh
pnpm localfhenix:start
```

This will start a LocalFhenix instance in a docker container. If this worked you should see a `Started LocalFhenix successfully` message in your console.

If not, please make sure you have `docker` installed and running on your machine. You can find instructions on how to install docker [here](https://docs.docker.com/get-docker/).

Now that we have a LocalFhenix instance running, we can deploy our contracts to it:

```sh
npx hardhat deploy
```

Note that this template defaults to use the `localfhenix` network, which is injected into the hardhat configuration.

Finally, we can run the tasks with:

```sh
pnpm task:getCount # => 0
pnpm task:addCount
pnpm task:getCount # => 1
pnpm task:addCount --amount 5
pnpm task:getCount # => 6
```

## Hardhat Network

This template contains experimental support for testing using Hardhat Network. By importing the `fhenix-hardhat-network` plugin in `hardhat.config.ts` we add support for simulated operations using Hardhat Network. These do not perform the full FHE computations, and are menant to serve as development tools to verify contract logic.

If you have any issues or feature requests regarding this support please open a ticket in this repository 

## Troubleshooting

If Localfhenix doesn't start this could indicate an error with docker. Please verify that docker is running correctly using the `docker run hello-world` command, which should run a basic container and verify that everything is plugged in.

For example, if the docker service is installed but not running, it might indicate you need to need to start it manually.

## More Info

To learn more about the Fhenix Hardhat plugin, check out the [Fhenix Hardhat Plugin Repository](https://github.com/FhenixProtocol/fhenix-hardhat-plugin).
