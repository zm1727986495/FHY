<template>
	<div class='menu-wrapper'>
	
	<template v-for="item in routes">
		<el-submenu :index="item.title" :key="item.name">
			<template slot="title">
				<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>
				<span>{{item.title}}</span>
			</template>
			<template v-for="child in item.children">
				<sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]' :key="child.name"> </sidebar-item>
				<a target="_blank"  v-if="child.href!=null&&child.href.indexOf('http')==0" :href="child.href" :key="child.name">
					<el-menu-item :index="'/'+item.code+'/'+child.code">
						<icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
						<span>{{child.title}}</span>
					</el-menu-item>
				</a>
				<router-link v-if="child.href!=null&&child.href.indexOf('http')!=0&&child.type!='dirt'"  :to="'/'+item.code+'/'+child.code" :key="child.name">
					<el-menu-item :index="'/'+item.code+'/'+child.code">
						<icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
						<span>{{child.title}}</span>
					</el-menu-item>
				</router-link>
			</template>
		</el-submenu>

	</template>

	</div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      }
    },
    data(){
      return {
        navList: [],
        item: 0

      }
    },
    methods:{
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content_warp {
  width: 100%;
}
.el-menu-vertical-demo {
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
}
.el-menu-item {
  color: #fff !important;
}
.el-submenu__title {
  color: #fff !important;
}
.el-submenu .el-submenu__title {
  cursor: pointer;
}
</style>
<style>
.el-menu--vertical .el-menu{
  padding:0!important;
  background: #444444!important;
}
.el-submenu .el-menu {
  background-color: #444444 !important;
}
.el-submenu .el-menu-item {
  height: 35px;
  line-height: 35px;
  padding: 0 0 0 45px;
  min-width: 200px;
}
.el-menu .is-active{
 background-color: #409EFF;
}
 .el-menu-item:focus, .el-menu-item:hover{
    background-color: #409EFF;
  }
  .el-submenu__title:hover {
    background-color: #409EFF;
}
.el-menu-item-group__title{
  display: none;
}
</style>

