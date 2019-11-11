import fetch from 'utils/fetch';
export function listOrderReportAmountByPage(params) {
    return fetch({
      url: '/api/pc/orderReportAmount/listOrderReportAmountByPage',
      method: 'get',
      params
    });
}
export function addOrderReportAmount(data) {
    return fetch({
      url: '/api/pc/orderReportAmount/addOrderReportAmount',
      method: 'post',
      data
    });
}
export function getOrderReportAmount(params) {
    return fetch({
      url: '/api/pc/orderReportAmount/getOrderReportAmount',
      method: 'get',
      params
    });
}
export function editOrderReportAmount(data) {
    return fetch({
      url: '/api/pc/orderReportAmount/editOrderReportAmount',
      method: 'put',
      data
    });
}
export function delOrderReportAmount(data) {
    return fetch({
      url: '/api/pc/orderReportAmount/delOrderReportAmount',
      method: 'delete',
      data
    });
}

