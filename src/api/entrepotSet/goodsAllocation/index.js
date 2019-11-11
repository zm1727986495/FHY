import fetch from 'utils/fetch';
export function getOrganAndStorageRegionTree(params){
    return fetch({
      url:"/api/pc/storage/getOrganAndStorageRegionTree",
      method:"get",
      params
    })
}
export function listStorageSiteByPage(params){
    return fetch({
      url:"/api/pc/storageSite/listStorageSiteByPage",
      method:"get",
      params
    })
}
export function addAllStorageSite(data){
    return fetch({
      url:"/api/pc/storageSite/addAllStorageSite",
      method:"post",
      data
    })
}
export function deleteAllStorageSite(data){
  return fetch({
    url:"/api/pc/storageSite/deleteAllStorageSite",
    method:"delete",
    data
  })
}
export function getById(params){
  return fetch({
    url:"/api/pc/storageSite/getById",
    method:"get",
    params
  })
}
export function editStorageSite(data){
  return fetch({
    url:"/api/pc/storageSite/editStorageSite",
    method:"put",
    data
  })
}
export function getStorageList(params){
  return fetch({
    url:"/api/pc/storage/getStorageList",
    method:"get",
    params
  })
}
export function getStorageRegionListById(params){
  return fetch({
    url:"/api/pc/storageRegion/getStorageRegionListById",
    method:"get",
    params
  })
}


