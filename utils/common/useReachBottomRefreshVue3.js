import {ref} from "vue";
import {throttle} from "@/utils/throttle";
import useDoQueue from "@/utils/common/useDoQueue";

export default function useReachBottomRefresh() {
    const {setFunction, addFunctions, invokeAllFn} = useDoQueue()
    // 当前页码
    const page = ref(1)
    // 每页数量
    const pageSize = ref(10)
    let reloadNextPageStatus = true

    const isReload = ref(false)

    // 重新加载
    const reload = () => {
        page.value = 1
        isReload.value = true
        pageSize.value = 10
        invokeAllFn();
    }
    const setPageNum = (pageNum = 1) => {
        page.value = pageNum
    }

    const dataHandler = ({data = [], newData = []}, reloadNextPage = false) => {
        uni.stopPullDownRefresh();

        if (reloadNextPage) {
            page.value++; // 页码加1
        }

        if (!isReload.value) {
            isReload.value = false;
            return Array.isArray(data) && Array.isArray(newData)
                ? data.concat(newData)
                : newData;
        } else {
            isReload.value = false;
            return newData;
        }
    }


    // 触底加载下一页数据
    const reachBottomHandler = () => {
        if (reloadNextPageStatus) {
            throttle(() => {
                invokeAllFn();
            })
        }
    }

    // 下拉刷新
    const pullDownRefreshHandler = () => {
        reload()
        setTimeout(() => {
            uni.stopPullDownRefresh();
        }, 2500)
    }

    return {
        page: page,
        pageSize: pageSize.value,
        isReload: isReload,
        reachBottomHandler,
        pullDownRefreshHandler,
        reload,
        setFunction,
        addFunctions,
        invokeAllFn,
        setPageNum,
        dataHandler,
    };
}
