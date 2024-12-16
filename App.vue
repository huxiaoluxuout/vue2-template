<script>
  // import store from "@/store";

  import {ylxEventBus} from "@/ylxuniCore/useylxuni";
  export default {
		onLaunch: function() {
			console.log('App Launch')
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
