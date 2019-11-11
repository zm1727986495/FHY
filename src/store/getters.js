const getters = {
  maxHeight: state => state.user.maxHeight,
  size: state => state.user.size,
  btnSize: state => state.user.btnSize,
  span: state => state.user.span,
  sidebar: state => state.app.sidebar,
  heavbar: state => state.app.heavbar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  upToken: state => state.user.uptoken,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  systemVersion: state => state.user.systemVersion,
  menus: state => state.user.menus,
  elements: state => state.user.elements,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  permissionMenus: state => state.user.permissionMenus,
  webMenus: state => state.user.webMenus,
  webMenusFront: state => state.user.webMenusFront,
  commodity: state => state.user.commodity,
  ruleStting: state => state.user.ruleStting,
  selectedActivities: state => state.user.selectedActivities,
  ruleSunning: state => state.user.ruleSunning,
  paymentcenter: state => state.user.paymentcenter,
  repaircenter: state => state.user.repaircenter,
  storagearea: state => state.user.storagearea,
  proList: state => state.user.proList,
  returnvisit:state => state.user.returnvisit,
  rowsData: state => state.contractmanagement.rowsData,
  tablesData: state => state.contractmanagement.tablesData,
  moveSelectRow: state => state.contractmanagement.moveSelectRow,
  orderDetails: state => state.contractmanagement.orderDetails,
  contractDetails: state => state.contractmanagement.contractDetails,
  selectedInfo: state => state.contractmanagement.selectedInfo,
  purchaseOrderList: state => state.contractmanagement.purchaseOrderList,
  colorList: state => state.contractmanagement.colorList,
  seriesList: state => state.contractmanagement.seriesList,
  materialList: state => state.contractmanagement.materialList,
  roomList: state => state.contractmanagement.roomList,
  companyList: state => state.contractmanagement.companyList,
  orderSelectList: state => state.contractmanagement.orderSelectList,
  productList: state => state.user.productList,
  oderList: state => state.user.orderList,
  selectedDetails: state => state.user.selectedDetails,
  activeStoreId: state => state.user.activeStoreId,
  storesList: state => state.user.storesList,
  priceLists: state => state.user.priceLists,
  stackList: state => state.user.stackList,
  isOnFocus: state => state.contractmanagement.isOnFocus
};
export default getters