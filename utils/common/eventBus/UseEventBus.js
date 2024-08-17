import {EventBusCore} from "./EventBusCore.js";

const instanceEventBus = new EventBusCore()

export class useEventBus {

    static env = 'uni'

    /**
     * @param {string} env - 环境变量 "uni" 或 "wx"
     */
    constructor(env = 'uni') {
        if (env.toLocaleLowerCase() === 'uni') {
            useEventBus.env = env
            console.log('uniapp框架开发')
        } else if (env.toLocaleLowerCase() === 'wx') {
            console.log('微信小程序原生开发')
            useEventBus.env = env
        } else {
            console.error(env, '-初始化传参错误-')
        }
    }

    // 定义导航类型常量
    static NAVIGATION_TYPES = {
        NAVIGATE_TO: 'navigateTo',
        SWITCH_TAB: 'switchTab'
    };
    static eventBusSet = new Set()


    // 构造函数，初始化默认的全局回调函数
    static defaultGlobalCallback = ({args, source}) => console.log('AppEvent', {args, source});

    /**
     * 注册全局事件监听器
     * @param {Function} globalCallback 全局回调函数
     */
    registerGlobalEvent(globalCallback = useEventBus.defaultGlobalCallback) {
        instanceEventBus.on('AppEvent', globalCallback);
        instanceEventBus.on('GLOBAL_PAGES_EVENT', useEventBus.handlerListener);
    }

    static handlerListener({args, source}) {
        let [{navigationType, targetPath, isNavigationEnabled, options, sourceName}] = args
        const {path, query, delimiter} = useEventBus.parseUrl(targetPath);
        useEventBus.sendTargetPage(path, source, options, sourceName)
        useEventBus.handleNavigation(navigationType, path, query, delimiter, options, isNavigationEnabled);
    }

    // 向目标页面发送数据
    static sendTargetPage(path, source, options, sourceName) {
        if (!useEventBus.eventBusSet.has(path)) {
            instanceEventBus.once('CURRENT_PAGE_EVENT' + path, () => {
                useEventBus.eventBusSet.add(path)
                return instanceEventBus.emit({event: path, source: sourceName || source}, options)
            });
        } else {
            instanceEventBus.emit({event: path, source: sourceName || source}, options);
        }
    }

    /**
     * 处理导航逻辑
     * @param {string} navigationType 导航类型
     * @param {string} path 目标路径
     * @param {string} query 查询参数
     * @param {string} delimiter 查询参数的分隔符
     * @param {Object} options 选项参数
     * @param {boolean} isNavigationEnabled 是否启用导航
     */
    static handleNavigation(navigationType, path, query, delimiter, options, isNavigationEnabled) {
        if (!isNavigationEnabled) return;
        if (navigationType !== useEventBus.NAVIGATION_TYPES.NAVIGATE_TO && navigationType !== useEventBus.NAVIGATION_TYPES.SWITCH_TAB) {
            console.error(`导航路径：${JSON.stringify(useEventBus.NAVIGATION_TYPES)}`);
            return;
        }

        const fullPath = navigationType === useEventBus.NAVIGATION_TYPES.NAVIGATE_TO ? `${path}${query}${delimiter}currentRoute=${path}` : path;

        if (useEventBus.env === 'uni') {
            uni[navigationType]({
                url: fullPath,
                fail: err => console.error('Navigation Error:', err),
            });
        } else if (useEventBus.env === 'wx') {
            wx[navigationType]({
                url: fullPath,
                fail: err => console.error('Navigation Error:', err),
            });
        }

    }

    /**
     * 发送页面事件，并根据需要进行导航
     * @param {Object} config 配置对象
     * @param {string} config.targetPath 目标路径
     * @param {Object} [config.options={}] 传递的数据
     * @param {string} [config.source=''] 自定义来源名称
     * @param {boolean} [isNavigationEnabled=false] 是否启用导航
     * @param {string} [navigationType=navigateTo] 导航类型
     */
    async emit({targetPath, options = {}, source = ''},
               isNavigationEnabled = false,
               navigationType = useEventBus.NAVIGATION_TYPES.NAVIGATE_TO) {

        const currentRoute = await useEventBus.getRoute();

        const mergedOptions = typeof options === 'object' ? Object.assign({fromPage: currentRoute}, options) : options;

        instanceEventBus.emit({event: 'GLOBAL_PAGES_EVENT', source: currentRoute, handler: 'handlerListener'}, {
            navigationType,
            targetPath,
            isNavigationEnabled,
            options: mergedOptions,
            sourceName: source
        });


    }

    /**
     * 发送全局事件
     * @param {Object} [options={}] 选项参数
     * @param {String} [source=''] 自定义来源名称
     */
    async sendGlobal(options = {}, source = '') {
        const currentRoute = await useEventBus.getRoute();
        const mergedOptions = typeof options === 'object' ? Object.assign({fromPage: currentRoute}, options) : options;
        instanceEventBus.emit({event: 'AppEvent', source: source || currentRoute}, mergedOptions);
    }

    /**
     * 获取当前页面路径
     * @return {Promise<string>} 返回当前页面路径的 Promise 对象
     */
    static getRoute() {
        const pages = getCurrentPages();
        const currentRoute = '/' + pages[pages.length - 1]['route'];
        return Promise.resolve(currentRoute);
    }

    /**
     * 注册页面通知回调
     * @param {Function} callback 回调函数
     */
    on(callback) {
        if (typeof callback !== 'function') return;
        useEventBus.getRoute()
            .then(currentRoute => {
                if (!useEventBus.eventBusSet.has(currentRoute)) {
                    useEventBus.eventBusSet.add(currentRoute)
                    // 注册事件
                    instanceEventBus.on(currentRoute, callback);
                    // 触发发送数据到目标页面
                    instanceEventBus.emit('CURRENT_PAGE_EVENT' + currentRoute);
                }
            })

    }

    /**
     * 解析 URL 路径
     * @param {string} pathUrl 路径 URL
     * @return {Object} 解析后的对象，包含路径、查询参数和分隔符
     */
    static parseUrl(pathUrl) {
        const url = pathUrl.startsWith('/') ? pathUrl : '/' + pathUrl;
        const [path, query] = url.split('?');
        return {
            path,
            query: query ? '?' + query : '',
            delimiter: query ? '&' : '?',
        };
    }
}
