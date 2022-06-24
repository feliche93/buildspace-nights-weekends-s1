# buildspace-nights-weekends-s1
Repo for Buildspace Nights &amp; Weekends Challenge

## Chainlink
1. Start Ganache with chain id `1337` on port `8545` (Parameters are set in `chainlink/node/.env`)
2. Start node with `chainlink/node/run_config_node.sh`
3. Unlock node with pw from `chainlink/node/pw`
4. Node should be available at `localhost:6688`
5. Goto `hardhat` folder.
6. Deploy `LinkToken` and `Oracle` with `export HARDHAT_NETWORK=localhost && node scripts/deploy_oracle.js`. Note the adresses.
7. Provide addresses in `hardhat/scripts/test_chainlink.js`
8. Run `npx hardhat test --network localhost` to start automated tests.
