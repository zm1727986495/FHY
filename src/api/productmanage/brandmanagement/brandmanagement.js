import fetch from 'utils/fetch';

export function querys(query) {  //品牌管理获取列表信息接口
    return fetch({
      url: '/api/pc/brand/listBrandByPage',
      method: 'get',
      params: query
    });
  };
  export function addBrandn(obj) {  //新增品牌
    return fetch({
      url: '/api/pc/brand/addBrand',
      method: 'post',
      data: obj
    });
  };
  export function isEnable(obj) {  //更改启用停用状态
    return fetch({
      url: '/api/pc/common/IsEnable',
      method: 'put',
      data: obj
    });
  };
  export function editBrand(obj) {  //编辑品牌
    return fetch({
      url: '/api/pc/brand/editBrand',
      method: 'put',
      data: obj
    });
  };
  export function getBrand(query) {  //查看品牌接口
    return fetch({
      url: '/api/pc/brand/getBrand',
      method: 'get',
      params: query
    });
  };
  export function listBrand(query) {  //查询品牌联系人列表
    return fetch({
      url: '/api/pc/brand/listBrandContacts',
      method: 'get',
      params: query
    });
  };
  export function addContacts(obj) {  //新增品牌联系人
    return fetch({
      url: '/api/pc/brand/addBrandContacts',
      method: 'post',
      data: obj
    });
  };
  export function getContacts(query) {  //查看增品牌联系人
    return fetch({
      url: '/api/pc/brand/getBrandContacts',
      method: 'get',
      params: query
    });
  };
  export function editMain(obj) {  //设置主要联系人
    return fetch({
      url: '/api/pc/brand/editBrandContactsMain',
      method: 'put',
      data: obj
    });
  };
  export function editBrandContacts(obj) {  //修改品牌联系人
    return fetch({
      url: '/api/pc/brand/editBrandContacts',
      method: 'put',
      data: obj
    });
  };