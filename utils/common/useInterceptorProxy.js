import createProxy from "@/utils/common/createProxy.js";

export default function (target) {
    const interceptorProxy = createProxy(target)
    return {
        interceptorProxy,
        interceptor: function ({onError, onSuccess}) {
            if (typeof onError !== 'function') {
                console.error(`${onError}:必须是函数`)
                return
            }
            if (typeof onSuccess !== 'function') {
                console.error(`${onSuccess}:必须是函数`)
                return
            }
            return function (...args) {
                if (interceptorProxy[Object.keys(target)[0]]) {
                    onSuccess(...args)
                } else {
                    onError()
                }
            }
        }
    }
}

