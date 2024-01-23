

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');




async function main() {

  const addrs =  hre.network.config.attachs;

  var provider = ethers.provider;

  const accounts = await ethers.getSigners();
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(addrs.ddx);
  Assert.equal("DDX",await ddx.symbol(),"DDXToken Contract Attach Error");
  console.log("DDX attached to:", ddx.address);


  const DDXPool = await hre.ethers.getContractFactory("DDXPool");
  //奖励88*40%=37.2
  var amount = ethers.utils.parseUnits("37.2")
  var blocknumber = await provider.getBlockNumber();
  var hourblocks = 3600/5;
  const ddxpool = await DDXPool.deploy(
    ddx.address,amount,blocknumber + hourblocks,1576800,
    addrs.wbnb,addrs.uniswap.factory,addrs.tokenlock);
  await ddxpool.deployed();

  console.log("DDXPool deployed to:", ddxpool.address);
  
  var minterAdd = await ddx.addMinter(ddxpool.address);

  console.log("DDXPool as minter :", minterAdd);
    
  await ddxpool.setTokenLock(addrs.tokenlock);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
