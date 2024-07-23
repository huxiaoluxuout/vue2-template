<template>
  <view class="root-tabbar" :style="{ '--ios-bottom-height':iosBottomHeight +'px'}">
    <view class="tabbar-container">
      <view class="item-wrapper" v-for="(item, itemIndex) in list" :key="item.text" @click="clickNavHandler(ylxNavigateTo,itemIndex)">
        <view class="item-container">
          <image v-if="INDEX ===itemIndex" mode="aspectFit" class="icon-item" :class="{'icon-item-big':itemIndex===1}"
                 :src="'/'+item.selectedIconPath"/>

          <image v-else mode="aspectFit" class="icon-item" :class="{'icon-item-big':itemIndex===1}"
                 :src="'/'+item.iconPath"/>

          <view class="foot-text" :style="{color:INDEX === itemIndex?selectedColor:color}">{{ item.text }}</view>

          <view class="notice" v-show="false">消息角标</view>

        </view>
      </view>
    </view>
    <view class="ios__bottom-tabbar__height"></view>
  </view>
</template>
<script>

import pagesConfig from "@/pages.json";

const {tabBar: {list, color, selectedColor}} = pagesConfig


import {ylxIOSBottomHeight, ylxNavigateTo} from "@/utils/uniTools";

export default {
  props: {
    INDEX: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      iosBottomHeight: ylxIOSBottomHeight(),
      list,
      selectedColor,
      color
    }
  },

  created() {
    uni.hideTabBar()
  },

  methods: {
    ylxNavigateTo,

    clickNavHandler(fun, itemIndex) {
      // console.log('itemIndex', itemIndex)

      const item = list[itemIndex]

      this.$emit('tabBarClick')


      fun(item.pagePath + '?tabBarId=' + itemIndex)
    }
  }
}
</script>

<style lang="scss" scoped>

.root-tabbar {
  --icon-width: 26px;
  --inc: 20px;
  --tabbar-height: 60px;

}

.ios__bottom-tabbar__height {
  height: calc(var(--tabbar-height) + var(--ios-bottom-height));
}

.tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(var(--tabbar-height) + var(--ios-bottom-height));
  background: #fff;
  display: flex;
  flex-direction: row;
  z-index: 1000;
  padding: 4px 4px calc(4px + var(--ios-bottom-height));
  box-sizing: border-box;
  border-top: 1px solid #f1f1f1;
}

.item-wrapper {
  display: flex;
  flex: 1;
  height: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.item-container {
  width: calc(var(--icon-width) + var(--inc));
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.foot-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  font-size: 14px;
  color: #D0D4DD;
}

.icon-item {
  width: var(--icon-width);
  height: var(--icon-width);
  display: block;
}

.icon-item-big {
  width: calc(var(--icon-width) + var(--inc));
  height: calc(var(--icon-width) + var(--inc));
  display: block;
  transform: translateY(-50%);
}

// 角标
.notice {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #fd5958;
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  box-sizing: border-box;
  width: 1.4em;
  height: 1.4em;
  text-align: center;
  line-height: 1.4em;
  transform: translate(50%, -50%);

}

</style>
