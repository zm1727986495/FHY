import fetch from 'utils/fetch';
export function listDiscountSpecialByPage(params) {
    return fetch({
      url: '/api/pc/discountSpecial/listDiscountSpecialByPage',
      method: 'get',
      params
    });
}
export function addDiscountSpecial(data) {
    return fetch({
      url: '/api/pc/discountSpecial/addDiscountSpecial',
      method: 'post',
      data
    });
}
export function editDiscountSpecial(data) {
    return fetch({
      url: '/api/pc/discountSpecial/editDiscountSpecial',
      method: 'put',
      data
    });
}
export function getDiscountSpecial(params) {
    return fetch({
      url: '/api/pc/discountSpecial/getDiscountSpecial',
      method: 'get',
      params
    });
}
export function getDiscountSpecialRule(params) {
    return fetch({
      url: '/api/pc/discountSpecial/getDiscountSpecialRule',
      method: 'get',
      params
    });
}
export function listDiscountSpecialRule(params) {
    return fetch({
      url: '/api/pc/discountSpecial/listDiscountSpecialRule',
      method: 'get',
      params
    });
}
export function addDiscountSpecialRule(data) {
    return fetch({
      url: '/api/pc/discountSpecial/addDiscountSpecialRule',
      method: 'post',
      data
    });
}
export function editDiscountSpecialRule(data) {
    return fetch({
      url: '/api/pc/discountSpecial/editDiscountSpecialRule',
      method: 'put',
      data
    });
}




