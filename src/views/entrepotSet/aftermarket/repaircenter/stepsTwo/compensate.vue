<template>
  <div class="compensate">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
      ..compensate
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import spot from "@/assets/images/spot.png";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑

      elsectVal: [], //选中框
      tabList: [], //table数据
    
    };
  },
  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  // deactivated () {
  //     this.$destroy(true)
  // },

  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  // },
  methods: {
    //查询按钮获取
    getListFun(form) {
      console.log(form);
    },
    

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.compensate{
  
}
</style>

