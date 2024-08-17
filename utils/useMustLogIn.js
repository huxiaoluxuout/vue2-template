import useInterceptorProxy from "@/utils/common/useInterceptorProxy.js";
import {ylxRedirectTo} from "@/utils/uniTools.js";
import createProxy from "@/utils/common/createProxy.js";


function onErrorHandler() {
    uni.showModal({
        title: '登录后，获取完整功能',
        success: function (res) {
            if (res.confirm) {
                ylxRedirectTo('pages/login/login')
            } else if (res.cancel) {
                console.log('用户点击取消');
            }
        }
    });
}

const targetLogin = {login: false}
export const loginProxy = createProxy(targetLogin)
export const setLoginToken = ({tokenKey, tokenData}, callback) => {
    loginProxy.login = true
    uni.setStorage({
        key: tokenKey,
        data: tokenData,
        success: function () {
            if (typeof callback === 'function') {
                callback()
            }
        }
    })
}
export const updateLogin = (callback) => {
    loginProxy.login = true
    if (typeof callback === 'function') {
        callback()
    }
}

export const unSetLoginToken = (tokenKey, callback) => {
    loginProxy.login = false
    uni.removeStorage({
        key: tokenKey,
        success: function () {
            if (typeof callback === 'function') {
                callback()
            }
        }
    })
}


/**
 *
 * @param onSuccess
 * @param onError
 * @returns {(function(...[*]): void)|*}
 */
export default function ({onSuccess, onError = onErrorHandler}) {
    const {interceptor: logInterceptor} = useInterceptorProxy(targetLogin)
    return logInterceptor({onSuccess, onError})
}

