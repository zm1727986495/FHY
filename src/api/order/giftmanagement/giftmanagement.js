import fetch from 'utils/fetch';

export function listStoreGiftsCollar(query) {  //门店礼品领用列表
  return fetch({
    url: '/api/pc/storeGiftsCollar/listStoreGiftsCollar',
    method: 'get',
    params: query
  });
};


export function insertStoreGiftCollar(obj) {  //新增门店礼品领用申请
  return fetch({
    url: '/api/pc/storeGiftsCollar/insertStoreGiftCollar',
    method: 'post',
    data: obj
  });
};

export function getUserStore(query) {         //获取登录人所属门店
  return fetch({
    url: '/api/pc/storeGiftsCollar/getUserStore',
    method: 'get',
    params: query
  });
};

export function getStoreInventoryNumber(query) {  //门店礼品库存数量查询
  return fetch({
    url: '/api/pc/storeGiftCollar/getStoreInventoryNumber',
    method: 'get',
    params: query
  });
};


export function auditGiftRecipientsInfo(query) {     //获取礼品领用申请详情  回显信息
  return fetch({
    url: '/api/pc/storeGiftsCollar/auditGiftRecipientsInfo',
    method: 'get',
    params: query
  });
};



export function auditRecipients(obj) {  //领用申请审核
  return fetch({
    url: '/api/pc/storeGiftsCollar/auditRecipients',
    method: 'post',
    data: obj
  });
};




export function updateStoreGiftCollarStatus(query) {  //礼品领用申请单撤销
  return fetch({
    url: '/api/pc/storeGiftCollar/updateStoreGiftCollarStatus',
    method: 'put',
    data: query
  });
};

export function listCommodity(query) {       //获取商品列表
  return fetch({
    url: '/api/pc/orderBudget/listCommodity',
    method: 'get',
    params: query
  });
};

export function issueGiftsList(query) {                  //发放礼品列表
  return fetch({
    url: '/api/pc/storeGiftsCollar/issueGiftsList',
    method: 'get',
    params: query
  });
};

export function storeInventorySamplePage(query) {       //赠送礼品页面  添加礼品弹框  门店礼品
  return fetch({
    url: '/api/pc/storeGiftsCollar/storeInventorySamplePage',
    method: 'get',
    params: query
  });
};

export function storeStagingSamplePage(query) {       //赠送礼品页面  添加礼品弹框   仓库礼品  
  return fetch({
    url: '/api/pc/storeGiftsCollar/storeStagingSamplePage',
    method: 'get',
    params: query
  });
};

export function givingGifts(obj) {                //赠送礼品   添加礼品  
  return fetch({
    url: '/api/pc/storeGiftsCollar/givingGifts',
    method: 'post',
    data: obj
  });
};


export function returnGifts(query) {              //礼品领用申请单撤销
  return fetch({
    url: '/api/pc/storeGiftsCollar/returnGifts',
    method: 'put',
    data: query
  });
};






