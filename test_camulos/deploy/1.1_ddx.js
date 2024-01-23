

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");

async function main() {


  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();

  console.log("deploy account: " + accounts[0].address);
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.deploy();
  await ddx.deployed();
  // const bxh = await BXH.attach(addrs.bxh);
  console.log("DDX deployed to:", ddx.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
