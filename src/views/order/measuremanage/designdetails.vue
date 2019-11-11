<template>
  <div class="designdetails">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="lvs">
      <!-- 订单详情 -->
      <orderdetail></orderdetail>

      <!-- 合同详情 -->
      <!-- <contractdetails></contractdetails> -->
      <!-- 设计汇报 -->
      <div class="titlecals">设计汇报</div>
      <div class="addmeas">
        <addesign :addesigndata="addesigndata"></addesign>
      </div>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb";
import orderdetail from "../components/orderdetail";
import contractdetails from "../components/contractdetails";
import addesign from "./components/addesign"; //添加设计汇报

export default {
  components: {
    breadcrumb,
    orderdetail,
    contractdetails,
    addesign
  },
  data() {
    return {
      addesigndata: {
        assignedMeasureId: this.$route.query.id,
        cadPic: "",
        effectPic: "",
        budgetPic: "",
        describe: ""
      },
      isShow: true,
      navList: []
    };
  },
  props: [],
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
  // }
};
</script>

<style lang="scss" scoped>
.designdetails {
  .tapbox {
    padding: 10px 200px;
    display: flex;
    justify-content: space-between;
  }
  .addmeas {
    padding: 0px 200px;
  }
  .boxtit {
    background: #f5f5f5;
    padding: 10px 20px;
    color: #333333;
    font-size: 14px;
    margin: 20px 0px;
  }
}
</style>

