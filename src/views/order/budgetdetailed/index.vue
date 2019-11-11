<template>
    <div class="budgetdetailed">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <serach ref="search"  @chilreChange="chilreChange"></serach>
            <div class="h-width"></div>
            <div class="m-bottom10">
                <el-button size="small" class="button-96" v-if="btnJurisdiction.budgetdetailed_importhfun" @click="importhFun">修改</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.budgetdetailed_seefun" @click="getFun">查看</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.budgetdetailed_copyfun" @click="salesmanFun">复制</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.budgetdetailed_deletefun" @click="modelOpen()">删除</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.budgetdetailed_salefun" @click="saleFun">导出</el-button>
            </div>
            <div class="table_list" v-loading="loading">
                <el-table border ref="multipleTable" 
                    :data="tableData" 
                    tooltip-effect="dark"
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    max-height="500">
                    <el-table-column type="selection" align="center" width="50" fixed="left"></el-table-column>
                    <el-table-column prop="budgetNumber" width="150" align="center" label="预算清单编号" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderNumber" width="140" align="center" label="订单号" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" width="170" align="center" label="创建时间" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderType" width="120" align="center" label="订单类型" sortable show-overflow-tooltip> </el-table-column>
                    <!-- <el-table-column prop="isSign" width="200" align="center" label="是否签署" show-overflow-tooltip> 
                        <template slot-scope="scope">
                            <span v-if='scope.row.isSign == 0'>未签署</span>
                            <span v-else-if="scope.row.isSign == 1">已签署</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="totalAmount" width="140" align="center" label="合计金额" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerName" width="120" align="center" label="客户姓名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" width="140" align="center" label="客户电话" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" width="200" label="订单地址" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="salesman" align="center" width="140"  label="销售员" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyor" align="center" width="140"  label="测量员" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designer" align="center" width="140"  label="设计师" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="business" align="center" width="140"  label="业务员" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" width="200"  label="所属网点" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderStatus" align="center" width="120"  label="订单状态" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import serach from "./serach";
import { listOrderBudget, deleteOrderBudget, copyOrderBudget} from "@/api/order/budgetdetailed/budgetdetailed";
import measuredoortime from "../../components/measuredoortime";
import assignmeasure from "../../components/assignmeasure";

