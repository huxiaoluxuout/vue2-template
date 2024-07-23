<template>
  <view class="page-content login " :style="{'--navbar-height':`${navbarHeight}px`}">
    <ylx-navbar
        :configNavBar="{ hiddenLeftIcon: false,hiddenBorder: true}" bg-color="transparent"
        @navbarHeight="(e)=>navbarHeight=e">
    </ylx-navbar>

    <view class="login-flex" style="width: 100%;">
      <ylx-gap height="100px"></ylx-gap>
      <view class="login-flex">
        <view class="title">LOGO</view>
        <view style="font-size: 14px; margin-top: 20rpx; color:#919499;">欢迎使用壹剪美小程序</view>
      </view>

      <ylx-image width="400rpx" src="/static/logo.png"></ylx-image>
      <ylx-gap height="30px"></ylx-gap>


      <!--  #ifdef MP -->
      <ylx-button custom-class="login-btn active-bgc" custom-style="font-size:14px;line-height: 2.8;" open-type="getPhoneNumber" @getphonenumber="getMobilePhone"
                  text="微信用户一键登录"></ylx-button>
      <!-- #endif -->

      <!--  #ifdef WEB || APP-PLUS-->
      <ylx-button custom-class="login-btn active-bgc" custom-style="font-size:14px;line-height: 2.8;" @btnClick="getTestToken"
                  text="微信用户一键登录"></ylx-button>
      <!-- #endif -->


    </view>
  </view>
</template>

<script>
import {localToken, wxRegister} from "@/network/apis/meiFa";
import {ylxLoginCode, ylxRedirectTo} from "@/utils/uniTools";
import store from "@/store";

export default {
  options: {
    styleIsolation: 'shared'
  },
  data() {
    return {
      navbarHeight:44
    }
  },
  methods: {
    // 获取手机号
    getMobilePhone(btnEvent) {
      ylxLoginCode().then(loginCodeRes => {
        wxRegister({
          phone_code: btnEvent.detail.code,
          code: loginCodeRes.code,
        }).then((loginRes) => {
          const resData = loginRes.data
          this.setToken(resData)
        })
      })
    },
// 测试使用
    getTestToken() {
      localToken().then(loginRes => {
        const resData = loginRes.data
        this.setToken(resData)
      })
    }
  },
  setToken(resData) {
    store.dispatch('asyncLogin',resData)

    uni.setStorage({
      key: 'token',
      data: resData.token,
      success: function () {
        ylxRedirectTo('pages/index/index')

      }
    })
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

}

.login-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {

  box-sizing: border-box;
  padding: 10px;
  width: 200rpx;
  height: 200rpx;
  background: #fff;
  border-radius: 20rpx;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.login-title {
  font-size: 18px;
  color: #333333;
  font-weight: bolder;
}


</style>
<style lang="scss" scoped>

:deep(.login-btn) {
  font-size: 18px;
  color: #ffffff;
  font-weight: bolder;
  background: #272729 !important;
  width: 90%;

}


.page-content .active-bgc.active-bgc.active-bgc.active-bgc {
  background-color: #272729 !important;
}

/*------------------------------*/
.item__content {
  position: relative;
  font-size: 14px;
  box-sizing: border-box;
  flex-direction: row;
  width: 80%;
  margin-top: 40px;
}

.item-content {
  padding-bottom: 10px;
  position: relative;
  border-bottom: 1px solid #ffffff;
}


.tips-text {
  font-size: 12px;
  color: #939393;
  margin-top: 10px;
}

.right-arrow-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  gap: 10px;
  justify-content: space-between;

  .left-name {
    font-size: 16px;
    font-weight: bold;
    color: #3a3a3c;
  }

  .nickname-input {
    text-align: right;
    font-size: 14px;
  }

  .avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: block;

  }

  .avatar-choose {
    position: absolute;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
  }

  .avatar-choose:after {
    border: none;
  }
}

</style>
