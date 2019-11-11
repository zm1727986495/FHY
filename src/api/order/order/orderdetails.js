//订单管理页面接口
import fetch from 'utils/fetch';
// import { listIllegalBillByPage } from 'api/order/order/orderdetails';

export function getOrderInfo(query) {  //编辑订单
  return fetch({
    url: '/api/pc/order/getOrderInfo',
    method: 'get',
    params: query
  });
};

export function orderFollowList(query) {  // 订单跟进 -- 订单跟进记录
  return fetch({
    url: '/api/pc/order/orderFollowList',
    method: 'get',
    params: query
  });
};

export function getReferrerInfo(query) {  // 返点
  return fetch({
    url: '/api/pc/referrer/getReferrerInfo',
    method: 'get',
    params: query
  });
};

export function listIllegalBillByPage(query) {  // 获取违规单列表
  return fetch({
    url: '/api/pc/illegalBill/listIllegalBillByPage',
    method: 'get',
    params: query
  });
};

export function issueGiftsList(query) {  // 订单礼品发放列表
  return fetch({
    url: '/api/pc/storeGiftsCollar/issueGiftsList',
    method: 'get',
    params: query
  });
};

export function orderDetails(query) {  // 订单礼品发放列表
  return fetch({
    url: '/api/pc/order/orderDetails',
    method: 'get',
    params: query
  });
};

export function listOrderApplyAuthority(query) {  // 申请信息
  return fetch({
    url: '/api/pc/orderApply/listOrderApplyAuthority',
    method: 'get',
    params: query
  });
};

export function listAuditRecord(query) {  // 查询合同审核记录
  return fetch({
    url: '/api/pc/customerContract/listAuditRecord',
    method: 'get',
    params: query
  });
};

export function getOrderMoney(query) {  // 获取订单钱款信息
  return fetch({
    url: '/api/pc/orderApply/getOrderMoney',
    method: 'get',
    params: query
  });
};

export function getOrderMoneyCollectAndRefund(query) {  //获取订单收退费信息
  return fetch({
    url: '/api/pc/orderApply/getOrderMoneyCollectAndRefund',
    method: 'get',
    params: query
  });
};

export function listOrderAssigned(query) {  //指派测量列表
  return fetch({
    url: '/api/pc/orderAssigned/listOrderAssigned',
    method: 'get',
    params: query
  });
};

export function listAssigned(query) {  //指派测量列表   和   测量设计汇报列表
  return fetch({
    url: '/api/pc/orderAssigned/listAssigned',
    method: 'get',
    params: query
  });
};            

export function listAppointmentByOrderId(query) {  //预约上门
  return fetch({
    url: '/api/pc/orderAssigned/listAppointmentByOrderId',
    method: 'get',
    params: query
  });
};   

export function listOrderBudget(query) {  //制作预算清单
  return fetch({
    url: '/api/pc/orderBudget/listOrderBudget',
    method: 'get',
    params: query
  });
}; 

export function listPurchaseOrderDataVOByOrderId(query) {  //结算管理
  return fetch({
    url: '/api/pc/purchasingOrder/listPurchaseOrderDataVOByOrderId',
    method: 'get',
    params: query
  });
};

export function getRelOrderProcessHis(query) {  //订单状态步骤条
  return fetch({
    url: '/api/pc/common/getRelOrderProcessHis',
    method: 'get',
    params: query
  });
};
