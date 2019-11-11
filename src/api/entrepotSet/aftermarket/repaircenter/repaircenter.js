//派单维修中心接口

import fetch from 'utils/fetch';

export function listInstallationOrder(query) {  //1、获取列表
    return fetch({
      url: '/api/pc/installationOrder/listInstallationOrder',
      method: 'get',
      params: query
    });
}


export function edirRejectInstallationOrder(query){  //转单和驳回
  return fetch({
    url:"/api/pc/installationOrder/edirRejectInstallationOrder",
    method:"put",
    data:query
  })
}


export function editInformCustomer(query){  //修改安装状态
  return fetch({
    url:"/api/pc/installationOrder/editInformCustomer",
    method:"put",
    data:query
  })
}


export function addAppointmentDoor(query) {  //预约上门
  return fetch({
    url: '/api/pc/installationOrder/addAppointmentDoor',
    method: 'post',
    data: query
  });
}



export function editUrgent(query){  //加急和取消加急
  return fetch({
    url:"/api/pc/installationOrder/editUrgent",
    method:"put",
    data:query
  })
}

export function addTransfersApply(query) {  //申请调拨
  return fetch({
    url: '/api/pc/installationTasks/addTransfersApply',
    method: 'post',
    data: query
  });
}

export function editPhoneSuccess(query){  //电话指导完成
  return fetch({
    url:"/api/pc/installationOrder/editPhoneSuccess",
    method:"put",
    data:query
  })
}

export function editLocation(query){  //转待处理
  return fetch({
    url:"/api/pc/installationOrder/editLocation",
    method:"put",
    data:query
  })
}


export function checkPurchaseOrder(query) {  //验证是否采购单调拨
  return fetch({
    url: '/api/pc/transfers/checkPurchaseOrder',
    method: 'get',
    params: query
  });
}




// export function deleteAllStorageRegion(query){ 
//   return fetch({
//     url:"/api/pc/storageRegion/deleteAllStorageRegion",
//     method:"delete",
//     data:query
//   })
// }

