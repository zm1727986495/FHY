import fetch from 'utils/fetch';
/**
 * 获取违规单列表
 * @method listIllegalBillByPage
 */
export function listIllegalBillByPage(query) { 
  return fetch({
    url: '/api/pc/illegalBill/listIllegalBillByPage',
    method: 'get',
    params: query
  });
};
/**
 * 获取活动规则
 * @method listActivityRule
 */
export function listActivityRule(query) { 
  return fetch({
    url: 'api/pc/orderBudget/listActivityRule',
    method: 'get',
    params: query
  });
};


export function addCustomerContract(obj) {  //合同基本信息保存
    return fetch({
        url: '/api/pc/customerContract/addCustomerContract',
        method: 'post',
        data: obj
    });
};