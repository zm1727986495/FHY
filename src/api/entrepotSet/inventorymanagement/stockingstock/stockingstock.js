import fetch from 'utils/fetch';

export function listGoodsByPage(query) { // 查询备货库存查询列表
  return fetch({
    url: '/api/pc/stockUpGoods/listGoodsByPage',
    method: 'get',
    params: query
  });
}

export function listStockUpGoodsByPage(query) { // 获取列表
  return fetch({
    url: '/api/pc/stockUpGoods/listStockUpGoodsByPage',
    method: 'get',
    params: query
  });
}

// export function editStorage(query) { //出库交接
//   return fetch({
//     url: '/api/pc/storage/editStorage',
//     method: 'put',
//     data: query
//   });
// }

export function getStockUpGoodsInventoryById(query) { // 根据sku商品id和仓库id、库存类型获取备货商品信息
  return fetch({
    url: '/api/pc/stockUpGoods/getStockUpGoodsInventoryById',
    method: 'get',
    params: query
  });
}

export function getStockUpGoodsDetailsById(query) { // 根据sku商品id查看商品详情
  return fetch({
    url: '/api/pc/stockUpGoods/getStockUpGoodsDetailsById',
    method: 'get',
    params: query
  });
}

export function getTreeById(query) { // 根据仓库id货区货位树Tree
  return fetch({
    url: '/api/pc/storageRegion/getTreeById',
    method: 'get',
    params: query
  });
}

export function goodsAllocation(obj) { // 备货库存-货位分配
  return fetch({
    url: '/api/pc/stockUpGoods/goodsAllocation',
    method: 'put',
    data: obj
  });
}
export function getStockUpGoodsById(query) { //sku商品id和仓库id获取转移商品详情-转订单列表
  return fetch({
    url: '/api/pc/stockUpGoods/getStockUpGoodsById',
    method: 'get',
    params: query
  });
}

export function getcombinationDetachable(query) { //根据sku商品id获取可拆商品信息
  return fetch({
    url: '/api/pc/storeAcceptance/getcombinationDetachable',
    method: 'get',
    params: query
  });
}

export function goodsDetachable(obj) { // 拆件提交
  return fetch({
    url: '/api/pc/storeAcceptance/goodsDetachable',
    method: 'post',
    data: obj
  });
}

export function changeOrder(obj) { //转订单提交
  return fetch({
    url: '/api/pc/stockUpGoods/changeOrder',
    method: 'put',
    data: obj
  });
}



export function saveStackDetail(data) { // 组套
  return fetch({
    url: '/api/pc/stack/saveStackDetail',
    method: 'post',
    data
  });
}
