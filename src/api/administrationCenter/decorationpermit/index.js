// 家装代收合同申请

import fetch from 'utils/fetch';

/**
 * 添加
 * @param data
 */
export function addHomeCollectionApply(query) {
    return fetch({
      url: '/api/pc/homeCollectionApply/addHomeCollectionApply',
      method: 'post',
      data: query
    });
}

/**
 * 编辑开票申请
 * @param data
 */
export function editHomeCollectionApply(query) { 
    return fetch({
      url: '/api/pc/homeCollectionApply/editHomeCollectionApply',
      method: 'put',
      data: query
    });
  }

/**
 * 审核回显
 * @param data
 */
export function homeCollectionApplyDetail(data) {
    return fetch({
        url: '/api/pc/homeCollectionApply/homeCollectionApplyDetail',
        method: 'get',
        params: data
    });
}

/**
 * 审核
 * @param data
 */
export function editAuditStatus(query) { 
    return fetch({
        url: '/api/pc/homeCollectionApply/editAuditStatus',
        method: 'put',
        data: query
    });
}

/**
 * 审核列表
 * @param data
 */
export function listHomeCollectionApply(data) {
    return fetch({
        url: '/api/pc/homeCollectionApply/listHomeCollectionApply',
        method: 'get',
        params: data
    });
}


/**
 * 家装代收合同订单列表
 * @param data
 */
export function listOrderByHome(data) {
    return fetch({
        url: '/api/pc/homeCollectionApply/listOrderByHome',
        method: 'get',
        params: data
    });
}


/**
 * 家装公司列表
 * @param data
 */
export function listCompanyServe(data) {
    return fetch({
        url: '/api/pc/homeCollectionApply/listCompanyServe',
        method: 'get',
        params: data
    });
}
