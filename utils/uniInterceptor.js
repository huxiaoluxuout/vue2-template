// 拦截 navigateTo 方法，修改目标页面路径为子包路径
export function interceptorSubPages() {
    uni.addInterceptor('navigateTo', {
        // 在实际调用 navigateTo 之前执行
        invoke(args) {
            // 解析 URL 为路径和查询字符串
            let {path, query} = splitUrl(args.url);
            // 定义页面路径映射
            let pagesMap = {
                '/pages/group-buying/group-buying': '/subPackagesPages/groupBuyingList/groupBuyingList',
                '/pages/luck-draw/recharge-partner/recharge_partner': '/subPackagesPages/rechargePartner/rechargePartner',
            }
            if (pagesMap[path]) {
                args.url = pagesMap[path] + query;
            }
        },
        fail(err) {
            // 处理调用失败的情况
            console.error(err);
        },
    })
}

/**
 * 从 URL 中分割出路径和查询字符串
 * @param  {String} url 完整的 URL
 * @return {Object}     包含路径和查询字符串的对象
 */
function splitUrl(url) {
    // 以问号 (?) 分割 URL，获取路径和查询字符串
    let parts = url.split('?');
    let path = parts[0];
    let query = parts[1];
    return {
        path,
        query: query ? '?' + query : ''
    }
}



