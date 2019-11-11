import fetch from 'utils/fetch';

export function loginByEmail(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}

export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'get',
    params: { token }
  });
}

export function getInfo(token) {
  return fetch({
    url: '/api/admin/user/front/info',
    method: 'get',
    params: { token }
  });
}

export function getMenus(token) {
  return fetch({
    url: '/api/admin/user/front/menus',
    method: 'get',
    params: { token }
  });
}
//获取上导航栏
export function menusFront(token) {
  return fetch({
    url: 'api/admin/user/front/menusFront',
    method: 'get',
    params: { token }
  });
}
//根据导航栏获取菜单栏
export function menusFrontSon(query) {
  return fetch({
    url: 'api/admin/user/front/menusFrontSon',
    method: 'get',
    params: query
  });
}
/**
 * 获取菜单
 * @method getAllMenus
 */
export function getAllMenus() {
  return fetch({
    url: '/api/admin/user/front/menu/all',
    method: 'get'
  });
}
/**
 * 获取门店集合
 * @method listLoginUserStore
 */
export function listLoginUserStore() {
  return fetch({
    url: 'api/pc/common/listLoginUserStore',
    method: 'get'
  });
}
/**
 * 提交已选择门店
 * 
 */
export function setUpLoginUserStore(obj) {
  return fetch({
    url: 'api/pc/common/setUpLoginUserStore',
    method: 'put',
    data: obj
  });
}