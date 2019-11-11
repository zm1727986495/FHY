import fetch from 'utils/fetch';
// 结算单列表
export function listSettlement(params) { 
    return fetch({
      url: '/api/pc/partner/listSettlement',
      method: 'get',
      params
    });
}
// 获取结算单详情
export function getSettlement(params) { 
    return fetch({
      url: '/api/pc/partner/getSettlement',
      method: 'get',
      params
    });
}
// 对账 对账明细
export function listSettlementComparisonVO(params) { 
    return fetch({
      url: '/api/pc/partner/listSettlementComparisonVO',
      method: 'get',
      params
    });
}
// 对账 已导入结算明细
export function listBmcSettlementDetailedVO(params) { 
    return fetch({
      url: '/api/pc/partner/listBmcSettlementDetailedVO',
      method: 'get',
      params
    });
}
// 对账 已导入费用明细
export function listSettlementDetailedVO(params) { 
    return fetch({
      url: '/api/pc/partner/listSettlementDetailedVO',
      method: 'get',
      params
    });
}
// 对账 应结未接
export function listOrderCollectMoneyByBmcSettlementId(params) { 
    return fetch({
      url: '/api/pc/partner/listOrderCollectMoneyByBmcSettlementId',
      method: 'get',
      params
    });
}

// 编辑结算金额
export function updateOrderCollectMoney(data) { 
  return fetch({
    url: '/api/pc/partner/updateOrderCollectMoney',
    method: 'put',
    data
  });
}

// 转业务确认
export function transferOrderCollectMoney(data) { 
  return fetch({
    url: '/api/pc/partner/transferOrderCollectMoney',
    method: 'put',
    data
  });
}
// 结算单转业务
export function updateSettlementComparison(data) { 
  return fetch({
    url: '/api/pc/partner/updateSettlementComparison',
    method: 'put',
    data
  });
}

// 结算完成
export function completionBmcSettlement(data) { 
  return fetch({
    url: '/api/pc/partner/completionBmcSettlement',
    method: 'put',
    data
  });
}

// 加入到对账单

export function addSettlementComparison(data) { 
  return fetch({
    url: '/api/pc/partner/addSettlementComparison',
    method: 'post',
    data
  });
}
// 金额变更历史记录
export function listRelCollectMoneyHis(params) { 
  return fetch({
    url: '/api/pc/partner/listRelCollectMoneyHis',
    method: 'get',
    params
  });
}
// 对账明细退回
export function returnOrderCollectMoney(data) { 
  return fetch({
    url: '/api/pc/partner/returnOrderCollectMoney',
    method: 'put',
    data
  });
}

// 二次校验
export function secondOrderCollectMoney(data) { 
  return fetch({
    url: '/api/pc/partner/secondOrderCollectMoney',
    method: 'put',
    data
  });
}
export function returnPartnerExpenditureList(data) { 
  return fetch({
    url: '/api/pc/partner/returnPartnerExpenditureList',
    method: 'put',
    data
  });
}
export function writeOffBmcSettlement(data) { 
  return fetch({
    url: '/api/pc/partner/writeOffBmcSettlement',
    method: 'put',
    data
  });
}
export function getBmcSettlementHisVO(params) { 
  return fetch({
    url: '/api/pc/partner/getBmcSettlementHisVO',
    method: 'get',
    params
  });
}
export function deleteBmcSettlement(data) { 
  return fetch({
    url: '/api/pc/partner/deleteBmcSettlement',
    method: 'delete',
    data
  });
}
// 确认
export function editSettlementComparisonIsTrue(data) { 
  return fetch({
    url: '/api/pc/partner/editSettlementComparisonIsTrue',
    method: 'put',
    data
  });
}

