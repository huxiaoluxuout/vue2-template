import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import cart from "@/store/modules/cart";
import user from "@/store/modules/user";

const store = new Vuex.Store({
    modules: {
        user,
        cart
    }

})

export default store
