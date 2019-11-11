<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card>
        <orderdetail></orderdetail>
        <contractdetails :contract-id="contractId"></contractdetails>
        <el-tabs type="border-card" v-model="tabActive">
          <el-tab-pane label="收退款详情" name="1">
            <ReceiveRefundDetails :order-id="orderId" v-if="tabActive == 1"></ReceiveRefundDetails>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="2">
            <commodity :order-id="orderId" v-if="tabActive == 2"></commodity>
          </el-tab-pane>
          <el-tab-pane label="自有商品" name="3">
            <CommodityPrivate :order-id="orderId" v-if="tabActive == 3"></CommodityPrivate>
          </el-tab-pane>
          <el-tab-pane label="礼品" name="4">
            <GiftTable :order-id="orderId" v-if="tabActive == 4"></GiftTable>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
  import breadcrumb from "../../components/breadcrumb";
  import orderdetail from "@/views/order/components/orderdetail";
  import contractdetails from "@/views/administrationCenter/contractmanagement/components/contractdetails";
  import commodity from "@/views/administrationCenter/contractmanagement/components/commodity";
  import ReceiveRefundDetails from "@/views/administrationCenter/contractmanagement/components/ReceiveRefundDetails";
  import GiftTable from '@/views/administrationCenter/contractmanagement/components/GiftTable';
  import CommodityPrivate from '@/views/administrationCenter/contractmanagement/components/CommodityPrivate';
  import spot from '@/assets/images/spot.png';
  import { listOrderGift, listOrderOwnGoods, listOrderCollectMoneyDetails } from '@/api/administrationCenter/contractmanagement/contractmanagement'
  export default {
    components: {
      breadcrumb,
      orderdetail,
      contractdetails,
      commodity,
      ReceiveRefundDetails,
      GiftTable,
      CommodityPrivate
    },
    data() {
      return {
        spot,
        size: 'medium',
        columnAlign: 'center',
        navList: [],
        tabActive: '1',
        params: {
          accessoryId: ''
        },
        contractId: this.$route.query.contractId,
        orderId: this.$route.query.orderId
      };
    },
    mounted() {
      // 头部面包屑
      this.navList = this.$route.meta;
    },
    methods: {

      // 获取自有商品
      getListOrderOwnGoods() {

      },
      // 获取订单礼品
      getListOrderGift() {

      }
    }
  };
</script>
