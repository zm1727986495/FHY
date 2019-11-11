import fetch from 'utils/fetch';
export function listClassify(query) { //获取列表数据
    return fetch({
      url: '/api/pc/classify/listClassify',
      method: 'get',
      params: query
    });
}
export function listCategory(query) { //获取品类列表
    return fetch({
      url: '/api/pc/common/listCategory',
      method: 'get',
      params: query
    });
}
export function listSublevel(query) { //获取子级分类列表
  return fetch({
    url: '/api/pc/classify/listSublevelClassify',
    method: 'get',
    params: query
  });
}
export function addClassify(obj) { //获取子级分类列表
  return fetch({
    url: '/api/pc/classify/addClassify',
    method: 'post',
    data: obj
  });
}
export function editClassify(obj) { //修改分类
  return fetch({
    url: '/api/pc/classify/editClassify',
    method: 'put',
    data: obj
  });
}
export function getClassify(query) { //查看分类
  return fetch({
    url: '/api/pc/classify/getClassify',
    method: 'get',
    params: query
  });
}

export function IsEnable(obj) { //修改分类
  return fetch({
    url: '/api/pc/common/IsEnable',
    method: 'put',
    data: obj
  });
}