<template>
  <div class="table_list">
    <el-table border :data="tableList" :row-class-name="tableRowClassName" v-loading="loading">
      <el-table-column :align="columnAlign" type="index" fixed></el-table-column>
      <el-table-column prop="status" label="状态" :align="columnAlign" sortable width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.purchaseStatus == 1">待执行</span>
          <span v-else-if="scope.row.purchaseStatus == 2">执行完成</span>
          <span v-else-if="scope.row.purchaseStatus == 3">对账中</span>
          <span v-else-if="scope.row.purchaseStatus == 4">对账完成</span>
          <span v-else-if="scope.row.purchaseStatus == 5">结算中</span>
          <span v-else-if="scope.row.purchaseStatus == 6">结算完成</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseNumber" label="采购单号" :align="columnAlign" width="180" sortable show-overflow-tooltip></el-table-column>
<!--      <el-table-column prop="purchaseType" label="采购分类" :align="columnAlign" width="110" sortable show-overflow-tooltip>-->
<!--        <template slot-scope="scope">-->
<!--          <p v-if="scope.row.purchaseType == 1">内购</p>-->
<!--          <p v-else-if="scope.row.purchaseType == 2">外购</p>-->
<!--          <p v-else>-</p>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="purchaseContractCode" label="采购合同号" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="companyName" label="供应商" :align="columnAlign" width="220" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="contractMoney" label="订单合同金额" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="签合同订单成本金额" :align="columnAlign" width="180" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="purchaseContractMoney" label="采购单合同金额" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="purchaseCost" label="签合同采购单成本金额" :align="columnAlign" width="190" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="settlementMoney" label="采购单结算金额" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="supplierCostMoney" label="供货商成本" :align="columnAlign" width="130" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="earning" label="加减收金额" :align="columnAlign" width="130" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="extraEarning" label="额外加减收金额" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="actualSettlementMoney" label="实际结算金额" :align="columnAlign" width="130" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="purchaseAt" label="下单人" :align="columnAlign" width="110" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="purchaseTime" label="下单完成时间" :align="columnAlign" width="170" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="checkBillAt" label="对账人" :align="columnAlign" width="110" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="checkBillTime" label="对账完成时间" :align="columnAlign" width="170" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="settlementAt" label="结算人" :align="columnAlign" width="110" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="settlementTime" label="结算完成时间" :align="columnAlign" width="170" sortable show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { listPurchaseOrder } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  export default {
    name: "PurchaseListTable",
    created() {
      this.getData();
    },
    data() {
      return {
        loading: true,
        columnAlign: 'center',
        size: 'medium',
        tableList: []
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      getData() {
        let params = {
          customerContractId: this.contractId ? this.contractId : this.$route.query.contractId,
          billType: this.$route.query.billType
        };
        listPurchaseOrder(params)
          .then(response => {
            if (response.data && response.data.length && response.data[0]) {
              this.tableList = response.data;
              this.$store.dispatch('SET_PURCHASE_ORDER_LIST', response.data);
            }
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log('合同管理/商品信息 views/administrationCenter/contractmanagement/components/GiftTable' + error);
          });
      }
    }
  }
</script>

<style scoped>

</style>
