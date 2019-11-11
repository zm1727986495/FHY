import fetch from 'utils/fetch';
/**
 * 获取活动列表
 * @param data
 */
export function listActivityByPage(data) {
  return fetch({
    url: '/api/pc/activity/listActivityByPage',
    method: 'get',
    params: data
  });
}
/**
 * 查看活动
 * @param data
 */
export function getActivity(data) {
  return fetch({
    url: '/api/pc/activity/getActivity',
    method: 'get',
    params: data
  });
}
/**
 * 复制活动
 * @param data
 */
export function copyActivity(data) {
  return fetch({
    url: '/api/pc/activity/copyActivity',
    method: 'put',
    data
  });
}

/**
 * 删除活动
 * @param data
 */
export function delActivity(data) {
  return fetch({
    url: '/api/pc/activity/delActivity',
    method: 'delete',
    data
  });
}
/**
 * 发布/停用活动
 * @param data
 */
export function editPublish(data) {
  return fetch({
    url: '/api/pc/activity/editPublish',
    method: 'put',
    data
  });
}

/**
 * 新增活动
 * @param data
 */
export function addActivity(data) {
  return fetch({
    url: '/api/pc/activity/addActivity',
    method: 'post',
    data
  });
}
/**
 * 编辑活动
 * @param data
 */
export function editActivity(data) {
  return fetch({
    url: '/api/pc/activity/editActivity',
    method: 'put',
    data
  });
}

/**
 * 获取优惠类型列表
 * @param data
 */
export function listActivityRule(data) {
  return fetch({
    url: '/api/pc/activity/listActivityRule',
    method: 'get',
    params: data
  });
}
/**
 * 获取互斥规则列表
 * @param data
 */
export function getActivityRuleMutex(data) {
  return fetch({
    url: '/api/pc/activity/getActivityRuleMutex',
    method: 'get',
    params: data
  });
}
/**
 * 编辑互斥规则
 * @param data
 */
export function editActivityRuleMutex(data) {
  return fetch({
    url: '/api/pc/activity/editActivityRuleMutex',
    method: 'put',
    data
  });
}

/**
 * 活动规则排序
 * @param data
 */
export function editActivityRuleOrder(data) {
  return fetch({
    url: '/api/pc/activity/editActivityRuleOrder',
    method: 'put',
    data
  });
}
/**
 * 新增修改优惠类型
 * @param data
 */
export function addActivityRule(data) {
  return fetch({
    url: '/api/pc/activity/addActivityRule',
    method: 'post',
    data
  });
}
/**
 * 查看优惠类型
 * @param data
 */
export function getActivityRuleDetails(data) {
  return fetch({
    url: '/api/pc/activity/getActivityRuleDetails',
    method: 'get',
    params: data
  });
}
/**
 * 删除优惠类型
 * @param id
 */
export function delActivityRule(data) {
  return fetch({
    url: '/api/pc/activity/delActivityRule',
    method: 'delete',
    data
  });
}
