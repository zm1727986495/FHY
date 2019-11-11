//筛选数据处理
export function getNames(index, data) {
  let arr = [];
  arr = data.map(function (item) {
    return { text: item[index], value: item[index] }
  });
  let obj = {};
  arr = arr.reduce((cur, next) => {
    obj[next.text] ? '' : obj[next.text] = true && cur.push(next);
    return cur;
  }, []);
  return arr;
}

export function getTypes(index, data, itemA, itemB) { //筛选数据处理
  let arr;
  arr = data.map(function (item) {
    let flag = '';
    item[index] == 1 ? flag = itemA : flag = itemB;
    return { text: flag, value: flag }
  });
  let obj = {};
  arr = arr.reduce((cur, next) => {
    obj[next.text] ? '' : obj[next.text] = true && cur.push(next);
    return cur;
  }, []);
  return arr;
}

export function Approval(index, data, itemA, itemB, itemC) { //审批筛选数据处理
  let arr;
  arr = data.map(function (item) {
    let flag = '';
    if (item[index] == 0) {
      flag = itemA
    } else if (item[index] == 1) {
      flag = itemB
    } else {
      flag = itemC
    }

    return { text: flag, value: flag }
  });
  let obj = {};
  arr = arr.reduce((cur, next) => {
    obj[next.text] ? '' : obj[next.text] = true && cur.push(next);
    return cur;
  }, []);

  return arr;
}

export function potionVal(prId, names, str, data) {//回显地址
  let flag;
  data.map(item => {
    item[names] == prId ? flag = item[str] : null;
  });
  return flag
}

/**
 * 数组排序 默认从小到大
 * @param arr 要排序的数组
 * @param order asc(从小到大) desc(从大到小)
 * @returns {*}
 */
export function sortArr(arr, order) {
  order = order || 'asc';
  if (order == 'asc') {
    return arr.sort((a, b) => a - b)
  } else {
    return arr.sort((a, b) => b - a)
  }
}

/**
 *  将数组中数字为字符串类型的项转化为Number类型
 * @param arr
 * @returns {*}
 * @constructor
 */
export function ArrayItemToNumber(arr) {
  let newArr = [];
  arr.forEach(item => {
    newArr.push(Number(item));
  })
  return newArr;
}

/**
 * 获取文件扩展名
 * @param fileName
 * @returns {string}
 */
export function getFileType(fileName) {
  let index = fileName.lastIndexOf('.');
  return fileName.substring(index + 1);
}
/**
 * 计算原价
 * @param valuationMethodValue 计价方式
 * @param width 宽
 * @param height 高
 * @param deep 深
 * @param num 数量
 * @param price 单价
 * @param coefficient 成本系数
 * @param discountRate 折扣率
 * @param nonStandardParameter 非标系数
 * @returns {number}
 */
export function formatNumber(val) {
  if (Number(val)) {
    return parseFloat(val).toFixed(2);
  } else {
    return 0.00;
  }
}
export function sum(valuationMethodValue, width, height, deep, num, price, nonStandardParameter, discountRate, coefficient) {
  // console.log(price, nonStandardParameter, discountRate, coefficient)
  num = num || 0;
  // valuationMethodValue = valuationMethodValue || 1;
  discountRate = discountRate || 1;
  coefficient = coefficient || 1;
  nonStandardParameter = nonStandardParameter || 1;
  let finalPrice = 0;
  if (valuationMethodValue == 1) { // 延米
    finalPrice = width * num * price * coefficient * discountRate * nonStandardParameter;
  } else if (valuationMethodValue == 2) { // 宽高
    finalPrice = width * height * num * price * coefficient * discountRate * nonStandardParameter;
  } else {
    finalPrice = num * price * coefficient * discountRate * nonStandardParameter;
  }
  return finalPrice;
}
/**
 * 递归获取数据或者获取选中的数据（采购合同-采购单）
 * @param datas 原始数据 树结构
 * @param isChecked 是否筛选选中的
 * @returns {Array} 返回值
 */
export function getAllData(datas, isChecked){
  var arr = [];
  if (datas.length) {
    datas.forEach((item, index) => {
      if (item.products) {
        item.products.forEach((item2 ,index2) => {
          arr.push(item2);
        })
      } else {
        arr = arr.concat(getAllData(item.classifyLevel, isChecked));
      }
    })
  }
  if (isChecked) {
    arr = arr.filter(item => item.checked)
  }
  return arr;
}

/**
 * 递归数组的每一个数组计算价钱
 * @param datas
 * @returns {*}
 */
export function calPrice(datas, isPurchaseOrder) {
  let priceType = isPurchaseOrder ? 'costPrice' : 'onePrice';
  if (datas.length) {
    datas.map((item, idx) => {
      let price = 0;
      let activityPrice = 0;
      if (item.products) {
        item.products.map((info, index) => {
          let discountRate = isPurchaseOrder ? 1 : info.discountRate;
          let coefficient = isPurchaseOrder ? info.coefficient : 1;
          info.itemPrice = sum(info.valuationMethodValue, info.width, info.high, info.deep, info.amount, info[priceType], info.nonStandardParameter, discountRate, coefficient);
          price += info.itemPrice;
          if (info.discountPrice != undefined) {
            activityPrice += Number(info.discountPrice);
          }
        })
        item.totalPrice = price;
        item.totalPriceActivity = activityPrice;
      } else {
        calPrice(item.classifyLevel, isPurchaseOrder);
      }
    })
  }
}

export function removeBudget(data) {//删除房间 商品
  let num = false;
  data = data.filter(res => {
    res.checked ? num = true : null;
    return res.checked != true;
  })
  return [data, num];
}

var OSS = require('ali-oss');
var client = new OSS({
  region: 'oss-cn-beijing',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAIOxa9mGEIkdQA',
  accessKeySecret: 'opiUbdL2wvcXOsUu1nsAfVFvGwjfGd',
  bucket: 'fanhuayiju'
});

// client.useBucket('Your bucket name');
export async function put(res) {
  let result
  try {
    let names = res.file.uid+res.file.name;
    result = await client.put(names, res.file);
  } catch (err) {
    console.log(err);
  }
  return result;
}
export async function getBuffer(objName, name, type) {
  let url = client.signatureUrl(objName, {
    response: {
      'content-disposition': 'attachment; filename="' + objName + '"'
    }
  })
  return url;
}


// 显示千位符以及小数点后两位
const validateNumber = n =>
  !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;
export const formatAmount = amount => {
  if (!validateNumber(+amount)) {
    return amount;
  }
  return (+amount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
};
