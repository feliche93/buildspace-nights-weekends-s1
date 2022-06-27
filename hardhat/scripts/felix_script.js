// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {


    const address = "0xb0897686c545045aFc77CF20eC7A532E3120E0F1"
    const nodeAddress = "0x0B4fCCBA4110D9a7F3507de322C8c2f8ba43dE33"

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address],
    });

    await hre.network.provider.send("hardhat_setBalance", [
        address,
        ethers.utils.parseEther("4").toHexString(),
    ]);

    const signer = await ethers.getSigner(address);
    // console.log(signer);
    const balance = await signer.getBalance();
    console.log(signer.address + ':' + ethers.utils.formatEther(balance));

    const linkAbi = require('./linkABI.json');

    const LINK = new ethers.Contract(address, linkAbi, signer);

    const tx = await LINK.approve(address, ethers.utils.parseEther("1"));

    console.log(tx);

    // const tx = await LINK.transfer("0xA7828C5BAb02C879Ceb555F567d1833b34E1402B", ethers.utils.parseEther("1"));

    // console.log(tx);
    // const totalSupply = await LINK.balanceOf("0xb7a298189b2c8b703f34cad886e915008c2db738");

    // console.log(`Total supply: ${ethers.utils.formatEther(totalSupply)}`);

    // await LINK.connect(signer).transfer(nodeAddress, 100, { gasLimit: 1000000 });


    // const provider = hre.network.provider;
    // const LINK = new ethers.Contract(address, linkAbi, provider);

    // LINK.connect(provider);








}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
