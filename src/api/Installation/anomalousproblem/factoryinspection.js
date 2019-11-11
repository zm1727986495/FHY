import fetch from 'utils/fetch';
export function listInspectionReportRemake(query) { // 获取查货备注列表
  return fetch({
    url: '/api/pc/inspectionReportRemake/listInspectionReportRemake',
    method: 'get',
    params: query
  });
}

export function exportInspectionReportRemake(query) { // 
  return fetch({
    url: '/api/pc/inspectionReportRemake/exportInspectionReportRemake',
    method: 'get',
    params: query
  });
}

export function InspectionReportRemakeDetails(query) { // 填写备注，采购单信息回显
  return fetch({
    url: '/api/pc/inspectionReportRemake/InspectionReportRemakeDetails',
    method: 'get',
    params: query
  });
}

export function editInspectionReportRemake(obj) { // 填写备注提交
  return fetch({
    url: '/api/pc/inspectionReportRemake/editInspectionReportRemake',
    method: 'post',
    data: obj
  });
}

export function getListById(query) { // 根据到货单模板获取打包信息
  return fetch({
    url: '/api/pc/aogTemplate/getListById',
    method: 'get',
    params: query
  });
}



