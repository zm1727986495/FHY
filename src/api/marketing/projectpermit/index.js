import fetch from 'utils/fetch';
// 工期申请

/**
 * 获取可申请天数
 * @param data
 */
export function whetherApplyStatus(data) {
  return fetch({
    url: '/api/pc/projectDelayUrgentApply/whetherApplyStatus',
    method: 'get',
    params: data
  });
}

/**
 * 添加申请
 * @param data
 */
export function addProjectDelayUrgentApply(query) {
    return fetch({
        url: '/api/pc/projectDelayUrgentApply/addProjectDelayUrgentApply',
        method: 'post',
        data: query
    });
}


/**
 * 订单下的商品
 * @param data
 */
export function listOrderCommodity(data) {
    return fetch({
      url: '/api/pc/projectDelayUrgentApply/listOrderCommodity',
      method: 'get',
      params: data
    });
  }


/**
 * 审核列表
 * @param data
 */
export function listProjectDelayUrgentApply(data) {
  return fetch({
    url: '/api/pc/projectDelayUrgentApply/listProjectDelayUrgentApply',
    method: 'get',
    params: data
  });
}


/**
 * 编辑页回显
 * @param data
 */
export function projectDelayUrgentApplyDetails(data) {
	return fetch({
	  url: '/api/pc/projectDelayUrgentApply/projectDelayUrgentApplyDetails',
	  method: 'get',
	  params: data
	});
}



/**
 * 编辑
 * @param data
 */
export function editProjectDelayUrgentApply(query) { 
  return fetch({
      url: '/api/pc/projectDelayUrgentApply/editProjectDelayUrgentApply',
      method: 'put',
      data: query
  });
}



/**
 * 审核
 * @param data
 */
export function editOrderApplyStatus(query) { 
  return fetch({
      url: '/api/pc/projectDelayUrgentApply/editOrderApplyStatus',
      method: 'put',
      data: query
  });
}


/**
 * 审核记录
 * @param data
 */
export function listDiscountAuditLogging(data) {
	return fetch({
	  url: '/api/pc/discountApply/listDiscountAuditLogging',
	  method: 'get',
	  params: data
	});
}