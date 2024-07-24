<template>
  <view className="page-content">

    22121212121212
  </view>
</template>

<script>
import instanceEventBus from "@/utils/instanceEventBus.js";

export default {
  data() {
    return {
      pageLoading: false,
      activeIds: [0],
      myOrderList: [],
      labelList: [
        {id: 0, text: '全部'},
        {id: 1, text: '待付款'},
        {id: 2, text: '待美发'},
        {id: 3, text: '美发中'},
        {id: 4, text: '待评价'},
        {id: 5, text: '已完成'},],
    }
  },
  computed: {
    activeStatus() {
      return this.activeIds[0]
    },
  },
  onLoad(option) {
    instanceEventBus.on(({args, source}) => {
      console.log('instanceWxEventBus', ...args, source)
    });

    this.activeIds = [Number(option.id)]

  },
}

</script>

<style scoped lang="scss">

</style>
