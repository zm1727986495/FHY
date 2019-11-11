<template>
    <div class="order_box">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <div :class="'order_title '  +  (isShow ? '' : 'hide')">
                <!-- <div>客增单管理</div> -->
                    <!-- 查询条件组 -->
                <div class="warp_head_list">
                    <div class="list_top">
                        <div class="head_nav_search">
                            <el-input
                                placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址1"
                                v-model="searchtext"
                                size="medium"
                                maxlength="50">
                                <i slot="suffix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </div>
                        <div class="head_nav_datapick">
                            <el-date-picker
                                size="medium"
                                v-model="searchData"
                                type="daterange"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                @change="datapickChange"
                                range-separator="-"
                                start-placeholder="年-月"
                                end-placeholder="年-月-"
                                width='100%'
                                >
                            </el-date-picker>
                        </div>
                        <div class="head_nav_select">
                            <el-select v-model="switchState" multiple placeholder="选择状态" size="medium">
                                <el-option
                                v-for="item in stateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="list_bottom">
                        <div class="head_nav_select">
                            <el-select v-model="switchType" multiple placeholder="选择订单类别" size="medium">
                                <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="head_nav_select">
                            <el-select v-model="switchChannel" multiple placeholder="选择订单渠道" size="medium">
                                <el-option
                                v-for="item in channelList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="head_nav_select">
                            <el-select v-model="switchDot" multiple placeholder="选择所属网点" size="medium">
                                <el-option
                                v-for="item in dotList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="head_nav_select">
                            <el-select v-model="switchSalesperson" multiple placeholder="选择销售员" size="medium">
                                <el-option
                                v-for="item in salespersonList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="head_nav_select">
                            <el-select v-model="switchFrom" multiple placeholder="选择订单来源" size="medium">
                                <el-option
                                v-for="item in fromList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="head_nav_btn">
                        <el-button type="primary" size="medium" class="button-fc " @click="searchFun">查询</el-button>
                        <el-button type="primary" size="medium" class="button-fc reset_btn" @click="resetFun">重置</el-button>
                    </div>
                </div>
                <div class="m-right" >
                    <button :class="'hide_btn ' + (isShow ? '' : 'hide') " @click="hideSearch">{{isShow ? '收起' : '展开'}}</button>
                </div>
            </div>
            <div class="order-btn-list">
                <el-button size="small" class="button-96" @click="addFun">新增客增单</el-button>
                <el-button size="small" class="button-96" @click="downFun">修改客增单</el-button>
                <el-button size="small" class="button-96" @click="importhFun">客增单作废</el-button>
                <el-button size="small" class="button-96" @click="salesmanFun">新增申请</el-button>
                <el-button size="small" class="button-96" @click="mechanismFun">新增问题</el-button>
                <el-button size="small" class="button-96" @click="saleFun">指派业务员</el-button>
            </div>
            <div class="order_table">
                <el-table
                    border
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    :row-style="tableRowStyle"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="state"
                    label="订单状态"
                    width="280">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                    <p @click="editHandle(scope.row)" class="operaItems">邀约</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">带单</p>
                                    <p @click="editHandle(scope.row)" class="operaItems">修改</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">收/退款</p>
                                    <p @click="editHandle(scope.row)" class="operaItems">订单作废</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">指派</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">预算</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">新增申请</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">合同下单</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">附件</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">跟进</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">商品明细</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">新增问题</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">变更地址</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">增单报价</p>
                                    <p @click="addsubHandle(scope.row)" class="operaItems">下单图</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                            </div>
                            <p class="text">{{scope.row.state}}</p>
                            <p v-if="scope.row.emergency" class="emergency" >{{scope.row.emergency ? '急' : ''}}</p>
                            <p v-if="scope.row.isDiscount" class="discount" >{{scope.row.isDiscount ? '折' : ''}}</p>
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="number"
                    label="单号"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="sourceNumber"
                    label="来源单号"
                    width="180"
                    show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    label="单据类型"
                    width="90"
                    show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                    prop="isTovoid"
                    label="作废/退单"
                    width="90"
                    
                    show-overflow-tooltip>
                    <el-tag
                        :type="scope.row.isTovoid === '-' ? 'aa' : 'bb'" slot-scope="scope"
                        disable-transitions>{{scope.row.isTovoid}}</el-tag>
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="客户名称"
                    width="80"
                    show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                    prop="phone"
                    label="客户联系电话"
                    show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                    prop="spare"
                    label="备用电话"
                    show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
         <div class="pagination_wrap">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
    
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "../../components/breadcrumb";

