import fetch from 'utils/fetch';
// 开票申请

/**
 * 添加
 * @param data
 */
export function addInvoiceApply(query) {
  return fetch({
    url: '/api/pc/invoiceApply/addInvoiceApply',
    method: 'post',
    data: query
  });
}

/**
 *  金额回显
 * @param data
 */
export function getCustomerContract(data) {
  return fetch({
    url: '/api/pc/customerContract/getCustomerContract',
    method: 'get',
    params: data
  });
}

// /**
//  *  申请详情
//  * @param data
//  */
// export function invoiceApplyDetails(data) {
//   return fetch({
//     url: '/api/pc/invoiceApply/invoiceApplyDetails',
//     method: 'get',
//     params: data
//   });
// }

/**
 * 申请详情
 * @param data
 */
export function invoiceApplyDetails(data) {
  return fetch({
    url: '/api/pc/invoiceApply/invoiceApplyDetails',
    method: 'get',
    params: data
  });
}

/**
 * 编辑开票申请
 * @param data
 */
export function editInvoiceApply(query) { 
  return fetch({
    url: '/api/pc/invoiceApply/editInvoiceApply',
    method: 'put',
    data: query
  });
}

/**
 *  金额回显2
 * @param data
 */
export function getOrderCollectMoney(data) {
  return fetch({
    url: '/api/pc/orderApply/getOrderCollectMoney',
    method: 'get',
    params: data
  });
}

/**
 *  审核详情
 * @param data
 */
export function listInvoiceApply(data) {
  return fetch({
    url: '/api/pc/invoiceApply/listInvoiceApply',
    method: 'get',
    params: data
  });
}

/**
 * 审核
 * @param data
 */
export function editOrderApplyStatus(query) { 
  return fetch({
    url: '/api/pc/invoiceApply/editOrderApplyStatus',
    method: 'put',
    data: query
  });
}