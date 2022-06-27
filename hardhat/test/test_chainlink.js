const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { sign } = require("crypto");
// TESTNET SPECIFIC
// RUN ORACLE AND LINK DEPLOYMENT AN PASTE ADRESSES HERE
const linktok_addr = "0x12DC673B7926fBE1ED91FBE4688aAa9E13007C68"
const oracle_addr = "0x871030BDbA0Fea8BFB342f91453C068a6EDc47a2"
////////////
const node_addr = "0x9d6862ab0eA7A6A8D5637Bd9876Da2410F65ac46"
var linkTokenAbiBlob = fs.readFileSync('artifacts/link_token/contracts/LinkToken.sol/LinkToken.json')
var OracleAbiBlob = fs.readFileSync('artifacts/@chainlink/contracts/src/v0.6/Oracle.sol/Oracle.json')
const oracleAbi = JSON.parse(OracleAbiBlob).abi
const linkTokenAbi = JSON.parse(linkTokenAbiBlob).abi

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    let signers = await ethers.getSigners()
    await signers[0].sendTransaction({
      to: node_addr,
      value: ethers.utils.parseEther("1.0")
    });
    // await signers[0].sendTransaction({
    //   to: oracle_addr,
    //   value: ethers.utils.parseEther("1.0")
    // });

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
    await linkToken.functions.transfer(node_addr, 2)
    await linkToken.functions.transfer(twitterAdapter.address, 2)
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
