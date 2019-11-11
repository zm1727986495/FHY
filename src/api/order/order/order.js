//订单管理页面接口
import fetch from 'utils/fetch';

export function listOrder(query) {  //订单管理列表
  return fetch({
    url: '/api/pc/order/listOrder',
    method: 'get',
    params: query
  });
};

export function listQuestionOrder(query) {  //订单管理列表
  return fetch({
    url: '/api/pc/order/listQuestionOrder',
    method: 'get',
    params: query
  });
};
export function getMenus(token) { // 侧边栏
  return fetch({ 
    url: '/api/admin/user/front/menus',
    method: 'get',
    params: { token }
  });
}
export function listOrderAssigned(query) {  //指派测量列表
  return fetch({
    url: '/api/pc/orderAssigned/listOrderAssigned',
    method: 'get',
    params: query
  });
};

export function addOrder(obj) {  //新增订单
  return fetch({
    url: '/api/pc/order/addOrder',
    method: 'post',
    data: obj
  });
};

export function getOrderInfo(query) {  //编辑订单
  return fetch({
    url: '/api/pc/order/getOrderInfo',
    method: 'get',
    params: query
  });
};

export function listCategory(query) {  //获取品类列表
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
};

export function listBrand(query) {  //获取品牌
  return fetch({
    url: '/api/pc/common/listBrand',
    method: 'get',
    params: query
  });
};

