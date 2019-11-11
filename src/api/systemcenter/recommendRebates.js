import fetch from 'utils/fetch';
export function listReturnScheme(params) {
    return fetch({
      url: '/api/pc/recommendedReturnPoint/listReturnScheme',
      method: 'get',
      params
    });
}
export function addReturnScheme(data) {
    return fetch({
      url: '/api/pc/recommendedReturnPoint/addReturnScheme',
      method: 'post',
      data
    });
}
export function addReturnRule(data) {
    return fetch({
      url: '/api/pc/recommendedReturnPoint/addReturnRule',
      method: 'post',
      data
    });
}
export function listReturnRule(params) {
    return fetch({
      url: '/api/pc/recommendedReturnPoint/listReturnRule',
      method: 'get',
      params
    });
}
export function getReturnScheme(params) {
  return fetch({
    url: '/api/pc/recommendedReturnPoint/getReturnScheme',
    method: 'get',
    params
  });
}
export function getReturnRule(params) {
  return fetch({
    url: '/api/pc/recommendedReturnPoint/getReturnRule',
    method: 'get',
    params
  });
}
export function delReturnRule(data) {
  return fetch({
    url: '/api/pc/recommendedReturnPoint/delReturnRule',
    method: 'delete',
    data
  });
}



