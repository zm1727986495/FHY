import fetch from 'utils/fetch';
export function listOrderCollectMoneyUnsettledByPage(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/listOrderCollectMoneyUnsettledByPage',
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
export function writeOffOrderCollectMoney(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/writeOffOrderCollectMoney',
      method: 'put',
      data: query
    });
};
