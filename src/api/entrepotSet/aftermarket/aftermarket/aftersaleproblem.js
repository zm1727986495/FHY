import fetch from 'utils/fetch';

export function listQuestionnaire(query) { // 问题单列表
  return fetch({
    url: '/api/pc/questionnaire/listQuestionnaire',
    method: 'get',
    params: query
  });
}

export function addQuestionnaire(data) { // 新增问题
  return fetch({
    url: '/api/pc/questionnaire/addQuestionnaire',
    method: 'post',
    data
  });
}
export function commitQuestionnaire(data) { // 处理问题
  return fetch({
    url: '/api/pc/questionnaire/commitQuestionnaire',
    method: 'post',
    data
  });
}
export function orderDetails(query) { // 选择订单回显
  return fetch({
    url: '/api/pc/questionnaire/orderDetails',
    method: 'get',
    params: query
  });
}

export function listAfterSalesProblemRecord (query) { // 售后问题记录列表
  return fetch({
    url: '/api/pc/questionnaire/listAfterSalesProblemRecord',
    method: 'get',
    params: query
  });
}

export function afterSalesProblemRecordDetails(query) { // 售后问题记录查看详情
  return fetch({
    url: '/api/pc/questionnaire/afterSalesProblemRecordDetails',
    method: 'get',
    params: query
  });
}

/**
 * 售后问题列表导出
 * @param query
 * questionnaireIds '1,2,3'
 */
export function exportQuestionnaire(query) {
  return fetch({
    url: '/api/pc/questionnaire/exportQuestionnaire',
    method: 'get',
    params: query
  });
}

/**
 * 问题描述-处理问题
 * @param data
 */
export function editProblemHandling(data) {
  return fetch({
    url: '/api/pc/questionnaire/editProblemHandling',
    method: 'put',
    data
  });
}

/**
 * 售后问题详情列表
 * @param query
 * 
 */
export function listProcessloggning(query) {
  return fetch({
    url: '/api/pc/questionnaire/listProcessloggning',
    method: 'get',
    params: query
  });
}


