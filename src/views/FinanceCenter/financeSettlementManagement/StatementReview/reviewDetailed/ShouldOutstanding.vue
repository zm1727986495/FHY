<template>
    <div>
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
            <el-table-column align="center" width="100" prop="accountsStatus" label="结算状态">
                <template slot-scope="scope">
                    <div v-if="scope.row.accountsStatus==1">对账中</div>
                    <div v-if="scope.row.accountsStatus==2">对账完成</div>
                    <div v-if="scope.row.accountsStatus==3">结算中</div>
                    <div v-if="scope.row.accountsStatus==4">结算完成</div>
                </template>
            </el-table-column>
            <el-table-column align="center" width="80" prop="contrastResults" label="比对结果">
                <template slot-scope="scope">
                    <span v-if="scope.row.contrastResults==0">通过</span>
                    <span v-if="scope.row.contrastResults==1">金额不一致</span>
                    <span v-if="scope.row.contrastResults==2">无业务</span>
                    <span v-if="scope.row.contrastResults==3">无财务</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="80" prop="handleResults" label="所属">
                <template slot-scope="scope">
                    {{scope.row.handleResults==0?"业务":"财务"}}
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
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import { listUnfinishedDetail, listPurchasingSettlementDetail } from "@/api/FinanceCenter/statementReview/index";
export default {
    props:["tableObj", "params"],
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            spot:spot,
        }
    },
    methods: {
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

