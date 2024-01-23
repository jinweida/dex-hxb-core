const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

const accounts = await ethers.getSigners();
  const attachs = hre.network.config.attachs;
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const BXHRouter = await hre.ethers.getContractFactory("BXHRouter");
  const router = await BXHRouter.attach(attachs.uniswap.router);
  console.log("router attach to:", router.address);

  let addrs = [
    // "0xe7a7fa605aa6e3c74604c9c6dde86e72e23477e4",
    // "0xAE91d4163eB72AC55965436a30Acad26D3a0A68c",
    // "0xf0830E1a28Df63F8f688EF45d7C00E2E7B0fE37c",
    // "0x3A33D60eb3b58b8C79fC3D9Fa1650C6406eA01DD",
    // "0x36951ba817Fea7373df6BbaA89499C60A3E5FEf3",
    // "0xC18f3F15aa3c72A3592D281941d6dAaCF4769bE6",
    // "0x75F9970fcaaA78CdCa50e203B64a725BfADC0991"
    // "0xAE91d4163eB72AC55965436a30Acad26D3a0A68c"
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  ];
  let tokenAmount = "2000000";
  // usdt:"0x6c383Ef7C9Bf496b5c847530eb9c49a3ED6E4C56",
  //       husd:"0xAAF0F531b7947e8492f21862471d61d5305f7538",
  //       hbtc:"0x2aA12f98795E7A65072950AfbA9d1E023D398241",
  //       bch:"0x81f4f47aa3bBd154171C877b4d70F6C9EeCAb216",
  //       heth:"0x2ce1F0e20C1f69E9d9AEA83b25F0cEB69e2AA2b5",
  //       hltc:"0xE5b6F5e695BA6E4aeD92B68c4CC8Df1160D69A81",
  //       wht :"0x9bE634797af98cB560DB23260b5f7C6e98AcCAcf",
  //       hdot:"0x01c93598EeC9131C05a2450Cd033cbd8F82da31e",
  tokens = [
    "0xAAF0F531b7947e8492f21862471d61d5305f7538",
  "0x2aA12f98795E7A65072950AfbA9d1E023D398241",
  "0x81f4f47aa3bBd154171C877b4d70F6C9EeCAb216",
  "0x2ce1F0e20C1f69E9d9AEA83b25F0cEB69e2AA2b5",
  "0xE5b6F5e695BA6E4aeD92B68c4CC8Df1160D69A81",
  "0x01c93598EeC9131C05a2450Cd033cbd8F82da31e"];
  
  for(i = 0;i<addrs.length;i++) {
    for(j = 0;j<tokens.length;j++) {
      let tokenA = await ERC20Template.attach(tokens[j]);
      symbol = await tokenA.symbol();
      if(symbol=="HUSD" ||symbol=="USDT" ) {
        console.log(symbol," mint ....");
        if(symbol=="HUSD"){
          const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
          tokenA = await HUSD.attach(tokens[j])
          await tokenA.issue(addrs[i],ethers.utils.parseUnits("9999999999999999",await tokenA.decimals()));
        } else {
          await tokenA.mint(addrs[i],ethers.utils.parseUnits("9999999999999999",await tokenA.decimals()));
        }
        
      } else{
        console.log(await tokenA.symbol()," mint ....");
        await tokenA.mint(addrs[i],ethers.utils.parseUnits(tokenAmount,await tokenA.decimals()));
        
      }
      console.log("tokenA approve is:",await tokenA.approve(router.address,ethers.utils.parseUnits("9999999999999999",await tokenA.decimals())));
     
      
      
    }

    // await accounts.sendTransaction({to:addrs[i],value:ethers.utils.parseUnits("200000")});
    // console.log("send eth .....");
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });