import App from './App'
import {useEventBus} from "@/utils/common/eventBus/UseEventBus";
import ylxGap from '@/components/ylx-components/ylx-gap.vue';
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

import store from './store'

Vue.prototype.$store = store

Vue.config.productionTip = false
App.mpType = 'app'


/*Vue.use({
    install(Vue, options) {
        // 添加全局方法
        Vue.prototype.$instanceEventBus = new useEventBus()
    }
})*/
// 注册组件，传入一个扩展过的构造器
Vue.component(ylxGap)

Vue.prototype.$instanceEventBus = new useEventBus()

const app = new Vue({
    store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}

// #endif
