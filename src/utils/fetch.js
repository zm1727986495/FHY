import axios from 'axios';
import {
  Message,
  MessageBox
} from 'element-ui';
import router from '../router';
import store from '../store';
import {
  getToken
} from 'utils/auth';

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  // timeout: 9500000 // 请求超时时间
  widthCredentials: true
});
axios.defaults.widthCredentials = true;
// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = getToken(); // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    const res = response.data;
    if (response.status === 401 || res.status === 40101) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      })
      return Promise.reject('error');
    }
    if (res.status === 40301) {
      Message({
        message: '登录已过期',
        type: 'error',
        duration: 5 * 1000
      });
      router.replace({
        path: '/login' // 到登录页重新获取token
      })
      return Promise.reject('error');
    }
    if (res.status === 40302) {
      Message({
        message: '当前无权限',
        type: 'error',
        duration: 5 * 1000
      });
    }
    if (res.status === 40001) {
      Message({
        message: '账户或密码错误！',
        type: 'warning'
      });
      return Promise.reject('error');
    }
    if (response.status !== 200 && res.status !== 200) {
      console.log(response)
    } else {
      return response.data;
    }
  },
  error => {
    // console.log(error); // for debug
    return Promise.reject(error);
  }
);

export default service;
