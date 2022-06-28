const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { sign } = require("crypto");
const { time } = require("console");
// TESTNET SPECIFIC
// RUN ORACLE AND LINK DEPLOYMENT AN PASTE ADRESSES HERE
const linktok_addr = "0x467472B3FD8980d901E0A4055a2bF20a370e5F02"
const oracle_addr = "0xA65952CE9D220B0106f7902aB04E08a124F684Dd"
////////////
const node_addr = "0x56DDe95fFEFB87631Cf0a74B7b34D1fef8432dCA"
var linkTokenAbiBlob = fs.readFileSync('artifacts/link_token/contracts/LinkToken.sol/LinkToken.json')
var OracleAbiBlob = fs.readFileSync('artifacts/@chainlink/contracts/src/v0.7/Operator.sol/Operator.json')
const oracleAbi = JSON.parse(OracleAbiBlob).abi
const linkTokenAbi = JSON.parse(linkTokenAbiBlob).abi

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    let signers = await ethers.getSigners()
    await signers[1].sendTransaction({
      to: node_addr,
      value: ethers.utils.parseEther("1.0")
    });

    const TwitterAdapter = await ethers.getContractFactory("ChainlinkTwitter");
    TwitterAdapter
    const twitterAdapter = await TwitterAdapter.deploy(linktok_addr, oracle_addr);
    await twitterAdapter.deployed();
    console.log("Twitter adapter deployed to: %s", twitterAdapter.address)

    let oracle = new ethers.Contract(oracle_addr, oracleAbi, signers[0])
    let nodeStatus = await oracle.functions.isAuthorizedSender(node_addr)
    console.log(nodeStatus)
    let linkToken = new ethers.Contract(linktok_addr, linkTokenAbi, signers[0])
    await linkToken.functions.transfer(oracle_addr, 200)
    await linkToken.functions.transfer(node_addr, 200)
    await linkToken.functions.transfer(twitterAdapter.address, 200)
    let balanceOwner = await linkToken.functions.balanceOf(signers[0].address)
    console.log(balanceOwner)

    while (await linkToken.functions.balanceOf(twitterAdapter.address) == 0);
    balanceAdapter = await linkToken.functions.balanceOf(twitterAdapter.address)
    console.log(balanceAdapter)

    while (await linkToken.functions.balanceOf(oracle_addr) == 0);
    balanceOracle = await linkToken.functions.balanceOf(oracle_addr)
    console.log(balanceOracle)

    while (await linkToken.functions.balanceOf(node_addr) == 0);
    balanceNode = await linkToken.functions.balanceOf(node_addr)
    console.log(balanceNode)

    await twitterAdapter.functions.requestLastUserTweetTs("hagenho_eth")
    while (!await twitterAdapter.fullfilled1());
    let timestamp = await twitterAdapter.timeStamp()
    console.log(timestamp)
    await twitterAdapter.functions.requestLikesSinceTs("hagenho_eth", (timestamp - 300000).toString())
    while (!await twitterAdapter.fullfilled2());
    let likes = await twitterAdapter.likes()
    console.log(likes)
    // expect().to.equal(200)
  
    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
