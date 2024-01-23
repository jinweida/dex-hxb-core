const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

 /** 准备 start */
 const attachs =  hre.network.config.attachs;
 const accounts = await ethers.getSigners();

  //BXHRouter
  const BXHRouter = await hre.ethers.getContractFactory("BXHRouter");
  const router = await BXHRouter.attach(attachs.uniswap.router);
  console.log("router attach to:", router.address);
 //BXH
 const BXHToken = await hre.ethers.getContractFactory("BXHToken");
 const bxh = await BXHToken.attach(attachs.bxh);
 console.log("bxh attach to:", bxh.address);
 //usdt
 const USDT = await hre.ethers.getContractFactory("ERC20Template");
 const usdt = await USDT.attach(attachs.usdt);
 console.log("usdt attached to:", usdt.address);
 /** 准备 end */

const BXHFeeCollector = await hre.ethers.getContractFactory("BXHFeeCollector");
const feeCollector = await BXHFeeCollector.attach(attachs.feecollector);
// const feeCollector = await BXHFeeCollector.deploy(bxh.address,accounts[1].address);

console.log("BXHFeeCollector attach to:", feeCollector.address);
// await bxh.setFeeCollector(feeCollector.address);
// feeCollector.addWhitelist(attachs.router);
const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);

const Oracle = await hre.ethers.getContractFactory("Oracle");
const oracle = await Oracle.attach(attachs.oracle);
// await oracle.deployed();
console.log("oracle attach to:", oracle.address);

const TokenLock = await hre.ethers.getContractFactory("TokenLock");
const tokenLock = await TokenLock.attach(attachs.tokenlock);
// await tokenLock.deployed();
console.log("tokenLock attach to:", tokenLock.address);
// /**
//  * IBXH _bxh,
//       IUniswapV2Factory _factory,
//       IOracle _oracle,
//       address _router,
//       address _targetToken,
//       uint256 _bxhPerBlock,
//       uint256 _startBlock,
//       address _tokenLock
//  */
const SwapMining = await hre.ethers.getContractFactory("SwapMining");
const blockNumber = await ethers.provider.getBlockNumber();
console.log("blockNumber:",blockNumber);
const swapMining = await SwapMining.deploy(bxh.address,factory.address,oracle.address,router.address,usdt.address,ethers.utils.parseEther("52.6","ether"),blockNumber+30,tokenLock.address);
// const swapMining = await SwapMining.attach(attachs.swapmining);
await swapMining.deployed();
console.log("swapMining deployed to:", swapMining.address);
const router_swapMining = await router.setSwapMing(swapMining.address);
console.log("router setSwapMing to:",await router.swapMining());

// const BXHPool = await hre.ethers.getContractFactory("BXHPool");
// var amount = web3.utils.toWei('110','ether');
// var blocknumber = await ethers.provider.getBlockNumber();
// var hourblocks = 25/5;
// // const bxhPool = await BXHPool.deploy(bxh.address,amount,blocknumber + hourblocks,1576800);
// // await bxhPool.deployed();
// const bxhPool = await BXHPool.attach(attachs.bxhpool);
// console.log("bxhPool deployed to:", bxhPool.address);
// const addMinter = await bxh.addMinter(bxhPool.address);
// console.log("bxh addMinter to:", bxhPool.address);

const addMinter = await bxh.addMinter(swapMining.address);
console.log("bxh addMinter to:", swapMining.address);

const tokenlock = await swapMining.setTokenLock(attachs.tokenlock);
console.log("swapMining setTokenLock to:", attachs.tokenlock);

//  console.log("balanceOf ", (await usdt.balanceOf("0x0d9aaBe8A606071FCe70413e5D2E94eDe8f7C1B6")).toString());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });