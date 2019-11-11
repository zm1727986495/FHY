import fetch from 'utils/fetch';
export function listrCustomer(query) {  //客户移交_查询列表
    return fetch({
      url: '/api/pc/storeCustomer/listWaitAuditTransferCustomer',
      method: 'get',
      params: query
    });
  };
export function btnCustomer(obj) {  //客户移交_审核通过退回
    return fetch({
      url: '/api/pc/storeCustomer/updateTransferCustomer',
      method: 'put',
      data: obj
    });
  };
  export function listShareCustomer(query) {  //客户共享获取
    return fetch({
      url: '/api/pc/storeCustomer/listShareCustomer',
      method: 'get',
      params: query
    });
  };
  export function exportCompany(obj) {  //客户共享提交
    return fetch({
      url: '/api/pc/storeCustomer/insertTransferCustomerContent',
      method: 'post',
      data: obj
    });
  };