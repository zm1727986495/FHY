import fetch from 'utils/fetch';
import $ from 'jquery';
export function baiduMap(lng, lat) {
 return  new Promise(function(resolve, reject){
    $.ajax({
      type : "get",//向后台请求的方式，有post，get两种方法
      url : `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=${lat},${lng}&output=json&pois=1&latest_admin=1&ak=yRWUo5Q8pqlTlbhkU5Bz6xSV2znzY0Vu`,//url填写的是请求的路径
      dataType : 'jsonp',//请求的数据类型
      jsonp:'callback',
      // jsonpCallback:"callback",
      success : function(data) {//请求的返回成功的方
        resolve(data.result);
      },
      error : function(error) {//请求的失败的返回的方法
      }
    });
  })
}
/**
 * 
 * @method  listProvince
 */
export function listProvince(query) { // 获取 省级
  return fetch({
    url: '/api/pc/common/listProvince',
    method: 'get',
    params: query
  });
}

/**
 * 获取 市级
 * @method listCity
 */
export function listCity(query) {
  return fetch({
    url: '/api/pc/common/listCity',
    method: 'get',
    params: query
  });
}
/**
 * 获取 区级
 * @method listAreas
 */
export function listAreas(query) { 
  return fetch({
    url: '/api/pc/common/listAreas',
    method: 'get',
    params: query
  });
}
/**
 * 下载附件
 * @param data
 */
export function fileDownload(data) {
  return fetch({
    url: '/api/auth/service/fileDownload',
    method: 'get',
    params: data
  });
}
/**
 * 获取 品类列表
 * @method listCategory
 */
export function listCategory(query) { 
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
}
/**
 * 获取 机构
 * @method listOrganization 
 */
export function listOrganization(query) {
  return fetch({
    url: '/api/pc/common/listOrganization',
    method: 'get',
    params: query
  });
}
/**
 * 获取 品类品牌
 * @method listBrand 
 */
export function listBrand(query) {
  return fetch({
    url: '/api/pc/common/listBrand',
    method: 'get',
    params: query
  });
}

/**
 * 获取公司列表
 * @param params
 * companyType: 0 全部公司 1 供应商
 */
export function listCompanyByAll(params) {
  return fetch({
    url: '/api/pc/common/listCompanyByAll',
    method: 'get',
    params
  });
}

/**
 * 获取当前品牌品类下的供应商
 * @param params
 * companyType
 * brandId
 * commodityCategoryId
 */
export function listCompanyByParam(params) {
  return fetch({
    url: '/api/pc/common/listCompanyByParam',
    method: 'get',
    params
  });
}
/**
 * 获取门店
 * @method listStore
 */
export function listStore() {
  return fetch({
    url: '/api/pc/common/listStore',
    method: 'get'
  });
}
export function listLoginUserStore() {
  return fetch({
    url: '/api/pc/common/listLoginUserStore',
    method: 'get'
  });
}
/**
 * 获取商品分类
 * @method listClassify
 */
export function listClassify(data) {
  return fetch({
    url: '/api/pc/common/listClassify',
    method: 'get',
    params: data
  });
}
/**
 * 获取组织人员
 * @method listOrganizationStaff
 */
export function listOrganizationStaff(data) {
  return fetch({
    url: '/api/pc/common/listOrganizationStaff',
    method: 'get',
    params: data
  });
}

/**
 * 获取组织人员  有分页
 * @method listUser
 */
export function listUser(data) {
  return fetch({
    url: '/api/pc/serveGroup/listUser',
    method: 'get',
    params: data
  });
}
// 不用组织机构ID
export function listBaseUser(data) {
  return fetch({
    url: '/api/pc/serveGroup/listBaseUser',
    method: 'get',
    params: data
  });
}


/**
 * 上传附件
 * @param data
 */
export function addAccessory(data) {
  return fetch({
    url: '/api/pc/common/addAccessory',
    method: 'post',
    data
  });
}

/**
 * 删除附件
 * @param data
 */
export function removeAccessory(data) {
  return fetch({
    url: '/api/pc/common/removeAccessoryImg',
    method: 'delete',
    data
  });
}
/**
 * 获取价格策略列表
 * @param data
 */
export function listPriceStrategy(data) {
  return fetch({
    url: '/api/pc/common/listPriceStrategy',
    method: 'get',
    params: data
  });
}
/**
 * 获取商品列表
 * @param data
 */
export function listCommodity(data) {
  return fetch({
    url: '/api/pc/orderBudget/listCommodity',
    method: 'get',
    params: data
  });
}
/**
 * 基础字典查询
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
 * 获取订单列表
 * @param data
 */
export function listOrder(data) {
  return fetch({
    url: '/api/pc/order/listOrder',
    method: 'get',
    params: data
  });
}
/**
 * 获取本门店下所有的销售员
 * @param data
 */
