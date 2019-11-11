import fetch from 'utils/fetch';
/**
 * 获取违规处罚记录
 * @param data
 */
export function listPunishBillByPage(data) {
  return fetch({
    url: '/api/pc/punishBill/listPunishBillByPage',
    method: 'get',
    params: data
  });
}
/**
 * 新增违规处罚
 * @param data
 */
export function insertIllegalBill(data) {
  return fetch({
    url: '/api/pc/illegalBill/insertIllegalBill',
    method: 'post',
    data
  });
}
/**
 * 系统违规单提交
 * @param data(illegalBillId) 违规单ID
 */
export function insertSystemIllegalBill(data) {
  return fetch({
    url: '/api/pc/illegalBill/insertSystemIllegalBill',
    method: 'post',
    data
  });
}
/**
 * 查询—违规处罚列表
 * @param data
 *        orderId
 *        systemDetermine 0非系统，1系统判定
 */
export function listIllegalBillByPage(data) {
  return fetch({
    url: '/api/pc/illegalBill/listIllegalBill',
    method: 'get',
    params: data
  });
}

/**
 * 查看-系统判定违规处罚
 * @param data
 * illegalBillId
 * illegalType 违规类型
 */
export function getIllegalBill(data) {
  return fetch({
    url: '/api/pc/illegalBill/getIllegalBill',
    method: 'get',
    params: data
  });
}

/**
 * 编辑违规处罚
 * @param data
 */
export function updateIllegalBill(data) {
  return fetch({
    url: '/api/pc/illegalBill/updateIllegalBill',
    method: 'put',
    data
  });
}
/**
 * 合同信息查看--合同基本信息
 * @param data
 */
export function getCustomerContract(data) {
  return fetch({
    url: '/api/pc/customerContract/getCustomerContract',
    method: 'get',
    params: data
  });
}
/**
 * 合同信息查看--收退款详情
 * @param data
 */
export function listOrderCollectMoneyDetails(data) {
  return fetch({
    url: '/api/pc/order/listOrderCollectMoneyDetails',
    method: 'get',
    params: data
  });
}
/**
 * 合同信息查看--商品信息
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
 * 合同信息查看-商品信息-房间
 * @param data
 * showType 1 橱柜 其他 房间
 */
export function listOrderCommodityByRoom(data) {
  return fetch({
    url: '/api/pc/order/listOrderCommodityByRoom',
    method: 'get',
    params: data
  });
}
/**
 * 合同信息查看--自有商品
 * @param data
 */
export function listOrderOwnGoods(data) {
  return fetch({
    url: '/api/pc/order/listOrderOwnGoods',
    method: 'get',
    params: data
  });
}
/**
 * 审核—信息审核—采购单列表
 * @param data
 *            customerContractId 合同id
 */
export function listPurchaseOrder(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/listPurchaseOrder',
    method: 'get',
    params: data
  });
}
/**
 * 合同信息查看--订单礼品
 * @param data
 */
export function listOrderGift(data) {
  return fetch({
    url: '/api/pc/order/listOrderGift',
    method: 'get',
    params: data
  });
}

/**
 * 点击加入库取，获取库存情况
 * @param data
 */
export function listStorageCommodity(data) {
  return fetch({
    url: '/api/pc/orderBudget/listStorageCommodity',
    method: 'get',
    params: data
  });
}

/**
 * 加入库取-查询暂扣库存商品详情
 * @param data
 */
export function listWithholdStorageCommodity(data) {
  return fetch({
    url: '/api/pc/orderBudget/listWithholdStorageCommodity',
    method: 'get',
    params: data
  });
}
/**
 * 加入库取-查询样品库存商品详情
 * @param data
 */
export function listSampleStorageCommodity(data) {
  return fetch({
    url: '/api/pc/orderBudget/listSampleStorageCommodity',
    method: 'get',
    params: data
  });
}
/**
 * 加入库取-查询在途商品库存商品详情
 * @param data
 */
export function listTransitStorageCommodity(data) {
  return fetch({
    url: '/api/pc/orderBudget/listTransitStorageCommodity',
    method: 'get',
    params: data
  });
}

