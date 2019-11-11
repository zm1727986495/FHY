<template>
  <div class="saletaskList">
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
      <repaircom0 v-if="listindex == 0"></repaircom0>
      <repaircom1 v-if="listindex == 1"></repaircom1>
      <repaircom2 v-if="listindex == 2"></repaircom2>
      <repaircom3 v-if="listindex == 3"></repaircom3>
      <repaircom4 v-if="listindex == 4"></repaircom4>
      <repaircom5 v-if="listindex == 5"></repaircom5>
      <repaircom6 v-if="listindex == 6"></repaircom6>
      <repaircom7 v-if="listindex == 7"></repaircom7>
      <repaircom8 v-if="listindex == 8"></repaircom8>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import repaircom0 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom0";
import repaircom1 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom1";
import repaircom2 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom2";
import repaircom3 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom3";
import repaircom4 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom4";
import repaircom5 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom5";
import repaircom6 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom6";
import repaircom7 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom7";
import repaircom8 from "@/views/entrepotSet/aftermarket/repaircenter/components/repaircom8";

export default {
  components: {
    breadcrumb,
    pagination,
    repaircom0,
    repaircom1,
    repaircom2,
    repaircom3,
    repaircom4,
    repaircom5,
    repaircom6,
    repaircom7,
    repaircom8,
  },
  // name: 'brandmanagement',
  data() {
    return {
      routedata: this.$route.path == '/ordermm/details',
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      navList: [], //头部面包屑

      listindex: 0, //选中下标
      elsectVal: [], //选中框
      tabList: [], //table数据
      actionBtnList: [
        "维修任务列表",
        "维修预约日志",
        "维修工作汇报日志",
        "维修改制日志",
        "维修赔偿日志",
        "定责申请日志",
        "退货退款信息日志",
        "返厂信息日志",
        "问题日志",
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
        // this.$message.success("维修任务列表");
      } else if (index == 1) {
        // this.$message.success("维修预约日志");
      } else if (index == 2) {
        // this.$message.success("维修工汇报日志");
      } else if (index == 3) {
        // this.$message.success("维修改制日志");
      } else if (index == 4) {
        // this.$message.success("维修赔偿日志");
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

