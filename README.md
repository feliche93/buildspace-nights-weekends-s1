# buildspace-nights-weekends-s1
Repo for Buildspace Nights &amp; Weekends Challenge

## Chainlink
1. Start Ganache with chain id `1337` on port `8545` (Parameters are set in `chainlink/node/.env`)
2. Start node with `sh run_config_node.sh`
4. Node should be available at `localhost:6688`. creds `test@test.de:linklink`
5. Goto `hardhat` folder.
6. Deploy `LinkToken` and `Oracle` with `export HARDHAT_NETWORK=localhost && node scripts/deploy_oracle.js`. Note the adresses. This only has to be done once per ganache setup. As long as you do not reset your chain or fork anew this should be fine.
7. Provide addresses in `hardhat/scripts/test_chainlink.js`
8. Run `npx hardhat test --network localhost` to start automated tests.
