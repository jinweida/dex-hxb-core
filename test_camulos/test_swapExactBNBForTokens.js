

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  //DDXRouter
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(attach.uniswap.router);
  console.log("router attach to:", router.address);
  //BNB
  const WBNB = await hre.ethers.getContractFactory("WBNB");
  const wbnb = await WBNB.attach(attach.wbnb);
  console.log("wbnb attached to:", wbnb.address);
  //hbtc
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const hbtc = await ERC20Template.attach(attach.hbtc);
  console.log("attached to:", hbtc.address);

    //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  /** 准备 end */

  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  let pair = await UniswapV2Pair.attach("0x92cc9147246119e9ff1c30a26e3be829d014751f");
  //查询池子币对量
  const reserves = await pair.getReserves();
  console.log("reserves",reserves[0].toString(),reserves[1].toString())
  //选择币种BNB,HUSD：查询BNB余额,查询HUSD余额
  const bnbbalance = await ethers.provider.getBalance(accounts[0].address)
  const husdbalance = await husd.balanceOf(accounts[0].address);
  console.log("husd.balance=:",husdbalance.toString());
  console.log("BNB balance :", bnbbalance.toString());
  //输入BNB扣除数量
  let amountInExactWBNB = ethers.utils.parseUnits("100");
  assert(bnbbalance.gt(amountInExactWBNB),"BNB余额不足")
  //计算HUSD到账量:getAmountsOut(amountIn,[in地址,out地址])
   let amountWInOut = await router.getAmountsOut(amountInExactWBNB, [wbnb.address,husd.address]);
   amountInExactWBNB = amountWInOut[0];//可不赋值
   amountOutHhusd = amountWInOut[1];
   //展示价格
   const husd_price = amountInExactWBNB.mul(await husd.decimals()).div(amountOutHhusd).div(await wbnb.decimals());
   console.log("husd_price =",husd_price);
   //滑点1%：到账数量至少99%
   amountOutHhusd = amountOutHhusd.mul(999).div(1000);
   console.log("router getAmountsOut =",amountWInOut[0].toString(),amountWInOut[1].toString());
  
  console.log("amountOutHhusd",amountOutHhusd.toString())
  //兑换
  // uint amountOut, 
  // address[] calldata path, 
  // address to, 
  // uint deadline
  // const swap = await router.swapExactBNBForTokens(amountOutHbtc,[wbnb.address,hbtc.address],accounts[0].address,1629969715533,{value:amountInExactWBNB});
  // console.log("router swapExactBNBForTokens swap=",swap);


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
