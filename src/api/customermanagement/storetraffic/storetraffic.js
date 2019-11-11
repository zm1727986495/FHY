import fetch from 'utils/fetch';

export function querys(query) {  //门店客流量_查询列表
    return fetch({
      url: '/api/pc/storePassenger/listStorePassengerFlow',
      method: 'get',
      params: query
    });
  };

export function adds(obj){  //门店客流量_新增客流量
  return fetch({
    url: '/api/pc/storePassenger/insertPassengerFlow',
    method: 'post',
    data: obj
  });
}

export function edit(obj){  //编辑门店客流量_查看详情
  return fetch({
    url: '/api/pc/storePassenger/getPassengerFlow', 
    method: 'get',
    params: obj
  });
}

export function EditDeleteRe(obj){  //门店客流量_编辑/删除/重新提交
  return fetch({
    url: '/api/pc/storePassenger/updatePassengerFlow',
    method: 'put',
    data: obj
  });
}