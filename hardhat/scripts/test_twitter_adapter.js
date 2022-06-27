// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

    // Deploys Link Token
    const LinkToken = await hre.ethers.getContractFactory("LinkToken");
    const linkToken = await LinkToken.deploy();
    await linkToken.deployed();
    console.log("Link Token deployed to: ", linkToken.address);

    // Deploys Oracle
    const Oracle = await hre.ethers.getContractFactory("Oracle");
    const oracle = await Oracle.deploy(linkToken.address);
    await oracle.deployed();
    console.log("Oracle deployed to: ", oracle.address);

    // Addresss in Chainlink Node Operator GUI
    // TODO: Change address if docker redeploys
    const nodeAddress = "0x00680333598676D85622275b03f69666B4986fcC";

    // Sets Oracle as a Fulfillment Permission for the Node
    await oracle.functions.setFulfillmentPermission(nodeAddress, true)
    console.log("Oracle set as Fulfillment Permission for Node: ", nodeAddress);

    // Deploys Twitter Adapter
    const TwitterAdapter = await hre.ethers.getContractFactory("TwitterAdapter");
    const twitterAdapter = await twitterAdapter.deploy(
        linkToken.address,
        oracle.address,

    );


    const TwitterAdapter = await hre.ethers.getContractFactory("TwitterAdapter");
    const linkTokenAddress = linkToken.address;


    console.log("Greeter deployed to:", twitterAdapter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
