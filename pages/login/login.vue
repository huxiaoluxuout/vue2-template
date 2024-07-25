<template>
  <view class="page-content login" :style="{'--navbar-height':`${navbarHeight}px`}">
    <ylx-navbar
        :configNavBar="{ hiddenLeftIcon: false,hiddenBorder: true}" bg-color="transparent"
        @navbarHeight="(e)=>navbarHeight=e">
    </ylx-navbar>

    <view class="login-flex">
      <ylx-gap height="100px"></ylx-gap>
      <view class="login-flex">
        <image class="logo" src="/static/logo.png"></image>
        <view class="title">您好!</view>
        <view class="subtitle">欢迎使用</view>

      </view>


      <ylx-gap height="30px"></ylx-gap>


      <!--  #ifdef MP -->
      <ylx-button custom-class="login-btn active-bgc" custom-style="font-size:14px;line-height: 3.4;"
                  open-type="getPhoneNumber" @getphonenumber="getMobilePhone"
                  text="微信一键登录"></ylx-button>
      <!-- #endif -->

      <!--  #ifdef WEB || APP-PLUS-->
      <ylx-button custom-class="login-btn active-bgc" custom-style="font-size:14px;line-height: 3.4;"
                  @btnClick="getTestToken"
                  text="微信一键登录"></ylx-button>
      <!-- #endif -->


    </view>
  </view>
</template>

<script>
import {ylxLoginCode, ylxRedirectTo} from "@/utils/uniTools";
import {localToken, wxRegister} from "@/network/apis/meiFa";

export default {
  data() {
    return {
      navbarHeight: 44
    }
  },
  methods: {
    // 测试使用
    getTestToken() {
      localToken().then(loginRes => {
        const resData = loginRes.data
      })
    },

// 获取手机号
    getMobilePhone(btnEvent) {
      ylxLoginCode().then(loginCodeRes => {
        wxRegister({
          phone_code: btnEvent.detail.code,
          code: loginCodeRes.code,
        }).then((loginRes) => {
          const resData = loginRes.data

        })
      })
    },

    setToken(resData) {
      uni.setStorage({
        key: 'token',
        data: resData.token,
        success: function () {
          ylxRedirectTo('pages/index/index')
        }
      })
    }

  }
}

</script>

<style scoped lang="scss">
.page-content {
  /* #ifdef WEB */
  min-height: calc(100vh - var(--window-top));
  /* #endif */

  /* #ifndef WEB */
  min-height: 100vh;
  /* #endif */
  margin: 0 30rpx;
}

.login-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.logo{
  width: 200rpx;
  height: 200rpx;
  display: block;
}

.title {
  color: #272729;
  font-weight: bold;
  font-size: 24px;
  margin-top: 20rpx;
}

.subtitle {
  color: #272729;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10rpx;

}

/*--------------------------------------*/
:deep(.login-btn) {
  font-size: 18px;
  color: #ffffff;
  font-weight: bolder;
  background: #272729 !important;
  width: 90% !important;

}


.page-content .active-bgc.active-bgc.active-bgc.active-bgc {
  background-color: #272729 !important;
}

/*--------------------------------------*/


</style>
