import fetch from 'utils/fetch';
/**
 * 借还货列表查询
 * @param data
 */
export function lendingMoneyByPage(data) {
  return fetch({
    url: '/api/pc/lendingMoney/lendingMoneyByPage',
    method: 'get',
    params: data
  });
}
 /**
 * 借货
 * @param data
 */

export function addLendingMoney(data) { 
    return fetch({
        url: '/api/pc/lendingMoney/addLendingMoney',
        method: 'post',
        data
    });
	}


	//获取采购单明细
export function listStoragePurchaseOrderPackageById(data) { 
    return fetch({
        url: '/api/pc/storagePurchaseOrder/listStoragePurchaseOrderPackageById',
        method: 'get',
        params:data
    });
	}
	
	

/**
 * 获取仓库
 * @param data
 */
export function getStorageList(query) { 
	return fetch({
		url: '/api/pc/storage/getStorageList',
		method: 'get',
		params: query
	});
}
/**
 * 获取门店
 * @param data
 */
export function listStore(query) { 
	return fetch({
		url: '/api/pc/common/listStore',
		method: 'get',
		params: query
	});
}
/**
 * 获取门店
 * @param data
 */
export function librariesTakeSingle(query) { 
	return fetch({
		url: '/api/pc/storagePurchaseOrder/librariesTakeSingle',
		method: 'get',
		params: query
	});
}
/**
 * 根据借货id获取借货的商品、包
 * @param data
 */
export function getGooodAndPackageById(query) { 
	return fetch({
		url: '/api/pc/lendingMoney/getGooodAndPackageById',
		method: 'get',
		params: query
	});
}
/**
 * 根据借货id获取借货的信息
 * @param data
 */
export function getById(query) { 
	return fetch({
		url: '/api/pc/lendingMoney/getById',
		method: 'get',
		params: query
	});
}
/**
 * 还货
 * @param data
 */
export function alsoTheGoods(obj) { 
	return fetch({
		url: '/api/pc/lendingMoney/alsoTheGoods',
		method: 'put',
      	data: obj
	});
}