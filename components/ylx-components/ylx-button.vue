<template>
  <button :class="customClass" class="btn" :style="resultCustomStyle" @click.stop="btnClick">{{ text }}</button>
</template>
<script>
import {localStringStyle, ylxStyleObjectToString, componentsMixin} from "@/components/ylx-components/ylx-JS/template";

export default {
  mixins: [componentsMixin],

  name: 'ylx-button',

  props: {

    text: {
      type: String,
      default: '按钮'
    },
    size: {
      type: String,
      default: '14px'
    },
    color: {
      type: String,
      default: '#fff'
    },
    bgColor: {
      type: String,
      default: '#5CBAFA' // 'transparent'
    },
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    rounded: {
      type: String,
      default: '100px'
    },
    disabled: Boolean

  },
  computed: {

    resultCustomStyle() {
      return ylxStyleObjectToString({
        height: this.height,
        width: this.width,
        fontSize: this.size,
        borderRadius: this.rounded,
        backgroundColor: this.bgColor,
        color: this.color,
      }) + localStringStyle(this.customStyle) + (`filter:grayscale(${this.disabled ? .98 : 0}) opacity(${this.disabled ? 0.8 : 1}) `)
    },
  },

  methods: {
    btnClick() {
      !this.disabled ? this.$emit('btnClick') : this.$emit('btnClickErr')
    },
  }


}
</script>

<style scoped>
.btn {

}

.btn:after {
  border: none;
}
</style>

