import fetch from 'utils/fetch';

/**
 * 获取部门列表
 * @param {*} data 
 */
export function listServeGroup(data) {
    return fetch({
        url: '/api/pc/serveGroup/listServeGroup',
        method: 'get',
        params: data
    });
}


/**
 * 添加部门
 */
export function addServeGroup(data) {
    return fetch({
        url: '/api/pc/serveGroup/addServeGroup',
        method: 'post',
        data
    });
}


/**
 * 回显部门信息   
 * @param {*} data 
 */
export function serveGroupDetails(data) {
    return fetch({
        url: '/api/pc/serveGroup/serveGroupDetails',
        method: 'get',
        params: data
    });
}
//回显部门人员信息   
export function listServeUser(data) {
    return fetch({
        url: '/api/pc/serveGroup/listServeUser',
        method: 'get',
        params: data
    });
}


/**
 * 删除部门
 * /serveGroup/deleteServeGroup
 */

export function deleteServeGroup(data) {
    return fetch({
        url: '/api/pc/serveGroup/deleteServeGroup',
        method: 'put',
        data
    });
}


/**
 * 添加人员
 */
export function addServeUser(data) {
    return fetch({
        url: '/api/pc/serveGroup/addServeUser',
        method: 'post',
        data
    });
}


/**
 * 删除人员
 * /serveGroup/deleteServeUser
 */
export function deleteServeUser(data) {
    return fetch({
        url: '/api/pc/serveGroup/deleteServeUser',
        method: 'put',
        data
    });
}


/**
 * 设置管理员
 * /serveGroup/editIsAdministrator
 */
export function editIsAdministrator(data) {
    return fetch({
        url: '/api/pc/serveGroup/editIsAdministrator',
        method: 'put',
        data
    });
}




/**
 * 编辑部门
 * /serveGroup/editServeGroup
 */
export function editServeGroup(data) {
    return fetch({
        url: '/api/pc/serveGroup/editServeGroup',
        method: 'put',
        data
    });
}











