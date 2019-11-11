import fetch from 'utils/fetch';
export function listBmcBatchVOByPage(params) { 
    return fetch({
      url: '/api/pc/partner/listBmcBatchVOByPage',
      method: 'get',
      params
    });
};
export function deleteBmcBatch(data) { 
    return fetch({
      url: '/api/pc/partner/deleteBmcBatch',
      method: 'put',
      data
    });
};
export function importSettlementDetails(params) { 
  return fetch({
    url: '/api/pc/partner/importSettlementDetails',
    method: 'get',
    params
  });
};
export function listSettlementImportTemplate(params) { 
  return fetch({
    url: '/api/pc/partner/listSettlementImportTemplate',
    method: 'get',
    params
  });
};
export function getBmcBatchVO(params) { 
  return fetch({
    url: '/api/pc/partner/getBmcBatchVO',
    method: 'get',
    params
  });
};
export function submissionReceivables(data) { 
  return fetch({
    url: '/api/pc/partner/submissionReceivables',
    method: 'post',
    data
  });
};
export function choiceBmcSettlement(data) { 
  return fetch({
    url: '/api/pc/buildingMaterialsCity/choiceBmcSettlement',
    method: 'post',
    data
  });
};
export function deleteBmcSettlementDetailed(data) { 
  return fetch({
    url: '/api/pc/partner/deleteBmcSettlementDetailed',
    method: 'delete',
    data
  });
};
export function listBmcBatch(params) { 
  return fetch({
    url: '/api/pc/buildingMaterialsCity/listBmcBatch',
    method: 'get',
    params
  });
};
export function listCompanyByService(params) { // 公司
  return fetch({
    url: 'api/pc/common/listCompanyByService',
    method: 'get',
    params
  });
}

export function listStoreByService(params) { // 门店
  return fetch({
    url: 'api/pc/common/listStoreByService',
    method: 'get',
    params
  });
}

// export function downloadSettlementDetails(data) { 
//   return fetch({
//     url: '/api/pc/buildingMaterialsCity/downloadSettlementDetails',
//     method: 'head',
//     data
//   });
// };