export function getSalesmanList(data) {
  return fetch({
    url: '/api/pc/order/getSalesmanList',
    method: 'get',
    params: data
  });
}
/**
 * 获取本门店下所有的设计员、测量员、业务员、销售员
 * @param data Object
 * { dataCode: 'SJY' } 设计员
 * { dataCode: 'CLY' } 测量员
 * { dataCode: 'YWY' } 业务员
 * { dataCode: 'G070' } 销售员
 */
export function getDesignerList(data) {
  return fetch({
    url: '/api/pc/order/getDesignerList',
    method: 'get',
    params: data
  });
}
/**
 * 商品颜色接口
 * @param data
 */
export function listCommodityColour(data) {
  return fetch({
    url: '/api/pc/commodity/listCommodityColour',
    method: 'get',
    params: data
  });
}
/**
 * 签到菜单接口
 *
 */
export function menusFront(data) {
  return fetch({
    url: 'api/admin/user/front/menusFront',
    method: 'get',
    params: data
  });
}
/**
 * 根据门店查询门店店长
 * @param data
 */
export function getStoreLeader(data) {
  return fetch({
    url: '/api/pc/common/getStoreLeader',
    method: 'get',
    params: data
  });
}
//启用/停用
export function IsEnable(data) {
  return fetch({
    url: '/api/pc/common/IsEnable',
    method: 'put',
    data
  });
}
export function getPostUser(params) {
  return fetch({
    url: '/api/pc/common/getPostUser',
    method: 'get',
    params
  });
}
/**
 * 获取 仓库列表
 * @method getStorageList
 */
export function getStorageList(query) {
  return fetch({
    url: '/api/pc/storage/getStorageList',
    method: 'get',
    params: query
  });
}

/**
 * 获取售后部门
 * @param query
 */
export function listServeGroup(query) {
  return fetch({
    url: '/api/pc/serveGroup/listServeGroup',
    method: 'get',
    params: query
  });
}

/**
 * 获取售后部门
 * @param query
 */
export function listLoginServeGroup(query) {
  return fetch({
    url: '/api/pc/serveGroup/listLoginServeGroup',
    method: 'get',
    params: query
  });
}
/**
 * 获取编号
 * @param query
 * serialNumber
 */
export function getUUID(query) {
  return fetch({
    url: '/api/pc/common/getUUID',
    method: 'get',
    params: query
  });
}

/**
 * 组织机构 根据当前节点获取所有父节点（含自己）
 * @param query
 * organizedId 当前节点
 */
export function listParentOrganizedId(query) {
  return fetch({
    url: '/api/pc/common/listParentOrganizedId',
    method: 'get',
    params: query
  });
}

/**
 * 获取当前登陆人组织结构接口
 * @param data
 */
export function getOrganizationByPresent(data) {
  return fetch({
    url: '/api/pc/common/getOrganizationByPresent',
    method: 'get',
    params: data
  });
}

//删除附件公共接口
export function removeAccessoryImgById(data) {
  return fetch({
    url: '/api/pc/common/removeAccessoryImgById',
    method: 'delete',
    data
  });
}
/**
 * 获取商品SKUId
 * @param query
 * commoditySeriesId
 * commodityColourId
 * commodityMaterialId
 * commodityId
 */
export function getGoodsSKUId(query) {
  return fetch({
    url: '/api/pc/storeGiftsCollar/getGoodsSKUId',
    method: 'get',
    params: query
  });
}

/**
 * 查询附件列表
 * @param query
 * dataSourceId
 * dataSourceEnum
 */
export function listAccessoryImg(query) {
  return fetch({
    url: '/api/pc/common/listAccessoryImg',
    method: 'get',
    params: query
  });
}

/**
 * 获取门店下人员
 * @param query
 * storeId
 */
export function listStoreUser(query) {
  return fetch({
    url: '/api/pc/common/listStoreUser',
    method: 'get',
    params: query
  });
}

/**
 * 根据门店获取仓库
 * @param query
 */
export function getStorageByStoreId(query) {
  return fetch({
    url: '/api/pc/storage/getStorageByStoreId',
    method: 'get',
    params: query
  });
}

/**
 * 根据品牌品类查询商品颜色接口
 * @param query
 * brandId
 * commodityCategoryId
 */
export function listCommodityColourByParam(query) {
  return fetch({
    url: '/api/pc/commodity/listCommodityColourByParam',
    method: 'get',
    params: query
  });
}
/**
 * 根据品牌品类查询商品系列
 * @param query
 * brandId
 * commodityCategoryId
 */
export function listCommoditySeriesByParam(query) {
  return fetch({
    url: '/api/pc/commodity/listCommoditySeriesByParam',
    method: 'get',
    params: query
  });
}
/**
 * 根据品牌品类查询商品材质
 * @param query
 * brandId
 * commodityCategoryId
 */
export function listCommodityMaterialByParam(query) {
  return fetch({
    url: '/api/pc/commodity/listCommodityMaterialByParam',
    method: 'get',
    params: query
  });
}
