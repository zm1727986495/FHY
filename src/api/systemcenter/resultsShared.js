import fetch from 'utils/fetch';
export function listAchievementShareRule(params) {
    return fetch({
      url: '/api/pc/achievementShare/listAchievementShareRule',
      method: 'get',
      params
    });
}
export function listAchievementShareByPage(params) {
    return fetch({
      url: '/api/pc/achievementShare/listAchievementShareByPage',
      method: 'get',
      params
    });
}

export function addAchievementShare(data) {
    return fetch({
      url: '/api/pc/achievementShare/addAchievementShare',
      method: 'post',
      data
    });
}
export function addAchievementShareRule(data) {
    return fetch({
      url: '/api/pc/achievementShare/addAchievementShareRule',
      method: 'post',
      data
    });
}
export function editAchievementShare(data) {
    return fetch({
      url: '/api/pc/achievementShare/editAchievementShare',
      method: 'put',
      data
    });
}
export function getAchievementShare(params) {
    return fetch({
      url: '/api/pc/achievementShare/getAchievementShare',
      method: 'get',
      params
    });
}
export function getAchievementShareRule(params) {
    return fetch({
      url: '/api/pc/achievementShare/getAchievementShareRule',
      method: 'get',
      params
    });
}

