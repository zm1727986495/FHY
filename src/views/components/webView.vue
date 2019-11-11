<template>
	<div class="app-box">
		<heads class="headbox" @clicktab="clicktab"></heads>
		<div class="app-wrapper" :class="{hideSidebar:!heavbar.opened}" style="width: 100vw">
			<div class="asideNavclas">
				<asides :navlistdata="navlistdata"></asides>
			</div>
			<div class="main-container">
				<mains></mains>
			</div>
		</div>
	</div>
</template>
 
<script>
import asides from 'views/components/asideNav';
import heads from 'views/components/headNav';//头部
import mains from 'views/components/appMain';
import { menusFrontSon } from '@/api/login';
import { getToken} from 'utils/auth';

export default {
	name: 'webView',
	data() {
		return {
			navlistdata: []
		}
	},
    components: {
		asides,
		heads,
		mains
    },
    computed: {
		heavbar() {
			return this.$store.state.app.heavbar;
		}
	},
	methods: {
		logfun(data){
			menusFrontSon({token:getToken(),id:data}).then(res => {
				this.navlistdata = res
			})
		},
		clicktab(val){
			this.logfun(val)
		}
	},
}
</script>

<style rel="stylesheet/scss" lang="scss">
	@import "src/styles/mixin.scss";
	.app-box{
		display: flex;
		flex-direction: column;
		min-height: 100%;
		.headbox{
			max-height: 70px;
		}
	}
	.app-wrapper {
		flex: 1;
		height: 100%;
		width: 100vw;
		display: flex;
		// &.hideSidebar {
		// 	.sidebar-container{
		// 		width:36px;
		// 	}
		// }
		.sidebar-container {
			transition: width 0.28s;
			width: 210px;
			height: 100%;
			z-index: 1001;
			// overflow-y: auto;
 			// &::-webkit-scrollbar {display:none}
		}
		&.hideSidebar {
			.asideNavclas{
				min-width: 64px;
				transition: all 0.28s;
			}
		}
		.asideNavclas{
			overflow-y: auto;
			&::-webkit-scrollbar{
				width: 0px;
				background: none;
			}
			min-width: 210px;
			min-height: 100%;
			z-index: 1001;
			transition: all 0.28s;
			.asideStyle{
				min-height: 100%;
			}
		}
		.main-container {
			overflow-y: auto;
			// height: 100%;
			width: calc((100vw - 210px));
			min-height: 100%;
			transition: margin-left 0.28s;
			flex: 1;
			.app-main{
				height: 100%;
			}
		}
		&.hideSidebar{
			.main-container{
				width: calc((100vw - 64px));
			}
		}
	} 
</style>
