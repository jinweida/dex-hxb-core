

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
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  //BNB
  const WBNB = await hre.ethers.getContractFactory("WBNB");
  const wbnb = await WBNB.attach(attach.wbnb);
  console.log("wbnb attached to:", wbnb.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  //HBTC
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const hbtc = await ERC20Template.attach(attach.hbtc);
  console.log("hbtc attach to:", hbtc.address);
  //HETH
  const heth = await ERC20Template.attach(attach.heth);
  console.log("heth attach to:", heth.address);
  //HLTC
  const hltc = await ERC20Template.attach(attach.hltc);
  console.log("hltc attach to:", hltc.address);
  //HDOT
  const hdot = await ERC20Template.attach(attach.hdot);
  console.log("hdot attach to:", hdot.address);
  /** 准备 end */


  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  console.log("router.factory:", await router.factory());
  //第一次初始化缓存 start
  //根据后端返回的币对列表(当前用合约实现遍历pair)
  const pairLength = await factory.allPairsLength();
  console.log("pairLength:",pairLength);
  let userPairs = new Set();
  var poolPairId = [];
  //遍历添加到h缓存userPairs
  for(let i = 0;i<pairLength;i++) {
    let pair = await factory.allPairs(i);
    console.log("pair:",pair);
    pair = await UniswapV2Pair.attach(pair);
    //查询余额大于0的添加到缓存userPairs中
    const balance = await pair.balanceOf(accounts[0].address);
    console.log(" pair balance:",balance);
    if(balance.gt("0")) {
      userPairs.add(pair.address);
    }
  }
  
  //  根据ddxpool合约遍历poolInfo添加到h缓存userPairs
  const poolLength = await ddxpool.poolLength();
  console.log("poolLength=",poolLength)
  for(let i = 0;i<poolLength;i++) {
    let pid=i;
    let poolInfo = await ddxpool.poolInfo(pid);
    console.log(pid," poolInfo",poolInfo.toString());
    const pair = await UniswapV2Pair.attach(poolInfo.lpToken);
    //设置pair的id到缓存（。。。。。。。。）

    //查询是否存在
    let userInfo = await ddxpool.userInfo(pid, accounts[0].address);
    console.log("userInfo:",userInfo.toString());
    //查询是否已抵押
    if(userInfo.amount.gt("0")) {
      userPairs.add(pair.address);
    }
  }
  //第一次初始化缓存 end
  
  //pid由缓存获取
  pid = 0;
  let poolInfo = await ddxpool.poolInfo(pid);
  console.log(pid," poolInfo",poolInfo.toString());
  //pair由缓存获取
  const pair = await UniswapV2Pair.attach(poolInfo.lpToken);
  
  //查询未领取挖矿收益
  let pending = await ddxpool.pending(pid, accounts[0].address);
  pending = pending[0];
  console.log("pending:",pending);
  if(pending.gt("0")) {
    //提取收益
    let withdraw = await ddxpool.withdraw(pid, 0);
    console.log("withdraw reward:",withdraw);
  }

  //查询我的仓位
  let balanceLp = await pair.balanceOf(accounts[0].address);
  //查询我的占比
  let totalLp = await pair.totalSupply();
  console.log("percent:",balanceLp/totalLp);

  //查询已质押
  let userInfo = await ddxpool.userInfo(pid, accounts[0].address);
  console.log("userInfo.amount:",userInfo.amount.toString());
  
  // //取回流动性资金
  // const amountWithdraw = userInfo.amount/2;
  // console.log("amountWithdraw:",amountWithdraw.toString());
  // withdraw = await ddxpool.withdraw(pid, amountWithdraw.toString());
  // console.log("withdraw lp:",withdraw);
  
  // //-流动性资金 参考test_removeLiquity.js
  
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
