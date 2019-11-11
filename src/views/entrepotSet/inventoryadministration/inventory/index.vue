<template>
    <div class="inventory">
        <div class="head_nav" ref="topInfo">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>

        <el-tabs type="border-card">
            <inventoryquery></inventoryquery>
            <div class="h-width"></div>
            <el-tab-pane label="待盘点">
                <div class="order-btn-list">
                    <el-button size="small" class="button-96" @click="invenexport">导出</el-button>
                    <el-button size="small" class="button-96" @click="addinventory">新增</el-button>
                    <el-button size="small" class="button-96" @click="enterinven">录入结果</el-button>
                    <el-button size="small" class="button-96">定责</el-button>
                    <el-button size="small" class="button-96" @click="baosfun">报损</el-button>
                    <el-button size="small" class="button-96" @click="chulfun">处理</el-button>
                </div>
                <div class="order_table">
                    <el-table border
                        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
                        <el-table-column prop="blitemCode" align="center" label="盘点单号" width="200" sortable></el-table-column>
                        <el-table-column prop="storageName" align="center" label="所属仓库" width="200" sortable></el-table-column>
                        <el-table-column prop="status" align="center" label="状态" width="200" sortable>
                            <template slot-scope="scope">
                                <div>
                                    <!-- //盘点状态//1待盘点 2盘点中 3盘点完成 -->
                                    <p v-if="scope.row.status == 1">待盘点</p>
                                    <p v-if="scope.row.status == 2">盘点中</p>
                                    <p v-if="scope.row.status == 3">盘点完成</p>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="blitemDate" align="center" label="盘点日期" width="200" sortable></el-table-column> -->
                        <el-table-column prop="shouldBlitemAmount" align="center" label="应盘数量" width="200" sortable></el-table-column>
                        <el-table-column prop="blitemType" align="center" label="盘点类型" width="200" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>
                                    <!-- //盘点类型 1.备货，2.订单 -->
                                    <p v-if="scope.row.status == 1">备货</p>
                                    <p v-if="scope.row.status == 2">订单</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="blitemName" align="center" label="盘点人" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="userName" align="center" label="创建人" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createTime" align="center" label="创建时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="盘点时间" width="200" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <div class="pagination_wrap">
                    <pagination
                        :current-page="currentPage"
                        :pageSize="pageSize"
                        :total="total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                    </pagination>
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
                <!-- 分页 -->
                <div class="pagination_wrap">
                    <pagination
                        :current-page="currentPage"
                        :pageSize="pageSize"
                        :total="total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                    </pagination>
                </div>

                <frmloss v-if="tableDatabs.length !== 0" :tableDatabs="tableDatabs"></frmloss>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import inventoryquery from "./compoents/inventoryquery";
import frmloss from "./compoents/frmloss";
export default {
    components: {
        breadcrumb,
        pagination,
        inventoryquery,
        frmloss,//报损列表组件
    },
    data() {
        return {
            navList: [],
            tableData: [
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
            tableDatabs: [],
            tableSelectList: [],
            // 分页
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
        };
    },
    mounted() {
        this.navList = this.$route.meta;
    },
    methods: {
        // 盘点导出
        invenexport(){
            this.$router.push({path: "/inventoryadministration/inventoryexport"})
        },
        baosfun(){
            this.tableDatabs = this.tableSelectList;
        },
        // 处理按钮
        chulfun(){
            this.$router.push({path: "/inventoryadministration/handleinventory"})
        },
        // 新增盘点
        addinventory(){
            this.$router.push({path: "/inventoryadministration/newaddinventory"})
        },
        // 录入结果
        enterinven(){
            this.$router.push({path: "/inventoryadministration/inventoryenter"})
        },
        // 分页函数回调
        currentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.getList(data);
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
.inventory{

    .order_table{
        margin-top: 20px;
    }
}
</style>
