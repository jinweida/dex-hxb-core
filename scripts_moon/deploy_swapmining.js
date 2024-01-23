

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');




async function main() {

  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const BXHToken = await hre.ethers.getContractFactory("BXHToken");
  const bxh = await BXHToken.attach(addrs.bxh);
  Assert.equal("BXH",await bxh.symbol(),"BXHToken Contract Attach Error");
  console.log("BXH attached to:", bxh.address);
var provider = ethers.provider;

  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.attach(addrs.oracle);
  console.log("Oracle attach to:", oracle.address);


  const TokenLock = await hre.ethers.getContractFactory("TokenLock");
  const tokenLock = await TokenLock.attach(addrs.bxh);
  console.log("TokenLock attach to:", tokenLock.address);

  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  var blocknumber = await provider.getBlockNumber();
  var hourblocks = 3600/5;

  const swapMining = await SwapMining.deploy(addrs.bxh,addrs.uniswap.factory,oracle.address,addrs.uniswap.router,addrs.usdt,110*6/10,blocknumber + hourblocks,tokenLock.address);
  await swapMining.deployed();
  console.log("SwapMining deploy to:", swapMining.address);


  const BXHRouter = await hre.ethers.getContractFactory("BXHRouter");
  const router = await BXHRouter.attach(addrs.uniswap.router);
  console.log("router attach to:", router.address);

  const router_swapMining = await router.setSwapMing(swapMining.address);
  console.log("router setSwapMing to:",await router.swapMining());
  const tokenlock = await swapMining.setTokenLock(tokenLock.address);
  console.log("swapMining setTokenLock to:", tokenLock.address);
  const addMinterswapMining = await bxh.addMinter(swapMining.address);
  console.log("bxh addMinter to:", swapMining.address);
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
