

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
  console.log("router.swapMining",await router.swapMining())

  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  let swapming = await SwapMining.attach(addrs.swapmining);
  
  let poollen=(await swapming.poolLength()).toString();
  console.log("bsc swapming router=",await swapming.router())
  console.log("poolLength=",poollen);
  for(let pid=0;pid<poollen;pid++){
    let pool=await swapming.poolInfo(pid);
    console.log("pid=",pid,"poolinfo=",pool.pair,"allocPoint=",pool.allocPoint.toString(),"totalQuantity=",pool.totalQuantity.toString(),"allocDDXAmount=",pool.allocDDXAmount.toString());
      //查询是否存在
    let userInfo = await swapming.userInfo(pid, accounts[0].address);
    console.log("userInfo:",userInfo.toString());
    if(userInfo.quantity.gt("0")) {//存在
      taker = true;
      console.log("pid",pid,"userInfo amount gt 0");
    }
  }
  let whitelistlen=(await swapming.getWhitelistLength()).toString();
  console.log("targetToken",await swapming.targetToken());
  console.log("whitelistlen",whitelistlen)
  for(let pid=0;pid<whitelistlen;pid++){
    console.log("white address=",await swapming.getWhitelist(pid));
  }

  
  // //查询收益
  // let getTakerReward = await swapming.getTakerReward(accounts[0].address);
  // console.log("getTakerReward:",getTakerReward.toString());
  // if(getTakerReward.gt("0")) {
  //   //提现
  //   const withdraw = await swapming.takerWithdraw();
  //   console.log("withdraw:",withdraw);
  // }
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
