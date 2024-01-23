const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");

var Assert = require('assert');
const { assert } = require("console");
const { ContractFactory } = require("@ethersproject/contracts");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");


async function main() {

  
 

  // let token0 = [hbtc,eth,hltc,hdot,shib,yfi,doge,bxh];
  
      await addLiquidity();
    
    
    

}

var addLiquidity = async function(){
  const accounts = await ethers.getSigners();
  const attachs = hre.network.config.attachs;

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  // const factory = await UniswapV2Factory.deploy(feeAdrr);
  // await factory.deployed();
  const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
  console.log("factory attach to:", factory.address);

  //BXHRouter
  const BXHRouter = await hre.ethers.getContractFactory("BXHRouter");
  const router = await BXHRouter.attach(attachs.uniswap.router);
  console.log("router attach to:", router.address);

 
  const BXH = await hre.ethers.getContractFactory("BXHToken");
  const bxh = await BXH.attach(attachs.bxh);
  console.log("BXH attach to:", bxh.address);
  tokens = [
    "0x2aA12f98795E7A65072950AfbA9d1E023D398241",
    "0x81f4f47aa3bBd154171C877b4d70F6C9EeCAb216",
    "0x2ce1F0e20C1f69E9d9AEA83b25F0cEB69e2AA2b5",
    "0xE5b6F5e695BA6E4aeD92B68c4CC8Df1160D69A81",
    "0x01c93598EeC9131C05a2450Cd033cbd8F82da31e",];
  symbols =  ["HBTC","BCH",
              "HETH",
              "HLTC",
              "HDOT"];
  usdAddr = ["0x6c383Ef7C9Bf496b5c847530eb9c49a3ED6E4C56",
  "0xAAF0F531b7947e8492f21862471d61d5305f7538",]
  usds = ["USDT","HUSD"];
  let price = [38000,1800,2800,1000,1];
 
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  for(j = 0;j<usdAddr.length;j++) {
    for(i = 0;i<tokens.length;i++) {
      let tokenA = await ERC20Template.attach(usdAddr[j]);
      let tokenB = await ERC20Template.attach(tokens[i]);
      console.log("tokenA:",tokenA.address);
      console.log("tokenB:",tokenB.address);

      let amount = "1000000";
      let amountA = ethers.utils.parseUnits(amount,await tokenA.decimals());

      let amountB = amount/price[i];
      console.log("amountB ",amountB)
      let amountWHT = ethers.utils.parseUnits(amountB+"",await tokenB.decimals());
      let balance = await tokenA.balanceOf(accounts[0].address);
      console.log("tokenA.balance=:",balance);
      if(balance.lt(amountA)) {
        if((await tokenA.symbol())=="HUSD"){
          const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
          tokenA = await HUSD.attach(usdAddr[j])
          console.log("tokenA.issue=:",await tokenA.issue(accounts[0].address,ethers.utils.parseUnits("99999999999999999",await tokenA.decimals())));
        
        } else {
          console.log("tokenA.mint=:",await tokenA.mint(accounts[0].address,ethers.utils.parseUnits("99999999999999999",await tokenA.decimals())));
        
        }
        console.log("tokenA approve is:",await tokenA.approve(router.address,ethers.utils.parseUnits("99999999999999999",await tokenA.decimals())));
        
      }
      while (balance.lt(amountA)) {
        balance = await tokenA.balanceOf(accounts[0].address);
        console.log("tokenA.balance=:",balance);
      }
      assert(balance.gte(amountA),"tokenA balance is insufficient for ",amountA)

      //设置amountWHT
        //查询pair是否存在
      let getPair = await factory.getPair(tokenA.address,tokenB.address);
      const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
      let pair = await UniswapV2Pair.attach(getPair);
      console.log("getPair :", getPair);
      if(parseInt(getPair,16) != 0) {
        const token0 = await pair.token0();
        let getReserve = await pair.getReserves();
        let reserveHusd =  getReserve[0]
        let reserveWHT =  getReserve[1]
        console.log("router getReserves (tokenA,tokenB)=",getReserve);
        if(getReserve[0]>0) {
          if(token0 != tokenA.address) {
            reserveHusd =  getReserve[1]
            reserveWHT =  getReserve[0]
          }
          if(getReserve[0].eq(0)) {
            amountWHT = amountA;
          }
          amountWHT = await router.quote(amountA, reserveHusd,  reserveWHT);
        }
        
      }
      console.log("router quote amountWHT =",amountWHT);
      let htbalance = await tokenB.balanceOf(accounts[0].address);
      console.log("tokenB.balance=:",htbalance);
      if(htbalance.lt(amountWHT)) {
        console.log("tokenB.mint=:",await tokenB.mint(accounts[0].address,amountWHT));
        console.log("tokenB approve is:",await tokenB.approve(router.address,ethers.utils.parseUnits("99999999999999999",await tokenA.decimals())));

      }
      while (htbalance.lt(amountWHT)) {
        htbalance = await tokenB.balanceOf(accounts[0].address);
        console.log("tokenB.balance=:",htbalance);
      }
      assert(htbalance.gte(amountWHT),"tokenB balance is insufficient for ",amountWHT)

      //Husd授权router : Approve
      let allowu = await tokenA.allowance(accounts[0].address,router.address);
      console.log("tokenA allowu is:", allowu);
      while (allowu.lt(amountA)) {
        allowu = await tokenA.allowance(accounts[0].address,router.address);
        console.log("tokenA allowu is:", allowu);
      }

      let allowuHT = await tokenB.allowance(accounts[0].address,router.address);
      console.log("tokenB allowu is:", allowuHT);
      while (allowuHT.lt(amountWHT)) {
        allowuHT = await tokenB.allowance(accounts[0].address,router.address);
        console.log("tokenB allowu is:", allowuHT);
      }

      //添加流动性：addLiquidityHT
      const liquid = await router.addLiquidity(tokenA.address,tokenB.address,amountA,amountWHT,0,0,accounts[0].address,1629969715533);
      console.log("router addLiquidity liquid=",i,liquid);
    }
  }
  //查询币对池金额：getReserves
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });