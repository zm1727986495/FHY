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
                            <el-table-column prop="customerName" align="center" label="商品名称" width="200" sortable></el-table-column>
                            <el-table-column prop="customerPhone" align="center" label="商品型号" width="200" sortable></el-table-column>
                            <el-table-column prop="otherPhone" align="center" label="商品材质" width="200" sortable></el-table-column>
                            <el-table-column prop="address" align="center" label="商品颜色" width="200" sortable></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="所属仓库" width="200" sortable></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="盘点单号" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="应盘数量" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="实盘数量" width="200">
                                <template slot-scope="scope">
                                    <div>
                                        <el-input size="medium" v-model="scope.row.orderStatus"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="差异" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="货区货位" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="盘点方式" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="状态" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="创建人" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="创建时间" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="orderStatus" align="center" label="盘点日期" width="200" show-overflow-tooltip></el-table-column>
                        </el-table>
                    </div>
                </div>

                <handlelist @handleclick="handleclicks">
                    <div class="titlecals">报损列表</div>
                </handlelist>
                <handlelist @handleclick="handleclicks">
                    <div class="titlecals">盘盈列表</div>
                </handlelist>
                <handlelist @handleclick="handleclicks">
                    <div class="titlecals">盘亏列表</div>
                </handlelist>
            </div>

            <div class="submibtnlist">
                <el-button type="primary" size="medium">打印</el-button>
                <el-button size="medium">返回</el-button>
            </div>

            <!-- 处理弹框 -->
            <el-dialog
                :visible.sync="handleswitchs"
                width="60%">
                <div class="titlecals">处理方式</div>
                <div class="order_table">
                    <el-table border
                        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                        <el-table-column prop="customerName" align="center" label="商品名称" width="200" sortable></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="入库单号" width="200" sortable></el-table-column>
                        <el-table-column prop="otherPhone" align="center" label="采购单号" width="200" sortable></el-table-column>
                        <el-table-column prop="address" align="center" label="商品编码" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="商品规格" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="商品类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="在库数量" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="盘点数量" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="差异" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="出库" width="200">
                            <template slot-scope="scope">
                                <div>
                                    <el-input size="medium" v-model="scope.row.orderStatus"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="报损" width="200">
                            <template slot-scope="scope">
                                <div>
                                    <el-input size="medium" v-model="scope.row.orderStatus"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 定责 -->
                <fixdutycom></fixdutycom>

                <div slot="footer" style="margin-top: 0px;">
                    <el-button type="primary" @click="handleswitchs = false">确 定</el-button>
                    <el-button @click="handleswitchs = false">取 消</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import fixdutycom from "@/views/components/fixdutycom";
import handlelist from "./compoents/handlelist";

export default {
    components: {
        breadcrumb,
        handlelist,
        fixdutycom,
    },
    data() {
        return {
            handleswitchs: false,
            navList: [],
            stateList: [],
            searchData: [],
            orderStatus: "",
            inpval: "",
            remarkval: "",
            resource: 1,
            tableData: [
                {
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
        }
    },
    // mounted() {
    //     this.navList = this.$route.meta;
    // },
    activated(){
        this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
        // 子组件处理按钮
        handleclicks(val){
            console.log(val,"1111");
            this.handleswitchs = true;
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
<style lang="scss">
.inventoryexport{
    font-size: 14px;
    .titlecals{
        top: 0;
    }
    .order_table{
        margin: 20px 0px;
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