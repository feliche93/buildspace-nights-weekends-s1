const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer, nodeAddress } = await getNamedAccounts();
    const LinkToken = await ethers.getContract("LinkToken")
    const txOperator = await deploy('Operator', {
        from: deployer,
        args: [
            LinkToken.address,
            deployer
        ],
        log: false,
    });
    // const receiptOperator = await txOperator.wait()

    const operator = await ethers.getContract("Operator")
    let txAuthorize = await operator.setAuthorizedSenders([nodeAddress])
    let receiptAuthorize = await txAuthorize.wait()
    authorized = await operator.isAuthorizedSender(nodeAddress)
    console.log(`Node Addres ${nodeAddress} is authorized: ${authorized} on Operator ${operator.address}`)

};
module.exports.tags = ['Operator'];
module.exports.dependencies = ['LinkToken'];