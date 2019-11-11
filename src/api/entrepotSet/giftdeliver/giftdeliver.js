import fetch from 'utils/fetch';

export function listStoreGift(query) {        //礼品派送管理列表    
    return fetch({
      url: '/api/pc/giftSend/listStoreGift',
      method: 'get',
      params: query
    });
}

export function listSendCommodity(query) {        //领用礼品详情  
  return fetch({
    url: '/api/pc/giftSend/listSendCommodity',
    method: 'get',
    params: query
  });
}

export function sendGiftDetails(query) {         //礼品派送详情  
  return fetch({
    url: '/api/pc/giftSend/sendGiftDetails',
    method: 'get',
    params: query
  });
}

export function addGiftSend(query) {             //指派派送任务
  return fetch({
    url: '/api/pc/giftSend/addGiftSend',
    method: 'post',
    data: query
  });
}

export function listGiftSend(query) {            //礼品派送任务管理  
  return fetch({
    url: '/api/pc/giftSend/listGiftSend',
    method: 'get',
    params: query
  });
}

export function addReportReamke(data){          //派送汇报  
  return fetch({
    url:"/api/pc/giftSend/addReportReamke",
    method:"put",
    data
  })
}

export function reportRemakeDetails(query) {   //查看派送汇报  
  return fetch({
    url: '/api/pc/giftSend/reportRemakeDetails',
    method: 'get',
    params: query
  });
}

export function giftSendDetails(query) {      //查看派送任务  
  return fetch({
    url: '/api/pc/giftSend/giftSendDetails',
    method: 'get',
    params: query
  });
}


