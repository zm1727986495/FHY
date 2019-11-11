import fetch from 'utils/fetch';
export function pageTable(query){
    return fetch({
        url:"/api/pc/aog/listAogByPage",
        method:"get",
        params:query
    })
}
export function getById(query){
    return fetch({
        url:"/api/pc/aog/getById",
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
export function addAog(query){
    return fetch({
        url:"/api/pc/aog/addAog",
        method:"post",
        data:query
    })
}
export function listById(query){
    return fetch({
        url:"/api/pc/aogTemplate/listById",
        method:"get",
        params:query
    })
}
export function editAog(query){
    return fetch({
        url:"/api/pc/aog/editAog",
        method:"put",
        data:query
    })
}
export function deleteAog(query){
    return fetch({
        url:"/api/pc/aog/deleteAog",
        method:"delete",
        data:query
    })
}

