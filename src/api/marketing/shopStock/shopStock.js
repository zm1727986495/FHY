import fetch from 'utils/fetch';
/**
 * 门店库存列表
 * @param data
 * storeId 门店id
 * acceptanceType 类型： 1 样品 2 礼品
 */
export function storeInventorySamplePage(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/storeInventorySamplePage',
    method: 'get',
    params: data
  });
}

/**
 * 共享门店
 * @param data
 * skuGoodsId
 * storeIdList []
 */
export function muestraStore(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/muestraStore',
    method: 'put',
    data
  });
}

/**
 * 根据sku商品id获取共享门店信息
 * @param data
 * skuGoodsId
 */
export function getMuestraStore(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/getMuestraStore',
    method: 'get',
    params: data
  });
}
/**
 * 门店礼品拆件
 * @param data
 */
export function detachable(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/detachable',
    method: 'post',
    data
  });
}

/**
 * 根据sku商品id获取可拆商品信息
 * @param data
 */
export function getcombinationDetachable(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/getcombinationDetachable',
    method: 'get',
    params: data
  });
}

/**
 * 门店验收列表
 * @param data
 */
export function listStoreAcceptance(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/listStoreAcceptance',
    method: 'get',
    params: data
  });
}

/**
 * 根据验收id获取门店待验收商品信息
 * @param data
 */
export function listStoreAcceptanceGoods(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/listStoreAcceptanceGoods',
    method: 'get',
    params: data
  });
}

/**
 * 门店验收
 * @param data
 */
export function storeAcceptanceGoods(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/storeAcceptanceGoods',
    method: 'put',
    data
  });
}

/**
 * 门店验收-转单位
 * @param data
 */
export function turnTheUnit(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/turnTheUnit',
    method: 'put',
    data
  });
}

/**
 * 门店出库列表
 * @param data
 */
export function outboundSamplePage(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/outboundSamplePage',
    method: 'get',
    params: data
  });
}

/**
 * 根据出库单id获取出库商品信息
 * @param data
 * id 单据id
 * type 类型  1 撤样  2 销售
 */
export function getByOutboundOrderId(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/getByOutboundOrderId',
    method: 'get',
    params: data
  });
}
/**
 * 门店出库
 * @param data
 */
export function outboundGoods(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/outboundGoods',
    method: 'post',
    data
  });
}

/**
 * 获取派送记录
 * @param data
 */
export function giftToSend(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/giftToSend',
    method: 'get',
    params: data
  });
}
/**
 * 礼品派送
 * @param data
 */
export function addGiftToSend(data) {
  return fetch({
    url: '/api/pc/storeAcceptance/addGiftToSend',
    method: 'post',
    data
  });
}
