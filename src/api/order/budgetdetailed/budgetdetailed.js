import fetch from 'utils/fetch';
/**
 * 获取价格策略
 * @method listPriceStrategy
 */
export function listPriceStrategy(query) { 
  return fetch({
    url: 'api/pc/orderBudget/listPriceStrategy',
    method: 'get',
    params: query
  });
}
/**
 * 获取活动规则
 * @method listActivityRule
 */
export function listActivityRule(query) { 
  return fetch({
    url: 'api/pc/orderBudget/listActivityRule',
    method: 'get',
    params: query
  });
}
/**
 * 获取活动
 * @method listActivity
 */
export function listActivity(query) { 
  return fetch({
    url: 'api/pc/orderBudget/listActivity',
    method: 'get',
    params: query
  });
}
/**
 * 获取活动套餐
 * @method listActivitySetMeal
 */
export function listActivitySetMeal(query) { 
  return fetch({
    url: 'api/pc/orderBudget/listActivitySetMeal',
    method: 'get',
    params: query
  });
}
/**
 * 字典
 * @method listBaseDict
 */
export function listBaseDict(query) {
  return fetch({
    url: '/api/pc/common/listBaseDict',
    method: 'get',
    params: query
  });
}
/**
 * 获取活动套餐
 * @method listCommodityActivityRule
 */
export function listCommodityActivityRule(query) {
  return fetch({
    url: 'api/pc/orderBudget/listCommodityActivityRule',
    method: 'get',
    params: query
  });
}
/**
 * 获取颜色
 * @method listCommodityColour
 */
export function listCommodityColour(query) {
  return fetch({
    url: 'api/pc/commodity/listCommodityColour',
    method: 'get',
    params: query
  });
}
/**
 * 加价购商品
 * @method listPurchaseCommodity
 */
export function listPurchaseCommodity(query) {
  return fetch({
    url: '/api/pc/orderBudget/listPurchaseCommodity',
    method: 'get',
    params: query
  });
}
/**
 * 买赠商品
 * @method listPurchaseCommodity
 */
export function listActivityGift(query) {
  return fetch({
    url: '/api/pc/orderBudget/listActivityGift',
    method: 'get',
    params: query
  });
}
/**
 * 新增预算清单
 * @method insertOrderBudget
 */
export function insertOrderBudget(obj) {
  return fetch({
    url: '/api/pc/orderBudget/insertOrderBudget',
    method: 'post',
    data: obj
  });
}
/**
 * 编辑预算清单
 * @method getOrderBudget
 */
export function getOrderBudget(query) {
  return fetch({
    url: '/api/pc/orderBudget/getOrderBudget',
    method: 'get',
    params: query
  });
}
/**
 * 提交编辑预算清单
 * @method updateOrderBudget
 */
export function updateOrderBudget(obj) {
  return fetch({
    url: '/api/pc/orderBudget/updateOrderBudget',
    method: 'put',
    data: obj
  });
}
/**
 * 查询—选择预算清单
 *@method listOrderBudget
 */
export function listOrderBudget(query) {
  return fetch({
    url: '/api/pc/orderBudget/listOrderBudget',
    method: 'get',
    params: query
  });
}
/**
 * 删除预算清单
 * 
 */
export function deleteOrderBudget(query) {
  return fetch({
    url: '/api/pc/orderBudget/deleteOrderBudget',
    method: 'delete',
    data: query
  });
}
/**
 * 复制预算清单
 * @method copyOrderBudget
 */
export function copyOrderBudget(obj) {
  return fetch({
    url: '/api/pc/orderBudget/copyOrderBudget',
    method: 'put',
    data: obj
  });
}
/**
 * 获取预算清单分类数据结构
 * @method listCommodityByClassify
 */
export function listCommodityByClassify(obj) {
  return fetch({
    url: '/api/pc/orderBudget/listCommodityByClassify',
    method: 'post',
    data: obj
  });
}
/**
 * 查询库存数以及skuid
 * @method getInventoryNumAndSku
 */
export function getInventoryNumAndSku(query) {
  return fetch({
    url: '/api/pc/orderBudget/getInventoryNumAndSku',
    method: 'get',
    params: query
  });
}
/**
 * 查询库存数以及skuid
 * @method getInventoryNumAndSku
 */
export function getActivityDetail(query) {
  return fetch({
    url: '/api/pc/activity/getActivityDetail',
    method: 'get',
    params: query
  });
}
// 组套 app
export function getStackDetail(params) {
  return fetch({
    url: '/api/pc/stack/getStackDetail',
    method: 'get',
    params
  });
}
// 组套 pc
export function listStackDetail(params) {
  return fetch({
    url: '/api/pc/stack/listStackDetail',
    method: 'get',
    params
  });
}
export function saveStackDetail(data) {
  return fetch({
    url: '/api/pc/stack/saveStackDetail ',
    method: 'post',
    data
  });
}
/**
 * 导出清单预览
 * @method exportOrderBudgetCommodity
 */
export function exportOrderBudgetCommodity(obj) {
  return fetch({
    url: '/api/pc/orderBudget/exportOrderBudgetCommodity',
    method: 'put',
    data: obj
  });
}
/**
 * 组套远程搜索接口
 * @method getItemNumber
 */
export function getItemNumber(params) {
  return fetch({
    url: '/api/pc/stack/getItemNumber',
    method: 'get',
    params
  });
}
