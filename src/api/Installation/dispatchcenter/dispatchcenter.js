import fetch from 'utils/fetch';
export function listInstallationOrder(query) { // 获取列表
  return fetch({
    url: '/api/pc/installationOrder/listInstallationOrder',
    method: 'get',
    params: query
  });
}

export function listCategory(query) { //获取品类
  return fetch({
    url: '/api/pc/common/listCategory',
    method: 'get',
    params: query
  });
}

export function getStorageList(query) { //获取仓库
  return fetch({
    url: '/api/pc/storage/getStorageList',
    method: 'get',
    params: query
  });
}

export function listStore(query) { //获取门店
  return fetch({
    url: '/api/pc/common/listStore',
    method: 'get',
    params: query
  });
}



export function editInstallationOrder(query) { //接单
  return fetch({
    url: '/api/pc/installationOrder/editInstallationOrder',
    method: 'put',
    data: query
  });
}

export function edirRejectInstallationOrder(query) { //转单和驳回
  return fetch({
    url: '/api/pc/installationOrder/edirRejectInstallationOrder',
    method: 'put',
    data: query
  });
}

export function editInformCustomer(query) { //修改安装状态
  return fetch({
    url: '/api/pc/installationOrder/editInformCustomer',
    method: 'put',
    data: query
  });
}

export function editTransferInstallationOrder(query) { //转单撤回
  return fetch({
    url: '/api/pc/installationOrder/editTransferInstallationOrder',
    method: 'put',
    data: query
  });
}

export function listTransfer(query) { // 转单列表
  return fetch({
    url: '/api/pc/installationOrder/listTransfer',
    method: 'get',
    params: query
  });
}

export function listSynergyOrder(query) { // 获取协同单列表
  return fetch({
    url: '/api/pc/installationOrder/listSynergyOrder',
    method: 'get',
    params: query
  });
}


export function listLibrariesTake(query) { // 库取单
  return fetch({
    url: '/api/pc/installationTasks/listLibrariesTake',
    method: 'get',
    params: query
  });
}


export function listPurchaseOrder(query) { // 订单采购单的货区货位
  return fetch({
    url: '/api/pc/installationTasks/listPurchaseOrder',
    method: 'get',
    params: query
  });
}

export function addAppointmentDoor(query) { //预约上门时间
  return fetch({
    url: '/api/pc/installationOrder/addAppointmentDoor',
    method: 'post',
    data: query
  });
}

export function editUrgent(query) { //加急和取消加急
  return fetch({
    url: '/api/pc/installationOrder/editUrgent',
    method: 'put',
    data: query
  });
}

export function appointmentDoorDetails(query) { // 指派出库信息回显
  return fetch({
    url: '/api/pc/installationTasks/appointmentDoorDetails',
    method: 'get',
    params: query
  });
}

export function addSesignateOutLibrary(query) { //指派出库
  return fetch({
    url: '/api/pc/installationTasks/addSesignateOutLibrary',
    method: 'post',
    data: query
  });
}

export function editIsSpeed(query) { //修改到货状态
  return fetch({
    url: '/api/pc/installationOrder/editIsSpeed',
    method: 'put',
    data: query
  });
}


export function addReturnFactory(query) { //增加返厂
  return fetch({
    url: '/api/pc/installationTasks/addReturnFactory',
    method: 'post',
    data: query
  });
}

export function listAppointmentDoor(query) { // 安装预约日志
  return fetch({
    url: '/api/pc/installationTasks/listAppointmentDoor',
    method: 'get',
    params: query
  });
}

export function listInstallJobs(query) {          //维修任务列表
  return fetch({
    url: '/api/pc/designateInstallation/listInstallJobs',
    method: 'get',
    params: query
  });
}

export function listInstallJobsAuthority(query) {          //任务列表
  return fetch({
    url: '/api/pc/designateInstallation/listInstallJobsAuthority',
    method: 'get',
    params: query
  });
}

export function installDay(query) {              //维修任务列表步骤条
  return fetch({
    url: '/api/pc/designateInstallation/installDay',
    method: 'get',
    params: query
  });
}

export function listInstallationReport(query) {  //维修工作汇报日志
  return fetch({
    url: '/api/pc/designateInstallation/listInstallationReport',
    method: 'get',
    params: query
  });
}

