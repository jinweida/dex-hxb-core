

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
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  /** 准备 end */
  console.log("factory pairCodeHash",await factory.pairCodeHash())
  // console.log("factory.getPair",await factory.getPair(attach.hbtc,attach.husd));

  //根据后端返回的币对列表(当前用合约实现遍历pair)
  const pairLength = await factory.allPairsLength();
  console.log("pairLength:",pairLength.toString());
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");

  for(let i = 0;i<pairLength;i++) {
    let pair = await factory.allPairs(i);
    console.log("====pair:",pair,"====================================");
    pair = await UniswapV2Pair.attach(pair);
    
    //查询币种名称：
    const token0 = await pair.token0();
    const token1 = await pair.token1();
    //缓存获取币种名称：
    const token0Name = await ERC20Template.attach(token0);
    const token1Name = await ERC20Template.attach(token1);
    console.log("token0:",token0,"token1:",token1);
    console.log("token0Name:",await token0Name.symbol(),"token1Name:",await token1Name.symbol());

    //查询用户流动性余额
    const lp_balance = await pair.balanceOf(accounts[0].address);
    console.log("accounts[0] upper.balance=",(await pair.balanceOf(accounts[1].address)).toString())
    console.log("accounts[1] upper.balance=",(await pair.balanceOf(accounts[2].address)).toString())
    console.log("feeto.balance=",(await pair.balanceOf(attach.fee)).toString())
    //查询流动性总额
    const lp_totalsupply = await pair.totalSupply();

    //计算流动性占比
    const lp_percent = lp_balance/lp_totalsupply;
    console.log("lp_balance:",lp_balance.toString(),"lp_totalsupply:",lp_totalsupply.toString(),"lp_percent:",lp_percent);

    console.log("factory.lp",(await pair.balanceOf(factory.address)).toString());

    //查询池子币对量
    const reserves = await pair.getReserves();
    //锚定token0的量：reserves[0]*lp_percent
    const token0Amount = reserves[0].mul(lp_balance).div(lp_totalsupply);
    //锚定token0的量：reserves[1]*lp_percent
    const token1Amount = reserves[1].mul(lp_balance).div(lp_totalsupply);
    console.log("reserves:",reserves[0].toString(),reserves[1].toString(),"token0 amount:",token0Amount.toString(),"token1 amount:",token1Amount.toString());

  }


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
