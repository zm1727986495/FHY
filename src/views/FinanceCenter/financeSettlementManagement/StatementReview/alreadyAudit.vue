<template>
    <div>
        <div class="m-top20">
            <el-table
            border
            :data="tableData"
            :row-class-name="tableRowClassName"
            >
                <el-table-column show-overflow-tooltip width="180" align="center" prop="purchasingSettlementNumber" label="结算单号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="purchasingSettlementName" label="结算单名称"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="feeMonth" label="费用月份"></el-table-column>
                <!-- <el-table-column show-overflow-tooltip width="180" align="center" prop="companyName" label="供货商"></el-table-column> -->
                <el-table-column show-overflow-tooltip width="180" align="center" prop="dataSize" label="结算单数"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="settlementAmount" label="结算金额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="additionalAsAmount" label="额外加减收金额"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="asAmount" label="加减收合计"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createAt" label="提交人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createTime" label="提交时间"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="updateAt" label="审核人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="updateTime" label="审核时间"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
export default {
    props:["tableData"],
    data(){
        return{
            spot,
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
