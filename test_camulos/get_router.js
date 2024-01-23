

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { ethers } = require("hardhat");

async function main() {
  const addrs =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(addrs.uniswap.factory);
  console.log("factory attached to:", factory.address);

  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const pair=await factory.getPair(addrs.husd,addrs.hbtc);
  console.log("pair=",pair)
  const pairContract = await UniswapV2Pair.attach(pair);
  //find reserve0 and reserve1
  let reserves=await pairContract.getReserves();
  console.log("_reserve0=",reserves._reserve0.toString(),"_reserve1=",reserves._reserve1.toString());
  //find token0 and token1 address
  console.log("token0=",await pairContract.token0());
  console.log("token1=",await pairContract.token1());

  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(addrs.uniswap.router);
  console.log("router attached to:", router.address);

  console.log("router.swapMining=",await router.swapMining());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
