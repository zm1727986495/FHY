import fetch from 'utils/fetch';
export function listBmcOrderCollectMoneyVO(params) { 
  return fetch({
    url: '/api/pc/partner/listBmcOrderCollectMoneyVO',
    method: 'get',
    params
  });
}
export function editSettementCollectMoney(data) { 
  return fetch({
    url: '/api/pc/partner/editSettementCollectMoney',
    method: 'put',
    data
  });
}
export function listBmcOrderCollectMoneyNOVO(params) { 
  return fetch({
    url: '/api/pc/partner/listBmcOrderCollectMoneyNOVO',
    method: 'get',
    params
  });
}
export function listOrderCollectMoneyByNOFind(params) { 
  return fetch({
    url: '/api/pc/financeCollectMoney/listOrderCollectMoneyByNOFind',
    method: 'get',
    params
  });
}


