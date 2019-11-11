import fetch from 'utils/fetch';
export function listOrderPaymentByPage(params) {
    return fetch({
      url: '/api/pc/financePayment/listOrderPaymentByPage',
      method: 'get',
      params
    });
};
export function writeOffOrderPayment(data) {
    return fetch({
      url: '/api/pc/financePayment/writeOffOrderPayment',
      method: 'put',
      data
    });
};
