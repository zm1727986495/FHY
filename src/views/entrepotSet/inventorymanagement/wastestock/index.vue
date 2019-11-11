<template>
  <div>
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <div>
        <wastequery></wastequery>
      </div>
      <div class="h-width"></div>
      <div>
        <wastelist></wastelist>
      </div>
    </el-card>
  </div>
</template>
<script>
import breadcrumb from "../../../components/breadcrumb";
import wastequery from "./components/wastequery";
import wastelist from "./components/wastelist";
export default {
  components: {
    breadcrumb,
    wastequery,
    wastelist
  },
  data() {
    return {
      navList: []
    };
  },
  mounted() {
    this.navList = this.$route.meta;
  }
};
</script>
<style lang="scss" scoped>
</style>

