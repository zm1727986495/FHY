<template>
    <div class="inventoryexport">
        <div class="head_nav" ref="topInfo">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <div>
                <el-form label-position="right" 
                    label-width="120px"
                    class="demoforminline">
                    <el-form-item label="盘点单号">pd21312312</el-form-item>
                    <el-form-item label="盘点类型">备货盘点</el-form-item>
                    <el-form-item label="盘点仓库">天津仓库</el-form-item>
                    <el-form-item label="盘点人">小李</el-form-item>
                    <el-form-item label="盘点时间">2019-01-01 12:12:12</el-form-item>
                    <el-form-item label="合同金额备注">12312312</el-form-item>
                </el-form>
                <div>
                    <div class="titlecals">盘点列表</div>
                    <div class="order_table">
                        <el-table border
                            ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                            :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                            <el-table-column prop="contractState" align="center" label="商品名称" width="200" sortable></el-table-column>
                            <el-table-column prop="factoryContractNo" align="center" label="商品型号" width="200" sortable></el-table-column>
                            <el-table-column prop="signingMode" align="center" label="商品材质" width="200" sortable></el-table-column>
                            <el-table-column prop="signingTime" align="center" label="商品颜色" width="200" sortable></el-table-column>
                            <el-table-column prop="signingName" align="center" label="所属仓库" width="200" sortable></el-table-column>
                            <el-table-column prop="surveyorName" align="center" label="盘点单号" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="designerName" align="center" label="应盘数量" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="customerName" align="center" label="差异" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="customerPhone" align="center" label="货区货位" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="customerPhone" align="center" label="盘点方式" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="customerPhone" align="center" label="状态" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="customerPhone" align="center" label="创建人" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="customerPhone" align="center" label="创建时间" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="customerPhone" align="center" label="盘点日期" width="200" show-overflow-tooltip></el-table-column>
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
            </div>

            <div class="submibtnlist">
                <el-button type="primary" size="medium">打印</el-button>
                <el-button size="medium">返回</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";

export default {
    components: {
        breadcrumb,
    },
    data() {
        return {
            navList: [],
            stateList: [],
            searchData: [],
            orderStatus: "",
            inpval: "",
            remarkval: "",
            resource: 1,
            tableData: [],
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
        }
    },
    mounted() {
        this.navList = this.$route.meta;
    },
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
    },
}
</script>
<style lang="scss">
.inventoryexport{
    font-size: 14px;
    .titlecals{
        top: 0;
    }
    .order_table{
        margin-top: 20px;
    }
    .newaddinvbtn{
        margin: 20px 0px;
        display: flex;
        align-items: center;
        .addshopinpbox{
            margin-right: 20px;
        }
    }
    .submibtnlist{
        margin-top: 20px;
        text-align: center;
    }
}
</style>