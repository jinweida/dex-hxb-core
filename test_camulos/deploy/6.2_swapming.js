

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');




async function main() {

  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(addrs.ddx);
  Assert.equal("DDX",await ddx.symbol(),"DDXToken Contract Attach Error");
  console.log("DDX attached to:", ddx.address);

    var provider = ethers.provider;


  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  var blocknumber = await provider.getBlockNumber();
  
  var hourblocks = 5;
  //奖励88*60%=52.8
  const swapMining = await SwapMining.deploy(
    addrs.ddx,addrs.uniswap.factory,addrs.oracle,
    addrs.uniswap.router,addrs.usdt,ethers.utils.parseUnits("52.8"),blocknumber + hourblocks,
    addrs.tokenlock);
  await swapMining.deployed();
  console.log("SwapMining deploy to:", swapMining.address);

  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(addrs.uniswap.router);
  console.log("router attach to:", router.address);
  
  await router.setSwapMing(swapMining.address);
  console.log("router.swapming=",await router.swapMining());


  // await bxhpool.transferOwnership(addrs.owner);

  // const newowner = await bxhpool.owner();

  // console.log("BXHPool owner transfer from:%s to %s", owner,newowner);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
