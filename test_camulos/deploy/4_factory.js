const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const web3 = require('web3');





async function main() {

  const feeAdrr = hre.network.config.attachs.fee;
  console.log("fee to :",feeAdrr);

  const addrs =  hre.network.config.attachs;

  var provider = ethers.provider;

  const accounts = await ethers.getSigners();

  console.log("deploy account: " + accounts[0].address);
  const References = await hre.ethers.getContractFactory("References");
  const refers = await References.attach(addrs.refers);
  console.log("refers deployed to:",refers.address);


  const referRatio=300;
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(feeAdrr,refers.address,referRatio);
  await factory.deployed();
  console.log("factory deployed to:", factory.address);

  //set free
  await factory.setFeeTo(feeAdrr);
  //set repurchase
  await factory.setRepurchaseTo(accounts[9].address);

  const pairCodeHash = await factory.pairCodeHash();
  console.log("factory pairCodeHash is:", pairCodeHash);
  //设置factory操作refers
  await refers.addCaller(factory.address);
  console.log("设置factory操作refers",factory.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
