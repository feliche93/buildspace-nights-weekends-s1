const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { sign } = require("crypto");
const { time } = require("console");
// TESTNET SPECIFIC
// RUN ORACLE AND LINK DEPLOYMENT AN PASTE ADRESSES HERE
const linktok_addr = "0xB953bE15F8aa4113713E33F3c0232Fb872b3F087"
const oracle_addr = "0x54cA4122d4778EE71A99E8868D71Abd571c39d0E"
////////////
const node_addr = "0x6a0014AB4d54529FB5ec93D6A7B6AF80b3d22E37"
var linkTokenAbiBlob = fs.readFileSync('artifacts/link_token/contracts/LinkToken.sol/LinkToken.json')
var OracleAbiBlob = fs.readFileSync('artifacts/@chainlink/contracts/src/v0.7/Operator.sol/Operator.json')
const oracleAbi = JSON.parse(OracleAbiBlob).abi
const linkTokenAbi = JSON.parse(linkTokenAbiBlob).abi

describe("Twitter adapter", function () {
  it("Should return the new greeting once it's changed", async function () {
    let signers = await ethers.getSigners()
    await signers[1].sendTransaction({
      to: node_addr,
      value: ethers.utils.parseEther("1.0")
    });

    // const TwitterAdapter = await ethers.getContractFactory("ChainlinkTwitter");
    // const twitterAdapter = await TwitterAdapter.deploy(linktok_addr, oracle_addr);
    // await twitterAdapter.deployed();
    // console.log("Twitter adapter deployed to: %s", twitterAdapter.address)

    const GoalContract = await ethers.getContractFactory("GoalContract");
    const goalContract = await GoalContract.deploy(linktok_addr, oracle_addr);
    await goalContract.deployed();
    console.log("Goal Contract deployed to: %s", goalContract.address)

    let oracle = new ethers.Contract(oracle_addr, oracleAbi, signers[0])
    let nodeStatus = await oracle.functions.isAuthorizedSender(node_addr)
    console.log(nodeStatus)
    let linkToken = new ethers.Contract(linktok_addr, linkTokenAbi, signers[0])
    await linkToken.functions.transfer(oracle_addr, 200)
    await linkToken.functions.transfer(node_addr, 200)
    let balanceOwner = await linkToken.functions.balanceOf(signers[0].address)
    console.log(balanceOwner)

    // while (await linkToken.functions.balanceOf(twitterAdapter.address) == 0);
    // balanceAdapter = await linkToken.functions.balanceOf(twitterAdapter.address)
    // console.log(balanceAdapter)

    while (await linkToken.functions.balanceOf(oracle_addr) == 0);
    balanceOracle = await linkToken.functions.balanceOf(oracle_addr)
    console.log(balanceOracle)

    while (await linkToken.functions.balanceOf(node_addr) == 0);
    balanceNode = await linkToken.functions.balanceOf(node_addr)
    console.log(balanceNode)

    requestId = await goalContract.functions.createGoal("goal", "hagenho_eth", 7)
    
    requestId = await goalContract.functions.userLastReqId(signers[0].address)
    console.log(requestId[0])
    console.log(typeof(await goalContract.functions.requestIdGoalRequest(requestId[0])))
    while (!await goalContract.functions.requestIdGoalRequest(requestId[0])){
      requestId = await goalContract.functions.userLastReqId(signers[0].address)
      goalReq = await goalContract.functions.requestIdGoalRequest(requestId[0])
      console.log(goalReq)  
    }
    // payload = await goalContract.functions.getLastUserGoal(signers[0].address)
    // console.log("Payload", payload)
    
    // requestId = await goalContract.functions.requestLikesSinceTs("hagenho_eth", (timestamp - 300000).toString())
    // console.log("Request sent ", requestId)
    // while (!await goalContract.madeRequests(requestId)[3]);
    // let likes = await goalContract.madeRequests(requestId)[4]
    // console.log(likes)
    // expect().to.equal(200)
  
    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