export default {
    components: {
        breadcrumb
    },
    data(){
        return {
            navList: [],
            spot,
            searchtext: '', // 条件搜索
            // 时间搜索
            searchData: [],
            switchState: '', // 状态搜索
            stateList: [],  // 状态条件
            switchType: '', // 类别搜索
            typeList: [], // 类别条件
            switchChannel: '', //渠道
            channelList: [], //渠道条件
            switchDot: '', // 网点搜索
            dotList: [], // 网点列表
            switchSalesperson: '', // 销售员搜索
            salespersonList: [], // 销售员列表
            switchFrom: '', // 来源搜索
            fromList: [], //来源列表
            tableData:[
                {
                    state: '已完成',
                    number: 123456789,
                    sourceNumber: 987654321,
                    type: '正单',
                    isTovoid: '-',
                    name: '张三',
                    phone: '15868686688',
                    spare: '13737373377',
                    isDiscount: false,
                    emergency: false,
                },
                {
                    state: '已完成',
                    number: 123456789,
                    sourceNumber: 987654321,
                    type: '正单',
                    isTovoid: '作废',
                    name: '张三',
                    phone: '15868686688',
                    spare: '13737373377',
                    isDiscount: true,
                    emergency: true,
                },
                {
                    state: '已完成',
                    number: 123456789,
                    sourceNumber: 987654321,
                    type: '正单',
                    isTovoid: '退单',
                    name: '张三',
                    phone: '15868686688',
                    spare: '13737373377',
                    isDiscount: false,
                    emergency: true,
                },
                {
                    state: '已完成',
                    number: 123456789,
                    sourceNumber: 987654321,
                    type: '正单',
                    isTovoid: '-',
                    name: '张三',
                    phone: '15868686688',
                    spare: '13737373377',
                    isDiscount: true,
                    emergency: false,
                },
                {
                    state: '已完成',
                    number: 123456789,
                    sourceNumber: 987654321,
                    type: '正单',
                    isTovoid: '-',
                    name: '张三',
                    phone: '15868686688',
                    spare: '13737373377',
                    isDiscount: false,
                    emergency: false,
                }
            ],
            multipleSelection: [],
            isShow: true,
            //分页
            total: 4000,    // 总数
            page: 40,   // 页数
            pageSize: 100,  // 单页条数
            pageSizes: [100, 200, 300, 400], // 单页条数列表
            currentPage: 1, // 当前页
        }
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        handleSelectionChange(){

        },
        datapickChange(data){   //时间搜索改变
            this.searchData = data;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        searchFun(){    //搜索

        },
        resetFun(){     // 重置
            this.searchtext= '' // 条件搜索
            // 时间搜索
            this.searchData = [];
            this.switchState = ''; // 状态搜索
            // stateList: [],  // 状态条件
            this.switchType = ''; // 类别搜索
            // typeList: [], // 类别条件
            this.switchChannel = ''; //渠道
            // channelList: [], //渠道条件
            this.switchDot = ''; // 网点搜索
            // dotList: [], // 网点列表
            this.switchSalesperson = ''; // 销售员搜索
            // salespersonList: [], // 销售员列表
            this.switchFrom = ''; // 来源搜索
            // fromList: [], //来源列表
        },
        addFun(){   // 添加
            this.$router.push({
                path: '/order/newaddcustomer'
            })
        },
        downFun(){  // 下载

        },
        importhFun(){   // 导入

        },
        salesmanFun(){  // 指派业务员

        },
        mechanismFun(){  // 指派机构

        },
        saleFun(){  // 指派销售员

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
            this.currentPage3 = val;
            // this.getData();
        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            this.page = this.total / val;
        }
    }
}
</script>
<style >
    .order_box .order_title::after{
        content: '';
        clear: both;
        width: 0;
        height: 0;
        margin: 0;
        padding: 0;
        display: block;
    }
    .order_box .order_title{
        border-bottom: 1px solid #d9d9d9;
        padding-bottom: 20px;
        height: 168px;
    }
    .order_box .order_title.hide{
        height: 50px;
        overflow: hidden;
    }
    .order_box .warp_head_list{
        flex-wrap: wrap;
        width: 88%;
        float: left;
    }
    .order_box .el-icon-search{
        width: 36px;
        background: #d0cfcf;
        border-radius: 0 4px 4px 0;
        transform: translateX(5px);
    }
    .order_box .el-icon-search::before{
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background: url(../../../assets/images/search.png) no-repeat center center;
    }
    .order_box .el-range-separator{
        color: #bfbfbf;
    }
    .order_box .list_top,.list_bottom{
        width: 100%;
        display: flex;
        align-items: baseline;
    }
    .order_box .list_bottom{
        margin-top: 20px;
    }
    .order_box .head_nav_search{
        width: 422px;
    }
    .order_box .head_nav_datapick{
        width: 298px;
        margin-right: 20px;
        position: relative;
    }
    .order_box .head_nav_datapick .el-date-editor{
        width: 298px;
    }
    .order_box .head_nav_datapick .el-date-editor .el-range__icon{
        width: 36px;
        position: absolute;
        right: 0;
        top: 0;
        background: #d0cfcf;
        border-radius: 0 4px 4px 0;
    }
    .order_box .head_nav_datapick .el-date-editor .el-range__icon::before{
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background: url(../../../assets/images/time.png) no-repeat center center;
    }
    .order_box .head_nav_select{
        width: 170px;
    }
    .order_box .head_nav_btn{
        width: 100%;
        text-align: center;
        margin-top: 20px;
    }
    .order_box .reset_btn{
        background: none;
        color: #f2c27b;
        border: 1px solid #f2c27b;
    }
    .order_box .m-right{
        width: 10%;
        float: right;
        height: 100%;
        position: relative;
    }
    .order_box .hide_btn{
        border: none;
        outline: none;
        position: absolute;
        right: 0;
        bottom: 0;
        padding-right: 25px;
        background: none;
        color: #d0cfcf;
    }
    .order_box .hide_btn::after{
        content: '';
        display: block;
        width: 15px;
        height: 15px;
        position: absolute;
        right: 0;
        bottom: 0;
        background-repeat: no-repeat;
        background-image: url(../../../assets/images/jiantou.png);
    }
    .order_box .hide_btn.hide::after{
        content: '';
        display: block;
        width: 15px;
        height: 15px;
        position: absolute;
        right: 0;
        bottom: 0;
        background-repeat: no-repeat;
        background-image: url(../../../assets/images/jiantou.png);
        background-position: center center;
        transform: rotate(180deg);
    }
    .order_box .order-btn-list{
        height: 75px;
        line-height: 75px;
    }
    .order_box .order-btn-list .blue{
        background: #96bdde;
        color: #fff;
        width: 100px;
        padding-left: 0;
        padding-right: 0;
    }
    .order_box .order_table{
        width: 100%;
    }
    .order_box .order_table .el-tooltip{
        text-align: center;
    }
    .order_box .order_table .cell{
        text-align: center;
    }
    .order_box .text{
        float: left;
        margin-left: 20px;
    }
    /* .order_box .attributesTips{
        transform: translateX(-25px);
    } */
    .order_box .discount, .emergency{
        color: #fff;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        border-radius: 50%;
        box-sizing: border-box;
        /* border: 1px solid rgba(64,158,255,.2);
        border-color: red; */
        white-space: nowrap;
        margin: 0;
        padding: 0;
        background: #b43e4c;
        float: right;
        margin: 0 1px;
    }
    .order_box .el-tag--aa{
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
    .order_box .el-tag--bb{
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
    .order_box .pagination_wrap .btn-prev{
        background: #efefef;
    }
    .order_box .pagination_wrap .el-pagination .btn-next,
    .order_box .pagination_wrap .el-pagination .btn-prev{
        background: #efefef;
    }
    .order_box .pagination_wrap .el-pager li{
        background: #efefef;
        margin: 0 5px;
        border-radius: 4px;
    }
    .order_box .pagination_wrap .el-pager li.active{
        background: #96bdde;
        color: #fff;
    }
</style>