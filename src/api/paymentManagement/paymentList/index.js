import fetch from 'utils/fetch';
export function listOrderPaymentByPage(params) { 
    return fetch({
      url: '/api/pc/financePayment/listOrderPaymentByPage',
      method: 'get',
      params
    });
}
export function getOrderPayment(params) { 
    return fetch({
      url: '/api/pc/financePayment/getOrderPayment',
      method: 'get',
      params
    });
}
export function editPayment(data) { 
    return fetch({
      url: '/api/pc/financePayment/editPayment',
      method: 'put',
      data
    });
}
export function commitOrderPayment(data) {
    return fetch({
      url: '/api/pc/financePayment/commitOrderPayment',
      method: 'put',
      data
    });
}
export function deleteOrderPayment(data) { 
    return fetch({
      url: '/api/pc/financePayment/deleteOrderPayment',
      method: 'put',
      data
    });
}