export default {
    components: {
        breadcrumb,
        measuredoortime,
        assignmeasure,
        serach
    },
    data(){
        return {
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
            form:{},//表单数据对象
            navList:'',//面包屑
            searchData:[],//时间控件数据
            tableData:[],
            //分页
            total: 0,    // 总数
            page: 40,   // 页数
            pageSize: 20,  // 单页条数
            currentPage: 1, // 当前页
            checkdata: [],
            loading: true
        }
    },
    activated(){
        // 头部面包屑
        this.navList=this.$route.meta;

        this.getList();
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     // 头部面包屑
    //     this.navList=this.$route.meta;

    //     this.getList();
    // },
    methods: {
        /**
         * 获取预算清单列表
         * getList
         */
        getList(item){
            this.loading = true;
            let data = {
                limit: this.pageSize,
                page: this.currentPage
            };
            if(item){
                Object.assign(data, item);
            }
            listOrderBudget(data).then( res => {
                this.tableData = res.data.rows;
                this.total = res.data.total;
                this.loading = false;
            }).catch( error => {
              this.loading = false;
            })
        },
        /**
         * 删除预算清单提示提示
         * @method modelOpen 
         * */        
        modelOpen(){
            if(this.checkdata.length === 0){
                this.$message({
                    message: '请选择订单',
                    type: 'warning'
                });
                return false
            }else{
                this.$confirm('此操作将永久删除预算清单, 是否删除?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.deleteOrder();
                    }).catch(() => {
                    this.$message({
                        type: 'error',
                        message: '删除错误请联系管理员'
                    });          
                });               
            }  
        },
        /**
         * 删除预算清单
         * @method deleteOrder
         */
        deleteOrder() {
            
            deleteOrderBudget({budgetId: Number(this.checkdata[0].budgetId) }).then(res=> {
                console.log(res);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getList();
            }).catch(error => {

            })
        },
        // 判断选中
        checkfun(){
            if(this.checkdata.length == 0){
                this.$message({message: '请选择订单',type: 'warning'});
                return false
            }else if(this.checkdata.length >1 ){
               this.$message({message: '只能选择一条订单',type: 'warning'});
                return false
            }else {
                return true;
            }
        },
        handleSelectionChange(val){
            this.checkdata = val;
            console.log(val)
        },
        /**
         * table表格斑马线设置
         * @method tableRowClassName
         */
        tableRowClassName({row, rowIndex}) {
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        /**
         * 预算清单修改
         * @method importhFun
         */
        importhFun(){ 
            console.log(this.checkdata);
            if(this.checkfun()){
                this.$router.push({ path:'/ordermm/editBudgetList',query:{orderId: this.checkdata[0].orderId, budgetId: this.checkdata[0].budgetId, brandId : this.checkdata[0].brandId, commodityCategoryId : this.checkdata[0].commodityCategoryId}});
            }
        },
        /**
         * 查看清单修改
         * @method getFun
         */
        getFun(){ 
            if(this.checkfun()){
                this.$router.push({ path:'/ordermm/viewBugetdetailed',query:{orderId: this.checkdata[0].orderId, budgetId: this.checkdata[0].budgetId}});
            }
        },
        /**
         * 预算清单复制
         * @method salesmanFun
         */
        salesmanFun(){
            if(this.checkdata.length === 0){
                this.$message({
                    message: '请选择订单',
                    type: 'warning'
                });
                return false
            }else{
                this.$confirm('此操作会复制预算清单, 是否复制?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        copyOrderBudget({budgetId: Number(this.checkdata[0].budgetId)}).then(res => {
                            this.$message({
                                type: 'success',
                                message: '复制成功!'
                            });
                            this.getList();
                        }).catch(error => {
                            console.log(error);
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'error',
                        message: '复制错误请联系管理员'
                    });          
                });               
            }
        },
        /**
         * 预算清单删除
         * @method mechanismFun
         */
        mechanismFun(){  // 删除
            if(this.checkfun()){
                
            }
        },
        // 测量汇报提交
        measurereportsub(){
            
        },
        saleFun(){  // 导出

        },
        //设计汇报提交
        designreportsub(){
            
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
            // console.error('111', this.isShow);
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList();

        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            this.page = this.total / val;
        },
        chilreChange(item){
            this.getList(item);
        }
    }
}
</script>
<style scoped lang="scss">
    .budgetdetailed{
        .input-width{
            width: 30vw;
        }
        .order-btn-list{
            height: 75px;
            line-height: 75px;
        }
        .order-btn-list .blue{
            background: #96bdde;
            color: #fff;
            width: 100px;
            padding-left: 0;
            padding-right: 0;
        }
        .order_table .el-tooltip{
            text-align: center;
        }
        .order_table .cell{
            text-align: center;
        }
        .text{
            float: left;
        }
        .attributesTips{
            transform: translateX(-25px);
        }
        .discount, .emergency{
            color: #fff;
            text-align: center;
            width: auto;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            border-radius: 20px;
            box-sizing: border-box;
            /* border: 1px solid rgba(64,158,255,.2);
            border-color: red; */
            white-space: nowrap;
            margin: 0;
            padding: 2px 5px;
            background: #e92a2a;
            float: right;
            margin: 0 1px;
            display: flex;
            align-items: center;
        }
        .el-tag--aa{
            color: #000;
            text-align: center;
            width: unset;
            height: 32px;
            line-height: 30px;
            font-size: 12px;
            border-radius: 0;
            box-sizing: border-box;
            border: unset;
            white-space: nowrap;
            margin: 0;
            padding: 0;
            background: none;
        }
        .el-tag--bb{
            color: #e1a6ac;
            text-align: center;
            width: 32px;
            height: 32px;
            line-height: 30px;
            font-size: 12px;
            border-radius: 50%;
            box-sizing: border-box;
            border: 1px solid rgba(64,158,255,.2);
            border-color: #e1a6ac;
            white-space: nowrap;
            margin: 0;
            padding: 0;
            background: none;
        }
        .pagination_wrap .btn-prev{
            background: #efefef;
        }
        .pagination_wrap .el-pagination .btn-next,
        .pagination_wrap .el-pagination .btn-prev{
            background: #efefef;
        }
        .pagination_wrap .el-pager li{
            background: #efefef;
            margin: 0 5px;
            border-radius: 4px;
        }
        .pagination_wrap .el-pager li.active{
            background: #96bdde;
            color: #fff;
        }
        .measurereportbox{
            padding: 0px 40px;
        }
    }
    .budget_tables{
        overflow: hidden;
    }   
</style>
