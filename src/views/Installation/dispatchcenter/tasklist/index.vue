<template>
  <div class="saletaskList">
    <!-- btn_list_details -->
    <ul :class="[routedata ? 'btn_list_details' : 'ul_btn_list']">
      <li
        :class="{'chanclas': listindex === index}"
        v-for="(item,index) in actionBtnList"
        :key="index"
        @click="butGroupActions(index)"
      >{{item}}</li>
      <div class="clearfix"></div>
    </ul>
    <div>
      <install1 v-if="listindex == 0"></install1>
      <install2 v-if="listindex == 1"></install2>
      <install3 v-if="listindex == 2"></install3>
      <install4 v-if="listindex == 3"></install4>
      <install5 v-if="listindex == 4"></install5>
      <install6 v-if="listindex == 5"></install6>
      <install7 v-if="listindex == 6"></install7>
      <install8 v-if="listindex == 7"></install8>
      <install9 v-if="listindex == 8"></install9>
      <install10 v-if="listindex == 9"></install10>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import install1 from "@/views/Installation/dispatchcenter/tasklist/install1"; //安装任务列表
import install2 from "@/views/Installation/dispatchcenter/tasklist/install2"; //安装预约日志
import install3 from "@/views/Installation/dispatchcenter/tasklist/install3"; //安装工汇报日志
import install4 from "@/views/Installation/dispatchcenter/tasklist/install4"; //安装改制日志
import install5 from "@/views/Installation/dispatchcenter/tasklist/install5"; //安装赔偿日志
import install6 from "@/views/Installation/dispatchcenter/tasklist/install6"; //定责申请日志
import install7 from "@/views/Installation/dispatchcenter/tasklist/install7"; //退货退款信息日志
import install8 from "@/views/Installation/dispatchcenter/tasklist/install8"; //返厂信息
import install9 from "@/views/Installation/dispatchcenter/tasklist/install9"; //库房出库日志
import install10 from "@/views/Installation/dispatchcenter/tasklist/install10"; //问题日志

export default {
  components: {
    breadcrumb,
    pagination,
    install1,
    install2,
    install3,
    install4,
    install5,
    install6,
    install7,
    install8,
    install9,
    install10
  },
  // name: 'brandmanagement',
  data() {
    return {
      routedata: this.$route.path == "/ordermm/details",
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      navList: [], //头部面包屑
      installationOrderId: "", //安装ID
      listindex: 0, //选中下标
      elsectVal: [], //选中框
      tabList: [], //table数据
      actionBtnList: [
        "安装任务列表",
        "安装预约日志",
        "安装工汇报日志",
        "安装改制日志",
        "安装赔偿日志",
        "定责申请日志",
        "退货退款信息日志",
        "返厂信息",
        "库房出库日志",
        "问题日志"
      ]
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    butGroupActions(index) {
      this.listindex = index;
      if (index == 0) {
        // this.$message.success("安装任务列表");
      } else if (index == 1) {
        // this.$message.success("安装预约日志");
      } else if (index == 2) {
        // this.$message.success("安装工汇报日志");
      } else if (index == 3) {
        // this.$message.success("安装改制日志");
      } else if (index == 4) {
        // this.$message.success("安装赔偿日志");
      } else if (index == 5) {
        // this.$message.success("定责申请日志");
      } else if (index == 6) {
        // this.$message.success("退货退款信息日志");
      } else {
        // this.$message.success("返厂信息");
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.saletaskList {
}
</style>

