

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  //DDXRouter
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(attach.uniswap.router);
  console.log("router attach to:", router.address);
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  /** 准备 end */

  //根据后端返回的币对列表(当前用合约实现遍历pair)
  const pairLength = await factory.allPairsLength();
  console.log("pairLength:",pairLength.toString());
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");

  for(let i = 0;i<pairLength;i++) {
    let pair = await factory.allPairs(i);
    console.log("====pair:",pair,"====================================");
    // pair = await UniswapV2Pair.attach(pair);
    
    const ParamFeeCalctor = await hre.ethers.getContractFactory("ParamFeeCalctor");
    const paramfeecalctor = await ParamFeeCalctor.attach(pair);
    await paramfeecalctor.setPairParams(pair,9975,10000,0,0);
  }


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
