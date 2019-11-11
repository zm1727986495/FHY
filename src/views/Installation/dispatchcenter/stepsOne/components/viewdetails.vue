<template>
  <div class="viewdetails">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <!-- 订单信息 -->
      <div>
        <orderdetail></orderdetail>
        <contractdetails v-show="false" :contract-id="contractId"></contractdetails>
      </div>
      <div class="m-bottom10">
        <el-button size="small" class="button-96" @click="cancel">返 回</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="hankwitch" type="border-card">
        <el-tab-pane label="商品详情" name="commodityDetails">
          <MultipleTableRoom :orderId="orderId" :group="getShowType" v-if="getShowType"></MultipleTableRoom>
        </el-tab-pane>
        <el-tab-pane label="入库详情" name="storageDetails">
          <procurementtion :orderId="orderId" v-if="activeName=='storageDetails'"></procurementtion>
        </el-tab-pane>
      </el-tabs>
      <!-- 库取 -->
      <div v-if='activeName=="storageDetails"'>
        <div class="page_head_div"></div>
        <librarytake :orderId="orderId"></librarytake>
      </div>
      <!-- 顾家 -->
      <!-- <div class="page_head_div"></div> -->
      <!-- <lookfamily></lookfamily> -->
    </el-card>
    <div class="btn">
      <el-button @click="cancel">返 回</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import procurementtion from "../../components/procurementtion";
import librarytake from "../../components/librarytake";
import lookfamily from "../../components/lookfamily";
import orderdetail from "@/views/order/components/orderdetail";
import contractdetails from "@/views/administrationCenter/contractmanagement/components/contractdetails";
import MultipleTableRoom from "@/views/administrationCenter/contractmanagement/components/MultipleTableRoom";
import { mapGetters } from 'vuex';
export default {
  components: {
    breadcrumb,
    procurementtion,
    librarytake,
    lookfamily,
    orderdetail,
    MultipleTableRoom,
    contractdetails
  },
  data() {
    return {
      navList: [],
      orderId: "",
      contractId:'',
      activeName: "commodityDetails"
    };
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.contractId = this.$route.query.contractId;
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    hankwitch() {},
    //取消
    cancel() {
      this.$router.go(-1);
    }
  },
  computed: {
    ...mapGetters([
      'contractDetails',
      'orderDetails'
    ]),
    getShowType() {
      let showTypes = '';
      if (this.orderDetails.category) {
        if (this.orderDetails.category.commodityCategoryId === 1000026) {
          showTypes = 2;
        } else {
          showTypes = 1;
        }
      }
      return showTypes;
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
