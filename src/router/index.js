import Vue from 'vue';
import Router from 'vue-router';

// const _import = require('./_import_' + process.env.NODE_ENV);
const _import = (file) => require('@/views/' + file);

// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';
import webView from '../views/components/webView';
import mains from 'views/components/appMain';


/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [
  {
    path: '/login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/loginJava',
    component: _import('loginJava/index'),
    hidden: true

  },
  {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: _import('error/401'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard',
    name: '后台首页',
    hidden: true,
    children: [{
      path: '/dashboard',
      component: _import('dashboard/index')
    }]
  },
  {
    path: '/commodity',
    name: '商品管理',
    component: webView,
    authority: 'commodity',
    children: [
      // 品牌管理
      {
        path: 'brandmanagement',
        component: _import('productmanage/brandmanagement/brandmanagement'),
        name: '品牌管理',
        icon: 'bmm',
        meta: {
          keepAlive: true
        },
        authority: 'brandmanagement'
      },
    // 品牌管理下的查看
      {
        path: 'scalebrand',
        component: _import('productmanage/brandmanagement/scalebrand'),
        name: '查看品牌',
        meta: {
          keepAlive: false
        },
        authority: 'scalebrand'
      },
    // 品类管理
      {
        path: 'classifymanage',
        component: _import('productmanage/classifymanage/index'),
        name: '品类管理',
        icon: 'category',
        meta: {
          keepAlive: true
        },
        authority: 'classifymanage'
      },
    // 产品分类
      {
        path: 'goodsclassify',
        component: _import('productmanage/goodsclassify/index'),
        name: '产品分类',
        meta: {
          keepAlive: true
        },
        authority: 'goodsclassify'
      },
    // 商品管理
      {
        path: 'goodsmanage',
        component: _import('productmanage/goodsmanage/index'),
        name: '商品管理',
        meta: {
          keepAlive: true
        },
        authority: 'goodsmanage'
      },
      // 导入商品
      {
        path: 'failurelist',
        component: _import('productmanage/goodsmanage/failurelist'),
        name: '导入商品',
        icon: 'bmm',
        meta: {
          keepAlive: false
        },
        authority: 'failurelist'
      },
    // 添加产品addgoods
      {
        path: 'addgoods',
        component: _import('productmanage/goodsmanage/addgoods'),
        name: '新增商品',
        meta: {
          keepAlive: false
        },
        authority: 'addgoods'
      },
    // 编辑产品editgoods
      {
        path: 'editgoods',
        component: _import('productmanage/goodsmanage/editgoods'),
        name: '编辑商品',
        meta: {
          keepAlive: false
        },
        authority: 'editgoods'
      },
    // 产品管理
      {
        path: 'productmanages',
        component: _import('productmanage/productmanages/index'),
        name: '产品管理',
        meta: {
          keepAlive: true
        },
        authority: 'productmanages'
      },
    // 选择商品 choseproducts
      {
        path: 'choseproducts',
        component: _import('productmanage/productmanages/choseproducts'),
        name: '选择产品',
        meta: {
          keepAlive: false
        },
        authority: 'choseproducts'
      },
    // 添加产品addproducts
      {
        path: 'addproducts',
        component: _import('productmanage/productmanages/addproducts'),
        name: '新增产品',
        meta: {
          keepAlive: false
        },
        authority: 'addproducts'
      },
    // 编辑产品addgoods
      {
        path: 'editproducts',
        component: _import('productmanage/productmanages/editproducts'),
        name: '编辑产品',
        meta: {
          keepAlive: false
        },
        authority: 'editproducts'
      },
    // 商品属性
      {
        path: 'productattribute',
        component: _import('productmanage/productattribute/index'),
        name: '商品属性',
        meta: {
          keepAlive: true
        },
        authority: 'productattribute'
      }
    ]
  },
  {
    path: '/customer',
    name: '客户管理',
    component: webView,
    authority: 'commodity',
    children: [
    // 客户管理-我的客户
      {
        path: 'customermanagement',
        component: _import('customermanagement/myclient/index'),
        name: '我的客户',
        meta: {
          keepAlive: true
        },
        authority: 'customermanagement'
      },
    // 客户移交
      {
        path: 'customerHandover',
        component: _import('customermanagement/myclient/customerHandover'),
        name: '客户移交',
        meta: {
          keepAlive: false
        },
        authority: 'customerHandover'
      },
    // 客户共享
      {
        path: 'customersharing',
        component: _import('customermanagement/customerquery/CustomerSharing'),
        name: '客户共享',
        meta: {
          keepAlive: false
        },
        authority: 'customersharing'
      },
    // 客户信息
      {
        path: 'clientinformation',
        component: _import('customermanagement/myclient/clientinformation'),
        name: '客户信息',
        meta: {
          keepAlive: false
        },
        authority: 'clientinformation'

      },
    // 客户编辑 customereditor
      {
        path: 'customereditor',
        component: _import('customermanagement/myclient/customereditor'),
        name: '客户编辑',
        name: '客户编辑',
        meta: {
          keepAlive: false
        },
        authority: 'customereditor'
      },
    // 客户需求
      {
        path: 'customerdemand',
        component: _import('customermanagement/myclient/customerdemand'),
        name: '客户需求',
        meta: {
          keepAlive: false
        },
        authority: 'customerdemand'
      },
    // 新增客户
      {
        path: 'customeradd',
        component: _import('customermanagement/myclient/customeradd'),
        name: '新增客户',
        meta: {
          keepAlive: false
        },
        authority: 'customeradd'
      },
    // 客户管理-客户查询
      {
        path: 'customerquery',
        component: _import('customermanagement/customerquery/index'),
        name: '客户查询',
        meta: {
          keepAlive: true
        },
        authority: 'customerquery'
      },
    // 变更业务员
      {
        path: 'changesalesman',
        component: _import('customermanagement/customerquery/Changesalesman'),
        name: '变更业务员',
        meta: {
          keepAlive: false
        },
        authority: 'changesalesman'
      },
    //  变更业务员-审批
      {
        path: 'transferApproval',
        component: _import('customermanagement/customerquery/transferApproval'),
        name: '移交客户',
        meta: {
          keepAlive: false
        },
        authority: 'transferApproval'
      },
    // 批量导入
      {
        path: 'batchimport',
        component: _import('customermanagement/customerquery/Batchimport'),
        name: '批量导入',
        meta: {
          keepAlive: false
        },
        authority: 'batchimport'
      },
    // 客户管理-门店客流量
      {
        path: 'storetraffic',
        component: _import('customermanagement/storetraffic/index'),
        name: '门店客流量',
        meta: {
          keepAlive: false
        },
        authority: 'storetraffic'
      },
    // 门店客流量审批
      {
        path: 'flowapproval',
        component: _import('customermanagement/flowapproval/index'),
        name: '门店客流量审批',
        meta: {
          keepAlive: true
        },
        authority: 'flowapproval'
      },
    // 移交审批
      {
        path: 'transfer',
        component: _import('customermanagement/transfer/transfer'),
        name: '移交审批',
        meta: {
          keepAlive: true
        },
        authority: 'transfer'
      }
    ]
  },
  {
    path: '/',
    name: '我的工作台',
    component: webView,
    authority: 'workbench',
    children: [
      {
        path: 'index',
        name: '我的工作台',
        component: _import('workbench/index'),
        meta: {
          keepAlive: false
        },
        authority: 'index'
      }
    ]
  },

  {
    path: '/Installation',
    name: '安装管理',
    component: webView,
    authority: 'Installation',
    children: [
      {//徐爽
        path: 'viptoxushuang',
        name: '徐爽专用',
        component: _import('Installation/xushuang/index'),
        meta: {
          keepAlive: false
        },
        authority: 'viptoxushuang'
      },
      {// 安装管理
        path: 'Installation',
        name: '安装管理列表',
        component: _import('Installation/InstallList/index'),
        meta: {
          keepAlive: true
        },
        authority: 'Installation'
      },
      { // 申请调拨
        path: 'applyallocation',
        name: '申请调拨',
        component: _import('entrepotSet/aftermarket/repaircenter/stepsOne/applyallocation'),
        meta: {
          keepAlive: false
        },
        authority: 'applyallocation'
      },
      {// 异常问题
        path: 'anomalousproblem',
        name: '异常问题',
        component: _import('Installation/anomalousproblem/index'),
        meta: {
          keepAlive: true
        },
        authority: 'anomalousproblem'
      },
      {// 异常单详情
        path: 'exceptiondetails',
        name: '异常单详情',
        component: _import('Installation/anomalousproblem/exceptiondetails'),
        meta: {
          keepAlive: false
        },
        authority: 'exceptiondetails'
      },
      {// 异常下单列表
        path: 'exceptplaceorder',
        name: '异常下单列表',
        component: _import('Installation/anomalousproblem/exceptplaceorder'),
        meta: {
          keepAlive: true
        },
        authority: 'exceptplaceorder'
      },
      {// 工厂查货
        path: 'factoryinspection',
        name: '工厂查货',
        component: _import('Installation/anomalousproblem/factoryinspection'),
        meta: {
          keepAlive: true
        },
        authority: 'factoryinspection'
      },
      {// 安装工作台
        path: 'workbench',
        name: '安装工作台',
        component: _import('Installation/workbench/index'),
        meta: {
          keepAlive: true
        },
        authority: 'workbench'
      },
      // 安装工管理
      {
        path: 'installworker',
        name: '安装工管理',
        component: _import('Installation/installworker/index'),
        meta: {
          keepAlive: false
        },
        authority: 'installworker'
      },
      // 派单中心
      {
        path: 'dispatchcenter',
        name: '派单中心',
        component: _import('Installation/dispatchcenter/index'),
        meta: {
          keepAlive: false
        },
        authority: 'dispatchcenter'
      },
      {
        path: 'viewdetails',
        name: '安装查看详情',
        component: _import('Installation/dispatchcenter/stepsOne/components/viewdetails'),
        meta: {
          keepAlive: false
        },
        authority: 'viewdetails'
      },
      {
        path: 'designatetreasury',
        name: '指派出库',
        component: _import('Installation/dispatchcenter/components/designatetreasury'),
        meta: {
          keepAlive: false
        },
        authority: 'designatetreasury'
      },
      {
        path: 'installationstatus',
        name: '修改安装状态',
        component: _import('Installation/dispatchcenter/components/installationstatus'),
        meta: {
          keepAlive: false
        },
        authority: 'installationstatus'
      },
      {
        path: 'thirdpartyorder',
        name: '第三方订单',
        component: _import('Installation/thirdpartyorder/index'),
        meta: {
          keepAlive: false
        },
        authority: 'thirdpartyorder'
      },
      {
        path: 'orderImport',
        name: '第三方订单导入',
        component: _import('Installation/thirdpartyorder/orderImport'),
        meta: {
          keepAlive: false
        },
        authority: 'orderImport'
      },
      {
        path: 'newaddthirdparty',
        name: '新增第三方订单',
        component: _import('Installation/thirdpartyorder/newaddthirdparty'),
        meta: {
          keepAlive: false
        },
        authority: 'newaddthirdparty'
      },
      {// 补货单管理
        path: 'replenishmentorder',
        component: _import('order/replenishmentorder/index'),
        name: '补货单管理',
        meta: {
          keepAlive: false
        },
        authority: 'replenishmentorder'
      },
      {// 遗留单管理
        path: 'abandonorder',
        component: _import('order/abandonorder/index'),
        name: '遗留单管理',
        meta: {
          keepAlive: false
        },
        authority: 'abandonorder'
      },
      {// 遗留单管理
        path: 'addabandonorder',
        component: _import('order/abandonorder/addabandonorder'),
        name: '新增遗留单',
        meta: {
          keepAlive: false
        },
        authority: 'addabandonorder'
      },
      {
        path: 'pieinstallationlist',
        name: '派安装单',
        component: _import('Installation/dispatchcenter/stepsTwo/components/pieinstallationlist'),
        meta: {
          keepAlive: false
        },
        authority: 'pieinstallationlist'
      }
    ]
  },
  {
    path: '/reformadmini',
    name: '改制管理',
    component: webView,
    authority: 'reformadmini',
    children: [
      {// 安装改制列表
        path: 'reformlist',
        name: '改制',
        component: _import('Installation/anomalousproblem/reformlist'),
        meta: {
          keepAlive: true
        },
        authority: 'reformlist'
      }
    ]
  },
  {
    path: '/administrativeservice',
    name: '行政回访管理',
    component: webView,
    authority: 'administrativeservice',
    children: [
      { // 客服回访
        path: 'servicereturn',
        name: '回访管理',
        component: _import('administrationCenter/administrativeservice/custservice/index'),
        meta: {
          keepAlive: false
        },
        authority: 'servicereturn'
      }, { // 安装回访
        path: 'backinstall',
        name: '安装回访',
        component: _import('administrationCenter/administrativeservice/custservice/backInstall'),
        meta: {
          keepAlive: false
        },
        authority: 'backinstall'
      }
    ]
  },
  // {
  //   path: '/dictmanage',
  //   name: '字典项管理管理',
  //   component: webView,
  //   authority: 'dictmanage',
  //   children: [
  //     { // 字典管理
  //       path: 'index',
  //       name: '字典管理',
  //       component: _import('administrationCenter/dictmanage/index'),
  //       meta: ['字典项管理管理', '字典管理'],
  //       authority: 'index'
  //     }
  //   ]
  // },
  {
    path: '/stockrequisitioned',
    name: '备货领用管理',
    component: webView,
    authority: 'stockrequisitioned',
    children: [
      {
        path: 'stockcollar',
        name: '备货领用',
        component: _import('entrepotSet/stockrequisitioned/stockcollar/index'),
        meta: {
          keepAlive: true
        },
        authority: 'stockcollar'
      },
      {
        path: 'addcollarlist',
        name: '添加备货领用',
        component: _import('entrepotSet/stockrequisitioned/stockcollar/addcollarlist'),
        meta: {
          keepAlive: false
        },
        authority: 'addcollarlist'
      },
      {
        path: 'examination',
        name: '备货审批',
        component: _import('entrepotSet/stockrequisitioned/examination/index'),
        meta: {
          keepAlive: true
        },
        authority: 'examination'
      }
    ]
  },
  {
    path: '/aftermarket',
    name: '售后',
    component: webView,
    authority: 'aftermarket',
    children: [
      { // 售后工作台
        path: 'workbench',
        name: '售后工作台',
        component: _import('entrepotSet/aftermarket/workbench/index'),
        meta: {
          keepAlive: true
        },
        authority: 'workbench'
      },
      { // 售后问题
        path: 'aftersaleproblem',
        name: '售后问题',
        component: _import('entrepotSet/aftermarket/aftersaleproblem/index'),
        meta: {
          keepAlive: true
        },
        authority: 'aftersaleproblem'
      },
      { // 售后问题
        path: 'newproblems',
        name: '新增售后问题',
        component: _import('entrepotSet/aftermarket/aftersaleproblem/newproblems'),
        meta: {
          keepAlive: false
        },
        authority: 'newproblems'
      },
      { // 售后详情
        path: 'aftermarketdetails',
        name: '售后详情',
        component: _import('entrepotSet/aftermarket/aftersaleproblem/aftermarketdetails'),
        meta: {
          keepAlive: false
        },
        authority: 'aftermarketdetails'
      },
      { // 维修派单中心
        path: 'repaircenter',
        name: '维修派单中心',
        component: _import('entrepotSet/aftermarket/repaircenter/index'),
        meta: {
          keepAlive: true
        },
        authority: 'repaircenter'
      },
      
      { // 赔偿  repairtask
        path: 'compensate',
        name: '赔偿',
        component: _import('entrepotSet/aftermarket/repaircenter/stepsTwo/compensate'),
        meta: {
          keepAlive: true
        },
        authority: 'compensate'
      },
      { // 维修任务
        path: 'repairtask',
        name: '维修任务',
        component: _import('entrepotSet/aftermarket/repairtask/index'),
        meta: {
          keepAlive: false
        },
        authority: 'repairtask'
      },
      { // 任务列表
        path: 'tasktabs',
        name: '合同详情',
        component: _import('entrepotSet/aftermarket/repaircenter/components/tasktabs'),
        meta: {
          keepAlive: false
        },
        authority: 'tasktabs'
      }
    ]
  },
  {
    path: '/ordermm',
    redirect: '/ordermm/order',
    name: '订单管理',
    component: webView,
    authority: 'ordermm',
    children: [
      {
        path: 'viptozuoweimin',
        name: '左伟民专用',
        component: _import('marketing/contract/zuoweimin'),
        meta: ['左伟民专用'],
        authority: 'viptozuoweimin'
      },
      {
        path:'temporaryorder',
        name:'特殊页面',
        component: _import('marketing/contract/temporaryorder'),
        meta: ['特殊页面'],
        authority: 'temporaryorder'
      },
      {// 订单管理
        path: 'order',
        name: '订单管理',
        component: _import('order/order/order'),
        meta: {
          keepAlive: true
        },
        authority: 'order'
      },
      {// 新增订单
        path: 'addJustOrder',
        component: _import('order/justOrder/addJustOrder'),
        name: '新增订单',
        meta: {
          keepAlive: false
        },
        authority: 'addJustOrder'
      },
      {// 修改订单
        path: 'getorder',
        component: _import('order/order/getorder'),
        name: '修改订单',
        meta: {
          keepAlive: false
        },
        authority: 'getorder'
      },
      {// 订单详情
        path: 'details',
        component: _import('order/order/details/details'),
        name: '订单详情',
        meta: {
          keepAlive: false
        },
        authority: 'details'
      },
      {// 客增单管理
        path: 'customerorder',
        component: _import('order/customerorder/index'),
        name: '客增单管理',
        meta: {
          keepAlive: true
        },
        authority: 'customerorder'
      },
      {// 新增客增单
        path: 'operateorder',
        name: '新增客增单',
        component: _import('order/customerorder/operateorder'),
        meta: {
          keepAlive: false
        },
        authority: 'operateorder'
      },
      {// 补货单管理
        path: 'replenishmentorder',
        component: _import('order/replenishmentorder/index'),
        name: '补货单管理',
        meta: {
          keepAlive: false
        },
        authority: 'replenishmentorder'
      },
      {// 遗留单管理
        path: 'abandonorder',
        component: _import('order/abandonorder/index'),
        name: '遗留单管理',
        meta: {
          keepAlive: false
        },
        authority: 'abandonorder'
      },
      {// 退货单管理
        path: 'returnorder',
        component: _import('order/returnorder/index'),
        name: '退货单管理',
        meta: {
          keepAlive: false
        },
        authority: 'returnorder'
      },
      {// 换货单管理
        path: 'barterorder',
        component: _import('order/barterorder/index'),
        name: '换货单管理',
        meta: {
          keepAlive: false
        },
        authority: 'barterorder'
      },
      {// 作废单管理
        path: 'cancelorder',
        component: _import('order/cancelorder/index'),
        name: '作废单管理',
        meta: {
          keepAlive: false
        },
        authority: 'cancelorder'
      },
      {// 正单管理
        path: 'justOrder',
        component: _import('order/justOrder/justOrder'),
        name: '正单管理',
        meta: {
          keepAlive: false
        },
        authority: 'justOrder'
      },
      // {//课增单管理
      //   path: 'customer',
      //   name: '客增单管理',
      //   component: _import('order/customer/index'),
      //   meta: ['订单管理', '客增单管理'],
      //   authority: 'customer',
      // },
      // {//新增客增单
      //   path: 'newaddcustomer',
      //   name: '新增客增单',
      //   component: _import('order/customer/newaddcustomer'),
      //   meta: ['订单管理', '客增单管理', '新增客增单'],
      //   authority: 'newaddcustomer',
      // },
      {// 指派测量管理
        path: 'measuremanage',
        name: '指派测量管理',
        component: _import('order/measuremanage/index'),
        meta: {
          keepAlive: true
        },
        authority: 'measuremanage'
      },
      {// 设计师接受任务
        path: 'accepttask',
        name: '设计师接受任务',
        component: _import('order/measuremanage/accepttask'),
        meta: {
          keepAlive: false
        },
        authority: 'accepttask'
      },
      {// 查看测量汇报
        path: 'seemeasure',
        name: '查看测量汇报',
        component: _import('order/measuremanage/seemeasure'),
        meta: {
          keepAlive: false
        },
        authority: 'seemeasure'
      },
      {// 测量汇报单
        path: 'measuredetails',
        name: '测量汇报单',
        component: _import('order/measuremanage/measuredetails'),
        meta: {
          keepAlive: false
        },
        authority: 'measuredetails'

      },
      {// 设计汇报单
        path: 'designdetails',
        name: '设计汇报单',
        component: _import('order/measuremanage/designdetails'),
        meta: {
          keepAlive: true
        },
        authority: 'designdetails'

      },
      {// 预算清单管理
        path: 'budgetdetailed',
        name: '预算清单管理',
        component: _import('order/budgetdetailed/index'),
        meta: {
          keepAlive: true
        },
        authority: 'budgetdetailed'
      },
      {// 组套
        path: 'stark',
        name: '组套',
        component: _import('order/budgetdetailed/stark'),
        meta: {
          keepAlive: false
        },
        authority: 'stark'
      },
      {// 新增预算清单
        path: 'addTranslate',
        name: '新增预算清单',
        component: _import('order/budgetdetailed/add/addTranslate'),
        meta: {
          keepAlive: true
        },
        authority: 'addTranslate'
      },
      {// 编辑预算清单
        path: 'editBudgetList',
        name: '编辑预算清单',
        component: _import('order/budgetdetailed/add/editBudgetList'),
        meta: {
          keepAlive: false
        },
        authority: 'editBudgetList'
      },
      {// 查看预算清单
        path: 'viewBugetdetailed',
        name: '查看预算清单',
        component: _import('order/budgetdetailed/viewBugetdetailed'),
        meta: {
          keepAlive: false
        },
        authority: 'viewBugetdetailed'
      },
      {
        path: 'orderDestory',
        name: '作废单管理',
        component: _import('order/destroy/index'),
        meta: {
          keepAlive: false
        },
        authority: 'orderDestory'
      },
      {
        path: 'orderDetails',
        name: '作废单详情',
        component: _import('order/destroy/details/index'),
        meta: {
          keepAlive: false
        },
        authority: 'orderDetails'
      },
      {// 邀约到店列表
        path: 'inviteshop',
        name: '邀约到店列表',
        component: _import('order/inviteshop/index'),
        meta: {
          keepAlive: true
        },
        authority: 'inviteshop'
      },
      {// 带单管理
        path: 'tapesheet',
        name: '带单管理',
        component: _import('order/tapesheet/index'),
        meta: {
          keepAlive: true
        },
        authority: 'tapesheet'
      },
      {// 带单管理-带单详情
        path: 'tapesheetDetails',
        name: '带单详情',
        component: _import('order/tapesheet/tapesheetDetails'),
        meta: {
          keepAlive: false
        },
        authority: 'tapesheetDetails'
      },
      {// 带单管理-接单详情
        path: 'acceptOrderDetails',
        name: '接单详情',
        component: _import('order/tapesheet/acceptOrderDetails'),
        meta: {
          keepAlive: false
        },
        authority: 'acceptOrderDetails'
      },
      {// 合同列表
        path: 'contract',
        name: '合同列表',
        component: _import('marketing/contract/index'),
        meta: {
          keepAlive: true
        },
        authority: 'contract'
      },
      {// 合同列表
        path: 'signcontract',
        name: '签合同',
        component: _import('marketing/contract/signcontract'),
        meta: {
          keepAlive: false
        },
        authority: 'signcontract'
      },
      {// 下单图纸管理
        path: 'orderdrawing',
        name: '下单图纸管理',
        component: _import('order/orderdrawing/index'),
        meta: {
          keepAlive: false
        },
        authority: 'orderdrawing'
      },
      {// 带单管理-接单
        path: 'orderReceiving',
        name: '接单',
        component: _import('order/tapesheet/orderReceiving'),
        meta: {
          keepAlive: false
        },
        authority: 'orderReceiving'
      }

    ]
  },
  {
    path: '/puniManagement',
    name: '违规处罚管理',
    component: webView,
    authority: 'puniManagement',
    children: [
      {
        path: 'violations',
        component: _import('administrationCenter/puniManagement/violations/index'),
        name: '违规处罚管理详情',
        meta: {
          keepAlive: true
        },
        authority: 'violations'
      },
      {// 违规管理--责任人处理
        path: 'respondisposal',
        name: '责任人处理',
        component: _import('administrationCenter/puniManagement/violations/disposal'),
        meta: {
          keepAlive: false
        },
        authority: 'respondisposal'
      },
      {// 违规管理--判定人处理
        path: 'judgedisposal',
        name: '判定人处理',
        component: _import('administrationCenter/puniManagement/violations/disposal'),
        meta: {
          keepAlive: false
        },
        authority: 'judgedisposal'
      },
      {
        path: 'punishment',
        component: _import('administrationCenter/puniManagement/punishment/index'),
        name: '处罚单管理',
        meta: {
          keepAlive: true
        },
        authority: 'punishment'
      },
      
      {// 违规管理--责任人处理
        path: 'viewdisposal',
        name: '违规处罚详情',
        component: _import('administrationCenter/puniManagement/violations/disposal'),
        meta: {
          keepAlive: false
        },
        authority: 'viewdisposal'
      },
      

    ]
  },
  {
    path: '/salecost',
    name: '销售成本价格',
    component: webView,
    authority: 'salecost',
    children: [
      {
        path: 'priceguard',
        component: _import('administrationCenter/salecost/priceguard/index'),
        name: '销售价格维护',
        meta: {
          keepAlive: true
        },
        authority: 'priceguard'
      },
      {
        path: 'strateDetails',
        component: _import('administrationCenter/salecost/priceguard/strateDetails'),
        name: '商品价格详情',
        meta: {
          keepAlive: false
        },
        authority: 'strateDetails'
      },
      {
        path: 'Importstrategy',
        component: _import('administrationCenter/salecost/priceguard/components/Importstrategy'),
        name: '销售价导入',
        meta: {
          keepAlive: false
        },
        authority: 'Importstrategy'
      },
      {
        path: 'verifyGoods',
        component: _import('administrationCenter/salecost/priceguard/verifyGoods'),
        name: '上传商品页面',
        meta: {
          keepAlive: false
        },
        authority: 'verifyGoods'
      },
      {
        path: 'costguard',
        component: _import('administrationCenter/salecost/costguard/index'),
        name: '成本价格维护',
        meta: {
          keepAlive: true
        },
        authority: 'costguard'
      },
      {
        path: 'Importpage',
        component: _import('administrationCenter/salecost/costguard/components/Importpage'),
        name: '成本价格导入',
        meta: {
          keepAlive: false
        },
        authority: 'Importpage'
      }
    ]
  },
  {
    path: '/warehouse',
    name: '仓储管理',
    component: webView,
    authority: 'warehouse',
    children: [
      {
        path: 'storageManage',
        component: _import('entrepotSet/storageManage/index'),
        name: '仓储首页',
        meta: {
          keepAlive: true
        },
        authority: 'storageManage'

      },
      {
        path: 'storeManagement',
        name: '仓库管理',
        component: _import('entrepotSet/storeMangement/index'),
        meta: {
          keepAlive: false
        },
        authority: 'storeManagement'
      },
      {
        path: 'freightAreaManage',
        component: _import('entrepotSet/freightArea/index'),
        name: '货区管理',
        meta: {
          keepAlive: true
        },
        authority: 'freightAreaManage'
      },
      {
        path: 'goodsAllocationManage',
        component: _import('entrepotSet/goodsAllocation/index'),
        name: '货位管理',
        meta: {
          keepAlive: true
        },
        authority: 'goodsAllocationManage'

      },
      {
        path: 'pickUpManage',
        component: _import('entrepotSet/pickUpManage/index'),
        name: '提货站管理',
        meta: {
          keepAlive: true
        },
        authority: 'pickUpManage'
      },
      {
        path: 'warningSet',
        component: _import('entrepotSet/warningSet/index'),
        name: '仓库预警设置',
        meta: {
          keepAlive: true
        },
        authority: 'warningSet'
      },
      {
        path: 'addedlist',
        component: _import('entrepotSet/warningSet/components/addedlist'),
        name: '新增仓库预警策略',
        meta: {
          keepAlive: false
        },
        authority: 'addedlist'
      },
      {
        path: 'editedlist',
        component: _import('entrepotSet/warningSet/components/editedlist'),
        name: '编辑仓库预警策略',
        meta: {
          keepAlive: false
        },
        authority: 'editedlist'
      },
      {
        path: 'receiptManagement',
        component: _import('entrepotSet/receiptManagement/index'),
        name: '到货单模板管理',
        meta: {
          keepAlive: true
        },
        authority: 'receiptManagement'
      },
      {
        path: 'unpackingData',
        component: _import('entrepotSet/unpackingData/index'),
        name: '拆包数据项维护',
        meta: {
          keepAlive: true
        },
        authority: 'unpackingData'
      }
    ]
  },
  {
    path: '/stockManagement',
    name: '入库管理',
    component: webView,
    authority: 'stockManagement',
    children: [
      {
        path: 'arrivalNotice',
        component: _import('entrepotSet/stockManagement/arrivalNotice/index'),
        name: '到货单管理',
        meta: {
          keepAlive: true
        },
        authority: 'arrivalNotice'
      },
      {
        path: 'message',
        component: _import('entrepotSet/stockManagement/arrivalNotice/message/index'),
        name: '到货单信息',
        meta: {
          keepAlive: false
        },
        authority: 'message'
      },
      {
        path: 'edit',
        component: _import('entrepotSet/stockManagement/arrivalNotice/edit'),
        name: '编辑到货单信息',
        meta: {
          keepAlive: false
        },
        authority: 'edit'
      },
      {
        path: 'stockPending',
        component: _import('entrepotSet/stockManagement/stockPending/index'),
        name: '待入库',
        meta: {
          keepAlive: true
        },
        authority: 'stockPending'
      },
      {
        path: 'allocation',
        component: _import('entrepotSet/stockManagement/stockPending/allocation'),
        name: '调拨入库',
        meta: {
          keepAlive: false
        },
        authority: 'allocation'
      },
      {
        path: 'withdrawal',
        component: _import('entrepotSet/stockManagement/stockPending/otherlist/withdrawal'),
        name: '撤样入库',
        meta: {
          keepAlive: false
        },
        authority: 'withdrawal'
      },
      {
        path: 'returngoods',
        component: _import('entrepotSet/stockManagement/stockPending/otherlist/returngoods'),
        name: '退货入库',
        meta: {
          keepAlive: false
        },
        authority: 'returngoods'
      },
      {
        path: 'returnstorage',
        component: _import('entrepotSet/stockManagement/stockPending/otherlist/returnstorage'),
        name: '回库入库',
        meta: {
          keepAlive: false
        },
        authority: 'returnstorage'
      },
      {
        path: 'retreatlibrary',
        component: _import('entrepotSet/stockManagement/stockPending/otherlist/retreatlibrary'),
        name: '退库入库',
        meta: {
          keepAlive: false
        },
        authority: 'retreatlibrary'
      },
      {
        path: 'warehousing',
        component: _import('entrepotSet/stockManagement/stockPending/warehousing'),
        name: '订单入库',
        meta: {
          keepAlive: false
        },
        authority: 'warehousing'
      },
      {
        path: 'rewarehousing',
        component: _import('entrepotSet/stockManagement/stockPending/rewarehousing'),
        name: '二次入库',
        meta: {
          keepAlive: false
        },
        authority: 'rewarehousing'
      },
      {
        path: 'preparegoods',
        component: _import('entrepotSet/stockManagement/stockPending/preparegoods'),
        name: '相同到货单入库',
        meta: {
          keepAlive: false
        },
        authority: 'preparegoods'
      },
      {
        path: 'stockuplist',
        component: _import('entrepotSet/stockManagement/stockPending/stockuplist'),
        name: '备货入库入库',
        meta: {
          keepAlive: false
        },
        authority: 'stockuplist'
      },
      {
        path: 'manual',
        component: _import('entrepotSet/stockManagement/stockPending/manual'),
        name: '手动入库',
        meta: {
          keepAlive: false
        },
        authority: 'manual'
      },
      {
        path: 'export',
        component: _import('entrepotSet/stockManagement/stockPending/exportlist'),
        name: '导出',
        meta: {
          keepAlive: false
        },
        authority: 'export'
      },
      {
        path: 'warehousereceipt',
        component: _import('entrepotSet/stockManagement/stockPending/warehousereceipt'),
        name: '入库单查询',
        meta: {
          keepAlive: true
        },
        authority: 'warehousereceipt'
      },
      {
        path: 'warehousingquery',
        component: _import('entrepotSet/stockManagement/stockPending/warehousingquery'),
        name: '入库单详情',
        meta: {
          keepAlive: false
        },
        authority: 'warehousingquery'
      }
      
    ]
  },
  {
    path: '/outgoingManagement',
    name: '出库管理',
    component: webView,
    authority: 'outgoingManagement',
    children: [
      {
        path: 'outofstock',
        component: _import('entrepotSet/outgoingManagement/index'),
        name: '出库管理',
        meta: {
          keepAlive: true
        },
        authority: 'outofstock'
      },
      {
        path: 'nolibrarylist',
        component: _import('entrepotSet/outgoingManagement/nolibrarylist'),
        name: '出库',
        meta: {
          keepAlive: false
        },
        authority: 'nolibrarylist'
      },
      {
        path: 'nolibrarylistDetails',
        component: _import('entrepotSet/outgoingManagement/nolibrarylist'),
        name: '出库详情',
        meta: {
          keepAlive: false
        },
        authority: 'nolibrarylistDetails'
      },
      {
        path: 'handover',
        component: _import('entrepotSet/outgoingManagement/handover'),
        name: '出库详情',
        meta: {
          keepAlive: false
        },
        authority: 'handover'
      },
      {
        path: 'manual',
        component: _import('entrepotSet/outgoingManagement/components/manual'),
        name: '手动出库',
        meta: {
          keepAlive: false
        },
        authority: 'manual'
      },
      {
        path: 'temporaryoutgoing',
        component: _import('entrepotSet/outgoingManagement/temporaryoutgoing'),
        name: '临时出库',
        meta: {
          keepAlive: false
        },
        authority: 'temporaryoutgoing'
      }
    ]
  },
  {
    path: '/inventorymanagement',
    name: '库存管理',
    component: webView,
    authority: 'inventorymanagement',
    children: [
      {
        path: 'orderInventory',
        component: _import('entrepotSet/inventorymanagement/orderInventory/index'),
        name: '订单库存',
        meta: {
          keepAlive: true
        },
        authority: 'orderInventory'
      },
      {
        path: 'seepurchase',
        component: _import('entrepotSet/inventorymanagement/orderInventory/seepurchase'),
        name: '查看采购单',
        meta: {
          keepAlive: false
        },
        authority: 'seepurchase'
      },
      {
        path: 'stockallocation',
        component: _import('entrepotSet/inventorymanagement/orderInventory/stockallocation'),
        name: '货位分配',
        meta: {
          keepAlive: false
        },
        authority: 'stockallocation'
      },
      {
        path: 'orderTransfer',
        component: _import('entrepotSet/inventorymanagement/orderInventory/orderTransfer'),
        name: '转备货',
        meta: {
          keepAlive: false
        },
        authority: 'orderTransfer'
      },
      {
        path: 'stockingstock',
        component: _import('entrepotSet/inventorymanagement/stockingstock/index'),
        name: '备货库存',
        meta: {
          keepAlive: true
        },
        authority: 'stockingstock'
      },
      {
        path: 'setofsets',
        component: _import('entrepotSet/inventorymanagement/stockingstock/components/setofsets'),
        name: '成品组套',
        meta: {
          keepAlive: false
        },
        authority: 'setofsets'
      },
      {
        path: 'transferorder',
        component: _import('entrepotSet/inventorymanagement/stockingstock/transferorder'),
        name: '转订单',
        meta: {
          keepAlive: false
        },
        authority: 'transferorder'
      },
      {
        path: 'temporarymaintenance',
        component: _import('entrepotSet/inventorymanagement/temporarymaintenance/index'),
        name: '维修暂存库存',
        meta: {
          keepAlive: true
        },
        authority: 'temporarymaintenance'
      },
      {
        path: 'internalsales',
        component: _import('entrepotSet/inventorymanagement/internalsales/index'),
        name: '内部销售管理',
        meta: {
          keepAlive: false
        },
        authority: 'internalsales'
      },
      {
        path: 'storeInventory',
        component: _import('entrepotSet/inventorymanagement/storeInventory/index'),
        name: '店面库存',
        meta: {
          keepAlive: false
        },
        authority: 'storeInventory'
      }
    ]
  },
  {
    path: '/inventoryadministration',
    name: '盘点管理',
    component: webView,
    authority: 'inventoryadministration',
    children: [
      {
        path: 'inventory',
        component: _import('entrepotSet/inventoryadministration/inventory/index'),
        name: '订单盘点',
        meta: {
          keepAlive: false
        },
        authority: 'inventory'
      },
      {
        path: 'newaddinventory',
        component: _import('entrepotSet/inventoryadministration/inventory/newaddinventory'),
        name: '新增盘点',
        meta: {
          keepAlive: false
        },
        authority: 'newaddinventory'
      },
      {
        path: 'inventoryenter',
        component: _import('entrepotSet/inventoryadministration/inventory/inventoryenter'),
        name: '结果录入',
        meta: {
          keepAlive: false
        },
        authority: 'inventoryenter'
      },
      {
        path: 'inventoryexport',
        component: _import('entrepotSet/inventoryadministration/inventory/inventoryexport'),
        name: '导出盘点',
        meta: {
          keepAlive: false
        },
        authority: 'inventoryexport'
      },
      {
        path: 'handleinventory',
        component: _import('entrepotSet/inventoryadministration/inventory/handleinventory'),
        name: '盘点处理',
        meta: {
          keepAlive: true
        },
        authority: 'handleinventory'
      }
    ]
  },
  {
    path: '/store',
    name: '门店管理',
    component: webView,
    authority: 'store',
    children: [
      {
        path: 'shopmanagement',
        component: _import('systemcenter/shopmanagement/shopList'),
        name: '门店管理',
        meta: {
          keepAlive: true
        },
        authority: 'shopmanagement'
      },
      {
        path: 'shopadd',
        component: _import('systemcenter/shopmanagement/addShop'),
        name: '新增门店',
        meta: {
          keepAlive: false
        },
        authority: 'shopadd'
      }
    ]
  },
  {
    path: '/department',
    name: '安装售后管理',
    component: webView,
    authority: 'department',
    children: [
      {
        path: 'department',
        component: _import('systemcenter/department/index'),
        name: '安装售后管理',
        meta: {
          keepAlive: true
        },
        authority: 'department'
      },
      {
        path: 'adddepartment',
        component: _import('systemcenter/department/adddepartment'),
        name: '新增部门',
        meta: {
          keepAlive: false
        },
        authority: 'adddepartment'
      }
    ]
  },
  {
    path: '/company',
    name: '公司管理',
    component: webView,
    authority: 'company',
    children: [
      {
        path: 'companymanagement',
        component: _import('systemcenter/companymanagement/companyList'),
        name: '公司管理',
        meta: {
          keepAlive: true
        },
        authority: 'companymanagement'
      },
      {
        path: 'contractadd',
        component: _import('systemcenter/companymanagement/addContract'),
        name: '新建合同',
        meta: {
          keepAlive: false
        },
        authority: 'contractadd'
      },
      {
        path: 'contractview',
        component: _import('systemcenter/companymanagement/viewContract'),
        name: '查看合同',
        meta: {
          keepAlive: false
        },
        authority: 'contractview'
      },
      {
        path: 'companyinfo',
        component: _import('systemcenter/companymanagement/companyInfo'),
        name: '公司信息',
        meta: {
          keepAlive: false
        },
        authority: 'companyinfo'
      }
    ]
  },
  {
    path: '/systemLayout',
    name: '系统参数配置',
    component: webView,
    authority: 'systemLayout',
    children: [
      {
        path: 'giftConditionsConfiguration',
        component: _import('systemcenter/giftConditionsConfiguration/index'),
        name: '礼品赠送条件配置',
        meta: {
          keepAlive: false
        },
        authority: 'giftConditionsConfiguration'
      },
      {
        path: 'recommendRebates',
        component: _import('systemcenter/recommendRebates/index'),
        name: '推荐返点方案配置',
        meta: {
          keepAlive: true
        },
        authority: 'recommendRebates'
      },
      {
        path: 'schemeRules',
        component: _import('systemcenter/recommendRebates/schemeRules'),
        name: '新增推荐返点方案',
        meta: {
          keepAlive: false
        },
        authority: 'schemeRules'
      },
      {
        path: 'timeLimtUrgent',
        component: _import('systemcenter/timeLimtUrgent/index'),
        name: '工期加急配置',
        meta: {
          keepAlive: true
        },
        authority: 'timeLimtUrgent'
      },
      {
        path: 'addNewProjectTimeRule',
        component: _import('systemcenter/timeLimtUrgent/addNewProjectTimeRule'),
        name: '新增工期配置规则',
        meta: {
          keepAlive: false
        },
        authority: 'addNewProjectTimeRule'
      },
      {
        path: 'orderReportAmount',
        component: _import('systemcenter/orderReportAmount/index'),
        name: '订单报备类型金额配置',
        meta: {
          keepAlive: true
        },
        authority: 'orderReportAmount'
      },
      {
        path: 'specialDiscount',
        component: _import('systemcenter/specialDiscount/index'),
        name: '折扣特批配置',
        meta: {
          keepAlive: true
        },
        authority: 'specialDiscount'
      },
      {
        path: 'addSpecialDiscount',
        component: _import('systemcenter/specialDiscount/addSpecialDiscount'),
        name: '折扣特批配置',
        meta: {
          keepAlive: false
        },
        authority: 'addSpecialDiscount'
      },
      {
        path: 'processModule',
        component: _import('systemcenter/processModule/index'),
        name: '流程模块',
        meta: {
          keepAlive: false
        },
        authority: 'processModule'
      },
      {
        path: 'processMessage',
        component: _import('systemcenter/processModule/processMessage'),
        name: '新增流程',
        meta: {
          keepAlive: false
        },
        authority: 'processMessage'
      },
      {
        path: 'resultsShared',
        component: _import('systemcenter/resultsShared/index'),
        name: '业绩共享',
        meta: {
          keepAlive: true
        },
        authority: 'resultsShared'
      },
      {
        path: 'addResultsShared',
        component: _import('systemcenter/resultsShared/addResultsShared'),
        name: '新增业绩共享',
        meta: {
          keepAlive: false
        },
        authority: 'resultsShared'
      }
    ]
  },
  {
    path: '/activity',
    name: '活动管理',
    component: webView,
    authority: 'activity',
    children: [
      {
        path: 'activityMaintain',
        component: _import('systemcenter/activityMaintain/activityList'),
        name: '活动管理',
        meta: {
          keepAlive: false
        },
        authority: 'activityMaintain'
      },
      {
        path: 'addActivity',
        component: _import('systemcenter/activityMaintain/addActivity'),
        name: '新增活动',
        meta: {
          keepAlive: false
        },
        authority: 'addActivity'
      },
      {
        path: 'viewActivity',
        component: _import('systemcenter/activityMaintain/viewActivity'),
        name: '活动详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewActivity'
      }
    ]
  },
  {
    path: '/collection',
    name: '收款管理',
    component: webView,
    authority: 'collection',
    children: [
      {
        path: 'receivablesrun',
        component: _import('FinanceCenter/receivablesrun/clientcollection/index'),
        name: '客户收款',
        meta: {
          keepAlive: true
        },
        authority: 'receivablesrun'
      },
      {
        path: 'proedit',
        component: _import('FinanceCenter/receivablesrun/clientcollection/proEdit'),
        name: '客户收款编辑',
        meta: {
          keepAlive: false
        },
        authority: 'proEdit'
      },
      {
        path: 'decoration',
        component: _import('FinanceCenter/receivablesrun/clientcollection/decoration'),
        name: '家装合同审核',
        meta: {
          keepAlive: false
        },
        authority: 'decoration'
      },
      {
        path: 'goBackQuestion',
        name: '退回原因',
        meta: {
          keepAlive: false
        },
        component: _import('FinanceCenter/receivablesrun/clientcollection/goBackQuestion'),
        authority: 'goBackQuestion'
      },
      {
        path: 'creditCheck',
        name: '关联订单',
        meta: {
          keepAlive: false
        },
        component: _import('FinanceCenter/receivablesrun/clientcollection/creditCheck'),
        authority: 'creditCheck'
      },
      {
        path: 'noSettlement',
        name: '未结算代收款',
        meta: {
          keepAlive: true
        },
        component: _import('FinanceCenter/receivablesrun/noSettlement/index'),
        authority: 'noSettlement'
      },
      {
        path: 'noTicket',
        name: '未交票代收款',
        meta: {
          keepAlive: true
        },
        component: _import('FinanceCenter/receivablesrun/noTicket/index'),
        authority: 'noTicket'
      },
      {
        path: 'homeDecorate',
        name: '家装合同审核',
        meta: {
          keepAlive: false
        },
        component: _import('FinanceCenter/receivablesrun/homeDecorate/index'),
        authority: 'homeDecorate'
      },
      {
        path: 'collectionNotarize',
        name: '代收款确认',
        meta: {
          keepAlive: true
        },
        component: _import('FinanceCenter/receivablesrun/collectionNotarize/index'),
        authority: 'collectionNotarize'
      }


    ]
  },
  {
    path: '/paymentManagement',
    name: '付款管理',
    component: webView,
    authority: 'paymentManagement',
    children: [
      {
        path: 'waitPayList',
        component: _import('FinanceCenter/paymentManagement/waitPayList/index'),
        name: '待付款清单',
        meta: {
          keepAlive: true
        },
        authority: 'waitPayList'
      },
      {
        path: 'paymentList',
        component: _import('FinanceCenter/paymentManagement/paymentList/index'),
        name: '支出单列表',
        meta: {
          keepAlive: true
        },
        authority: 'paymentList'
      },
      {
        path: 'disbursementSlip',
        component: _import('FinanceCenter/paymentManagement/paymentList/disbursementSlip'),
        name: '待付款清单',
        meta: {
          keepAlive: false
        },
        authority: 'disbursementSlip'
      }
    ]
  },
  {
    path: '/invoiceManagement',
    name: '发票管理',
    component: webView,
    authority: 'invoiceManagement',
    children: [
      {
        path: 'invoiceAudit',
        component: _import('FinanceCenter/invoiceManagement/invoiceAudit/index'),
        name: '发票审核',
        meta: {
          keepAlive: false
        },
        authority: 'invoiceAudit'
      }
    ]
  },
  {
    path: '/serverCollection',
    name: '收款管理',
    component: webView,
    authority: 'serverCollection',
    children: [
      {
        path: 'clientReceipt',
        component: _import('FinanceCenter/creditManagement/clientReceipt/index'),
        name: '客户收款确认',
        meta: {
          keepAlive: true
        },
        authority: 'clientReceipt'
      },
      {
        path: 'collectionInformation',
        component: _import('FinanceCenter/creditManagement/clientReceipt/collectionInformation'),
        name: '收款信息',
        meta: {
          keepAlive: false
        },
        authority: 'collectionInformation'
      },
      {
        path: 'cancelAccount',
        component: _import('FinanceCenter/creditManagement/cancelAccount/index'),
        name: '客户收款销账',
        meta: {
          keepAlive: true
        },
        authority: 'cancelAccount'
      },
      {
        path: 'noSettlement',
        component: _import('FinanceCenter/creditManagement/noSettlement/index'),
        name: '未结算待收款',
        meta: {
          keepAlive: false
        },
        authority: 'noSettlement'
      },
      {
        path: 'customerDocumentAudit',
        component: _import('FinanceCenter/creditManagement/customerDocumentAudit/index'),
        name: '会计审核',
        meta: {
          keepAlive: true
        },
        authority: 'customerDocumentAudit'
      }
    ]
  },
  {
    path: '/financeSettlementManagement',
    name: '结算管理',
    component: webView,
    authority: 'financeSettlementManagement',
    children: [
      {
        path: 'domesticOutfitCollection',
        component: _import('FinanceCenter/financeSettlementManagement/domesticOutfitCollection/index'),
        name: '建材城及家装收款',
        meta: {
          keepAlive: true
        },
        authority: 'domesticOutfitCollection'
      },
      {
        path: 'finalStatement',
        component: _import('FinanceCenter/financeSettlementManagement/domesticOutfitCollection/finalStatement'),
        name: '结算单生成',
        meta: {
          keepAlive: false
        },
        authority: 'finalStatement'
      },
      {
        path: 'chooseBillingDetails',
        component: _import('FinanceCenter/financeSettlementManagement/chooseBillingDetails'),
        name: '选择已有结算明细',
        meta: {
          keepAlive: false
        },
      },
      {
        path: 'homeBillingDetails',
        component: _import('FinanceCenter/financeSettlementManagement/homeBillingDetails/index'),
        name: '建材城及家装结算明细',
        meta: {
          keepAlive: true
        },
        authority: 'homeBillingDetails'
      },
      {
        path: 'billingDetails',
        component: _import('FinanceCenter/financeSettlementManagement/homeBillingDetails/billingDetails'),
        name: '结算明细',
        meta: {
          keepAlive: false
        },
        authority: 'billingDetails'
      },
      {
        path: 'reconciliation',
        component: _import('FinanceCenter/financeSettlementManagement/reconciliation/index'),
        name: '建材城及家装对账',
        meta: {
          keepAlive: true
        },
        authority: 'reconciliation'
      },
      {
        path: 'FinancialReconciliationDetails',
        component: _import('FinanceCenter/financeSettlementManagement/reconciliation/FinancialReconciliationDetails'),
        name: '财务对账详情',
        meta: {
          keepAlive: false
        },
        authority: 'FinancialReconciliationDetails'
      },
      {
        path: 'audit',
        component: _import('FinanceCenter/financeSettlementManagement/reconciliation/audit'),
        name: '审核',
        meta: {
          keepAlive: false
        },
        authority: 'audit'
      },
      {
        path: 'closeAccount',
        component: _import('FinanceCenter/financeSettlementManagement/closeAccount/index'),
        name: '建材城及家装结算销账',
        meta: {
          keepAlive: true
        },
        authority: 'closeAccount'
      },
      {
        path: 'statementReview',
        component: _import('FinanceCenter/financeSettlementManagement/StatementReview/index'),
        name: '供应商结算审核',
        meta: {
          keepAlive: true
        },
        authority: 'statementReview'
      },
      {
        path: 'reviewDetailed',
        component: _import('FinanceCenter/financeSettlementManagement/StatementReview/reviewDetailed'),
        name: '结算单审核详细',
        meta: {
          keepAlive: false
        },
        authority: 'reviewDetailed'
      },
      {
        path: 'supplierWriteOff',
        component: _import('FinanceCenter/financeSettlementManagement/supplierWriteOff/index'),
        name: '供货商结算单销账',
        meta: {
          keepAlive: true
        },
        authority: 'supplierWriteOff'
      }
    ]
  },
  {
    path: '/serverPaymentManagement',
    name: '付款管理',
    component: webView,
    authority: 'serverPaymentManagement',
    children: [
      {
        path: 'serverSpendingConfirm',
        component: _import('FinanceCenter/serverPaymentManagement/serverSpendingConfirm/index'),
        name: '客户支出确认',
        meta: {
          keepAlive: true
        },
        authority: 'serverSpendingConfirm'
      },
      // {
      //   path: 'disbursementSlip',
      //   component: _import('FinanceCenter/serverPaymentManagement/serverSpendingConfirm/disbursementSlip'),
      //   name: '客户支出确认',
      //   meta: ['付款管理', '领用管理'],
      //   authority: 'disbursementSlip'
      // },
      {
        path: 'serverSpendingApplication',
        component: _import('FinanceCenter/serverPaymentManagement/serverSpendingApplication/index'),
        name: '合作商支出申请',
        meta: {
          keepAlive: true
        },
        authority: 'serverSpendingApplication'
      },
      {
        path: 'serverWriteOff',
        component: _import('FinanceCenter/serverPaymentManagement/serverWriteOff/index'),
        name: '客户支出销账',
        meta: {
          keepAlive: true
        },
        authority: 'serverWriteOff'
      },
      {
        path: 'serverExpendAudit',
        component: _import('FinanceCenter/serverPaymentManagement/serverExpendAudit/index'),
        name: '合作商支出审核',
        meta: {
          keepAlive: true
        },
        authority: 'serverExpendAudit'
      },
      {
        path: 'serverExpendConfirm',
        component: _import('FinanceCenter/serverPaymentManagement/serverExpendConfirm/index'),
        name: '合作商支出确认',
        meta: {
          keepAlive: true
        },
        authority: 'serverExpendConfirm'
      },
      {
        path: 'serverExpendAccount',
        component: _import('FinanceCenter/serverPaymentManagement/serverExpendAccount/index'),
        name: '合作商支出销账',
        meta: {
          keepAlive: true
        },
        authority: 'serverExpendAccount'
      }
    ]
  },
  {
    path: '/gift',
    name: '礼品管理',
    component: webView,
    authority: 'gift',
    children: [
      {
        path: 'giftapply',
        component: _import('marketing/giftmanagement/giftapply/index'),
        name: '礼品领用管理',
        meta: {
          keepAlive: true
        },
        authority: 'giftapply'
      },
      {
        path: 'addapply',
        component: _import('marketing/giftmanagement/giftapply/addapply'),
        name: '新增礼品申请',
        meta: {
          keepAlive: false
        },
        authority: 'addapply'
      },
      {
        path: 'examineapply',
        component: _import('marketing/giftmanagement/giftapply/examine'),
        name: '礼品申请审核',
        meta: {
          keepAlive: true
        },
        authority: 'examineapply'
      },
      {
        path: 'giftgrant',
        component: _import('marketing/giftmanagement/giftgrant/index'),
        name: '礼品发放管理',
        meta: {
          keepAlive: true
        },
        authority: 'giftgrant'
      },
      {
        path: 'givegift',
        component: _import('marketing/giftmanagement/giftgrant/givegift'),
        name: '赠送礼品',
        meta: {
          keepAlive: false
        },
        authority: 'givegift'
      }
    ]
  },

  {
    path: '/recommender',
    name: '推荐人管理',
    component: webView,
    authority: 'recommender',
    children: [
      {
        path: 'recommendermanage',
        component: _import('marketing/recommender/recommendermanage/index'),
        name: '推荐人管理列表',
        meta: {
          keepAlive: true
        },
        authority: 'recommendermanage'
      },
      {
        path: 'addrecommender',
        component: _import('marketing/recommender/recommendermanage/addrecommender'),
        name: '新增推荐人',
        meta: {
          keepAlive: false
        },
        authority: 'addrecommender'
      },
      {
        path: 'examine',
        component: _import('marketing/recommender/recommendermanage/examine'),
        name: '推荐人审核',
        meta: {
          keepAlive: true
        },
        authority: 'examine'
      },
      {
        path: 'pointmanage',
        component: _import('marketing/recommender/pointmanage/index'),
        name: '推荐人返点管理',
        meta: {
          keepAlive: false
        },
        authority: 'pointmanage'
      },
      {
        path: 'filemanage',
        component: _import('marketing/recommender/filemanage/index'),
        name: '推荐人档案管理',
        meta: {
          keepAlive: true
        },
        authority: 'filemanage'
      },
      {
        path: 'addpoint',
        component: _import('marketing/recommender/pointmanage/addpoint'),
        name: '添加返点管理',
        meta: {
          keepAlive: false
        },
        authority: 'addpoint'
      }
    ]
  },

  {
    path: '/purchasingmanagement',
    name: '采购管理',
    component: webView,
    authority: 'purchasingmanagement',
    children: [
      {
        path: 'procurement',
        component: _import('administrationCenter/purchasingmanagement/procurement/index'),
        name: '采购管理详情',
        meta: {
          keepAlive: false
        },
        authority: 'procurement'
      },
      {
        path: 'librariestake',
        component: _import('administrationCenter/purchasingmanagement/librariestake/index'),
        name: '库取单管理',
        meta: {
          keepAlive: true
        },
        authority: 'librariestake'
      }
    ]
  },
  {
    path: '/outrecommender',
    name: '外部推荐人管理',
    component: webView,
    authority: 'outrecommender',
    children: [
      {
        path: 'auditlist',
        component: _import('administrationCenter/outrecommender/auditlist/index'),
        name: '审核列表',
        meta: {
          keepAlive: false
        },
        authority: 'auditlist'
      },
      {
        path: 'examine',
        component: _import('administrationCenter/outrecommender/auditlist/examine'),
        name: '审核列表',
        meta: {
          keepAlive: false
        },
        authority: 'examine'
      },
      {
        path: 'pointaudit',
        component: _import('administrationCenter/outrecommender/pointaudit/index'),
        name: '返点审核列表',
        meta: {
          keepAlive: false
        },
        authority: 'pointaudit'
      },
      {
        path: 'pointexamine',
        component: _import('administrationCenter/outrecommender/pointaudit/pointexamine'),
        name: '推荐人返点审核',
        meta: {
          keepAlive: false
        },
        authority: 'pointexamine'
      }
    ]
  },
  {
    path: '/allocationmanage',
    name: '调拨管理',
    component: webView,
    authority: 'allocationmanage',
    children: [
      {
        path: 'tobeallocated',
        component: _import('entrepotSet/allocationmanage/tobeallocated/index'),
        name: '待调拨列表',
        meta: {
          keepAlive: true
        },
        authority: 'tobeallocated'
      },
      {
        path: 'createallocated',
        component: _import('entrepotSet/allocationmanage/tobeallocated/createallocated'),
        name: '生成调拨单',
        meta: {
          keepAlive: false
        },
        authority: 'createallocated'
      },
      {
        path: 'addapply',
        component: _import('entrepotSet/allocationmanage/tobeallocated/addapply'),
        name: '新增调拨申请',
        meta: {
          keepAlive: false
        },
        authority: 'addapply'
      },
      {
        path: 'chosepro',
        component: _import('entrepotSet/allocationmanage/tobeallocated/chosepro'),
        name: '填写调拨数量',
        meta: {
          keepAlive: false
        },
        authority: 'chosepro'
      },
      {
        path: 'choseord',
        component: _import('entrepotSet/allocationmanage/tobeallocated/choseord'),
        name: '选择订单',
        meta: {
          keepAlive: false
        },
        authority: 'choseord'
      },
      {
        path: 'allocatedlist',
        component: _import('entrepotSet/allocationmanage/allocatedlist/index'),
        name: '调拨列表',
        meta: {
          keepAlive: true
        },
        authority: 'allocatedlist'
      },
      {
        path: 'allocationdetails',
        component: _import('entrepotSet/allocationmanage/tobeallocated/allocationdetails'),
        name: '调拨详情',
        meta: {
          keepAlive: false
        },
        authority: 'allocationdetails'
      },
    ]
  },
  {
    path: '/duty',
    name: '定责管理',
    component: webView,
    authority: 'duty',
    children: [
      {
        path: 'dutylist',
        component: _import('entrepotSet/duty/dutylist/index'),
        name: '定责列表',
        meta: {
          keepAlive: true
        },
        authority: 'dutylist'
      },
      {
        path: 'dutydetails',
        component: _import('entrepotSet/duty/dutylist/dutyDetails'),
        name: '详情信息',
        meta: {
          keepAlive: true
        },
        authority: 'dutydetails'
      },
      {
        path: 'addduty',
        component: _import('entrepotSet/duty/dutylist/addduty'),
        name: '发起定责',
        meta: {
          keepAlive: false
        },
        authority: 'addduty'
      },
      {
        path: 'genepunish',
        component: _import('entrepotSet/duty/dutylist/genepunish'),
        name: '发起定责详情',
        meta: {
          keepAlive: false
        },
        authority: 'genepunish'
      },
      {
        path: 'choseord',
        component: _import('entrepotSet/duty/components/choseord'),
        name: '选择订单',
        meta: {
          keepAlive: false
        },
        authority: 'choseord'
      },
      {
        path: 'dutydeal',
        component: _import('entrepotSet/duty/dutylist/dutydeal'),
        name: '申诉处理',
        meta: {
          keepAlive: false
        },
        authority: 'dutydeal'
      },
      {
        path: 'punishlist',
        component: _import('entrepotSet/duty/punishlist/index'),
        name: '处罚列表',
        meta: {
          keepAlive: false
        },
        authority: 'punishlist'
      }
    ]
  },
  {
    path: '/shopstock',
    name: '门店库存管理',
    redirect: '/shopstock/shopstockindex',
    component: webView,
    authority: 'shopstock',
    children: [
      {
        path: 'shopstockindex',
        component: _import('marketing/shopstock/index'),
        name: '门店库存管理',
        meta: {
          keepAlive: true
        },
        authority: 'shopstockindex'
      },
      {
        path: 'deliveryRecord',
        component: _import('marketing/shopstock/deliveryRecord'),
        name: '礼品派送记录',
        meta: {
          keepAlive: false
        },
        authority: 'deliveryRecord'
      },
      {
        path: 'acceptanceManagement',
        component: _import('marketing/shopstock/acceptanceManagement'),
        name: '门店待验收管理',
        meta: {
          keepAlive: true
        },
        authority: 'acceptanceManagement'
      },
      {
        path: 'acceptanceRecords',
        component: _import('marketing/shopstock/acceptanceRecords'),
        name: '验收',
        meta: {
          keepAlive: false
        },
        authority: 'acceptanceRecords'
      },
      {
        path: 'warehouseManagement',
        component: _import('marketing/shopstock/warehouseManagement'),
        name: '门店出库管理',
        meta: {
          keepAlive: true
        },
        authority: 'warehouseManagement'
      }
    ]
  },
  {
    path: '/giftdeliver',
    name: '礼品派送管理',
    component: webView,
    authority: 'giftdeliver',
    children: [
      {
        path: 'deliverindex',
        component: _import('entrepotSet/giftdeliver/giftdeliver/index'),
        name: '礼品派送管理',
        meta: {
          keepAlive: true
        },
        authority: 'deliverindex'
      },
      {
        path: 'delivertask',
        component: _import('entrepotSet/giftdeliver/delivertask/index'),
        name: '礼品派送任务管理',
        meta: {
          keepAlive: true
        },
        authority: 'delivertask'
      }

    ]
  },
  {
    path: '/compensationmanage',
    name: '赔偿管理',
    component: webView,
    authority: 'compensationmanage',
    children: [
      {
        path: 'index',
        component: _import('entrepotSet/compensationmanage/index'),
        name: '赔偿管理详情',
        meta: {
          keepAlive: false
        },
        authority: 'index'
      },
      {
        path: 'addcompensation',
        component: _import('entrepotSet/compensationmanage/addcompensation'),
        name: '发起赔偿',
        meta: {
          keepAlive: false
        },
        authority: 'addcompensation'
      },
      {
        path: 'choseord',
        component: _import('entrepotSet/compensationmanage/components/choseord'),
        name: '详情信息',
        meta: {
          keepAlive: false
        },
        authority: 'addcompensation'
      }
    ]
  },
  {
    path: '/samplemanagement',
    name: '样品管理',
    component: webView,
    authority: 'samplemanagement',
    children: [
      {
        path: 'upsample',
        component: _import('administrationCenter/samplemanagement/upsample/index'),
        name: '上样管理',
        meta: {
          keepAlive: true
        },
        authority: 'upsample'
      },
      {
        path: 'addsample',
        component: _import('administrationCenter/samplemanagement/upsample/addSample'),
        name: '新增样品',
        meta: {
          keepAlive: false
        },
        authority: 'addsample'
	    },
	    {
        path: 'editsample',
        component: _import('administrationCenter/samplemanagement/upsample/addSample'),
        name: '修改样品',
        meta: {
          keepAlive: false
        },
        authority: 'editsample'
      },
      {
        path: 'viewupsample',
        component: _import('administrationCenter/samplemanagement/upsample/addSample'),
        name: '上样详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewupsample'
      },
      // {
      //   path: 'splitsample',
      //   component: _import('administrationCenter/samplemanagement/upsample/splitSample'),
      //   name: '上样拆单',
      //   meta: ['样品管理', '上样管理', '上样拆单'],
      //   authority: 'splitsample'
      // },
      {
        path: 'auditupsample',
        component: _import('administrationCenter/samplemanagement/upsample/addSample'),
        name: '上样审核',
        meta: {
          keepAlive: false
        },
        authority: 'auditupsample'
      },
      {
        path: 'cancelsample',
        component: _import('administrationCenter/samplemanagement/cancelsample/index'),
        name: '撤样管理',
        meta: {
          keepAlive: true
        },
        authority: 'cancelsample'
      },
      {
        path: 'addcancle',
        component: _import('administrationCenter/samplemanagement/cancelsample/addcancle'),
        name: '新增撤样',
        meta: {
          keepAlive: false
        },
        authority: 'addcancle'
      },
      {
        path: 'editcancle',
        component: _import('administrationCenter/samplemanagement/cancelsample/editcancle'),
        name: '修改撤样',
        meta: {
          keepAlive: false
        },
        authority: 'editcancle'
      },
      {
        path: 'auditcancle',
        component: _import('administrationCenter/samplemanagement/cancelsample/editcancle'),
        name: '审核撤样',
        meta: {
          keepAlive: false
        },
        authority: 'auditcancle'
      },
      {
        path: 'viewcancle',
        component: _import('administrationCenter/samplemanagement/cancelsample/editcancle'),
        name: '撤样详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewcancle'
      },
    ]
  },
  {
    path: '/stockmanagement',
    name: '备货采购申请管理',
    component: webView,
    authority: 'stockmanagement',
    children: [
      {
        path: 'stockpurchase',
        component: _import('administrationCenter/stockmanagement/stockpurchase/index'),
        name: '备货采购申请管理',
        meta: {
          keepAlive: true
        },
        authority: 'stockpurchase'
      },
      {
        path: 'addstockpurchase',
        component: _import('administrationCenter/stockmanagement/stockpurchase/stockpurchase'),
        name: '新增备货申请',
        meta: {
          keepAlive: false
        },
        authority: 'addstockpurchase'
      },
      {
        path: 'editstockpurchase',
        component: _import('administrationCenter/stockmanagement/stockpurchase/stockpurchase'),
        name: '修改备货申请',
        meta: {
          keepAlive: false
        },
        authority: 'editstockpurchase'
      },
      {
        path: 'viewstockpurchase',
        component: _import('administrationCenter/stockmanagement/stockpurchase/stockpurchase'),
        name: '查看备货申请',
        meta: {
          keepAlive: false
        },
        authority: 'viewstockpurchase'
      },
      {
        path: 'auditstock',
        component: _import('administrationCenter/stockmanagement/stockpurchase/auditstock'),
        name: '备货审核',
        meta: {
          keepAlive: false
        },
        authority: 'auditstock'
      },
      {
        path: 'purchasemanagement',
        component: _import('administrationCenter/stockmanagement/purchasemanagement/index'),
        name: '备货采购订单管理',
        meta: {
          keepAlive: true
        },
        authority: 'purchasemanagement'
      },
      {
        path: 'addpurchase',
        component: _import('administrationCenter/stockmanagement/purchasemanagement/stockpurchase'),
        name: '新增采购单',
        meta: {
          keepAlive: false
        },
        authority: 'addstockpurchase'
      },
      {
        path: 'editpurchase',
        component: _import('administrationCenter/stockmanagement/purchasemanagement/stockpurchase'),
        name: '修改采购单',
        meta: {
          keepAlive: false
        },
        authority: 'editpurchase'
      },
      {
        path: 'viewpurchase',
        component: _import('administrationCenter/stockmanagement/purchasemanagement/stockpurchase'),
        name: '查看采购单',
        meta: {
          keepAlive: false
        },
        authority: 'viewpurchase'
      }
      // {
      //   path: 'stockaudit',
      //   component: _import('administrationCenter/stockmanagement/stockaudit/index'),
      //   name: '备货审核管理',
      //   meta: ['备货采购申请管理', '备货审核管理'],
      //   authority: 'stockaudit',
      // },
      // {
      //   path: 'auditstock',
      //   component: _import('administrationCenter/stockmanagement/stockaudit/auditstock'),
      //   name: '备货审核',
      //   meta: ['备货采购申请管理', '备货审核管理','备货审核'],
      //   authority: 'auditstock',
      // },
    ]
  },
  {
    path: '/discountpermit',
    name: '折扣管理',
    component: webView,
    authority: 'discountpermit',
    children: [
      {
        path: 'discountapply',
        component: _import('marketing/discountpermit/discountapply/index'),
        name: '折扣申请管理',
        meta: {
          keepAlive: true
        },
        authority: 'discountapply'
	  },
	  {
        path: 'addapplication',
        component: _import('components/components/application/index'),
        name: '折扣申请新增',
        meta: {
          keepAlive: false
        },
        authority: 'addapplication'
	  },
	  {
        path: 'editapplication',
        component: _import('components/components/application/index'),
        name: '折扣申请编辑',
        meta: {
          keepAlive: false
        },
        authority: 'editapplication'
	  },
      {
        path: 'discountaudit',
        component: _import('marketing/discountpermit/discountaudit/index'),
        name: '折扣审批管理',
        meta: {
          keepAlive: true
        },
        authority: 'discountaudit'
	  },  
	  {
        path: 'auditmanagement',
        component: _import('components/components/application/index'),
        name: '折扣审核',
        meta: {
          keepAlive: false
        },
        authority: 'auditmanagement'
	  },  
	  {
        path: 'viewapplication',
        component: _import('components/components/application/index'),
        name: '折扣详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewapplication'
	  }
    ]
  },
  {
    path: '/projectpermit',
    name: '工期管理',
    component: webView,
    authority: 'projectpermit',
    children: [
      {
        path: 'projectapply',
        component: _import('marketing/projectpermit/projectapply/index'),
        name: '工期申请管理',
        meta: {
          keepAlive: true
        },
        authority: 'projectapply'
	  },
	  {
        path: 'addapplication',
        component: _import('components/components/application/index'),
        name: '工期申请新增',
        meta: {
          keepAlive: false
        },
        authority: 'addapplication'
	  },
	  {
        path: 'editapplication',
        component: _import('components/components/application/index'),
        name: '工期申请编辑',
        meta: {
          keepAlive: false
        },
        authority: 'editapplication'
	  },
      {
        path: 'projectaudit',
        component: _import('marketing/projectpermit/projectaudit/index'),
        name: '工期审批管理',
        meta: {
          keepAlive: true
        },
        authority: 'projectaudit'
      },
	  {
        path: 'auditmanagement',
        component: _import('components/components/application/index'),
        name: '工期审核',
        meta: {
          keepAlive: false
        },
        authority: 'auditmanagement'
	  },
	  {
        path: 'viewapplication',
        component: _import('components/components/application/index'),
        name: '工期详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewapplication'
	  }
    ]
  },
  {
    path: '/rebatespermit',
    name: '返点管理',
    component: webView,
    authority: 'rebatespermit',
    children: [
      {
        path: 'rebatesapply',
        component: _import('marketing/rebatespermit/rebatesapply/index'),
        name: '返点申请管理',
        meta: {
          keepAlive: false
        },
        authority: 'rebatesapply'
      },
	  {
        path: 'addapplication',
        component: _import('components/components/application/index'),
        name: '返点申请新增',
        meta: {
          keepAlive: false
        },
        authority: 'addapplication'
	  },
	  {
        path: 'editapplication',
        component: _import('components/components/application/index'),
        name: '返点申请编辑',
        meta: {
          keepAlive: false
        },
        authority: 'editapplication'
	  },
      {
        path: 'rebatesaudit',
        component: _import('marketing/rebatespermit/rebatesaudit/index'),
        name: '返点审批管理',
        meta: {
          keepAlive: false
        },
        authority: 'rebatesaudit'
      },
	  {
        path: 'auditmanagement',
        component: _import('components/components/application/index'),
        name: '返点审核',
        meta: {
          keepAlive: false
        },
        authority: 'auditmanagement'
	  },
	  {
        path: 'viewapplication',
        component: _import('components/components/application/index'),
        name: '返点详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewapplication'
	  }
    ]
  },
  {
    path: '/invoicepermit',
    name: '开票管理',
    component: webView,
    authority: 'invoicepermit',
    children: [
      {
        path: 'invoiceapply',
        component: _import('marketing/invoicepermit/invoiceapply/index'),
        name: '开票申请管理',
        meta: {
          keepAlive: true
        },
        authority: 'invoiceapply'
      },
	  {
        path: 'addapplication',
        component: _import('components/components/application/index'),
        name: '开票申请新增',
        meta: {
          keepAlive: false
        },
        authority: 'addapplication'
	  },
	  {
        path: 'editapplication',
        component: _import('components/components/application/index'),
        name: '开票申请编辑',
        meta: {
          keepAlive: false
        },
        authority: 'editapplication'
	  },
      {
        path: 'invoiceaudit',
        component: _import('marketing/invoicepermit/invoiceaudit/index'),
        name: '开票审批管理',
        meta: {
          keepAlive: true
        },
        authority: 'invoiceaudit'
	  },
	  {
        path: 'auditmanagement',
        component: _import('components/components/application/index'),
        name: '开票审核',
        meta: {
          keepAlive: false
        },
        authority: 'auditmanagement'
	  },
	  {
        path: 'viewapplication',
        component: _import('components/components/application/index'),
        name: '开票详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewapplication'
	  }
    ]
  },
  {
    path: '/refundpermit',
    name: '退款管理',
    component: webView,
    authority: 'refundpermit',
    children: [    
      {
        path: 'refundapply',
        component: _import('marketing/refundpermit/refundapply/index'),
        name: '退款申请管理',
        meta: {
          keepAlive: false
        },
        authority: 'refundapply'
      },
      {
          path: 'addapplication',
          component: _import('components/components/application/index'),
          name: '退款申请新增',
          meta: {
            keepAlive: false
          },
          authority: 'addapplication'
      },
      {
          path: 'editapplication',
          component: _import('components/components/application/index'),
          name: '退款申请编辑',
          meta: {
            keepAlive: false
          },
          authority: 'editapplication'
      },
        {
          path: 'refundaudit',
          component: _import('marketing/refundpermit/refundaudit/index'),
          name: '退款审批管理',
          meta: {
            keepAlive: false
          },
          authority: 'refundaudit'
      },
      {
          path: 'auditmanagement',
          component: _import('components/components/application/index'),
          name: '退款审核',
          meta: {
            keepAlive: false
          },
          authority: 'auditmanagement'
      },
      {
          path: 'viewapplication',
          component: _import('components/components/application/index'),
          name: '退款申请详情',
          meta: {
            keepAlive: false
          },
          authority: 'viewapplication'
      },
      {
          path: 'viewauditapplication',
          component: _import('components/components/application/index'),
          name: '退款审核详情',
          meta: {
            keepAlive: false
          },
          authority: 'viewauditapplication'
      }
    ]
  },
  {
    path: '/regoodspermit',
    name: '退货退款',
    component: webView,
    authority: 'regoodspermit',
    children: [
      {
        path: 'regoodsapply',
        component: _import('administrationCenter/regoodspermit/regoodsapply/index'),
        name: '退货退款申请',
        meta: {
          keepAlive: false
        },
        authority: 'regoodsapply'
      },
      {
          path: 'leaderexamine',
          component: _import('administrationCenter/regoodspermit/regoodsapply/leaderIndex'),
          name: '行政领导审核',
          meta: {
            keepAlive: false
          },
          authority: 'leaderexamine'
      },
	    {
        path: 'regoodsadmin',
        component: _import('administrationCenter/regoodspermit/regoodsapply/regoodsadmin'),
        name: '行政审核',
        meta: {
          keepAlive: false
        },
        authority: 'regoodsadmin'
	    },
	    {
        path: 'regoodsorder',
        component: _import('administrationCenter/regoodspermit/regoodsapply/regoodsorder'),
        name: '退货下单管理',
        meta: {
          keepAlive: false
        },
        authority: 'regoodsorder'
	    },
	    {
        path: 'addapplication',
        component: _import('administrationCenter/regoodspermit/regoodsapply/addRegoods'),
        name: '退货退款新增',
        meta: {
          keepAlive: false
        },
        authority: 'addapplication'
	    },
	    {
        path: 'editapplication',
        component: _import('administrationCenter/regoodspermit/regoodsapply/addRegoods'),
        name: '退货退款编辑',
        meta: {
          keepAlive: false
        },
        authority: 'editapplication'
	    },
	    {
        path: 'viewapplication',
        component: _import('administrationCenter/regoodspermit/regoodsapply/addRegoods'),
        name: '查看详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewapplication'
	    },
	  
	    {
        path: 'adminfiraudit',
        component: _import('administrationCenter/regoodspermit/regoodsapply/addRegoods'),
        name: '行政一审核',
        meta: {
          keepAlive: false
        },
        authority: 'adminfiraudit'
	    },
	    {
        path: 'adminsecaudit',
        component: _import('administrationCenter/regoodspermit/regoodsapply/addRegoods'),
        name: '行政二审核',
        meta: {
          keepAlive: false
        },
        authority: 'adminsecaudit'
	    },
	    {
        path: 'adminsleadeaudit',
        component: _import('administrationCenter/regoodspermit/regoodsapply/addRegoods'),
        name: '行政部领导审核',
        meta: {
          keepAlive: false
        },
        authority: 'adminsleadeaudit'
      },
      {
        path: 'orderaudit',
        component: _import('administrationCenter/regoodspermit/regoodsapply/addRegoods'),
        name: '下单员标注',
        meta: {
          keepAlive: false
        },
        authority: 'orderaudit'
      },
    //   {
    //     path: 'regoodsaudit',
    //     component: _import('administrationCenter/regoodspermit/regoodsaudit/index'),
    //     name: '退货退款审核',
    //     meta: ['退货退款', '退货退款审核'],
    //     authority: 'regoodsaudit'
    //   }
    ]
  },
  // {
  //   path: '/exchangepermit',
  //   name: '换货',
  //   component: webView,
  //   authority: 'exchangepermit',
  //   children: [
  //     {
  //       path: 'exchangeapply',
  //       component: _import('administrationCenter/exchangepermit/exchangeapply/index'),
  //       name: '申请',
  //       meta: ['换货', '申请'],
  //       authority: 'exchangeapply'
  //     },
	//   {
  //       path: 'addapplication',
  //       component: _import('components/components/application/index'),
  //       name: '换货新增',
  //       meta: ['换货', '申请', '换货新增'],
  //       authority: 'addapplication'
	//   },
	//   {
  //       path: 'editapplication',
  //       component: _import('components/components/application/index'),
  //       name: '换货编辑',
  //       meta: ['换货', '申请', '换货编辑'],
  //       authority: 'editapplication'
	//   },
  //     {
  //       path: 'exchangeaudit',
  //       component: _import('administrationCenter/exchangepermit/exchangeaudit/index'),
  //       name: '审核',
  //       meta: ['换货', '审核'],
  //       authority: 'exchangeaudit'
  //     }
  //   ]
  // },
  // {
  //   path: '/rediscountpermit',
  //   name: '退折扣',
  //   component: webView,
  //   authority: 'rediscountpermit',
  //   children: [
  //     {
  //       path: 'rediscountapply',
  //       component: _import('administrationCenter/rediscountpermit/rediscountapply/index'),
  //       name: '退折扣申请',
  //       meta: ['退折扣', '退折扣申请'],
  //       authority: 'rediscountapply'
  //     },
	//   {
  //       path: 'addapplication',
  //       component: _import('components/components/application/index'),
  //       name: '退折扣新增',
  //       meta: ['退折扣', '退折扣申请', '退折扣新增'],
  //       authority: 'addapplication'
	//   },
	//   {
  //       path: 'editapplication',
  //       component: _import('components/components/application/index'),
  //       name: '退折扣编辑',
  //       meta: ['退折扣', '申请', '退折扣编辑'],
  //       authority: 'editapplication'
	//   },
  //     {
  //       path: 'rediscountaudit',
  //       component: _import('administrationCenter/rediscountpermit/rediscountaudit/index'),
  //       name: '退折扣审核',
  //       meta: ['退折扣', '退折扣审核'],
  //       authority: 'rediscountaudit'
  //     }
  //   ]
  // },
  {
    path: '/decorationpermit',
    name: '家装代收合同',
    component: webView,
    authority: 'decorationpermit',
    children: [
      {
        path: 'decorationapply',
        component: _import('administrationCenter/decorationpermit/decorationapply/index'),
        name: '家装代收合同申请',
        meta: {
          keepAlive: true
        },
        authority: 'decorationapply'
      },
	  {
        path: 'addapplication',
        component: _import('components/components/application/index'),
        name: '家装代收合同新增',
        meta: {
          keepAlive: false
        },
        authority: 'addapplication'
	  },
	  {
        path: 'editapplication',
        component: _import('components/components/application/index'),
        name: '家装代收合同编辑',
        meta: {
          keepAlive: false
        },
        authority: 'editapplication'
	  },
      {
        path: 'decorationaudit',
        component: _import('administrationCenter/decorationpermit/decorationaudit/index'),
        name: '家装代收合同审批管理',
        meta: {
          keepAlive: true
        },
        authority: 'decorationaudit'
	  },
	  {
        path: 'auditmanagement',
        component: _import('components/components/application/index'),
        name: '家装代收合同审核',
        meta: {
          keepAlive: false
        },
        authority: 'auditmanagement'
	  },
	  {
        path: 'viewapplication',
        component: _import('components/components/application/index'),
        name: '家装代收合同详情',
        meta: {
          keepAlive: false
        },
        authority: 'viewapplication'
	  }
    ]
  },
  // {
  //   path: '/minemanagement',
  //   name: '我的',
  //   component: webView,
  //   authority: 'minemanagement',
  //   children: [
  //     {
  //       path: 'myapplication',
  //       component: _import('administrationCenter/minemanagement/myapplication/index'),
  //       name: '申请',
  //       meta: ['我的', '我的申请'],
  //       authority: 'myapplication'
	//   },
  //     {
  //       path: 'addapplication',
  //       component: _import('components/components/application/index'),
  //       name: '我的申请新增',
  //       meta: ['我的', '我的申请', '我的申请新增'],
  //       authority: 'addapplication'
  //     },
  //     {
  //       path: 'editapplication',
  //       component: _import('components/components/application/index'),
  //       name: '我的申请编辑',
  //       meta: ['我的', '我的申请', '我的申请编辑'],
  //       authority: 'editapplication'
  //     },
  //     {
  //       path: 'myaudit',
  //       component: _import('administrationCenter/minemanagement/myaudit/index'),
  //       name: '我的审核',
  //       meta: ['我的', '我的审核'],
  //       authority: 'myaudit'
  //     },
  //     {
  //       path: 'audit',
  //       component: _import('administrationCenter/minemanagement/myapplication/editapplication'),
  //       name: '审核',
  //       meta: ['我的', '我的审核', '审核'],
  //       authority: 'audit'
  //     }
  //     // {
  //     //   path: 'decorationaudit',
  //     //   component: _import('administrationCenter/decorationpermit/decorationaudit/index'),
  //     //   name: '审核',
  //     //   meta: ['我的', '审核'],
  //     //   authority: 'decorationaudit',
  //     // },
  //   ]
  // },
  {
    path: '/scrapmanagement',
    name: '报废管理',
    component: webView,
    authority: 'scrapmanagement',
    children: [
      {
        path: 'scrap',
        component: _import('entrepotSet/scrapmanagement/index'),
        name: '报废管理',
        meta: {
          keepAlive: true
        },
        authority: 'scrap'
      },
      {
        path: 'addscrap',
        component: _import('entrepotSet/scrapmanagement/addScrap'),
        name: '报废管理',
        meta: {
          keepAlive: false
        },
        authority: 'addscrap'
      },
      {
        path: 'chosepro',
        component: _import('entrepotSet/scrapmanagement/components/chosepro'),
        name: '填写报废数量',
        meta: {
          keepAlive: false
        },
        authority: 'chosepro'
      },
      {
        path: 'choseord',
        component: _import('entrepotSet/scrapmanagement/components/choseord'),
        name: '填写报废数量',
        meta: {
          keepAlive: false
        },
        authority: 'choseord'
      }
    ]
  },
  {
    path: '/borrowedmanage',
    name: '借还货管理',
    component: webView,
    authority: 'borrowedmanage',
    children: [
      {
        path: 'lending',
        component: _import('entrepotSet/borrowedmanage/index'),
        name: '借货',
        meta: {
          keepAlive: true
        },
        authority: 'upsample'
      },
      {
        path: 'lendingdetails',
        component: _import('entrepotSet/borrowedmanage/lendingdetails'),
        name: '借货详情',
        meta: {
          keepAlive: false
        },
        authority: 'lendingdetails'
      },
      {
        path: 'returndetails',
        component: _import('entrepotSet/borrowedmanage/returndetails'),
        name: '还货详情',
        meta: {
          keepAlive: false
        },
        authority: 'returndetails'
      },
      {
        path: 'otherdetails',
        component: _import('entrepotSet/borrowedmanage/otherdetails'),
        name: '其他还货',
        meta: {
          keepAlive: false
        },
        authority: 'otherdetails'
      },
      {
        path: 'choseord',
        component: _import('entrepotSet/borrowedmanage/components/choseord'),
        name: '选择订单',
        meta: {
          keepAlive: false
        },
        authority: 'choseord'
      }
    ]
  },
  {
    path: '/contractmanagement',
    name: '合同管理',
    component: webView,
    authority: 'activity',
    children: [
      {
        path: 'auditContract',
        component: _import('administrationCenter/contractmanagement/audit/index'),
        name: '合同审核管理',
        meta: {
          keepAlive: true
        },
        authority: 'auditContract'
      },
      {
        path: 'placeOrderContract',
        component: _import('administrationCenter/contractmanagement/placeOrder/index'),
        name: '合同拆单管理',
        meta: {
          keepAlive: true
        },
        authority: 'placeOrderContract'
      },
      {
        path: 'purchaseOrderAccountCheck',
        component: _import('administrationCenter/contractmanagement/purchaseOrderAccountCheck'),
        name: '采购单对账管理',
        meta: {
          keepAlive: true
        },
        authority: 'purchaseOrderAccountCheck'
      },
      {
        path: 'purchaseOrderReconciliation',
        component: _import('administrationCenter/contractmanagement/purchaseOrderReconciliation'),
        name: '导入采购单',
        meta: {
          keepAlive: false
        },
        authority: 'purchaseOrderReconciliation'
      },
      {
        path: 'addPurchaseOrder',
        component: _import('administrationCenter/contractmanagement/addPurchaseOrder'),
        name: '添加采购单',
        meta: {
          keepAlive: true
        },
        authority: 'addPurchaseOrder'
      },
      {
        path: 'finalStatement',
        component: _import('administrationCenter/contractmanagement/finalStatement'),
        name: '结算单列表',
        meta: {
          keepAlive: true
        },
        authority: 'finalStatement'
      },
      {
        path: 'supplierStatement',
        component: _import('administrationCenter/contractmanagement/finalStatement/index'),
        name: '供货商结算单',
        meta: {
          keepAlive: false
        },
        authority: 'finalStatement'
      },
      {
        path: 'importStatement',
        component: _import('administrationCenter/contractmanagement/purchaseOrderAccount/index'),
        name: '导入结算单',
        meta: {
          keepAlive: false
        },
        authority: 'importStatement'
      },
      {
        path: 'needDispose',
        component: _import('administrationCenter/contractmanagement/purchaseOrderAccount/needDispose'),
        name: '需要处理',
        meta: {
          keepAlive: false
        },
        authority: 'needDispose'
      },
      {
        path: 'contractView',
        component: _import('administrationCenter/contractmanagement/contractView'),
        name: '合同管理',
        meta: {
          keepAlive: false
        },
        authority: 'contractView'
      },
      {
        path: 'contractAudit',
        component: _import('administrationCenter/contractmanagement/audit'),
        name: '合同审核',
        meta: {
          keepAlive: false
        },
        authority: 'contractAudit'
      },
      {
        path: 'contractPlaceOrder',
        component: _import('administrationCenter/contractmanagement/placeOrder'),
        name: '下单',
        meta: {
          keepAlive: false
        },
        authority: 'contractPlaceOrder'
      }
    ]
  },
  {
    path: '/home',
    component: webView,
    redirect: '/brandmanagement',
    name: '前端首页',
    hidden: true,
    children: [
    // //品牌管理
    // {
    //   path: '/brandmanagement',
    //   component: _import('productmanage/brandmanagement/brandmanagement'),
    //   name: '品牌管理',
    //   meta: ['商品管理', '品牌管理']
    // },
    // {
    //   path: '/introduction',
    //   component: Layout,
    //   redirect: '/introduction/index',
    //   icon: 'form',
    //   noDropdown: true,
    //   children: [{
    //     path: 'index',
    //     component: _import('introduction/index'),
    //     name: '简述'
    //   }]
    // },
    // 行政中心-系统参数设置-活动维护



    // 收款管理
    ]
  }]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const asyncRouterMap = [{
  path: '/baseManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  authority: 'baseManager',
  children: [{
    path: 'userManager',
    icon: 'fa-user',
    component: _import('admin/user/index'),
    name: '用户管理',
    authority: 'userManager'
  }, {
    path: 'menuManager',
    icon: 'category',
    component: _import('admin/menu/index'),
    name: '菜单管理',
    authority: 'menuManager'
  }, {
    path: 'groupManager',
    icon: 'group_fill',
    component: _import('admin/group/index'),
    name: '角色权限管理',
    authority: 'groupManager'
  }, {
    path: 'groupTypeManager',
    icon: 'fa-users',
    component: _import('admin/groupType/index'),
    name: '角色类型管理',
    authority: 'groupTypeManager'
  }, {
    path: 'gateLogManager',
    icon: 'viewlist',
    component: _import('admin/gateLog/index'),
    name: '操作日志管理',
    authority: 'gateLogManager'
  }, {
    path: 'dictManager',
    icon: 'fa-user',
    component: _import('admin/dictionary/index'),
    name: '字典管理',
    authority: 'dictManager'
  }, {
    path: 'msgManager',
    icon: 'fa-user',
    component: _import('admin/msgPush/index'),
    name: '消息推送',
    authority: 'msgManager'
  }]
},
{
  path: '/authManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  authority: 'authManager',
  children: [{
    path: 'serviceManager',
    component: _import('auth/service/index'),
    name: '用户管理',
    authority: 'serviceManager'
  }]
},
{
  path: '/logManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  authority: 'authManager',
  children: [{
    path: 'sysLogManager',
    icon: 'fa-user',
    component: _import('admin/log/sysLog/index'),
    name: '系统日志',
    authority: 'sysLogManager'
  },
  {
    path: 'bizLogManager',
    icon: 'fa-user',
    component: _import('admin/log/bizLog/index'),
    name: '业务日志',
    authority: 'bizLogManager'
  }
  ]
},
{
  path: '/monitorManager',
  component: Layout,
  name: '监控模块管理',
  icon: 'setting',
  authority: 'monitorManager',
  children: [{
    path: 'serviceEurekaManager',
    component: _import('monitor/eureka/index'),
    name: 'Eureka注册中心',
    authority: 'serviceEurekaManager'
  }, {
      path: 'serviceMonitorManager',
      component: _import('monitor/service/index'),
      name: '服务状态监控',
      authority: 'serviceMonitorManager'
    }, {
      path: 'serviceZipkinManager',
      component: _import('monitor/zipkin/index'),
      name: '服务状态监控',
      authority: 'serviceZipkinManager'
    }, {
      path: 'onlineManager',
      component: _import('admin/online/index'),
      name: '在线用户',
      authority: 'onlineManager'
    }]
},
{
  path: '/flowManner',
  component: Layout,
  name: '工作流管理',
  icon: 'setting',
  authority: 'flowManner',
  children: [{
    path: 'flow',
    component: _import('flow/index/index'),
    name: '工作流引擎',
    authority: 'flow'
  }]
}
];
