<template>
    <div>
        <!-- <div class="clearfloat">
            <el-row :gutter="10">
                <el-col :span="6"><el-input clearable size="medium" @keyup.enter.native="search" placeholder="采购单号" v-model="formList.purchaseNumber"></el-input></el-col>
                <el-col :span="6"><el-button size="medium" class="button-fc" @click="search">查询</el-button>
                <el-upload
                        action="/api/pc/purchasingSettlement/importPurchasingSettlement"
                        class="upload-demo"
                        multiple
                        :headers="headers"
                        :data="costParams"
                        :show-file-list="false"
                        :before-upload="beforeUploat"
                        :on-success="uploadSuccess"
                        :on-error="onError"
                        style="display:inline-block;margin-right:10px"
                        >
                        <el-button class="button-96" size="medium">导入成本</el-button>
                    </el-upload></el-col>
            </el-row>
        </div> -->
        <div>
            <div>
                <el-button size="small" class="button-96" @click="busOrFin(2)">保留财务</el-button>
                <el-button size="small" class="button-96" @click="busOrFin(1)">保留业务</el-button>
                <el-button size="small" class="button-96" @click="toMatch">重新匹配</el-button>
                <!-- <el-button size="small" class="button-96" @click="busOrFin(3)">保留对账</el-button> -->
                <el-button size="small" class="button-96" @click="exportExcel">导出</el-button>
                
            </div>
            <div class="m-top20">
                <el-table
                    border
                    :span-method="spanMethodByHouse"
                    :row-class-name="tableRowClassName"
                    @selection-change="selectChange"
                    v-loading="tableObj.tabLoading"
                    ref="table"
                    :data="tableObj.tableData">
                    <el-table-column type="selection" align="center" fixed></el-table-column>
                    <el-table-column align="center" width="180" prop="purchaseNumber" label="采购单">
                        <template slot-scope="scope">
                            <div>
                                <!-- <el-tooltip placement="right" visible-arrow v-if="scope.row.contrastResults==1">
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="editMoney(scope.row)">编辑结算金额</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip> -->
                                <span>{{scope.row.purchaseNumber}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="130" prop="feeMonth" label="结算状态">
                        <template slot-scope="scope">
                            <div v-if="scope.row.accountsStatus==1||!scope.row.accountsStatus">对账中</div>
                            <div v-if="scope.row.accountsStatus==2">对账完成</div>
                            <div v-if="scope.row.accountsStatus==3">结算中</div>
                            <div v-if="scope.row.accountsStatus==4">结算完成</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="150" prop="contrastResults" label="比对结果">
                        <template slot-scope="scope">
                            <span v-if="scope.row.contrastResults==0">通过</span>
                            <span v-if="scope.row.contrastResults==1">金额不一致</span>
                            <span v-if="scope.row.contrastResults==2">无业务</span>
                            <span v-if="scope.row.contrastResults==3">无财务</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="180" prop="balance" label="差额">
                        <template slot-scope="scope">
                            <div>
                                {{
                                    setTimeOut(scope)
                                }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="100" prop="dataType" label="所属">
                        <template slot-scope="scope">
                            <div v-if="scope.row.dataType==0">
                                业务
                            </div>
                            <div v-else-if="scope.row.dataType==1">
                                财务
                            </div>
                            <div v-else>
                                无
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="180" prop="settlementAmount" label="结算金额">
                        <template slot-scope="scope">
                            <div v-if="scope.row.dataType==0">
                                {{scope.row.settlementAmount}}
                            </div>
                            <div v-else>
                                {{scope.row.settlementAmountNew?scope.row.settlementAmountNew:scope.row.settlementAmount}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="180" prop="asAmount" label="加减收金额">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.asAmount?scope.row.asAmount:"0.00"}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="180" prop="additionalAsAmount" label="额外加减收金额">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.additionalAsAmount?scope.row.additionalAsAmount:"0.00"}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="180" prop="feeMonth" label="总金额">
                        <template slot-scope="scope">
                            <div v-if="scope.row.dataType==0">
                                {{
                                    (Number(scope.row.settlementAmount)+Number(scope.row.asAmount)+Number(scope.row.additionalAsAmount)).toFixed(2)
                                }}
                            </div>
                            <div v-else>
                                {{
                                    (Number(scope.row.settlementAmountNew?scope.row.settlementAmountNew:scope.row.settlementAmount)+Number(scope.row.asAmount)+Number(scope.row.additionalAsAmount)).toFixed(2)
                                }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="180" prop="feeMonth" label="所属月份"></el-table-column>
                    <el-table-column align="center" width="180" prop="createTime" label="导入时间"></el-table-column>
                    <el-table-column align="center" width="180" prop="createAt" label="导入人"></el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
                <pagination
                    :current-page="params.page"
                    :pageSize="params.limit"
                    :total="tableObj.total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                </pagination>
            </div>
        </div>
        <!-- <el-dialog :visible.sync="dialog" title="编辑结算金额" custom-class="customDialogTitle">
            <div class="queryForm">
                <el-form inline>
                        <el-form-item label="实际结算金额">
                            <el-input v-model="editRowsMoney.settledAmount"></el-input>
                        </el-form-item>
                </el-form>
                <el-table 
                :data="dialogTableData" 
                border
                :row-class-name="tableRowClassName">
                    <el-table-column show-overflow-tooltip align="center" prop="settlementAmount" label="结算金额/元"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="changeAt" label="结算人"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="changeTime" label="结算时间"></el-table-column>
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
        </el-dialog> -->
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import { editDetailsCharges, listPurchasingSettlementDetail, retainReconciliation, listSettlementAmountByPage, editSettlementAmount } from "@/api/FinanceCenter/statementReview/index";
import { getToken } from 'utils/auth';// 登录Token
import module from '../../../../../../config/index';
export default {
    props:["tableObj","status",'params'],
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            radio:"0",
            total:10,
            spot,
            spanArr:[],
            pos:0,
            headers: {
                Authorization: getToken(),
                // contentType:"application/x-www-form-urlencoded; charset=UTF-8"
            },
            rowsData:[],
            dialog:false,
            dialogTotal:10,
            dialogParams:{
                page:1,
                limit:10,
            },
            costParams:{
                purchasingSettlementId:'',
                feeMonth:'',
            },
            money:'',
            editRowsMoney:{
                settledAmount:'',
            },
            dialogTableData:[],
            moneyParams:{
                purchasingSettlementReconciliationId:'',
                page:1,
                limit:10,
            },
            setTimeOut(scope){
                let str=0
                if(scope.$index+1!=this.tableObj.tableData.length){
                    str=(Number(
                            this.tableObj.tableData[scope.$index+1].settlementAmountNew?
                            this.tableObj.tableData[scope.$index+1].settlementAmountNew:
                            this.tableObj.tableData[scope.$index+1].settlementAmount
                        )
                        +
                        Number(this.tableObj.tableData[scope.$index+1].asAmount)
                        +
                        Number(this.tableObj.tableData[scope.$index+1].additionalAsAmount)
                        -
                        scope.row.settlementAmount
                        -
                        scope.row.asAmount
                        -
                        scope.row.additionalAsAmount).toFixed(2)
                }
                return str
            }
        }
    },
    watch: {
        status(val){
            this.pages()
        }
    },
    methods: {
        toMatch(){
            if(this.tableObj.tableData.length){
                editDetailsCharges({
                    purchasingSettlementId:this.$route.query.purchasingSettlementId,
                    feeMonth:this.$route.query.feeMonth,
                    contrastResults:1
                }).then(res=>{
                    this.$message.success('匹配成功')
                    this.pages()
                })
            }else{
                this.$message.warning('没有数据，无法匹配')
            }
            
        },
        click(val){
            console.log(val)
        },
        // onError(val){
        //     this.$message.error("导入失败")
        // },
        // beforeUploat(val){
        //     this.costParams.purchasingSettlementId=this.$route.query.purchasingSettlementId;
        //     this.costParams.feeMonth=this.tableObj.feeMonth;
        //     return true
        // },
        // uploadSuccess(val){
        //     this.pages()
        //     this.$message({
        //         message: '导入成功',
        //         type: 'success'
        //     });
        // },
        exportExcel(){
            let paramsStr = '';
            for (let keys in this.params){
                paramsStr += (keys + '=' + this.params[keys] + '&');
            }
            window.location.href=module.dev.proxyTable['/api'].target+"/api/pc/purchasingSettlement/exportListPurchasingSettlementDetail?token="+getToken()+'&'+paramsStr;
            
        },
        editConfirm(){
            editSettlementAmount(
                {
                    purchasingSettlementReconciliationId:this.moneyParams.purchasingSettlementReconciliationId,
                    settlementAmount:Number(this.editRowsMoney.settledAmount)
                }
            ).then(res=>{
                this.dialog=false;
                this.pages()
            })
        },
        dialogSize(val){
            this.moneyParams.page=1;
            this.moneyParams.limit=val;
            this.moneyPage()
        },
        dialogChange(val){
            this.moneyParams.page=val;
            this.moneyPage()
        },
        moneyPage(){
            listSettlementAmountByPage(
                this.moneyParams
            ).then(res=>{
                this.dialogTableData=res.data.rows;
            })
        },
        editMoney(val){
            this.dialog=true;
            this.moneyParams.purchasingSettlementReconciliationId=val.purchasingSettlementReconciliationId;
            this.editRowsMoney.settlementAmount=Number(val.settlementAmount);
            this.moneyPage()
        },
        selectChange(val){
            this.rowsData=val;
        },
        busOrFin(val){
            if(this.rowsData.length){
                    let arr=[];
                    this.rowsData.map((item,idx)=>{
                        arr.push(item.purchasingSettlementReconciliationId)
                    })
                    retainReconciliation({
                        purchasingSettlementReconciliationIds:arr,
                        dataType:val
                    }).then(res=>{
                        this.pages()
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                    })
            }else{
                this.$message({
                    message: '请选择',
                    type: 'warning'
                });
            }
            
        },
        search(){
            this.pages()
        },
        pages(){
            this.tableObj.tabLoading=true;
            listPurchasingSettlementDetail(
                this.params
            ).then(res=>{
                this.tableObj.tableData=res.data.rows;
                this.tableObj.total=res.data.total;
                this.getSpanArr(this.tableObj.tableData)
                this.tableObj.tabLoading=false;
            })
        },
        sizeChange(val){
            this.params.page=1;
            this.params.limit=val;
            this.pages()
        },
        currentChange(val){
            this.params.page=val;
            this.pages()
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        
        // 计算跨列（按房源）
        spanMethodByHouse({ row, column, rowIndex, columnIndex }){
            if(columnIndex <= 4){
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        getSpanArr(data){
            this.spanArr = [];
            for (var i = 0; i < data.length; i++){
                if(i === 0){
                    this.spanArr.push(1);
                    this.pos = 0;
                }else{
                    if (data[i].purchasingSettlementReconciliationId === data[i - 1].purchasingSettlementReconciliationId){
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    }else{
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
    },
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
</style>
