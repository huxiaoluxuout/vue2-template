import {throttle} from "@/utils/throttle";
import useDoQueue from "@/utils/common/useDoQueue";


export default function mixinReachBottomPullDownRefreshVue2() {
    const {setFunction, addFunctions, invokeAllFn} = useDoQueue()

    const mixinReachBottomPullDownRefresh = {
        data() {
            return {
                // 当前页码
                page: 1,
                // 每页数量
                pageSize: 10,
                isReload: false
            }
        },
        methods: {
            // 重新加载
            reload() {
                this.page = 1
                this.pageSize = 10
                invokeAllFn();
            },

            dataHandler({data = [], newData = []}, reloadNextPage = false) {
                uni.stopPullDownRefresh();
                if (reloadNextPage) {
                    this.page++; // 页码加1
                }

                if (!this.isReload) {
                    this.isReload = false;
                    return Array.isArray(data) && Array.isArray(newData)
                        ? data.concat(newData)
                        : newData;
                } else {
                    this.isReload = false;
                    return newData;
                }
            },
            // 触底加载下一页数据
            reachBottomHandler() {
                console.log('触底加载下一页数据')
                if (this.isReload) {
                    throttle(() => {
                        invokeAllFn();
                    })
                }
            },

            // 下拉刷新
            pullDownRefreshHandler() {
                console.log('下拉刷新')
                this.reload()
                setTimeout(() => {
                    uni.stopPullDownRefresh();
                }, 2500)
            }
        },
        onReachBottom() {
            this.reachBottomHandler()
        },
        onPullDownRefresh() {
            this.pullDownRefreshHandler()
        },
    }


    return {
        mixinReachBottomPullDownRefresh,
        setFunction,
        addFunctions,
        invokeAllFn
    }
}
