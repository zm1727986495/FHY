import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/user',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'put',
    data: obj
  })
}


export function addUserInfo(data) {
  return fetch({
    url: '/api/admin/user/front/addUserInfo',
    method: 'post',
    data
  })
}
export function getUser(params) {
  return fetch({
    url: '/api/admin/user/front/getUser',
    method: 'get',
    params
  })
}
export function updateUser(data) {
  return fetch({
    url: '/api/admin/user/front/updateUser',
    method: 'put',
    data
  })
}
export function listUser(params) {
  return fetch({
    url: '/api/admin/user/front/listUser',
    method: 'get',
    params
  })
}
export function listUserGroup(params) {
  return fetch({
    url: '/api/admin/user/front/listUserGroup',
    method: 'get',
    params
  })
}

export function deleteUserGroup(data) {
  return fetch({
    url: '/api/admin/user/front/deleteUserGroup',
    method: 'delete',
    data
  })
}
export function listOrganization(params) {
  return fetch({
    url: 'api/pc/common/listOrganization',
    method: 'get',
    params
  })
}
export function editUserInfo(data) {
  return fetch({
    url: 'api/admin/user/front/editUserInfo',
    method: 'put',
    data
  })
}
export function addUserGroup(data) {
  return fetch({
    url: 'api/admin/user/front/addUserGroup',
    method: 'post',
    data
  })
}

export function initUserPassWork(data) {
  return fetch({
    url: 'api/admin/authority/initUserPassWork',
    method: 'put',
    data
  })
}


