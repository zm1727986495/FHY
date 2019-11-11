<template>
    <div class="ordercomponent">
        <!-- 查询条件组 -->
        <el-dialog  title="选择订单"  custom-class="customDialogTitle" :visible.sync="centerDialogVisible" width="70%" top='1vh' :before-close="closefun" >
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="head_nav_search">
                        <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50"></el-input>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker prefix-icon="el-icon-date"
                            size="medium" v-model="searchData" type="daterange" value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-" start-placeholder="选择创建订单时间" end-placeholder="选择创建订单时间">
                        </el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="orderStatus" multiple placeholder="选择状态" clearable filterable size="medium">
                            <el-option v-for="item in stateList" :key="item.value" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_datapick btns_center">
                        <el-button class="button-fc" type="warning" size="medium"  @click="searchFun" :loading="loading">查询</el-button>
                        <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="order_table" v-loading='loading'>
                <el-table border :row-key="getRowKeys"
                    ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" max-height="400"
                    :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="55" :reserve-selection="true" fixed="left"></el-table-column>
                    <el-table-column prop="orderStatusName" align="center" label="订单状态" width="200" sortable></el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="订单号" width="200" sortable></el-table-column>
                    <el-table-column prop="orderType" align="center" label="单据类型" width="200" sortable>
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderType == 451">正单</div>
                            <div v-if="scope.row.orderType == 452">增单</div>
                            <div v-if="scope.row.orderType == 453">遗留单</div>
                            <div v-if="scope.row.orderType == 972">补单</div>
                            <div v-if="scope.row.orderType == 973">退货单</div>
                            <div v-if="scope.row.orderType == 974">上样</div>
                            <div v-if="scope.row.orderType == 975">撤样</div>
                            <div v-if="scope.row.orderType == 976">换货</div>
                            <div v-if="scope.row.orderType == 977">第三方订单</div>
                            <div v-if="scope.row.orderType == 978">售后问题</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderGoodsType" align="center" label="订单货品类型" width="200" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderGoodsType == 1">成品</div>
                            <div v-if="scope.row.orderGoodsType == 2">定制</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" align="center" label="产品品牌" width="200" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderExpectMoney" align="center" label="合同金额/元" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{scope.row.orderExpectMoney | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paymentAmount" align="center" label="实收金额/元" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{scope.row.paymentAmount | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportedTypeName" align="center" label="报备类型" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerName" align="center" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="备用电话" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="salesmanName" align="center" label="销售员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessName" align="center" label="业务员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorName" align="center" label="测量员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="orderChannelName" align="center" label="订单渠道" width="200" show-overflow-tooltip></el-table-column> -->
                    <el-table-column prop="orderSourceName" align="center" label="订单来源" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createOrderTime" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyor_assigned_time" align="center" label="指派测量时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designer_assigned_time" align="center" label="指派设计时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
                <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" @size-change="handleSizeChange"
                    :page-sizes="[20, 30, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminbtn">确 定</el-button>
                <el-button @click="closefun">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import pagination from './pagination';
import { 
    listOrder, 
    listQuestionOrder, 
    listBaseDict,
} from 'api/order/order/order';
import {
    listOrderByHome, // 家装代收合同订单列表
} from 'api/administrationCenter/decorationpermit/index'; // 家装代收合同申请


import {
    listOrderTransfer, // 订单列表2
    listOrderContract, // 退款订单列表(type = 1) / 工期加急 / 开票申请 / 折扣申请
} from 'api/marketing/refundpermit/index';

import {
    listOrderCollect,
} from 'api/marketing/refundpermit/index';

import {
    listBlitem, // 盘点的订单列表
} from "api/entrepotSet/duty/index";


export default {
    components: {
        pagination,
    },
    data() {
        return {
            names: "",
            searchData: [],
            orderStatus: [],
            tableData:[],
            stateList: [],
            total: 0,    // 总数
            pageSize: 20,  // 单页条数
            currentPage: 1, // 当前页
            tableSelectList: [],
            loading:false
        };
    },
    // props: ["centerDialogVisible"],
    props: {
        applyType: {
            type: String,
            default() {
                return ""
            }
        },
        centerDialogVisible: {
            type: Boolean,
        },
        orderId: {
            default() {
                return ''
            }
        },
        orderRefund: {
            default() {
                return ''
            }
        },
        refundType: {
            type: String,
        },
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
            return (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',')
        }
    },
    created() {
        //获取订单状态
        let datasa={
            dataType: "ORDER_STATUS"
        };
        listBaseDict(datasa).then(res =>{
            console.log(res,"基础字典查询获取订单状态");
            if(res.status == 200){
                this.stateList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询获取订单状态 order/justOrder/addJustOrder.vue', error);
        })
    },
    mounted() {
        // new Promise((resolve, reject) => {
        //     let data = {
        //         page: this.currentPage,
        //         limit: this.pageSize,
        //     };
        //     if(this.applyType == "8") {   // 家装代收合同申请列表 
        //         listOrderByHome(data).then(res =>{
        //             if(res.status == 200){
        //                 this.total = res.data.total;
        //                 this.tableData = res.data.rows;
        //                 resolve(this.tableData);
        //             }
        //         }).catch(error =>{
        //             console.log('家装代收合同管理: 订单弹框列表 家装代收合同订单列表 components/ordercomponent.vue', error);
        //         })
        //     }else if(this.applyType == "4") { // 退款申请
        //         listOrderCollect(data).then(res =>{ 

        //             if(res.status == 200){
        //                 this.total = res.data.total;
        //                 this.tableData = res.data.rows;
        //                 resolve(this.tableData);
        //             }
        //         }).catch(error =>{
        //             console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
        //         })
        //     }else if(this.applyType == "3") { // 开票申请
        //         data.invoice = 1;

        //         listOrder(data).then(res =>{ 
        //             if(res.status == 200){
        //                 this.total = res.data.total;
        //                 this.tableData = res.data.rows;
        //                 resolve(this.tableData);
        //             }
        //         }).catch(error =>{
        //             console.log('订单管理:订单列表 开票申请 order/order/order.vue', error);
        //         })
        //     }else if(this.applyType == "1") { // 工期加急申请
        //         data.delay = 1;

        //         listOrder(data).then(res =>{ 
        //             if(res.status == 200){
        //                 this.total = res.data.total;
        //                 this.tableData = res.data.rows;
        //                 resolve(this.tableData);
        //             }
        //         }).catch(error =>{
        //             console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
        //         })
        //     }else if(this.applyType == "2") { // 返点
        //         data.invoice = 1;
        //         data.referrer = 1;

        //         listOrder(data).then(res =>{ 
        //             if(res.status == 200){
        //                 this.total = res.data.total;
        //                 this.tableData = res.data.rows;
        //                 resolve(this.tableData);
        //             }
        //         }).catch(error =>{
        //             console.log('订单管理:订单列表 返点申请 order/order/order.vue', error);
        //         })
        //     }else if(this.refundType == "2") { // 退款申请的订单列表2

        //         data.orderId = this.orderRefund;

        //         listOrderTransfer(data).then(res =>{ 
        //             if(res.status == 200){
        //                 this.total = res.data.total;
        //                 this.tableData = res.data.rows;
        //                 resolve(this.tableData);
        //             }
        //         }).catch(error =>{
        //             console.log('订单管理:订单列表 退款申请列表2 order/order/order.vue', error);
        //         })
        //     }else if( this.$route.path == "/regoodspermit/addapplication" ){ // 退货管理 新增退货
        //         data.guestAddSingle = 1;

        //         listOrder(data).then(res =>{ // 正单 增单订单
        //             if(res.status == 200){
        //                 this.total = res.data.total;
        //                 this.tableData = res.data.rows;
        //                 resolve(this.tableData);
        //             }
        //         }).catch(error =>{
        //             console.log('订单管理:订单列表 order/order/order.vue', error);
        //         })
        //     }else {
        //         listQuestionOrder(data).then(res =>{ // 普通订单
        //             if(res.status == 200){
        //                 this.total = res.data.total;
        //                 this.tableData = res.data.rows;
        //                 resolve(this.tableData);
        //             }
        //         }).catch(error =>{
        //             console.log('订单管理:订单列表 order/order/order.vue', error);
        //         })
        //     }

        //     // this.orderdatafun(data);
            
        // }).then((res)=>{
        //     if(this.orderId) {
        //         console.log(this.orderId,"orderId 121212");
        //         this.$nextTick(() => {
        //             if(this.orderId) {
        //                 console.log(this.orderId,"orderId 145631");
        //                 // 如果已经选择orderId那么这个组件再次被打开 该条就会被选中
        //                 res.forEach(item => {
        //                     if(item.orderId == this.orderId) {
        //                         this.$refs.multipleTable.toggleRowSelection(item);
        //                     }
        //                 })
        //             }
        //         });
        //     }
        // });
    },
    methods: {
        getRowKeys(row) {
            return row.orderId;
        },
        // 搜索条件获取
        searchdatas(){
            return {
                names: this.names,//订单编号
                createTimeStart: this.searchData ? this.searchData[0] : "",//创建时间
                createTimeEnd: this.searchData ? this.searchData[1] : "",
                orderStatusIds: this.orderStatus.join(","),//订单状态
                page: this.currentPage,
                limit: this.pageSize,
            }
        },
        // 关闭弹窗
        closefun(){
            this.$emit("orderclosefun");
        },
        // 提交勾选
        subminbtn(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个订单',
                    type: 'warning'
                });
            } else if (this.tableSelectList.length < 1){
                this.$message({
                    message: '请选择订单',
                    type: 'warning'
                });
            } else {
                this.$emit("orderclosefun",this.tableSelectList)
            }
        },
        // 订单列表接口
        orderdatafun(data){
            console.log(this.applyType,"this.applyType");
            // (1.折扣申请) 0 (2.工期加急申请) 1 (3.返点申请) 2 (4.开票申请) 3 (5.退款申请) 4 (6.退货退款申请) 5 (7.换货申请) 6 (8.家装代收合同申请列表) 8 
            this.loading = true;
            if(this.applyType == "8") {   // 家装代收合同申请列表 
                listOrderByHome(data).then(res =>{
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.loading = false;
                    }else{
                        this.loading = false;
                    }
                }).catch(error =>{
                    this.loading = false;
                    console.log('家装代收合同管理: 订单弹框列表 家装代收合同订单列表 components/ordercomponent.vue', error);
                })
            }else if(this.applyType == "4") { // 退款申请
                listOrderCollect(data).then(res =>{ 

                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.loading = false;
                    }else{
                        this.loading = false;
                    }
                }).catch(error =>{
                    this.loading = false;
                    console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "3") { // 开票申请
                data.invoice = 1;

                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.loading = false;
                    }else{
                        this.loading = false;
                    }
                }).catch(error =>{
                    this.loading = false;
                    console.log('订单管理:订单列表 开票申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "1") { // 工期加急申请
                data.delay = 1;

                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.loading = false;
                    }else{
                        this.loading = false;
                    }
                }).catch(error =>{
                    this.loading = false;
                    console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "2") { // 返点
                data.invoice = 1;
                data.referrer = 1;

                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.loading = false;
                    }else{
                        this.loading = false;
                    }
                }).catch(error =>{
                    this.loading = false;
                    console.log('订单管理:订单列表 返点申请 order/order/order.vue', error);
                })
            }else if(this.refundType == "2") { // 退款申请的订单列表2
                data.orderId = this.orderRefund;

                listOrderTransfer(data).then(res =>{ 
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.loading = false;
                        resolve(this.tableData);
                    }else{
                        this.loading = false;
                    }
                }).catch(error =>{
                    this.loading = false;
                    console.log('订单管理:订单列表 返点申请 order/order/order.vue', error);
                })
            }else if( this.$route.path == "/regoodspermit/addapplication" ){ // 退货管理 新增退货
                data.guestAddSingle = 1;

                listOrder(data).then(res =>{ // 正单 增单订单
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.loading = false;
                    }else{
                        this.loading = false;
                    }
                }).catch(error =>{
                    this.loading = false;
                    console.log('订单管理:订单列表 order/order/order.vue', error);
                })
            }else {
                listQuestionOrder(data).then(res =>{ // 普通订单
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        this.loading = false;
                    }else{
                        this.loading = false;
                    }
                }).catch(error =>{
                    this.loading = false;
                    console.log('订单管理:订单列表 order/order/order.vue', error);
                })
            }
            // else if( this.sponsorType == 2 ){ // 定责的盘点订单

            //     listBlitem(data).then(res =>{ // 定责的盘点订单列表
            //         if(res.status == 200){
            //             this.total = res.data.total;
            //             this.tableData = res.data.rows;
            //         }
            //     }).catch(error =>{
            //         console.log('订单管理:订单列表 order/order/order.vue', error);
            //     })
            // }

            // else if(this.applyType == "4" || this.applyType == "1" ||  this.applyType == "3" || this.applyType == "0") { // 退款订单列表(type = 1) / 工期加急 / 开票申请 / 折扣申请
            //     if(this.applyType == "4") {
            //         data.type = 1;
            //     }
            //     listOrderContract(data).then(res =>{
            //         if(res.status == 200){
            //             this.total = res.data.total;
            //             this.tableData = res.data.rows;
            //         }
            //     }).catch(error =>{
            //         console.log('家装代收合同管理: 订单弹框列表 退款订单列表 components/ordercomponent.vue', error);
            //     })
            // }

            // else if(this.applyType == "8") { // 家装代收合同申请
            //     data.delay = 1;

            //     listOrder(data).then(res =>{ 
            //         if(res.status == 200){
            //             this.total = res.data.total;
            //             this.tableData = res.data.rows;
            //         }
            //     }).catch(error =>{
            //         console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
            //     })
            // }

        },
        // 查询
        searchFun(){
            this.currentPage = 1;
            if(this.searchData == null){
                this.searchData = []
            }
            let data = this.searchdatas();
            console.log(this.searchData, data.names, data.orderStatusIds);
            if(data.names != "" || this.searchData.length > 0 || data.orderStatusIds != ""){
                this.tableData = []
                this.orderdatafun(data);
            }
        },
        // 清空
        resetFun(){
            this.names = "";
            this.searchData = []
            this.orderStatus = [];
            this.currentPage = 1;
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        // 单页条数改变
        handleSizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
        handleSelectionChange(val){
            this.tableSelectList = val;

            console.log(val,"val order");
        },


    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
.ordercomponent{
    .warp_head_list{
        flex-wrap: wrap;
    }
    .btns_center {
        display: flex;
        flex-wrap: nowrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
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
}
</style>

