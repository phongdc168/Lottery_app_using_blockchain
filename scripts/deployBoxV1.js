const { ethers, upgrades } = require("hardhat")

async function main(){
    const Box = await ethers.getContractFactory("Box");
    const box = await upgrades.deployProxy(Box, [50], {
        initializer: "initialize"
    });
    await box.deployed();
    console.log("Box deployed at address: ", box.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
