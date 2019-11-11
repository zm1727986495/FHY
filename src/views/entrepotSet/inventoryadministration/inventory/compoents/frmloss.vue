<template>
    <div class="frmloss">
        <div class="iconBox m-bottom">
            <i class="Icon"></i>
            <span>报损列表</span>
        </div>
        <div class="order_table">
            <el-table border
                ref="multipleTable" :data="tableDatabs" tooltip-effect="dark" style="width: 100%"
                :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
                <el-table-column prop="contractState" align="center" label="订单号" width="200" sortable></el-table-column>
                <el-table-column prop="customerName" align="center" label="采购合同号" width="200" sortable></el-table-column>
                <el-table-column prop="signingMode" align="center" label="到货单号" width="200" sortable></el-table-column>
                <el-table-column prop="signingTime" align="center" label="商品型号" width="200" sortable></el-table-column>
                <el-table-column prop="surveyorName" align="center" label="商品名称" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="designerName" align="center" label="商品材质" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerName" align="center" label="商品颜色" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="报损数量" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="货位" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="备注" width="200">
                    <template slot-scope="scope">
                        <div>
                            <el-input size="medium" v-model="scope.row.customerPhone"></el-input>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination_wrap">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 30, 40]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
            tableSelectList: [], // 当前页
        }
    },
    props: ["tableDatabs"],
    methods: {
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun(data);
        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            let data = {
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun(data);
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList,"tableSelectList1234");
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    }
};
</script>
<style lang="scss" scoped>
.frmloss{
    
}
</style>
