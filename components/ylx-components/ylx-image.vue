<template>
  <view class="ylx-image" :class="customClass" :style="resultCustomStyle">

    <view v-if="loadingStatus==='uploading'" class="ylx-loading">
      <view class="loading-content" :class="customLoadingClass" :style="resultLoadingStyle"></view>
    </view>

    <image v-show="loadingStatus==='success'" class="ylx-scale-img" :style="imageStyle+customStyle" :src="imageSrc" :mode="mode" :showMenuByLongPress="showMenuByLongPress"
           @click="clickHandler" @load="loadingStatus = 'success'" @error="loadingStatus = 'error'"></image>

    <view v-if="loadingStatus==='error'" class="ylx-error-img" :class="customLoadingErrClass" :style="resultLoadingErrStyle"></view>

  </view>
</template>

<script>

import {componentsMixin, localStringStyle, ylxStyleObjectToString} from "@/components/ylx-components/ylx-JS/template";
import {computedRatio, parseSize} from "@/utils/tools";

export default {
  name: "ylx-image",
  mixins: [componentsMixin],
  props: {

    // 宽高比例
    scale: {
      type: String,
      default: '1'
    },
    // 当前可用总宽度
    width: {
      type: String,
      default: `750rpx`
    },
    height: {
      type: String,
      default: 'auto'
    },
    imageStyle: {
      type: String,
      default: ''
    },

    src: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      validator: function (value) {
        return ['widthFix', 'aspectFill', 'heightFix', 'scaleToFill'].includes(value);
      },
      default: 'aspectFill'
    },

    // 开启长按图片显示识别小程序码菜单
    showMenuByLongPress: Boolean,

    customLoadingClass: {
      type: String,
      default: 'loading-class'
    },
    customLoadingStyle: {
      type: [Object, String],
      default: () => {
      }
    },
    customLoadingErrClass: {
      type: String,
      default: 'loading-class-err'
    },
    customLoadingErrStyle: {
      type: [Object, String],
      default: () => {
      }
    },

    preview: Boolean,


  },
  data() {
    return {
      loadingStatus: 'uploading',
    };
  },

  computed: {
    imageSrc() {
      if (!this.src.trim()) {
        this.loadingStatus = 'error'
      }
      return this.src
    },
    resultCustomStyle() {
      const result = computedRatio(this.scale);
      const {num: width, unit} = parseSize(this.width);
      const ratio = parseFloat(result);

      let attrObj = {
        '--scale': result,
        '--item-width': this.width,
        'backgroundColor': '#e9e9e94d',
      };
      attrObj['--loading-height-width'] = this.width

      if (ratio !== 1) {
        attrObj['--loading-height-width'] = ratio === 0 ? this.width : (ratio > 1 ? (width / ratio) : (width * ratio)) + unit;
      }

      if (this.height !== 'auto') {
        attrObj['--item-height-scale'] = this.height;
        attrObj['--loading-height-width'] = this.height; // 更新高度，如果设置了具体高度
      }

      if (this.loadingStatus === 'success') {
        attrObj['backgroundColor'] = 'transparent'
      }


      return ylxStyleObjectToString({
        ...attrObj
      }) + localStringStyle(this.customStyle)
    },

    resultLoadingStyle() {
      return ylxStyleObjectToString({}) + localStringStyle(this.customLoadingStyle)
    },
    resultLoadingErrStyle() {
      return ylxStyleObjectToString({}) + localStringStyle(this.customLoadingErrStyle)
    }
  },
  methods: {
    clickHandler() {
      const that = this

      if (this.preview) {
        uni.previewImage({
          urls: [that.src],
          current: 0,
        })
        return
      }
      this.$emit('imgClick')
    },
  }

}
</script>

<style scoped lang="scss">

/*宽高比例（不能直接写成分数形式）*/
.ylx-image {
  --scale: 1;
  --item-height-scale: calc(var(--item-width) / var(--scale));
  width: var(--item-width);
  height: var(--item-height-scale);
  position: relative;
  box-sizing: border-box;
  font-size: 0;

}


.ylx-loading {
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 50%;
  height: var(--loading-height-width);
  width: var(--loading-height-width);
  transform: translate(-50% -50%);
  animation: loading 1s steps(10) infinite;
}

.loading-content {
  width: 40%;
  height: 40%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.loading-class {
  background-image: url('ylx-static/loading.png');
}


@keyframes loading {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}


.ylx-scale-img {
  width: var(--item-width);
  height: var(--item-height-scale);
  box-sizing: border-box;
  position: relative;
  will-change: transform;
  border-radius: inherit;
}

.ylx-error-img {
  width: 40%;
  height: 40%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.loading-class-err {
  background-image: url('ylx-static/loading-err.png');
}

</style>
