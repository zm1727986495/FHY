<template>
  <div class="unsortable">
    <el-table
      :data="tableData"
      style="width: 100%;"
      border
      :row-class-name="tableRowClassName"
      v-loading="tableLoading"
      ref="topicTable">
      <el-table-column
        prop="failReasons"
        align="center"
        label="无法确认原因"
        width="200"
        fixed="left"
      >
        <template slot-scope="scope">
          <div>
            <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.editPrice">
              <div slot="content" class="tips tipFon">
                <p class="operaItems" @click="edit(scope.row)">编辑收款</p>
              </div>
              <img :src="spot" alt="" class=" attributesTips">
            </el-tooltip>
            <p class="operation" v-if="scope.row.failReasons==1">未找到订单</p>
            <p class="operation" v-else-if="scope.row.failReasons==2">金额不一致</p>
            <p class="operation" v-else>新加入收费</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="actualStoreName"
        label="所属门店">
      </el-table-column>
      <el-table-column
        label="建材城收据号"
        show-overflow-tooltip
        prop="buildingReceiptNumber" align="center" width="180">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="businessConfirmationName"
        label="财务确认人">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="transferBusinessTime"
        label="财务确认时间">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="actualStoreBoothName"
        label="实际收款摊位">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="customerName"
        label="客户名称">
      </el-table-column>
      <el-table-column
        label="商场代金券"
        show-overflow-tooltip
        prop="shopCashCoupons" align="center" width="180">
      </el-table-column>
      <el-table-column
        label="自有代金券"
        show-overflow-tooltip
        prop="ownCashCoupons" align="center" width="180">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="collectWayName"
        label="收款方式">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="collectMoney"
        label="收款金额">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="costMoney"
        label="刷卡手续费">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="gatheringTime"
        label="实际收款时间">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import spot from '@/assets/images/spot.png';

  export default {
    props: ["tableData","tableLoading","btnJurisdiction"],
    data() {
      return {
        spot: spot,
        date: [],
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {//表格斑马线设置
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      edit(val) {
        this.$router.push({
          path: "proedit",
          query: {
            settlementComparisonId: val.settlementComparisonId,
            id: val.collectMoneyId,
            bmcSettlementId: val.bmcSettlementId,
            editMoney: true,
            noOrder:1
          }
        })
      }
    },
  }
</script>
<style scoped>
  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearfloat {
    zoom: 1
  }

  .dialog-Form-list {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .dialog-Form-list > span {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  .dialog-Form-list > div {
    display: inline-block;
    width: 30%;
  }

  .dialog-Form-list:nth-last-child(1) {
    height: auto;
    align-items: flex-start;
    padding-top: 12px;
  }

  .dialog-Form-list:nth-last-child(1) > div {
    width: 80%;
  }

  .dialog-footer {
    height: 120px;
  }
</style>
