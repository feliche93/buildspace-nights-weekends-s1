const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer, nodeAddress } = await getNamedAccounts();
    const LinkToken = await ethers.getContract("LinkToken")
    await deploy('Operator', {
        from: deployer,
        args: [
            LinkToken.address,
            deployer
        ],
        log: false,
    });

    const operator = await ethers.getContract("Operator")
    await operator.setAuthorizedSenders([nodeAddress])

    authorized = await operator.isAuthorizedSender(nodeAddress)
    console.log(`Node Addres ${nodeAddress} is authorized: ${authorized} on Operator ${operator.address}`)

};
module.exports.tags = ['Operator'];
module.exports.dependencies = ['LinkToken'];