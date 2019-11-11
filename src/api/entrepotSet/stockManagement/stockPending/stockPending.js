import fetch from 'utils/fetch';
export function listPutInStorageByPage(query) { //查询待入库列表
  return fetch({
    url: 'api/pc/putInStorage/listPutInStorageByPage',
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

export function listWarehouseWarrantByPage(query) { //查询入库单列表
  return fetch({
    url: '/api/pc/warehouseWarrant/listWarehouseWarrantByPage',
    method: 'get',
    params: query
  });
}


export function listCompanyByAll(query) { //获取供应商
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
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

export function listCategory(query) { //获取品类
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
}

export function getPutInStorageGoodsList(query) { //入库备货列表
  return fetch({
    url: '/api/pc/putInStorage/getPutInStorageGoodsList',
    method: 'get',
    params: query
  });
}

export function getPutInStorageOrderList(query) { // 订单货物列表
  return fetch({
    url: '/api/pc/putInStorage/getPutInStorageOrderList',
    method: 'get',
    params: query
  });
}

export function getArrivalNoticeDetailSiteById(query) { // 入库订单数据
  return fetch({
    url: '/api/pc/putInStorage/getArrivalNoticeDetailSiteById',
    method: 'get',
    params: query
  });
}


export function addWarehouseWarrant(query) { //入库提交
  return fetch({
    url: '/api/pc/warehouseWarrant/addWarehouseWarrant',
    method: 'post',
    data: query
  });
}

export function addWarehouseWarrantOrderGoods(query) { //同到货入库提交
  return fetch({
    url: '/api/pc/warehouseWarrant/addWarehouseWarrantOrderGoods',
    method: 'post',
    data: query
  });
}


export function selectListPackage(query) { // 获取导出定制品列表
  return fetch({
    url: '/api/pc/putInStorage/selectListPackage',
    method: 'get',
    params: query
  });
}

export function selectGoodsByPage(query) { // 获取导出成品列表
  return fetch({
    url: '/api/pc/putInStorage/selectGoodsByPage',
    method: 'get',
    params: query
  });
}

export function exportListPackage(query) { //导出
  return fetch({
    url: '/api/pc/putInStorage/exportListPackage',
    method: 'post',
    data: query
  });
}


export function transfersWarehouseWarrant(query) { //调拨入库提交
  return fetch({
    url: '/api/pc/warehouseWarrant/transfersWarehouseWarrant',
    method: 'post',
    data: query
  });
}


export function getPutInStorageGoodsGjList(query) { // 入库顾家列表
  return fetch({
    url: '/api/pc/putInStorage/getPutInStorageGoodsGjList',
    method: 'get',
    params: query
  });
}

export function listPurchaseOrder(query) { // 获取采购单列表
  return fetch({
    url: '/api/pc/putInStorage/listPurchaseOrder',
    method: 'get',
    params: query
  });
}

export function listPurchaseOrderGoods(query) { // 获取采购商品
  return fetch({
    url: '/api/pc/putInStorage/listPurchaseOrderGoods',
    method: 'get',
    params: query
  });
}


export function manuallyPutInStorage(query) { //手动入库提交
  return fetch({
    url: '/api/pc/warehouseWarrant/manuallyPutInStorage',
    method: 'post',
    data: query
  });
}

export function getListById(query) { // 获取手动入库包数据
  return fetch({
    url: '/api/pc/aogTemplate/getListById',
    method: 'get',
    params: query
  });
}


export function getGoodsSKUId(query) { // 获取skuID
  return fetch({
    url: '/api/pc/storeGiftsCollar/getGoodsSKUId',
    method: 'get',
    params: query
  });
}

export function otherWarehousing(query) { //手动其它入库提交
  return fetch({
    url: '/api/pc/warehouseWarrant/otherWarehousing',
    method: 'post',
    data: query
  });
}

export function guestBasin(query) { //手动客盆提交
  return fetch({
    url: '/api/pc/warehouseWarrant/guestBasin',
    method: 'post',
    data: query
  });
}



export function getTransfers(query) { // 获取调拨列表
  return fetch({
    url: '/api/pc/putInStorage/getTransfers',
    method: 'get',
    params: query
  });
}

export function getCancelSampleSingleDetail(query) { // 获取撤样
  return fetch({
    url: '/api/pc/putInStorage/getCancelSampleSingleDetail',
    method: 'get',
    params: query
  });
}


export function addWarehouseWarrantSample(query) { //撤样入库提交
  return fetch({
    url: '/api/pc/warehouseWarrant/addWarehouseWarrantSample',
    method: 'post',
    data: query
  });
}

export function getOrderChargeBackById(query) { // 获取撤样
  return fetch({
    url: '/api/pc/putInStorage/getOrderChargeBackById',
    method: 'get',
    params: query
  });
}

export function insertCommoditySku(query) { // 新增sku
  return fetch({
    url: '/api/pc/orderBudget/insertCommoditySku',
    method: 'post',
    data: query
  });
}


export function getOrderAndPurchaseBackById(query) { // 获取订单备货入库列表
  return fetch({
    url: '/api/pc/putInStorage/getOrderAndPurchaseBackById',
    method: 'get',
    params: query
  });
}



export function getById(query) { // 获取入库单查询
  return fetch({
    url: '/api/pc/warehouseWarrant/getById',
    method: 'get',
    params: query
  });
}


export function checkSiteOrAddSite(query) { // 新增货位
  return fetch({
    url: '/api/pc/storageSite/checkSiteOrAddSite',
    method: 'post',
    data: query
  });
}


export function getTwoPutInStorage(query) { // 获取二次入库
  return fetch({
    url: '/api/pc/putInStorage/getTwoPutInStorage',
    method: 'get',
    params: query
  });
}

export function listStocksGoods(query) { // 获取退库入库列表
  return fetch({
    url: '/api/pc/designateInstallation/listStocksGoods',
    method: 'get',
    params: query
  });
}


export function withdrawing(query) { //退库入库提交
  return fetch({
    url: '/api/pc/warehouseWarrant/withdrawing',
    method: 'post',
    data: query
  });
}




