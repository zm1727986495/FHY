import fetch from 'utils/fetch';
export function listBuildingMaterialsCityByPage(params) { // 列表
  return fetch({
    url: '/api/pc/buildingMaterialsCity/listBuildingMaterialsCityByPage',
    method: 'get',
    params
  });
}
export function addBuildingMaterialsCity(data) { // 录入收款
  return fetch({
    url: '/api/pc/buildingMaterialsCity/addBuildingMaterialsCity',
    method: 'post',
    data
  });
}
export function listCompanyBankAccountByPage(params) { // 银行卡号
  return fetch({
    url: '/api/pc/financeCollectMoney/listCompanyBankAccount',
    method: 'get',
    params
  });
}
export function editBuildingMaterialsCity(data) {   // 编辑接口
  return fetch({
    url: '/api/pc/buildingMaterialsCity/editBuildingMaterialsCity',
    method: 'put',
    data
  });
}
export function delBuildingMaterialsCity(data) {   // 删除收款单
  return fetch({
    url: '/api/pc/buildingMaterialsCity/delBuildingMaterialsCity',
    method: 'delete',
    data
  });
}
export function listImportDetailsCharges(params) {  // 查询导入费用明细记录
  return fetch({
    url: '/api/pc/buildingMaterialsCity/listImportDetailsCharges',
    method: 'get',
    params
  });
}
export function listImportSettlementDetails(params) {  // 查询导入结算明细记录
  return fetch({
    url: '/api/pc/buildingMaterialsCity/listImportSettlementDetails',
    method: 'get',
    params
  });
}
export function getBuildingMaterialsCity(params) {  // 查看建材城及家装收款
  return fetch({
    url: '/api/pc/buildingMaterialsCity/getBuildingMaterialsCity',
    method: 'get',
    params
  });
}
export function importSettlementDetails(params) {  // 上传
  return fetch({
    url: '/api/pc/buildingMaterialsCity/importSettlementDetails',
    method: 'get',
    params
  });
}
export function listSettlementImportTemplate(params) { // 获取下载模板列表
  return fetch({
    url: '/api/pc/partner/listSettlementImportTemplate',
    method: 'get',
    params
  });
}
export function addDetailsCharges(data) { // 新增费用明细
  return fetch({
    url: '/api/pc/buildingMaterialsCity/addDetailsCharges',
    method: 'post',
    data
  });
}
export function listBmcCostDetailedByPage(params) { // 获取导入明细列表
  return fetch({
    url: '/api/pc/buildingMaterialsCity/listBmcCostDetailedByPage',
    method: 'get',
    params
  });
}
export function delImportDetailsCharges(data) { // 删除导入费用明细
  return fetch({
    url: '/api/pc/buildingMaterialsCity/delImportDetailsCharges',
    method: 'delete',
    data
  });
}
export function listSettlementDetails(params) { // 查询结算明细记录
  return fetch({
    url: '/api/pc/buildingMaterialsCity/listSettlementDetails',
    method: 'get',
    params
  });
}
export function delImportSettlementDetails(data) { // 删除结算明细记录
  return fetch({
    url: '/api/pc/buildingMaterialsCity/delImportSettlementDetails',
    method: 'delete',
    data
  });
}
export function submissionReceivables(data) { // 保存提交结算单
  return fetch({
    url: '/api/pc/buildingMaterialsCity/submissionReceivables',
    method: 'post',
    data
  });
}
export function getDetailsCharges(params) { // 保存提交结算单
  return fetch({
    url: '/api/pc/buildingMaterialsCity/getDetailsCharges',
    method: 'get',
    params
  });
}
export function editImportDetailsCharges(data) { // 保存提交结算单
  return fetch({
    url: '/api/pc/buildingMaterialsCity/editImportDetailsCharges',
    method: 'put',
    data
  });
}

export function listCompanyByService(params) { // 公司
  return fetch({
    url: 'api/pc/common/listCompanyByService',
    method: 'get',
    params
  });
}

export function listStoreByService(params) { // 公司
  return fetch({
    url: 'api/pc/common/listStoreByService',
    method: 'get',
    params
  });
}
export function getSumAmount(params) { // 公司
  return fetch({
    url: 'api/pc/buildingMaterialsCity/getSumAmount',
    method: 'get',
    params
  });
}




