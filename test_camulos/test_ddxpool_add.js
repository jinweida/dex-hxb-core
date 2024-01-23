

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
  //DDXPool
  const DDXPool = await hre.ethers.getContractFactory("DDXPool");
  const ddxpool = await DDXPool.attach(attach.ddxpool);
  console.log("ddxpool attach to:", ddxpool.address);

  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  /** 准备 end */

  //（非前端功能）添加流动性代币，抵押流动性代币，抵押DDX

 
  //获取代币：流动性代币合约pair:husd/wbnb
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
    const addLp = await ddxpool.add(ethers.utils.parseUnits("10"), pair, true);
    //查询pid
    const pairId = await ddxpool.LpOfPid(pair);
    console.log("pairId:",pairId);
  }
  // //添加流动性代币（非前端）：DDXToken
  // const addDDx = await ddxpool.add(ethers.utils.parseUnits("10"), ddx.address, true);
  // console.log("addDDX:",addDDx);
  // const poolLength = await ddxpool.poolLength();
  // console.log("poolLength:",poolLength);
  // const poolInfo = await ddxpool.poolInfo(0);
  // console.log("poolInfo:",poolInfo);
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
