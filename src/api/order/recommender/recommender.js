//推荐人管理接口
import fetch from 'utils/fetch';

export function listReferrerByPage(query) {  //1.查询联系人列表  
  return fetch({
    url: '/api/pc/order/listReferrerByPage',
    method: 'get',
    params: query
  });
};

export function addBrand(obj) {              //2.新增推荐人
  return fetch({
    url: '/api/pc/referrer/addReferrer',
    method: 'post',
    data: obj
  });
};

export function getReferrer(query) {  //3、查看推荐人信息
  return fetch({
    url: '/api/pc/referrer/getReferrer',
    method: 'get',
    params: query
  });
};

export function editReferrer(obj) {        //4.编辑外部推荐人
  return fetch({
    url: '/api/pc/referrer/editReferrer',
    method: 'post',
    data: obj
  });
};

export function listReferrerCheckLog(query) {  //5.获取推荐人审核记录
  return fetch({
    url: '/api/pc/referrer/listReferrerCheckLog',
    method: 'get',
    params: query
  });
};

export function cancelReferrer(obj) {        //6.  提交
  return fetch({
    url: '/api/pc/referrer/cancelReferrer',
    method: 'post',
    data: obj
  });
};

export function commitReferrer(obj) {        //7.  作废
  return fetch({
    url: '/api/pc/referrer/commitReferrer',
    method: 'post',
    data: obj
  });
};

export function getBrand(query) {           //7.获取品牌
  return fetch({
    url: '/api/pc/referrer/getBrand',
    method: 'get',
    params: query
  });
};

export function referrerChangeRecord(query) {          //8.变更记录
  return fetch({
    url: '/api/pc/referrer/referrerChangeRecord',
    method: 'get',
    params: query
  });
};




export function removeAccessoryImg(query) { //删除图片
  return fetch({
    url: '/api/pc/common/removeAccessoryImg',
    method: 'delete',
    data: query
  });
}

export function addAccessory(query) { //新增图片
  return fetch({
    url: '/api/pc/common/addAccessory',
    method: 'post',
    data: query
  });
}

