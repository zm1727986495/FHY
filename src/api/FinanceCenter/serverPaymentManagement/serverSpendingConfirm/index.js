import fetch from 'utils/fetch';
export function listOrderPaymentByPage(params) { 
    return fetch({
      url: '/api/pc/financePayment/listOrderPaymentByPage',
      method: 'get',
      params
    });
};
export function paymentOrderPayment(data) { 
  return fetch({
    url: '/api/pc/financePayment/paymentOrderPayment',
    method: 'put',
    data
  });
};
export function returnOrderPayment(data) { 
  return fetch({
    url: '/api/pc/financePayment/returnOrderPayment',
    method: 'put',
    data
  });
};
export function getOrderPayment(params) { 
  return fetch({
    url: '/api/pc/financePayment/getOrderPayment',
    method: 'get',
    params
  });
}
export function updateCustomerBankCard(data) { 
  return fetch({
    url: 'api/pc/storeCustomer/updateCustomerBankCard',
    method: 'put',
    data
  });
}
