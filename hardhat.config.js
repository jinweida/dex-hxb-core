require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

const accounts = {
  mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
  // initialIndex: 18
  // accountsBalance: "990000000000000000000",
}

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey:"6IQTZTMD392X2U2SYZBABWDS8KB6D8UD4T"
  },
  defaultNetwork: "heco",
  networks: {
    local: {
      url: `http://localhost:8545`,
      accounts,
      attachs:{
           fee: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
           usdt:"0xD6b040736e948621c5b6E0a494473c47a6113eA8",
           bch:"0xeF31027350Be2c7439C1b0BE022d49421488b72C",
           hbtc:"0xa0945a7aC164287B4e6B8f234337820807074a29",
           heth:"0x9771321265cAD7049903EaF4a574Eab51fD97378",
           hltc:"0x8E02433C31B51ABe3Ac65908d59eF82ddB52714F",
           wht :"0x7B4f352Cd40114f12e82fC675b5BA8C7582FC513",
           hdot:"0x426dcD4fa088D7b33797Da0002bF36a669B398D5",
           bwtoken:"0x82EdA215Fa92B45a3a76837C65Ab862b6C7564a8",
           uniswap:{
             factory:"0x359570B3a0437805D0a71457D61AD26a28cAC9A2",
             router: "0x162700d1613DfEC978032A909DE02643bC55df1A",
           },
           bxh : "0xcE0066b1008237625dDDBE4a751827de037E53D2",
           repurchase:"0x87006e75a5B6bE9D1bbF61AC8Cd84f05D9140589",
           references:"0x8fC8CFB7f7362E44E472c690A6e025B80E406458",
           airdroppool:"0x70eE76691Bdd9696552AF8d4fd634b3cF79DD529",
           feecollector:"0x8B190573374637f144AC8D37375d97fd84cBD3a0",
           oracle:"0x67aD6EA566BA6B0fC52e97Bc25CE46120fdAc04c",
           tokenlock:"0x114e375B6FCC6d6fCb68c7A1d407E652C54F25FB",
           bxhpool: "0x8D81A3DCd17030cD5F23Ac7370e4Efb10D2b3cA4",
           swapmining: "0xcD0048A5628B37B8f743cC2FeA18817A29e97270",
           paramfeecalctor: "0xcD0048A5628B37B8f743cC2FeA18817A29e97270",

      }
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      gasPrice: 120 * 1000000000,
      chainId: 1,
    },
    heco:{
      url: `https://http-mainnet.hecochain.com`,
      accounts,
      gasPrice: 20*1000000000,
      chainId: 128,
      loggingEnabled: true,
      blockGasLimit:0x280de80,
      attachs:{
        fee: "0xC18f3F15aa3c72A3592D281941d6dAaCF4769bE6",
        aaa:"0x3FB9ff40B3783370a43E383818ED8871598BeA44",
        bbb:"0x410787af2871D0c18A74065CA35e860ee66f8A35",
        ccc:"0xCA55A6c422D93f42087B635faC014f7946DEeF5d",
        ddd:"0x9902DDb630D9528d5BdAFac5e6a78BC1181fDD70",
        usdt:"0xa71edc38d189767582c38a3145b5873052c3e47a",
        husd:"0x0298c2b32eae4da002a15f36fdf7615bea3da047",
        wht :"0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f",
        uniswap:{
          factory:"0x92e68911333e95D9a495eCd1e92ad3Db72043567",
          router: "0xB2A9BC4ddEE98B59A6db85275eB39e408aef6c7D",
        },
        ddx : "0xD194759Dca7bC007E126eAf5d7981b58621C15BC",
        feecollector: "0x8E7B480ABDF2144939459236431F0a032Af8B6E0",
        tokenlock: "0x8f1699346fbE3BD9E152D2B760727455AEaa6D0B",
        sweeper: "0xC18f3F15aa3c72A3592D281941d6dAaCF4769bE6",
        references: "0x598105a9ff477a510C24f6afd2DB4ac0bFd2166B",
        oracle: "0xb47416FfdC9cfD0E527281e808f680798deeA5bf",
        startblock: "5558407",
        swapmining: "0x785Effd455700596ec9Df58C3b0193e99DABC9BA",
        ddxpool: "0x2d4856154844e8aD67570D5EE148612f279D53bC",
        paramfeecalctor: "0x2908a1242D479d6EB994258E487464356A671c3c",
      }
    },
    hecolocal:{
      url: `http://94.74.87.188:8545`,
      accounts,
      gasPrice: 0x3b9aca00,
      chainId: 3388,
      attachs:{
        fee: "0xC18f3F15aa3c72A3592D281941d6dAaCF4769bE6",
        aaa:"0x3FB9ff40B3783370a43E383818ED8871598BeA44",
        bbb:"0x410787af2871D0c18A74065CA35e860ee66f8A35",
        ccc:"0xCA55A6c422D93f42087B635faC014f7946DEeF5d",
        ddd:"0x9902DDb630D9528d5BdAFac5e6a78BC1181fDD70",
        usdt:"0xa71edc38d189767582c38a3145b5873052c3e47a",
        husd:"0x0298c2b32eae4da002a15f36fdf7615bea3da047",
        wht :"0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f",
        uniswap:{
          factory:"0x92e68911333e95D9a495eCd1e92ad3Db72043567",
          router: "0xB2A9BC4ddEE98B59A6db85275eB39e408aef6c7D",
        },
        ddx : "0xD194759Dca7bC007E126eAf5d7981b58621C15BC",
        feecollector: "0x8E7B480ABDF2144939459236431F0a032Af8B6E0",
        tokenlock: "0x8f1699346fbE3BD9E152D2B760727455AEaa6D0B",
        sweeper: "0xC18f3F15aa3c72A3592D281941d6dAaCF4769bE6",
        references: "0x598105a9ff477a510C24f6afd2DB4ac0bFd2166B",
        oracle: "0xb47416FfdC9cfD0E527281e808f680798deeA5bf",
        startblock: "5558407",
        swapmining: "0x785Effd455700596ec9Df58C3b0193e99DABC9BA",
        ddxpool: "0x2d4856154844e8aD67570D5EE148612f279D53bC",
        paramfeecalctor: "0x2908a1242D479d6EB994258E487464356A671c3c",
      },
    },
  }
};

