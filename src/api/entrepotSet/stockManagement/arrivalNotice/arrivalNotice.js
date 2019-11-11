import fetch from 'utils/fetch';
export function listCompanyByAll(query) { //获取供应商
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
    method: 'get',
    params: query
  });
}

export function listBrand(query) { //获取品牌
  return fetch({
    url: '/api/pc/common/listBrand',
    method: 'get',
    params: query
  });
}

export function listCategory(query) { //获取品类
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
}

export function listArrivalNoticeByPage(query) { //查询
  return fetch({
    url: '/api/pc/arrivalNotice/listArrivalNoticeByPage',
    method: 'get',
    params: query
  });
}

export function getStorageList(query) { //获取仓库
  return fetch({
    url: '/api/pc/storage/getStorageList',
    method: 'get',
    params: query
  });
}

export function importArrivalNotice(query) { //导入到货单
  return fetch({
    url: '/api/pc/arrivalNotice/importArrivalNotice',
    method: 'post',
    data: query
  });
}

export function editArrivalNotice(query) { //编辑保存
  return fetch({
    url: '/api/pc/arrivalNotice/editArrivalNotice',
    method: 'put',
    data: query
  });
}
export function submitArrivalNotice(query) { //提交
  return fetch({
    url: '/api/pc/arrivalNotice/submitArrivalNotice',
    method: 'put',
    data: query
  });
}

export function againImportArrivalNotice(query) { //重导入到货单
  return fetch({
    url: '/api/pc/arrivalNotice/againImportArrivalNotice',
    method: 'post',
    data: query
  });
}

export function getById(query) { //到货单信息
  return fetch({
    url: '/api/pc/arrivalNotice/getById',
    method: 'get',
    params: query
  });
}

export function getArrivalNoticeDetailById(query) { //采购合同列表
  return fetch({
    url: '/api/pc/arrivalNotice/getArrivalNoticeDetailById',
    method: 'get',
    params: query
  });
}

export function deleteArrivalNotice(query) { //作废
  return fetch({
    url: '/api/pc/arrivalNotice/deleteArrivalNotice',
    method: 'delete',
    data: query
  });
}

export function listAogByPage(query) { //到货单模板
  return fetch({
    url: '/api/pc/aog/listAogByPage',
    method: 'get',
    params: query
  });
}

export function exportListAogTemplate(query) { //下载模板
  return fetch({
    url: '/api/pc/aog/exportListAogTemplate',
    method: 'get',
    params: query
  });
}

export function getGjGoodsDetailList(query) { //获取顾家列表
  return fetch({
    url: '/api/pc/arrivalNotice/getGjGoodsDetailList',
    method: 'get',
    params: query
  });
}

export function importArrivalNoticeGuJia(query) { //导入顾家
  return fetch({
    url: '/api/pc/arrivalNotice/importArrivalNoticeGuJia',
    method: 'post',
    data: query
  });
}

export function againImportArrivalNoticeGj(query) { //重导入顾家
  return fetch({
    url: '/api/pc/arrivalNotice/againImportArrivalNoticeGj',
    method: 'post',
    data: query
  });
}

export function submitArrivalNoticeGj(query) { //顾家提交
  return fetch({
    url: '/api/pc/arrivalNotice/submitArrivalNoticeGj',
    method: 'put',
    data: query
  });
}


export function editArrivalNoticeGj(query) { //顾家保存
  return fetch({
    url: '/api/pc/arrivalNotice/editArrivalNoticeGj',
    method: 'put',
    data: query
  });
}

export function getByArrivalNoticeCode(query) { //校验到货单编号
  return fetch({
    url: '/api/pc/arrivalNotice/getByArrivalNoticeCode',
    method: 'get',
    params: query
  });
}



export function listArrivalNoticeFailureByPage(query) { //失败列表
  return fetch({
    url: '/api/pc/arrivalNotice/listArrivalNoticeFailureByPage',
    method: 'get',
    params: query
  });
}


export function deleteArrivalNoticeSummary(query) { //删除
  return fetch({
    url: '/api/pc/arrivalNotice/deleteArrivalNoticeSummary',
    method: 'delete',
    data: query
  });
}


export function mergeArrivalNoticeSummary(query) { //合并
  return fetch({
    url: '/api/pc/arrivalNotice/mergeArrivalNoticeSummary',
    method: 'put',
    data: query
  });
}