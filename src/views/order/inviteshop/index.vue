<template>
    <div class="inviteshop">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="head_nav_search">
                        <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50"></el-input>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker
                            size="medium" v-model="searchData" type="datetimerange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            start-placeholder="年/月/日" end-placeholder="年/月/日">
                        </el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="invitationStatus " placeholder="选择邀约状态" size="medium">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="customerAcceptType" placeholder="选择客户接受状态" size="medium">
                            <el-option
                                v-for="item in typeList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select">
                        <el-date-picker
                            v-model="invitationTime" 
                            value-format='yyyy-M-dd HH:mm:ss'
                            format='yyyy-M-dd HH:mm:ss'
                            size="medium" type="datetime" 
                            placeholder="选择日期" class="selewi">
                        </el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-button @click="searchFun" type="warning" class="button-fc" size="medium">查询</el-button>
                        <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="h-width"></div>
            <div class="order-btn-list">
                <el-button size="small" class="button-96" v-if="btnJurisdiction.inviteshop_sendout" @click="invitationfun">发送邀约</el-button>
            </div>
            <div class="order_table">
                <el-table border
                    ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" fixed :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="num" align="center" label="邀约状态" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.num > 1">已发送({{scope.row.num}}次)</div>
                            <div v-else-if="scope.row.num == 1">已发送</div>
                            <div v-else>未发送</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customerAcceptType" align="center" label="客户接受状态" width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.row.customerAcceptType == 0">未接收</div>
                            <div v-if="scope.row.customerAcceptType == 1">已接收</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="invitationTime" align="center" label="邀约到店时间" width="180"></el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="订单编号" width="180" sortable></el-table-column>
                    <el-table-column prop="orderType" align="center" label="订单类型" width="120">
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
                    <el-table-column prop="orderGoodsType" align="center" label="货品类型" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderGoodsType == 1">成品</div>
                            <div v-if="scope.row.orderGoodsType == 2">定制</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" align="center" label="产品品牌" width="120"></el-table-column>
                    <el-table-column prop="categoryName" align="center" label="产品类型" width="120"></el-table-column>
                    <el-table-column prop="reportedTypeName" align="center" label="订单报备类型" width="120"></el-table-column>
                    <el-table-column prop="customerName" align="center" label="客户姓名" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="客户电话" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="备用电话" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" label="所属网点" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" align="center" label="发送邀约时间" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerAcceptInvitationTime" align="center" label="客户接受邀约时间" width="180" show-overflow-tooltip></el-table-column>
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

        <!-- 弹框页面 -->
        <div class="dialog_con_box">
            <el-dialog :visible.sync="centerDialogVisible" width="800px" title="邀约到店" class="customDialogTitle">
                <div>
                    <invitation v-if="centerDialogVisible" ref='invitalog' :orderId = tableSelectList[0].orderId></invitation>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sendJava">确 定</el-button>
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import invitation  from '../order/components/invitation'; // 邀约到店
import breadcrumb from "../../components/breadcrumb";
import { orderInvitation, orderInvitationList} from 'api/order/order/order';


export default {
    components: {
        breadcrumb,
        invitation,
    },
    data(){
        return {
            fromdatas: {
                housingTypeId: 1,
            },
            checked: false,
            navList: [],
            labelPosition: 'right',
            typeList: [
                {dictName: "已接受", id: 1},
                {dictName: "未接受", id: 0}
            ],
            names: '', // 条件搜索
            searchData: [],// 时间搜索
            invitationTime: "",
            invitationStatus : "", // 状态搜索
            centerDialogVisible: false,
            stateList: [
                {dictName: "已发送", id: 1},
                {dictName: "未发送", id: 0}
            ],  // 状态条件
            customerAcceptType: "", // 客户接受状态
            tableData:[],
            tableSelectList: [],
            isShow: false,
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
            switchSalesperson: "",
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
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
        sendJava(){
            this.inviShop()
            this.centerDialogVisible = false;
        },
        // 邀约到店
        inviShop() {
            console.log("yaoyue  yueee");
            
            let data = {
                orderId: this.tableSelectList[0].orderId,  // 订单ID
                invitationTime:  this.$refs.invitalog.fromdatas.handoverDate,
                invitationContent: this.$refs.invitalog.fromdatas.remarks,
                // isBudget:  this.$refs.invitalog.isBudget,
                // isDesign:  this.$refs.invitalog.isDesign,
            };
            orderInvitation(data).then(res =>{
                console.log(res);
                if(res.status == 200){
                    this.$message({
                        message: '成功邀约',
                        type: 'warning'
                    });

                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        invitationfun(){
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
                this.centerDialogVisible = true;
            }
        },
        orderdatafun(data){
            orderInvitationList(data).then(res =>{
                console.log(res);
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableData = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        searchFun(){    //搜索
            let data = {
                name: this.names,
                createTimeStart: this.searchData[0],
                createTimeEnd: this.searchData[1],
                invitationStatus : this.invitationStatus,
                customerAcceptType: this.customerAcceptType,
                invitationTime: this.invitationTime,
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun(data);
            console.log(this.searchData);
        },
        resetFun(){     // 重置
            this.names= '' // 
            this.searchData = [];// 
            this.invitationStatus  = ""; // 
            this.customerAcceptType = ""; // 
            this.invitationTime = ""; // 
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
                invitationStatus : this.invitationStatus ,
                customerAcceptType: this.customerAcceptType,
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
                invitationStatus : this.invitationStatus ,
                customerAcceptType: this.customerAcceptType,
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun();
        }
    }
}
</script>
<style scoped lang="scss">
.inviteshop{
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