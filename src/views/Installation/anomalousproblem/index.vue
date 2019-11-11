<template>
    <div class="anomalousproblem">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div>
                        <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50"></el-input>
                    </div>
                    <div>
                        <el-date-picker
                            size="medium" v-model="searchData" type="daterange"
                            value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss'
                            range-separator="-"
                            start-placeholder="选择创建订单时间" end-placeholder="选择创建订单时间">
                        </el-date-picker>
                    </div>
                    <div>
                        <el-select v-model="orderStatus" placeholder="异常单来源" size="medium">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-button @click="searchFun" class="button-fc" type="warning" size="medium">查询</el-button>
                        <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="h-width"></div>
            <!-- 切换待处理 -->
            <el-tab-pane label="待处理" name="first">
                <div class="order-btn-list">
                    <el-button size="small" class="button-96" @click="invitation">导出</el-button>
                    <el-button size="small" class="button-96" @click="deletefun">作废</el-button>
                </div>
                <div class="order_table">
                    <el-table border
                        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="操作" width="200" sortable>
                            <template slot-scope="scope">
                                <div class="tablebox table_action_span" @click="tolocotion">{{scope.row.orderStatus}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="异常单号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="状态" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="发起部门" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="发起人" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="客户合同号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="类型/来源" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="来源单号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="生成时间" width="200" sortable></el-table-column>
                        <el-table-column prop="customerName" align="center" label="异常类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="订单号类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="otherPhone" align="center" label="订单类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="产品类别" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="订单号" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="备用电话" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="备用地址" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="设计师" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="销售员" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="所属机构" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="业务员" width="200" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <!-- 切换已完成 -->
            <el-tab-pane label="已完成" name="second">
                <div class="order-btn-list">
                    <el-button size="small" class="button-96" @click="invitation">导出</el-button>
                </div>
                <div class="order_table">
                    <el-table border
                        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="操作" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="异常单号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="状态" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="发起部门" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="发起人" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="客户合同号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="类型/来源" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="来源单号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="生成时间" width="200" sortable></el-table-column>
                        <el-table-column prop="customerName" align="center" label="异常类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="订单号类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="otherPhone" align="center" label="订单类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="产品类别" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="订单号" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="备用电话" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="备用地址" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="设计师" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="销售员" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="所属机构" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="业务员" width="200" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>

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
        </el-tabs>

        <!-- 查看附件 -->
        <el-dialog center
            :visible.sync="dialogVisible"
            width="500px">
            <div class="titlecals">作废</div>
            <div class="zuopclas">确定作废？</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import breadcrumb from "../../components/breadcrumb";

export default {
    components: {
        breadcrumb,
    },
    data(){
        return {
            dialogVisible: false,
            activeName: 'first',
            navList: [],
            names: '', // 条件搜索
            searchData: [],// 时间搜索
            orderStatus: "", // 状态搜索
            stateList: "",  // 状态条件
            tableData:[{
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
                },{
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
            tableSelectList: [],
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
        }
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
            return (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',')
        }
    },
    activated(){
        // 头部面包屑
        this.navList=this.$route.meta;

        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.orderdatafun(data);
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     // 头部面包屑
    //     this.navList=this.$route.meta;
    // },
    // created() {
    //     let data = {
    //         page: this.currentPage,
    //         limit: this.pageSize,
    //     };
    //     this.orderdatafun(data);

    // },
    methods: {
        tolocotion(){
            this.$router.push({path: "/Installation/exceptiondetails"})
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        invitation(){
            if (this.tableSelectList.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
            }else{
                // this.dialogVisible = true;
            }
        },
        deletefun(){
            if(this.changefun()){
                this.dialogVisible = true;
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
        orderdatafun(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
        searchFun(){    //搜索
            let data = {
                name: this.names,
                createTimeStart: this.searchData[0],
                createTimeEnd: this.searchData[1],
                orderStatus: this.orderStatus,
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun(data);
            console.log(this.searchData);
        },
        resetFun(){     // 重置
            this.names= '' // 
            this.searchData = [];// 
            this.orderStatus = ""; // 
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList);
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                name: this.names,
                createTimeStart: this.searchData[0],
                createTimeEnd: this.searchData[1],
                orderStatus: this.orderStatus,
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun();
        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            let data = {
                name: this.names,
                createTimeStart: this.searchData[0],
                createTimeEnd: this.searchData[1],
                orderStatus: this.orderStatus,
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun();
        }
    }
}
</script>
<style scoped lang="scss">
.anomalousproblem{
    .warp_head_list{
        flex-wrap: wrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        >div{
            margin: 10px 0px;
            padding: 0px 5px;
            width: 25%;
            >div{
                width: 100%;
            }
        }
        .fontMore{
            color:#d0cfcf;
        }
        .btnone{
            margin-left: 10px;
        }
        .head_nav_btn{
            width: 100%;
            text-align: center;
            .fontMore{
                color:#d0cfcf;
            }
            .btnone{
                margin-left: 10px;
            }
        }
    }
    .head_nav_datapick{
        width: 100%;
    }
    .reset_btn{
        background: none;
        color: #f2c27b;
        border: 1px solid #f2c27b;
    }
    .order-btn-list{
        margin-top: 20px;
    }
    .order_table{
        margin-top: 20px;
        width: 100%;
    }
    .order_table .el-tooltip{
        text-align: center;
    }
    .order_table .cell{
        text-align: center;
    }
    .titlecals{
        top: 0;
    }
    .zuopclas{
        margin: 20px 0px 10px 0px;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
    }
    .tablebox{
        width: 100%;
    }
}
</style>