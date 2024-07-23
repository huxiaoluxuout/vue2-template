const productionUrl = ''

// const devURL = 'http://192.168.2.100:8071' //本地测试地址
const devURL = 'https://mf.hzjxsj.com' //


const BASE_URL = devURL

// 上传文件路径
const uploadFileUrl = BASE_URL + '/api/common/upload'
// 服务器图片路径
const imgSrc = BASE_URL + '/static/images/'

// 路过图床(公共的)
const LU_GUO_IMG_URL='https://s21.ax1x.com'

console.log('BASE_URL', BASE_URL)

export {
    BASE_URL,
    uploadFileUrl,
    imgSrc,
    LU_GUO_IMG_URL
}

