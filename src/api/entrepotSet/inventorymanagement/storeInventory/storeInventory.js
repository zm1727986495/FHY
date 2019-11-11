import fetch from 'utils/fetch';
export function storeInventoryByPage(query) { // 店面库存列表
  return fetch({
    url: '/api/pc/inventoryGoods/storeInventoryByPage',
    method: 'get',
    params: query
  });
}

export function getStoreById(query) { // 根据门店id获取门店信息
  return fetch({
    url: '/api/pc/inventoryGoods/getStoreById',
    method: 'get',
    params: query
  });
}

export function storeInventoryGoodsByPage(query) { // 门店id获取门店-店面库存列表信息
  return fetch({
    url: '/api/pc/inventoryGoods/storeInventoryGoodsByPage',
    method: 'get',
    params: query
  });
}

export function getNoNumber(query) { // 店面库存-未提数量
  return fetch({
    url: '/api/pc/inventoryGoods/getNoNumber',
    method: 'get',
    params: query
  });
}
export function listStoreServeGroup(data) { // 获取当前登录人所在门店下的部门
  return fetch({
    url: '/api/pc/serveGroup/listStoreServeGroup',
    method: 'get',
    params: data
  });
}
