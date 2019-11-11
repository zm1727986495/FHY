import fetch from 'utils/fetch';
//查询表格
export function page(query) {
    return fetch({
      url: '/api/pc/storage/listStorageByPage',
      method: 'get',
      params: query
    });
}
//新增仓库
export function addStorage(obj) {
    return fetch({
      url: '/api/pc/storage/addStorage',
      method: 'post',
      data: obj
    });
}
//批量删除
export function deleteTable(obj) {
    return fetch({
      url: '/api/pc/storage/deleteAllStorage',
      method: 'delete',
      data: obj
    });
}
//编辑仓库
export function editStorage(obj) {
  return fetch({
    url: '/api/pc/storage/editStorage',
    method: 'put',
    data: obj
  });
}
//
export function getStorage(query) {
  return fetch({
    url: '/api/pc/storage/getStorage',
    method: 'get',
    params: query
  });
}