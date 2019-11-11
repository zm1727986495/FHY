import fetch from 'utils/fetch';
export function examineList(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/examineList',
      method: 'get',
      params: query
    });
};
export function listOrder(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/listCollectOrder',
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
export function examineOrderCollectMoney(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/examineOrderCollectMoney',
      method: 'put',
      data: query
    });
};
export function receivedTicketOrderCollectMoney(data) {  //2、收款单下订单列表
  return fetch({
    url: '/api/pc/financeCollectMoney/receivedTicketOrderCollectMoney',
    method: 'put',
    data
  });
};

export function examineOrderCollectMoneyList(data) { //1、查询收款列表、未销账/销账代收款列表
  return fetch({
    url: '/api/pc/financeCollectMoney/examineOrderCollectMoneyList ',
    method: 'put',
    data
  });
};