/**
 * 查询库取单
 * @param data
 * orderId
 */
export function getLibrariesTake(data) {
  return fetch({
    url: '/api/pc/orderBudget/getLibrariesTake',
    method: 'get',
    params: data
  });
}
/**
 * 取消库取
 * @param data
 * relLibrariesTakeCommodityId 库取单商品关系ID
 * occupyType 占用类型 1 二次可用、可用库存占用库存，2 暂扣占用库存，3 在途可用占用库存，4 样品占用库存
 */
export function cancelLibrariesTake(data) {
  return fetch({
    url: '/api/pc/orderBudget/cancelLibrariesTake',
    method: 'put',
    data
  });
}

/**
 * 保存库取单
 * @param data
 * numberExplain 单号备注
 */
export function saveLibrariesRemarkCode(data) {
  return fetch({
    url: '/api/pc/orderBudget/saveLibrariesRemarkCode',
    method: 'put',
    data
  });
}
/**
 * 库取单执行完成
 * @param data
 * librariesTakeId 库取单id
 */
export function executeLibrariesTake(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/executeLibrariesTake',
    method: 'put',
    data
  });
}
/**
 * 查询是否是主管
 * @param data
 */
export function verifyDirector(data) {
  return fetch({
    url: '/api/pc/customerContract/verifyDirector',
    method: 'get',
    params: data
  });
}
/**
 * 查询—合同审核列表（信息部文员）
 * @param data
 */
export function listCustomerContractByPage(data) {
  return fetch({
    url: '/api/pc/customerContract/listCustomerContractByPage',
    method: 'get',
    params: data
  });
}
/**
 * 导出合同审核列表
 * @param data
 */
export function exportCustomerContract(data) {
  return fetch({
    url: '/api/pc/customerContract/exportCustomerContract',
    method: 'get',
    params: data
  });
}

/**
 * 信息审核-保存采购合同号
 * @param data
 *  purchaseNumber 采购合同号
 *  isStorage 是否入库
 *  isInstall 是否安装
 */
export function insertPurchaseContractCode(data) {
  return fetch({
    url: '/api/pc/customerContract/insertPurchaseContractCode',
    method: 'post',
    data
  });
}

/**
 * 执行完成
 * @param data
 */
export function updatePurchaseOrder(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/updatePurchaseOrder',
    method: 'put',
    data
  });
}

/**
 * 备货单-执行完成
 * @param data
 * purchaseNumber
 */
export function stockUpPurchaseComplete(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/stockUpPurchaseComplete',
    method: 'put',
    data
  });
}
/**
 * 信息审核-拆单
 * @param data
 * orderId 订单ID
 * customerContractId 合同ID（数字类型）
 */
export function splitOrder(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/splitOrder',
    method: 'put',
    data
  });
}

/**
 * 备货-拆单
 * @param data
 * stockUpPurchaseOrderId
 */
export function splitStockUpOrder(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/splitStockUpOrder',
    method: 'put',
    data
  });
}
/**
 * 获取采购合同
 * @param data
 * purchaseOrderId 采购合同ID
 */
export function getPurchaseOrder(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/getPurchaseOrder',
    method: 'get',
    params: data
  });
}

/**
 * 加入库取
 * @param data [{},{}]
 * orderId 订单ID
 * occupyType 占用类型：1 二次可用、可用库存占用库存，2 暂扣占用库存，3 在途可用占用库存，4 样品占用库存
 * commoditySKUId: commoditySKUId
 * storageId 仓库ID
 * num 库取数量
 */
export function insertLibrariesTake(data) {
  return fetch({
    url: '/api/pc/orderBudget/insertLibrariesTake',
    method: 'post',
    data
  });
}

/**
 * 新增采购单
 * @param data
 * customerContractId: 合同编号
 */
export function insertPurchaseOrder(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/insertPurchaseOrder',
    method: 'post',
    data
  });
}

/**
 * 删除采购单
 * @param data
 * purchaseOrderId
 */
