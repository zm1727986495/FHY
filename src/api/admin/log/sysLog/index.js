import fetch from 'utils/fetch';

export function page(query) {
return fetch({
url: '/api/admin/baseSysLog/page',
method: 'get',
params: query
});
}

export function addObj(obj) {
return fetch({
url: '/api/admin/baseSysLog',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/admin/baseSysLog/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/admin/baseSysLog/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/admin/baseSysLog/' + id,
method: 'put',
data: obj
})
}
