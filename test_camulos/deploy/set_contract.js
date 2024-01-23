const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");

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
  //设置奖励比例
  await refers.initTable([50,30,20]);
  console.log("设置奖励比例",[50,30,20])
  
  await refers.setTokenLock(addrs.tokenlock);

  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  const swapmining=await SwapMining.attach(addrs.swapmining);
  await swapmining.setRouter(addrs.uniswap.router);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
