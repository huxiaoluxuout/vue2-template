<template>
  <view class="ylx-flex-container label-view" :class="customClass" :style="resultCustomStyle">

    <view class="ylx-flex-item item-pick"
          :class="[isActiveClass(item.id) ,customItemClass]" :style="[isActiveStyle(item.id)]"
          v-for="(item,index) in labelList" :key="item.id" @click="chooseLabel(item.id,index)">

      <slot name="default" :item="item">{{ item[keyName] }}</slot>

    </view>

  </view>
</template>
<script>

import {localStringStyle, ylxStyleObjectToString, componentsMixin} from "@/components/ylx-components/ylx-JS/template";


export default {
  name: 'ylx-pick',
  mixins: [componentsMixin],

  props: {
    labelList: {
      type: Array,
      default: () => []

    },
    // 父组件选中ID
    activeIds: {
      type: Array,
      default: () => []
    },

    checkbox: Boolean, // 多选选模式
    disabled: Boolean, // 禁用选择
    stop: Boolean, // 阻止事件冒泡
    // ID已存在点击可以取消
    cancelAlreadyId: Boolean,

    limit: {
      type: [Number, String],
      default: Number.MAX_SAFE_INTEGER   // 多选时默认限制的个数
    },


    rounded: {
      type: String,
      default: '100px'
    },

    size: {
      type: String,
      default: '12px'
    },

    bgColor: {
      type: String,
      default: '#F9F9FC'
    },

    color: {
      type: String,
      default: '#303033'
    },

    keyName: {
      type: String,
      default: 'text'
    },

    numColumns: {
      type: [String, Number],
      default: 2
    },

    gap: {
      type: [String],
      default: '20rpx'
    },


    customClass: {
      type: String,
      default: ''
    },
    customStyle: {
      type: [Object, String],
      default: () => {
      }
    },

    customItemClass: {
      type: [Object, String],
      default: ''
    },
    customItemStyle: {
      type: [Object, String],
      default: () => {
      }
    },

    customActiveClass: {
      type: String,
      default: ''
    },
    customActiveStyle: {
      type: [Object, String],
      default: () => {
      }
    },
    borderDisable: Boolean,


  },
  computed: {
    resultCustomStyle() {
      return ylxStyleObjectToString({
        '--num-columns': this.numColumns,
        '--gap': this.gap,
      }) + localStringStyle(this.customStyle)
    },

    resultItemStyle() {
      return ylxStyleObjectToString({
        'borderRadius': this.rounded,
        'fontSize': this.size,
        'color': this.color,
        'backgroundColor': this.bgColor,
        border: this.borderDisable ? 'none' : '1px solid #F2F2F2'

      }) + localStringStyle(this.customItemStyle)

    },

    resultActiveStyle() {
      return ylxStyleObjectToString({
        'borderRadius': this.rounded,
        'fontSize': this.size,

      }) + localStringStyle(this.customActiveStyle)
    },


  },


  data() {
    return {}
  },
  methods: {
    isActiveClass(id) {
      return this.activeIds.includes(id) ? this.customActiveClass : 'active-class';
    },

    isActiveStyle(id) {
      return this.activeIds.includes(id) ? this.resultActiveStyle : this.resultItemStyle;
    },

    // 选择标签
    chooseLabel(ID, index) {
      // console.log('选择标签', ID, this.activeIds)
      const {activeIds, checkbox, limit: numLimit, disabled, cancelAlreadyId} = this;

      let limit = Number(numLimit)
      if (disabled) {
        return;
      }

      const idAlready = activeIds.includes(ID);

      // 多选
      if (checkbox) {
        if (idAlready && cancelAlreadyId) {
          // 取消
          activeIds.splice(index, 1);
        } else {
          if (limit && limit <= activeIds.length) {
            console.warn(`最多可选${limit}个`)
            return;
          }
          activeIds.push(ID);
        }
      } else {
        // 单选

        if (idAlready && cancelAlreadyId) {
          activeIds.pop()
        } else {
          activeIds.length = 0;
          activeIds.push(ID);

        }
      }
    },
    // 删除
    deleteLabel(index, id) {
      let idIndex = this.activeIds.findIndex(ID => id === ID);
      if (idIndex !== -1) {
        // 直接修改父组件数据
        this.activeIds.splice(idIndex, 1);
      }
    },
  }

}
</script>

<style scoped lang="scss">

.label-view {
  height: max-content;

  .item-pick {
    box-sizing: border-box;
    text-align: center;
  }

}

.close-circle {
  position: absolute;
  top: calc(-1 * var(--icon-top));
  right: calc(-1 * var(--icon-right));
}


</style>

