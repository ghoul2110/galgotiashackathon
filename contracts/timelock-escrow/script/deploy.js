const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying TimeLockEscrow with the account:", deployer.address);

  // Deploy the contract
  const TimeLockEscrow = await hre.ethers.getContractFactory("TimeLockEscrow");
  const timeLockEscrow = await TimeLockEscrow.deploy();

  await timeLockEscrow.deployed();

  console.log("TimeLockEscrow deployed to:", timeLockEscrow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 