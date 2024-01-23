

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { ethers } = require("hardhat");

async function main() {
    const accounts = await ethers.getSigners();
    // console.log((await ethers.provider.getBlock('latest')).number);
    // console.log(ethers.utils.parseUnits("10").toString())
    const addrs =  hre.network.config.attachs;
    const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
    const husd = await HUSD.attach(addrs.husd);
    console.log("HUSD attached to:", husd.address);
    console.log("HUSD.name=",await husd.name());
    console.log("HUSD.totalSupply=",ethers.utils.formatUnits(await husd.totalSupply(),"wei"));
    console.log("HUSD.balance=",ethers.utils.formatUnits(await husd.balanceOf(accounts[0].address),"wei"));
    console.log("HUSD.decimals=",await husd.decimals());
    console.log("HUSD.symbol=",await husd.symbol());
    console.log("====================================================================================");
    const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
    const hbtc = await ERC20Template.attach(addrs.hbtc);
    console.log("HBTC attached to:", hbtc.address);  
    console.log("HBTC.name=",await hbtc.name());
    console.log("HBTC.totalSupply=",ethers.utils.formatUnits(await hbtc.totalSupply(),"wei"));
    console.log("HBTC.balance=",ethers.utils.formatUnits(await hbtc.balanceOf(accounts[0].address),"wei"));
    console.log("HBTC.decimals=",await hbtc.decimals());
    console.log("HBTC.symbol=",await hbtc.symbol());

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
