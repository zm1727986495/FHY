const contractmanagement = {
  state: {
    rowsData: [], // 全选和单选 选中的数据
    tablesData: [], // 采购合同所有的数据
    moveSelectRow: {}, // 加入库取选中的数据
    orderDetails: {}, // 订单详情
    contractDetails: {}, // 合同详情
    selectedInfo: {}, // 活动里基本信息选中的品牌品类
    purchaseOrderList: [], // 采购单列表,
    colorList: [], // 颜色字典
    seriesList: [], // 系列字典
    materialList: [], // 材质字典,
    roomList: [], // 房间字典
    companyList: [], // 公司、供应商
    orderSelectList: [],// 订单选中列表,
    isOnFocus: false // 是否是在焦点状态
  },
  mutations: {
    SELECT_ROWS: (state, arr) => {
      state.rowsData = arr;
    },
    TABLE_DATA: (state, arr) => {
      state.tablesData = arr;
    },
    MOVE_SELECT_ROW: (state, obj) => {
      state.moveSelectRow = obj;
    },
    ORDER_DETAILS: (state, obj) => {
      state.orderDetails = obj;
    },
    CONTRACT_DETAILS: (state, obj) => {
      state.contractDetails = obj;
    },
    SELECTED_INFO: (state, obj) => {
      state.selectedInfo = obj;
    },
    PURCHASE_ORDER_LIST: (state, arr) => {
      state.purchaseOrderList = arr;
    },
    COLOR_LIST: (state, arr) => {
      state.colorList = arr;
    },
    SERIES_LIST: (state, arr) => {
      state.seriesList = arr;
    },
    MATERIAL_LIST: (state, arr) => {
      state.materialList = arr;
    },
    ROOM_LIST: (state, arr) => {
      state.roomList = arr;
    },
    COMPANY_LIST: (state, arr) => {
      state.companyList = arr;
    },
    ORDER_SELECT_LIST: (state, arr) => {
      state.orderSelectList = arr;
    },
    ON_FOCUS: (state, status) => {
      state.isOnFocus = status;
    }
  },
  actions: {
    CHOOSE_SELECT: ({ commit }, rows) => {
      commit('SELECT_ROWS', rows);
    },
    QUERY_TABLEDATA: ({ commit }, rows) => {
      commit('TABLE_DATA', rows);
    },
    MOVETO_WAREHOUSE: ({ commit }, row) => {
      commit('MOVE_SELECT_ROW', row);
    },
    SET_ORDER_DETAILS: ({ commit }, row) => {
      commit('ORDER_DETAILS', row);
    },
    SET_CONTRACT_DETAILS: ({ commit }, row) => {
      commit('CONTRACT_DETAILS', row);
    },
    SET_SELECTED_INFO: ({ commit }, row) => {
      commit('SELECTED_INFO', row);
    },
    SET_PURCHASE_ORDER_LIST: ({ commit }, rows) => {
      commit('PURCHASE_ORDER_LIST', rows);
    },
    SET_COLOR_LIST: ({ commit }, rows) => {
      commit('COLOR_LIST', rows);
    },
    SET_SERIES_LIST: ({ commit }, rows) => {
      commit('SERIES_LIST', rows);
    },
    SET_MATERIAL_LIST: ({ commit }, rows) => {
      commit('MATERIAL_LIST', rows);
    },
    SET_ROOM_LIST: ({ commit }, rows) => {
      commit('ROOM_LIST', rows);
    },
    SET_COMPANY_LIST: ({ commit }, rows) => {
      commit('COMPANY_LIST', rows);
    },
    SET_ORDER_SELECT_LIST: ({ commit }, rows) => {
      commit('ORDER_SELECT_LIST', rows);
    }
  }
}
export default contractmanagement;
