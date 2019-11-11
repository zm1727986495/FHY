import fetch from 'utils/fetch';
/**
 * 赔偿管理列表
 * @param data
 */
export function listDutyCompensation(data) {
  return fetch({
    url: '/api/pc/dutyCompensation/listDutyCompensation',
    method: 'get',
    params: data
  });
}


/**
 * 选择定责单回显信息
 * @param data
 */
export function echoByTaskDutyDetails(data) {
  return fetch({
    url: '/api/pc/dutyCompensation/echoByTaskDutyDetails',
    method: 'get',
    params: data
  });
}

/**
 * 客户银行信息表
 * @param data
 */
export function orderCollectMoneyDetails(data) {
  return fetch({
    url: '/api/pc/dutyCompensation/orderCollectMoneyDetails',
    method: 'get',
    params: data
  });
}

 /**
 * 发起并打印 赔偿
 * @param data
 */

export function addDutyCompensation(data) { 
  return fetch({
      url: '/api/pc/dutyCompensation/addDutyCompensation',
      method: 'post',
      data
  });
}

 /**
 * 上传赔偿单
 * @param data
 */

export function uploadASingle(data) { 
  return fetch({
      url: '/api/pc/dutyCompensation/uploadASingle',
      method: 'post',
      data
  });
}

 /**
 * 编辑
 * @param data
 */

export function editDutyCompensation(query) { // 编辑
  return fetch({
    url: '/api/pc/dutyCompensation/editDutyCompensation',
    method: 'put',
    data: query
  });
}


 /**
 * 修改状态（提交审批，作废,驳回,通过）
 * @param data
 */

export function editDutyCompensationStatus(query) { // 修改状态（提交审批，作废,驳回,通过）
  return fetch({
    url: '/api/pc/dutyCompensation/editDutyCompensationStatus',
    method: 'put',
    data: query
  });
}


/**
 * 查看按钮回显
 * @param data
 */
export function dutyCompensationDeatil(data) {
  return fetch({
    url: '/api/pc/dutyCompensation/dutyCompensationDeatil',
    method: 'get',
    params: data
  });
}


/**
 * 删除附件
 * @param data
 */
export function removeAccessoryImgById(query) {
  return fetch({
    url: '/api/pc/common/removeAccessoryImgById',
    method: 'delete',
    data: query
  });
};