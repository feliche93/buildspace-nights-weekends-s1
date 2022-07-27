module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer, nodeAddress } = await getNamedAccounts();

    await deploy('GoalContractV0', {
        from: deployer,
        log: false,
    });

};
module.exports.tags = ['GoalContractV0'];