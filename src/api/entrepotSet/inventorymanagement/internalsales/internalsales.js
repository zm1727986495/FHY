import fetch from 'utils/fetch';
export function maintenanceGoodsSalesByPage(query) { // 维修暂存-备货-内部销售管理列表
  return fetch({
    url: '/api/pc/maintainGoods/maintenanceGoodsSalesByPage',
    method: 'get',
    params: query
  });
}


export function auditInternalSalesApply(query) { // 维修暂存-审核内部销售申请单
  return fetch({
    url: '/api/pc/maintainGoods/auditInternalSalesApply',
    method: 'put',
    data: query
  });
}