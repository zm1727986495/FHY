import fetch from 'utils/fetch';
export function outboundOrderByPage(query) { // 获取列表
  return fetch({
    url: '/api/pc/outboundOrder/outboundOrderByPage',
    method: 'get',
    params: query
  });
}

export function deliveryConfirmation(query) { // 出库交接确认
  return fetch({
    url: '/api/pc/outboundOrder/deliveryConfirmation',
    method: 'put',
    data: query
  });
}

export function deliveryRecipientsGoods(query) { // 礼品和备货出库交接确认
  return fetch({
    url: '/api/pc/outboundOrder/deliveryRecipientsGoods',
    method: 'put',
    data: query
  });
}

export function listOrganizationByUserId(query) { // 获取当前机构的人
  return fetch({
    url: '/api/pc/common/listOrganizationByUserId',
    method: 'get',
    params: query
  });
}



export function listStoragePurchaseOrder(query) { // 获取确认出库列表
  return fetch({
    url: '/api/pc/outboundOrder/listStoragePurchaseOrder',
    method: 'get',
    params: query
  });
}

export function getById(query) { // 获取信息头
  return fetch({
    url: '/api/pc/outboundOrder/getById',
    method: 'get',
    params: query
  });
}

export function outbound(query) { // 待出库交接
  return fetch({
    url: '/api/pc/outboundOrder/outbound',
    method: 'put',
    data: query
  });
}


export function addOutbound(query) { // 手动出库
  return fetch({
    url: '/api/pc/outboundOrder/addOutbound',
    method: 'post',
    data: query
  });
}


export function listRecipientsGoods(query) { // 获取出库领用列表
  return fetch({
    url: '/api/pc/outboundOrder/listRecipientsGoods',
    method: 'get',
    params: query
  });
}


export function temporaryOutboundOrderByPage(query) { // 获取临时出库列表
  return fetch({
    url: '/api/pc/outboundOrder/temporaryOutboundOrderByPage',
    method: 'get',
    params: query
  });
}


export function temporaryOutbound(query) { // 临时出库提交
  return fetch({
    url: '/api/pc/outboundOrder/temporaryOutbound',
    method: 'put',
    data: query
  });
}