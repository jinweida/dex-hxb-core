const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

const accounts = await ethers.getSigners();
 // for (const account of accounts) {
 //     // const balance = await ethers.provider.getBalance(account.address);

 //    // console.log(account.address+",balance="+balance);
 //  }
  
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

  const eth = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg ETH Token","ETH",18);
  await eth.deployed();
  console.log("HETH deployed to:", eth.address);

  const hltc = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg HLTC Token","HLTC",18);
  await hltc.deployed();
  console.log("HLTC deployed to:", hltc.address);

  const hdot = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg HDOT Token","HDOT",18);
  await hdot.deployed();
  console.log("HDOT deployed to:", hdot.address);

  const doge = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg DOGE Token","DOGE",18);
  await doge.deployed();
  console.log("DOGE deployed to:", doge.address);

  const yfi = await ERC20Template.deploy(accounts[0].address,accounts[0].address,"Heco-Peg YFI Token","YFI",18);
  await yfi.deployed();
  console.log("YFI deployed to:", yfi.address);


  const WBNB = await hre.ethers.getContractFactory("WBNB");
  const wbnb = await WBNB.deploy();
  await wbnb.deployed();
  console.log("WBNB deployed to:", wbnb.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
