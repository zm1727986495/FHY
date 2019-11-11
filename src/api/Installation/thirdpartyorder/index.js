//订单管理页面接口
import fetch from 'utils/fetch';

export function listThirdParty(query) {  //第三方订单管理列表
  return fetch({
    url: '/api/pc/thirdParty/listThirdParty',
    method: 'get',
    params: query
  });
};

export function listLoginServeGroup(query) {  //服务选项
  return fetch({
    url: '/api/pc/serveGroup/listLoginServeGroup',
    method: 'get',
    params: query
  });
};

export function editCancellation(obj) {  //第三方订单作废
  return fetch({
    url: '/api/pc/thirdParty/editCancellation',
    method: 'put',
    data: obj
  });
};


export function commitImport(obj) {  //导入
  return fetch({
    url: '/api/pc/thirdParty/commitImport',
    method: 'post',
    data: obj
  });
};

export function addBatchImport(obj) {  //导入
  return fetch({
    url: '/api/pc/thirdParty/addBatchImport',
    method: 'post',
    data: obj
  });
};

export function listImportOrder(query) {  //导入获取列表
  return fetch({
    url: '/api/pc/thirdParty/listImportOrder',
    method: 'get',
    params: query
  });
};



export function thirdPartyDetails(query) {  //第三方订单编辑回显
  return fetch({
    url: '/api/pc/thirdParty/thirdPartyDetails',
    method: 'get',
    params: query
  });
};

export function editThirdParty(obj) {  //第三方订单编辑
  return fetch({
    url: '/api/pc/thirdParty/editThirdParty',
    method: 'put',
    data: obj
  });
};

export function addThirdParty(obj) {  //第三方订单新增
  return fetch({
    url: '/api/pc/thirdParty/addThirdParty',
    method: 'post',
    data: obj
  });
};

export function listBrand(query) {  //品牌
  return fetch({
    url: '/api/pc/common/listBrand',
    method: 'get',
    params: query
  });
};

export function listCategory(query) {  //品类
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
};

export function listStorageByLogin(query) {  //获取当前登录人所在大区的仓库集合
  return fetch({
    url: '/api/pc/common/listStorageByLogin',
    method: 'get',
    params: query
  });
};

export function designateGroup(obj) {  //获取当前登录人所在大区的仓库集合
  return fetch({
    url: '/api/pc/thirdParty/designateGroup',
    method: 'post',
    data: obj
  });
};