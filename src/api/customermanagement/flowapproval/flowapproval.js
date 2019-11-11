import fetch from 'utils/fetch';

export function listFlowAudit(query) {  //客流量审批_查询列表
    return fetch({
      url: '/api/pc/storePassenger/listPassengerFlowAudit',
      method: 'get',
      params: query
    });
  };

  export function insertFlowAudit(obj){//门店客流量_通过/退回
    return fetch({
      url: '/api/pc/storePassenger/insertPassengerFlowAudit',
      method: 'post',
      data: obj
    });
  }
