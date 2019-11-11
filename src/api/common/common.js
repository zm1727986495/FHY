import fetch from 'utils/fetch';
/**
 * 上传文件
 * @param params
 */
export function uploadFile(params) {
  return fetch({
    url: '/api/auth/service/uploadFile',
    method: 'post',
    params
  });
}
/**
 * 获取组织机构
 * @param params
 */
export function listOrganization(params) {
  return fetch({
    url: '/api/pc/common/listOrganization',
    method: 'get',
    params
  });
}

/**
 * 获取公司列表
 */
export function listCompanyByAll(query) {
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
    method: 'get',
    params:query
  });
}

/**
 * 获取品牌列表
 */
export function listBrand() {
  return fetch({
    url: '/api/pc/common/listBrand',
    method: 'get'
  });
}

/**
 * 获取品类列表
 */
export function listCategory() {
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get'
  });
}


/**
 * 获取门店列表有分页
 */
export function listStorePage(data) {
  return fetch({
    url: '/api/pc/common/listStorePage',
    method: 'get',
    params: data
  });
}

/**
 * 获取门店列表无分页
 */
export function listStore(data) {
  return fetch({
    url: '/api/pc/common/listStore',
    method: 'get',
    params: data
  });
}


/**
 * 获取登录人门店  
 */
export function getStoreInfo(data) {
  return fetch({
    url: '/api/pc/common/getStoreInfo',
    method: 'get',
    params: data
  });
}

/**
 * 获取登录人门店列表
 */
export function listStoreByPresent(data) {
  return fetch({
    url: '/api/pc/common/listStoreByPresent',
    method: 'get',
    params: data
  });
}

/**
 * 获取登录人门店列表2
 */
export function listLoginUserStore(data) {
  return fetch({
    url: '/api/pc/common/listLoginUserStore',
    method: 'get',
    params: data
  });
}

/**
 * 根据岗位id获取岗位人员
 */
export function getPostUser(data) {
  return fetch({
    url: '/api/pc/common/getPostUser',
    method: 'get',
    params: data
  });
}



/**
 * 获取门店负责人列表
 */
export function listStoreUser(data) {
  return fetch({
    url: '/api/pc/common/listStoreUser',
    method: 'get',
    params: data
  });
}

/**
 * 下载附件创建A标签
 * @param response
 * @constructor
 */
export function DownloadFile(response) {
  const blob = new Blob([response.data],{ type: 'application/x-xls' });// new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
  const fileName = decodeURI(response.headers['content-disposition'].split('=')[1]);// 下载文件名称
  const elink = document.createElement('a');
  elink.download = fileName.split('.xlsx')[0] + '.xls';
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}


/**
 * 字典
 * @param data
 */
export function listBaseDict(data) {
	return fetch({
		url: '/api/pc/common/listBaseDict',
		method: 'get',
		params: data
	});
}

