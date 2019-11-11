
import fetch from 'utils/fetch';

//获取工作简报统计
export function getSalesAchievements() {
    return fetch({
        url: '/api/pc/systemInformation/getSalesAchievements',
        method: 'get'
    });
}

//获取英雄榜
export function getCommingSoon() {
  return fetch({
    url: '/api/pc/systemInformation/getCommingSoon',
    method: 'get'
  });
}

//获取业绩趋势图
export function getPerformanceTrends() {
    return fetch({
        url: '/api/pc/systemInformation/getPerformanceTrends',
        method: 'get'
    });
}

//获取订单跟进日程
export function getSchedule() {
    return fetch({
        url: '/api/pc/systemInformation/getSchedule',
        method: 'get'
    });
}

//获取订单跟进日程详情
export function getScheduleDetail() {
    return fetch({
        url: '/api/pc/systemInformation/getScheduleDetail',
        method: 'get'
    });
}

//获取明星员工
export function getStarEmployees() {
    return fetch({
        url: '/api/pc/systemInformation/getStarEmployees',
        method: 'get'
    });
}





