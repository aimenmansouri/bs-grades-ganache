const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const ethers = hre.ethers;
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    await deployer.getAddress()
  );
  console.log(
    "Account balance:",
    (await ethers.provider.getBalance(deployer.address)).toString()
  );

  const GradeVerification = await ethers.getContractFactory(
    "GradeVerification"
  );
  const gradeVerification = await GradeVerification.deploy(); // ethers v6: await deploy auto-deploys

  console.log("GradeVerification deployed to:", gradeVerification.target); // Use .target in ethers v6

  // Save contract address and ABI for Laravel/React integration
  const contractData = {
    address: gradeVerification.target, // ethers v6 uses .target instead of .address
    abi: JSON.parse(GradeVerification.interface.formatJson()),
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