export function deletePurchaseOrder(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/deletePurchaseOrder',
    method: 'put',
    data
  });
}
/**
 * 保存采购单商品
 * @param data
 * purchaseOrderId 采购单ID
 * purchaseOrderCommodities 采购单商品
 * purchaseNumber 采购单号
 * smallNumber 小编号
 * isInstall 是否安装
 * isStorage 是否入库
 */
export function insertPurchaseOrderCommodity(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/insertPurchaseOrderCommodity',
    method: 'post',
    data
  });
}

/**
 * 保存采购单号
 * @param data
 */
export function savePurchaseOrderNumber(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/savePurchaseOrderNumber',
    method: 'put',
    data
  });
}

/**
 * 移动采购单商品
 * @param data
 * transferPurchaseOrderId 转移采购单id
 * purchaseOrderCommodities 转移的采购单商品 ({ purchaseOrderCommodityId 转移的采购单商品ID})
 */
export function transferPurchaseOrderCommodity(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/transferPurchaseOrderCommodity',
    method: 'post',
    data
  });
}

/**
 * 删除采购单商品
 * @param data
 * isdelete 1 删除
 * purchaseOrderId 采购单id
 * purchaseOrderCommodityId 采购单商品id
 */
export function updatePurchaseOrderCommodity(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/updatePurchaseOrderCommodity',
    method: 'put',
    data
  });
}

/**
 * 下单完成
 * @param data
 * customerContractId 客户合同号
 */
export function executePass(data) {
  return fetch({
    url: '/api/pc/customerContract/executePass',
    method: 'put',
    data
  });
}
/**
 * 整单驳回
 * @param data
 * customerContractId 客户合同号
 */
export function dismissCustomerContract(data) {
  return fetch({
    url: '/api/pc/customerContract/dismissCustomerContract',
    method: 'put',
    data
  });
}

/**
 * 通过
 * @param data
 * customerContractId 客户合同号
 * auditStatus  1 审核通过 2 图纸驳回
 * drawingAuditStatus 图纸审核状态 1.通过，2.图纸驳回
 */
export function updateCustomerContract(data) {
  return fetch({
    url: '/api/pc/customerContract/updateCustomerContract',
    method: 'put',
    data
  });
}

/**
 * 主管 同意 不同意整单驳回
 * @param data
 * orderId：订单ID
 * auditStatus：审核状态，1，同意，2拒绝
 * customerContractId：合同id
 * auditOpinion：审核意见
 */
export function auditDismissContract(data) {
  return fetch({
    url: '/api/pc/customerContract/auditDismissContract',
    method: 'put',
    data
  });
}
/**
 * 查询合同审核记录
 * @param data
 * customerContractId 合同id
 */
export function listAuditRecord(data) {
  return fetch({
    url: '/api/pc/customerContract/listAuditRecord',
    method: 'get',
    params: data
  });
}

/**
 * 审核记录-合同拆单
 * @param data
 */
export function listContractDecomposition(data) {
  return fetch({
    url: '/api/pc/PurchaseOrder/listContractDecomposition',
    method: 'get',
    params: data
  });
}
/**
 * 审核记录-折扣特批 && 工期加急-（记录）
 * @param data
 * applyType: 申请类型 DISCOUNT_APPLY 折扣特批 URGENT_APPLY 工期加急
 * orderId
 */
export function listDiscountAuditLogging(data) {
  return fetch({
    url: '/api/pc/discountApply/listDiscountAuditLogging',
    method: 'get',
    params: data
  });
}

/**
 * 合同违规审核记录
 * @param data
 */
export function contractAuditRecords(data) {
  return fetch({
    url: '/api/pc/punishBill/contractAuditRecords',
    method: 'get',
    params: data
  });
}
/**
 * 查询备货单信息
 * @param data
 * StockUpPurchaseOrderId 客户合同号
 */
export function getStockUpPurchaseOrder(data) {
  return fetch({
    url: '/api/pc/StockUpPurchaseOrder/getStockUpPurchaseOrder',
    method: 'get',
    params: data
  });
}
