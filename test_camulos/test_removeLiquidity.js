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

  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(addrs.husd);
  console.log("HUSD attached to:", husd.address);

  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const hbtc = await ERC20Template.attach(addrs.hbtc);
  console.log("HBTC attached to:", hbtc.address);

  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(addrs.uniswap.router);
  console.log("router deployed to:", router.address);
  console.log("husd totalSupply=",await husd.totalSupply());
  console.log("hbtc totalSupply=",await hbtc.totalSupply());
  
  const dealine=(new Date()).getTime()+9000;
  const liquidity=ethers.utils.parseEther("9");

  console.log("removeLiquidity=",await router.removeLiquidity(
    husd.address,hbtc.address,liquidity,0,0,
    accounts[0].address,
    dealine)
  );


  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const pairContract = await UniswapV2Pair.attach(pair);
//   find reserve0 and reserve1
  console.log("getReserves="+await pairContract.getReserves());
  console.log("getPair="+await factory.getPair(husd.address,hbtc.address));

  console.log("getAmountsOut="+await router.getAmountsOut(amountTokenMin,[addrs.husd,addrs.wbnb]));

  //find pair liquidty totalSupply
  console.log("liquidity="+await pairContract.totalSupply());
  //find user liquidity
  console.log("liquidity="+await pairContract.balanceOf(accounts[0].address));


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
