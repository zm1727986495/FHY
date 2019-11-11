import fetch from 'utils/fetch';
export function getOrderMessage(query) { // 获取列表
  return fetch({
    url: '/api/pc/installationOrder/getOrderMessage',
    method: 'get',
    params: query
  });
}


export function listServeGroup(query) { // 获取部门
  return fetch({
    url: '/api/pc/installationOrder/listServeGroup',
    method: 'get',
    params: query
  });
}

export function addInstallation(data) { // 提交
  return fetch({
    url: '/api/pc/installationOrder/addInstallation',
    method: 'post',
    data
  });
}