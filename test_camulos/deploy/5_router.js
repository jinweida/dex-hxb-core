const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {

  
  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();

  console.log("deploy account: " + accounts[0].address);
  
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(addrs.uniswap.factory);
  console.log("factory attached to:", factory.address);

  const pairCodeHash = await factory.pairCodeHash();
  console.log("factory pairCodeHash is:", pairCodeHash);

  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.deploy(factory.address,addrs.wbnb);
  await router.deployed();
  console.log("router deployed to:", router.address);

  //set swapMining

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
