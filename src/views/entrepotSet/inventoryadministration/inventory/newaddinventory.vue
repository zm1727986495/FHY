<template>
    <div class="newaddinventory">
        <div class="head_nav" ref="topInfo">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <div class="titlecals">新增盘点单</div>
            <div>
                <el-form label-position="right" 
                    label-width="120px"
                    class="demoforminline">
                    <el-form-item label="盘点单号">pd21312312</el-form-item>
                    <el-form-item label="盘点类型">
                        <el-radio-group v-model="resource">
                            <el-radio :label="1">备货盘点</el-radio>
                            <el-radio :label="2">订单盘点</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="盘点仓库">
                        <el-select v-model="orderStatus" placeholder="选择盘点仓库" size="medium">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="盘点人">
                        <el-select v-model="orderStatus" placeholder="选择盘点仓库" size="medium">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="盘点时间">
                        <el-date-picker
                            size="medium" v-model="searchData" type="daterange" 
                            value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss' 
                            range-separator="-"
                            start-placeholder="年/月/日" end-placeholder="年/月/日">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="合同金额备注" required class="widmax">
                        <el-input type="textarea" size="medium" v-model="remarkval"></el-input>
                    </el-form-item>
                </el-form>
                
                <div v-if="resource === 1">
                    <div class="newaddinvbtn">
                        <div>添加商品： </div>
                        <div class="addshopinpbox">
                            <el-input size="medium" v-model="remarkval"></el-input>
                        </div>
                        <el-button size="small" class="button-96">撤销</el-button>
                        <el-button size="small" class="button-96">全部商品</el-button>
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
                </div>
                <div v-if="resource === 2">
                    <div class="newaddinvbtn">
                        <div>添加订单： </div>
                        <div class="addshopinpbox">
                            <el-input size="medium" v-model="remarkval"></el-input>
                        </div>
                        <el-button size="small" class="button-96">撤销</el-button>
                        <el-button size="small" class="button-96">全部订单</el-button>
                    </div>
                    <div class="order_table">
                        <el-table border
                            ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                            :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" fixed align="center" width="55"></el-table-column>
                            <el-table-column prop="contractState" align="center" label="订单号" width="200" sortable></el-table-column>
                            <el-table-column prop="factoryContractNo" align="center" label="所属仓库" width="200" sortable></el-table-column>
                            <el-table-column prop="signingMode" align="center" label="采购合同号" width="200" sortable></el-table-column>
                            <el-table-column prop="signingTime" align="center" label="品类" width="200" sortable></el-table-column>
                            <el-table-column prop="signingName" align="center" label="数量" width="200" sortable></el-table-column>
                            <el-table-column prop="surveyorName" align="center" label="名称" width="200" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="designerName" align="center" label="货区货位" width="200" show-overflow-tooltip></el-table-column>
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
                <el-button type="primary" size="medium">生成盘点单</el-button>
                <el-button size="medium">取消</el-button>
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
.newaddinventory{
    font-size: 14px;
    .titlecals{
        top: 0;
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