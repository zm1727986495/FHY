<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo asideStyle"
    text-color="#ffffff"
    active-text-color="#409EFF"
    @open="handleOpen"
    @close="handleClose"
    mode="vertical" 
    unique-opened 
    theme="dark" 
    :collapse="isCollapse"
  >
  <aside-item :routes='navlistdata' v-if="navlistdata.length > 0"></aside-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import asideItem from './asideItem';
export default {
  components: { asideItem },
  name: "asideNav",
  props: {
      navlistdata: {
        type: Array
      }
    },
  data() {
    return {
      title: "我是首页",
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(this.store.webMenus);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    jumpToPage(str) {
      this.$router.push(str);
    },
  },
  computed: {
    ...mapGetters([
      'heavbar',
      'webMenus'
    ]),
    isCollapse() {
      return !this.heavbar.opened
    },
  }
}
</script>

<style lang="scss" scoped>
.content_warp {
  width: 100%;
}
.el-menu-vertical-demo {
  border-right: 1px solid #FCFCFC;
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
  padding: 0 45px;
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

