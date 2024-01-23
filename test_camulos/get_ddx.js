

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { ethers } = require("hardhat");

async function main() {
    const accounts = await ethers.getSigners();
    const addrs =  hre.network.config.attachs;
    const DDX = await hre.ethers.getContractFactory("DDXToken");
    const ddx = await DDX.attach(addrs.ddx);
    console.log("DDX attached to:", ddx.address);
    console.log("DDX.name=",await ddx.name());
    console.log("DDX.totalSupply=",ethers.utils.formatUnits(await ddx.totalSupply(),"wei"));
    console.log("DDX.balance=",ethers.utils.formatUnits(await ddx.balanceOf(accounts[2].address),"wei"));
    console.log("DDX.decimals=",await ddx.decimals());
    console.log("DDX.symbol=",await ddx.symbol());
    console.log("====================================================================================");


    console.log((new Date()).getTime());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
