import fetch from 'utils/fetch';
export function querys(query) {  //品牌管理获取列表信息接口
    return fetch({
      url: '/api/pc/product/listProductByPage',
      method: 'get',
      params: query
    });
};
export function addProduct(obj) {  //新增产品
    return fetch({
      url: '/api/pc/product/addProduct',
      method: 'post',
      data: obj
    });
};
export function listCommodity(query) { //产品管理：获取产品商家数量
  return fetch({
    url: '/api/pc/common/listCommodity',
    method: 'get',
    params: query
  });
};
export function editStatus(obj) { //品牌管理修改状态
  return fetch({
    url: '/api/pc/product/editStatus',
    method: 'put',
    data: obj
  });
};
export function editUpper(obj) { //品牌管理修改状态
  return fetch({
    url: '/api/pc/product/editUpperShelf',
    method: 'put',
    data: obj
  });
};
export function countProduct(query) { //品牌管理修改状态
  return fetch({
    url: '/api/pc/product/countProduct',
    method: 'get',
    params: query
  });
};
export function removes(obj) { //删除商品
  return fetch({
    url: '/api/pc/product/removeProductCommodity',
    method: 'delete',
    data: obj
  });
};

export function querysCommodity(query) {  //品牌管理获取列表信息接口
  return fetch({
    url: '/api/pc/product/listProductCommodityByPage',
    method: 'get',
    params: query
  });
};

export function listCommodityByPage(query) {  //商品查询
  return fetch({
    url: '/api/pc/commodity/listCommodityByPage',
    method: 'get',
    params: query
  });
};

export function addProductCommodity(query) {  //新增产品下的商品
  return fetch({
    url: '/api/pc/product/addProductCommodity',
    method: 'post',
    data: query
  });
};

export function editAccessoryImg(query) {  //新增产品下的商品
  return fetch({
    url: '/api/pc/common/editAccessoryImg',
    method: 'put',
    data: query
  });
};

export function listAccessoryImg(query) {  //获取商品图片
  return fetch({
    url: '/api/pc/common/listAccessoryImg',
    method: 'get',
    params: query
  });
};

export function getFileStream(query) {  //获取图片流
  return fetch({
    url: 'api/auth/service/getFileStream',
    method: 'get',
    params: query
  });
};

export function listCompanyByAll(query) { //获取公司列表
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
    method: 'get',
    params: query
  });
}

export function listClassify(query) { //获取分类
  return fetch({
    url: '/api/pc/common/listClassify',
    method: 'get',
    params: query
  });
}

export function listBrand(query) { //获取品牌
  return fetch({
    url: '/api/pc/common/listBrand',
    method: 'get',
    params: query
  });
}

export function getProduct(query) { //查看产品
  return fetch({
    url: '/api/pc/product/getProduct',
    method: 'get',
    params: query
  });
}

export function editProduct(query) { //修改产品
  return fetch({
    url: '/api/pc/product/editProduct',
    method: 'put',
    data: query
  });
}

export function removeAccessoryImg(query) { //删除图片
  return fetch({
    url: '/api/pc/common/removeAccessoryImg',
    method: 'delete',
    data: query
  });
}

export function addAccessory(query) { //新增图片
  return fetch({
    url: '/api/pc/common/addAccessory',
    method: 'post',
    data: query
  });
}

