//订单管理页面接口
import fetch from 'utils/fetch';

export function listCustomerContract(query) {  //合同列表
  return fetch({
    url: '/api/pc/customerContract/listCustomerContract',
    method: 'get',
    params: query
  });
};

export function insertContractDetail(obj) {  //合同基本信息保存
  return fetch({
    url: '/api/pc/customerContract/insertContractDetail',
    method: 'post',
    data: obj
  });
};

export function listOrderOwnGoods(query) {  //自有商品列表
  return fetch({
    url: '/api/pc/orderBudget/listOrderOwnGoods',
    method: 'get',
    params: query
  });
};

export function insertOrderBudgetOwnGoods(obj) {  //保存自有商品
  return fetch({
    url: '/api/pc/orderBudget/insertOrderBudgetOwnGoods',
    method: 'post',
    data: obj
  });
};

export function listBaseDict(query) {  //基础字典查询
  return fetch({
    url: '/api/pc/common/listBaseDict',
      method: 'get',
      params: query
  });
};

export function listLibrariesTake(query) {  //查询—库取单列表
  return fetch({
    url: '/api/pc/orderBudget/listLibrariesTake',
      method: 'get',
      params: query
  });
};

export function listOrderBudget(query) {  //选择预算清单
  return fetch({
    url: '/api/pc/orderBudget/listOrderBudget',
      method: 'get',
      params: query
  });
};

export function getDesignAccessory(query) {  //选择设计附件
  return fetch({
    url: '/api/pc/customerContract/getDesignAccessory',
      method: 'get',
      params: query
  });
};

/**
 * 编辑预算清单
 * @method getOrderBudget
 */
export function getOrderBudget(query) {
  return fetch({
    url: '/api/pc/orderBudget/getOrderBudget',
    method: 'get',
    params: query
  });
};

export function getCustomerContract(query) {  // 查询合同基本信息
  return fetch({
    url: '/api/pc/customerContract/getCustomerContract',
    method: 'get',
    params: query
  });
};

export function getPreviewContract(obj) {  // 合同预览接口
  return fetch({
    url: '/api/pc/customerContract/getPreviewContract',
    method: 'post',
    data: obj
  });
};

export function verifyExistContract(query) {  // 验证订单是否存在有效合同接口
  return fetch({
    url: '/api/pc/customerContract/verifyExistContract',
    method: 'get',
    params: query
  });
};

export function signContract(obj) {  // 签署
  return fetch({
    url: '/api/pc/customerContract/signContract',
    method: 'put',
      data: obj
  });
};

export function invalidContract(obj) {  // 合同作废
  return fetch({
    url: '/api/pc/customerContract/invalidContract',
    method: 'put',
      data: obj
  });
};

export function verifyContractIsCanUpdate(query) {  // 
  return fetch({
    url: '/api/pc/customerContract/verifyContractIsCanUpdate',
    method: 'get',
    params: query
  });
};

export function updateContractMoneyRemark(obj) {  // 编辑合同金额备注接口
  return fetch({
    url: '/api/pc/customerContract/updateContractMoneyRemark',
    method: 'put',
    data: obj
  });
};

export function getTimeIsMoney(query) {  // 查询合同、订单接口
  return fetch({
    url: '/api/pc/customerContract/getTimeIsMoney',
    method: 'get',
    params: query
  });
};

export function listServeGroup(query) {  // 查询服务部门接口
  return fetch({
    url: '/api/pc/customerContract/listServeGroup',
    method: 'get',
    params: query
  });
};

export function insertContractAuditFlow(obj) {// 保存合同审单部门接口
  return fetch({
    url: '/api/pc/customerContract/insertContractAuditFlow',
    method: 'post',
    data: obj
  });
};
export function updateContractSettlementStatus(obj) {// 左为民修改合同状态
  return fetch({
    url: '/api/pc/customerContract/updateContractSettlementStatus',
    method: 'put',
    data: obj
  });
};

export function getOrderChargeBack(query) {  // 获取退货Id
  return fetch({
    url: '/api/pc/customerContract/getOrderChargeBack',
    method: 'get',
    params: query
  });
};

export function listPurchaseOrder(query) {  // 查询采购单接口
  return fetch({
    url: '/api/pc/customerContract/listPurchaseOrder',
    method: 'get',
    params: query
  });
};


export function updatePurchaseNumber(obj) {// 修改采购单号接口
  return fetch({
    url: '/api/pc/customerContract/updatePurchaseNumber',
    method: 'put',
    data: obj
  });
};


export function executeQuerySQL(query) {  // 特殊接口
  return fetch({
    url: '/api/pc/customerContract/executeQuerySQL',
    method: 'post',
    data: query
  });
};