export function editOrder(obj) {  //编辑订单_提交
  return fetch({
    url: '/api/pc/order/editOrder',
      method: 'put',
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

export function listStoreCustomer(query) {  //我的客户TAB_列表查询
  return fetch({
    url: '/api/pc/storeCustomer/listStoreCustomer',
      method: 'get',
      params: query
  });
};

export function listCustomerDemand(query) {  //获取客户需求列表
  return fetch({
    url: '/api/pc/storeCustomer/listCustomerDemand',
      method: 'get',
      params: query
  });
};

export function getCustomerDemand(query) {  //获取客户需求信息
  return fetch({
    url: '/api/pc/storeCustomer/getCustomerDemand',
      method: 'get',
      params: query
  });
};

export function getCustomerByNameOrPhone(query) {  //根据客户姓名或手机号获取客户信息
  return fetch({
    url: 'api/pc/order/getCustomerByNameOrPhone',
      method: 'get',
      params: query
  });
};

export function insertCustomerDemand(obj) {  //新增客户需求
  return fetch({
    url: '/api/pc/storeCustomer/insertCustomerDemand',
    method: 'post',
    data: obj
  });
};

export function insertCustomer(obj) {  //新增客户基本信息
  return fetch({
    url: '/api/pc/storeCustomer/insertCustomer',
    method: 'post',
    data: obj
  });
};

export function getCustomerAddress(query) {  //查询地址信息
  return fetch({
    url: '/api/pc/common/getCustomerAddress',
    method: 'get',
      params: query
  });
};

export function listStore(query) {  //获取门店
  return fetch({
    url: '/api/pc/common/listStore',
    method: 'get',
      params: query
  });
};

export function orderCancel(obj) {  // 订单作废
  return fetch({
    url: '/api/pc/order/orderCancel',
      method: 'put',
      data: obj
  });
};

export function addProblem(obj) {  // 新增问题
  return fetch({
    url: '/api/pc/order/addProblem',
    method: 'post',
    data: obj
  });
};


export function getSalesmanList(query) {  //获取本门店下所有的销售员
  return fetch({
    url: '/api/pc/order/getSalesmanList',
    method: 'get',
    params: query
  });
};

export function getSurveyorList(query) {  //获取本门店下所有的测量员
  return fetch({
    url: '/api/pc/order/getSurveyorList',
    method: 'get',
    params: query
  });
};

export function getDesignerList(query) {  //获取本门店下所有的设计员、销售员
  return fetch({
    url: '/api/pc/order/getDesignerList',
    method: 'get',
    params: query
  });
};
export function orderInvitation(obj) {  // 邀约到店
  return fetch({
    url: '/api/pc/order/orderInvitation',
    method: 'post',
    data: obj
  });
};

export function addAccessory(query) { //新增图片
  return fetch({
    url: '/api/pc/common/addAccessory',
    method: 'post',
    data: query
  });
}

export function accessoryManagement(query) {  //附件管理列表
  return fetch({
    url: '/api/pc/order/accessoryManagement',
    method: 'get',
    params: query
  });
};

export function contractAccessoryManagement(query) {  //附件管理列表
  return fetch({
    url: '/api/pc/order/contractAccessoryManagement',
    method: 'get',
    params: query
  });
};

export function downloadRecordList(query) {  //附件下载记录
  return fetch({
    url: '/api/pc/order/downloadRecordList',
    method: 'get',
    params: query
  });
};

export function removeAccessoryImgById(query) {  //删除附件
  return fetch({
    url: '/api/pc/common/removeAccessoryImgById',
    method: 'delete',
    data: query
  });
};

export function addAccessorys(query) {  //保存附件
  return fetch({
    url: '/api/pc/order/addAccessory',
    method: 'post',
    data: query
  });
};

export function uploadOrderPicture(query) {  //上传下单图
  return fetch({
    url: '/api/pc/order/uploadOrderPicture',
    method: 'post',
    data: query
  });
};

export function insertCustomerAddress(obj) {  // 新增问题
  return fetch({
    url: '/api/pc/storeCustomer/insertCustomerAddress',
    method: 'post',
    data: obj
  });
};

export function orderChangeList(query) {  // 指派弹框的table
  return fetch({
    url: '/api/pc/order/orderChangeList',
    method: 'get',
    params: query
  });
};


export function appointedAgency(obj) {  // 指派业务员、销售员、门店
  return fetch({
    url: '/api/pc/order/appointedAgency',
      method: 'put',
      data: obj
  });
};
export function addInvalidOrderCancel(obj) {  // 新增客增单、补货单、遗留单
  return fetch({
    url: '/api/pc/customerIncreaseOrder/addInvalidOrderCancel',
    method: 'post',
    data: obj
  });
};

export function listOrganizationStore(query) {  // 获取账号下的门店
  return fetch({
    url: '/api/pc/common/listOrganizationStore',
    method: 'get',
    params: query
  });
};

export function changeOrderAddress(obj) {  // 变更订单地址 -- 确定操作按钮
  return fetch({
    url: '/api/pc/order/changeOrderAddress',
      method: 'put',
      data: obj
  });
};

export function getStoreCustomerInfo(query) {  // 获取客户信息
  return fetch({
    url: '/api/pc/storeCustomer/getStoreCustomerInfo',
    method: 'get',
    params: query
  });
};

export function getCustomerInfo(query) {  // 获取客户信息
  return fetch({
    url: '/api/pc/storeCustomer/getStoreCustomerInfo',
    method: 'get',
    params: query
  });
};

export function accessoryTypef(query) {  // 附件类型
  return fetch({
    url: '/api/pc/order/accessoryType',
    method: 'get',
    params: query
  });
};

// export function listBaseDict(query) {  // 加载问题类型
//   return fetch({
//     url: '/api/pc/common/listBaseDict',
//     method: 'get',
//     params: query
//   });
// };
export function orderDetails(query) {  // 订单相关信息
  return fetch({
    url: '/api/pc/order/orderDetails',
    method: 'get',
    params: query
  });
};

export function listInvalidOrder(query) {  // 作废订单列表
  return fetch({
    url: '/api/pc/InvalidOrder/listInvalidOrder',
    method: 'get',
    params: query
  });
};

export function designList(query) {  // 邀约到店 -- 设计图列表
  return fetch({
    url: '/api/pc/order/designList',
    method: 'get',
    params: query
  });
};

export function orderFollowList(query) {  // 订单跟进 -- 订单跟进记录
  return fetch({
    url: '/api/pc/order/orderFollowList',
    method: 'get',
    params: query
  });
};


export function orderFollow(obj) {  // 订单跟进 -- 确定操作按钮
  return fetch({
    url: '/api/pc/order/orderFollow',
    method: 'post',
    data: obj
  });
};

export function orderInvitationList(query) {  // 邀约到店管理列表
  return fetch({
    url: '/api/pc/order/orderInvitationList',
    method: 'get',
    params: query
  });
};

export function fileDownload(obj) {  // 下载附件
  return fetch({
    url: '/api/pc/order/fileDownload',
    method: 'post',
    data: obj
  });
};


export function installMessage(query) {  // 订单详情的首次安装时间
  return fetch({
    url: '/api/pc/designateInstallation/installMessage',
    method: 'get',
    params: query
  });
};

/**
 * 预算清单
 * @method listOrderBudget
 */
export function listOrderBudget(query) { 
  return fetch({
    url: '/api/pc/orderBudget/listOrderBudget',
    method: 'get',
    params: query
  });
};

export function getStore(query) {  // 获取门店相关信息
  return fetch({
    url: '/api/pc/store/getStore',
    method: 'get',
    params: query
  });
};

export function getUserStore(query) {  // 获取门店
  return fetch({
    url: '/api/pc/storeGiftCollar/getUserStore',
    method: 'get',
    params: query
  });
};

/**
 * 订单来源
 * @param data
 * pid: 0 查询一级
 * pid: 1 4 5 6 7 查询二级
 */
export function listStoreSource(data) {
  return fetch({
    url: '/api/pc/store/listStoreSource',
    method: 'get',
    params: data
  });
}

export function listCompanyByAll(query) {  // 渠道商
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
    method: 'get',
    params: query
  });
};

export function getOrderCommodityInfo(query) {  // 回显补货单/遗留单信息
  return fetch({
    url: '/api/pc/customerIncreaseOrder/getOrderCommodityInfo',
    method: 'get',
    params: query
  });
};

export function editInvalidOrder(obj) {  // 修改补货单/遗留单信息
  return fetch({
    url: '/api/pc/customerIncreaseOrder/editInvalidOrder',
    method: 'put',
    data: obj
  });
};

export function submitOrder(obj) {  // 提交补货单/遗留单
  return fetch({
    url: '/api/pc/customerIncreaseOrder/submitOrder',
    method: 'post',
    data: obj
  });
};

export function listOrderLibrarySample(query) {  // 销售出库/回库接口
  return fetch({
    url: '/api/pc/order/listOrderLibrarySample',
    method: 'get',
    params: query
  });
};

export function insertInstallOutStorage(obj) {  // 样品出库接口
  return fetch({
    url: '/api/pc/order/insertInstallOutStorage',
    method: 'post',
    data: obj
  });
};

export function insertInstallInStorage(obj) {  // 样品回库接口
  return fetch({
    url: '/api/pc/order/insertInstallInStorage',
    method: 'post',
    data: obj
  });
};

export function getCustomerContractInfo(query) {  // 查询客户合同号
  return fetch({
    url: '/api/pc/customerIncreaseOrder/getCustomerContractInfo',
    method: 'get',
    params: query
  });
};

export function listPurchaseOrder(query) {  // 正单下的采购单
  return fetch({
    url: '/api/pc/PurchaseOrder/listPurchaseOrder',
    method: 'get',
    params: query
  });
};

export function addLegacyOfSingleOrder(obj) {  // 新增遗留单/补货单
  return fetch({
    url: '/api/pc/customerIncreaseOrder/addLegacyOfSingleOrder',
    method: 'post',
    data: obj
  });
};

export function getPurchaseOrder(query) {  // 采购单明细
  return fetch({
    url: '/api/pc/PurchaseOrder/getPurchaseOrder',
    method: 'get',
    params: query
  });
};


export function getLegacyOfSingleOrderInfo(query) {  // 遗留单/补货单回显
  return fetch({
    url: '/api/pc/customerIncreaseOrder/getLegacyOfSingleOrderInfo',
    method: 'get',
    params: query
  });
};

export function invalidOrderCancel(obj) {  // 修改补货单/遗留单信息
  return fetch({
    url: '/api/pc/customerIncreaseOrder/invalidOrderCancel',
    method: 'put',
    data: obj
  });
};

export function placeOrder(obj) {  // 遗留单/补货单下单
  return fetch({
    url: '/api/pc/customerIncreaseOrder/placeOrder',
    method: 'post',
    data: obj
  });
};

export function getReferrerInfoByPhone(query) {  // 根据推荐人手机号查询推荐人
  return fetch({
    url: '/api/pc/referrer/getReferrerInfoByPhone',
    method: 'get',
    params: query
  });
};

export function addReferrer(obj) {  // 新增外部推荐人
  return fetch({
    url: '/api/pc/referrer/addReferrer',
    method: 'post',
    data: obj
  });
};

export function listOrganizationStaff(query) {  // 获取组织机构人员
  return fetch({
    url: '/api/pc/common/listOrganizationStaff',
    method: 'get',
    params: query
  });
};

export function listCompanyByService(query) {  // 渠道商
  return fetch({
    url: '/api/pc/common/listCompanyByService',
    method: 'get',
    params: query
  });
};

/**
 *  获取门店下和大区下的销售员和业务员
 * @param data
 */
export function listSalesmanPost(query) {  
  return fetch({
    url: '/api/pc/order/listSalesmanPost',
    method: 'get',
    params: query
  });
};