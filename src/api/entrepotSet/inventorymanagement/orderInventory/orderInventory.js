import fetch from 'utils/fetch';
export function listStoragePurchaseOrderByPage(query) { //查询订单库存查询列表
  return fetch({
    url: '/api/pc/storagePurchaseOrder/listStoragePurchaseOrderByPage',
    method: 'get',
    params: query
  });
}

export function getStorageList(query) { //获取仓库
  return fetch({
    url: '/api/pc/storage/getStorageList',
    method: 'get',
    params: query
  });
}

export function listStore(query) { //获取门店
  return fetch({
    url: '/api/pc/common/listStore',
    method: 'get',
    params: query
  });
}

export function librariesTakeSingle(query) { //订单库存-货位分配-库取单
  return fetch({
    url: '/api/pc/storagePurchaseOrder/getPurchaseOrderGoods',
    method: 'get',
    params: query
  });
}

export function transferTheGoods(obj) { //订单库存-转备货
  return fetch({
    url: '/api/pc/storagePurchaseOrder/transferTheGoods',
    method: 'put',
    data: obj
  });
}

export function listStoragePurchaseOrderSite(query) { //订单库存-转备货
  return fetch({
    url: '/api/pc/storagePurchaseOrder/listStoragePurchaseOrderSite',
    method: 'get',
    params: query
  });
}

export function editInventoryPurchasePackageDetail(obj) { //订单库存-货位分配提交
  return fetch({
    url: '/api/pc/storagePurchaseOrder/editInventoryPurchasePackageDetail',
    method: 'put',
    data: obj
  });
}

export function listStoragePurchaseOrder(query) { //订单库存-转备货
  return fetch({
    url: '/api/pc/storagePurchaseOrder/listStoragePurchaseOrder',
    method: 'get',
    params: query
  });
}
/**
* 采购单列表后的采购单明细
* @param data
*/
export function listPackageById(query) {
  return fetch({
    url: '/api/pc/storagePurchaseOrder/listPackageById',
    method: 'get',
    params: query
  });
}

//获取货位
export function listPackageSiteById(query) {
  return fetch({
    url: '/api/pc/storagePurchaseOrder/listPackageSiteById',
    method: 'get',
    params: query
  });
}

export function listOrderGoodsSite(query) { //获取采购单商品
  return fetch({
    url: '/api/pc/storagePurchaseOrder/listOrderGoodsSite',
    method: 'get',
    params: query
  });
}

export function getLibrariesTakeGoods(query) { //获取库取单商品
  return fetch({
    url: '/api/pc/storagePurchaseOrder/getLibrariesTakeGoods',
    method: 'get',
    params: query
  });
}










