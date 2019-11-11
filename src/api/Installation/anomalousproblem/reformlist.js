import fetch from 'utils/fetch';
export function listStryppedDownInfo(query) { // 获取改制列表
  return fetch({
    url: '/api/pc/stryppedDown/listStryppedDownInfo',
    method: 'get',
    params: query
  });
}


export function editStryppedDownStatus(query) { // 作废
  return fetch({
    url: '/api/pc/stryppedDown/editStryppedDownStatus',
    method: 'put',
    data: query
  });
}

export function stryppedDownDetails(query) { // 获取改制信息回显
  return fetch({
    url: '/api/pc/stryppedDown/stryppedDownDetails',
    method: 'get',
    params: query
  });
}


export function editStryppedDown(query) { // 编辑提交
  return fetch({
    url: '/api/pc/stryppedDown/editStryppedDown',
    method: 'put',
    data: query
  });
}





