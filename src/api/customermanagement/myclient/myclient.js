import fetch from 'utils/fetch';
export function listCustomer(query) {  //客流量审批_查询列表
    return fetch({
      url: '/api/pc/storeCustomer/listStoreCustomer',
      method: 'get',
      params: query
    });
  };
  export function listRecommend(query) {  //我的客户TAB_推荐给我列表
    return fetch({
      url: '/api/pc/storeCustomer/listCustomerRecommend',
      method: 'get',
      params: query
    });
  };
  export function receiveStatus(obj) {  //客流量审批_查询列表
    return fetch({
      url: '/api/pc/storeCustomer/updateCustomerReceiveStatus',
      method: 'put',
      data: obj
    });
  };
  export function insertCustomer(obj) {  //新增客户
    return fetch({
      url: '/api/pc/storeCustomer/insertCustomer',
      method: 'post',
      data: obj
    });
  };

  //我的客户模块  ===>>>>    myclient
  export function getCustomerInfo(query) {  //编辑客户_获取客户信息
    return fetch({
      url: '/api/pc/storeCustomer/getStoreCustomerInfo',
      method: 'get',
      params: query
    });
  };

  export function updateCustomerInfo(obj) {  //编辑修改客户信息
    return fetch({
      url: '/api/pc/storeCustomer/updateCustomerInfo',
      method: 'put',
      data: obj
    });
  };



  export function listCustomerDemand(query) {  //客户名称_获取客户需求列表
    return fetch({
      url: '/api/pc/storeCustomer/listCustomerDemand',
      method: 'get',
      params: query
    });
  };
  export function insertCustomerDemand(obj) {  //新增客户需求_提交
    return fetch({
      url: '/api/pc/storeCustomer/insertCustomerDemand',
      method: 'post',
      data: obj
    });
  };


  export function updateCustomerDemand(obj) {  //编辑删除客户需求
    return fetch({
      url: '/api/pc/storeCustomer/updateCustomerDemand',
      method: 'put',
      data: obj
    });
  }; 

  
  
  export function getCustomerDemand(query) {  //编辑客户需求_获取客户需求
    return fetch({
      url: '/api/pc/storeCustomer/getCustomerDemand',
      method: 'get',
      params: query
    });
  };
  
  export function listCustomerRecommend(query) { //我的客户TAB_我推荐客户列表
    return fetch({
      url: '/api/pc/storeCustomer/listCustomerRecommend',
      method: 'get',
      params: query
    });
  };

  export function listOtherStore(query) {  //客户信息_获取其他门店列表
    return fetch({
      url: '/api/pc/storeCustomer/listOtherStore',
      method: 'get',
      params: query
    });
  };  
  export function listCustomerBankCard(query) {  //客户信息_获取银行账号信息列表
    return fetch({
      url: '/api/pc/storeCustomer/listCustomerBankCard',
      method: 'get',
      params: query
    });
  }; 

  export function insertCustomerBankCard(obj) {  //新增银行账号
    return fetch({
      url: '/api/pc/storeCustomer/insertCustomerBankCard',
      method: 'post',
      data: obj
    });
  };   

  export function updateCustomerBankCard(obj) {  //编辑银行账号
    return fetch({
      url: '/api/pc/storeCustomer/updateCustomerBankCard',
      method: 'put',
      data: obj
    });
  };   ///api/pc/storeCustomer/listCustomerAddress

  export function listCustomerAddress(query) {  //客户信息_客户地址
    return fetch({
      url: '/api/pc/storeCustomer/listCustomerAddress',
      method: 'get',
      params: query
    });
  }; 
  export function listFollowRecord(query) {  //客户联系记录_获取列表
    return fetch({
      url: '/api/pc/storeCustomer/listFollowRecord',
      method: 'get',
      params: query
    });
  };
  export function insertFollowRecord(obj) {  //客户联系记录_新增
    return fetch({
      url: '/api/pc/storeCustomer/insertFollowRecord',
      method: 'post',
      data: obj
    });
  };
  export function updateFollowRecord(obj) {  //编辑客户联系
    return fetch({
      url: '/api/pc/storeCustomer/updateFollowRecord',
      method: 'put',
      data: obj
    });
  };

  export function updateCustomerAddress(obj) {  //客户地址_删除
    return fetch({
      url: '/api/pc/storeCustomer/updateCustomerAddress',
      method: 'put',
      data: obj
    });
  };

  export function insertCustomerAddress(obj) {  //客户地址_新增
    return fetch({
      url: '/api/pc/storeCustomer/insertCustomerAddress',
      method: 'post',
      data: obj
    });
  };
  
  export function listTransferOrder(query) {  //客户移交_获取订单信息    
    return fetch({
      url: '/api/pc/storeCustomer/listTransferOrder',
      method: 'get',
      params: query
    });
  };  


  export function insertTransferCustomerContent(obj) {  //客户移交_保存、提交
    return fetch({
      url: '/api/pc/storeCustomer/insertTransferCustomerContent',
      method: 'post',
      data: obj
    });
  };
  
  
  
  
  

  //我的客户模块  <<<<<===
