const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');


async function main() {

  
  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();

  console.log("deploy account: " + accounts[0].address);
  
  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(addrs.uniswap.factory,180);
  console.log("Oracle attached to",oracle.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
