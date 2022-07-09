const { ethers } = require("hardhat")

async function main(){

  
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();
  await myToken.deployed();
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(0xba6E3F60b2085495BA5C1C10cE247B3fD97fBB62);
  await lottery.deployed();
  console.log(`Contract successfully deployed to ${lottery.address}`);
  console.log(`Token successfully deployed to ${myToken.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
