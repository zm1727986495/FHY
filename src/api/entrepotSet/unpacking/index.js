import fetch from 'utils/fetch';
export function listAogByPage(query){
    return fetch({
        url:"/api/pc/aog/listAogByPage",
        method:"get",
        params:query
    })
}
export function listCategory(query){
    return fetch({
        url:"/api/pc/common/listCategory",
        method:"get",
        params:query
    })
}
export function getUnpackingDataList(query){
    return fetch({
        url:"/api/pc/unpackingData/getUnpackingDataList",
        method:"get",
        params:query
    })
}
export function editUnpackingData(query){
    return fetch({
        url:"/api/pc/unpackingData/editUnpackingData",
        method:"put",
        data:query
    })
}
export function deleteUnpackingData(query){
    return fetch({
        url:"/api/pc/unpackingData/deleteUnpackingData",
        method:"delete",
        data:query
    })
}
