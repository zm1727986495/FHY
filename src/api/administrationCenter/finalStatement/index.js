import fetch from 'utils/fetch';

// 结算单列表
export function listPurchasingSettlement(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchasingSettlement',
    method: 'get',
    params
  });
}
// 结算单回显
export function getPurchasingSettlement(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/getPurchasingSettlement',
    method: 'get',
    params
  });
}
// 回显列表
export function listPurchaseOrderData(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrderData',
    method: 'get',
    params
  });
}
// 采购单导入失败列表
export function listPurchaseOrderDataVO(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrderDataVO',
    method: 'get',
    params
  });
}
// 提交
export function commitPurchasingSettlement(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/commitPurchasingSettlement',
    method: 'put',
    data
  });
}

// 结算单新增对账
export function savePurchasingSettlementData(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/savePurchasingSettlementData',
    method: 'post',
    data
  });
}
// 删除结算单
export function deletePurchasingSettlement(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/deletePurchasingSettlement',
    method: 'put',
    data
  });
}
export function deletePurchasingSettlementData(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/deletePurchasingSettlementData',
    method: 'put',
    data
  });
}

