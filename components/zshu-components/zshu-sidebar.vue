<template>
  <view :style="`--bg-color:${bgColor};--color:${color};--size:${size};${customStyle}`" :class="`${customClass}`">
    <view  v-if="vertical">
      <text class="tab-sidebar-vertical">{{ textView }}</text>
      <text class="tab-sidebar2">{{ textView2 }}</text>

    </view>
    <text v-else class="tab-sidebar">{{ text }}</text>

  </view>
</template>
<script>


import {componentsMixin} from "@/components/zshu-components/JS/template";

export default {
  name: 'zshu-sidebar',
  mixins: [componentsMixin],

  props: {

    text: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: '#D63636'
    },
    color: {
      type: String,
      default: '#272729'
    },
    size: {
      type: String,
      default: '14px'
    },
    customStyle: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    },
    vertical: Boolean

  },
  computed: {
    textView() {
      return this.text.slice(0, 2)
    },

    textView2() {
      if (this.text.length > 2) {
        return this.text.slice(2, this.text.length)
      } else {
        return ''
      }
    },
  },

  data() {
    return {}
  },
  methods: {}

}
</script>

<style scoped lang="scss">


.tab-sidebar {
  position: relative;
  box-sizing: border-box;
  color: var(--color);
  font-size: var(--size);
}

.tab-sidebar:before {
  --left: -16rpx;
  position: absolute;
  left: var(--left);
  top: 50%;
  transform: translateY(-50%);
  content: '';
  display: block;
  background-color: var(--bg-color);
  height: 62%;
  width: 6rpx;
  border-radius: 100px;
}

.tab-sidebar-vertical,.tab-sidebar2 {
  position: relative;
  box-sizing: border-box;
  color: var(--color);
  font-size: var(--size);

}

.tab-sidebar-vertical:before {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  content: '';
  display: block;
  background-color: var(--bg-color);
  height: 4rpx;
  width: 100%;
  border-radius: 100px;
}


</style>

