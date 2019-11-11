import fetch from 'utils/fetch';
// 返点申请

/**
 * 推荐人
 * @param data
 */
export function listReferrerByPage(data) {
  return fetch({
    url: '/api/pc/referrer/listReferrerByPage',
    method: 'get',
    params: data
  });
}

// 返点回显
export function getReferrer(data) {
    return fetch({
      url: '/api/pc/referrer/getReferrer',
      method: 'get',
      params: data
    });
  }


/**
 * 新增推荐人返点申请
 * @param data
 */
export function addReferrerReturnsApplication(query) {
    return fetch({
        url: '/api/pc/referrer/addReferrerReturnsApplication',
        method: 'post',
        data: query
    });
}

/**
 * 外部推荐返点信息
 * @param data
 */
export function getReferrerInfo(data) {
    return fetch({
        url: '/api/pc/referrer/getReferrerInfo',
        method: 'get',
        params: data
    });
}

/**
 * 修改返点申请
 * @param data
 */
export function editReferrerReturnsApplication(query) { 
    return fetch({
        url: '/api/pc/referrer/editReferrerReturnsApplication',
        method: 'put',
        data: query
    });
}

/**
 * 推荐人返点审核
 * @param data
 */
export function referrerReturnsApplicationAudit(query) { 
    return fetch({
        url: '/api/pc/referrer/referrerReturnsApplicationAudit',
        method: 'put',
        data: query
    });
}


/**
 * 返点审批记录
 * @param data
 */
export function recommendRebatesApplyLog(data) {
    return fetch({
        url: '/api/pc/referrer/recommendRebatesApplyLog',
        method: 'get',
        params: data
    });
}


/**
 * 返点审核列表
 * @param data
 */
export function listRecommendRebatesAudit(data) {
    return fetch({
        url: '/api/pc/referrer/listRecommendRebatesAudit',
        method: 'get',
        params: data
    });
}

/**
 * 返点审批记录2
 * @param data
 */
export function listWorkFlowProcessRecording(data) {
    return fetch({
        url: '/api/pc/orderApply/listWorkFlowProcessRecording',
        method: 'get',
        params: data
    });
}

/**
 * 返点推荐人获取
 * @param data
 */
export function getReferrerDetails(data) {
    return fetch({
        url: '/api/pc/referrer/getReferrerDetails',
        method: 'get',
        params: data
    });
}



