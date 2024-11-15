<template>
  <view class="page-content-tabbar page-content-padding-x mf-bgc-f5f6f7">
    <ylx-navbar title="首页" bg-color="#fff"></ylx-navbar>

    <ylx-uploadimg ref="refUploadimg" columns-limit="4" :limit="5" :file-image-list="fileImageList"
                   @updateFileImageList="updateFileImageList"></ylx-uploadimg>

    <button @click="uploadimg">uploadimg</button>

    <button @click="sendGlobal">sendGlobal</button>
    <button @click="eventBusMine">跳转tabbar页面</button>
    <hr/>

    <button @click="instanceMyOrderHandler">my-order(需登录)</button>

    <button @click="handleLogin">hasLogin:{{hasLogin}}</button>




<!--    <hr/>
    <button @click="tiktok">抖音</button>
    <button @click="customCamera">自定义相机</button>
    <hr/>-->

    <!--  -->
  </view>
</template>


<script>


import {ylxNavigateTo, ylxRedirectTo} from "@/utils/uniTools";


import instanceEventBus from "@/utils/instanceEventBus.js";
// import useMustLogIn, {loginProxy} from "@/utils/useMustLogIn";

import {ylxEventBus, ylxMustLogIn} from "@/ylxuniCore/useylxuni";

/*-------------------------------------------------------*/
export default {
  data() {
    return {
      fileImageList: [
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
      ],

      /*-----------------1.登录-------------------------*/
      loginProxy:ylxMustLogIn.loginProxyObject
    };
  },
  computed:{
    /*-----------------2.登录-------------------------*/
    hasLogin() {
      return this.loginProxy.login
    },
  },

  onLoad() {

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
    /*-----------------------------------*/

    myOrder() {
      /*instanceEventBus.emit({
        targetPath: '/pagesSubMine/myOrder/myOrder',
        source: 'xixi'
      }, true)*/

      ylxEventBus.emit({
        targetPath: '/pagesSubMine/myOrder/myOrder',
        options: {age: 18},
        source: 'xixi',
      },true)
    },


    handleLogin() {
      console.log('1 handleLogin',ylxMustLogIn.loginProxyObject.login);
      ylxMustLogIn.loginProxyObject.login=!ylxMustLogIn.loginProxyObject.login
      console.log('2 handleLogin',ylxMustLogIn.loginProxyObject.login);
    },
    toLogin() {
      console.log('11111;toLogin')
    },
    instanceMyOrderHandler() {

      ylxMustLogIn.interceptMastLogIn({
        alreadyLoggedIn:this.myOrder,

      })()

    },



    eventBusMine() {
      /*instanceEventBus.emit({
        targetPath: '/pages/mine/mine',
        options: {age: 18}
      }, true, 'switchTab')*/


      ylxEventBus.emit({
        targetPath: '/pages/mine/mine',
        options: {age: 18}
      },true,'switchTab')
    },

    sendGlobal() {
      instanceEventBus.sendGlobal()
    },


  }
}


</script>

<style scoped lang="scss">

</style>
