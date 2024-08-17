/**
 * 创建一个代理对象,用于监控对目标对象属性的修改。
 *
 * @param {Object} target - 要代理的目标对象
 * @returns {Object} 返回一个代理对象,该对象会在属性被修改时输出日志
 * @throws {TypeError} 如果传入的参数不是对象,则抛出类型错误
 */
export default function createProxy(target) {
    // 检查参数是否为对象
    if (typeof target !== 'object' || target === null) {
        throw new TypeError('Target must be an object');
    }

    // 2. 定义 Proxy 处理器
    const handler = {
        get(target, property, receiver) {
            // console.log(`正在访问属性: ${property}`);
            return Reflect.get(target, property, receiver);
        },

        set(target, property, value, receiver) {
            // console.log(`正在设置属性: ${property} = ${value}`);
            return Reflect.set(target, property, value, receiver);
        },
    };

    return new Proxy(target, handler);

}
