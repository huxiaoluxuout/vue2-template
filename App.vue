<script>
	import instanceEventBus from "@/utils/instanceEventBus";
  import {wxLogin} from "@/network/apis/meiFa";
  import store from "@/store";
  import {ylxOpenWxDebug} from "@/utils/uniTools";
  import {ylxEventBus} from "@/ylxuniCore/useylxuni";

  function getWxLoginInfo() {

  }
  export default {
		onLaunch: function() {
			console.log('App Launch')
      // ylxOpenWxDebug()
      /*instanceEventBus.registerGlobalEvent(({args, source}) => {
        console.log('instanceEventBus',args[0],source)
      })*/

      ylxEventBus.onGlobal(({args, source})=>{
        console.log('ylxEventBus',args[0], source)
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
@import "static/css/projects.css";
/* #endif */


</style>
