import fetch from 'utils/fetch';
// 对账列表
export function listPurchaseOrderDataVO(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrderDataVO',
    method: 'get',
    params
  });
}
// 导入结算单
export function importPurchaseOrderBatch(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/importPurchaseOrderBatch',
    method: 'post',
    data
  });
}
// 导入失败列表
export function listPurchaseOrderBatchDataFailVO(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrderBatchDataFailVO',
    method: 'get',
    params
  });
}

// 需要处理列表
export function listPurchaseDataVO(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseDataVO',
    method: 'get',
    params
  });
}

// 采购单导入成功列表
export function listPurchaseOrderBatchDataSuccess(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrderBatchDataSuccess',
    method: 'get',
    params
  });
}
// 导入保存
export function savePurchaseOrderData(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/savePurchaseOrderData',
    method: 'post',
    data
  });
}

// 生成结算单
export function savePurchasingSettlement(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/savePurchasingSettlement',
    method: 'post',
    data
  });
}
// 采购单批次列表
export function listPurchaseOrderBatch(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrderBatch',
    method: 'get',
    params
  });
}
// 采购单批次导入列表
export function listPurchaseOrderBatchData(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrderBatchData',
    method: 'get',
    params
  });
}
export function addPurchasingBatch(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/addPurchasingBatch',
    method: 'post',
    data
  });
}

export function listRepeatPurchaseDataVO(params) {
  return fetch({
    url: '/api/pc/purchasingOrder/listRepeatPurchaseDataVO',
    method: 'get',
    params
  });
}
export function editRepeatPurchaseData(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/editRepeatPurchaseData',
    method: 'put',
    data
  });
}

export function editImportPurchaseData(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/editImportPurchaseData',
    method: 'put',
    data
  });
}
export function heavyLoadPurchaseData(data) {
  return fetch({
    url: '/api/pc/purchasingOrder/heavyLoadPurchaseData',
    method: 'put',
    data
  });
}
export function listPurchaseOrder(params) {
  return fetch({
    url: 'api/pc/PurchaseOrder/listPurchaseOrder',
    method: 'get',
    params
  });
}
export function editReconciliationComplete(data) {
  return fetch({
    url: 'api/pc/purchasingOrder/editReconciliationComplete',
    method: 'put',
    data
  });
}
export function getCheckPurchaseOrderData(data) {
  return fetch({
    url: 'api/pc/purchasingOrder/getCheckPurchaseOrderData',
    method: 'put',
    data
  });
}

export function exportPurchaseOrderBatchDataFailVO(params) {
  return fetch({
    url: 'api/pc/purchasingOrder/exportPurchaseOrderBatchDataFailVO',
    method: 'get',
    params
  });
}
export function endPurchaseOrder(data) {
  return fetch({
    url: 'api/pc/purchasingOrder/endPurchaseOrder',
    method: 'put',
    data
  });
}
// 已结算
export function editPurchaseOrder(data) {
  return fetch({
    url: 'api/pc/purchasingOrder/editPurchaseOrder',
    method: 'put',
    data
  });
}









