import fetch from 'utils/fetch';
/**
 * 备货审核列表
 * @param data
 */
export function listStockUpApply(data) {
  return fetch({
    url: '/api/pc/stockUpApply/listStockUpApply',
    method: 'get',
    params: data
  });
}


 /**
 * 新增备货申请
 * @param data
 */

export function addStockUpApply(data) { 
  return fetch({
      url: '/api/pc/stockUpApply/addStockUpApply',
      method: 'post',
      data
  });
}

/**
 * 商品颜色查询
 * @param data
 */
export function listCommodityColour(data) {
  return fetch({
    url: '/api/pc/commodity/listCommodityColour',
    method: 'get',
    params: data
  });
}

/**
 * 商品系列查询
 * @param data
 */
export function listCommoditySeries(data) {
  return fetch({
    url: '/api/pc/commodity/listCommoditySeries',
    method: 'get',
    params: data
  });
}

/**
 * 商品材质查询
 * @param data
 */
export function listCommodityMaterial(data) {
  return fetch({
    url: '/api/pc/commodity/listCommodityMaterial',
    method: 'get',
    params: data
  });
}

/**
 * 回显备货申请信息
 * @param data
 */
export function getStockUpApply(data) {
  return fetch({
    url: '/api/pc/stockUpApply/getStockUpApply',
    method: 'get',
    params: data
  });
}

/**
 * 撤销备货申请
 * @param data
 */
export function deleteStockUpApply(query) { 
  return fetch({
    url: '/api/pc/stockUpApply/deleteStockUpApply',
    method: 'put',
    data: query
  });
}

/**
 * 备货审批记录
 * @param data
 */
export function listStockUpApproveLog(data) {
  return fetch({
    url: '/api/pc/stockUpApply/listStockUpApproveLog',
    method: 'get',
    params: data
  });
}

 /**
 *  审核页面的通过和驳回按钮
 * @param data
 */

export function auditStockUpApply(data) { 
  return fetch({
      url: '/api/pc/stockUpApply/auditStockUpApply',
      method: 'post',
      data
  });
}


/**
 * 修改备货申请
 * @param data
 */
export function editStockUpApply(query) { 
  return fetch({
    url: '/api/pc/stockUpApply/editStockUpApply',
    method: 'put',
    data: query
  });
}


/**
 * 删除图片
 * @param data
 */
export function removeAccessoryImg(query) { //删除图片
  return fetch({
    url: '/api/pc/common/removeAccessoryImg',
    method: 'delete',
    data: query
  });
}

/**
 * 查询采购订单列表
 * @param data
 */
export function listStockUpPurchaseOrder(data) {
  return fetch({
    url: '/api/pc/StockUpPurchaseOrder/listStockUpPurchaseOrder',
    method: 'get',
    params: data
  });
}


 /**
 *  新增
 * @param data
 */

export function insertStockUpPurchaseOrder(data) { 
  return fetch({
      url: '/api/pc/StockUpPurchaseOrder/insertStockUpPurchaseOrder',
      method: 'post',
      data
  });
}


/**
 * 编辑备货采购详情
 * @param data
 */
export function updateStockUpPurchaseOrder(query) { 
  return fetch({
    url: '/api/pc/StockUpPurchaseOrder/updateStockUpPurchaseOrder',
    method: 'put',
    data: query
  });
}


/**
 * 查询备货采购详情
 * @param data
 */
export function getStockUpPurchaseOrder(data) {
  return fetch({
    url: '/api/pc/StockUpPurchaseOrder/getStockUpPurchaseOrder',
    method: 'get',
    params: data
  });
}

/**
 * 作废
 * @param data
 */
export function deleteStockUpPurchaseOrder(obj) {
  return fetch({
    url: '/api/pc/StockUpPurchaseOrder/deleteStockUpPurchaseOrder',
      method: 'put',
      data: obj
  });
};

/**
 * 备货采购 选择备货采购申请后的商品
 * @param data
 */
export function getStockUpGoodsInfo(data) {
  return fetch({
    url: '/api/pc/stockUpApply/getStockUpGoodsInfo',
    method: 'get',
    params: data
  });
}

/**
 * 备货采购订单 订单的仓库列表
 * @param data
 */
export function listStockUpStorage(data) {
  return fetch({
    url: '/api/pc/StockUpPurchaseOrder/listStockUpStorage',
    method: 'get',
    params: data
  });
}

/**
 * 备货查询组织结构接口
 * @param data
 */
export function listOrganizationByPresent(data) {
  return fetch({
    url: '/api/pc/StockUpPurchaseOrder/listOrganizationByPresent',
    method: 'get',
    params: data
  });
}


/**
 * 获取当前登陆人组织结构接口
 * @param data
 */
export function getOrganizationByPresent(data) {
  return fetch({
    url: '/api/pc/common/getOrganizationByPresent',
    method: 'get',
    params: data
  });
}



/**
 * 采购申请的 提交按钮
 * @param data
 */
export function submitApply(data) {
  return fetch({
    url: '/api/pc/stockUpApply/submitApply',
    method: 'get',
    params: data
  });
}