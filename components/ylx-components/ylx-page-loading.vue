<template>
  <view v-if="showLoading" class="ylx-page-loading" :class="customClass" :style="customStyle">
    <image :src="loadingPage" class="ylx-page-loading-img"></image>
  </view>
</template>
<script>

import {localStringStyle, componentsMixin} from "@/components/ylx-components/ylx-JS/template";
import {loadingPage} from "@/components/ylx-components/ylx-static/base64.js";


export default {
  name: 'ylx-page-loading',
  mixins: [componentsMixin],
  props: {
    showLoading: Boolean,
  },
  data(){
    return {
      loadingPage
    }
  }
}
</script>

<style scoped lang="scss">
.ylx-page-loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.ylx-page-loading-img {
  animation: page-loading 1.5s linear infinite;
  width: 160rpx;
  height: 160rpx;
}

@keyframes page-loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}


</style>

