// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
// import 'assets/custom-theme/index.css'; // 换肤版本element-ui css
import './styles/public_ymm.css'
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import 'static/baiduUe/ueditor.config.js';// 百度编辑器
import 'static/baiduUe/ueditor.all.js';// 百度编辑器
import 'static/baiduUe/lang/zh-cn/zh-cn.js';// 百度编辑器
import 'static/baiduUe/ueditor.parse.js';// 百度编辑器
import 'normalize.css/normalize.css';// normalize.css 样式格式化
import 'assets/iconfont/iconfont'; // iconfont 具体图标见https://github.com/PanJiaChen/vue-element-admin/wiki
import * as filters from './filters'; // 全局vue filter
import Multiselect from 'vue-multiselect';// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css';// 多选框组件css
import Sticky from 'components/Sticky'; // 粘性header组件
import IconSvg from 'components/Icon-svg';// svg 组件
import vueWaves from './directive/waves';// 水波纹指令
import errLog from 'store/errLog';// error log组件
import './mock/index.js';  // 该项目所有请求使用mockjs模拟
import { getToken } from 'utils/auth';// 登录Token
import BaiduMap from 'vue-baidu-map';// 百度地图
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
// import Print from '@/plugs/print'
import Print from 'vue-print-nb'
Vue.use(Print); // 注册
// import 'babel-polyfill';//支持IE执行原生script
// register globally
Vue.use(VXETable);
Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
Vue.component('icon-svg', IconSvg)
Vue.use(ElementUI);
Vue.use(vueWaves);
Vue.use(BaiduMap, {
  ak:'yRWUo5Q8pqlTlbhkU5Bz6xSV2znzY0Vu'
});
Vue.prototype.$loca = window.localStorage;
// BUS
const Bus = new Vue();
Vue.prototype.HOST = '/api'
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
// register global progress.
const whiteList = ['/login', '/loginJava', '/authredirect'];// 不重定向白名单
router.beforeEach((to, from, next) => {
  if (!(to.path === '/contractmanagement/needDispose' || to.path === '/ordermm/details' || to.path === '/contractmanagement/addPurchaseOrder')) {
    window.localStorage.removeItem('addPurchaseOrderParams')
  }
  NProgress.start(); // 开启Progress
  next();
  if (getToken()) { // 判断是否有token
    store.dispatch('storeCollection');
    // localStorage.setItem('queryForm', JSON.stringify(0));
    // if (to.path === '/login') {
    //   next({ path: '/' });
    // } else {
    if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetInfo').then(info => { // 拉取user_info
        const menus = {};
        for (let i = 0; i < info.menus.length; i++) {
          menus[info.menus[i].code] = true;
        }
        // store.dispatch('priceList');
        store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to }); // hack方法 确保addRoutes已完成
        })
      }).catch(() => {
        store.dispatch('FedLogOut').then(() => {
          next({ path: '/login' });
        })
      })
    } else {
      //  else {
      //   // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      //   if (hasPermission(store.getters.roles, to.meta.role)) {
      //     next();//
      //   } else {
      next();
      //   }
      //   // 可删 ↑
    }
    // }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login'); // 否则全部重定向到登录页
      NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

Vue.config.productionTip = false;

// 生产环境错误日志
if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}

new Vue({
  el: '#app',
  router,
  store,
  data: {
    Bus
  },
  template: '<App/>',
  components: { App }
})
