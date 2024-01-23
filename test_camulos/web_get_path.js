// const fs = require("fs");


var p=[
  {"token0":"USDT",token1:"HUSD"},
  {"token0":"ADA",token1:"USDT"},
  {"token0":"DOGE",token1:"LTC"},
  {"token0":"LTC",token1:"USDT"},
  {"token0":"USDT",token1:"DOGE"},
  {"token0":"HBTC",token1:"HUSD"},
  {"token0":"HBTC",token1:"HETH"},
  {"token0":"HETH",token1:"USDT"}
]
var sortp=function(pairs){
  let sortPair=[];
  for(let i=0;i<pair.length;i++){
    if(pairs[i].token0>pairs[i].token1){
      sortPair.push({token0:pairs[i].token1,token1:pairs[i].token0});
    }else{
      sortPair.push({token0:pairs[i].token0,token1:pairs[i].token1});
    }
  }
}
