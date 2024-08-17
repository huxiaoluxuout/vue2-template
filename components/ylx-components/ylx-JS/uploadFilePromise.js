import {uploadFileUrl} from "@/network/config.js";

const configPrams = {
    imgSuccessHandler,
    url: uploadFileUrl,
    fileType: 'image', //文件类型，image/video/audio
    fileName: 'file'
}

/**
 * 使用uni.uploadFile上传文件并返回一个Promise
 * @param {string} tempFilePath - 要上传的临时文件路径
 * @param {Object} [config] - 可选的配置对象
 * @param {function(any, function): void} [config.imgSuccessHandler] - 处理上传成功响应的函数
 * @param {string} [config.url] - 上传的目标URL
 * @param {string} [config.fileType='image'] - 被上传的文件类型（image/video/audio）
 * @param {string} [config.fileName='file'] - 上传请求中文件字段的名称
 * @returns {Promise<string>} 一个Promise，解析后返回上传文件的URL
 */

export function uploadFilePromise(tempFilePath, config) {
    console.log('uploadFilePromise--uploadFilePromise')
    const options = Object.assign(configPrams, config)
    return new Promise((resolve) => {
        uni.uploadFile({
            filePath: tempFilePath,
            url: options.url,
            fileType: options.fileType,
            name: options.fileName,
            success: (res) => options.imgSuccessHandler(res, resolve)
        })
    })
}

function imgSuccessHandler(res, resolve) {
    let resData = JSON.parse(res.data)
    if (resData.code === 200) {
        resolve(resData.url)
    } else {
        console.error(resData.msg)
    }
}

export function updateFileImageList({type, param},fileImageList) {
    if (type === 'del') {
        fileImageList.splice(param, 1)
    } else if (type === 'uploading') {
        fileImageList.push(param)
    } else if (type === 'success') {
        fileImageList.splice(param.fileImageListLen, 1, param.itemAssign)
    }
}
