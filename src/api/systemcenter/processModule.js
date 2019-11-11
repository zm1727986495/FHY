import fetch from 'utils/fetch';
export function listOrderProcessVO(params) {
  return fetch({
    url: '/api/pc/processConfig/listOrderProcessVO',
    method: 'get',
    params
  });
}
export function deleteOrderProcess(data) {
  return fetch({
    url: '/api/pc/processConfig/deleteOrderProcess',
    method: 'put',
    data
  });
}
export function addOrderProcess(data) {
  return fetch({
    url: '/api/pc/processConfig/addOrderProcess',
    method: 'post',
    data
  });
}
export function listOrderProcessConfigure(params) {
  return fetch({
    url: '/api/pc/processConfig/listOrderProcessConfigure',
    method: 'get',
    params
  });
}
export function addRelOrderProcessConfigureDTO(data) {
  return fetch({
    url: '/api/pc/processConfig/addRelOrderProcessConfigureDTO',
    method: 'post',
    data
  });
}
export function getOrderProcessVO(params) {
  return fetch({
    url: '/api/pc/processConfig/getOrderProcessVO',
    method: 'get',
    params
  });
}
export function moveRelOrderProcessConfigure(data) {
  return fetch({
    url: '/api/pc/processConfig/moveRelOrderProcessConfigure',
    method: 'put',
    data
  });
}
export function updateOrderProcess(data) {
  return fetch({
    url: '/api/pc/processConfig/updateOrderProcess',
    method: 'put',
    data
  });
}
export function deleteRelOrderProcessConfigure(data) {
  return fetch({
    url: '/api/pc/processConfig/deleteRelOrderProcessConfigure',
    method: 'put',
    data
  });
}
export function listOrderProcessNodeConfigure(params) {
  return fetch({
    url: '/api/pc/processConfig/listOrderProcessNodeConfigure',
    method: 'get',
    params
  });
}
export function addRelOrderProcessNodeConfigureDTO(data) {
  return fetch({
    url: '/api/pc/processConfig/addRelOrderProcessNodeConfigureDTO',
    method: 'post',
    data
  });
}
export function moveRelOrderProcessNodeConfigure(data) {
  return fetch({
    url: '/api/pc/processConfig/moveRelOrderProcessNodeConfigure',
    method: 'put',
    data
  });
}
export function deleteRelOrderProcessNodeConfigure(data) {
  return fetch({
    url: '/api/pc/processConfig/deleteRelOrderProcessNodeConfigure',
    method: 'put',
    data
  });
}
export function releaseOrderProcess(data) {
  return fetch({
    url: '/api/pc/processConfig/releaseOrderProcess',
    method: 'put',
    data
  });
}
export function copyOrderProcess(data) {
  return fetch({
    url: '/api/pc/processConfig/copyOrderProcess',
    method: 'post',
    data
  });
}
export function listStoreSource(params) {
  return fetch({
    url: '/api/pc/store/listStoreSource',
    method: 'get',
    params
  });
}


