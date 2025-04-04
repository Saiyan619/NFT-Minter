
// deploy.js
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    const NiyiToken = await hre.ethers.getContractFactory("NiyiToken");
    const contract = await NiyiToken.deploy(deployer.address);
    
    // Wait for deployment to complete
    await contract.waitForDeployment();
    
    // Get contract address using getAddress()
    const contractAddress = await contract.getAddress();
    console.log("Contract deployed to:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});