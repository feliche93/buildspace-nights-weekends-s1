require("@nomiclabs/hardhat-waffle");
require("@appliedblockchain/chainlink-plugins-fund-link");
require("@nomiclabs/hardhat-ethers");
require('hardhat-deploy');
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});


task("fundMetamask", "Funds the contract with ETH", async (taskArgs, hre) => {

  const accounts = await hre.ethers.getSigners();
  const metamaskAddress = process.env.METAMASK_WALLET_ADDRESS
  const account = accounts[0];

  await account.sendTransaction({
    to: metamaskAddress,
    value: ethers.utils.parseEther('1')
  });
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7"
      },
      {
        version: "0.4.11"
      },
      {
        version: "0.4.21"
      },
      {
        version: "0.6.6"
      },
      {
        version: "0.7.0"
      }
    ]
  },
  // defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      loggingEnabled: true,
      mining: {
        auto: false,
        interval: 1000
      }

    },
    // ganache: {
    //   url: "http://127.0.0.1:8545",
    //   chainId: 1337
    // },
    // mumbai: {
    //   url: "https://polygon-mumbai.g.alchemy.com/v2/yAiPL8ralrroA3hD7WOqsZWqxq2J9Zv0",
    //   accounts: [
    //     process.env.PRIVATE_KEY
    //   ]
    // }
  },
  namedAccounts: {
    deployer: 0,
    metamaskAddress: process.env.METAMASK_WALLET_ADDRESS,
    nodeAddress: process.env.NODE_ADDRESS,
  },
}
