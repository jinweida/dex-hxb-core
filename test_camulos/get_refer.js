

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { ethers } = require("hardhat");

async function main() {
    const feeAdrr = hre.network.config.attachs.fee;
    console.log("fee to :",feeAdrr);
  
    const addrs =  hre.network.config.attachs;
  
    const accounts = await ethers.getSigners();
  
    for (const account of accounts) {
       const balance = await ethers.provider.getBalance(account.address);
  
      console.log(account.address+",wbnb balance="+balance);
    }
  
    const References = await hre.ethers.getContractFactory("References");
    const refers = await References.attach(addrs.refers);
    console.log(await refers.rewardFeeRatio(0))
    // console.log("refers deployed to:",refers.address);
    // console.log()
    // console.log("refers",(await refers.pendingWithdraw(accounts[2].address,"0x333E5bb02B2407aF51cE56C931b0Cd3B4c71df08")).toString())

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
