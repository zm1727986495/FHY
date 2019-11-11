import fetch from 'utils/fetch';

export function listReferrerCheckByPage(data) {             //推荐人审核管理列表
  return fetch({
    url: '/api/pc/referrer/listReferrerCheckByPage',
    method: 'get',
    params: data
  });
}

export function getReferrer(query) {                       //查看推荐人信息
  return fetch({
    url: '/api/pc/referrer/getReferrer',
    method: 'get',
    params: query
  });
};


export function addReferrerCheckLog(data) {                 //添加审核记录
return fetch({
        url: '/api/pc/referrer/addReferrerCheckLog',
        method: 'post',
        data
    });
}


export function updateReferrerStatus(data) {                 //修改信息表审核状态
    return fetch({
        url: '/api/pc/referrer/updateReferrerStatus',
        method: 'post',
        data
    });
}

