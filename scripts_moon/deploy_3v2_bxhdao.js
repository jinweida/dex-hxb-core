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
const busd = await HUSD.attach(attachs.husd);
console.log("busd attach to:", busd.address);

const BXHToken = await hre.ethers.getContractFactory("BXHToken");
const bxh = await BXHToken.attach(attachs.bxh);
console.log("bxh attach to:", bxh.address);

// constructor(
//   string memory __name,
//   uint256 _lockTime,
//   address _depositToken,
//   address _governance,
//   address chef
// )
const BXHDao = await hre.ethers.getContractFactory("BXHDao");
let bxhdao = await BXHDao.deploy("BXH DAO-7",7*24*60*12,bxh.address,accounts[0].address,accounts[0].address);
await bxhdao.deployed();
console.log("bxhdao7 deploy to:",bxhdao.address);
bxhdao = await BXHDao.deploy("BXH DAO-14",14*24*60*12,bxh.address,accounts[0].address,accounts[0].address);
await bxhdao.deployed();
console.log("bxhdao14 deploy to:",bxhdao.address);
bxhdao = await BXHDao.deploy("BXH DAO-30",30*24*60*12,bxh.address,accounts[0].address,accounts[0].address);
await bxhdao.deployed();
console.log("bxhdao30 deploy to:",bxhdao.address);
bxhdao = await BXHDao.deploy("BXH DAO-60",60*24*60*12,bxh.address,accounts[0].address,accounts[0].address);
await bxhdao.deployed();
console.log("bxhdao60 deploy to:",bxhdao.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });