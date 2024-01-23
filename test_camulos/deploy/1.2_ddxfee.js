

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");

async function main() {


  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const DDXFeeCollector = await hre.ethers.getContractFactory("DDXFeeCollector");
  const feeCollector = await DDXFeeCollector.deploy(addrs.ddx,accounts[1].address);
  await feeCollector.deployed();
  // const bxh = await BXH.attach(addrs.bxh);
  console.log("DDXFeeCollector deployed to:", feeCollector.address);

  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(addrs.ddx);
  await ddx.setFeeCollector(feeCollector.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
