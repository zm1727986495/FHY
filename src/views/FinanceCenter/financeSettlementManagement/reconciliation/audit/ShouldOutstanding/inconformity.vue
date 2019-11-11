<template>
    <div>
        <el-table
        border
        :row-class-name="tableRowClassName"
        :data="data">
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="无法确认原因"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="财务确认人"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="财务确认时间"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="建材城收据号"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="订单编号"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="所属门店"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="实际收款展位"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="客户名称"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="订单类型"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="内部收据号"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="付款方式"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="应收金额"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="实际结算金额"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="刷卡手续费"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="实际收款时间"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="收款时间"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="导购"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="data" label="设计师"></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
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
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
    },
}
</script>
<style scoped>

</style>
