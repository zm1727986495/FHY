import fetch from 'utils/fetch';
export function listOrderCollectMoneyUnsettledByPage(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/listOrderCollectMoneyUnsettledByPage',
      method: 'get',
      params: query
    });
};
export function returnOrderCollectMoneySuatus(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/returnOrderCollectMoneySuatus',
      method: 'put',
      data: query
    });
};
export function receivableOrderCollectMoney(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/receivableOrderCollectMoney',
      method: 'put',
      data: query
    });
};
export function receivedTicketOrderCollectMoney(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/receivedTicketOrderCollectMoney',
      method: 'put',
      data: query
    });
};
export function receivableOrderCollectMoneyList(query) { //1、查询收款列表、未销账/销账代收款列表
  return fetch({
    url: '/api/pc/financeCollectMoney/receivableOrderCollectMoneyList',
    method: 'put',
    data: query
  });
};

