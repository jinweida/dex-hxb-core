

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
  //SwapMining
  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  const swapmining = await SwapMining.attach(attach.swapmining);
  console.log("swapmining attach to:", swapmining.address);
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
 
  /** 准备 end */

  //（非前端功能）添加流动性代币，抵押流动性代币，抵押BXH

 
  //获取代币：流动性代币合约pair:husd/wht
    //
  const pairLength = await factory.allPairsLength();
  console.log("pairLength:",pairLength);
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  console.log("router.factory:", await router.factory());
  let poolLength = await swapmining.poolLength();
  console.log("poolLength:",poolLength);
  for(let i = 0;i<pairLength;i++) {
    let pairAddr = await factory.allPairs(i);
    console.log(i,"pair:",pairAddr);
    const pair = await UniswapV2Pair.attach(pairAddr);
    const token0 = await ERC20Template.attach(await pair.token0());
    const token1 = await ERC20Template.attach(await pair.token1());
    
    //添加流动性代币（非前端）
    // uint256 _allocPoint, 权重
    //  IERC20 _lpToken, 代币地址
    //  bool _withUpdate 是否更新
    await swapmining.addPair(10, pairAddr, true);

    console.log(i,"token0/token1:",await token0.symbol(),"/",await token1.symbol());

    let addWhitelist = await swapmining.addWhitelist(token0.address);
    console.log("addWhitelist token0:",addWhitelist)
    addWhitelist = await swapmining.addWhitelist(token1.address);
    console.log("addWhitelist token1:",addWhitelist)
    // // console.log("addLp:",addLp);
    // // //查询pid
    // const pairId = await swapmining.pairOfPid(pair);
    // console.log("pairId:",pairId);
  }
  // //添加流动性代币（非前端）：BXHToken
  poolLength = await swapmining.poolLength();
  console.log("poolLength:",poolLength);
  const poolInfo = await swapmining.poolInfo(0);
  console.log("poolInfo:",poolInfo);
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
