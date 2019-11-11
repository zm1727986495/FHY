import fetch from 'utils/fetch';

export function listOrderAssignedMeasureByUser(query) {  //指派测量列表
  return fetch({
    url: '/api/pc/orderAssigned/listOrderAssignedMeasureByUser',
    method: 'get',
    params: query
  });
};

export function getOrderDetailAssignedVO(query) {  //获取订单信息
  return fetch({
    url: '/api/pc/orderAssigned/getOrderDetailAssignedVO',
    method: 'get',
    params: query
  });
};

export function addOrderAssignedMeasure(obj) {  //新增指派单
  return fetch({
    url: '/api/pc/orderAssigned/addOrderAssignedMeasure',
    method: 'post',
    data: obj
  });
};

export function addOrderAssignedAppointment(obj) {  //设计师预约上门
  return fetch({
    url: '/api/pc/orderAssigned/addOrderAssignedAppointment',
    method: 'post',
    data: obj
  });
};


export function editOrderAssignedMeasure(query) {  //新增测量汇报
  return fetch({
    url: '/api/pc/orderAssigned/editOrderAssignedMeasure',
    method: 'put',
    data: query
  });
};

export function editOrderAccessoryDesign(query) {  //新增设计汇报
  return fetch({
    url: '/api/pc/orderAssigned/editOrderAccessoryDesign',
    method: 'put',
    data: query
  });
};

export function listAssigned(query) {  //查看测量汇报
  return fetch({
    url: '/api/pc/orderAssigned/listAssigned',
    method: 'get',
    params: query
  });
};

export function orderAssignedMeasureDetails(query) {  //查看测量汇报
  return fetch({
    url: '/api/pc/orderAssigned/orderAssignedMeasureDetails',
    method: 'get',
    params: query
  });
};


export function listOrganization(query) {  //获取组织机构
  return fetch({
    url: '/api/pc/common/listOrganization',
    method: 'get',
    params: query
  });
};

export function listCustomerAddress(query) {  //客户地址_获取列表
  return fetch({
    url: '/api/pc/storeCustomer/listCustomerAddress',
    method: 'get',
    params: query
  });
};

export function getOrderCustomerAddress(query) {  //获取地址
  return fetch({
    url: '/api/pc/common/getOrderCustomerAddress',
    method: 'get',
    params: query
  });
};



export function listBaseDict(query) {  //获取列表
  return fetch({
    url: '/api/pc/common/listBaseDict',
    method: 'get',
    params: query
  });
};


export function listUserPost(query) {  //员工
  return fetch({
    url: '/api/pc/common/listUserPost',
    method: 'get',
    params: query
  });
};


export function listAppointmentByPage(query) {  //预约时间
  return fetch({
    url: '/api/pc/orderAssigned/listAppointmentByPage',
    method: 'get',
    params: query
  });
};

export function listOrganizationStore(query) {  //获取所属门店
  return fetch({
    url: 'api/pc/common/listOrganizationStore',
    method: 'get',
    params: query
  });
};

export function getDesignerList(query) {  //获取本门店下所有的设计员、测量员、业务员、销售员
  return fetch({
    url: '/api/pc/order/getDesignerList',
    method: 'get',
    params: query
  });
};

export function listCategory(query) {  //获取品类/产品类别列表
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
};


export function editAssignedMeasure(query) {  //接受或者拒绝
  return fetch({
    url: '/api/pc/orderAssigned/editAssignedMeasure',
    method: 'put',
    data: query
  });
};

