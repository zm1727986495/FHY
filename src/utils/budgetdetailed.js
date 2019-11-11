var OSS = require('ali-oss');

var client = new OSS({
  region: 'oss-cn-beijing',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAIOxa9mGEIkdQA',
  accessKeySecret: 'opiUbdL2wvcXOsUu1nsAfVFvGwjfGd',
  bucket: 'fanhuayiju'
});

// client.useBucket('Your bucket name');
export async function put (res) {
  try {
    let names = res.file.lastModified+res.file.name;
    let result = await client.put(names, res.file);
    return result;
   } catch (err) {
     console.log (err);
   }
}
/**
 * 预算清单价格计算
 * @method calculatePrices
 * 商品id
 * @param {*} id 
 * 商品规则
 * @param {*} item 
 */
export function calculatePrices (res, item, activprice) {
  let priceActiv = [];
  item.forEach((data, index)=> {
      res.checkedList.forEach( id =>{
          if(data.activityRuleId == id){
            priceActiv.push(data);
          }
      })
  })
    let price = {
        monye: res.discountPrice,
        gift:'',
        higherPrice:''
    };
    // let arr = [];
    // res.checkedList.map(res=>{
    //     return item.forEach(el=>{
    //         if (res == el.activityRuleId){
    //             arr.push(el);
    //         }
    //     })
    // })
    priceActiv.map(el =>{
        if(el.ruleType == 4 && el.ruleTypeDetail == 0){ //满赠
           price.gift = el.activityRuleId;
        }else if (el.ruleType == 4 && el.ruleTypeDetail == 1) {//买赠
            price.gift = el.activityRuleId;
        }else if (el.ruleType == 3){//一口价
            price.monye = el.presentPrice * res.amount;
        }else if (el.ruleType == 2 && el.ruleTypeDetail == 0) {//加价购 按收款金额
          price.higherPrice = el.activityRuleId;
        }else if (el.ruleType == 2 && el.ruleTypeDetail == 1 ) { //加价购 按商品 添加id
            price.higherPrice = el.activityRuleId;
            activprice == undefined ? null :  price.monye = price.monye + activprice;
        }else if (el.ruleType == 1) { //折扣
            price.monye =parseInt((el.discount/10) * price.monye);
        }else if (el.ruleType == 0 && el.isEveryFull == 0) {//满减
          if( price.monye > el.fullPrice){
            price.monye = price.monye -  el.reducePrice;
          }
        }else if(el.ruleType == 0 && el.isEveryFull == 1){//每满减
          if( price.monye > el.fullPrice){
            price.monye = price.monye - Number.parseInt(price.monye/el.fullPrice) * el.reducePrice;
          }
        }
    })  
    return price;
}

function sortRule(a,b) {
    return b.activityRuleOrder - a.activityRuleOrder;
}
export function setData(el, index, i, item){
    let arr = el[index].commodity[i];
    arr[item] = arr[item];
    el[index].commodity[i] = arr;
    return el[index];
    // return arr[item]
}
/**
 * 计价方式
 * @param item
 * 宽
 * @param commodityWide
 * 高
 * @param commodityHigh
 * 深
 * @param commodityLong
 * 数量
 * @param amount
 * 单价
 * @param commodityPrice
 * 非标系数
 * @param discountRate
 * 折扣率
 * @param discountRate
 */
export function sum(item){
  let width = Number(item.commodityWide);
  let high = Number(item.commodityHigh);
  let long = Number(item.commodityLong);
  let amount = Number(item.amount);
  let onePrice = Number(item.commodityPrice);
  let nonParameter = Number(item.nonParameter);
  let discountRate = Number(item.discountRate);
  // if(item.valuationMethodValue == 1){//延米
  //   return width * amount * onePrice * nonParameter * discountRate
  // }else if (item.valuationMethodValue == 2) {//宽高
  //   return width * high * amount * onePrice * nonParameter * discountRate
  // }else if(item.valuationMethodValue == 3){//宽深
  //   return width * long * amount * onePrice * nonParameter * discountRate
  // }else if (item.valuationMethodValue == 4) {//高深
  //   return high * long * num * onePrice * nonParameter * discountRate
  // }else if (item.valuationMethodValue == 5) {//件 套 投影
  //   return amount * onePrice * nonParameter * discountRate
  // }
  if(item.valuationMethodValue == 1){//延米
    return parseFloat((width * amount * onePrice * nonParameter * discountRate).toFixed(2)) 
  }else if (item.valuationMethodValue == 2) {//宽高
    return parseFloat((width * high * amount * onePrice * nonParameter * discountRate).toFixed(2))
     
  }else {//件 套 投影
    return parseFloat((amount * onePrice * nonParameter * discountRate).toFixed(2))
  }
}
export function sums(item){
  let width = Number(item.commodityWide);
  let high = Number(item.commodityHigh);
  let long = Number(item.commodityLong);
  let amount = Number(item.amount);
  let onePrice = Number(item.commodityPrice);
  let nonParameter = Number(item.nonParameter);
  // if(item.valuationMethodValue == 1){//延米
  //   return width * amount * onePrice * nonParameter * discountRate
  // }else if (item.valuationMethodValue == 2) {//宽高
  //   return width * high * amount * onePrice * nonParameter * discountRate
  // }else if(item.valuationMethodValue == 3){//宽深
  //   return width * long * amount * onePrice * nonParameter * discountRate
  // }else if (item.valuationMethodValue == 4) {//高深
  //   return high * long * num * onePrice * nonParameter * discountRate
  // }else if (item.valuationMethodValue == 5) {//件 套 投影
  //   return amount * onePrice * nonParameter * discountRate
  // }
  if(item.valuationMethodValue == 1){//延米
    return parseFloat((width * amount * onePrice * nonParameter).toFixed(2)) 
  }else if (item.valuationMethodValue == 2) {//宽高
    return parseFloat((width * high * amount * onePrice * nonParameter).toFixed(2)) 
  }else {//件 套 投影
    return parseFloat((amount * onePrice * nonParameter).toFixed(2)) 
  }
}