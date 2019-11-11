//派单维修中心接口

import fetch from 'utils/fetch';  

export function listInstallJobs(query) {  //安装任务列表
    return fetch({
      url: '/api/pc/designateInstallation/listInstallJobs',
      method: 'get',
      params: query
    });
}  


export function installationReportDetails(query) {  //安装汇报回显
    return fetch({
      url: '/api/pc/designateInstallation/installationReportDetails',
      method: 'get',
      params: query
    });
}

export function editInstallationReportContent(query){  //安装汇报  
  return fetch({ 
    url:"/api/pc/designateInstallation/editInstallationReportContent",
    method:"put",
    data:query
  })
}

export function editDesignateInstallation(query){    //撤销 
  return fetch({ 
    url:"/api/pc/designateInstallation/editDesignateInstallation",
    method:"put",
    data:query
  })
}

export function addStryppedDown(query){               //添加改制
  return fetch({
      url:"/api/pc/stryppedDown/addStryppedDown",
      method:"post",
      data:query
  })
}

export function addCharge(query){                     //添加收费  
  return fetch({
      url:"/api/pc/designateInstallation/addCharge",
      method:"post",
      data:query
  })
}

export function chargeMoneyDetails(query) {           //收费回显  
  return fetch({
    url: '/api/pc/designateInstallation/chargeMoneyDetails',
    method: 'get',
    params: query
  });
}  

export function listStorage(query) {                 //汇报日志获取仓库下拉
  return fetch({
    url: '/api/pc/designateInstallation/listStorage',
    method: 'get',
    params: query
  });
}


