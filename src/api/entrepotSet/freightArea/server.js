import fetch from 'utils/fetch';
export function page(query) {
    return fetch({
      url: '/api/pc/storageRegion/listStorageSiteByPage',
      method: 'get',
      params: query
    });
}
export function listStorageRegionByPage(query) {
  return fetch({
    url: '/api/pc/storageRegion/listStorageRegionByPage',
    method: 'get',
    params: query
  });
}
export function addStorageRegion(query) {
    return fetch({
      url: '/api/pc/storageRegion/addStorageRegion',
      method: 'post',
      data: query
    });
}
export function getOrganAndStorageRegionTree(query){
    return fetch({
      url:"/api/pc/storage/getOrganAndStorageRegionTree",
      method:"get",
      params:query
    })
}
export function getById(query){
  return fetch({
    url:"/api/pc/storageRegion/getById",
    method:"get",
    params:query
  })
}
export function deleteAllStorageRegion(query){
  return fetch({
    url:"/api/pc/storageRegion/deleteAllStorageRegion",
    method:"delete",
    data:query
  })
}
export function editStorageRegion(query){
  return fetch({
    url:"/api/pc/storageRegion/editStorageRegion",
    method:"put",
    data:query
  })
}

export function getStorageList(params){
  return fetch({
    url:"/api/pc/storage/getStorageList",
    method:"get",
    params
  })
}
