<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path">
      <el-tag :closable="true" :type="isActive(tag.path)?'primary':''" @close='closeViewTabs(tag,$event)'>
        {{tag.name}}
      </el-tag>
    </router-link>
  </div>
</template>

<script>
  export default {
    computed: {
      visitedViews() {
        // console.log(item)
        return this.$store.state.app.visitedViews.slice(-6)
      }
    },
    created(){
      this.addViewTabs()
    },
    methods: {
      closeViewTabs(view, $event) {
        this.$store.dispatch('delVisitedViews', view)
        $event.preventDefault()
      },
      generateRoute() {
        if (this.$route.matched[this.$route.matched.length - 1].name) {
          return this.$route.matched[this.$route.matched.length - 1]
        }
        this.$route.matched[0].path = '/'
        return this.$route.matched[0]
      },
      addViewTabs() {
        // var arr = [];
        this.$store.dispatch('addVisitedViews', this.generateRoute());
        // if(this.$loca.getItem('addVisitedViews')){
        //   arr = this.$loca.getItem('addVisitedViews');
        // }
        // // arr.push({ name: this.$route.name, path: this.$route.path })
        // this.$loca.setItem('addVisitedViews',arr);
        // this.$store.commit('ADD_VISITED_VIEWS', this.$loca.getItem('addVisitedViews'));
      },
      isActive(path) {
        return path === this.$route.path
      }
    },
    watch: {
      $route() {
        this.addViewTabs()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    .tabs-view {
      margin-left: 10px;
    }
  }
</style>
