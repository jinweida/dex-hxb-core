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

  const wbnb = await ERC20Template.attach(addrs.wbnb);
  console.log("WBNB attached to:", wbnb.address);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(addrs.uniswap.factory);
  console.log("factory attached to:", factory.address);

  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(addrs.uniswap.router);
  console.log("router attached to:", router.address);

  var addLiquidity =async function(tokenA,route,initAmountA,initAmountB){
    let approveTokenA=initAmountA;
    await tokenA.approve(route.address,approveTokenA);
    
    let dealine=0;//(await ethers.provider.getBlock('latest')).timestamp+60;
    dealine=(new Date()).getTime()+1000;
    let amountA=approveTokenA,amountB=initAmountB;
    

    // admin addLiquidity，init reserve
    let oneLiquid = await router.addLiquidityBNB(
      tokenA.address,
        amountA,0,0,
        accounts[0].address,
        dealine,{value:amountB}
      );
    console.log("amountA=",(amountA).toString(),",amountB=",amountB.toString(),",oneLiquid=",oneLiquid.liquidity);
  }
  // await addLiquidity(husd,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("100",await wbnb.decimals())
  // );
  // await addLiquidity(usdt,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("200",await wbnb.decimals())
  // );
  // await addLiquidity(hdot,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("300",await wbnb.decimals())
  // );
  // await addLiquidity(heth,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("400",await wbnb.decimals())
  // );
  // await addLiquidity(doge,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("500",await wbnb.decimals())
  // );
  // await addLiquidity(yfi,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("600",await wbnb.decimals())
  // );
  // await addLiquidity(hbtc,router,
  //   ethers.utils.parseUnits("10",await husd.decimals()),
  //   ethers.utils.parseUnits("700",await wbnb.decimals())
  // );

  /******** start *******/
  // // find pair address
  var addLiquiditySecond=async function(tokenA,amount,direct){

    const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
    const pair=await router.getBNBPair(tokenA.address);
    const pairContract = await UniswapV2Pair.attach(pair);
    console.log("pair=",pair);

    // // //find reserve0 and reserve1
    let reserves=await router.getBNBReservers(tokenA.address);
    console.log("reserveA=",reserves.reserveA.toString(),"reserveB=",reserves.reserveB.toString());
    let token0=await pairContract.token0();
    let token1=await pairContract.token1();

    let amountIn,amountOut;//0=in 1=out
    if(direct==0){
      amountIn=amount; 
      if(token0==tokenA.address){
        amountOut=await router.quote(amountIn.toString(),reserves.reserveA.toString(),reserves.reserveB.toString());
      }else{
        console.log(amountIn.toString(),reserves.reserveB.toString(),reserves.reserveA.toString())
        amountOut=await router.quote(amountIn.toString(),reserves.reserveB.toString(),reserves.reserveA.toString());
      }
      console.log(amountOut)
      console.log("amounts.amountIn=",amountIn.toString(),"amounts.amountOut=",amountOut.toString());
      console.log("%s per WBNB price=",await tokenA.symbol(),(amountIn/(10** await tokenA.decimals()))/(amountOut/(10** await wbnb.decimals())));
    }else{
      //input hbtc,output husd
      amountOut=amount;
      if(token0==wbnb.address){
        amountIn=await router.quote(amountOut.toString(),reserves.reserveA.toString(),reserves.reserveB.toString());
      }else{
        amountIn=await router.quote(amountOut.toString(),reserves.reserveB.toString(),reserves.reserveA.toString());
      }
      console.log("amounts.amountA=",amountIn.toString(),"amounts.amountB=",amountOut.toString());
      console.log("%s per WBNB price=%d",await tokenA.symbol(),(amountIn/(10** await husd.decimals()))/(amountOut/(10** await wbnb.decimals())));

    }
    await addLiquidity(tokenA,router,amountIn,amountOut);
  }


  await addLiquiditySecond(yfi,ethers.utils.parseUnits("10"),0);
  await addLiquiditySecond(hbtc,ethers.utils.parseUnits("10"),0);
  await addLiquiditySecond(usdt,ethers.utils.parseUnits("10"),0);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
  