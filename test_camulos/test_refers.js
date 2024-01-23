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
  console.log("refers deployed to:",refers.address);

  await refers.setReferee(accounts[1].address);
  await refers.connect(accounts[1]).setReferee(accounts[2].address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
