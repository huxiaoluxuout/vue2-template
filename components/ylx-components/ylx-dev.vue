<template>

  <view class="dev">
    <slot name="default"></slot>
  </view>

</template>

<script>


export default {
  name: "ylx-dev",

  data() {
    return {}
  },

}
</script>
<style>
.dev {
  position: fixed;
  top: 130rpx;
  left: 60rpx;
  right: 60rpx;
  background-color: rgba(0, 0, 0, .3);
  color: red;
  font-size: 30px;
  padding: 20rpx;
  border-radius: 10rpx;
  z-index: 5000;
  text-align: center;
  box-sizing: border-box;
  text-shadow:
      -1px -1px 0 #fafafa,
      1px -1px 0 #fafafa,
      -1px 1px 0 #fafafa,
      1px 1px 0 #fafafa;
}
</style>
