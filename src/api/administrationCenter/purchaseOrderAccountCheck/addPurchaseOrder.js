import fetch from 'utils/fetch';
// 采购单列表
export function listChoicePurchaseOrder(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listChoicePurchaseOrder',
    method: 'get',
    params
  });
}

export function listPurchaseOrder(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrder',
    method: 'get',
    params
  });
}
export function addPurchaseOrderBatch(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/addPurchaseOrderBatch',
    method: 'post',
    data
  });
}

export function delPurchaseOrderBatch(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/delPurchaseOrderBatch',
    method: 'delete',
    data
  });
}
export function savePurchaseOrderData(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/savePurchaseOrderData',
    method: 'post',
    data
  });
}

export function batchPullPurchaseOrder(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/batchPullPurchaseOrder',
    method: 'put',
    data
  });
}
