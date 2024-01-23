const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

const accounts = await ethers.getSigners();
 for (const account of accounts) {
     const balance = await ethers.provider.getBalance(account.address);
     console.log(account.address+",balance="+balance);
  }

  const feeAdrr = hre.network.config.attachs.fee;
  console.log("fee to :",feeAdrr);
  /** usdt:"0x41dBB528b5662caD3b8183754C0517b409E00Fa8",
      husd:"0x60aC4593ecea0B22216218c4D0f27533ebB01CB6",
      hbtc:"0xa0945a7aC164287B4e6B8f234337820807074a29",
      heth:"0x9771321265cAD7049903EaF4a574Eab51fD97378",
      hltc:"0x8E02433C31B51ABe3Ac65908d59eF82ddB52714F",
      wht :"0x7f3fF452D3da0EAD3ce227eB4A6c84E896685C3C",
      hdot:"0x426dcD4fa088D7b33797Da0002bF36a669B398D5",
      */
      const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
      const usdt = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg USDT Token","USDT",18);
      await usdt.deployed();
      console.log("USDT deployed to:", usdt.address);
    
      const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
    
      const husd = await HUSD.deploy("Heco-Peg HUSD Token","HUSD",8);
    
      await husd.deployed();
      console.log("HUSD deployed to:", husd.address);
    
    
      const hbtc = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg HBTC Token","HBTC",18);
      await hbtc.deployed();
      console.log("HBTC deployed to:", hbtc.address);

      
      const bch = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg BCH Token","BCH",18);
      await bch.deployed();
      console.log("BCH deployed to:", bch.address);
    
      const eth = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg ETH Token","ETH",18);
      await eth.deployed();
      console.log("HETH deployed to:", eth.address);
    
      const hltc = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg HLTC Token","HLTC",18);
      await hltc.deployed();
      console.log("HLTC deployed to:", hltc.address);
    
      const WHT = await hre.ethers.getContractFactory("WHT");
      const wht = await WHT.deploy();
      await wht.deployed();
      console.log("WHT deployed to:", wht.address);
    
      const hdot = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg HDOT Token","HDOT",18);
      await hdot.deployed();
      console.log("HDOT deployed to:", hdot.address);

      const BXH = await hre.ethers.getContractFactory("BXHToken");
      const bxh = await BXH.deploy();
      await bxh.deployed();
      console.log("BXH deployed to:", bxh.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });