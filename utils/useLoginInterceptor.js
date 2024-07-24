import {ylxRedirectTo} from "@/utils/uniTools";

import store from "@/store";


function onErrorHandler() {
    uni.showModal({
        title: '登录后，获取完整功能',
        // showCancel: false,
        success: function (res) {
            if (res.confirm) {
                ylxRedirectTo('pages/login/login')
            } else if (res.cancel) {
                console.log('用户点击取消');
            }
        }
    });
}

// 拦截登录判断
export default function ({onError = onErrorHandler, onSuccess}) {
    if (typeof onError !== 'function') {
        console.error(`${onError}:必须是函数`)
        return
    }
    if (typeof onSuccess !== 'function') {
        console.error(`${onSuccess}:必须是函数`)
        return
    }

    return function (...args) {
        const isLogeIn = store.getters.hasLogged
        if (isLogeIn) {
            onSuccess(...args)
        } else {
            onError()
        }
    }
}

