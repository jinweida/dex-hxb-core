const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const web3 = require('web3');





async function main() {

  const feeAdrr = hre.network.config.attachs.fee;
  console.log("fee to :",feeAdrr);

  const addrs =  hre.network.config.attachs;

  var provider = ethers.provider;

  const accounts = await ethers.getSigners();

  console.log("deploy account: " + accounts[0].address);


  const ParamFeeCalctor = await hre.ethers.getContractFactory("ParamFeeCalctor");
  const paramfeecalctor = await ParamFeeCalctor.deploy(addrs.uniswap.factory);

  paramfeecalctor.deployed();
  console.log("paramfeecalctor deployed to:",paramfeecalctor.address);

  // factory.setPairCalculator(paramfeecalctor.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
