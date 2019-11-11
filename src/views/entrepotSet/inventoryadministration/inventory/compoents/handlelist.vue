<template>
    <div class="handlelist">
        <div class="titflex">
            <!-- <div class="titlecals">报损列表</div> -->
            <slot></slot>
            <el-button type="primary" size="mini" @click="handleclick">处理</el-button>
        </div>
        <div class="order_table">
            <el-table border
                ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
                <el-table-column prop="customerName" align="center" label="货区货位" width="200" sortable></el-table-column>
                <el-table-column prop="customerName" align="center" label="商品名称" width="200" sortable></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="商品型号" width="200" sortable></el-table-column>
                <el-table-column prop="otherPhone" align="center" label="商品材质" width="200" sortable></el-table-column>
                <el-table-column prop="address" align="center" label="商品颜色" width="200" sortable></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="入库单号" width="200" sortable></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="盘点单号" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="采购单号" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="库存属性" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="商品类型" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="计量单位" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="应盘数量" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="盘点数量" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="差异" width="200" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
        <div class="pagination_wrap" v-if="pageswitch">
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
            pageswitch: false,
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
            tableSelectList: [], // 当前页
            tableData: [
                {
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },
            ],
        }
    },
    // props: ["tableDatabs"],
    methods: {
        handleclick(){
            if(this.changefun()){
                this.$emit("handleclick", this.tableSelectList)
            }

        },
        changefun(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个订单 新增预算清单',
                    type: 'warning'
                });
                return false;
            } else if (this.tableSelectList.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
                return false;
            } else {
                return true;
            }
        },
        //分页函数回调
        handleCurrentChange(val) {
            // val为当前页数
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
.handlelist{
    .titflex{
        display: flex;
        align-items: center;
    }
}
</style>
