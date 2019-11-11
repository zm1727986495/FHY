<template>
    <div>
        <div class="m-top20">
            <el-table
            border
            :data="tableData"
            :row-class-name="tableRowClassName"
            >
                <el-table-column fixed show-overflow-tooltip align="center" width="180" prop="settlementNumber" label="结算单号">
                    <template slot-scope="scope">
                        <span class="table_action_span" style="padding-left:15px" @click="jumpSettlementNumber(scope.row)">{{scope.row.settlementNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="examineName" label="审核人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="examineTime" label="审核时间"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" prop="bookkeepingName" label="记账人"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" prop="bookkeepingTime" label="记账时间"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" width="180" prop="accountingMonth" label="记账月份"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="unprocessedData" label="未确认数量">
                    <template slot-scope="scope">
                        <el-popover
                        placement="bottom-start"
                        width="400"
                        trigger="click">
                            <div style="display:inline-block">
                                未处理 12 条
                            </div>
                            <div style="display:inline-block;float:right">
                                共 27 条数据
                            </div>
                            <el-table :data="tableData2" border :row-class-name="tableRowClassName">
                                <el-table-column show-overflow-tooltip align="center" property="user" label="确认人"></el-table-column>
                                <el-table-column show-overflow-tooltip align="center" property="tel" label="联系方式"></el-table-column>
                                <el-table-column show-overflow-tooltip align="center" property="processed" label="已处理/未处理"></el-table-column>
                            </el-table>
                            <p slot="reference" style="color:red;cursor: pointer">{{scope.row.unprocessedData}}</p>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="230" align="center" prop="companyName" label="付款方"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="storeName" label="所属门店"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="receivablesTypeName" label="收款方式"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="bankCardNumber" label="收款账号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="amountSum" label="合同合计金额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="countOrder" label="结算订单数"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="actualSettlementAmount" label="实际结算金额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="settlementAmount" label="应结算金额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="totalCost" label="费用总额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createAt" label="创建人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createTime" label="创建时间"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
export default {
    props:["tableData"],
    components:{
        pagination
    },
    data(){
        return{
            spot,
            tableData2:[]
        }
    },
    methods: {
        jumpSettlementNumber(val){
            this.$router.push({
                path:"audit",
                query:{
                    bmcSettlementId:val.bmcSettlementId,
                    onlyReady:true
                }
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.currentPage = val;
        //   this.getListData();
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        //   this.getListData();
        },
    },
}
</script>
<style scoped>

</style>
