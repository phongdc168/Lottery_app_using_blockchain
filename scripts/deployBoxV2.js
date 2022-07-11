const { ethers, upgrades } = require("hardhat")

const PROXY = "0x8AFac3FBa8A9Ff2d415ADB2843eeEdFB5E4cBa2F";
async function main(){
    const BoxV2 = await ethers.getContractFactory("BoxV2");
    await upgrades.upgradeProxy(PROXY, BoxV2);
    console.log("Box upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
