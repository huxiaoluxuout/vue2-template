<template>
  <view class="ylx-navbar" :style="{opacity:viewOpacity,'--navbar-height':navbarHeight+'px'}">
    <view class="ylx-navbar-wrap" :style="navbarStyle_">
      <view class="navbar-content__container">
        <view class="ylx-navbar-container" :style="ylxNavbarContainerStyle">
          <template v-if="!configNavBar_.hiddenLeftIcon">
            <view v-if="configNavBar_.isTabBarPage" class="navbar-container__left">
              <slot name="left"></slot>
            </view>

            <view v-else class="navbar-container__left" @click="leftIconClick">
              <slot name="left_back_icon">
                <text class="iconfont" :class="defaultLeftIconName" :style="resultCustomLeftIconStyle"></text>
              </slot>
            </view>
          </template>

          <view class="ylx-navbar-container__center" :style="{justifyContent:justifyContent}">
            <slot name="center">
              <view class="ylx-navbar-content-title">
                <template v-if="configNavBar_.title">
                  <view style="display: flex;align-items: center;width: 100%;" :style="titleStyle_">
                    <view style="flex:1;"></view>
                    <!-- #ifdef MP -->
                    <view class="title" :style="titleStyle">{{ configNavBar_.title }}</view>
                    <!-- #endif -->

                    <!-- #ifndef MP -->
                    <view class="title">{{ configNavBar_.title }}</view>
                    <!-- #endif -->
                    <view style="flex:1;"></view>

                  </view>
                </template>
                <template v-else>
                  <view style="display:flex;justify-content:center;width: 100%;">
                    <view style="height: 100%;width: calc(100% - 1em);display:flex;justify-content: center;">
                      <slot name="title-center"></slot>
                    </view>
                  </view>
                </template>
              </view>
            </slot>
          </view>

          <view class="ylx-navbar-container__right">
            <slot name="right"></slot>
          </view>
        </view>
      </view>
      <view :style="{width: rightWidth}"></view>
      <view v-if="overlay" class="overlay"></view>
    </view>
    <view v-if="!hiddenNavbar" :style="{width: '100%',height:navbarHeight + 'px'}"></view>

  </view>
</template>
<script>
import pagesConfig from "@/pages.json";

import {ylxFilterPath, ylxNavigateTo, ylxStyleObjectToString} from "@/utils/uniTools";
import {localStringStyle} from "@/components/ylx-components/ylx-JS/template";


const {tabBar: {list: tabBarPages = []} = { list: [] }} = pagesConfig || {};


let menuButtonInfoALI = null, systemInfo = null, pages = null;

