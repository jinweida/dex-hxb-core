

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
  
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  
  tokens = ["0x6c383Ef7C9Bf496b5c847530eb9c49a3ED6E4C56",
  "0xAAF0F531b7947e8492f21862471d61d5305f7538",
  "0x2aA12f98795E7A65072950AfbA9d1E023D398241",
  "0x81f4f47aa3bBd154171C877b4d70F6C9EeCAb216",
  "0x2ce1F0e20C1f69E9d9AEA83b25F0cEB69e2AA2b5",
  "0xE5b6F5e695BA6E4aeD92B68c4CC8Df1160D69A81",
  "0x01c93598EeC9131C05a2450Cd033cbd8F82da31e",]
  
  /** 准备 end */
  for(let i = 0;i<tokens.length;i++) {
    // //添加流动性代币（非前端）：BXHToken
    const addDDx = await bxhpool.add(10, tokens[i], true);
    console.log("addBXH:",addDDx);
  }
  
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
