// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    const { deployer, nodeAddress } = await getNamedAccounts();
    // Deploys Link Token
    const LinkToken = await hre.ethers.getContractFactory("LinkToken");
    const linkToken = await LinkToken.deploy();
    await linkToken.deployed();
    console.log("Link Token deployed to: ", linkToken.address);

    // Deploys Oracle
    const Oracle = await hre.ethers.getContractFactory("Operator");
    const oracle = await Oracle.deploy(linkToken.address, deployer);
    await oracle.deployed();
    console.log("Oracle deployed to: ", oracle.address);

    // // Deploys Twitter Adapter
    // const TwitterAdapter = await hre.ethers.getContractFactory("TwitterAdapter");
    // const twitterAdapter = await twitterAdapter.deploy(
    //     linkToken.address,
    //     oracle.address,

    // );


    // const TwitterAdapter = await hre.ethers.getContractFactory("TwitterAdapter");
    // const linkTokenAddress = linkToken.address;


    // console.log("Greeter deployed to:", twitterAdapter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
