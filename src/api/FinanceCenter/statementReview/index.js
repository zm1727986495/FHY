import fetch from 'utils/fetch';

// 供货商结算单审核列表
export function listPurchasingSettlementByPage(params) {
  return fetch({
    url: '/api/pc/purchasingSettlement/listPurchasingSettlementByPage',
    method: 'get',
    params
  });
}

// 查询结算单明细列表
export function listPurchasingSettlementDetail(params) {
  return fetch({
    url: '/api/pc/purchasingSettlement/listPurchasingSettlementDetail',
    method: 'get',
    params
  });
}

// 查询应结未结明细列表
export function listUnfinishedDetail(params) {
  return fetch({
    url: '/api/pc/purchasingSettlement/listUnfinishedDetail',
    method: 'get',
    params
  });
}
// 查询业务提交明细列表
export function listBusinessDetail(params) {
  return fetch({
    url: '/api/pc/purchasingSettlement/listBusinessDetail',
    method: 'get',
    params
  });
}
// 查询财务提交明细列表
export function listFinanceDetail(params) {
  return fetch({
    url: '/api/pc/purchasingSettlement/listFinanceDetail',
    method: 'get',
    params
  });
}

// 查看结算单
export function getPurchasingSettlement(params) {
  return fetch({
    url: '/api/pc/purchasingSettlement/getPurchasingSettlement',
    method: 'get',
    params
  });
}
// 保留对账信息
export function retainReconciliation(data) {
  return fetch({
    url: '/api/pc/purchasingSettlement/retainReconciliation',
    method: 'post',
    data
  });
}
// 获取结算单金额变更列表
export function listSettlementAmountByPage(params) {
  return fetch({
    url: '/api/pc/purchasingSettlement/listSettlementAmountByPage',
    method: 'get',
    params
  });
}

// 编辑结算金额
export function editSettlementAmount(data) {
  return fetch({
    url: '/api/pc/purchasingSettlement/editSettlementAmount',
    method: 'post',
    data
  });
}

// 通过结算单
export function passPurchasingSettlement(data) {
  return fetch({
    url: '/api/pc/purchasingSettlement/passPurchasingSettlement',
    method: 'put',
    data
  });
}

// 退回结算单
export function returnPurchasingSettlement(data) {
  return fetch({
    url: '/api/pc/purchasingSettlement/returnPurchasingSettlement',
    method: 'put',
    data
  });
}

// 结算单销账
export function writeOffPurchasingSettlement(data) {
  return fetch({
    url: '/api/pc/purchasingSettlement/writeOffPurchasingSettlement',
    method: 'put',
    data
  });
}
// 重新匹配
export function editDetailsCharges(data) {
  return fetch({
    url: '/api/pc/purchasingSettlement/editDetailsCharges',
    method: 'put',
    data
  });
}


