<template>
  <view class="page-content bgc-fff">
    <web-view :src="https"></web-view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      https: `https://cn.vuejs.org/guide/components/slots.html#scoped-slots`
    }
  }
}
</script>


<style>

</style>
