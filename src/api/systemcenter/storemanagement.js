import fetch from 'utils/fetch';
/**
 * 获取门店列表
 * @param params
 */
export function listStore(data) {
  return fetch({
    url: '/api/pc/store/listStore',
    method: 'get',
    params: data
  });
}
/**
 * 新增门店
 * @param data
 */
export function insertStore(data) {
  return fetch({
    url: '/api/pc/store/insertStore',
    method: 'post',
    data
  });
}
/**
 * 编辑门店
 * @param params
 */
export function updateStore(data) {
  return fetch({
    url: '/api/pc/store/updateStore',
    method: 'put',
    data
  });
}

/**
 * 终止门店
 * @param storeId
 * @param isClose
 */
export function closeStore(data) {
  return fetch({
    url: '/api/pc/store/updateStore',
    method: 'put',
    data
  });
}
/**
 * 获取门店信息
 * @param params
 */
export function getStore(data) {
  return fetch({
    url: '/api/pc/store/getStore',
    method: 'get',
    params: data
  });
}
/**
 * 获取所有人员信息
 * @param data
 */
export function listUserInfo(data) {
  return fetch({
    url: '/api/pc/store/listUserInfo',
    method: 'get',
    params: data
  });
}

/**
 * 获取门店人员信息
 * @param data
 */
export function listStoreUserInfo(data) {
  return fetch({
    url: '/api/pc/store/listStoreUserInfo',
    method: 'get',
    params: data
  });
}
/**
 * 新增人员
 * @param data
 */
export function insertStoreUser(data) {
  return fetch({
    url: '/api/pc/store/insertStoreUser',
    method: 'post',
    data
  });
}
/**
 * 删除人员
 * @param data
 */
export function deleteStoreUser(data) {
  return fetch({
    url: '/api/pc/store/deleteStoreUser',
    method: 'put',
    data
  });
}
/**
 * 设为店长
 * @param data
 */
export function updateStoreUser(data) {
  return fetch({
    url: '/api/pc/store/updateStoreUser',
    method: 'put',
    data
  });
}

/**
 * 订单来源
 * @param data
 * pid: 0 查询一级
 * pid: 1 4 5 6 7 查询二级
 */
export function listStoreSource(data) {
  return fetch({
    url: '/api/pc/store/listStoreSource',
    method: 'get',
    params: data
  });
}
