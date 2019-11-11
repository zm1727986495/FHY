import fetch from 'utils/fetch';
/**
 * 获取客服回访列表
 * @method listCustomerService
 */
export function listCustomerService(query) { 
  return fetch({
    url: '/api/pc/customerService/listCustomerService',
    method: 'get',
    params: query
  });
};

/**
 * 获取回访跟进记录列表
 * @method listCustomerServiceRecord
 */
export function listCustomerServiceRecord(query) { 
  return fetch({
    url: '/api/pc/customerService/listCustomerServiceRecord',
    method: 'get',
    params: query
  });
};
/**
 * 沟通记录回显
 * @method customerServiceDatails
 */
export function customerServiceDatails(query) { 
  return fetch({
    url: '/api/pc/customerService/customerServiceDatails',
    method: 'get',
    params: query
  });
};

/**
 * 回显评价
 * @method listInstallOrderEvaluate
 */
export function listInstallOrderEvaluate(query) { 
  return fetch({
    url: '/api/pc/customerService/listInstallOrderEvaluate',
    method: 'get',
    params: query
  });
};

/**
 * 修改评价
 * @method editInstallOrderEvaluate
 */
export function editInstallOrderEvaluate(query) { 
  return fetch({
    url: '/api/pc/customerService/editInstallOrderEvaluate',
    method: 'put',
    data: query
  });
};

/**
 * 处理问题
 * @method editCustomerService
 */
export function editCustomerService(query) { 
  return fetch({
    url: '/api/pc/customerService/editCustomerService',
    method: 'put',
    data: query
  });
};

/**
 * 导出
 * @method exportCustomerService
 */
export function exportCustomerService(query) { 
  return fetch({
    url: '/api/pc/customerService/exportCustomerService',
    method: 'get',
    params: query
  });
};

/**
 * 修改评价
 * @param addInstallOrderEvaluate
 */
export function addInstallOrderEvaluate(data) {
  return fetch({
    url: '/api/pc/customerService/addInstallOrderEvaluate',
    method: 'post',
    data
  });
}

/**
 * 添加再约时间
 * @param addCustomerSeviceRecord
 */
export function addCustomerSeviceRecord(data) {
  return fetch({
    url: '/api/pc/customerService/addCustomerSeviceRecord',
    method: 'post',
    data
  });
}


/**
 * 再约时间回显
 * @method exportCustomerService
 */
export function customerServiceRecord(query) { 
  return fetch({
    url: '/api/pc/customerService/customerServiceRecord',
    method: 'get',
    params: query
  });
};
