<template>
  <div>
    <div class="queryForm">
      <el-row :gutter="10">
        <el-col :span="span">
          <el-input class="ipts" @keyup.enter.native="search" size="medium" placeholder="订单编号" clearable v-model="param1.orderNumber"></el-input>
        </el-col>
        <el-col :span="span">
          <el-input class="ipts" @keyup.enter.native="search" size="medium" placeholder="客户名称" clearable v-model="param1.customerName"></el-input>
        </el-col>
        <el-col :span="span">
          <el-input class="ipts" @keyup.enter.native="search" size="medium" placeholder="建材城收据号" clearable
                    v-model="param1.buildingReceiptNumber"></el-input>
        </el-col>
        <el-col :span="span" v-if="isShow">
          <el-input class="ipts" @keyup.enter.native="search" size="medium" placeholder="内部收据号" clearable v-model="param1.receiptNumber"></el-input>
        </el-col>
        <el-col :span="span" v-if="isShow">
          <el-date-picker
            @keyup.enter.native="search"
            size="medium" v-model="date" type="daterange"
            value-format='yyyy-MM-dd' format='yyyy-MM-dd'
            range-separator="-"
            clearable
            start-placeholder="收款开始日期" end-placeholder="收款开始日期">
          </el-date-picker>
        </el-col>
        <el-col :span="span" v-if="isShow">
          <el-select @keyup.enter.native="search" v-model="param1.failReasons" clearable filterable size="medium">
            <el-option label="未找到订单" value="1"></el-option>
            <el-option label="金额不一致" value="2"></el-option>
            <el-option label="新加入收费" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="span" v-if="isShow">
          <el-select @keyup.enter.native="search" v-model="param1.settlementComparisonResult" filterable clearable size="medium">
            <el-option label="成功" value="0"></el-option>
            <el-option label="失败" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="span">
          <span class="fontMore cursors margright" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
          <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
          <el-button size="medium" type="primary" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <div class="m-top20">
        <el-button size="small" :loading="transferConfirmationLading" class="button-96" @click="transferConfirmation">转业务确认</el-button>
        <el-button size="small" :loading="goBackAllLoading" class="button-96" @click="goBackAll">退回</el-button>
        <el-button size="small" :loading="secondCheckLoading" class="button-96" @click="secondCheck">二次校验</el-button>
        <el-button size="small" :loading="confirmLoading" class="button-96" @click="confirm">确认</el-button>
        <el-button size="small" class="button-96">导出对账明细</el-button>
      </div>
      <div class="m-top20 unsortable">
        <el-table
          :data="tableObj.tableData"
          border
          :row-class-name="tableRowClassName"
          @selection-change="selectChange"
          @row-click="rowClick"
          ref="table"
          v-loading="tableObj.tabLoading"
        >
          <el-table-column fixed="left" type="selection" align="center"></el-table-column>
          <el-table-column fixed="left" show-overflow-tooltip width="130" align="center" prop="settlementComparisonResult" label="是否校验成功">      
            <template slot-scope="scope">
              <div>
                <el-tooltip placement="right" visible-arrow v-if="scope.row.status!=2&&scope.row.isType!=1&&scope.row.isTrue!=1">
                  <div slot="content" class="tips tipFon">
                    <p class="operaItems" @click="transferRow(scope.row)"
                       v-if="scope.row.settlementComparisonResult == 1">转业务</p>
                    <!-- <p class="operaItems" @click="editMoney(scope.row)">编辑结算金额</p> -->
                  </div>
                  <img :src="spot" alt="" class=" attributesTips">
                </el-tooltip>
                <span>{{scope.row.settlementComparisonResult==0?"成功":"失败"}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="100" align="center"  label="状态">      
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.status==2">退回</span>
                <span v-else>正常</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="100" align="center"  label="数据类型">      
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.isType==0">正常</span>
                <span v-if="scope.row.isType==1">转业务</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="100" align="center" prop="failReasons" label="是否确认">
            <template slot-scope="scope">
              <span v-if="scope.row.isTrue==1">确认</span>
              <span v-else>未确认</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="250px" align="center" prop="failReasons" label="失败原因">
            <template slot-scope="scope">
              <span v-if="scope.row.failReasons==1">未找到订单</span>
              <span v-if="scope.row.failReasons==2">金额不一致</span>
              <span v-if="scope.row.failReasons==3">新加入收费</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="140" align="center" prop="amountCollected"
                           label="本次结算金额"></el-table-column>
          <el-table-column show-overflow-tooltip width="140" align="center" prop="refundAmount"
                           label="实际结算金额"></el-table-column>
          <el-table-column show-overflow-tooltip width="140" align="center" prop="settledAmount"
                           label="已结算金额"></el-table-column>
          <el-table-column show-overflow-tooltip width="140" align="center" prop="collectMoney"
                           label="收款金额"></el-table-column>
          <el-table-column show-overflow-tooltip width="140" align="center" prop="buildingReceiptNumber"
                           label="建材城收据号"></el-table-column>
          <el-table-column show-overflow-tooltip width="150" align="center" prop="orderNumber"
                           label="订单编号">
            <template slot-scope="scope">
              <el-button type="text">{{ scope.row.orderNumber }}</el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="200" align="center" prop="collectStoreName"
                           label="所属门店"></el-table-column>
          <el-table-column show-overflow-tooltip width="200" align="center" prop="actualStoreName"
                           label="实收门店"></el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="center" prop="customerName"
                           label="客户名称"></el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="center" prop="collectWay"
                           label="收款方式"></el-table-column>
          <el-table-column show-overflow-tooltip width="180" align="center" prop="cardNumber"
                           label="刷卡卡号"></el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="center" prop="costMoney"
                           label="刷卡手续费"></el-table-column>
          <el-table-column show-overflow-tooltip width="180" align="center" prop="gatheringTime"
                           label="收款时间"></el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="center" prop="salesmanName"
                           label="导购"></el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="center" prop="designerName"
                           label="设计师"></el-table-column>
        </el-table>
      </div>
      <div class="pagination_wrap">
        <pagination
          :current-page="param1.page"
          :pageSize="param1.limit"
          :total="tableObj.total"
          @sizeChange="sizeChange"
          @currentChange="currentChange">
        </pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialog" title="编辑结算金额" custom-class="customDialogTitle">
      <div class="queryForm">
        <el-form label-width="100px" inline size="medium">
          <el-form-item label="应收款金额" style="width:48%">
            <el-input v-model="money" disabled></el-input>
          </el-form-item>
          <el-form-item label="实际结算金额" style="width:48%">
            <el-input v-model="editRowsMoney.refundAmount"></el-input>
          </el-form-item>
        </el-form>
        <div class="table_list unsortable">
          <el-table
            :data="dialogTableData"
            border
            :row-class-name="tableRowClassName"
            max-height="350">
            <el-table-column show-overflow-tooltip align="center" prop="settledAmountHis"
                             label="结算金额/元"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createName" label="结算人"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createTime" label="结算时间"></el-table-column>
          </el-table>
          <div class="pagination_wrap">
            <pagination
              :current-page="dialogParams.page"
              :pageSize="dialogParams.limit"
              :total="dialogTotal"
              @sizeChange="dialogSize"
              @currentChange="dialogChange">
            </pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editConfirm">确 定</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import spot from '@/assets/images/spot.png';
  import pagination from "@/views/components/pagination";
  import {
    listSettlementComparisonVO,
    updateOrderCollectMoney,
    transferOrderCollectMoney,
    listRelCollectMoneyHis,
    returnOrderCollectMoney,
    secondOrderCollectMoney,
    editSettlementComparisonIsTrue
  } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index'

  export default {
    props: ["tableObj"],
    components: {
      pagination
    },
    data() {
      return {
        isShow: false,
        span: 6,
        spot,
        date: [],
        dialog: false,
        transferConfirmationLading:false,
        goBackAllLoading:false,
        secondCheckLoading:false,
        confirmLoading:false,
        editRowsMoney: {
          // collectMoneyId: "",
          refundAmount: "",
          bmcSettlementDetailedId: ''
        },
        money: 0,
        dialogParams: {
          page: 1,
          limit: 10,
          collectMoneyId: ""
        },
        dialogTotal: 10,
        param1: {
          page: 1,
          limit: 10,
          orderNumber: "",
          customerName: "",
          buildingReceiptNumber: "",
          receiptNumber: "",
          failReasons: "",
          settlementComparisonResult: "",
          startTime: "",
          endTime: "",
          bmcSettlementId: this.$route.query.bmcSettlementId,
          // chooseType: 1
        },
        dialogTableData: [],
        // Table:this.tableData,
        rowsData: [],
        turnBusiness: {
          ids: [],
          bmcSettlementId: Number(this.$route.query.bmcSettlementId),
        },
        rowsTurnBusiness: {
          ids: [],
          bmcSettlementId: Number(this.$route.query.bmcSettlementId),
        }
      }
    },
    methods: {
      confirm(){
        if(this.rowsData.length<=0){
            this.$message({
                message: '请选择后在进行操作',
                type: 'warning'
            });
        }else{
            let flag=this.rowsData.every((item,idx)=>{
              return item.status!=2&&item.isType!=1&&item.isTrue!=1;
            })
            if(flag){
              let arr=[]
              this.rowsData.map((item,idx)=>{
                  arr.push(item.settlementComparisonId)
              })
              this.confirmLoading=true;
              editSettlementComparisonIsTrue({
                  ids:arr,
              }).then(res=>{
                  this.confirmLoading=false;
                  this.pages()
                  this.$message({
                      message: '操作成功',
                      type: 'success'
                  });
              })
            }else{
              this.$message({
                message: '不可再进行操作',
                type: 'warning'
              });
            }
            
        }
      },
      goBackAll(){
          if(this.rowsData.length<=0){
              this.$message({
                  message: '请选择后在进行退回',
                  type: 'warning'
              });
          }else{
              let flag=this.rowsData.every((item,idx)=>{
                return item.status!=2&&item.isType!=1&&item.isTrue!=1;
              })
              if(flag){
                let arr=[]
                this.rowsData.map((item,idx)=>{
                    arr.push(item.settlementComparisonId)
                })
                this.goBackAllLoading=true;
                returnOrderCollectMoney({
                    ids:arr,
                    bmcSettlementId:this.bmcSettlementId,
                }).then(res=>{
                    this.goBackAllLoading=false;
                    this.pages()
                    this.$message({
                        message: '退回成功',
                        type: 'success'
                    });
                })
              }else{
                this.$message({
                  message: '不可再进行操作',
                  type: 'warning'
                });
              }
              
          }
      },
      secondCheck(){
          if(this.rowsData.length){
              let flag=this.rowsData.every((item,idx)=>{
                return item.status!=2&&item.isType!=1&&item.isTrue!=1;
              })
              if(flag){
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.settlementComparisonId)
                })
                this.secondCheckLoading=true;
                secondOrderCollectMoney({
                    ids:arr
                }).then(res=>{
                  this.secondCheckLoading=false;
                    this.$message({
                        message: '校验成功',
                        type: 'success'
                    });
                    this.pages()
                })
              }else{
                this.$message({
                  message: '不可再进行操作',
                  type: 'warning'
                });
              }
          }else{
              this.$message({
                  message: '请选择后再进行二次校验',
                  type: 'warning'
              });
          }
      },
      rowClick(row){
        this.$refs.table.toggleRowSelection(row)
      },
      hideSearch() {
        this.isShow = !this.isShow;
      },
      transferRow(val) {
        this.$confirm('确定要进行转业务操作?', '提示', {
          type: 'warning'
        }).then(() => {
          this.rowsTurnBusiness["ids"] = [val.settlementComparisonId]
          transferOrderCollectMoney(this.rowsTurnBusiness).then(res => {
            this.$message({
              message: '转业务成功',
              type: 'success'
            });
            this.pages()
          })
        }).catch(() => {
        });
      },
      transferConfirmation() {
        if (this.rowsData.length == 0) {
          this.$message({
            message: '请选择后再进行转业务',
            type: 'warning'
          });
        } else {
          let flag=this.rowsData.every((item,idx)=>{
            return item.status!=2&&item.isType!=1&&item.isTrue!=1;
          })
          if(flag){
            this.$confirm('确定要进行转业务操作?', '提示', {
              type: 'warning'
            }).then(() => {
              let arr = [];
              this.transferConfirmationLading=true;
              this.rowsData.map((item, idx) => {
                arr.push(item.settlementComparisonId);
              })
              this.turnBusiness["ids"] = arr
              transferOrderCollectMoney(this.turnBusiness).then(res => {
                this.transferConfirmationLading=false;
                this.$message({
                  message: '转业务成功',
                  type: 'success'
                });
                this.pages();
              })
            }).catch(() => {
            });
          }else{
            this.$message({
              message: '不可再进行操作',
              type: 'warning'
            });
          }
        }
      },
      selectChange(val) {
        this.rowsData = val;
      },
      editConfirm() {
        updateOrderCollectMoney(this.editRowsMoney).then(res => {
          this.$message({
            message: '编辑成功',
            type: 'success'
          });
          this.pages();
          this.editRowsMoney.refundAmount = '';
          this.dialog = false;
        })
      },
      editMoney(val) {
        this.dialog = true;
        this.editRowsMoney.collectMoneyId = val.collectMoneyId;
        this.editRowsMoney.bmcSettlementDetailedId = val.bmcSettlementDetailedId;
        this.money = val.refundAmount;
        this.dialogParams.collectMoneyId = val.collectMoneyId;
        this.dialogParams.bmcSettlementDetailedId = val.bmcSettlementDetailedId;
        this.dialogPages();
      },
      dialogPages() {
        listRelCollectMoneyHis(
          this.dialogParams
        ).then(res => {
          this.dialogTableData = res.data.rows;
          this.dialogTotal = res.data.total;
        })
      },
      dialogSize(val) {
        this.dialogParams.page = 1;
        this.dialogParams.limit = val;
        this.dialogPages()
      },
      dialogChange(val) {
        this.dialogParams.page = val;
        this.dialogPages()
      },
      search() {
        this.param1.page = 1;
        this.pages();
      },
      reset() {
        this.param1.page = 1;
        this.param1.orderNumber = "";
        this.param1.customerName = "";
        this.param1.buildingReceiptNumber = "";
        this.param1.receiptNumber = "";
        this.param1.failReasons = "";
        this.param1.settlementComparisonResult = "";
        this.param1.startTime = "";
        this.param1.endTime = "";
        this.date = [];
        this.pages();
      },
      tableRowClassName({row, rowIndex}) {//表格斑马线设置
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      pages() {
        this.param1.startTime = this.date[0];
        this.param1.endTime = this.date[1];
        this.tableObj.tabLoading=true;
        listSettlementComparisonVO(this.param1).then(res => {
          this.tableObj.tableData = res.data.rows;
          this.tableObj.total = res.data.total;
          this.tableObj.tabLoading=false;
        })
      },
      currentChange(val) {
        this.param1.page = val;
        this.pages();
      },
      sizeChange(val) {
        this.param1.page = 1;
        this.param1.limit = val;
        this.pages();
      }
    }
  }
</script>
<style scoped>
</style>
