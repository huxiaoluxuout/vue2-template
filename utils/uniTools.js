import pagesConfig from "@/pages.json";

import {promiseCallback} from "@/utils/tools";
import {mpCheckAuthorizes} from "@/utils/common/authorize/mpAuthorizes";

const {tabBar: {list: tabBarPages} = {list: []}} = pagesConfig

// 微信登录 code
const ylxLoginCode = () => {
    return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
            provider: 'weixin',
            success: function (res) {
                resolve(res);
            },
            fail: function (fail) {
                reject(fail);
            },
        });
        // #endif

    });
};


//调起App支付
const ylxPayMoneyApp = function ({provider, orderInfo}) {
    /*let 参数 = {
        "provider": "wxpay",
        "orderInfo": {
            "prepayid": "wx161633121422715bc756fb68a4efb60000",
            "appid": "wxf383752c90a2a994",
            "partnerid": "1601225378",
            "package": "Sign=WXPay",
            "noncestr": "c1af7c1b65f860f830b3307dfa9",
            "timestamp": 1705393992,
            "sign": "OBidYj/ccaONa7Eg8YOPLwYKTAhHSDyweKihCxX0mqGOkFXjb96ozMASjwyLqsjaPr9q6NNb4opJxtQp7WW/owN4iPkaTTVO1Keql9YKrJ4hVl2FfLUSfroUiyrKOohzfRpvLgskivA16Z9SD1U46pJqN9X00tQc8D628SZUUQbDtVbef25JExG/v4Kq4miJz7br7NOyi8SJvSrKJGLyVDmLFlU8Jult0jRTgeyCgy6m2IXJm6lgxlB3Q76HCMqAFqBax4N7425ENEgBiSVOxVsJzW144PA+XqZ5vUpHbZGVzlz3kGN6jLMXs+uMTx0HAemNg1ZiNqCxSHiU+Ordzg=="
        }
    }*/

    return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        uni.requestPayment({
            provider: provider || 'wxpay',
            orderInfo: orderInfo,
            success: function (PaymentSuccess) {
                resolve(PaymentSuccess);
            },
            fail: function (fail) {
                console.log(fail)
                reject(fail);
            }
        });
        // #endif
    })
}

//微信小程序付款
const ylxPayMoneyMp = (paymentInfo) => {
    /*paymentInfo = {
        nonceStr: "1713315071653",
        package: "prepay_id=wx170851119223082968c7e3942811860000",
        paySign: "5E10EBAEE6177494577D9CF9E1513236",
        signType: "MD5",
        timeStamp: "1713315072",
    }*/

    return new Promise((resolve, reject) => {

        // #ifdef MP-WEIXIN
        uni.requestPayment({
            timeStamp: paymentInfo.timeStamp,
            nonceStr: paymentInfo.nonceStr,
            package: paymentInfo.package,
            signType: paymentInfo.signType,
            paySign: paymentInfo.paySign,
            success(success) {
                resolve(success);
            },
            fail(fail) {
                if(fail.errMsg==='requestPayment:fail cancel'){
                    ylxToast('支付取消')
                }
                reject(fail)
            },
            complete(complete) {
                resolve(complete);
            },
        });
        // #endif
        // #ifdef WEB
        resolve('WEB');
        // #endif
    });
};


// IOS 底部兼容
const ylxIOSBottomHeight = () => {
    const {model} = uni.getSystemInfoSync()
    const models = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
    if (model.indexOf('iPhone') !== -1 && models.some(item => model.indexOf(item) !== -1)) {
        return 35
    } else {
        return 0
    }
};

// 节点信息
const ylxViewInfo = (selector, callback, that) => {
    uni.createSelectorQuery()
        .in(that)
        .select(selector)
        .boundingClientRect((rect) => {
            callback(rect)
        })
        .exec();
}

//统一提示方便全局修改
const ylxToast = (title, duration = 1500, mask = false, icon = 'none') => {
    if (Boolean(title) === false) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}


const ylxDebuggerMsg = () => {
    uni.showToast({title: '开发调试中', icon: 'none'})
    throw new Error('开发调试中')
}

