import fetch from 'utils/fetch';
export function addPriceTactics(query) { // 新增价格策略
    return fetch({
      url: '/api/pc/priceStrategy/addPriceTactics',
      method: 'post',
      data: query
    });
}

export function listPriceStrategy(query) { // 查询价格策略
    return fetch({
      url: '/api/pc/priceStrategy/listPriceStrategy',
      method: 'get',
      params: query
    });
}

export function listStorePage(query) { // 查询门店列表
  return fetch({
    url: '/api/pc/common/listStorePage',
    method: 'get',
    params: query
  });
}

export function inlistStore(query) { // 获取价格策略下的门店列表
  return fetch({
    url: '/api/pc/priceStrategy/listStore',
    method: 'get',
    params: query
  });
}

export function editPriceStrategyById(query) { // 修改价格策略
  return fetch({
    url: '/api/pc/priceStrategy/editPriceStrategyById',
    method: 'put',
    data: query
  });
}

export function listStrategiesForDetails(query) { // 查询商品价格详情
  return fetch({
    url: '/api/pc/priceStrategy/listStrategiesForDetails',
    method: 'get',
    params: query
  });
}

export function listBrand(query) { //获取品牌
  return fetch({
    url: '/api/pc/common/listBrand',
    method: 'get',
    params: query
  });
}

export function listCategory(query) { //获取商品品类
    return fetch({
      url: '/api/pc/common/listCategory',
      method: 'get',
      params: query
    });
}

export function deletePriceStrategy(query) { // 删除价格策略
  return fetch({
    url: '/api/pc/priceStrategy/deletePriceStrategy',
    method: 'put',
    data: query
  });
}

export function editPriceStrategyStatus(query) { // 修改价格策略
  return fetch({
    url: '/api/pc/priceStrategy/editPriceStrategyStatus',
    method: 'put',
    data: query
  });
}

export function listCommodityByPage(query) { //获取列表数据
    return fetch({
      url: '/api/pc/commodity/listCommodityByPage',
      method: 'get',
      params: query
    });
}

export function addCommodity(query) { //新增商品
  return fetch({
    url: '/api/pc/commodity/addCommodity',
    method: 'post',
    data: query
  });
}

export function listAccessoryImg(query) { //获取列表数据
  return fetch({
    url: '/api/pc/commodity/listAccessoryImg',
    method: 'get',
    params: query
  });
}

export function editAccessoryImg(query) { //设为主图
  return fetch({
    url: '/api/pc/commodity/editAccessoryImg',
    method: 'put',
    data: query
  });
}

export function listCommodity(query) { //获取商品价格列表
  return fetch({
    url: '/api/pc/priceStrategy/listCommodity',
    method: 'get',
    params: query
  });
}



export function listCommodityPrice(query) { //获取商品价格列表
  return fetch({
    url: '/api/pc/commodity/listCommodityPrice',
    method: 'get',
    params: query
  });
}

export function listCompanyByAll(query) { //获取公司列表
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
    method: 'get',
    params: query
  });
}




export function ListCommodityAttribute(query) { //获取商品属性
  return fetch({
    url: 'api/pc/commodity/ListCommodityAttribute',
    method: 'get',
    params: query
  });
}

export function countCommodity(query) { //获取品类下商品总数
  return fetch({
    url: '/api/pc/commodity/countCommodity',
    method: 'get',
    params: query
  });
}

export function listClassify(query) { //获取商品分类
  return fetch({
    url: '/api/pc/common/listClassify',
    method: 'get',
    params: query
  });
}


export function editStatus(query) { //修改状态
  return fetch({
    url: '/api/pc/commodity/editStatus',
    method: 'put',
    data: query
  });
}

export function editUpperShelf(query) { //上下架
  return fetch({
    url: '/api/pc/commodity/editUpperShelf',
    method: 'put',
    data: query
  });
}

export function addCommodityInPriceStrategy(query) { // 价格策略新增商品
  return fetch({
    url: '/api/pc/priceStrategy/addCommodityInPriceStrategy',
    method: 'post',
    data: query
  });
}

export function editPrice(query) { // 应用商品价格
  return fetch({
    url: '/api/pc/priceStrategy/editPrice',
    method: 'put',
    data: query
  });
}

export function getBrand(query) { //查看商品
  return fetch({
    url: '/api/pc/common/getCommodity',
    method: 'get',
    params: query
  });
}


export function editCommodity(query) { //修改商品
  return fetch({
    url: '/api/pc/commodity/editCommodity',
    method: 'put',
    data: query
  });
}

export function listBatchImportByPage(query) { // 批次记录列表
  return fetch({
    url: '/api/pc/batchImport/listBatchImportByPage',
    method: 'get',
    params: query
  });
}

// export function delObj(id) { // 批量删除批次记录
//   return fetch({
//     url: '/api/admin/dict/' + id,
//     method: 'delete'
//   })
// }

export function deleteBatchImport(query){ // 批量删除批次记录
  return fetch({
    url:"/api/pc/batchImport/deleteBatchImport",
    method:"delete",
    data:query
  })
}

export function addBatchImport(query) { // 增加批次导入
  return fetch({
    url: '/api/pc/batchImport/addBatchImport',
    method: 'post',
    data: query
  });
}

export function listCommoditylist(query) { // 批次记录商品价格详情列表
  return fetch({
    url: '/api/pc/batchImport/listCommodity',
    method: 'get',
    params: query
  });
}

export function listBatchImportCommodity(query) { // 上传批次后回显商品
  return fetch({
    url: '/api/pc/batchImport/listBatchImportCommodity',
    method: 'get',
    params: query
  });
}

export function editCommodityPrice(query) { // 应用批次导入
  return fetch({
    url: '/api/pc/batchImport/editCommodityPrice',
    method: 'put',
    params: query
  });
}

export function exportBatchImport(query) { // 上传批次后回显商品
  return fetch({
    url: '/api/pc/batchImport/exportBatchImport',
    method: 'get',
    params: query
  });
}




