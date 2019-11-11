import fetch from 'utils/fetch';
export function listStorageWarningStrategyByPage(query) { // 仓库预警策略列表
  return fetch({
    url: '/api/pc/storageWarningStrategy/listStorageWarningStrategyByPage',
    method: 'get',
    params: query
  });
}


export function addStorageWarningStrategy(query) { // 新增
  return fetch({
    url: '/api/pc/storageWarningStrategy/addStorageWarningStrategy',
    method: 'post',
    data: query
  });
}

export function editStorageWarningStrategy(query) { // 编辑
  return fetch({
    url: '/api/pc/storageWarningStrategy/editStorageWarningStrategy',
    method: 'put',
    data: query
  });
}

export function getById(query) { // 编辑回显头部
  return fetch({
    url: '/api/pc/storageWarningStrategy/getById',
    method: 'get',
    params: query
  });
}


export function getStorageList(query) { // 获取仓库
  return fetch({
    url: '/api/pc/storage/getStorageList',
    method: 'get',
    params: query
  });
}

export function getStorageWarningCommodityList(query) { // 编辑回显列表
  return fetch({
    url: '/api/pc/storageWarningStrategy/getStorageWarningCommodityList',
    method: 'get',
    params: query
  });
}

export function deleteAllStorageWarningStrategy(query) { // 批量删除
  return fetch({
    url: '/api/pc/storageWarningStrategy/deleteAllStorageWarningStrategy',
    method: 'delete',
    data: query
  });
}