import fetch from 'utils/fetch';

/**
 * 获取订单列表
 * @param query
 */
export function maintenanceOrderByPage(query) { //
  return fetch({
    url: '/api/pc/maintainPage/maintenanceOrderByPage',
    method: 'get',
    params: query
  });
}
/**
 * 获取备货列表
 * @param query
 */
export function maintenanceGoodsByPage(query) { // 获取备货列表
  return fetch({
    url: '/api/pc/maintainGoods/maintenanceGoodsByPage',
    method: 'get',
    params: query
  });
}
/**
 * 备货内部销售列表
 * @param query
 */
export function maintenanceGoodsSalesByPage(query) {
  return fetch({
    url: '/api/pc/maintainGoods/maintenanceGoodsSalesByPage',
    method: 'get',
    params: query
  });
}
/**
 * 维修暂存-新增内部销售申请单
 * @param query
 */
export function addInternalSalesApply(data) {
  return fetch({
    url: '/api/pc/maintainGoods/addInternalSalesApply',
    method: 'post',
    data
  });
}

/**
 * 维修暂存-转可用
 * @param data
 */
export function turnTheAvailable(data) {
  return fetch({
    url: '/api/pc/maintainGoods/turnTheAvailable',
    method: 'put',
    data
  });
}

/**
 * 根据sku商品id获取可拆商品信息
 * @param data
 * skuGoodsId
 */
export function getcombinationDetachable(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/getcombinationDetachable',
    method: 'get',
    params: data
  });
}
/**
 * 维修暂存-审核内部销售申请单
 * @param data
 * internalSalesApplyId 内部销售申请单id
 * maintainGoodsId 商品维修记录id
 * status 状态 1 申请中 2 通过 3 驳回
 */
export function auditInternalSalesApply(data) {
  return fetch({
    url: '/api/pc/maintainGoods/auditInternalSalesApply',
    method: 'put',
    data
  });
}
/**
 * 维修暂存-出库
 * @param data
 */
export function outboundMaintainGoods(data) {
  return fetch({
    url: '/api/pc/maintainGoods/outboundMaintainGoods',
    method: 'put',
    data
  });
}
