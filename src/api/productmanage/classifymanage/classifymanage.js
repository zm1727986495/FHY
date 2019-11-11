import fetch from 'utils/fetch';

export function querys(query) {  //查询接口
    return fetch({
      url: '/api/pc/category/listCategoryByPage',
      method: 'get',
      params: query
    });
  };
  export function attribute (query) {  //获取属性接口
    return fetch({
      url: '/api/pc/category/listCategoryAttribute',
      method: 'get',
      params: query
    });
  }
  export function addCategory (obj) {  //新增属性接口
    return fetch({
      url: '/api/pc/category/addCategory',
      method: 'post',
      data: obj
    });
  }
  export function IsEnable (obj) {  //停用 启用接口
    return fetch({
      url: '/api/pc/common/IsEnable',
      method: 'put',
      data: obj
    });
  }
  export function editCategory (obj) {  //编辑品类
    return fetch({
      url: '/api/pc/category/editCategory',
      method: 'put',
      data: obj
    });
  }
  export function getCategory (obj) {  //查看品类
    return fetch({
      url: '/api/pc/category/getCategory',
      method: 'get',
      params: obj
    });
  }