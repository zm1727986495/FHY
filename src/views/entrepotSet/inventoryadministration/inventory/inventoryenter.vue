<template>
    <!-- 结果录入 -->
    <div class="inventoryenter">
        <div class="head_nav" ref="topInfo">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>

        <el-tabs type="border-card">
            <inventoryquery></inventoryquery>
            <el-tab-pane label="待盘点">
                <div class="order-btn-list">
                    <el-button size="small" class="button-96" @click="invenexport">导出</el-button>
                    <el-button size="small" class="button-96" @click="addinventory">新增</el-button>
                    <el-button size="small" class="button-96">定责</el-button>
                    <el-button size="small" class="button-96" @click="baosfun">报损</el-button>
                    <el-button size="small" class="button-96" @click="chulfun">处理</el-button>
                </div>
                <div class="order_table">
                    <el-table border
                        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
                        <el-table-column prop="contractState" align="center" label="盘点单号" width="200" sortable></el-table-column>
                        <el-table-column prop="factoryContractNo" align="center" label="所属仓库" width="200" sortable></el-table-column>
                        <el-table-column prop="signingMode" align="center" label="状态" width="200" sortable></el-table-column>
                        <el-table-column prop="signingTime" align="center" label="盘点日期" width="200" sortable></el-table-column>
                        <el-table-column prop="signingName" align="center" label="应盘数量" width="200" sortable></el-table-column>
                        <el-table-column prop="surveyorName" align="center" label="盘点类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="designerName" align="center" label="盘点人" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="创建人" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="创建时间" width="200" show-overflow-tooltip></el-table-column>
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

                <frmloss v-if="tableDatabs.length !== 0" :tableDatabs="tableDatabs"></frmloss>

            </el-tab-pane>
            <el-tab-pane label="盘点完成">
                <div class="order-btn-list">
                    <el-button size="small" class="button-96" @click="invenexport">导出</el-button>
                    <el-button size="small" class="button-96">定责</el-button>
                    <el-button size="small" class="button-96" @click="baosfun">报损</el-button>
                    <el-button size="small" class="button-96" @click="chulfun">处理</el-button>
                </div>
                <div class="order_table">
                    <el-table border
                        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
                        <el-table-column prop="contractState" align="center" label="操作" width="200" sortable></el-table-column>
                        <el-table-column prop="factoryContractNo" align="center" label="仓库" width="200" sortable></el-table-column>
                        <el-table-column prop="signingMode" align="center" label="状态" width="200" sortable></el-table-column>
                        <el-table-column prop="signingTime" align="center" label="盘点单号" width="200" sortable></el-table-column>
                        <el-table-column prop="signingName" align="center" label="盘点类型" width="200" sortable></el-table-column>
                        <el-table-column prop="surveyorName" align="center" label="盘点人" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="创建人" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="创建时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="盘点时间" width="200" show-overflow-tooltip></el-table-column>
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

                <frmloss v-if="tableDatabs.length !== 0" :tableDatabs="tableDatabs"></frmloss>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import breadcrumb from "../../../components/breadcrumb";
import inventoryquery from "./compoents/inventoryquery";
import frmloss from "./compoents/frmloss";
export default {
    components: {
        breadcrumb,
        inventoryquery,
        frmloss,//报损列表组件
    },
    data() {
        return {
            navList: [],
            tableDatabs: [],
            tableData:[
                {
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },
            ],
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
            tableSelectList: [], // 当前页
        };
    },
    mounted() {
        this.navList = this.$route.meta;
    },
    methods: {
        // 处理按钮
        chulfun(){
            this.$router.push({path: "/inventoryadministration/handleinventory"})
        },
        baosfun(){
            this.tableDatabs = this.tableSelectList;
        },
        addinventory(){
            this.$router.push({path: "newaddinventory"})
        },
        // 盘点导出
        invenexport(){
            this.$router.push({path: "/inventoryadministration/inventoryexport"})
        },
        // 录入结果
        enterinven(){
            this.$router.push({path: "/inventoryadministration/inventoryenter"})
        },
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
<style lang="scss" scoped>
.inventoryenter{

    .titlecals{
        top: 0;
    }
    .order_table{
        margin-top: 20px;
    }
}
</style>
