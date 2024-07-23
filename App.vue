<script>
	import instanceEventBus from "@/utils/common/eventBus/instance";
  import {wxLogin} from "@/network/apis/meiFa";
  import store from "@/store";

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
      getWxLoginInfo()
      instanceEventBus.registerGlobalEvent(({args, source})=>{
        console.log('App Launch',...args, source)
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

@import "static/css/ylx-tailwindcss.css";
@import "static/css/common.css";
@import "static/css/mf.css";

</style>
