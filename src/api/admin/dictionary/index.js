import fetch from 'utils/fetch';

export function page(query) {
  //查询中加入时间戳，防止IE浏览器缓存中取数据问题
  query["datetime"] = (new Date()).valueOf();
  return fetch({
    url: '/api/admin/dict/list',
    method: 'get',
    cache:false,
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/dict',
    method: 'post',
    data: obj
  });
}

export function getObj(query) {
  return fetch({
    url: '/api/admin/dict/page',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/dict/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/dict/' + id,
    method: 'put',
    data: obj
  })
}
