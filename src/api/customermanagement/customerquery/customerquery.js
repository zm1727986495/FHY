import fetch from 'utils/fetch';
/**
 * 客户查询列表
 * @param data
 */
export function listAllStoreCustomer(data) {
  return fetch({
    url: '/api/pc/storeCustomer/listAllStoreCustomer',
    method: 'get',
    params: data
  });
}

export function addCustomers(obj){//新增客户
  return fetch({
    url: '/api/pc/storeCustomer/insertCustomer',
    method: 'post',
    data: obj
  });
}

export function address(obj){//客户地址_新增
  return fetch({
    url: '/api/pc/storeCustomer/insertCustomerAddress',
    method: 'post',
    data: obj
  });
}

export function Shopowner(obj){
  return fetch({
    url: '/api/pc/storeCustomer/getIsLeader',
    method: 'get',
    params: obj
  });
}
