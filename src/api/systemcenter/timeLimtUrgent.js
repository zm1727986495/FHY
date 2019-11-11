import fetch from 'utils/fetch';
export function listScheduleUrgentByPage(params) {
    return fetch({
      url: '/api/pc/scheduleUrgent/listScheduleUrgentByPage',
      method: 'get',
      params
    });
}
export function addScheduleUrgent(data) {
    return fetch({
      url: '/api/pc/scheduleUrgent/addScheduleUrgent',
      method: 'post',
      data
    });
}
export function listScheduleUrgentRule(params) {
    return fetch({
      url: '/api/pc/scheduleUrgent/listScheduleUrgentRule',
      method: 'get',
      params
    });
}
export function addScheduleUrgentRule(data) {
    return fetch({
      url: '/api/pc/scheduleUrgent/addScheduleUrgentRule',
      method: 'post',
      data
    });
}
export function getScheduleUrgentRule(params) {
    return fetch({
      url: '/api/pc/scheduleUrgent/getScheduleUrgentRule',
      method: 'get',
      params
    });
}
export function editScheduleUrgentRule(data) {
    return fetch({
      url: '/api/pc/scheduleUrgent/editScheduleUrgentRule',
      method: 'put',
      data
    });
}
export function editScheduleUrgent(data) {
  return fetch({
    url: '/api/pc/scheduleUrgent/editScheduleUrgent',
    method: 'put',
    data
  });
}

export function getScheduleUrgent(params) {
    return fetch({
      url: '/api/pc/scheduleUrgent/getScheduleUrgent',
      method: 'get',
      params
    });
}




