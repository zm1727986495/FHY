import fetch from 'utils/fetch';
/**
 * 报废列表查询
 * @param data
 */
export function listScrapApplyByPage(data) {
  return fetch({
    url: '/api/pc/scrapApply/listScrapApplyByPage',
    method: 'get',
    params: data
  });
}

/**
 * 新增报废申请
 * @param data
 */
export function addScrapApply(query) {
  return fetch({
    url: '/api/pc/scrapApply/addScrapApply',
    method: 'post',
    data: query
  });
}

/**
 * 报废申请审核 -- 即待审批的提交操作按钮
 * @param data
 */
export function scrapReview(query) { 
  return fetch({
    url: '/api/pc/scrapApply/scrapReview',
    method: 'put',
    data: query
  });
}


/**
 * 根据报废申请id获取报废申请详情
 * @param data
 */
export function getById(data) {
  return fetch({
    url: '/api/pc/scrapApply/getById',
    method: 'get',
    params: data
  });
}

/**
 * 根据报废申请id获取报废的商品、包
 * @param data
 */
export function getGoodsAndPackage(data) { 
  return fetch({
    url: '/api/pc/scrapApply/getGoodsAndPackage',
    method: 'get',
    params: data
  });
}

/**
 * 查询备货库存查询列表 -- 即商品列表
 * @param data
 */
export function listGoodsByPage(data) { 
  return fetch({
    url: '/api/pc/stockUpGoods/listGoodsByPage',
    method: 'get',
    params: data
  });
}


/**
 * 查询备货库存查询列表 -- 即商品列表
 * @param data
 */
export function listStockUpGoodsByPage(data) { 
  return fetch({
    url: '/api/pc/stockUpGoods/listStockUpGoodsByPage',
    method: 'get',
    params: data
  });
}

/**
 * 导出报废列表
 * @param data
 */
export function exportScrapApply(data) { 
  return fetch({
    url: '/api/pc/scrapApply/exportScrapApply',
    method: 'get',
    params: data
  });
}

/**
 * 根据报废申请id作废报废申请
 * @param data
 */
export function deleteById(data) { 
  return fetch({
    url: '/api/pc/scrapApply/deleteById',
    method: 'delete',
    params: data
  });
}

/**
 * 查询订单库存查询列表
 * @param data
 */
export function listStoragePurchaseOrderByPage(data) { 
  return fetch({
    url: '/api/pc/storagePurchaseOrder/listStoragePurchaseOrderByPage',
    method: 'get',
    params: data
  });
}

/**
 * 获取仓库
 * @param data
 */
export function getStorageList(query) { 
  return fetch({
    url: '/api/pc/storage/getStorageList',
    method: 'get',
    params: query
  });
}
/**
 * 获取门店
 * @param data
 */
export function listStore(query) { 
  return fetch({
    url: '/api/pc/common/listStore',
    method: 'get',
    params: query
  });
}

/**
 * 获取供应商即公司列表
 * @param data
 */
export function listCompanyByAll(query) { 
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
    method: 'get',
    params: query
  });
}

/**
 * 获取商品品类即商品类型
 * @param data
 */
export function listCategory(query) { 
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
}

/**
 * 订单库存-货位分配-采购单
 * @param data
 */
export function listSiteNumber(query) { 
  return fetch({
    url: '/api/pc/storagePurchaseOrder/listSiteNumber',
    method: 'get',
    params: query
  });
}

/**
 * 订单库存-查看采购单列表
 * @param data
 */
export function listStoragePurchaseOrder(query) { 
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


/**
 * 采购单列表后的商品列表
 * @param data
 */
export function listPurchaseOrderGoods(query) { 
  return fetch({
    url: '/api/pc/putInStorage/listPurchaseOrderGoods',
    method: 'get',
    params: query
  });
}