import fetch from 'utils/fetch';
export function listBaseDict(params) { 
    return fetch({
      url: '/api/pc/common/listBaseDict',
      method: 'get',
      params
    });
};
export function listPartnerExpenditureListVOByPage(params) { 
    return fetch({
      url: '/api/pc/partner/listPartnerExpenditureListVOByPage',
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
export function addPartnerExpenditureList(data) { 
    return fetch({
      url: '/api/pc/partner/addPartnerExpenditureList',
      method: 'post',
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
export function deletePartnerExpenditureList(data) { 
    return fetch({
      url: '/api/pc/partner/deletePartnerExpenditureList',
      method: 'put',
      data
    });
};
export function commitPartnerExpenditureList(data) { 
    return fetch({
      url: '/api/pc/partner/commitPartnerExpenditureList',
      method: 'put',
      data
    });
};
export function updatePartnerExpenditureList(data) { 
    return fetch({
      url: '/api/pc/partner/updatePartnerExpenditureList',
      method: 'put',
      data
    });
};
export function listCompanyBankAccountByPage(params) { 
  return fetch({
    url: '/api/pc/company/listCompanyBankAccountByPage',
    method: 'get',
    params
  });
};




