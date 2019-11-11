<template>
    <div class="contract">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="head_nav_search">
                        <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50">
                            <el-button slot="append" size="mini" icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker  prefix-icon="el-icon-date"
                            size="medium" v-model="searchData" type="datetime" 
                            value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss'
                            placeholder="年/月/日">
                        </el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="orderStatus" placeholder="选择状态" size="medium">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select">
                        <el-button @click="searchFun" class="button-fc" type="warning" size="medium">查询</el-button>
                        <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="h-width"></div>
            <div class="order-btn-list">
                <el-button size="small" class="button-96" @click="invitation">上传下单图</el-button>
                <el-button size="small" class="button-96" @click="invitation">附件管理</el-button>
                <el-button size="small" class="button-96" @click="invitation">审核记录</el-button>
            </div>
            <div class="order_table">
                <el-table border
                    ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="图纸审核状态" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="提交图纸时间" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="提交人" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="审核图纸时间" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="审核人" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="合同签订时日期" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="订单号" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="订单类型" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="订单货品类型" width="200" sortable></el-table-column>
                    <el-table-column prop="customerName" align="center" label="产品品牌" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="产品类别" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="客户姓名" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="备用电话" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="销售员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="测量员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="设计师" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="测量汇报时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="设计汇报时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
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
        </el-card>

        <!-- 查看附件 -->
        <el-dialog
            :visible.sync="seeannexval"
            width="50%">
            <div>
                <seeannex></seeannex>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import breadcrumb from "../../components/breadcrumb";
import { listOrder, listStore, listCategory ,orderCancel, listBaseDict} from 'api/order/order/order';
import seeannex from "../../components/seeannex";//查看附件

export default {
    components: {
        breadcrumb,
        seeannex,
    },
    data(){
        return {
            fromdatas: {
                housingTypeId: 1,
            },
            checked: false,
            seeannexval: false,
            navList: [],
            labelPosition: 'right',
            typeList: [],
            names: '', // 条件搜索
            searchData: [],// 时间搜索
            changedata: "",
            orderStatus: "", // 状态搜索
            stateList: "",  // 状态条件
            commodityCategoryId: [], // 类别搜索
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
            isShow: false,
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
            switchSalesperson: "",
        }
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
               return val ? (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',') : 0;
        }
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.orderdatafun(data);

    },
    methods: {
        invitation(){
            this.seeannexval = true;
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
                commodityCategoryId: this.commodityCategoryId,

                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun(data);
            console.log(this.searchData);
        },
        resetFun(){     // 重置
            this.names= '' // 
            this.searchData = [];// 
            this.orderStatus = []; // 
            this.commodityCategoryId = []; // 
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList,"tableSelectList1234");
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                name: this.names,
                createTimeStart: this.searchData[0],
                createTimeEnd: this.searchData[1],
                orderStatus: this.orderStatus,
                commodityCategoryId: this.commodityCategoryId,
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
                commodityCategoryId: this.commodityCategoryId,
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun();
        }
    }
}
</script>
<style scoped lang="scss">
.contract{
    .dialog_con_box .content_box{
        display: flex;
        flex-wrap: wrap;
    }
    .dialog_con_box .left_form{
        width: 60%;
    
    }
    .dialog_con_box .right_logo{
        width: 40%;
    }
    .dialog_con_box .Dialog_input_cell .Dialog_input_cell_title{
        width: 100px;
        text-align: right;
        padding-right: 10px;
    }
    .order_title{
        border-bottom: 1px solid #d9d9d9;
    }
    .warp_head_list{
        flex-wrap: wrap;
    }
    .el-icon-search{
        width: 36px;
        background: #d0cfcf;
        border-radius: 0 4px 4px 0;
        transform: translateX(5px);
    }
    .el-icon-search::before{
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background: url(../../../assets/images/search.png) no-repeat center center;
        background-size: 15px 15px;
    }
    .el-range-separator{
        color: #bfbfbf;
    }
    .list_top,.list_bottom{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
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
    .head_nav_datapick{
        width: 100%;
    }
    .list_bottom{
        margin-top: 20px;
    }
    .head_nav_search{
        width: 400px;
    }
    .head_nav_select{
        width: 170px;
        margin: 5px;
    }
    .reset_btn{
        background: none;
        color: #f2c27b;
        border: 1px solid #f2c27b;
    }
    .order-btn-list .blue{
        background: #96bdde;
        color: #fff;
        width: 100px;
        padding-left: 0;
        padding-right: 0;
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
    .text{
        float: left;
        margin-left: 20px;
    }
    .discount, .emergency{
        color: #fff;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        border-radius: 50%;
        box-sizing: border-box;
        white-space: nowrap;
        margin: 0;
        padding: 0;
        background: #b43e4c;
        float: right;
        margin: 0 1px;
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
        position: absolute;
        transform: translate(0px,-16px);
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
        position: absolute;
        transform: translate(-16px,-16px)
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
}
</style>