

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
  const busd = await ERC20Template.attach(attach.busd);
  console.log("busd attached to:", busd.address);

  // const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  // const ddx = await DDXToken.attach(attach.ddx);
  // console.log("DDX deployed to:", ddx.address);
  //HUSD
  // const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  // const husd = await HUSD.attach(attach.husd);
  // console.log("HUSD attached to:", husd.address);

  const usdt = await ERC20Template.attach(attach.usdt);
  console.log("USDT attached to:", usdt.address);

  /** 准备 end */  
  var swapExactTokensForTokens=async function(token0,token1,amountIn,account){
    let tokenIn=token0,tokenOut=token1;
    let tokenInName=await token0.symbol(),tokenOutName=await token1.symbol();
    console.log("tokenInName=%s,tokenOutName=%s",tokenInName,tokenOutName)
    
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
    const swap = await router.swapExactTokensForTokens(amountIn,amountOutToken,[tokenIn.address,tokenOut.address],account,1629969715533);
  }

  await swapExactTokensForTokens(usdt,busd,ethers.utils.parseUnits("100",await usdt.decimals()),accounts[0].address);
  // await swapExactTokensForTokens(husd,ddx,ethers.utils.parseUnits("10",await husd.decimals()),accounts[0].address);

}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
