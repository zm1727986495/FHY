


<template>
<!-- 任务列表页面 -->
  <div class="tasktabs">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <orderdetail></orderdetail>

    <el-tabs type="border-card" v-model="nums">
      <el-tab-pane label="售后信息" name="0">
        <saletaskList></saletaskList>
      </el-tab-pane>
      <el-tab-pane label="安装信息" name="1">
        <installList></installList>
      </el-tab-pane>
      <el-tab-pane label="赔偿信息" name="2">
        <compensatepon v-if="nums == 2"></compensatepon>
      </el-tab-pane>
       <el-tab-pane label="返点信息" name="3">
        <returnpoint v-if="nums == 3"></returnpoint>
      </el-tab-pane>
      <el-tab-pane label="相关评价" name="4">
        <evaluatecompon v-if="nums == 4"></evaluatecompon>
      </el-tab-pane>
      <el-tab-pane label="礼品信息" name="5">
        <tablecompon :defaultselectone="4" v-if="nums == 5"></tablecompon>
      </el-tab-pane>
      <el-tab-pane label="订单跟进" name="6">
        <followuprecord v-if="nums == 6"></followuprecord>
      </el-tab-pane>
       <el-tab-pane label="相关附件" name="7">
        <accessory :orderId="orderId" :btns="[8]" :accessoryTypes="8" v-if="nums == 7"></accessory>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import installList from "@/views/Installation/dispatchcenter/tasklist/index";//安装任务列表
import compensatepon from "@/views/order/order/details/components/compensatepon"//赔偿信息组件
import evaluatecompon from "@/views/order/order/details/components/evaluatecompon"//相关评价组件
import returnpoint from "@/views/order/order/details/components/returnpoint"//返点信息组件
import tablecompon from "@/views/order/order/details/components/tablecompon"//礼品信息组件
import followuprecord from "@/views/order/order/details/components/followuprecord"//订单跟进组件
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
import orderdetail from "@/views/order/components/orderdetail";                //订单详情
import saletaskList from "./saletaskList";                                     //售后任务列表
import spot from "@/assets/images/spot.png";

export default {
  components: {
    breadcrumb,
    pagination,
    orderdetail,
    saletaskList,
    installList,
    compensatepon,
    evaluatecompon,
    returnpoint,
    tablecompon,
    followuprecord,
    accessory
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      orderId:this.$route.query.orderId,
      elsectVal: [], //选中框
      tabList: [], //table数据
      nums:'0'
    };
  },
  created() {
    this.nums=this.$route.query.nums
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {}
};
</script>
<style scoped lang='scss'>
.tasktabs {
}
</style>

