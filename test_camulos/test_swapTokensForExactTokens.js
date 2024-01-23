

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");
async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);

  //DDXRouter
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(attach.uniswap.router);
  console.log("router attach to:", router.address);
  //Oracle
  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.attach(attach.oracle);
  console.log("oracle attach to:", oracle.address);

  //HBTC
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const hbtc = await ERC20Template.attach(attach.hbtc);
  console.log("attached to:", hbtc.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  /** 准备 end */

  //选择币种HBTC,HUSD：查询HBTC余额,查询HUSD余额
  const HBTCbalance = await ethers.provider.getBalance(accounts[0].address)
  const husdbalance = await husd.balanceOf(accounts[0].address);
  console.log("HUSD.balance=:",husdbalance);
  console.log("HBTC balance :", HBTCbalance);
  
  //输入HBTC到账数量
  let amountOuthbtc = ethers.utils.parseUnits("1");

  let pair=await factory.pairFor(hbtc.address,husd.address);
  console.log("pair",pair)

  //计算HUSD扣除量: getAmountsIn(pair,amountOut,[in地址,out地址])
   amountWInOut = await factory.getAmountsIn(pair,amountOuthbtc, [husd.address,hbtc.address]);
   amountInHusd = amountWInOut[0];//可不赋值
   amountOuthbtc = amountWInOut[1];
   //展示价格
   // oracle.consult(husd.address,ethers.utils.parseUnits("1"),hbtc.address);
   const hbtc_price = amountOuthbtc.mul(await husd.decimals()).div(amountInHusd).div(await hbtc.decimals());
   console.log("router hbtc_price =",hbtc_price);
   //滑点1%：扣除数量最多1+1%
   amountInHusd = amountInHusd.mul(101).div(100);;
   console.log("router getAmountsIn =",amountWInOut);
   assert(husdbalance.gt(amountOuthbtc),"husd余额不足")
   //Husd授权router : Approve
  await husd.approve(router.address,amountInHusd);
  const allowu = await husd.allowance(accounts[0].address,router.address);
  console.log("husd allowu is:", allowu);
  assert(allowu.eq(amountInHusd),"husd授权router限额不足")
  

  var swapExactTokensForTokens=async function(token0,token1,amountIn,account){
    let tokenOut=token0,tokenIn=token1;
    let tokenOutName=await token0.symbol(),tokenInName=await token1.symbol();
    console.log("tokenOutName=%s,tokenInName=%s",tokenOutName,tokenInName)
    
    const tokenInBalance = await tokenIn.balanceOf(account);
    const tokenOutBalance = await tokenOut.balanceOf(account);
    console.log("%s.balance=%d",tokenInName,ethers.utils.formatUnits(tokenInBalance,"wei"));
    console.log("%s.balance=%d",tokenOutName,ethers.utils.formatUnits(tokenOutBalance,"wei"));

    const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
    const pair = await UniswapV2Pair.attach(await factory.getPair(token0.address,token1.address));
    console.log("pair=",pair.address);

    //计算到账数量：getAmountsOut(amountIn,[in地址,out地址])
    let amountWInOut = await factory.getAmountsOut(pair.address,amountIn, [tokenIn.address,tokenOut.address]);
    let amountInToken = amountWInOut[0];//可不赋值
    let amountOutToken = amountWInOut[1];
    let tokenInDecimals=await tokenIn.decimals(),tokenOutDecimals=await tokenOut.decimals();

    let tokenInNum=ethers.BigNumber.from(amountInToken.toString()).div((10 **tokenInDecimals).toString());
    let tokenOutNum=ethers.BigNumber.from(amountOutToken.toString()).div((10 **tokenOutDecimals).toString());
    console.log("amountInToken=%d,amountOutToken=%d",tokenInNum,tokenOutNum)
    //展示价格
    console.log("%s per %s price=%d",tokenInName,tokenOutName,(tokenInNum/tokenOutNum).toString());
    //滑点1%：到账数量最少1-1%
    amountOutToken = amountOutToken.mul(99).div(100);;
    console.log("router getAmountsOut =",amountWInOut[0].toString(),amountWInOut[1].toString());
    //Hbtc授权router : Approve
    await tokenIn.approve(router.address,amountIn);
    const allow = await tokenIn.allowance(account,router.address);
    console.log("%s allowu is:%d", tokenInName,allow.toString());
    console.log("amountOutToken",amountOutToken.toString())
    // 兑换
    //   uint amountIn,
    //   uint amountOutMin,
    //   address[] calldata path,
    //   address to,
    //   uint deadline
    const swap = await router.swapExactTokensForTokens(amountIn,amountOutToken,[tokenIn.address,tokenOut.address],account,1629969715533);
  }
  //兑换
  // uint amountOut,
    // uint amountInMax,
    // address[] calldata path,
    // address to,
    // uint deadline
  const swap = await router.swapTokensForExactTokens(amountOuthbtc,amountInHusd,[husd.address,hbtc.address],accounts[0].address,1629969715533);
  console.log("router swapTokensForExactTokens swap=",swap);


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
