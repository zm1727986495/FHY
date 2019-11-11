<template>
    <div class="order_tables budget_tables">
        <el-table 
            border 
            ref="multipleTable" 
            :data="tableData" 
            tooltip-effect="dark" style="width: 100%"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="state" width="200" align="center" label="任务编号"></el-table-column>
            <el-table-column prop="number" width="200" align="center" label="任务上门时间"></el-table-column>
            <el-table-column prop="sourceNumber" width="200" align="center" label="来源" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type" width="200" align="center" label="合同号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="isTovoid" width="200" align="center" label="客户姓名" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="name" width="200" align="center" label="客户电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" align="center" label="备用电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="200" label="订单地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="200"  label="设计师" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="200"  label="上门备注" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="200"  label="派货数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="安装单类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="指派安装次数" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="400"  label="日志汇报人姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="200"  label="日志内容" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="预计安装日期" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="首次派工安装日期" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="产品品牌" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="产品类别" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="所属网点" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="安装图" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="合同金额" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="服务类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="spare" align="center" width="300"  label="派单员" show-overflow-tooltip></el-table-column>
        </el-table>
    </div> 
</template>
<script>
export default {
  
    data() {
        return {
            tableData: [],
            tableSelectList: [],
        }
    },
    methods: {
        handleSelectionChange(val){
            this.tableSelectList = val;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
    },
}
</script>
<style scoped>

</style>