export function listStryppedDown(query) {        //维修改制日志
  return fetch({
    url: '/api/pc/stryppedDown/listStryppedDown',
    method: 'get',
    params: query
  });
}

export function listTaskDuty(query) {        //定责申请日志
  return fetch({
    url: '/api/pc/taskDuty/listTaskDuty',
    method: 'get',
    params: query
  });
}

export function listReturnFactory(query) { // 返厂日志
  return fetch({
    url: '/api/pc/installationTasks/listReturnFactory',
    method: 'get',
    params: query
  });
}

export function listAfterSalesProblemRecord(query) {   // 问题日志
  return fetch({
    url: '/api/pc/questionnaire/listAfterSalesProblemRecord',
    method: 'get',
    params: query
  });
}


export function listOrganization(query) {  // 获取组织机构
  return fetch({
    url: '/api/pc/common/listOrganization',
    method: 'get',
    params: query
  });
}

export function designateInstallationDetails(query) {  //指派安装信息回显  
  return fetch({
    url: '/api/pc/designateInstallation/designateInstallationDetails',
    method: 'get',
    params: query
  });
}

export function addDesignateInstallation(query) {     //派安装单
  return fetch({
    url: '/api/pc/designateInstallation/addDesignateInstallation',
    method: 'post',
    data: query
  });
}

export function listDesignateOutLibraryDesies(query) {  //指派安装订单商品信息回显   
  return fetch({
    url: '/api/pc/designateInstallation/listDesignateOutLibraryDesies',
    method: 'get',
    params: query
  });
}

export function listLibrariesTakeor(query) {         //指派安装 库取 礼品 信息回显     
  return fetch({
    url: '/api/pc/designateInstallation/listLibrariesTake',
    method: 'get',
    params: query
  });
}

export function listDesignateOutLibrary(query) {         //库房出库日志
  return fetch({
    url: '/api/pc/installationTasks/listDesignateOutLibrary',
    method: 'get',
    params: query
  });
}

export function listCompensationLogging(query) {         //赔偿日志
  return fetch({
    url: '/api/pc/dutyCompensation/listCompensationLogging',
    method: 'get',
    params: query
  });
}



export function listDesignateOutLibraryLibrariesTake(query) {         //出库清单库取
  return fetch({
    url: '/api/pc/installationTasks/listDesignateOutLibraryLibrariesTake',
    method: 'get',
    params: query
  });
}


export function listDesignateOutLibraryCommodity(query) {         //出库清单商品
  return fetch({
    url: '/api/pc/installationTasks/listDesignateOutLibraryCommodity',
    method: 'get',
    params: query
  });
}

export function listServeUser(query) {                  //获取人员
  return fetch({
    url: '/api/pc/serveGroup/listServeUser',
    method: 'get',
    params: query
  });
}


export function listServeUserByLoginAt(query) {         //获取登录人门店下组长组员
  return fetch({
    url: '/api/pc/serveGroup/listServeUserByLoginAt',
    method: 'get',
    params: query
  });
}

export function listUserByType(query) {                //获取组长组员
  return fetch({
    url: '/api/pc/serveGroup/listUserByType',
    method: 'get',
    params: query
  });
}


export function editPurchaseOrder(query) {     //修改安装状态
  return fetch({
    url: '/api/pc/installationTasks/editPurchaseOrder',
    method: 'put',
    data: query
  });
}

export function listPurchaseOrderTable(query) { //修改安装状态回显
  return fetch({
    url: '/api/pc/installationTasks/listPurchaseOrderTable',
    method: 'get',
    params: query
  });
}

export function editInformUser(query) {     //通知用户
  return fetch({
    url: '/api/pc/installationTasks/editInformUser',
    method: 'put',
    data: query
  });
}

export function listLoginServeGroup(query) { //安装部
  return fetch({
    url: '/api/pc/serveGroup/listLoginServeGroup',
    method: 'get',
    params: query
  });
}

export function editBatchComplete(query) {     //订单完成
  return fetch({
    url: '/api/pc/installationTasks/editBatchComplete',
    method: 'put',
    data: query
  });
}

