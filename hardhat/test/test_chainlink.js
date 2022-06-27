const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { sign } = require("crypto");
// TESTNET SPECIFIC
// RUN ORACLE AND LINK DEPLOYMENT AN PASTE ADRESSES HERE
const linktok_addr = "0x5d582672519AAf9f67166226A2a846D50Dfe2234"
const oracle_addr = "0x04983fFa48bc3f6213De80DDa18515F8C7a74a8e"
////////////
const node_addr = "0x56DDe95fFEFB87631Cf0a74B7b34D1fef8432dCA"
var linkTokenAbiBlob = fs.readFileSync('artifacts/link_token/contracts/LinkToken.sol/LinkToken.json')
var OracleAbiBlob = fs.readFileSync('artifacts/@chainlink/contracts/src/v0.6/Oracle.sol/Oracle.json')
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
    let nodeStatus = await oracle.functions.getAuthorizationStatus(node_addr)
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
