import fetch from 'utils/fetch';
export function getTreeById(query) { // 获取货区货位
  return fetch({
    url: '/api/pc/storageRegion/getTreeById',
    method: 'get',
    params: query
  });
}
