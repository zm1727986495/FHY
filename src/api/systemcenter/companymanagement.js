import fetch from 'utils/fetch';
/**
 * 获取公司列表
 * @param params
 */
export function listCompanyByPage(data) {
  return fetch({
    url: '/api/pc/company/listCompanyByPage',
    method: 'get',
    params: data
  });
}
/**
 * 新增公司
 * @param params
 */
export function addCompany(data) {
  return fetch({
    url: '/api/pc/company/addCompany',
    method: 'post',
    data
  });
}
/**
 * 编辑公司
 * @param params
 */
export function editCompany(data) {
  return fetch({
    url: '/api/pc/company/editCompany',
    method: 'put',
    data
  });
}
/**
 * 删除公司
 * @param id
 */
export function delCompany(data) {
  return fetch({
    url: '/api/pc/company/delCompany',
    method: 'delete',
    data
  });
}
/**
 * 获取公司信息
 * @param params
 */
export function getCompany(data) {
  return fetch({
    url: '/api/pc/company/getCompany',
    method: 'get',
    params: data
  });
}

/**
 * 新增合同
 * @param data
 */
export function addCompanyCooperationContract(data) {
  return fetch({
    url: '/api/pc/company/addCompanyCooperationContract',
    method: 'post',
    data
  });
}
/**
 * 查询模板列表
 * @param data
 */
export function listCompanyTemplate(data) {
  return fetch({
    url: '/api/pc/company/listCompanyTemplate',
    method: 'get',
    params: data
  });
}

/**
 * 新增模板
 * @param data
 */
export function addCompanyTemplate(data) {
  return fetch({
    url: '/api/pc/company/addCompanyTemplate',
    method: 'post',
    data
  });
}
/**
 * 删除模板
 * @param id
 */
export function delCompanyTemplate(data) {
  return fetch({
    url: '/api/pc/company/delCompany',
    method: 'delete',
    data
  });
}
/**
 * 查看模板
 * @param data
 */
export function getCompanyTemplate(data) {
  return fetch({
    url: '/api/pc/company/getCompanyTemplate',
    method: 'get',
    params: data
  });
}
/**
 * 编辑模板
 * @param data
 */
export function editCompanyTemplate(data) {
  return fetch({
    url: '/api/pc/company/editCompanyTemplate',
    method: 'put',
    data
  });
}

/**
 * 获取公司商品信息列表
 * @param data
 */
export function listCommoditySelected(data) {
  return fetch({
    url: '/api/pc/company/listCommoditySelected',
    method: 'get',
    params: data
  });
}
/**
 * 删除商品信息
 * @param data
 */
export function delCompanyCommodity(data) {
  return fetch({
    url: '/api/pc/company/delCompanyCommodity',
    method: 'delete',
    data
  });
}

/**
 * 查看合同
 * @param data
 */
export function getCompanyCooperationContract(data) {
  return fetch({
    url: '/api/pc/company/getCompanyCooperationContract',
    method: 'get',
    params: data
  });
}
/**
 * 查询合同列表
 * @param data
 */
export function listCompanyCooperationContractByAll(data) {
  return fetch({
    url: '/api/pc/company/listCompanyCooperationContractByAll',
    method: 'get',
    params: data
  });
}
/**
 * 编辑合同
 * @param data
 */
export function editCompanyCooperationContract(data) {
  return fetch({
    url: '/api/pc/company/editCompanyCooperationContract',
    method: 'put',
    data
  });
}
/**
 * 获取合同附件列表
 * @param data
 */
export function listCompanyAttachment(data) {
  return fetch({
    url: '/api/pc/company/listCompanyAttachment',
    method: 'get',
    params: data
  });
}

/**
 * 获取公司银行账户列表
 * @param data
 */
export function listCompanyBankAccountByPage(data) {
  return fetch({
    url: '/api/pc/company/listCompanyBankAccountByPage',
    method: 'get',
    params: data
  });
}
/**
 * 新增公司银行账户
 * @param data
 */
export function addCompanyBankAccount(data) {
  return fetch({
    url: '/api/pc/company/addCompanyBankAccount',
    method: 'post',
    data
  });
}
/**
 * 编辑公司银行账户
 * @param data
 */
export function editCompanyBankAccount(data) {
  return fetch({
    url: '/api/pc/company/editCompanyBankAccount',
    method: 'put',
    data
  });
}
/**
 * 删除公司银行账户
 * @param data
 */
export function deleteCompanyBankAccount (data) {
  return fetch({
    url: '/api/pc/company/deleteCompanyBankAccount ',
    method: 'put',
    data
  });
}
