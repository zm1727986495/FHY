import fetch from 'utils/fetch';
export function listProvince(query) { //获取列表数据
    return fetch({
      url: '/api/pc/commodityAttribute/listCommodityAttributeByPage',
      method: 'get',
      params: query
    });
}
export function addCommodityAttribute(obj) { //新增商品属性
    return fetch({
      url: '/api/pc/commodityAttribute/addCommodityAttribute',
      method: 'post',
      data: obj
    });
}
export function IsEnable(obj) { //修改状态
  return fetch({
    url: '/api/pc/common/IsEnable',
    method: 'put',
    data: obj
  });
}

export function getCommodityAttribute(query) { //查看
  return fetch({
    url: '/api/pc/commodityAttribute/getCommodityAttribute',
    method: 'get',
    params: query
  });
}

export function editCommodityAttribute(obj) { //编辑
  return fetch({
    url: '/api/pc/commodityAttribute/editCommodityAttribute',
    method: 'put',
    data: obj
  });
}