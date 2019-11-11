<template>
    <div>
        <div class="queryForm">
            <el-row :gutter="10">
                <el-col :span="span">
                    <el-input class="ipts" @keyup.enter.native="search" placeholder="订单编号" clearable v-model="param1.orderNumber"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" @keyup.enter.native="search" placeholder="客户名称" clearable v-model="param1.customerName"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" @keyup.enter.native="search" placeholder="建材城收据号" clearable v-model="param1.buildingReceiptNumber"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" @keyup.enter.native="search" placeholder="内部收据号" clearable v-model="param1.receiptNumber"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-date-picker
                        @keyup.enter.native="search"
                        size="medium" v-model="date" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="收款开始日期" end-placeholder="收款开始日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="span">
                    <el-select @keyup.enter.native="search" v-model="param1.failReasons" clearable>
                        <el-option label="未找到订单" value="1"></el-option>
                        <el-option label="金额不一致" value="2"></el-option>
                        <el-option label="新加入收费" value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="span">
                    <el-select @keyup.enter.native="search" v-model="param1.settlementComparisonResult" clearable>
                        <el-option label="成功" value="0"></el-option>
                        <el-option label="失败" value="1"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="span">
                    <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
                </el-col>
            </el-row>
            <div class="m-top20" v-if="!$route.query.onlyReady">
                <el-button size="small" class="button-96">导出对账明细</el-button>
                <el-button size="small" class="button-96" @click="goBackAll">退回</el-button>
                <el-button size="small" class="button-96" @click="secondCheck">二次校验</el-button>
            </div>
            <div class="m-top20">
                <el-table
                border
                :data="tableObj.tableData"
                :row-class-name="tableRowClassName"
                @selection-change="selectChange"
                >
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column fixed show-overflow-tooltip width="180px" align="center" prop="secondaryVerification" label="二次校验">
                         <template slot-scope="scope" v-if="!$route.query.onlyReady">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="goBackRow(scope.row)">退回</p>
                                        <p class="operaItems" @click="editMoney(scope.row)">编辑结算金额</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <span>
                                    {{scope.row.secondaryVerification==0?"否":"是"}}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="failReasons" label="失败原因">
                        <template slot-scope="scope">
                            <span v-if="scope.row.failReasons==1">未找到订单</span>
                            <span v-if="scope.row.failReasons==2">金额不一致</span>
                            <span v-if="scope.row.failReasons==3">新加入收费</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="transferBusinessName" label="转业务人"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="transferBusinessTime" label="转业务时间"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="businessConfirmationName" label="业务确认人"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="businessConfirmationTime" label="业务确认时间"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="amountCollected" label="本次结算金额"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="refundAmount" label="实际结算金额"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="settledAmount" label="已结算金额"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="collectMoney" label="收款金额"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="buildingReceiptNumber" label="建材城收据号"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="orderNumber" label="订单编号"></el-table-column>
                    <el-table-column show-overflow-tooltip width="230px" align="center" prop="collectStoreName" label="所属门店"></el-table-column>

                    <el-table-column show-overflow-tooltip width="230px" align="center" prop="actualStoreName" label="实收门店"></el-table-column>
                    
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="customerName" label="客户名称"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="collectWay" label="付款方式"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="cardNumber" label="刷卡卡号"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="serviceCharge" label="刷卡手续费"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="gatheringTime" label="收款时间"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="salesmanName" label="导购"></el-table-column>
                    <el-table-column show-overflow-tooltip width="180px" align="center" prop="designerName" label="设计师"></el-table-column>
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
        <el-dialog :visible.sync="dialog" width="1000px" title="编辑结算金额" custom-class="customDialogTitle">
            <div class="queryForm">
                <el-form label-width="200px" inline>
                        <el-form-item label="应收款金额" style="width:48%">
                            <el-input v-model="money" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="实际结算金额" style="width:48%">
                            <el-input v-model="editRowsMoney.refundAmount"></el-input>
                        </el-form-item>
                </el-form>
                <el-table 
                :data="dialogTableData" 
                border
                :row-class-name="tableRowClassName">
                    <el-table-column show-overflow-tooltip align="center" prop="settledAmountHis" label="结算金额/元"></el-table-column>
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
    secondOrderCollectMoney
} from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index'
export default {
    props:["tableObj"],
    components:{
        pagination
    },
    data(){
        return{
            span: 6,
            currentPage:1,
            pageSize:10,
            total:10,
            date:[],
            param1:{
                page:1,
                limit:10,
                orderNumber:"",
                customerName:"",
                buildingReceiptNumber:"",
                receiptNumber:"",
                failReasons:"",
                settlementComparisonResult:"",
                startTime:"",
                endTime:"",
                bmcSettlementId:this.$route.query.bmcSettlementId,
                chooseType:2
            },
            dialogParams:{
                page:1,
                limit:10,
                bmcSettlementDetailedId:""
            },
            dialog:false,
            tableData:[
                {
                    data:1
                },
                {
                    data:2
                }
            ],
            spot,
            money:'',
            editRowsMoney:{
                collectMoneyId:"",
                refundAmount:"",
                bmcSettlementDetailedId:''
            },
            dialogTotal:10,
            dialogTableData:[],
            rowsData:[],
            bmcSettlementId:Number(this.$route.query.bmcSettlementId)
        }
    },
    methods: {
        secondCheck(){
            if(this.rowsData.length){
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.settlementComparisonId)
                })
                secondOrderCollectMoney({
                    ids:arr
                }).then(res=>{
                    this.$message({
                        message: '校验成功',
                        type: 'success'
                    });
                    this.pages()
                })
            }else{
                this.$message({
                    message: '请选择后再进行二次校验',
                    type: 'warning'
                });
            }
        },
        search(){
            this.param1.page=1;
            this.pages()
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        selectChange(val){
            this.rowsData=val;
        },
        goBackRow(val){
            returnOrderCollectMoney({
                ids:[val.settlementComparisonId],
                bmcSettlementId:this.bmcSettlementId,
            }).then(res=>{
                this.$message({
                    message: '退回成功',
                    type: 'success'
                });
                this.pages()
            })
        },
        goBackAll(){
            if(this.rowsData.length<=0){
                this.$message({
                    message: '请选择后在进行退回',
                    type: 'warning'
                });
            }else{
                let arr=[]
                this.rowsData.map((item,idx)=>{
                    arr.push(item.settlementComparisonId)
                })
                returnOrderCollectMoney({
                    ids:arr,
                    bmcSettlementId:this.bmcSettlementId,
                }).then(res=>{
                    this.$message({
                        message: '退回成功',
                        type: 'success'
                    });
                })
            }
        },
        editMoney(val){
            this.dialog=true;
            this.editRowsMoney.collectMoneyId=val.collectMoneyId;
            this.money=val.actualAmount;
            this.dialogParams.bmcSettlementDetailedId=val.bmcSettlementDetailedId;
            this.editRowsMoney.bmcSettlementDetailedId=val.bmcSettlementDetailedId;
            this.dialogPages()
        },
        editConfirm(){
            updateOrderCollectMoney(this.editRowsMoney).then(res=>{
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                });
                this.editRowsMoney.refundAmount='';
                this.dialog=false;
                this.pages()
            })
        },
        pages(){
            this.param1.startTime=this.date[0];
            this.param1.endTime=this.date[1];
            listSettlementComparisonVO(this.param1).then(res=>{
                this.tableObj.tableData=res.data.rows;
                this.tableObj.total=res.data.total;
            })
            this.dialogPages()
        },
        dialogPages(){
            listRelCollectMoneyHis(
                this.dialogParams
            ).then(res=>{
                this.dialogTableData=res.data.rows;
                this.dialogTotal=res.data.total;
            })
        },
        dialogSize(val){
            this.dialogParams.page=1;
            this.dialogParams.limit=val;
            this.dialogPages()
        },
        dialogChange(val){
            this.dialogParams.page=val;
            this.dialogPages()
        },
        currentChange(val) {
            this.param1.page = val;
            this.pages();
        },
        sizeChange(val) {
            this.param1.page = 1;
            this.param1.limit = val;
            this.pages();
        },
    },
}
</script>
<style scoped>

</style>
