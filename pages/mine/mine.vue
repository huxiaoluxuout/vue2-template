<template>
  <view class="page-content-tabbar">
    <ylx-gap height="1rpx"></ylx-gap>
    hasLogged:{{hasLogged}}
    <view class="nav-bottom-wrapper">
      <view class="flex align-center justify-between nav-item" v-for="item in myOrderGridList" :key="item.id" @click="ylxNavigateTo(item.pagePath+'?id='+item.id)">
        <text class="nav-text">{{ item.text }}</text>
        <view class="ylx-section-wrapper__right">》</view>
      </view>
    </view>
  </view>
</template>
<script>
import instanceEventBus from "@/utils/common/eventBus/instance.js";
import {ylxNavigateTo} from "@/utils/uniTools";
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      myOrderGridList: [
        {id: 1, text: "待付款", iconSrc: '/static/mine_order_icon_1.png', pagePath: 'pagesSubMine/myOrder/myOrder'},
        {id: 2, text: "待美发", iconSrc: '/static/mine_order_icon_2.png', pagePath: 'pagesSubMine/myOrder/myOrder'},
        {id: 3, text: "美发中", iconSrc: '/static/mine_order_icon_3.png', pagePath: 'pagesSubMine/myOrder/myOrder'},
        {id: 4, text: "待评价", iconSrc: '/static/mine_order_icon_4.png', pagePath: 'pagesSubMine/myOrder/myOrder'},
        {id: 5, text: "已完成", iconSrc: '/static/mine_order_icon_5.png', pagePath: 'pagesSubMine/myOrder/myOrder'},
      ]
    }
  },
  computed: {
    ...mapGetters(['hasLogged'])
  },
  onLoad() {
    instanceEventBus.on(({args, source}) => {
      console.log(...args, source)
    });
  },
  methods: {ylxNavigateTo}
}
/*---------------------------------------------------------------*/
</script>


<style scoped lang="scss">
.nav-bottom-wrapper {
  margin-left: 30rpx;
  margin-right: 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 0 30rpx;
  box-sizing: border-box;

  .nav-item {
    border-bottom: 1px solid #E4E7F0;
    padding-top: 30rpx;
    padding-bottom: 30rpx;
    gap: 8px;

    position: relative;

    .nav-icon-left {
      width: 36rpx;
      height: 36rpx;
    }
  }

  .nav-item:last-child {
    border-bottom: 1px solid transparent;
  }

  .nav-text {
    font-size: 14px;
    color: #272729;
  }

}

</style>
