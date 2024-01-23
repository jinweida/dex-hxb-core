const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

const accounts = await ethers.getSigners();
const feeAdrr = hre.network.config.attachs.fee;
console.log("fee to :",feeAdrr);
  const attachs = hre.network.config.attachs;
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
 
  usdt = await ERC20Template.attach(attachs.usdt);
  console.log("usdt attach to:", usdt.address);

  const BXH = await hre.ethers.getContractFactory("BXHToken");
  const bxh = await BXH.attach(attachs.bxh);
  console.log("bxh attach to:", bxh.address);

  const Repurchase = await hre.ethers.getContractFactory("Repurchase");
  const repurchase = await Repurchase.deploy(1000,"0x0B6EAdcD3A778EE847F8b8166aD1509080771AEa");
  await repurchase.deployed();
  console.log("repurchase deployed to:", repurchase.address);
  await repurchase.addCaller(accounts[0].address);
  console.log("repurchase addCaller to:", accounts[0].address);

  
  const References = await hre.ethers.getContractFactory("References");
  const references = await References.deploy(usdt.address, "0x0B6EAdcD3A778EE847F8b8166aD1509080771AEa");
  await references.deployed();

  console.log("references deployed to:", references.address);
  await references.initTable([2,1]);
  console.log("references initTable [2,1]");

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(feeAdrr,references.address,1);
  await factory.deployed();
  console.log("factory deployed to:", factory.address);
  const pairCodeHash = await factory.pairCodeHash();
  console.log("factory pairCodeHash is:", pairCodeHash);
  await factory.setFeeTo(feeAdrr);
  console.log("factory fee to:", await factory.feeTo());
  const s = await factory.setRepurchaseTo(repurchase.address);
  console.log("factory setRepurchaseTo to:", repurchase.address);

  await references.addCaller(factory.address);
  console.log("references addCaller to",factory.address);
  // const Airdrop = await hre.ethers.getContractFactory("Airdrop");
  // const airdrop = await Airdrop.deploy(usdt.address,bxh.address);
  // await airdrop.deployed();
  // console.log("Airdrop deployed to:", airdrop.address);

  const AirdropPool = await hre.ethers.getContractFactory("AirdropPool");
  const airdroppool = await AirdropPool.deploy(bxh.address,30*24*60*12);
  await airdroppool.deployed();
  console.log("airdroppool deployed to:", airdroppool.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });