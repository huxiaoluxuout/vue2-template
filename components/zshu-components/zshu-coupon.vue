<template>

  <view class="flex align-center coupon-wrapper" :style="`${customStyle};--bgc:${viewBgColor};--right:${rightNum};--color:${bdColor}`" :class="`${customClass}`">
    <view class="top" :style="{backgroundColor:viewBgColor}"></view>
    <view class="bottom" :style="{backgroundColor:viewBgColor}"></view>
    <view class="left-coupon flex flex-column justify-center flex-1" :style="{backgroundColor:leftBgColor}">
      <slot name="left-content"></slot>
    </view>
    <view class="flex align-center justify-center right-coupon" :style="{backgroundColor:rightBgColor}">
      <slot name="right">
        <view class="right-coupon-text" @click="$emit('couponClick')">{{ text }}</view>
      </slot>
    </view>
  </view>

</template>
<script>


export default {
  name: 'zshu-coupon',
  options: {
    virtualHost: true
  },
  props: {
    text: {
      type: String,
      default: '立即使用'
    },

    customStyle: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    },
    rightBgColor: {
      type: String,
      default: '#272729'
    },
    leftBgColor: {
      type: String,
      default: '#F5F6F7'
    },
    viewBgColor: {
      type: String,
      default: '#fff'
    },
    rightNum: {
      type: String,
      default: '136rpx'
    },
    bdColor: {
      type: String,
      default: 'transparent'
    },


  },

  data() {
    return {}
  },
  methods: {}

}
</script>

<style scoped lang="scss">


.coupon-wrapper {
  position: relative;
  --min-height: 60px;
  min-height: var(--min-height);
  border-radius: 8px;
  border: 2rpx solid;
  box-sizing: border-box;
  z-index: 1;
  color: var(--color);

}

.top, .bottom {
  --width: 28rpx;
  --height: calc((var(--width) / 2) + 2rpx);
  width: var(--width);
  height: var(--height);

  position: absolute;
  right: var(--right);
  overflow: hidden;
  border-left: 2rpx solid;
  border-right: 2rpx solid;
  box-sizing: border-box;
}

.coupon-wrapper:after, .coupon-wrapper:before {
  display: block;
  content: '';
  width: 28rpx;
  height: 2rpx;
  background-color: var(--bgc);
  position: absolute;
  right: var(--right);
}

.coupon-wrapper:after {
  transform: translate(50%, 50%);
  bottom: -2rpx;

}

.coupon-wrapper:before {
  transform: translate(50%, -50%);
  top: -2rpx;
}

.top {
  top: 0;
  transform: translate(50%, -2rpx);
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  border-bottom: 2rpx solid;
}

.bottom {
  bottom: 0;
  transform: translate(50%, 2rpx);
  border-top-left-radius: var(--height);
  border-top-right-radius: var(--height);
  border-top: 2rpx solid;
}

.left-coupon {
  border-radius: inherit;
  align-self: stretch;
}

.right-coupon {
  width: var(--right);
  align-self: stretch;
  border-radius: inherit;

  .right-coupon-text {
    width: 2.5em;
    word-break: break-word;
    text-align: center;
    font-size: 28rpx;
    color: #FFFFFF;
  }
}


</style>

