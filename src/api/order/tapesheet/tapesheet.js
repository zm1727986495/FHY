/**
 * 带单管理
 */
import fetch from 'utils/fetch';
// 获取带单接单列表
export function listAssistOrder(data) {
  return fetch({
    url: '/api/pc/assistOrder/listAssistOrder',
    method: 'get',
    params: data
  });
}

/**
 * 获取带单详情
 * @param data
 */
export function assistOrderInfo(data) {
  return fetch({
    url: '/api/pc/assistOrder/assistOrderInfo',
    method: 'get',
    params: data
  });
}
/**
 * 获取被推介门店列表
 * @param data
 */
export function recommendedStores() {
  return fetch({
    url: '/api/pc/assistOrder/recommendedStores',
    method: 'get'
  });
}
/**
 * 获取被推介品牌
 * @param data
 */
export function recommendedStoreBrand(data) {
  return fetch({
    url: '/api/pc/assistOrder/recommendedStoreBrand',
    method: 'get',
    params: data
  });
}
/**
 * 获取被推介品类
 * @param data
 */
export function recommendedStoreCategory(data) {
  return fetch({
    url: '/api/pc/assistOrder/recommendedStoreCategory',
    method: 'get',
    params: data
  });
}
/**
 * 新增带单
 * @param data
 */
export function addAssistOrder(data) {
  return fetch({
    url: '/api/pc/assistOrder/addAssistOrder',
    method: 'post',
    data
  });
}
/**
 * 编辑带单
 * @param data
 */
export function editAssistOrderInfo(data) {
  return fetch({
    url: '/api/pc/assistOrder/editAssistOrderInfo',
    method: 'put',
    data
  });
}
/**
 * 获取带单信息
 * @param data
 */
export function getAssistOrderInfo(data) {
  return fetch({
    url: '/api/pc/assistOrder/getAssistOrderInfo',
    method: 'get',
    params: data
  });
}
/**
 * 删除带单
 * @param data
 */
export function deleteAssistOrder(data) {
  return fetch({
    url: '/api/pc/assistOrder/deleteAssistOrder',
    method: 'put',
    data
  });
}
/**
 * 接单并创建订单
 * @param data
 */
export function addAssistAndOrder(data) {
  return fetch({
    url: '/api/pc/assistOrder/addAssistAndOrder',
    method: 'post',
    data
  });
}
/**
 * 拒绝接单
 * @param data
 */
export function refusedAssistOrder(data) {
  return fetch({
    url: '/api/pc/assistOrder/refusedAssistOrder',
    method: 'put',
    data
  });
}
