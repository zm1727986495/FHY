<template>
    <div class="unsortable">
        <el-table
        border
        :row-class-name="tableRowClassName"
        :data="tableData">
            <el-table-column show-overflow-tooltip width="180" align="center" prop="settlementNumber" label="结算单号"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="companyName" label="付款方"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="storeName" label="结算门店"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="receivablesTypeName" label="收款方式"></el-table-column>
<!--            <el-table-column show-overflow-tooltip width="200" align="center" prop="bankCardNumber" label="收款账号"></el-table-column>-->
<!--            <el-table-column show-overflow-tooltip width="200" align="center" prop="amountSum" label="合同合计金额"></el-table-column>-->
            <el-table-column show-overflow-tooltip width="200" align="center" prop="countOrder" label="结算明细数量"></el-table-column>
<!--            <el-table-column show-overflow-tooltip width="200" align="center" prop="actualSettlementAmount" label="实际结算金额"></el-table-column>-->
            <el-table-column show-overflow-tooltip width="200" align="center" prop="totalCost" label="应付费用总额"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="createName" label="创建人"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="createTime" label="创建时间"></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props:["tableData"],
    data(){
        return{
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
    },
}
</script>
<style scoped>

</style>
