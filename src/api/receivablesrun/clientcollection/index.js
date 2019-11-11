import fetch from 'utils/fetch';
export function pages(query) { // 1、查询收款列表、未销账/销账代收款列表
  return fetch({
    url: '/api/pc/financeCollectMoney/listOrderCollectMoneyByPage',
    method: 'get',
    params: query
  });
}
export function listOrder(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/listCollectOrder',
    method: 'get',
    params: query
  });
}
export function listOrderCollectMoneyUnTicketByPage(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/listOrderCollectMoneyUnTicketByPage',
    method: 'get',
    params: query
  });
}
export function listOrderBySalesmanId(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/listOrderBySalesmanId',
    method: 'get',
    params: query
  });
}
export function listStoreBooth(query) {
  return fetch({
    url: '/api/pc/common/listStoreBooth',
    method: 'get',
    params: query
  });
}
export function addOrderCollectMoney(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/addOrderCollectMoney',
    method: 'post',
    data: query
  });
}
export function editOrderCollectMoneyEs(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/editOrderCollectMoney',
    method: 'put',
    data: query
  });
}
export function editOrderCollectMoney(query) {
  return fetch({
    url: '/api/pc/partner/editOrderCollectMoney',
    method: 'put',
    data: query
  });
}
export function cancelOrderCollectMoney(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/cancelOrderCollectMoney',
    method: 'put',
    data: query
  });
}
export function returnOrderCollectMoneySuatus(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/returnOrderCollectMoneySuatus',
    method: 'put',
    data: query
  });
}
export function commitOrderCollectMoney(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/commitOrderCollectMoney',
    method: 'put',
    data: query
  });
}
export function listBaseDict(query) {
  return fetch({
    url: '/api/pc/common/listBaseDict',
    method: 'get',
    params: query
  });
}
export function getOrderCollectMoney(query) {
  return fetch({
    url: '/api/pc/financeCollectMoney/getOrderCollectMoney',
    method: 'get',
    params: query
  });
}
export function getEchoOrderCollectMoney(query) {
  return fetch({
    url: '/api/pc/partner/getOrderCollectMoney',
    method: 'get',
    params: query
  });
}
export function receivedTicketOrderCollectMoney(data) {
  return fetch({
    url: '/api/pc/financeCollectMoney/receivedTicketOrderCollectMoney',
    method: 'put',
    data
  });
}

export function listCompanyBankAccount(params) {
  return fetch({
    url: '/api/pc/financeCollectMoney/listCompanyBankAccount',
    method: 'get',
    params
  });
}
export function billOrderCollectMoney(params) {
  return fetch({
    url: '/api/pc/financeCollectMoney/billOrderCollectMoney',
    method: 'get',
    params
  });
}

export function getHomeCompany(params) {
  return fetch({
    url: '/api/pc/financeCollectMoney/getHomeCompany',
    method: 'get',
    params
  });
}

export function listOrderByOrderIds(params) {
  return fetch({
    url: '/api/pc/financeCollectMoney/listOrderByOrderIds',
    method: 'get',
    params
  });
}
export function examineList(query) { //1、查询收款列表、未销账/销账代收款列表
  return fetch({
    url: '/api/pc/financeCollectMoney/examineList',
    method: 'get',
    params: query
  });
};

