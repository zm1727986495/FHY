import fetch from 'utils/fetch';

/**
 * 获取订单商品列表接口
 * @param data
 */
export function listOrderCommodity(data) {
    return fetch({
        url: '/api/pc/order/listOrderCommodity',
        method: 'get',
        params: data
    });
}

/**
 * 新增—退货退款接口
 * @param data
 */
export function insertOrderChargeBack(data) {
	return fetch({
		url: '/api/pc/chargeBack/insertOrderChargeBack',
		method: 'post',
		data
	});
}


/**
 * 退货订单验证接口
 * @param data
 */
export function verifyOrderCanBack(data) {
    return fetch({
        url: '/api/pc/chargeBack/verifyOrderCanBack',
        method: 'get',
        params: data
    });
}


/**
 * 查询—退货列表接口
 * @param data
 */
export function listOrderChargeBack(data) {
    return fetch({
        url: '/api/pc/chargeBack/listOrderChargeBack',
        method: 'get',
        params: data
    });
}


/**
 * 查询退货详情接口
 * @param data
 */
export function getOrderChargeBack(data) {
    return fetch({
        url: '/api/pc/chargeBack/getOrderChargeBack',
        method: 'get',
        params: data
    });
}


/**
 * 查询—退货（审核）列表接口
 * @param data
 */
export function listAuditOrderChargeBack(data) {
    return fetch({
        url: '/api/pc/chargeBack/listAuditOrderChargeBack',
        method: 'get',
        params: data
    });
}


/**
 * 删除退货申请
 * @param data
 */
export function deleteOrderChargeBack(query) { 
    return fetch({
        url: '/api/pc/chargeBack/deleteOrderChargeBack',
        method: 'delete',
        data: query
    });
}


/**
 * 查询退货订单审核记录接口
 * @param data
 */
export function listChargeBackAuditRecord(data) {
    return fetch({
        url: '/api/pc/chargeBack/listChargeBackAuditRecord',
        method: 'get',
        params: data
    });
}

/**
 *  退货下单员审核接口
 * @param data
 */
export function auditOrderChargeBack(query) { 
    return fetch({
        url: '/api/pc/chargeBack/auditOrderChargeBack',
        method: 'put',
        data: query
    });
}

/**
 * 退货获取行政部领导接口
 * @param data
 */
export function listChargeBackLeader(data) {
    return fetch({
        url: '/api/pc/chargeBack/listChargeBackLeader',
        method: 'get',
        params: data
    });
}