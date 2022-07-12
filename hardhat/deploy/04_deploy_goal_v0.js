module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer, nodeAddress } = await getNamedAccounts();
    // const LinkToken = await ethers.getContract("LinkToken")
    // const Operator = await ethers.getContract("Operator")

    await deploy('GoalContractV0', {
        from: deployer,
        log: true,
    });

};
module.exports.tags = ['GoalContractV0'];
// module.exports.dependencies = ['LinkToken', 'Operator'];