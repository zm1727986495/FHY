<template>
    <div>
        <div>
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-input size="medium" clearable placeholder="采购单号" @keyup.enter.native="search" v-model="params.purchaseNumber"></el-input>
                </el-col>
                <el-col :span="6"><el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button></el-col>
            </el-row>
        </div>
        <div class="m-top20">
            <el-table
                border
                :row-class-name="tableRowClassName"
                v-loading="tableObj.tabLoading"
                :data="tableObj.tableData">
                    <el-table-column width="250" show-overflow-tooltip prop="purchaseNumber" align="center" label="采购单号">
                    </el-table-column>
                    <el-table-column width="130" show-overflow-tooltip align="center" prop="contractSerialNumber" label="客户合同号"></el-table-column>
                    <el-table-column width="130" show-overflow-tooltip align="center" prop="purchaseType" label="采购单类型">
                    </el-table-column>
                    <el-table-column width="130" show-overflow-tooltip align="center" prop="orderGoodsType" label="采购货品类型">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.orderGoodsType==1?"成品":"订制品"}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" show-overflow-tooltip align="center" prop="settlementMoney" label="采购单结算金额">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.settlementMoney?scope.row.settlementMoney:"0.00"}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" show-overflow-tooltip align="center" prop="earning " label="加减收">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.earning?scope.row.earning:"0.00"}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" show-overflow-tooltip align="center" prop="extraEarning" label="额外加减收">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.extraEarning?scope.row.extraEarning:"0.00"}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" show-overflow-tooltip align="center" prop="supplierCostMoney" label="供货商成本"></el-table-column>
                    <el-table-column width="110" show-overflow-tooltip align="center" prop="customerName" label="客户名称"></el-table-column>
                    <el-table-column width="110" show-overflow-tooltip align="center" prop="customerPhone" label="客户手机号"></el-table-column>
                    <el-table-column width="150" show-overflow-tooltip align="center" prop="address" label="订单地址"></el-table-column>
                    <el-table-column width="90" show-overflow-tooltip align="center" prop="createAt" label="导入人"></el-table-column>
                    <el-table-column width="180" show-overflow-tooltip align="center" prop="createTime" label="导入时间"></el-table-column>
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
import { listFinanceDetail } from "@/api/FinanceCenter/statementReview/index"
export default {
    props:["tableObj","params"],
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            data:[
                {
                    data:1
                },
                {
                    data:2
                }
            ]
        }
    },
    methods: {
        search(){
            this.params.page=1;
            this.pages()
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        pages(){
            this.tableObj.tabLoading=true;
            listFinanceDetail(
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
