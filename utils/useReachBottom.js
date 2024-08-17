import {dataTypeJudge} from "@/utils/tools.js";
import useDoQueue from "@/utils/common/useDoQueue";
import createProxy from "@/utils/common/createProxy";

/**
 *
 * @param pageNum 当前页码
 * @param pageSizeNum 分页大小
 * @returns {{dataHandler: ((function({data?: [], resData?: []}, boolean=): (*[]))|*), reload: reloadHandler, invokeAllFn: *, pageInfoProxy: *, reachBottomHandler: reachBottomHandler, mixinReachBottomPullDownRefresh: {onReachBottom(): void, onLoad(): void, onPullDownRefresh(): void}, setFunction: *, addFunctions: *}}
 */
export default function useReachBottom(pageNum = 1, pageSizeNum = 10) {

    let page = pageNum
    let pageSize = pageSizeNum

    let isNoData = false

    let isByReload = false


    const {setFunction, addFunctions, invokeAllFn} = useDoQueue()
    const pageInfo = {
        page: page,
        pageSize: pageSize,
    };
    const pageInfoProxy = createProxy(pageInfo)


    function resetPageInfo() {
        pageInfoProxy.page = page
        pageInfoProxy.pageSize = pageSize
    }

    resetPageInfo()


    // 重新加载
    function reloadHandler() {
        isByReload = true
        isNoData = false
        resetPageInfo()
        invokeAllFn();
    }

    // 触底加载下一页数据
    function reachBottomHandler() {
        if (pageInfoProxy.page > 1 && !isNoData) {
            invokeAllFn();
        }
    }

    let timeId = 0

    // 下拉刷新
    function pullDownRefreshHandler() {
        reloadHandler()
        timeId = setTimeout(() => {
            uni.stopPullDownRefresh();
        }, 2500)
    }


    function resDataHandler({data = [], resData = []}, isNextPage = false) {
        uni.stopPullDownRefresh();
        clearTimeout(timeId)

        if (dataTypeJudge(data, 'array')) {
            if (!dataTypeJudge(resData, 'array')) {
                console.warn('没有数据要返回空数组！！！')
                resData = []
            }
            // 修复重新加载时，之前的数据没有清除的bug
            if (isByReload) {
                data = []
                isNextPage = true
                isByReload = false
            }


            if (isNextPage) {
                pageInfoProxy.page += 1;
                return data.concat(resData);
            } else {
                // 只有一页数据
                if (pageInfoProxy.page === 1) {
                    return resData
                } else {
                    // 这是最后的一页了1
                    if (!isNoData) {
                        // console.log('这是最后的一页了----1')
                        isNoData = true
                        return data.concat(resData);
                    } else {
                        // console.log('这是最后的一页了----2')
                        return data
                    }
                }

            }
        } else {
            return resData
        }
    }

    // #ifndef VUE3
    const mixinReachBottomPullDownRefresh = {
        onLoad() {
            resetPageInfo()
        },
        onReachBottom() {
            reachBottomHandler()
        },
        onPullDownRefresh() {
            pullDownRefreshHandler()
        },
    }
    // #endif

    return {
        // #ifndef VUE3
        mixinReachBottomPullDownRefresh,
        // #endif
        // #ifdef VUE3
        reachBottomHandler,
        // #endif
        pageInfoProxy,
        setFunction,
        addFunctions,
        invokeAllFn,
        reload: reloadHandler,
        dataHandler: resDataHandler,

    }
}
