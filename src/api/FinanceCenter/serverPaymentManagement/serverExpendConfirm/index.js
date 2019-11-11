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
export function expenditurePartnerExpenditureList(data) { 
    return fetch({
      url: '/api/pc/partner/expenditurePartnerExpenditureList',
      method: 'put',
      data
    });
};
export function returnPartnerExpenditureList(data) { 
  return fetch({
    url: '/api/pc/partner/returnPartnerExpenditureList',
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

