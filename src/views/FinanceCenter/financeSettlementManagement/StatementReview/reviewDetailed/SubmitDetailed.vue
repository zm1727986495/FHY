<template>
    <div>
        <el-button size="small" class="button-96" @click="exportExcel">导出</el-button>
        <el-button size="small" class="button-96" @click="toMatch">重新匹配</el-button>
        <div class="m-top20">
            <el-table
                border
                :row-class-name="tableRowClassName"
                v-loading="tableObj.tabLoading"
                ref="table"
                :data="tableObj.tableData">
                <el-table-column align="center" width="180" prop="purchaseNumber" label="采购单">
                    <!-- <template slot-scope="scope">
                        <div>
                            <el-tooltip placement="right" visible-arrow v-if="scope.row.contrastResults==1">
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" @click="editMoney(scope.row)">编辑结算金额</p>
                                </div>
                            </el-tooltip>
                            <span>{{scope.row.purchaseNumber}}</span>
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column align="center" width="80" prop="contrastResults" label="比对结果">
                    <template slot-scope="scope">
                        <span v-if="scope.row.contrastResults==0">通过</span>
                        <span v-if="scope.row.contrastResults==1">金额不一致</span>
                        <span v-if="scope.row.contrastResults==2">无业务</span>
                        <span v-if="scope.row.contrastResults==3">无财务</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" width="180" prop="dataType" label="所属">
                    <template slot-scope="scope">
                        {{scope.row.dataType==0?"业务":"财务"}}
                    </template>
                </el-table-column> -->
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
                <el-table-column align="center" width="180" prop="feeMonth" label="总额">
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
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import { listBusinessDetail, listPurchasingSettlementDetail, editDetailsCharges } from "@/api/FinanceCenter/statementReview/index";
import { getToken } from 'utils/auth';// 登录Token
import module from '../../../../../../config/index';
export default {
    props:["tableObj","params"],
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{

        }
    },
    methods: {
        toMatch(){
            if(this.tableObj.tableData.length){
                editDetailsCharges({
                    purchasingSettlementId:this.$route.query.purchasingSettlementId,
                    feeMonth:this.$route.query.feeMonth,
                    contrastResults:2
                }).then(res=>{
                    this.$message.success('匹配成功')
                    this.pages()
                })
            }else{
                this.$message.warning('没有数据，无法匹配')
            }
        },
        exportExcel(){
            let paramsStr = '';
            for (let keys in this.params){
                paramsStr += (keys + '=' + this.params[keys] + '&');
            }
            window.location.href=module.dev.proxyTable['/api'].target+"/api/pc/purchasingSettlement/exportListPurchasingSettlementDetail?token="+getToken()+'&'+paramsStr;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        pages(){
            this.tableObj.tabLoading=true;
            listPurchasingSettlementDetail(
                this.params
            ).then(res=>{
                this.tableObj.tableData=res.data.rows;
                this.tableObj.total=res.data.total;
                this.tableObj.tabLoading=false;
            })
        },
        currentChange(val) {
            this.params.page = val;
            this.pages()
        },
        sizeChange(val) {
            this.params.page = 1;
            this.params.limit = val;
            this.pages()
        },
    },
}
</script>
<style scoped>

</style>
