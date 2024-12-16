<template>
  <view :class="customClass" :style="resultCustomStyle">
    我是模板
  </view>
</template>
<script>


import {componentsMixin, ylxStyleObjectToString} from "@/components/ylx-components/ylx-JS/template";

export default {
  mixins: [componentsMixin],

  name: 'ylx-template',

  props: {


  },
  computed: {
    resultCustomStyle() {
      return ylxStyleObjectToString({
        // 其它代码

      }) + this.customStringStyle
    },
  },

  methods: {}

}
</script>


