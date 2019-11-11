import fetch from 'utils/fetch';
/**
 * 获取订单收款信息
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
 * 新增申请
 * @param data
 */
export function addOrderApply(query) {
  return fetch({
    url: '/api/pc/orderApply/addOrderApply',
    method: 'post',
    data: query
  });
}

/**
 * 修改申请
 * @param data
 */
export function editOrderReturnMoney(query) { 
  return fetch({
    url: '/api/pc/orderApply/editOrderReturnMoney',
    method: 'put',
    data: query
  });
}

/**
 * 批量审核
 * @param data
 */
export function examineOrderApplyList(query) { 
  return fetch({
    url: '/api/pc/orderApply/examineOrderApplyList',
    method: 'put',
    data: query
  });
}

/**
 * 申请列表
 * @param data
 */
export function listOrderApply(data) {
  return fetch({
    url: '/api/pc/orderApply/listOrderApply',
    method: 'get',
    params: data
  });
}
/**
 * 编辑退款申请
 * @param data
 */
export function editOrderApply(query) { 
  return fetch({
    url: '/api/pc/orderApply/editOrderApply',
    method: 'put',
    data: query
  });
}

/**
 *  获取订单退款信息回显
 * @param data
 */
export function getOrderReturnMoney(data) {
  return fetch({
    url: '/api/pc/orderApply/getOrderReturnMoney',
    method: 'get',
    params: data
  });
}

/**
 * 删除
 * @param data
 */
export function deleteOrderApply(query) { 
  return fetch({
    url: '/api/pc/orderApply/deleteOrderApply',
    method: 'put',
    data: query
  });
}

/**
 *  审核列表
 * @param data
 */
export function listOrderApplyExamineVO(data) {
  return fetch({
    url: '/api/pc/orderApply/listOrderApplyExamineVO',
    method: 'get',
    params: data
  });
}


/**
 *  审核记录弹框
 * @param data
 */
export function examineOrderApply(query) { 
  return fetch({
    url: '/api/pc/orderApply/examineOrderApply',
    method: 'put',
    data: query
  });
}


/**
 *  审核
 * @param data
 */
export function listWorkFlowProcessRecording(query) { 
  return fetch({
    url: '/api/pc/orderApply/listWorkFlowProcessRecording',
    method: 'put',
    data: query
  });
}

/**
 *  订单列表
 * @param data
 */
export function listOrderContract(data) {
  return fetch({
    url: '/api/pc/order/listOrderContract',
    method: 'get',
    params: data
  });
}



/**
 *  订单列表
 * @param data
 */
export function listOrderCollect(data) {
  return fetch({
    url: '/api/pc/order/listOrderCollect',
    method: 'get',
    params: data
  });
}

/**
 *  订单列表2
 * @param data
 */
export function listOrderTransfer(data) {
  return fetch({
    url: '/api/pc/order/listOrderTransfer',
    method: 'get',
    params: data
  });
}



/**
 *  银行信息回显
 * @param data
 */
export function listCustomerBankCardByCustomerId(data) {
  return fetch({
    url: '/api/pc/storeCustomer/listCustomerBankCardByCustomerId',
    method: 'get',
    params: data
  });
}

/**
 *  退款流程状态
 * @param data
 */
export function listApplyWorkFlowProcess(data) {
  return fetch({
    url: '/api/pc/orderApply/listApplyWorkFlowProcess',
    method: 'get',
    params: data
  });
}

/**
 *  取消退款申请
 * @param data
 */
export function cancelOrderApplyList(query) {
  return fetch({
    url: '/api/pc/orderApply/cancelOrderApplyList',
    method: 'put',
    data: query
  });
}


/**
 *  门店
 * @param data
 */
export function recommendedStores(data) {
  return fetch({
    url: '/api/pc/assistOrder/recommendedStores',
    method: 'get',
    params: data
  });
}
