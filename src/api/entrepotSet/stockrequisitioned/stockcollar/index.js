import fetch from 'utils/fetch';
export function listInstallationRecipients(query) { //查询领用列表
  return fetch({
    url: 'api/pc/installationRecipients/listInstallationRecipients',
    method: 'get',
    params: query
  });
}


export function installationRecipientsDetails(query) { //查询领用详情
  return fetch({
    url: 'api/pc/installationRecipients/installationRecipientsDetails',
    method: 'get',
    params: query
  });
}

export function listCommodity(query) { //查询领用详情
  return fetch({
    url: 'api/pc/installationRecipients/listCommodity',
    method: 'get',
    params: query
  });
}

export function addInstallationRecipients(query) { //添加物品领用
  return fetch({
    url: 'api/pc/installationRecipients/addInstallationRecipients',
    method: 'post',
    data: query
  });
}

export function audit(query) { //驳回，审批通过
  return fetch({
    url: 'api/pc/installationRecipients/audit',
    method: 'put',
    data: query
  });
}


export function listCustomerContract(query) { //获取合同号
  return fetch({
    url: 'api/pc/inspectionReportRemake/listCustomerContract',
    method: 'get',
    params: query
  });
}

