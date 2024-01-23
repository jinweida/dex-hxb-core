

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

   //BXHRouter
   const BXHRouter = await hre.ethers.getContractFactory("BXHRouter");
   const router = await BXHRouter.attach(attach.uniswap.router);
   console.log("router attach to:", router.address);
  //BXHPool
  const BXHPool = await hre.ethers.getContractFactory("BXHPool");
  const bxhpool = await BXHPool.attach(attach.bxhpool);
  console.log("bxhpool attach to:", bxhpool.address);
  //BXH
  const BXHToken = await hre.ethers.getContractFactory("BXHToken");
  const bxh = await BXHToken.attach(attach.bxh);
  console.log("bxh attach to:", bxh.address);
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  //HT
  const WHT = await hre.ethers.getContractFactory("WHT");
  const wht = await WHT.attach(attach.wht);
  console.log("wht attached to:", wht.address);
 
  //HBTC
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  /** 准备 end */

  //（非前端功能）添加流动性代币，抵押流动性代币，抵押BXH

 
  //获取代币：流动性代币合约pair:husd/wht
    //
  const pairLength = await factory.allPairsLength();
  console.log("pairLength:",pairLength);
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  console.log("router.factory:", await router.factory());
  for(let i = 0;i<pairLength;i++) {
    let pair = await factory.allPairs(i);
    console.log("pair:",pair);
    //添加流动性代币（非前端）
    // uint256 _allocPoint, 权重
    //  IERC20 _lpToken, 代币地址
    //  bool _withUpdate 是否更新
    const addLp = await bxhpool.add(10, pair, true);
    console.log("addLp:",addLp);
    //查询pid
    const pairId = await bxhpool.LpOfPid(pair);
    console.log("pairId:",pairId);
    const pairLp = await UniswapV2Pair.attach(pair);
    const token0 = await ERC20Template.attach(await pairLp.token0());
    const token1 = await ERC20Template.attach(await pairLp.token1());
    console.log(i,"token0/token1:",await token0.symbol(),"/",await token1.symbol());
  }
  // //添加流动性代币（非前端）：BXHToken
  const addDDx = await bxhpool.add(20, bxh.address, true);
  console.log("addBXH:",addDDx);
  const poolLength = await bxhpool.poolLength();
  console.log("poolLength:",poolLength);
  const poolInfo = await bxhpool.poolInfo(0);
  console.log("poolInfo:",poolInfo);
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
