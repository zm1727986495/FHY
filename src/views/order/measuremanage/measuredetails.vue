<template>
  <div class="measuredetails">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="lvs">
      <!-- 订单详情 -->
      <orderdetail ref="orderdetail"></orderdetail>

      <!-- 合同详情 -->
      <!-- <contractdetails></contractdetails> -->
      <!-- 合同信息 -->
      <div class="boxtit">测量汇报</div>
      <div class="addmeas">
        <addmeasurereport
          ref="address"
          :addmeasurereportdata="addmeasurereportdata"
          :orderId="orderId"
          :customerId="customerId"
          :loadingbtn='loadingbtn'
          @loadingFn='loadingFn'
        ></addmeasurereport>
      </div>
      <div class="btn">
        <el-button type="primary" size="medium" @click="subminbtn" :loading="loadingbtn">提交</el-button>
        <el-button size="medium" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "../components/orderdetail";
import contractdetails from "../components/contractdetails";
import addmeasurereport from "./components/addmeasurereport";
import { editOrderAssignedMeasure } from "api/order/measuremanage/measuremanage";
import { getUUID } from "api/pulicJava";
export default {
  components: {
    breadcrumb,
    orderdetail,
    contractdetails,
    addmeasurereport
  },
  data() {
    return {
      addmeasurereportdata: {
        assignedMeasureId: this.$route.query.id,
        customerId: this.$route.query.customerId,
        dealResult: "",
        reportTime: "",
        isRetest: "",
        isScene: "",
        customerAddressId: "",
        taskResult: "",
        enclosures: [],
        oldCustomerAddressId: this.$route.query.customerAddressId,
        customerAddress: {}
      },
      loadingbtn:false,
      subLoading:false,
      orderId: Number(this.$route.query.orderId),//订单ID
      customerId: Number(this.$route.query.customerId),
      isShow: true,
      navList: []
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    //取消
    cancel() {
      this.$router.go(-1);
    },
    //提交
    subminbtn(addmeasurereportdata) {
      this.subLoading = true;
      this.$refs.address.verification(
        this.$refs.orderdetail.detaildata.customerAddressId
      );
      this.subLoading = false;
    },
    loadingFn(show){
      this.loadingbtn = show;
    },
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.measuredetails {
  .tapbox {
    padding: 10px 200px;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .addmeas {
    padding: 0px 20px;
  }
  .boxtit {
    background: #f5f5f5;
    padding: 10px 20px;
    color: #333333;
    font-size: 14px;
    margin: 20px 0px;
  }
  .btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>

