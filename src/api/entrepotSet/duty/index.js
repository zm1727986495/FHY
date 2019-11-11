import fetch from 'utils/fetch';
/**
 * 定责申请日志  定责管理列表展示
 * @param data
 */
export function listTaskDuty(data) {
  return fetch({
    url: '/api/pc/taskDuty/listTaskDuty',
    method: 'get',
    params: data
  });
}

export function listTaskDutyByPage(data) {
  return fetch({
    url: '/api/pc/taskDuty/listTaskDutyByPage',
    method: 'get',
    params: data
  });
}

/**
 * 添加定责
 * @param data
 */
export function addTaskDuty(query) {
  return fetch({
    url: '/api/pc/taskDuty/addTaskDuty',
    method: 'post',
    data: query
  });
}


/**
 * 添加定责回显
 * @param data
 */
export function taskDutyDetails(data) {
  return fetch({
    url: '/api/pc/taskDuty/taskDutyDetails',
    method: 'get',
    params: data
  });
}


/**
 * 添加申诉 and 详情页申诉
 * @param data
 */
export function addAppeal(query) { 
  return fetch({
    url: '/api/pc/taskDuty/addAppeal',
    method: 'put',
    data: query
  });
}


/**
 * 详情回显
 * @param data
 */
export function taskDutyMessage(data) {
  return fetch({
    url: '/api/pc/taskDuty/taskDutyMessage',
    method: 'get',
    params: data
  });
}

/**
 * 申诉管理中编辑时回显接口
 * @param data
 */
export function dutyBaseUserDetails(data) {
  return fetch({
    url: '/api/pc/taskDuty/dutyBaseUserDetails',
    method: 'get',
    params: data
  });
}

 
/**
 * 编辑申诉
 * @param data
 */
export function editDutyBaseUser(query) { 
  return fetch({
    url: '/api/pc/taskDuty/editDutyBaseUser',
    method: 'put',
    data: query
  });
}

/**
 * 详情页列表 and 申诉详情
 * @param data
 */
export function appealDetails(data) {
  return fetch({
    url: '/api/pc/taskDuty/appealDetails',
    method: 'get',
    params: data
  });
}

/**
 * 处罚页列表
 * @param data
 */
export function listTicket(data) {
  return fetch({
    url: '/api/pc/ticket/listTicket',
    method: 'get',
    params: data
  });
}

/**
 * 处罚页回显
 * @param data
 */
export function listDutyUserMessage(data) {
  return fetch({
    url: '/api/pc/ticket/listDutyUserMessage',
    method: 'get',
    params: data
  });
}

/**
 * 添加处罚单
 * @param data
 */
export function addTicket(query) {
  return fetch({
    url: '/api/pc/ticket/addTicket',
    method: 'post',
    data: query
  });
}


/**
 * 处罚页详情回显
 * @param data
 */
export function ticketPeopleDeails(data) {
  return fetch({
    url: '/api/pc/ticket/ticketPeopleDeails',
    method: 'get',
    params: data
  });
}

/**
 * 获取组织人员
 * @param data
 */
export function listOrganizationStaff(data) {
  return fetch({
    url: '/api/pc/common/listOrganizationStaff',
    method: 'get',
    params: data
  });
}

/**
 * 盘点订单列表
 * @param data
 */
export function listBlitem(data) {
  return fetch({
    url: '/api/pc/blitem/listBlitem',
    method: 'get',
    params: data
  });
}


export function listOrderChargeBack(data) { //定责 暂扣查看商品
  return fetch({
    url: '/api/pc/taskDuty/listOrderChargeBack',
    method: 'get',
    params: data
  });
}