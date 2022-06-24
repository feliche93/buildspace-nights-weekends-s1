const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { sign } = require("crypto");
// TESTNET SPECIFIC
// RUN ORACLE AND LINK DEPLOYMENT AN PASTE ADRESSES HERE
const oracle_addr = "0xF9912D41dD97b5C75Acb1fc48C9dE1e3D120fb6e"
const linktok_addr = "0x7cB3344462a3a6b5e7c164b87aBa8BC9FFfAFe9B"
////////////
const node_addr = "0x6dd9862Add1FCd6d0547deE37C7eC178322517f4"
var linkTokenAbiBlob = fs.readFileSync('artifacts/link_token/contracts/LinkToken.sol/LinkToken.json')
var OracleAbiBlob = fs.readFileSync('artifacts/@chainlink/contracts/src/v0.6/Oracle.sol/Oracle.json')
const oracleAbi = JSON.parse(OracleAbiBlob).abi
const linkTokenAbi = JSON.parse(linkTokenAbiBlob).abi

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    let signers = await ethers.getSigners()
    const tx = await signers[0].sendTransaction({
      to: node_addr,
      value: ethers.utils.parseEther("1.0")
  });

    const TwitterAdapter = await ethers.getContractFactory("ChainlinkTwitter");
    TwitterAdapter
    const twitterAdapter = await TwitterAdapter.deploy(linktok_addr, oracle_addr);
    await twitterAdapter.deployed();
    console.log("Twitter adapter deployed to: %s", twitterAdapter.address)

    let oracle = new ethers.Contract(oracle_addr, oracleAbi, signers[0])
    let nodeStatus = await oracle.functions.getAuthorizationStatus(node_addr)
    console.log(nodeStatus)
    let linkToken = new ethers.Contract(linktok_addr, linkTokenAbi, signers[0])
    // let linkTokenCon = linkToken.connect(signer)
    await linkToken.functions.transfer(twitterAdapter.address, 200)
    let balanceOwner = await linkToken.functions.balanceOf(signers[0].address)
    console.log(balanceOwner)

    let balanceAdapter = await linkToken.functions.balanceOf(twitterAdapter.address)
    console.log(balanceAdapter)

    await twitterAdapter.functions.requestLastUserTweetTs("0xhagenho")
    while (!await twitterAdapter.fullfilled());
    let timestamp = await twitterAdapter.timeStamp()
    console.log(timestamp)
    // expect().to.equal(200)
  
    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
