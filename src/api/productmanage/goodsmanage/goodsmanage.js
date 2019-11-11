import fetch from 'utils/fetch';
export function listCategory(query) { //获取商品品类
    return fetch({
      url: '/api/pc/common/listCategory',
      method: 'get',
      params: query
    });
}
export function listCommodityByPage(query) { //获取列表数据
    return fetch({
      url: '/api/pc/commodity/listCommodityByPage',
      method: 'get',
      params: query
    });
}

export function addCommodity(query) { //新增商品
  return fetch({
    url: '/api/pc/commodity/addCommodity',
    method: 'post',
    data: query
  });
}

export function listAccessoryImg(query) { //获取列表数据
  return fetch({
    url: '/api/pc/commodity/listAccessoryImg',
    method: 'get',
    params: query
  });
}

export function editAccessoryImg(query) { //设为主图
  return fetch({
    url: '/api/pc/commodity/editAccessoryImg',
    method: 'put',
    data: query
  });
}

export function listCommodityPrice(query) { //获取商品价格列表
  return fetch({
    url: '/api/pc/commodity/listCommodityPrice',
    method: 'get',
    params: query
  });
}

export function listCompanyByAll(query) { //获取公司列表
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
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

export function ListCommodityAttribute(query) { //获取商品属性
  return fetch({
    url: 'api/pc/commodity/ListCommodityAttribute',
    method: 'get',
    params: query
  });
}

export function countCommodity(query) { //获取品类下商品总数
  return fetch({
    url: '/api/pc/commodity/countCommodity',
    method: 'get',
    params: query
  });
}

export function listClassify(query) { //获取商品分类
  return fetch({
    url: '/api/pc/common/listClassify',
    method: 'get',
    params: query
  });
}


export function editStatus(query) { //修改状态
  return fetch({
    url: '/api/pc/commodity/editStatus',
    method: 'put',
    data: query
  });
}

export function editUpperShelf(query) { //上下架
  return fetch({
    url: '/api/pc/commodity/editUpperShelf',
    method: 'put',
    data: query
  });
}

export function getBrand(query) { //查看商品
  return fetch({
    url: '/api/pc/common/getCommodity',
    method: 'get',
    params: query
  });
}


export function editCommodity(query) { //修改商品
  return fetch({
    url: '/api/pc/commodity/editCommodity',
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


export function listPriceStrategy(query) { //查看商品
  return fetch({
    url: '/api/pc/priceStrategy/listPriceStrategy',
    method: 'get',
    params: query
  });
}


export function listBaseDict(query) { //字典
  return fetch({
    url: '/api/pc/common/listBaseDict',
    method: 'get',
    params: query
  });
}


export function listFailImportByPage(query) { //获取导入失败列表
  return fetch({
    url: '/api/pc/commodity/listFailImportByPage',
    method: 'get',
    params: query
  });
}

