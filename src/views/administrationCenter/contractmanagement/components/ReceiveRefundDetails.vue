<template>
  <div>
    <div class="moduleHeader">
      <div class="title">收款信息</div>
    </div>
    <div class="table_list" v-loading="loading">
      <el-table border :row-class-name="tableRowClassName" :data="orderDetailsCollectVOS">
        <el-table-column prop="status" align="center" width="120" label="收费状态" sortable>
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">未提交</div>
            <div v-if="scope.row.status == 1">已提交</div>
            <div v-if="scope.row.status == 2">已驳回</div>
            <div v-if="scope.row.status == 4">已审核</div>
            <div v-if="scope.row.status == 6">已销账</div>
          </template>
        </el-table-column>
        <el-table-column prop="returnReason" align="center" width="200" label="驳回原因" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gatheringTime" align="center" width="160" label="收费时间"></el-table-column>
        <el-table-column prop="collectWayName" align="center" width="120" label="收费方式" show-overflow-tooltip></el-table-column>
        <el-table-column prop="collectTypeName" align="center" width="120" label="收费类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="collectMoney" align="center" width="150" label="付款金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="auditName" align="center" width="120" label="收费审核人"></el-table-column>
        <el-table-column prop="auditTime" align="center" width="160" label="审核时间"></el-table-column>
        <el-table-column prop="receiptNumber" align="center" width="180" label="内部收据号" show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="homeContractNumber" align="center" width="200" label="系统收据号"></el-table-column>-->
        <el-table-column prop="buildingReceiptNumber" align="center" width="180" label="建材城收据号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bankCardId" align="center" width="200" label="刷卡号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="costMoney" align="center" width="120" label="刷卡手续费" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shopCashCouponAmount" align="center" width="150" label="优惠券" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ownCashCouponAmount" align="center" width="150" label="代金券" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" align="center" width="200" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="moduleHeader m-top10">
      <div class="title">退款信息</div>
    </div>
    <div class="table_list">
      <el-table border :row-class-name="tableRowClassName" :data="orderDetailsRefundVOS">
        <el-table-column prop="customerName" align="center" width="120" label="客户名称" sortable></el-table-column>
        <el-table-column prop="openingBank" align="center" width="140" label="开户银行" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="refundType" align="center" width="120" label="支付方式" sortable>
          <template slot-scope="scope">
            <div v-if="scope.row.refundType == 1">现金</div>
            <div v-if="scope.row.refundType == 2">转账</div>
          </template>
        </el-table-column>
        <el-table-column prop="refundMoney" align="center" width="150" label="退款金额" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="bankCardNumber" align="center" width="200" label="退款账号" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="auditName" align="center" width="120" label="退款人" sortable></el-table-column>
        <el-table-column prop="auditTime" align="center" width="170" label="退款日期" sortable></el-table-column>
        <el-table-column prop="refundReason" align="center" width="200" label="退款原因" sortable show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import accessory from "@/views/administrationCenter/contractmanagement/components/accessory";
  // import { listOrderCollectMoneyDetails } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  import { getOrderMoneyCollectAndRefund } from 'api/order/order/orderdetails';
  export default {
    components: {
      accessory
    },
    props: ['orderId'],
    created() {
      this.getListOrderCollectMoneyDetails();
    },
    data() {
      return {
        size: 'medium',
        columnAlign: 'center',
        loading: true,
        orderDetailsCollectVOS: [],
        orderDetailsRefundVOS: []
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      getRowKeys(row) {
        return row.collectMoneyId;
      },
      // 获取收退款详情
      getListOrderCollectMoneyDetails() {
        this.loading = true;
        let params = {
          orderId: this.orderId || this.$route.query.orderId
        };
        getOrderMoneyCollectAndRefund(params)
          .then(response => {
            this.loading = false;
            if (response.status == 200) {
              this.orderDetailsCollectVOS = response.data.orderDetailsCollectVOS;
              this.orderDetailsRefundVOS = response.data.orderDetailsRefundVOS;
            }
          })
          .catch(error => {
            this.loading = false;
            console.log('合同管理/收退款详情 views/administrationCenter/contractmanagement/components/ReceiveRefundDetails' + error);
          });
      }
    }
  }
</script>
