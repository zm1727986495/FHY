import fetch from 'utils/fetch';


export function getReferrerDocument(query) {  //推荐人档案管理列表
    return fetch({
        url: '/api/pc/referrer/getReferrerDocument',
        method: 'get',
        params: query
    });
};

export function recommendedOrderInfo(query) {  //推荐订单详情
    return fetch({
      url: '/api/pc//referrer/recommendedOrderInfo',
      method: 'get',
      params: query
    });
  };