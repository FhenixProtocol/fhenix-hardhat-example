# Hardhat Boilerplate

This repository contains a sample project that you can use as the starting point
for your Fhenix project. It's also a great fit for learning the basics of
Fhenix smart contract development.

This project is intended to be used with the
[Fhenix Hardhat Beginners Tutorial](TODO), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts`, `tests`, `deploy`, `task` and `frontend` directories.

It comes with two fhenix-specific hardhat plugins:

- `hardhat-fhenix` - the main plugin for fhenix development in hardhat - it injects fhenixjs into the hardhat runtime environment, which allows you to interact with encrypted data in your tests and tasks.
- `hardhat-fhenix-docker` - a plugin that allows you to run a local fhenix testnet in a docker container. This is useful for testing your contracts in a sandbox before deploying them on a testnet or mainnet.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/FhenixProtocol/fhenix-hardhat-example.git
cd hardhat-fhenix-example
pnpm install
```

Once installed, let's run a localfhenix instance:

```sh
pnpm localfhenix:start
```

This will start a localfhenix instance in a docker container. If this worked you should see a `LocalFhenix started` message in your console.

If not, please make sure you have `docker` installed and running on your machine. You can find instructions on how to install docker [here](https://docs.docker.com/get-docker/).

Now that we have a localfhenix instance running, we can deploy our contracts to it:

```sh
npx hardhat deploy
```

Note that this template defaults to use the `localfhenix` network, which is injected into the hardhat configuration.

Finally, we can run the tasks with:

```sh
pnpm task:addCount
pnpm task:getCount
```

TODO: frontend

## More Info

To learn more about the Fhenix Hardhat plugin, check out the [Fhenix Hardhat Plugin Repository](https://github.com/FhenixProtocol/fhenix-hardhat-plugin).
