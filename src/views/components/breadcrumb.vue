<template>
  <div class="breadcrumb_box">
    <span class="homeicon" @click="toggleHeavBar" :class="{'is-active':heavbar.opened}"></span> 
    <span class="breadcrumb-title">当前位置：</span> 
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.name }}</span>
          <a v-else >{{ item.name }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <!-- <tabs-view></tabs-view> -->
  </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapGetters } from 'vuex';
import TabsView from '@/views/components/tabs.vue';
export default {
  components: {
    TabsView,
  },
  data() {
    return {
      levelList: null
    }
  },
  props: {
      toggleClick: {
        type: Function,
        default: null
      }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    toggleHeavBar() {
      this.$store.dispatch('ToggleHeavBar')
    },
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item =>  item.name)
      const first = matched[0]
      if (!this.isDashboard(first)) {
        matched = [{ path: '/index', name: '梵华云'}].concat(matched)
      }

      this.levelList = matched.filter(item => item.name)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  },
  computed: { 
    ...mapGetters(['heavbar'])
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb_box{
  display: flex;
  align-items: center;
  width:100%;
}
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
.homeicon{
  background: url("../../assets/images/homepage.png");
  display: block;
  width: 17px;
  height: 17px;
  background-size: 100% 100%;
  margin-right: 10px;
  transform: rotate(0);
  transition: transform .38s;
}
.is-active{
  transform: rotate(90deg);
  transition: transform .38s;
}
</style>
