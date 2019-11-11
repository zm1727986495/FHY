import fetch from 'utils/fetch';
export function listPartnerExpenditureListVOByPage(params) {
    return fetch({
      url: '/api/pc/partner/listPartnerExpenditureListVOByPage',
      method: 'get',
      params
    });
};
export function listBaseDict(params) { 
    return fetch({
      url: '/api/pc/common/listBaseDict',
      method: 'get',
      params
    });
};
export function listCompanyByAll(params) { 
    return fetch({
      url: '/api/pc/common/listCompanyByAll',
      method: 'get',
      params
    });
};
export function writeOffPartnerExpenditureList(data) { 
    return fetch({
      url: '/api/pc/partner/writeOffPartnerExpenditureList',
      method: 'put',
      data
    });
};
export function getPartnerExpenditureListVOByPage(params) { 
  return fetch({
    url: '/api/pc/partner/getPartnerExpenditureListVOByPage',
    method: 'get',
    params
  });
};

