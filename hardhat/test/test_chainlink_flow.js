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
            value: ethers.utils.parseEther('1')
        });

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
        await deployments.fixture("GoalContractV1")
        const goalContract = await ethers.getContract("GoalContractV1");
        const createdGoal = await goalContract.createGoal('Test', 'hagenho_eth', 1657828533) // expext().to.emit(goalContract, 'GoalRequestCreated');

        // const requestId = await.goalContract.getRequestId();

        console.log(`Created goal: ${requestId}`);
    });

});