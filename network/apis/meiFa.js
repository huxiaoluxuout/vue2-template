import {request} from '@/network/request'

// 测试获取 token
export const localToken = (data) => request({url: '/api/user/direct?id=2', method: 'get', data});

export const wxLogin = (data) => request({url: '/api/user/wxLogin', method: 'post', data});

// 注册
export const wxRegister = (data) => request({url: '/api/user/wxRegister', method: 'post', data});

// 获取用户信息
export const getUserInfo = (data) => request({url: '/api/user/getUserInfo', method: 'post', data});

export const getBannerList = (data) => request({url: '/api/common/getBannerList', method: 'post', data});

//我的订单
export const getOrderList = (data) => request({url: '/api/order/getOrderList', method: 'post', data});

