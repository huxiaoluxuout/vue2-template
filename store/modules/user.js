const userInfo = {
    "id": '',
    "nickname": "未登录",
    "mobile": "******",
    "avatar": "/static/muo_ren_tou_xiang.png",
    "gender": 2,
    "birthday": "1997-03-08",
    "money": "0.00",
    "score": 0,
    "hair_length": 0,
    "coupon_num": 0,
    "face": 0,
    "work": 0,
    "edu": 0,
    "switch": 0,
    "vip_time": 0,
    "is_del": 0,
    "vip_id": 0,
    "token": "",
    "user_id": 5,
    "createtime": 1719890457,
    "expiretime": 1722482457,
    "expires_in": 2591999,
    "balance": 0,
    "is_vip": false
}
export default {
    state: {
        isLoggedIn: false,
        userInfo: {
            "id": '',
            "nickname": "未登录",
            "mobile": "******",
            "avatar": "/static/muo_ren_tou_xiang.png",
            "gender": 2,
            "birthday": "1997-03-08",
            "money": "0.00",
            "score": 0,
            "hair_length": 0,
            "coupon_num": 0,
            "face": 0,
            "work": 0,
            "edu": 0,
            "switch": 0,
            "vip_time": 0,
            "is_del": 0,
            "vip_id": 0,
            "token": "",
            "user_id": 5,
            "createtime": 1719890457,
            "expiretime": 1722482457,
            "expires_in": 2591999,
            "balance": 0,
            "is_vip": false
        }

    },
    // computed 使用
    getters: {
        hasLogged: state => {
            return state.isLoggedIn
        },
    },
    // 同步方法
    // 使用时通过commit调用
    // methods 使用
    mutations: {
        setIsLoggedIn(state,type) {
            state.isLoggedIn = type;
            console.log(state.isLoggedIn);
        },
        login(state, userInfo) {
            this.commit('setUserInfo', userInfo)
            state.isLoggedIn = true;
            console.log('login登录', state.isLoggedIn);
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            uni.setStorage({
                key: 'userInfo',
                data: userInfo,
                success: function () {
                }
            })
        },
        update(state, key, value) {
            state.userInfo[key] = value;
        },
        logout(state) {
            this.commit('setUserInfo', userInfo)
            state.isLoggedIn = false;
            console.log('login登录', state.isLoggedIn);
        },
    },
    // 异步方法
    // dispatch
    // methods 使用

    actions: {

        asyncLogin(context, userInfo) {
            context.commit('login', userInfo)
        },

        asyncUpdate(context, userInfo) {
            context.commit('update', userInfo)
        },
        asyncLogout(context, userInfo) {
            context.commit('logout', userInfo)
        },
        asyncSetIsLoggedIn(context, type) {
            context.commit('setIsLoggedIn', type)
        },
    }
}
