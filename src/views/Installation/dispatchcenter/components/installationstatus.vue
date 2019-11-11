<template>
  <div class="viewdetails">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <orderdetail></orderdetail>
    <el-card class="box-card">
      <!-- 采购合同 -->
      <modifyOrder ref="modifyOrder" :orderId="orderId"></modifyOrder>
    </el-card>

    <div class="btn">
      <el-button type="primary" @click="handleok">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import modifyOrder from "./modifyOrder";
import libraryacquisition from "./libraryacquisition";
import lookfamily from "./lookfamily";
import orderdetail from "@/views/order/components/orderdetail";

import { editPurchaseOrder } from "api/Installation/dispatchcenter/dispatchcenter";
export default {
  components: {
    breadcrumb,
    modifyOrder,
    libraryacquisition,
    lookfamily,
    orderdetail
  },
  data() {
    return {
      navList: [],
      orderId: ""
    };
  },
  created() {
    this.orderId = this.$route.query.orderId;
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    //确定
    handleok() {
      let arr = [];
      this.$refs.modifyOrder.dataList.forEach(item => {
        if (item.modify == 1) {
          arr.push(item.purchaseOrderId);
        }
      });
      let data = {
        purchaseOrderIds: arr,
        isInstall: "1"
      };
      editPurchaseOrder(data)
        .then(res => {
          if (res.status == 200) {
            this.$router.go(-1);
            this.$message.success(res.message);
          }
        })
        .catch(error => {
          console.error("修改安装状态", error);
        });
    },
    //取消
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.viewdetails {
  .btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .page_head_div {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 50px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
  }
  .information {
    padding: 0 20px;
  }
  .details {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 25%;
      margin: 5px 0;
    }
  }
}
</style>
