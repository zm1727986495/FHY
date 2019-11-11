import fetch from 'utils/fetch';
/**
 * 查询样品详情
 * @param data
 */
export function getSample(data) {
  return fetch({
    url: '/api/pc/sample/getSample',
    method: 'get',
    params: data
  });
}

/**
 * 获取样品管理列表
 * @param data
 */
export function listSampleByPage(data) {
	return fetch({
		url: '/api/pc/sample/listSampleByPage',
		method: 'get',
		params: data
	});
}

/**
 * 获取门店
 * @param data
 */
export function getStoreList(data) {
	return fetch({
		url: '/api/pc/sample/getStoreList',
		method: 'get',
		params: data
	});
}


/**
 * 获取申请人信息
 * @param data
 */
export function getStoreUser(data) {
	return fetch({
		url: '/api/pc/sample/getStoreUser',
		method: 'get',
		params: data
	});
}


/**
 * 审批人下拉列表
 * @param data
 */
export function sampleReviewer(data) {
	return fetch({
		url: '/api/pc/sample/sampleReviewer',
		method: 'get',
		params: data
	});
}
/**
 * 获取上样清单列表
 * @param data
 */
export function listOrderCommodityByPage(data) {
	return fetch({
		url: '/api/pc/sample/listOrderCommodityByPage',
		method: 'get',
		params: data
	});
}

/**
 * 上样管理的报废
 * @param data
 */
export function cancelSample(data) {
	return fetch({
		url: '/api/pc/sample/cancelSample',
		method: 'put',
		data
	});
}

/**
 * 修改样品
 * @param data
 */
export function editSample(data) {
	return fetch({
		url: '/api/pc/sample/editSample',
		method: 'put',
		data
	});
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


/**
 * 新增撤样
 * @param data
 */
export function addCancelSampleSingle(data) {
	return fetch({
		url: '/api/pc/cancelSampleSingle/addCancelSampleSingle',
		method: 'post',
		data
	});
}


/**
 * SKUId 根据颜色，材质，系列
 * @param data
 */
export function getGoodsSKUId(data) {
	return fetch({
		url: '/api/pc/storeGiftsCollar/getGoodsSKUId',
		method: 'get',
		params: data
	});
}
/**
 * 获取门店商品
 * @param data
 */
export function listCancelCommodity(data) {
	return fetch({
		url: '/api/pc/cancelSampleSingle/listCancelCommodity',
		method: 'get',
		params: data
	});
}

/**
 * 新增上样
 * @param data
 */
export function addSample(data) {
	return fetch({
		url: '/api/pc/sample/addSample',
		method: 'post',
		data
	});
}

/**
 * 获取撤样列表
 * @param data
 */
export function listCancelSampleSingle(data) {
	return fetch({
		url: '/api/pc/cancelSampleSingle/listCancelSampleSingle',
		method: 'get',
		params: data
	});
}



/**
 * 获取撤样详情
 * @param data
 */
export function cancelSampleSingleDetail(data) {
	return fetch({
		url: '/api/pc/cancelSampleSingle/cancelSampleSingleDetail',
		method: 'get',
		params: data
	});
}



/**
 * 作废撤样 提交
 * @param data
 */
export function editCancellationStatus(data) {
	return fetch({
		url: '/api/pc/cancelSampleSingle/editCancellationStatus',
		method: 'post',
		data
	});
}


/**
 * 修改撤样
 * @param data
 */
export function editCancelSampleSingle(data) {
	return fetch({
		url: '/api/pc/cancelSampleSingle/editCancelSampleSingle',
		method: 'put',
		data
	});
}

/**
 * 上样 提交
 * @param data
 */
export function submitSample(data) {
	return fetch({
		url: '/api/pc/sample/submitSample',
		method: 'post',
		data
	});
}


/**
 * 撤样审核
 * @param data
 */
export function auditCancelSampleSingle(data) {
	return fetch({
		url: '/api/pc/cancelSampleSingle/auditCancelSampleSingle',
		method: 'put',
		data
	});
}

/**
 * 上样审核
 * @param data
 */
export function auditSample(data) {
	return fetch({
		url: '/api/pc/sample/auditSample',
		method: 'post',
		data
	});
}