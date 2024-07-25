<script>
	import instanceEventBus from "@/utils/instanceEventBus";
  import {wxLogin} from "@/network/apis/meiFa";
  import store from "@/store";
  import {ylxOpenWxDebug} from "@/utils/uniTools";

  function getWxLoginInfo() {
    wxLogin().then((loginRes) => {
      console.log(loginRes.data);
      store.dispatch('asyncLogin',{age: 18,name:'测试'})

      if (!loginRes.data.is_register) {

      } else {
        // store.dispatch('login',loginRes.data)

      }

    })
  }
  export default {
		onLaunch: function() {
			console.log('App Launch')
      ylxOpenWxDebug()

      getWxLoginInfo()
      instanceEventBus.registerGlobalEvent(({args, source}) => {
        console.log('App Launch', ...args, source)
        getWxLoginInfo()

      })

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
/* #ifndef APP-PLUS-NVUE */
@import "static/css/ylx-tailwindcss.css";
@import "static/css/common.css";
@import "static/css/mf.css";
/* #endif */


</style>
