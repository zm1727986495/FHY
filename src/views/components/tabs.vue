<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path">
      <el-tag :class="{'tagFont' : tag.path == $route.path}" :closable="true" :type="isActive(tag.path)?'primary':''" @close='closeViewTabs(tag,$event)'>
        {{tag.name}}
      </el-tag>
    </router-link>
  </div>
</template>

<script>
  export default {
    data(){
        return {
        }
    },
    computed: {
      visitedViews() {
        console.log(this.$store.state.app.visitedViews, this.$route);
        return this.$store.state.app.visitedViews.slice(-6)
      }
    },
    created(){
      this.addViewTabs()
    },
    methods: {
     handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
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
    width:100%;
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    .tabs-view {
    //   margin-left: 10px;
    }
    .tagFont{
        color:#ffffff;
        background-color:#409EFF;
    }
  }
</style>
