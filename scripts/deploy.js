const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const GradeVerification = await hre.ethers.getContractFactory(
    "GradeVerification"
  );
  const gradeVerification = await GradeVerification.deploy();

  await gradeVerification.deployed();

  console.log("GradeVerification deployed to:", gradeVerification.address);

  // Save contract address and ABI for Laravel/React integration
  const contractData = {
    address: gradeVerification.address,
    abi: JSON.parse(gradeVerification.interface.format("json")),
  };

  fs.writeFileSync(
    "./contract-data.json",
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract data saved to contract-data.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
