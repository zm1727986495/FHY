import fetch from 'utils/fetch';
export function transfersApplyByPage(query) {   //获取所有的待调拨列表  
  return fetch({
    url: "/api/pc/transfers/transfersApplyByPage",
    method: "get",
    params: query
  })
}

export function transfersByPage(query) {        //获取所有的调拨单列表  
  return fetch({
    url: "/api/pc/transfers/transfersByPage",
    method: "get",
    params: query
  })
}

export function checkPurchaseOrder(query) {        //校验采购单是否正在调拨
  return fetch({
    url: "/api/pc/transfers/checkPurchaseOrder",
    method: "get",
    params: query
  })
}

export function listStoragePurchaseOrderByPage(query) {        //订单库存查询列表        
  return fetch({
    url: "/api/pc/storagePurchaseOrder/listStoragePurchaseOrderByPage",
    method: "get",
    params: query
  })
}

export function listTransfersOrderByPage(query) {        //新增调拨列表       
  return fetch({
    url: "/api/pc/transfers/listTransfersOrderByPage",
    method: "get",
    params: query
  })
}


export function getByIdDetails(query) {        //调拨详情       
  return fetch({
    url: "/api/pc/transfers/getById",
    method: "get",
    params: query
  })
}


export function listStockUpGoodsByPage(query) {                //备货库存查询列表
  return fetch({
    url: "/api/pc/stockUpGoods/listStockUpGoodsByPage",
    method: "get",
    params: query
  })
}

export function getStoragePurchaseOrder(query) {             //根据订单id获取订单采购单详情  
  return fetch({
    url: "/api/pc/transfers/getStoragePurchaseOrder",
    method: "get",
    params: query
  })
}

export function getStoragePurchaseOrderByStorage(query) {             //根据订单id和仓库id获取订单采购单详情  
  return fetch({
    url: "/api/pc/transfers/getStoragePurchaseOrderByStorage",
    method: "get",
    params: query
  })
}

export function getStorageList(query) {                       //仓库下拉内容仓库列表查询      
  return fetch({
    url: "/api/pc/storage/getStorageList",
    method: "get",
    params: query
  })
}

export function getStorage(query) {                          //查看仓库详情     
  return fetch({
    url: "/api/pc/storage/getStorage",
    method: "get",
    params: query
  })
}

export function getTransfersApplyOrder(query) {                             //调拨申请id获取调拨申请详情    
  return fetch({
    url: "/api/pc/transfers/getTransfersApplyOrder",
    method: "get",
    params: query
  })
}

export function addTransfersApply(query) {                   //添加调拨申请单
  return fetch({
    url: '/api/pc/transfers/addTransfersApply',
    method: 'post',
    data: query
  });
}

export function addTransfers(query) {                   //生成调拨单
  return fetch({
    url: '/api/pc/transfers/addTransfers',
    method: 'post',
    data: query
  });
}

export function getTransfersById(query) {                   //获取详情商品
  return fetch({
    url: '/api/pc/transfers/getTransfersById',
    method: 'get',
    params: query
  });
}

export function getTransfersOrder(query) {                   //获取详情
  return fetch({
    url: '/api/pc/transfers/getTransfersOrder',
    method: 'get',
    params: query
  });
}

export function listStore(query) {  //获取门店
  return fetch({
    url: '/api/pc/common/listStore',
    method: 'get',
      params: query
  });
};

export function listBrand(query) { //获取品牌
  return fetch({
    url: '/api/pc/common/listBrand',
    method: 'get',
    params: query
  });
}

export function listCategory(query) { //获取品类
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
}









