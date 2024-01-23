const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { ethers } = require("hardhat");


async function main() {

  const addrs =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  const DDX = await hre.ethers.getContractFactory("DDXToken");
  let ddx = await DDX.attach(addrs.ddx);

  console.log(await ddx.addFeeWhitelist(addrs.uniswap.factory));
  console.log(await ddx.addFeeWhitelist(addrs.uniswap.router));
  console.log(await ddx.addFeeWhitelist(addrs.refers));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
