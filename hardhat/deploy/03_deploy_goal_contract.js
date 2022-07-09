module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer, nodeAddress } = await getNamedAccounts();
    const LinkToken = await ethers.getContract("LinkToken")
    const Operator = await ethers.getContract("Operator")

    await deploy('GoalContract', {
        from: deployer,
        args: [
            LinkToken.address,
            Operator.address
        ],
        log: true,
    });

};
module.exports.tags = ['GoalContract'];
module.exports.dependencies = ['LinkToken', 'Operator'];