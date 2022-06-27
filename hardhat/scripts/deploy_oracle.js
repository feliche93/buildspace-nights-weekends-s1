// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const node_addr = "0x9d6862ab0eA7A6A8D5637Bd9876Da2410F65ac46"

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  // Deploy link token and oralce once to use in later tests and automation
  // This need to be semi static as we have to configure the node also
  const LinkToken = await hre.ethers.getContractFactory("LinkToken");
  const linkToken = await LinkToken.deploy();
  await linkToken.deployed();

  // Addresss in Chainlink Node Operator GUI
  // TODO: Change address if docker redeploys
  const nodeAddress = "0x00680333598676D85622275b03f69666B4986fcC";

  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(linkToken.address);
  await oracle.deployed();

  await oracle.functions.setFulfillmentPermission(nodeAddress, true)

  console.log("Link Token deployed to:", linkToken.address);
  console.log("Oracle deployed to:", oracle.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
