<template>
  <view class="page-content-tabbar page-content-padding-x mf-bgc-f5f6f7">
    <ylx-navbar title="首页" bg-color="#fff"></ylx-navbar>

    <ylx-uploadimg ref="refUploadimg" columns-limit="4" :limit="5" :file-image-list="fileImageList"
                   @updateFileImageList="updateFileImageList"></ylx-uploadimg>

    <button @click="uploadimg">uploadimg</button>
    <!-- #ifdef MP -->
    <view class="relative">
      <button class="ylx-open-type" open-type="chooseAvatar" @chooseavatar="uniApiChooseAvatar"></button>
      <view class="fs-24">修改头像</view>
    </view>
    <hr/>
    <!-- #endif -->


    <button @click="sendGlobal">sendGlobal</button>
    <button @click="eventBusMine">跳转tabbar页面</button>
    <hr/>

    <button @click="ylxNavigateTo('/pagesSubMine/myOrder/myOrder')"> 1. my-order</button>
    <button @click="interceptToPage(ylxNavigateTo,'/pagesSubMine/myOrder/myOrder')">2. my-order(需要登录)</button>
    <button @click="setToggle">设置登录状态 hasLogin:{{ hasLogin }}</button>
    <view>hasLoading:{{ hasLoading }}</view>


    <!--    <hr/>
        <button @click="tiktok">抖音</button>
        <button @click="customCamera">自定义相机</button>
        <hr/>-->

    <!--  -->
  </view>
</template>


<script>

import {ylxNavigateTo, ylxRedirectTo} from "@/utils/uniTools";

import {ylxEventBus, ylxMustLogIn, ylxNextPage} from "@/ylxuniCore/useylxuni";
import {imgHttpSuccess, uploadFileCallback} from "@/components/ylx-components/ylx-JS/uploadFilePromise";


const {ylxRefresh,ylxMixins, ylxSetFun, ylxSetData, ylxInvokeFn} = ylxNextPage.useNextPage()

/*-------------------------------------------------------*/
export default {
  mixins:[ylxMixins],
  data() {
    return {
      fileImageList: [
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
      ],

      /*-----------------1.登录-------------------------*/
      loginProxy: ylxMustLogIn.loginProxyObject,

      /*-----------------1.加载中-------------------------*/
      loadingProxy: ylxNextPage.loadingProxyObject,
      list:[]
    };
  },
  computed: {
    /*-----------------2.登录-------------------------*/
    hasLogin() {
      return this.loginProxy.login
    },

    /*-----------------2.加载中-------------------------*/
    hasLoading() {
      return this.loadingProxy.loading
    },

    /*-----------------头像-------------------------*/
    avatar() {
      return this.fileImageList[0].url || ''
    },

  },

  onLoad() {

    ylxSetFun(this.add)
    ylxInvokeFn()
  },
  methods: {
    ylxNavigateTo,
    ylxRedirectTo,

    /*--------------上传图片---------------------*/
    updateFileImageList({type, param}) {
      if (type === 'del') {
        this.fileImageList.splice(param, 1)
      } else if (type === 'uploading') {
        this.fileImageList.push(param)
      } else if (type === 'success') {
        this.fileImageList.splice(param.fileImageListLen, 1, param.itemAssign)
      }
    },
    uploadimg() {
      this.$refs.refUploadimg.chooseFile()
    },

    // 上传小程序头像
    uniApiChooseAvatar(avatar) {
      let tempFile = avatar.detail.avatarUrl
      uploadFileCallback(tempFile, imgHttpSuccess, (url) => {
        this.fileImageList = [{url: url}]
      })
    },
    /*--------------上传图片---------------------*/

    /*--------------页面跳转---------------------*/
    myOrder() {

      ylxEventBus.emit({
        targetPath: '/pagesSubMine/myOrder/myOrder',
        options: {age: 18},
        source: 'xixi',
      }, true)
    },
    /*--------------页面跳转---------------------*/

    /*-------------------ylxMustLogIn-----------------------------*/
    interceptToPage(fn, ...args) {
      ylxMustLogIn.intercept({
        success: () => fn(...args),
        fail: () => ylxNavigateTo('/pages/login/login')
      })()
    },
    setToggle() {
      ylxMustLogIn.loginProxyObject.login = !ylxMustLogIn.loginProxyObject.login
    },
    /*-------------------ylxMustLogIn-----------------------------*/

    /*-------------------ylxEventBus-----------------------------*/
    eventBusMine() {

      ylxEventBus.emit({
        targetPath: '/pages/mine/mine',
        options: {age: 18}
      }, true, 'switchTab')
    },

    sendGlobal() {
      ylxEventBus.emitGlobal()
    },
    /*-------------------ylxEventBus-----------------------------*/

    /*------------------------------------------------*/
    //模拟请求接口，获取数据
    add() {
      setTimeout(() => {
        console.log({time: new Date().getSeconds()})
        this.list = ylxSetData({}, {time: new Date().getSeconds()})
      }, 2000)
    },


  }
}


</script>

<style scoped lang="scss">

</style>
