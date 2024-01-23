

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { ethers } = require("hardhat");

async function main() {

  const feeAdrr = hre.network.config.attachs.fee;
  console.log("fee to :",feeAdrr);

  const addrs =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
  let amount=ethers.utils.parseEther('2300000'); 
  // const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  // const husd = await HUSD.attach(addrs.husd);
  // console.log("HUSD attached to:", husd.address);  
  
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");

  const busd = await ERC20Template.attach(addrs.busd);
  console.log("busd attached to:", busd.address);

  const usdt = await ERC20Template.attach(addrs.usdt);
  console.log("USDT attached to:", usdt.address);

  // const heth = await ERC20Template.attach(addrs.heth);
  // console.log("HETH attached to:", heth.address);

  // const hltc = await ERC20Template.attach(addrs.hltc);
  // console.log("HLTC attached to:", hltc.address);

  // const hdot = await ERC20Template.attach(addrs.hdot);
  // console.log("HDOT attached to:", hdot.address);

  // const bch = await ERC20Template.attach(addrs.bch);
  // console.log("BCH attached to:", bch.address);




  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(addrs.ddx);
  console.log("DDX deployed to:", ddx.address);

  await ddx.addMinter(accounts[0].address);
  // console.log(await ddx.isMinter(accounts[0].address))

  //增发
  let useraddrs=["0x3A33D60eb3b58b8C79fC3D9Fa1650C6406eA01DD"];
  for(let i=0;i<useraddrs.length;i++){
    let item=useraddrs[i];
    // await husd.issue(item,amount);
    // console.log("HUSD.balance=:",ethers.utils.formatUnits(await husd.balanceOf(item),"wei"));

    await busd.mint(item,amount);
    console.log("busd.balance=:",ethers.utils.formatUnits(await busd.balanceOf(item),"wei"));

    await usdt.mint(item,amount);
    console.log("USDT.balance=:",ethers.utils.formatUnits(await usdt.balanceOf(item),"wei"));

    // await heth.mint(item,amount);
    // console.log("HETH.balance=:",ethers.utils.formatUnits(await heth.balanceOf(item),"wei"));

    // await hltc.mint(item,amount);
    // console.log("HLTC.balance=:",ethers.utils.formatUnits(await hltc.balanceOf(item),"wei"));

    // await hdot.mint(item,amount);
    // console.log("HDOT.balance=:",ethers.utils.formatUnits(await hdot.balanceOf(item),"wei"));

    // await ddx.mint(item,amount);
    // console.log("ddx.balance=:",ethers.utils.formatUnits(await ddx.balanceOf(item),"wei"));

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
