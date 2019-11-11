<template>
  <div class="unsortable">
    <el-table
      :data="tableData"
      border
      row-key="id"
      :row-class-name="tableRowClassName"
      v-loading="tableLoading"
      ref="topicTable">
      <el-table-column
        prop="name"
        align="center"
        label="状态"
        width="180"
        show-overflow-tooltip
        fixed="left"
      >
        <template slot-scope="scope">
          <div>
            <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.relevance">
              <div slot="content" class="tips tipFon">
                <p class="operaItems" @click="relevanceOrder(scope.row)">关联订单</p>
              </div>
              <img :src="spot" alt="" class="attributesTips">
            </el-tooltip>
            <p v-if="scope.row.status==0">待提交</p>
            <p v-if="scope.row.status==1">已提交</p>
            <p v-if="scope.row.status==2">退回</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="storeName"
        label="所属门店">
      </el-table-column>
      <el-table-column
        label="建材城收据号"
        show-overflow-tooltip
        prop="transactionVoucher" align="center" width="180">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        show-overflow-tooltip
        prop="transferBusinessName"
        label="财务确认人">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        show-overflow-tooltip
        prop="transferBusinessTime"
        label="财务确认时间">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="paymentMethod"
        show-overflow-tooltip
        label="收款方式">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        show-overflow-tooltip
        prop="dateCollection"
        label="实际收款时间">
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
    <el-dialog :visible.sync="dialog" width="1000px" title="关联订单" custom-class="customDialogTitle">
      <div class="unsortable">
        <el-table
          :data="dialogTableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @selection-change="selectChange"
          border :cell-style="cellStyle" :header-cell-style="cellStyle">
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            label="收款单号"
            show-overflow-tooltip
            prop="collectMoneyName" sortable align="center" width="300">
            <template slot-scope="props">
              <span class="table_action_span" @click="jumpNumber(props.row)">{{props.row.collectMoneyName}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand" class-name="table_expand_cell" width="20">
            <template slot-scope="scope" class="unsortable">
              <el-table
                :data="scope.row.orderVOS"
                style="width: 100%;"
                border
                :row-class-name="tableRowClassName"
                row-key="id">
                <el-table-column
                  align="center"
                  prop="orderNumber"
                  show-overflow-tooltip
                  label="订单编号">
                  <template slot-scope="prop">
                    <div class="operation table_action_span" @click="orderDetails(prop.row)">
                      {{prop.row.orderNumber}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="orderStatus"
                  show-overflow-tooltip
                  label="订单状态">
                  <template slot-scope="scope">
                    <div v-if="scope.row.orderStatus==0">正单</div>
                    <div v-if="scope.row.orderStatus==1">增单</div>
                    <div v-if="scope.row.orderStatus==2">补单</div>
                    <div v-if="scope.row.orderStatus==3">遗留单</div>
                    <div v-if="scope.row.orderStatus==4">退货单</div>
                    <div v-if="scope.row.orderStatus==5">上样</div>
                    <div v-if="scope.row.orderStatus==6">撤样</div>
                    <div v-if="scope.row.orderStatus==7">换货</div>
                    <div v-if="scope.row.orderStatus==8">第三方订单</div>
                    <div v-if="scope.row.orderStatus==9">售后问题</div>

                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="orderType"
                  show-overflow-tooltip
                  label="订单类型">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orderType==0">正单</span>
                    <span v-if="scope.row.orderType==1">增单</span>
                    <span v-if="scope.row.orderType==2">补单</span>
                    <span v-if="scope.row.orderType==3">遗留单</span>
                    <span v-if="scope.row.orderType==4">退货单</span>
                    <span v-if="scope.row.orderType==5">上样</span>
                    <span v-if="scope.row.orderType==6">撤样</span>
                    <span v-if="scope.row.orderType==7">退款</span>
                    <span v-if="scope.row.orderType==8">换货</span>
                    <span v-if="scope.row.orderType==9">第三方订单</span>
                    <span v-if="scope.row.orderType==10">售后问题</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="orderGoodsType"
                  show-overflow-tooltip
                  label="订单货品类型">
                  <template slot-scope="scope">
                    {{scope.row.orderGoodsType==0?"定制":"标品"}}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="categoryName"
                  label="产品品类">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="brandName"
                  show-overflow-tooltip
                  label="产品品牌">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="contractMoney"
                  label="合同金额">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="paymentAmount"
                  label="已收金额">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="collectMoney"
                  label="本次收款金额">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="customerName"
                  label="客户名称">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="customerPhone"
                  label="客户电话">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="otherPhone"
                  label="备用电话">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="Address"
                  label="订单地址">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="salesmanName"
                  label="销售">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="surveyorName"
                  label="测量员">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="designerName"
                  label="设计师">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="storeName"
                  label="所属门店">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="boothNumber"
                  label="所属摊位">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="createOrderTime"
                  show-overflow-tooltip
                  label="创建订单时间">
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  prop="givenTime"
                  label="合同签订时间">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            label="客户名称"
            show-overflow-tooltip
            prop="customerName" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="客户电话"
            show-overflow-tooltip
            prop="customerPhone" sortable align="center" width="180">
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
            label="收款金额"
            show-overflow-tooltip
            prop="collectMoney" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="录入人"
            show-overflow-tooltip
            prop="createName" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="录入时间"
            show-overflow-tooltip
            prop="createTime" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="收款类型"
            show-overflow-tooltip
            prop="collectTypeName" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="收款方式"
            show-overflow-tooltip
            prop="collectWayName" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="内部收据号"
            show-overflow-tooltip
            prop="receiptNumber" align="center" width="180">
          </el-table-column>

          <el-table-column
            label="家装合同号"
            show-overflow-tooltip
            prop="homeContractNumber" align="center" width="180">
          </el-table-column>

          <el-table-column
            label="建材城收据号"
            show-overflow-tooltip
            prop="buildingReceiptNumber" align="center" width="180">
          </el-table-column>
          <el-table-column
            label="公司收款账号"
            show-overflow-tooltip
            prop="bankCardId" align="center" width="180">
          </el-table-column>
          <el-table-column
            label="所属门店"
            show-overflow-tooltip
            prop="collectStoreName" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="所属摊位"
            show-overflow-tooltip
            prop="collectStoreBoothName" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="实收门店"
            show-overflow-tooltip
            prop="actualStoreName" sortable align="center" width="180">
          </el-table-column>
          <el-table-column
            label="实收摊位"
            show-overflow-tooltip
            prop="actualStoreBoothName" sortable align="center" width="180">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="confirm" :loading="loading" type="primary">确定</el-button>
                <el-button @click="dialog=false">关闭</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
  import spot from '@/assets/images/spot.png';
  import {pages} from '@/api/receivablesrun/clientcollection/index';
  import {editSettementCollectMoney, listOrderCollectMoneyByNOFind} from '@/api/receivablesrun/collectionNotarize/index'

  export default {
    props: ["tableData", "btnJurisdiction","tableLoading"],
    data() {
      return {
        spot,
        dialog: false,
        dialogTableData: [],
        dialogRowsData: [],
        settlementComparisonId: "",
        bmcSettlementId: '',
        loading:false
      }
    },
    methods: {
      confirm() {
        if (this.dialogRowsData.length == 0) {
          this.$message({
            message: '请选择后再进行关联',
            type: 'warning'
          });
        } else if (this.dialogRowsData.length > 1) {
          this.$message({
            message: '只可选择一条进行关联',
            type: 'warning'
          });
        } else {
          this.loading=true;
          editSettementCollectMoney(
            {
              collectMoneyId: this.dialogRowsData[0].collectMoneyId,
              settlementComparisonId: this.settlementComparisonId,
              bmcSettlementId: this.bmcSettlementId
            }
          ).then(res => {
            this.loading=false;
            this.dialog = false;
          })
        }
      },
      selectChange(val) {
        this.dialogRowsData = val;
      },
      tableRowClassName({row, rowIndex}) {//表格斑马线设置
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      relevanceOrder(val) {
        this.settlementComparisonId = val.settlementComparisonId;
        this.bmcSettlementId = val.bmcSettlementId;
        this.dialog = true;
        this.dialogPage()
      },
      dialogPage() {
        listOrderCollectMoneyByNOFind({
          collectStoreId:JSON.parse(this.$loca.getItem("activeStoreId")).storeId,
          limit:10,
          page:1
        }).then(res=>{
          this.dialogTableData = res.data.rows;
        })
        // pages({
        //   status: 3
        // }).then(res => {
        //   this.dialogTableData = res.data.rows;
        // })
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        // console.log(column,columnIndex)
        if (columnIndex === 1) { // 指定坐标-- 第一列
          return 'borderRight:none'
        } else {
          return ''
        }
      },
      orderDetails(val) {
        this.$router.push({
          path: '/ordermm/details',
          query: {
            orderId: val.orderId
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>

