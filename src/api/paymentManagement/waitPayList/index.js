import fetch from 'utils/fetch';
export function listOrderRefundByPage(params) {
    return fetch({
      url: '/api/pc/financePayment/listOrderRefundByPage',
      method: 'get',
      params
    });
}
export function listBaseDict(params) {
    return fetch({
      url: '/api/pc/common/listBaseDict',
      method: 'get',
      params
    });
}
export function addPayment(data) {
  return fetch({
    url: '/api/pc/financePayment/addPayment',
    method: 'post',
    data
  });
}

export function listCompanyBankAccountByPage(params) {
  return fetch({
    url: '/api/pc/storeCustomer/listCustomerBankCard',
    method: 'get',
    params
  });
}
export function listCustomerBankCardByCustomerId(params) {
  return fetch({
    url: '/api/pc/storeCustomer/listCustomerBankCardByCustomerId',
    method: 'get',
    params
  });
}