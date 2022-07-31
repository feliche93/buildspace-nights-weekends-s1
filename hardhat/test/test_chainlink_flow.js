const { deployments } = require('hardhat');
const { ethers, getNamedAccounts } = require('hardhat');
const { expect } = require("chai");

describe('Test Chainlink Flow', () => {
    it('Positive Node balance', async function () {

        const { deployer, nodeAddress } = await getNamedAccounts();

        const signer = await ethers.getSigner(deployer);
        const node = await ethers.getSigner(nodeAddress);

        // Funde node with ether
        await signer.sendTransaction({
            to: nodeAddress,
            value: ethers.utils.parseEther('10')
        });
        await new Promise(r => setTimeout(r, 2000));
        const balance = await node.getBalance();
        console.log(`Node ${nodeAddress} balance: ${balance}`);

        // Checks if node balance is greater than 0
        await expect(balance).to.be.gt(0);
    });

    // it('Reverts goal with 0 deadline', async function () {
    //     await deployments.fixture("GoalContract")
    //     const goalContract = await ethers.getContract("GoalContract");
    //     await expect(goalContract.createGoal('Test', 'hagenho_eth', 0)).to.be.reverted;
    // });

    it('Succesfully creates a goal', async function () {
        const { deployer, nodeAddress } = await getNamedAccounts();
        const signer = await ethers.getSigner(deployer);
        // await deployments.fixture("GoalContractV1")
        const goalContract = await ethers.getContract("GoalContractV1");
        // console.log(`GoalContract address: ${goalContract.address}`)
        // console.log(`GoalContract Oracle address: ${await goalContract.oracle()}`)
        const operatorContract = await ethers.getContract("Operator");
        console.log(`Operator address: ${operatorContract.address}`)

        const createdGoal = await goalContract.createGoalRequest('Test', 0, 'cryptoneur_eth', 1657828533, 1657828533) // expext().to.emit(goalContract, 'GoalRequestCreated');

        const requestId = await goalContract.userToLastReqId(signer.address);
        goalRequest = await goalContract.requestIdToGoalRequest(requestId);
        while (!goalRequest[6]) {
            goalRequest = await goalContract.requestIdToGoalRequest(requestId);
            console.log(goalRequest);
        }
        console.log("Goal succesfully requested.")
        const userGoalId = await goalContract.getLastUserGoal(signer.address);
        console.log(`Goal id ${userGoalId}`)
        const evaluatedGoal = await goalContract.createGoalEvaluationRequest(userGoalId)
        

        // console.log(`Created goal: ${goalRequest[6]}`);
    });

    // yarn hardhat test --network localhost --deploy-fixture

});