export default {

  name: 'ylx-navbar',
  props: {
    configNavBar: {
      type: Object,
      default: () => {
        return {}
      }
    },
    navbarStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bgColor: {
      type: String,
      default: 'rgba(255,255,255,0)'
    },
    title: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#303030'
    },
    size: {
      type: String,
      default: '16px'
    },
    justifyContent: {
      type: String,
      default: 'center'
    },

    iconSize: {
      type: [String, Number],
      default: '18px'
    },
    customLeftIconStyle: {
      type: [Object, String],
      default: () => {
      }
    },

    // 直接下显示首页的icon
    showHomeIcon: Boolean,
    hiddenBorder: Boolean,
    // 隐藏占位
    hiddenNavbar: Boolean,
    // 遮罩
    overlay: Boolean

  },
  data() {
    return {
      menuButtonWidth: 15,
      menuButtonTop: 34, //内容高度
      bottomGap: 10,//标题到底部之间的距离
      menuButtonHeight: 0,

      statusBarHeight: 0,
      pageHierarchy: 1,
      currentPagePath: '',
      viewOpacity: 0,
      liuHaiHeight: 0,// 顶部刘海高度

      titleOffset: 68, // 初始偏移量
    }
  },


  computed: {
    rightWidth() {
      return (!this.configNavBar_.hiddenLeftIcon && !this.configNavBar_.isTabBarPage) ? (this.menuButtonWidth + 15) + 'px' : this.menuButtonWidth + 'px'
    },
    defaultLeftIconName() {
      if (!this.showHomeIcon && this.pageHierarchy > 1) {
        return 'icon-arrow-left-bold'
      } else if (this.showHomeIcon || this.pageHierarchy === 1) {
        return 'icon-home'
      }
    },

    //navbar总高 44
    navbarHeight() {
      // 10 标题到底部之间的距离
      let navbarH = this.bottomGap + this.menuButtonTop + this.statusBarHeight + this.menuButtonHeight + this.liuHaiHeight
      this.$emit('navbarHeight', navbarH)
      this.viewOpacity = 1
      return navbarH
    },

    configNavBar_() {

      const isTabBarPage = tabBarPages.map(item => ylxFilterPath(item.pagePath)).includes(ylxFilterPath(this.currentPagePath));

      return Object.assign({
        title: this.title,//标题名称
        isTabBarPage: isTabBarPage,
        right: false,
        hiddenLeftIcon: false,
        hiddenBorder: this.hiddenBorder,
      }, this.configNavBar);
    },


    defaultContentTop() {
      let top = `${this.statusBarHeight}px`
      // #ifdef MP-WEIXIN || MP-ALIPAY
      top = `${this.liuHaiHeight + this.menuButtonTop + (this.menuButtonHeight / 2)}px`
      // #endif

      // #ifdef APP-PLUS
      top = `calc(${50}% + ${this.statusBarHeight / 2}px)`
      // #endif

      // #ifdef H5
      top = `${50}%`
      // #endif
      return top
    },

    ylxNavbarContainerStyle() {
      return ylxStyleObjectToString({
        position: 'absolute',
        top: this.defaultContentTop,
        transform: 'translateY(-50%)',
      })
    },


    navbarStyle_() {
      return ylxStyleObjectToString({
        backgroundColor: this.bgColor,
        height: `${this.navbarHeight}px`,
        borderBottom: !this.configNavBar_.hiddenBorder ? '1px solid #f3f3f3' : 'none',
        ...this.navbarStyle
      })
    },
    titleStyle_() {
      return ylxStyleObjectToString({
        'color': this.color,
        'fontSize': this.size,
      })
    },


    iconColor() {
      return this.calculateIconColor(this.navbarStyle)
    },

    resultCustomLeftIconStyle() {
      return ylxStyleObjectToString({
        color: this.iconColor,
        fontSize: this.iconSize,
        boxSizing: 'border-box',
      }) + localStringStyle(this.customLeftIconStyle)
    },
    titleStyle() {
      // 根据标题长度计算偏移量
      const offset = Math.max(0, this.titleOffset - this.title.length * 6); // 假设每个字符减少6px偏移
      return {
        marginLeft: `${offset}px`,
        transition: 'margin-left 0.3s', // 添加过渡效果
      };
    }

  },
  beforeCreate() {
    pages = getCurrentPages();

    // #ifdef MP-WEIXIN || MP-ALIPAY
    menuButtonInfoALI = uni.getMenuButtonBoundingClientRect();
    // #endif

    // #ifdef APP-PLUS
    systemInfo = uni.getSystemInfoSync();
    // #endif

  },
  mounted() {
    this.currentPagePath = pages[pages.length - 1]['route'];
    this.pageHierarchy = pages.length;
    // #ifdef MP-WEIXIN || MP-ALIPAY
    this.menuButtonTop = Math.ceil(menuButtonInfoALI.top);
    this.menuButtonHeight = Math.ceil(menuButtonInfoALI.height);
    const that = this
    uni.getSystemInfo({
      success(os) {
        that.menuButtonWidth = Math.ceil(os.screenWidth - menuButtonInfoALI.left + 34);
      }
    })

    // #endif

    // #ifdef APP-PLUS
    this.statusBarHeight = systemInfo.statusBarHeight;
    // #endif

    // #ifdef WEB
    this.statusBarHeight = 10
    // #endif

  },


  methods: {
    calculateIconColor(navbarStyle) {
      const cssKeyValuePairs = [
        {key: 'background', keyword: /linear-gradient|url/},
        {key: 'backgroundImage', keyword: /linear-gradient|url/},
      ];

      for (const {key, keyword} of cssKeyValuePairs) {
        if (key in navbarStyle) {
          const cssValue = navbarStyle[key];
          if (keyword.test(cssValue)) {
            return '#fff';
          }
        }
      }

      return '#3a3a3a';
    },

    leftIconClick() {
      try {
        if (this.pageHierarchy > 1) {
          uni.navigateBack({delta: 1});
        } else {
          // 首页
          const indexPagePath = pagesConfig.tabBar.list[0].pagePath
          ylxNavigateTo(indexPagePath);
        }
      } catch (error) {
        console.error('Error while handling leftIconClick:', error);
      }
    },
  },
}

</script>

<style scoped lang="scss">
@import "ylx-static/iconfont.css";

.ylx-navbar {
  box-sizing: border-box;
}

.ylx-navbar-wrap {
  position: fixed;
  top: var(--window-top);
  left: 0;
  right: 0;
  box-sizing: border-box;
  z-index: 9999;
  display: flex;
  align-items: center;
}


.navbar-content__container {
  position: relative;
  width: 100%;
  height: 100%;
  /* 两端距离 */
  margin-left: 30rpx;
  z-index: 10;
}


.ylx-navbar-container {
  box-sizing: border-box;
  word-break: break-all;
  display: flex;
  align-items: center;
  left: 0;
  right: 0;
}

.navbar-container__left:not(:empty) {
  min-width: 1em;
  box-sizing: border-box;
  position: relative;
  margin-right: 2px;
}


.ylx-navbar-container__center {
  flex: 1;
  display: flex;
  justify-content: center;
}


.ylx-navbar-container__right {
  display: flex;
  justify-content: flex-end;
}

.ylx-navbar-content-title {
  display: flex;
  align-items: center;
  flex: 1;


}

.title {

  overflow: hidden;
  word-break: break-all;
  /* break-all(允许在单词内换行。) */
  text-overflow: ellipsis;
  /* 超出部分省略号 */
  display: -webkit-box;
  /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical;
  /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 1;
  /** 显示的行数 **/

}

/*---------------------------------*/
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f3f3f3c4; /*  黑色半透明，透明度0.5  */
}
</style>
