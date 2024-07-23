import {BASE_URL} from "@/network/config";
import {dataTypeJudge} from "@/utils/tools";


// 请求函数
export const request = (options) => {
    let token = uni.getStorageSync('token') || ''

    return new Promise((resolve, reject) => {

        uni.request({
            ...options,
            url: BASE_URL + options.url,
            header: {
                "token": token
            },
            success(response) {
                if (dataTypeJudge(response.data) === 'object' && response.data.code === 0) {
                    return resolve(response.data);
                } else if (dataTypeJudge(response.data) === 'object' && response.data.code !== 0) {
                    uni.showToast({title: response.data.msg, icon: 'error', duration: 5000, mask: false})
                    return resolve(response.data);
                }
            },
            fail(err) {
                uni.showToast({title: JSON.stringify(err), icon: 'none', duration: 5000})
                reject(err)
            },
            complete(res) {

                if (res.statusCode === 500 || dataTypeJudge(res.data) === 'string') {
                    console.error('complete', res)
                    uni.showToast({title: res.data, icon: 'none', duration: 5000})
                    reject(res)

                }
            }
        });

    })
};
if (!Promise.prototype.finally) {
    Promise.prototype.finally = function (callback) {
        const Promise = this.constructor;
        return this.then(
            function (value) {
                Promise.resolve(callback()).then(
                    function () {
                        return value;
                    }
                );
            },
            function (reason) {
                Promise.resolve(callback()).then(
                    function () {
                        throw reason;
                    }
                );
            }
        );
    }
}
