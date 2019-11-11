import fetch from 'utils/fetch';
export function billOrderCollectMoney(query) { //1、查询收款列表、未销账/销账代收款列表
    return fetch({
      url: '/api/pc/financeCollectMoney/billOrderCollectMoney',
      method: 'get',
      params: query
    });
};