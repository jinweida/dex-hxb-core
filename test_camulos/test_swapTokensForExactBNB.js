

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
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);

  /** 准备 end */

  //选择币种BNB,HUSD：查询BNB余额,查询HUSD余额
  const bnbbalance = await ethers.provider.getBalance(accounts[0].address)
  const husdbalance = await husd.balanceOf(accounts[0].address);
  console.log("HUSD.balance=:",husdbalance);
  console.log("BNB balance :", bnbbalance);
  //输入BNB到账数量
  let amountOutExactWBNB = ethers.utils.parseUnits("1");

  //计算HUSD扣除量：getAmountsIn(amountOut,[in地址,out地址])
   let amountWInOut = await router.getAmountsIn(amountOutExactWBNB, [husd.address,wbnb.address]);
   amountInHusd = amountWInOut[0];
  //  amountOutExactWBNB = amountWInOut[1];//可不赋值
   //展示价格
   const bnb_price = amountInHusd.mul(await wbnb.decimals()).div(amountOutExactWBNB).div(await husd.decimals());
   console.log("bnb_price =",bnb_price);
   //滑点1%：扣除数量最多1+1%
   amountInHusd = amountInHusd.mul(101).div(100);;
   console.log("router getAmountsIn =",amountWInOut);
   assert(husdbalance.gt(amountInHusd),"husd余额不足")
   
   assert(amountInHusd.lt(amountWInOut[0]),"EXCESSIVE_INPUT_AMOUNT")
   //Husd授权router : Approve
  await husd.approve(router.address,amountInHusd);
  const allowu = await husd.allowance(accounts[0].address,router.address);
  console.log("husd allowu is:", allowu);
  assert(allowu.eq(amountInHusd),"husd授权router限额不足")
  

  //兑换
  // uint amountOut, 
  // uint amountInMax, 
  // address[] calldata path, 
  // address to, 
  // uint deadline
  const swap = await router.swapTokensForExactBNB(amountOutExactWBNB,amountInHusd,[husd.address,wbnb.address],accounts[0].address,1629969715533);
  console.log("router swapExactBNBForTokens swap=",swap);


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
