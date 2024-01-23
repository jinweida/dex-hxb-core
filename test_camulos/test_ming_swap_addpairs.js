

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { ethers } = require("hardhat");

async function main() {
  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  //DDXRouter
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(addrs.uniswap.router);
  console.log("router attach to:", router.address);

  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  let swapming = await SwapMining.attach(addrs.swapmining);

  const DDX = await hre.ethers.getContractFactory("DDXToken");
  let ddx = await DDX.attach(addrs.ddx);
  await ddx.addMinter(swapming.address);
  //创建swapming 必须的设置 因为这个授权TransferHelper.safeApprove在constructor 没有操作
  await swapming.setTokenLock(addrs.tokenlock);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(addrs.uniswap.factory);
  console.log("factory attached to:", factory.address);
  //第一次初始化缓存 start
  //根据后端返回的币对列表(当前用合约实现遍历pair)
  const pairLength = await factory.allPairsLength();
  console.log("pairLength:",pairLength);
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");

  for(let i = 0;i<pairLength;i++) {
    let pair = await factory.allPairs(i);
    console.log("pair:",pair);
    pair = await UniswapV2Pair.attach(pair);

    await swapming.addPair(ethers.utils.parseUnits("10"),pair.address,true);
    await swapming.addWhitelist(await pair.token0());
    await swapming.addWhitelist(await pair.token1());
  }
  let poollen=(await swapming.poolLength()).toString();
  console.log("poolLength=",poollen);
  for(let pid=0;pid<poollen;pid++){
      let pool=await swapming.poolInfo(pid);
      console.log("pid=",pid,"poolinfo=",pool.pair,"allocPoint=",pool.allocPoint.toString(),"totalQuantity=",pool.totalQuantity.toString());
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
