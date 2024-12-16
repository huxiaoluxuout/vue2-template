import {uploadFileUrl} from "@/network/config.js";

const configPrams = {
    url: uploadFileUrl, // 上传的目标URL
    fileType: 'image', //文件类型，image/video/audio
    fileName: 'file' //上传请求中文件字段的名称
}

/**
 * 使用uni.uploadFile上传文件并返回一个Promise
 * @param {string} tempFilePath - 要上传的临时文件路径
 * @param {Object} [config={}] - 可选的配置对象
 * @returns {Promise<string>} 一个Promise，解析后返回上传文件的URL
 */
function onlyUploadFile(tempFilePath, config = {}) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            filePath: tempFilePath,
            url: configPrams.url,
            fileType: configPrams.fileType,
            name: configPrams.fileName,
            ...config,
            success: (res) => {
                resolve(res)
            },
            fail(err) {
                console.error('uni.uploadFile fail:', err)
                reject(err)
            },
        })
    })
}

/**
 * @param {string} tempFilePath - 要上传的临时文件路径
 * @param {function} [onImgSuccessHandler] - 处理后端返回的数据
 * @param {Object} [config={}] - 可选的配置对象
 */
export async function uploadFilePromise(tempFilePath, onImgSuccessHandler, config = {}) {
    let token = uni.getStorageSync('token') || ''
    if (!config.hasOwnProperty("header")) {
        config.header = {"Authorization": token}
    }
    const result = await onlyUploadFile(tempFilePath, config)
    console.log('result',result)
    return new Promise((resolve, reject) => {
        onImgSuccessHandler(result, resolve)
    })
}

/**
 * @param {string} tempFilePath - 要上传的临时文件路径
 * @param {function} onImgSuccessHandler - 处理后端返回的数据
 * @param {function} uploadCallback - 返回处理后的数据
 * @param {Object} [config={}] - 可选的配置对象
 */
export async function uploadFileCallback(tempFilePath, onImgSuccessHandler, uploadCallback, config = {}) {
    let token = uni.getStorageSync('token') || ''
    if (!config.hasOwnProperty("header")) {
        config.header = {"Authorization": token}
    }
    const result = await onlyUploadFile(tempFilePath, config)
    onImgSuccessHandler(result, uploadCallback)

}

/**
 * 处理上传后，后端返回的数
 * @param {Object} result - 后端返回的原生数据
 * @param {function} handlerFunction - 处理上传结果
 * @returns {Promise<string>} 一个Promise，解析后返回上传文件的URL
 */
export function imgHttpSuccess(result, handlerFunction) {
    let resData = JSON.parse(result.data)
    // console.log('后端返回的原生数据', resData)
    if (resData.code === 200) {
        handlerFunction(resData.url)
    } else {
        console.error(resData)
    }
}


// TODO 待处理
export function updateFileImageList({type, param}, fileImageList) {
    if (type === 'del') {
        fileImageList.splice(param, 1)
    } else if (type === 'uploading') {
        fileImageList.push(param)
    } else if (type === 'success') {
        fileImageList.splice(param.fileImageListLen, 1, param.itemAssign)
    }
}
