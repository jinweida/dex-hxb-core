const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

const accounts = await ethers.getSigners();
//  for (const account of accounts) {
//      const balance = await ethers.provider.getBalance(account.address);

//     console.log(account.address+",balance="+balance);
//   }
const attachs = hre.network.config.attachs;
const WHT = await hre.ethers.getContractFactory("WHT");
const wht = await WHT.attach(attachs.wht);
console.log("wht attach to:", wht.address);

const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
const usdt = await HUSD.attach(attachs.usdt);
console.log("usdt attach to:", usdt.address);

const BXHToken = await hre.ethers.getContractFactory("BXHToken");
const bxh = await BXHToken.attach(attachs.bxh);
console.log("bxh attach to:", bxh.address);

const BXHFeeCollector = await hre.ethers.getContractFactory("BXHFeeCollector");
const feeCollector = await BXHFeeCollector.deploy(bxh.address,accounts[1].address);
await feeCollector.deployed();
// const bxh = await BXH.attach(addrs.bxh);
console.log("BXHFeeCollector deployed to:", feeCollector.address);
await bxh.setFeeCollector(feeCollector.address);

const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);
console.log("refers attach to:",await factory.refers());
const UniswapV2Router02 = await hre.ethers.getContractFactory("BXHRouter");
const router = await UniswapV2Router02.deploy(factory.address,wht.address);
await router.deployed();
console.log("router deployed to:", router.address);

const Oracle = await hre.ethers.getContractFactory("Oracle");
const oracle = await Oracle.deploy(factory.address,1800);
await oracle.deployed();
console.log("oracle deployed to:", oracle.address);

const TokenLock = await hre.ethers.getContractFactory("TokenLock");
const tokenLock = await TokenLock.deploy(bxh.address);
await tokenLock.deployed();
console.log("tokenLock deployed to:", tokenLock.address);
/**
 * IBXH _bxh,
      IUniswapV2Factory _factory,
      IOracle _oracle,
      address _router,
      address _targetToken,
      uint256 _bxhPerBlock,
      uint256 _startBlock,
      address _tokenLock
 */
const SwapMining = await hre.ethers.getContractFactory("SwapMining");
const blockNumber = await ethers.provider.getBlockNumber();
console.log("blockNumber:",blockNumber);
const swapMining = await SwapMining.deploy(bxh.address,factory.address,oracle.address,router.address,usdt.address,ethers.utils.parseUnits("52.6"),blockNumber+30,tokenLock.address);
// const swapMining = await SwapMining.attach(attachs.swapmining);
await swapMining.deployed();
console.log("swapMining deployed to:", swapMining.address);
const router_swapMining = await router.setSwapMing(swapMining.address);
console.log("router setSwapMing to:",await router.swapMining());
const tokenlock = await swapMining.setTokenLock(tokenLock.address);
console.log("swapMining setTokenLock to:", tokenLock.address);
const addMinterswapMining = await bxh.addMinter(swapMining.address);
console.log("bxh addMinter to:", swapMining.address);

const BXHPool = await hre.ethers.getContractFactory("BXHPool");
var amount = web3.utils.toWei('35.2','ether');
var blocknumber = await ethers.provider.getBlockNumber();
var hourblocks = 25/5;
const bxhPool = await BXHPool.deploy(bxh.address,amount,blocknumber + hourblocks,1576800,wht.address);
await bxhPool.deployed();
// const bxhPool = await BXHPool.attach(attachs.bxhpool);
console.log("bxhPool deployed to:", bxhPool.address);
 await bxh.addMinter(bxhPool.address);
console.log("bxh addMinter to:", bxhPool.address);

const Repurchase = await hre.ethers.getContractFactory("Repurchase");
// const repurchase = await Repurchase.deploy(1000,"0x56146B129017940D06D8e235c02285A3d05D6B7C");
const repurchase = await Repurchase.attach(attachs.repurchase);
// await repurchase.deployed();
console.log("repurchase attach to:", repurchase.address);
const s = await factory.setRepurchaseTo(repurchase.address);
console.log("factory setRepurchaseTo to:", repurchase.address);
await repurchase.addCaller(accounts[0].address);
console.log("repurchase addCaller to:", accounts[0].address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });