<template>
  <view class="page-content-tabbar page-content-padding-x mf-bgc-f5f6f7">
    <ylx-navbar title="首页" bg-color="#fff"></ylx-navbar>

    <ylx-uploadimg ref="refUploadimg" columns-limit="4" :limit="5" :file-image-list="fileImageList"
                   @updateFileImageList="updateFileImageList"></ylx-uploadimg>

    <button @click="uploadimg">uploadimg</button>
    <hr/>

    hasLogged:{{ hasLogged }}
    <button @click="setLoggedIn">asyncSetIsLoggedIn</button>
    <button @click="instanceMyOrderHandler">my-order</button>

    <hr/>
    <button @click="sendGlobal">sendGlobal</button>
    <button @click="eventBusMine">eventBusMine</button>
    <hr/>

    <hr/>
    <button @click="tiktok">抖音</button>
    <button @click="customCamera">自定义相机</button>
    <hr/>

    <!--    <button @click="buttontn">uniBLUETOOTH</button>-->
    <div v-for="(item,index) in 4" :key="index" style="margin-top: 10px;margin-bottom: 10px;">
      AAALorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aut consequatur cum delectus deleniti
      eius eos explicabo facere magnam, maxime omnis quam quidem velit voluptas voluptatum.
    </div>
    <!--  -->
  </view>
</template>


<script>
import {mapGetters} from 'vuex'

import {ylxBluetoothAuthorize, ylxNavigateTo} from "@/utils/uniTools";
import useBluetoothManage from "@/utils/common/bluetooth/useBluetoothManage";

import instanceEventBus from "@/utils/common/eventBus/instance.js";
import useLoginInterceptor from "@/utils/useLoginInterceptor";
/*-------------------------------------------------------*/
export default {
  data() {
    return {
      refUploadimg: null,
      fileImageList: [
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
        {url: "https://mf.hzjxsj.com/uploads/20240706/790ec706d1ad37a8e11617af3385fdfa.png"},
      ],
      /*------------------------------------------*/
      isInitBle: false,// 蓝牙已经初始化
      bleIsConnected: false,// 蓝牙已经连接
      allBluetoothList: [],
      /*------------------------------------------*/
    };
  },

  computed: {
    ...mapGetters(['hasLogged'])
  },
  onLoad() {

  },
  methods: {
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
      instanceEventBus.emit({
        targetPath: '/pagesSubMine/myOrder/myOrder',
        source: 'xixi'
      }, true)
    },
    instanceMyOrderHandler() {
      useLoginInterceptor({onSuccess: this.myOrder})()
    },
    setLoggedIn() {
      this.$store.dispatch('asyncSetIsLoggedIn', !this.hasLogged)
    },


    eventBusMine() {
      instanceEventBus.emit({
        targetPath: '/pages/mine/mine',
        options: {age: 18}
      }, true, 'switchTab')
    },

    sendGlobal() {
      instanceEventBus.sendGlobal()
    },
    /*----------------------------------------*/
    tiktok() {
      ylxNavigateTo('pagesZdemo/pagesAppNvu/dou_yin/dou_yin')
    },
    customCamera() {
      ylxNavigateTo('pagesZdemo/pagesAppNvu/custom-camera/custom-camera')
    },
    /*-----------------------------------*/
    buttontn() {
      const {onSuccess, onError} = ylxBluetoothAuthorize()
      onSuccess(() => {
        uni.showToast({title: '正在搜索周围的设备', icon: 'loading', duration: 5000})
        useBluetoothManage.initBle([])
            .then(bluetoothList => {
              const bleList = JSON.parse(JSON.stringify(bluetoothList));
              this.allBluetoothList = bleList;
              uni.setStorage({
                key: 'bluetoothList',
                data: bleList,
                success() {
                  uni.hideToast()
                  uni.stopPullDownRefresh()
                },
              })
            }).catch(err => {
          uni.hideToast()
          console.log('initBle', err)
        })
      })
      onError(() => {
        this.isInitBle = false
        this.bleIsConnected = false
      })
    }
    /*-----------------------------------*/

  }
}


</script>

<style scoped lang="scss">

</style>