// 路径补全
const ylxFilterPath = (path) => {
    return /^\//.test(path) ? path : '/' + path
};

function removeVueExtension(filePath) {
    if (filePath.lastIndexOf('.vue') !== -1) {
        console.warn('移除.vue')
        return filePath.replace(/\.vue$/, '');
    } else {
        return filePath
    }
}

const toTargetPage = (pagePath, parseInfo = {}, api) => {

    if (!pagePath) return;

    const pattern = /\/?([^?]+)/;
    const route = pagePath.match(pattern)[1];
    const isTabBarPage = tabBarPages.map(item => ylxFilterPath(item.pagePath)).includes(ylxFilterPath(route));


    if (isTabBarPage) {
        uni.switchTab({
            url: ylxFilterPath(route),
            fail: function (fail) {
                console.error(fail)
            }
        })
    } else {

        let startStr = pagePath.indexOf('?') === -1 ? '?' : '&';
        let queryString = '';
        if (Object.keys(parseInfo).length) {
            queryString = startStr + Object.keys(parseInfo).map((key) => `${key}=${parseInfo[key]}`).join('&');
        }

        uni[api]({
            url: ylxFilterPath(removeVueExtension(pagePath) + queryString),
            success: function (res) {
                console.log(res.errMsg)
            },
            fail: function (fail) {
                console.error('fail', fail.errMsg);
            }
        })
    }
}


const ylxNavigateTo = (pagePath, parse = {}) => toTargetPage(pagePath, parse, 'navigateTo');
const ylxRedirectTo = (pagePath, parse = {}) => toTargetPage(pagePath, parse, 'redirectTo');


const ylxAttributeStylers = (attr, keyMap = []) => {
    // 原始数组
    const originalArray = ['flex', 'backgroundColor', 'filter', 'color'];

    // 创建一个新数组，将原始数组和键映射数组合并，同时去除重复的键。
    const mergedKeys = Array.from(new Set([...originalArray, ...keyMap]));

    // 初始化结果对象。
    const result = {};

    // 遍历合并后的键数组，提取属性值并添加到结果对象中。
    for (const key of mergedKeys) {
        const value = attr[key];
        if (value !== null && value !== undefined) {
            result[key] = value;
        }
    }

    return result;
};

// 对象转成字符串 (style)
const ylxStyleObjectToString = (styleObject) => {
    let styleStr = '';
    for (const key in styleObject) {
        styleStr += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${styleObject[key]};`;
    }
    return styleStr;
}


const ylxOpenWxDebug = (ENV) => {
    uni.getSystemInfo({
        success(res) {
            // #ifdef MP
            const accountInfo = uni.getAccountInfoSync()
            const {miniProgram} = accountInfo
            if ((res?.brand && res.brand !== "devtools")) {
                if (process.env.NODE_ENV === 'development') {
                    // 打开调试
                    uni.setEnableDebug({
                        enableDebug: ['develop', 'trial'].includes(miniProgram.envVersion) // 区分  develop:开发版本 trial:体验版 release:正式版
                    })
                } else {
                    console.log('生产环境');

                }
            }
            // #endif

        }
    })
}


function showModelHandler(title, params) {
    uni.showModal({
        title,
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                if (typeof params === 'function') {
                    params()
                } else {
                    uni.$emit('connectErr', params)
                }
            }
        }
    });
}

function ylxBluetoothAuthorize(leadText='请允许小程序使用蓝牙') {
    return promiseCallback(mpCheckAuthorizes, 'bluetooth', leadText)
}

export {
    ylxAttributeStylers,
    ylxStyleObjectToString,
    ylxIOSBottomHeight,
    ylxFilterPath,
    ylxLoginCode,
    ylxPayMoneyApp,
    ylxPayMoneyMp,

    ylxViewInfo,
    ylxDebuggerMsg,
    ylxNavigateTo,
    ylxRedirectTo,
    ylxOpenWxDebug,
    ylxToast,
    ylxBluetoothAuthorize,
    showModelHandler,
}
