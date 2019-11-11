import {
  loginByEmail,
  logout,
  getInfo,
  getMenus,
  menusFront,
  listLoginUserStore
} from 'api/login';
import store from 'store'
import {
  listCommodityActivityRule,
  listActivityRule,
  listPriceStrategy
} from 'api/order/budgetdetailed/budgetdetailed';
import { setUpLoginUserStore } from "@/api/login"
import {
  getToken,
  setToken,
  setUpToken,
  removeToken
} from 'utils/auth';
import { editUserInfo } from '@/api/admin/user/index';
const user = {
  state: {
    maxHeight: 460,
    size: 'medium',
    btnSize: 'small',
    span: 4,
    user: '',
    storesList: [],
    status: '',
    code: '',
    token: getToken(),
    upToken: '',
    name: '',
    id: '',
    avatar: '',
    introduction: '',
    roles: [],
    systemVersion: 0,
    menus: undefined,
    eleemnts: undefined,
    permissionMenus: undefined,
    webMenus: undefined,
    webMenusFront: undefined,//上导航栏接口数据
    setting: {
      articlePlatform: []
    },
    paymentcenter: '', //派单中心列表状态
    repaircenter: '', //派单维修中心列表状态
    proList: [],      //调拨管理页面传递的库区列表数据
    commodity: [], // 预算请清单 已选商品数据
    ruleStting: [], // 预算清单 已选活动
    ruleSunning: [], // 预算清单 已选择活动下 所有规则
    selectedActivities: [], // 预算清单 已选择商品 下所有活动规则
    storagearea: {}, // 保存入库货区货位
    productList: [],  // 报废管理页面点击选择商品的确定按钮
	  oderList: [], // 报废管理页面点击选择订单的确定按钮
    selectedDetails: [], // 借还货管理选择的详情组
    activeStoreId: {}, //已选择门店
    storesList:[], //门店列表
    priceLists: [], //价格策略
    stackList:{}, //组套商品
    returnvisit:{} //回访查询条件
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UPTOKEN: (state, upToken) => {
      state.upToken = upToken;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_SYSTEMVERSION: (state, systemVersion) => {
      state.systemVersion = systemVersion
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus;
    },
    SET_WEB_MENUS: (state, webMenus) => {
      state.webMenus = webMenus;
    },
    SET_WEB_MENUS_FRONT: (state, webMenusFront) => {
      state.webMenusFront = webMenusFront;
    },
    SET_COMMODITY: (state, commodity) => {
      state.commodity = commodity;
    },
    SET_RULESTTING: (state, ruleStting) => {
      state.ruleStting = ruleStting;
    },
    SET_SELECTEDACTIVITIES: (state, selectedActivities) => {
      state.selectedActivities = selectedActivities;
    },
    SET_RULESUNNING: (state, ruleSunning) => {
      state.ruleSunning = ruleSunning;
    },
    SET_PAYMENT: (state, paymentStr) => {
      state.paymentcenter = paymentStr;
    },
    SET_REPAIRCENTER: (state, repaircenterStr) => {
      state.repaircenter = repaircenterStr;
    },
    SET_PROLIST: (state, proListObj) => {
      state.proList = proListObj;
    },
    SET_STORAGEAREA: (state, storageareaArr) => {
      state.storagearea = storageareaArr
    },
    SET_PRODUCTLIST: (state, productListObj) => {
      state.productList = productListObj;
    },
    SET_ORDERLIST: (state, orderList) => {
      state.oderList = orderList;
    },
    SET_SELECTEDDETAILS: (state, selectedDetails) => {
      state.selectedDetails = selectedDetails;
    },
    SET_ACTIVESTOREID: (state, activeStoreId) => {
      state.activeStoreId = activeStoreId;
    },
    SET_STORESLIST: (state, storesList) => {
      state.storesList = storesList;
    },
    SET_PRICELISTS: (state, priceLists) => {
      state.priceLists = priceLists;
    },
    SET_STACKLIST: (state, stackList) => {
      console.log(stackList)
      state.stackList = stackList;
    },
    SET_RETURNVISIT:(state,visitObj)=>{
      state.returnvisit = visitObj
    }
  },

  actions: {
    // 邮箱登录
    LoginByEmail({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();
      window.localStorage.removeItem('Store');
      window.localStorage.removeItem('activeStoreId');
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      commit('SET_PRICELISTS', []);
      commit('SET_MENUS', undefined);
      commit('SET_ELEMENTS', undefined);
      removeToken();
      return new Promise((resolve, reject) => {
        loginByEmail(username, userInfo.password).then(response => {
          if(response.status == 200){
            // store.dispatch('storeCollection');
            setToken(response.data.token);
            setUpToken(response.data.upToken);
            commit('SET_TOKEN', response.data.token);
            commit('SET_UPTOKEN', response.data.upToken);
          }
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response;
          commit('SET_ROLES', 'admin');
          commit('SET_SYSTEMVERSION', data.systemVersion);
          commit('SET_NAME', data.name);
          commit('SET_ID', data.id);
          localStorage.setItem("loggedObj",JSON.stringify({name:data.name,id:data.id}));//存储当前登录人
          commit('SET_AVATAR', 'http://git.oschina.net/uploads/42/547642_geek_qi.png?1499487420');
          commit('SET_INTRODUCTION', data.description);
          const menus = {};
          for (let i = 0; i < data.menus.length; i++) {
            menus[data.menus[i].code] = true;
          }
          commit('SET_MENUS', menus);
          const elements = {};
          for (let i = 0; i < data.elements.length; i++) {
            elements[data.elements[i].code] = true;
          }
          window.localStorage.setItem("element", JSON.stringify(elements));
          commit('SET_ELEMENTS', elements);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
        getMenus(state.token).then(response => {
          let array = [];
          response.forEach(item => {
            if (item.id == 59) {
              array = item.children;
            }
          });
          commit('SET_PERMISSION_MENUS', response);
          commit('SET_WEB_MENUS', array);
        });
        menusFront(getToken()).then(res => {
          commit('SET_WEB_MENUS_FRONT', res);
        });
      });
    },
    /**
     * 获取价格策略
     * @method priceList
     */
    priceList({
      commit,
      state
    }, code){
      return new Promise((resolve, reject)=>{
        let types = 0;
        listPriceStrategy({type: types}).then(res => {
          commit('SET_PRICELISTS', res.data);
            resolve(res.data);
        }).catch(error =>{
          reject(error); 
        })
      })
  },
    /**
     * 
     * 获取门店列表
     * @mthod storeCollection
     */
    storeCollection({
      commit,
      state
    }, code){
      return new Promise((resolve, reject)=>{
        listLoginUserStore().then(res => {
          let arr = [];
          res.data.map(item => {
            arr.push({storeId: item.storeId, storeName: item.storeName});
          })
          window.localStorage.setItem('Store', JSON.stringify(arr));
            commit('SET_STORESLIST', arr);
          if (window.localStorage.getItem("activeStoreId") != null) {

          } else {
            if(res.data.length != 0){
              window.localStorage.setItem('activeStoreId', JSON.stringify(arr[0]));
              commit('SET_ACTIVESTOREID', arr[0]);   
              store.dispatch('SetStore');    
            }else{
              commit('SET_ACTIVESTOREID', {storeId: null, storeName: null});  
              localStorage.setItem('activeStoreId', JSON.stringify(state.activeStoreId));
              store.dispatch('SetStore');
            }
          }
          
          resolve(res);
        }).catch(error=> {
          reject(error);
        })
      })
    },
    /**
     * 提交已选择门店
     * @method SetStore
     */
    SetStore({
      commit,
      state
    }, code) {
      return new Promise ((resolve, reject) => {
        let arr = JSON.parse(localStorage.getItem('activeStoreId'));
        setUpLoginUserStore({ storeId: arr.storeId, storeName: arr.storeName }).then(res => {
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      })
    },
    // 第三方验证登录
    LoginByThirdparty({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code).then(response => {
          commit('SET_TOKEN', response.data.token);
          commit('SET_UPTOKEN', response.data.upToken);
          setToken(response.data.token);
          setUpToken(response.data.upToken);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    /**
     * 获取商品下的活动规则
     * @method getCommodity
     */
    getCommodity({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        let arr = [];
        state.commodity.forEach(item => {
          item.commodity.forEach(res => {
            arr.push(Number(res.commodityId));
          })
        })
        arr = [...new Set(arr)].join();
        listCommodityActivityRule({
          commodityId: arr,
          activityId: state.ruleStting
        }).then(res => {
          res.data.forEach(item => {
            item.checkedList = [];
            state.ruleSunning.forEach(date => {
              item.allActivityRules.forEach(el => {
                if (el.activityRuleId == date.activityRuleId) {
                  el.mutexId = date.mutexId;
                  el.isWholeRule = date.isWholeRule;
                }
              })
            })
          })
          commit('SET_SELECTEDACTIVITIES', res.data)
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },
    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_MENUS', undefined);
          commit('SET_ELEMENTS', undefined);
          commit('SET_PERMISSION_MENUS', undefined);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    /**
     * 获取活动下的规则
     * @method activeRuleList
     */
    activeRuleList({
      commit,
      state
    }, item) {
      return new Promise((resolve, reject) => {
        listActivityRule({ activityId: item.activeId }).then(res => {
          commit('SET_RULESTTING', item.activeId);
          commit('SET_RULESUNNING', res.data);
          if (item.type) {
            store.dispatch('getCommodity');
          }
        }).catch(error => {
          console.error('新增预算清单 活动规则查询 /src/store/modules/user', error);
          reject(error);
        })
      })
    },
    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENUS', undefined);
        commit('SET_ELEMENTS', undefined);
        commit('SET_PERMISSION_MENUS', undefined);
        removeToken();
        commit('SET_ACTIVESTOREID',[]);
        store.dispatch('SetStore');
        resolve();
      });
    },
    // 前端 修改密码
    FedUpdatePwd({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        editUserInfo(params).then(res => {
          resolve(res);
        }).catch(error => {
          console.error('修改密码 /src/store/modules/user', error);
          reject(error);
        })
      })
    },
    // 动态修改权限
    ChangeRole({
      commit
    }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        setToken(role);
        resolve();
      })
	},

  }
};

export default user;
