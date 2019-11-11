import fetch from 'utils/fetch';
export function listSellingPriceCom(query) { // 获取策略商品列表
  return fetch({
    url: '/api/pc/priceStrategy/listSellingPriceCom',
    method: 'get',
    params: query
  });
}


export function editPrice(query) { // 提交
  return fetch({
    url: '/api/pc/priceStrategy/editPrice',
    method: 'put',
    data: query
  });
}

export function listFailImportByPage(query) { // 导出列表
  return fetch({
    url: '/api/pc/commodityPriceImport/listFailImportByPage',
    method: 'get',
    params: query
  });
}

export function listAllRelCommodityPriceMoney(query) { // 销售价历史价格列表
  return fetch({
    url: '/api/pc/commodityPriceImport/listAllRelCommodityPriceMoney',
    method: 'get',
    params: query
  });
}
