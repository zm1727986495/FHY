import fetch from 'utils/fetch';
/**
 * 添加申请
 * @param data
 */
export function addDiscountApply(query) {
    return fetch({
        url: '/api/pc/discountApply/addDiscountApply',   
        method: 'post',
        data: query
    });
}

/**
 * 修改信息回显
 * @param {*} data 
 */
export function discountApplyDetails(data) {
  return fetch({
    url: '/api/pc/discountApply/discountApplyDetails',
    method: 'get',
    params: data
  });
}

/**
 * 修改编辑接口
 * @param {*} data 
 */
export function editDiscountApply(data) {
  return fetch({
    url: '/api/pc/discountApply/editDiscountApply',
    method: 'put',
    data
  });
}

/**
 * 审核列表
 * @param {*} data 
 */
export function listDiscountApply(data) {
  return fetch({
    url: '/api/pc/discountApply/listDiscountApply',
    method: 'get',
    params: data
  });
}  

/**  
 * 添加审核
 * @param {*} data 
 */

export function editAuditStatus(data) {
  return fetch({
    url: '/api/pc/discountApply/editAuditStatus',
    method: 'put',
    data
  });
}


/**
 * 当前登录人审批次数
 * @param {*} data 
 */
export function auditNumber(data) {
  return fetch({
    url: '/api/pc/discountApply/auditNumber',
    method: 'get',
    params: data
  });
}


