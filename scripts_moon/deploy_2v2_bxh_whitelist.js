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

const BXHToken = await hre.ethers.getContractFactory("BXHToken");
const bxh = await BXHToken.attach(attachs.bxh);
console.log("bxh attach to:", bxh.address);

const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);
console.log("refers attach to:",await factory.refers());
const UniswapV2Router02 = await hre.ethers.getContractFactory("BXHRouter");
const router = await UniswapV2Router02.attach(attachs.uniswap.router);
console.log("router attach to:", router.address);

const SwapMining = await hre.ethers.getContractFactory("SwapMining");
const swapMining = await SwapMining.attach(attachs.swapmining);
console.log("swapMining attach to:", swapMining.address);
// addFeeWhitelist
console.log("addFeeWhiteList :", await bxh.addFeeWhitelist(router.address));
console.log("addFeeWhiteList factory:", await bxh.addFeeWhitelist(factory.address));
console.log("addFeeWhiteList refers:", await bxh.addFeeWhitelist(swapMining.address));
console.log("addFeeWhiteList refers:", await bxh.addFeeWhitelist(await factory.refers()));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });