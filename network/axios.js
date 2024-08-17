import {BASE_URL, uploadFileUrl} from "@/network/config";


const configPrams = {
    data: {}
}


/**
 * 请求函数
 * 使用uni.request发起网络请求返回一个Promise
 * @param {string} url - 开发者服务器接口地址
 * @param {Object} [config] - 可选的配置对象
 * @param {string} [config.data={}] - 请求的参数
 * @param {string} [config.method='GET'] - method 类型（GET|POST|PUT|DELETE|HEAD|OPTIONS）
 * @param {timeout} [config.timeout=60000] - 超时时间，单位 ms
 *
 */

export function requestPromise(url, config) {
    if (!config["data"]) {
        config["data"] = ''
    }
    let token = uni.getStorageSync('authorization') || ''

    return new Promise((resolve, reject) => {
        return uni.request({
            url: BASE_URL + url,
            header: {
                Authorization: token
            },
            ...config,
            success(response) {
                console.log('response.data', response)
                if (response.statusCode === 401) {
                    reject(response.data)
                    // resolve(response.data)

                } else {
                    resolve(response.data)
                }
            },
            fail(err) {
                uni.showToast({title: JSON.stringify(err), icon: 'none', duration: 5000})
                // reject(err)
            },
            complete(completeRes) {

            }
        });


    })
}
