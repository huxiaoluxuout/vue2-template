export default {
    state: {
        list: [
            {
                id: 1,
                name: "商品1",
                status: false,
                number: 12
            }, {
                id: 2,
                name: "商品2",
                status: true,
                number: 10
            }, {
                id: 3,
                name: "商品3",
                status: false,
                number: 12
            }, {
                id: 4,
                name: "商品4",
                status: true,
                number: 13
            }, {
                id: 5,
                name: "商品5",
                status: true,
                number: 102
            }, {
                id: 6,
                name: "商品6",
                status: true,
                number: 200
            },
        ],
        number: 0,

    },
    // computed 使用
    getters: {
        activeList({list}) {
            return list.filter(item => item.status)
        },
        unActiveList({list}) {
            return list.filter(item => !item.status)
        },
        getList(state, getters) {
            return getters.activeList.filter(v => v.number > 20)
        },
        // 传参 id
        getValueById: (state) => (id) => {
            console.log('getValueById', id)
            return state.list.filter(v => v.id === id)
        },
    },
    // 同步方法
    // 使用时通过commit调用
    // methods 使用
    mutations: {
        // 传参 n

        inc(state, n) {
            state.number += n
            console.log(state.number)

        },
        inA(state, n) {
            state.number -= n
            console.log(state.number)

        },
        inB(state, n) {
            state.number -= n*2
            console.log(state.number)

        },
    },
    // 异步方法
    // dispatch
    // methods 使用

    actions: {
        asyncInc(context,n) {
            context.commit('inc', n)
        },
    }
}
