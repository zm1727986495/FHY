import fetch from 'utils/fetch';
export function listCostPrice(query) { // 获取成本价格列表
  return fetch({
    url: '/api/pc/priceStrategy/listCostPrice',
    method: 'get',
    params: query
  });
}

export function commitCostPrice(query) { // 成本价提交
  return fetch({
    url: '/api/pc/priceStrategy/commitCostPrice',
    method: 'put',
    data: query
  });
}

export function listCostFailImportByPage(query) { // 成本失败列表
  return fetch({
    url: '/api/pc/commodityPriceImport/listCostFailImportByPage',
    method: 'get',
    params: query
  });
}


export function addCostPrice(query) { // 新增价格成本
  return fetch({
    url: '/api/pc/priceStrategy/addCostPrice',
    method: 'post',
    data: query
  });
}

export function deleteCostPrice(query) { // 删除价格成本
  return fetch({
    url: '/api/pc/priceStrategy/deleteCostPrice',
    method: 'put',
    data: query
  });
}


export function listAllRelCostPriceMoney(query) { // 获取成本价历史
  return fetch({
    url: '/api/pc/commodityPriceImport/listAllRelCostPriceMoney',
    method: 'get',
    params: query
  });
}


export function listAllRelCostPriceCoefficient(query) { // 获取成本价系数历史
  return fetch({
    url: '/api/pc/commodityPriceImport/listAllRelCostPriceCoefficient',
    method: 'get',
    params: query
  });
}





