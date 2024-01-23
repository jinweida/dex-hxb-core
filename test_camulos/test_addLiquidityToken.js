const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { ethers } = require("hardhat");

async function main() {

  const feeAdrr = hre.network.config.attachs.fee;
  console.log("fee to :",feeAdrr);

  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
 
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(addrs.husd);
  console.log("HUSD attached to:", husd.address);
  
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const usdt = await ERC20Template.attach(addrs.usdt);
  console.log("USDT attached to:", usdt.address);

  const hbtc = await ERC20Template.attach(addrs.hbtc);
  console.log("HBTC attached to:", hbtc.address);

  const heth = await ERC20Template.attach(addrs.heth);
  console.log("HETH attached to:", heth.address);

  const hltc = await ERC20Template.attach(addrs.hltc);
  console.log("HLTC attached to:", hltc.address);

  const hdot = await ERC20Template.attach(addrs.hdot);
  console.log("HDOT attached to:", hdot.address);

  const doge = await ERC20Template.attach(addrs.doge);
  console.log("DOGE attached to:", doge.address);

  const yfi = await ERC20Template.attach(addrs.yfi);
  console.log("YFI attached to:", yfi.address);

  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(addrs.ddx);
  console.log("DDX deployed to:", ddx.address);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(addrs.uniswap.factory);
  console.log("factory attached to:", factory.address);

  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(addrs.uniswap.router);
  console.log("router attached to:", router.address);


  var addLiquidity =async function(tokenA,tokenB,route,initAmountA,initAmountB){
    let approveTokenA=initAmountA;
    let approveTokenB=initAmountB;
    await tokenA.approve(route.address,approveTokenA);
    await tokenB.approve(route.address,approveTokenB);
    
    let dealine=0;//(await ethers.provider.getBlock('latest')).timestamp+60;
    dealine=(new Date()).getTime()+1000;
    let amountA=approveTokenA;
    let amountB=approveTokenB;

    // admin addLiquidity，init reserve
    let oneLiquid = await route.addLiquidity(
      tokenA.address,tokenB.address,
        amountA,amountB,0,0,
        accounts[0].address,
        dealine);
    console.log("amountA=",(amountA).toString(),",amountB=",amountB.toString(),",oneLiquid=",oneLiquid);
  }


  /******** start *******/
  // find pair address
  var addLiquiditySecond=async function(tokenA,tokenB,amount,direct){
    const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
    const pair=await factory.getPair(tokenA.address,tokenB.address);
    const pairContract = await UniswapV2Pair.attach(pair);
    console.log("pair=",pair);

    //find reserve0 and reserve1
    let reserves=await pairContract.getReserves();
    console.log("_reserve0=",reserves._reserve0.toString(),"_reserve1=",reserves._reserve1.toString());
    let token0=await pairContract.token0();
    let token1=await pairContract.token1();

    let amountIn,amountOut;//0=in 1=out
    if(direct==0){
      //input husd ,output hbtc
      amountIn=amount; 
      if(token0==tokenA.address){
        amountOut=await router.quote(amountIn.toString(),reserves._reserve0.toString(),reserves._reserve1.toString());
      }else{
        amountOut=await router.quote(amountIn.toString(),reserves._reserve1.toString(),reserves._reserve0.toString());
      }
      console.log("amounts.amountIn=",amountIn.toString(),"amounts.amountOut=",amountOut.toString());
      console.log("%s per %s price=%d",
        await tokenA.symbol(),await tokenB.symbol(),
        (amountIn/(10** await tokenA.decimals()))/(amountOut/(10** await tokenB.decimals()))
      );
    }else{
      //input hbtc,output husd
      amountOut=amount;
      if(token0==tokenB.address){
        amountIn=await router.quote(amountOut.toString(),reserves._reserve0.toString(),reserves._reserve1.toString());
      }else{
        amountIn=await router.quote(amountOut.toString(),reserves._reserve1.toString(),reserves._reserve0.toString());
      }
      console.log("amounts.amountA=",amountIn.toString(),"amounts.amountB=",amountOut.toString());
      console.log("%s per %s price=",
        await tokenA.symbol(),await tokenB.symbol(),
        (amountIn/(10** await tokenA.decimals()))/(amountOut/(10** await tokenB.decimals())));
    }

    const result=await addLiquidity(tokenA,tokenB,router,amountIn,amountOut);
    console.log("result",result)
  }
  let tokens=["0x15Ff10fCc8A1a50bFbE07847A22664801eA79E0f","0xAe9Ed85dE2670e3112590a2BB17b7283ddF44d9c",
    "0xD1760AA0FCD9e64bA4ea43399Ad789CFd63C7809","0x75b0B516B47A27b1819D21B26203Abf314d42CCE",
    "0x906B067e392e2c5f9E4f101f36C0b8CdA4885EBf","0xD94A92749C0bb33c4e4bA7980c6dAD0e3eFfb720",
    "0xDf951d2061b12922BFbF22cb17B17f3b39183570","0x73C68f1f41e4890D06Ba3e71b9E9DfA555f1fb46"
  ];
  let price=[
    {amountIn:"10",amountOut:"10"},
    {amountIn:"10",amountOut:"20"},
    {amountIn:"10",amountOut:"30"},
    {amountIn:"10",amountOut:"40"},
    {amountIn:"10",amountOut:"50"},
    {amountIn:"10",amountOut:"60"},
    {amountIn:"10",amountOut:"70"},
    {amountIn:"10",amountOut:"80"}
  ]

  //批量定价
  // for(let i=0;i<tokens.length;i++){
  //   let tokenIn=await ERC20Template.attach(tokens[i]);
  //   let tokenOut=usdt;
  //   await addLiquidity(
  //     tokenIn,tokenOut,router,
  //     ethers.utils.parseUnits(price[i].amountIn,await tokenIn.decimals()),
  //     ethers.utils.parseUnits(price[i].amountOut,await tokenOut.decimals())
  //   );
  // }



  // await addLiquidity(husd,hbtc,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("20",await hbtc.decimals()));

  // await addLiquidity(husd,usdt,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("30",await usdt.decimals()));

  // await addLiquidity(husd,heth,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("40",await heth.decimals()));

  // await addLiquidity(husd,hdot,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("50",await hdot.decimals()));

  // await addLiquidity(husd,doge,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("60",await doge.decimals()));

  // await addLiquidity(husd,yfi,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("70",await yfi.decimals()));

  // await addLiquiditySecond(husd,hbtc,ethers.utils.parseUnits("10000",await husd.decimals()),0);
  // await addLiquiditySecond(husd,hbtc,"11",0);
  // await addLiquiditySecond(husd,hbtc,"11",0);
  // await addLiquiditySecond(husd,hltc,"11",0);
  // await addLiquiditySecond(husd,heth,"11",0);
  // await addLiquiditySecond(husd,hdot,"11",0);
  // await addLiquiditySecond(husd,doge,"11",1);
  // await addLiquiditySecond(husd,doge,"11",1);
  // await addLiquiditySecond(husd,doge,"11",1);
  // await addLiquiditySecond(husd,yfi,"11",0);

  //批量缇娜家流动性
  // for(let i=0;i<tokens.length;i++){
  //   let tokenIn=await ERC20Template.attach(tokens[i]);
  //   let tokenOut=usdt;
  //   await addLiquiditySecond(tokenIn,tokenOut,ethers.utils.parseUnits(price[i].amountIn,await tokenIn.decimals()),0);
  // }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
