// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = hre.ethers
const nodeAddress = "0x56DDe95fFEFB87631Cf0a74B7b34D1fef8432dCA";

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

  Oracle = await hre.ethers.getContractFactory("Operator");
  let signers = await ethers.getSigners()
  const Oracle2 = Oracle.connect(signers[0])
  const oracle = await Oracle2.deploy(linkToken.address, signers[0].address);
  await oracle.deployed();
  console.log("Oracle deployed!")

  await oracle.functions.setAuthorizedSenders([nodeAddress])
  authorized = await oracle.isAuthorizedSender(nodeAddress)

  console.log("Is authorized:", authorized)
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
