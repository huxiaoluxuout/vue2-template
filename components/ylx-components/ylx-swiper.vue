<template>
  <view :class="customClass" :style="resultCustomStyle">
    <view class="ylx-swiper width-height" :style="{'--width':width,'--scale':resultScale}">
      <swiper :current="resultCurrent" @change="ylxSwiperChange" class="width-height">
        <swiper-item v-for="(item,index) in swiperList" :key="index">
          <view class="width-height">
            <ylx-image :width="width" custom-style="border-radius: 8px;" :scale="scale" :src="item[srcKey]" @imgClick="swiperPreviewImg(index)"></ylx-image>
          </view>
        </swiper-item>
      </swiper>

      <view v-if="!indicatorImage">
        <view class="indicator" :style="{bottom:indicatorBottom}">
          <view class="indicator-item" :class="{'active':resultCurrent===index}" v-for="(item, index) in swiperList" @click="btnClick(index)" :key="index">
          </view>
        </view>
      </view>
      <view v-else>

        <view class="indicator-image">
          <view class="flex flex-gap-10 ylx-padding-bottom-10 ylx-padding-top-10 ylx-margin-left-15 ylx-margin-right-15">
            <ylx-image width="104rpx" height="116rpx" :image-style="`border-radius: 8px;transition-property: border;transition-duration: 80ms;${resultCurrent===index?'border: 1px solid #272729':''};`"
                       custom-class="indicator-item-img" :src="item['src']" v-for="(item, index) in swiperList" @imgClick="btnClick(index)" :key="index"
            ></ylx-image>
          </view>

        </view>
      </view>


    </view>
  </view>
</template>
<script>

import {componentsMixin, localStringStyle, ylxStyleObjectToString} from "@/components/ylx-components/ylx-JS/template";
import {computedRatio} from "@/utils/tools";

export default {
  mixins: [componentsMixin],

  name: 'ylx-swiper',

  props: {
    current: {
      type: [String, Number],
      default: 0
    },
    swiperList: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: '320rpx'
    },
    scale: {
      type: String,
      default: '1'
    },
    srcKey: {
      type: String,
      default: 'src'
    },
    indicatorBottom: {
      type: String,
      default: '15rpx'
    },
    indicatorImage: Boolean,
    preview: Boolean,

  },
  computed: {


    resultCustomStyle() {
      return ylxStyleObjectToString({
        // 其它代码
      }) + localStringStyle(this.customStyle)
    },
    resultScale() {
      return computedRatio(this.scale)
    },
    resultCurrent() {
      return this.current
    },
  },

  methods: {
    ylxSwiperChange(event) {
      this.$emit('updateCurrent', event.detail.current)
    },

    btnClick(index) {
      this.$emit('updateCurrent', index)
    },
    // 预览
    swiperPreviewImg(index) {
      if (this.preview) {
        uni.previewImage({
          urls: this.swiperList.map(item=>item[this.srcKey]),
          current: index,
        })
      }


    },
  }

}
</script>

<style scoped lang="scss">
.ylx-swiper {
  position: relative;

  .indicator {
    position: absolute;
    bottom: 15rpx;
    left: 0;
    right: 0;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 20rpx;
    justify-content: center;

    .indicator-item {
      height: 3px;
      width: 20rpx;
      border-radius: 10px;
      background-color: #ffffff80;

    }

    .active {
      width: 34rpx;
      background-color: #fff;
      transition-property: width;
      transition-duration: 80ms;
    }

  }
}

.width-height {
  --height-scale: calc(var(--width) / var(--scale));
  width: var(--width);
  height: var(--height-scale);
  position: relative;
}

/*-------------------*/
.indicator-image {
  position: absolute;
  bottom: 50rpx;
  left: 30rpx;
  right: 30rpx;
  background-color: #ebd9c9cf;
  border-radius: 16px;

}
</style>
