import {ylxRedirectTo} from "@/utils/uniTools";


const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 将参数转换为查询字符串
const encodeObjectToQueryString = (params, starStr = '?') => {
    if (Object.keys(params).length === 0) {
        return '';
    }

    const separator = Object.keys(params)[0] === starStr ? '' : '&';
    return separator + Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
}

// 解析查询字符串
const encodeParseQueryString = (queryString) => {
    const params = {};
    if (queryString.startsWith('?')) {
        queryString = queryString.slice(1);
    }
    const keyValues = queryString.split('&');
    keyValues.forEach(keyValue => {
        const [key, value] = keyValue.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
};

// 对象转成字符串 (style)
const objectStyleToString = (obj) => {
    let str = '';
    for (const key in obj) {
        str += `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${obj[key]};`;
    }
    return str;
}

function splitQueryUrl(pathUrl) {
    let url = /^\//.test(pathUrl) ? pathUrl : '/' + pathUrl;
    let [path, query] = url.split('?');
    return {
        path,
        query: query ? '?' + query : '',
        startStr: query ? '&' : '?',
    };
}


// 根据传入的索引批量删除
function removeElementsByIndex(arr, indexes, callback) {
    indexes = Array.isArray(indexes) ? indexes : [indexes];
    // 根据传入的索引进行删除
    for (let i = indexes.length - 1; i >= 0; i--) {
        const index = indexes[i];
        if (index >= 0 && index < arr.length) {
            arr.splice(index, 1);
        }
    }
    typeof callback === 'function' && callback()

}

function isEmptyData(value) {
    const dataType = Object.prototype.toString.call(value).replace(/\[object (\w+)]/, "$1").toLowerCase();
    if (value === undefined || value === null) {
        return true;
    } else if (dataType === 'string') {
        return value.trim().length === 0;
    } else if (dataType === 'array') {
        return value.length === 0;
    } else if (dataType === 'object') {
        return Object.keys(value).length === 0;
    } else if (dataType === 'number') {
        return value === 0;
    }
    return false;
}

function deepEqual(obj1, obj2) {
    // 判断是否为对象
    if (obj1 === obj2) return true;
    if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) return false;

    // 获取属性列表
    let props1 = Object.getOwnPropertyNames(obj1);
    let props2 = Object.getOwnPropertyNames(obj2);

    // 属性数量不同，直接返回 false
    if (props1.length !== props2.length) return false;

    // 逐一比较属性值
    for (let propName of props1) {
        if (!obj2.hasOwnProperty(propName)) return false;

        let val1 = obj1[propName];
        let val2 = obj2[propName];

        // 递归处理对象和数组
        if (val1 instanceof Object) {
            if (!deepEqual(val1, val2)) return false;
        } else if (val1 instanceof Array) {
            if (!arrayEquals(val1, val2)) return false;
        } else if (val1 !== val2) {
            return false;
        }
    }

    return true;
}

function startTimer(callback, delay = 20, ...args) {
    let timer = setTimeout(() => {
        callback(...args);
        clearTimeout(timer);
    }, delay);
}

function simulateOperation() {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
        console.log('延时', delay)
        const operationShouldFail = Math.random() < 0.3;// 假设有30%的概率失败
        setTimeout(() => {
            if (operationShouldFail) {
                reject('失败');
            } else {
                resolve('成功');
            }
        }, delay);
    });
}

// 判断数据类型
function dataTypeJudge(val, type) {
    const dataType = Object.prototype.toString.call(val).replace(/\[object (\w+)\]/, "$1").toLowerCase();
    return type ? dataType === type : dataType;
}

// 将时间戳格式化为日期字符串
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 输出时间戳
function dateTimestamp(date) {
// 将日期字符串转换为日期对象
    const dateObject = new Date(date);
// 获取时间戳（毫秒数）
    return dateObject.getTime();
}

function computedRatio(strRatio) {
    let result = strRatio
    if (strRatio.indexOf(':') !== -1) {
        let ratio = strRatio.split(':').map(Number);
        result = (ratio[0] / ratio[1]).toFixed(3);
    }
    return result
}

const promiseCallback = (promiseFn, ...args) => {
    return {
        onSuccess: (callback) => {
            promiseFn(...args).then(res => {
                callback(res);
            });
        },
        onError: (callback) => {
            promiseFn(...args).catch(err => {
                callback(err);
            });
        }
    };
}


function parseSize(str) {
    let match = str.match(/(\d+)(rpx|px)/i);
    if (match) {
        return {
            num: parseFloat(match[1]),
            unit: match[2]
        };
    } else {
        return {
            num: parseFloat(str),
            unit: 'rpx'
        };
    }
}

function removeTrailingZeros(value) {
    let stringValue = value.toString();
    return stringValue.replace(/(\.\d*?[1-9])0+$|\.0*$/, '\$1');
}

export {
    uuid,
    encodeObjectToQueryString,
    encodeParseQueryString,
    objectStyleToString,
    removeElementsByIndex,
    isEmptyData,
    splitQueryUrl,
    startTimer,
    simulateOperation,
    dataTypeJudge,
    formatTimestamp,
    dateTimestamp,
    computedRatio,
    promiseCallback,
    parseSize,
    removeTrailingZeros,

}

