import fetch from 'utils/fetch';
/**
 * 获取违规单列表
 * @method listIllegalBillByPage
 */
export function listIllegalBillByPage(query) { 
  return fetch({
    url: '/api/pc/illegalBill/listIllegalBillByPage',
    method: 'get',
    params: query
  });
};
/**
 * 生成处罚单
 * @method createPunishBill
 */

export function createPunishBill(obj) { 
  return fetch({
      url: '/api/pc/punishBill/createPunishBill',
      method: 'post',
      data: obj
  });
};


/**
 * 申诉
 * @method addIllegalAllege
 */

export function addIllegalAllege(obj) { 
  return fetch({
      url: '/api/pc/illegalBill/addIllegalAllege',
      method: 'post',
      data: obj
  });
};
/**
 * 违规单下的处罚人
 * @method listIllegalBillByPage
 */
export function listPunishPeople(query) { 
  return fetch({
    url: '/api/pc/punishBill/listPunishPeople',
    method: 'get',
    params: query
  });
};

/**
 * 获取处罚单列表
 * @method listPunishBillByPage
 */
export function listPunishBillByPage(query) { 
  return fetch({
    url: '/api/pc/punishBill/listPunishBillByPage',
    method: 'get',
    params: query
  });
};

/**
 * 查看 -- 责任人输入框回显
 * @method getIllegalBill
 */
export function getIllegalBill(query) { 
  return fetch({
    url: '/api/pc/illegalBill/getIllegalBill',
    method: 'get',
    params: query
  });
};

/**
 * 编辑违规单
 * @method updateIllegalBill
 */
export function updateIllegalBill(query) { 
  return fetch({
    url: '/api/pc/illegalBill/updateIllegalBill',
    method: 'put',
    data: query
  });
};

/**
 * 责任人处理的接受
 * @method acceptPunishment
 */
export function acceptPunishment(query) { 
  return fetch({
    url: '/api/pc/punishBill/acceptPunishment',
    method: 'put',
    data: query
  });
};

/**
 * 判定人处理
 * @method decisionPersonProcessing
 */
export function decisionPersonProcessing(query) { 
  return fetch({
    url: '/api/pc/punishBill/decisionPersonProcessing',
    method: 'put',
    data: query
  });
};
/**
 * 申诉内容回显
 * @method complaintContent
 */
export function complaintContent(query) { 
  return fetch({
    url: '/api/pc/punishBill/complaintContent',
    method: 'get',
    params: query
  });
};


/**
 * 申诉内容
 * @method auditRecords
 */
export function auditRecords(query) { 
  return fetch({
    url: '/api/pc/punishBill/auditRecords',
    method: 'get',
    params: query
  });
};


/**
 * 处罚人员信息
 * @method punishUserInfo
 */
export function punishUserInfo(query) { 
  return fetch({
    url: '/api/pc/punishBill/punishUserInfo',
    method: 'get',
    params: query
  });
};


/**
 * 全部处罚人员信息
 * @method listAllPunishPeople
 */
export function listAllPunishPeople(query) { 
  return fetch({
    url: '/api/pc/punishBill/listAllPunishPeople',
    method: 'get',
    params: query
  });
};