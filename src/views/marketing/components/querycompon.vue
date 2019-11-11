<template>
    <!-- 折扣、工期、返点、开票、退款、退货退款、换货、退折扣、家装代收合同/申请 (所有的申请的申请列表) -->
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50"></el-input>
                </div>
                <div>
                    <el-date-picker
                        size="medium" v-model="searchData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="年/月/日" end-placeholder="年/月/日">
                    </el-date-picker>
                </div>
                <div>
                    <el-input placeholder="申请人" v-model="applyAt" size="medium" maxlength="50"></el-input>
                    <!-- <el-select v-model="applyAt" placeholder="选择申请人" size="medium">
                        <el-option
                            v-for="item in applyList" :key="item.value"
                            :label="item.dictName" :value="item.id">
                        </el-option>
                    </el-select> -->
                </div>
                <div>
                    <el-select v-model="applyType" placeholder="选择申请类型" size="medium">
                        <el-option
                            v-for="item in typeList" :key="item.value"
                            :label="item.categoryName" :value="item.applyType">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="applyStatus" placeholder="选择申请状态" size="medium">
                        <el-option
                            v-for="item in statusList" :key="item.value"
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
               <div  v-if="isShow">
                   <el-input placeholder="审核人" v-model="auditAt" size="medium" maxlength="50"></el-input>
                    <!-- <el-select v-model="auditAt" placeholder="选择审核人" size="medium">
                        <el-option
                            v-for="item in auditList" :key="item.value"
                            :label="item.dictName" :value="item.id">
                        </el-option>
                    </el-select> -->
                </div>
                <div  v-if="isShow">
                    <el-date-picker
                        size="medium" v-model="searchData2" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="年/月/日" end-placeholder="年/月/日">
                    </el-date-picker>
                </div>
                <div :class="[{'head_nav_btn': !isShow},'head_nav_datapick']">
                    <span class="fontMore cursors" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                    <el-button class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                    <el-button  class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
                </div>
            </div>
        </div>
        <div class="h-width"></div>
       
        <slot></slot>

        <!-- table表格 -->
                <div class="table_list lvs attribute m-top20"  v-loading="loading">
                    <el-table ref="multiTable"
                        border   :row-key="getRowKeys"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange"
                        :data="tabList"
                        style="width: 100%;">
                        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                        <el-table-column prop="applyStatus" align="center" label="申请状态" width="280" sortable :formatter="statusformatter">
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip placement="right" visible-arrow >
                                        <div slot="content" class="tips tipFon">
                                            <p @click="editbHandle(scope.row)" v-if="scope.row.applyStatus == 2" class="operaItems">编辑</p>
                                            <!-- <p @click="delebHandle(scope.row)" v-if="scope.row.applyStatus == 2" class="operaItems">删除</p> -->
                                            <p @click="auditRecord(scope.row)" class="operaItems">审核记录</p>
                                        </div>
                                        <img :src="spot" alt="" class="attributesTips">
                                    </el-tooltip>
                                     <!-- 0待审核，1审核通过，2驳回 -->
                                    <p class="text" v-if="scope.row.applyStatus == 0">待审核</p>
                                    <p class="text" v-if="scope.row.applyStatus == 1">审核通过</p>
                                    <p class="text" v-if="scope.row.applyStatus == 2">驳回</p>
                                </div>       
                            </template>
                        </el-table-column>
                        <el-table-column  prop="applyCode" label="申请单号" width="240" sortable align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span" @click="clickApplyCode(scope.row)">{{scope.row.applyCode}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="applyTime" label="申请时间" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="applyName" label="申请人" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="applyType" label="申请类型" width="240" sortable align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>
                                    <p class="" v-if="Number(scope.row.applyType) == 512">工作流程</p>
                                    <p class="" v-if="Number(scope.row.applyType) == 1064">折扣特批</p>
                                    <p class="" v-if="Number(scope.row.applyType) == 514">工期特批</p>
                                    <p class="" v-if="Number(scope.row.applyType) == 515">返点申请</p>
                                    <p class="" v-if="Number(scope.row.applyType) == 516">开票申请</p>
                                    <p class="" v-if="Number(scope.row.applyType) == 517">退款申请</p>
                                    <p class="" v-if="Number(scope.row.applyType) == 520">退折扣</p>
                                    <p class="" v-if="Number(scope.row.applyType) == 521">家装代收合同</p>
                                    <p class="" v-if="Number(scope.row.applyType) == 522">开票申请</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="applyReason" label="申请原因" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="auditName" label="审核人"  width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="orderNumber" label="订单号" width="240" sortable align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.orderNumber}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- :formatter="orderTypeformatter" -->
                        <el-table-column prop="orderTypeName"  label="订单类型" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="brandName" label="品牌" width="240" sortable align="center"></el-table-column>
                        <el-table-column  prop="categoryName" label="品类" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="customerName" label="客户姓名" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="customerPhone" label="客户电话" width="240" sortable align="center"></el-table-column>
                        <el-table-column  prop="otherPhone" label="备用电话" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="address"  label="订单地址"  width="240" sortable align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="storeName" label="所属门店"  width="240" sortable align="center" show-overflow-tooltip></el-table-column>
                    </el-table>    
                </div>
            <!-- 点击单元格--申请单号的弹出框 -->
            <applydetail @close-dialog = "closeDialog" v-if="diaVisible" :rowData="rowData"></applydetail>
            <!-- 点击审核记录的操作按耨--审核记录 -->
            <examinedia v-if="examVisible" @close_examin="examineclose" @examin_ok="examinok" ></examinedia>

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
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import applydetail from './applydetail'; // 申请详情
import examinedia from "./examinedia"; //审核记录
import {
    listOrderApply, // 申请列表
    deleteOrderApply, // 删除
} from 'api/marketing/refundpermit/index';
import { 
    listBaseDict //字典
} from "api/order/order/order";

export default {
    components: {
        pagination,
        applydetail,
        examinedia
    },
    data() {
        return {
            spot,
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,
            rowData: '',
            // 搜索条件
            names: '', // 条件搜索
            searchData: [],// 选择时间
            searchData2: [],// 选择时间
            applyAt: '', // 选择申请人
            applyType: '', // 选择申请类型
            applyStatus: '',  // 状态
            auditAt: '', // 选择审核人
            // 条件
            applyList: [],  // 选择申请人条件
            typeList: [],  // 选择申请类型条件
            statusList: [{
                label: "待审核", value: "0",
            },{
                label: "审核通过", value: "1",
            },{
                label: "驳回", value: "2",
            }],  // 选择状态条件
            auditList: [],  // 选择审核人条件
            // 搜索框的显示与否
            isShow: false,
            // 申请详情弹出框的显示与否
            diaVisible: false,
            examVisible: false, // 审核记录弹框是否显示
            // 表格
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
			loading: true, // table的loading控制
        }
    },
    watch: {
       
    },
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };

        this.getList(data);   
        //字典获取 申请类型
        this.listBaseDictFun();
    },
    methods: {
        //字典获取 申请类型
        listBaseDictFun(){
            let data = {
                dataType: "APPLY_TYPE"
            };
            listBaseDict(data).then(res=>{
                if(res.status == 200) {
                    this.typeList = res.data;
                }
            })
        },
        // 订单类型 0 正单 1 增单 2 补单 3 遗留单  4 退货单 5 上样 6 撤样 7 换货 8 第三方订单 9 售后问题
        orderTypeformatter(row) {
            let orderType = '';
            if(row.orderType == 0){
                orderType = "正单";
            }else if(row.orderType == 1) {
                orderType = "增单";
            }else if(row.orderType == 2) {
                orderType = "补单";
            }else if(row.orderType == 3) {
                orderType = "遗留单";
            }else if(row.orderType == 4) {
                orderType = "退货单";
            }else if(row.orderType == 5) {
                orderType = "上样";
            }else if(row.orderType == 6) {
                orderType = "撤样";
            }else if(row.orderType == 7) {
                orderType = "换货";
            }else if(row.orderType == 8) {
                orderType = "第三方订单";
            }else if(row.orderType == 9) {
                orderType = "售后问题";
            }
            return orderType;
        },
        // 申请状态 0待审核，1审核通过，2驳回
        statusformatter(row) {
            let status = '';
            if(row.applyStatus == 0) {
                status = "待审核";
            }else if(row.applyStatus == 1) {
                status = "审核通过";
            }else if(row.applyStatus == 2) {
                status = "驳回";
            }
            return status;
        },
        getRowKeys(row) {
            return row.orderApplyId;
        },
        // 审核记录 --- 打开审核记录弹框 
        auditRecord () {
            this.examVisible = true;
        },

        //关闭弹框   审核记录
        examineclose() {
            this.examVisible = false;
        },

        //确认关闭弹框   审核记录
        examinok() {
            this.examVisible = false;
            // this.$message("审核信息成功");
        },
        // 点击表格单元格
        clickApplyCode(rowData) {
            this.rowData = rowData;
            this.diaVisible = true;
        },

        closeDialog() {
            this.diaVisible = false;
        },

        // 编辑 -- 操作按钮2
        editbHandle(val) {
            if(val.applyType == 1064){ // 折扣特批的编辑页面
                this.$router.push({
                    path: "/discountpermit/editapplication",
                    query: {
                        pageStatus: "0",
                        orderApplyId: val.orderApplyId,
                        orderId: val.orderId,
                    }
                })
            }else if(val.applyType == 514){ // 工期特批的编辑页面
                this.$router.push({
                    path: "/projectpermit/editapplication",
                    query: {
                        pageStatus: "1",
                        orderApplyId: val.orderApplyId
                    }
                })
            }else if(val.applyType == 515){ // 返点的编辑页面
                this.$router.push({
                    path: "/rebatespermit/editapplication",
                    query: {
                        pageStatus: "2",
                        orderApplyId: val.orderApplyId
                    }
                })
            }else if(val.applyType == 522){ // 开票的编辑页面
                this.$router.push({
                    path: "/invoicepermit/editapplication",
                    query: {
                        pageStatus: "3",
                        orderApplyId: val.orderApplyId
                    }
                })
            }else if(val.applyType == 517){ // 退款的编辑页面 
                this.$router.push({
                    path: "/refundpermit/editapplication",
                    query: {
                        pageStatus: "4",
                        orderApplyId: val.orderApplyId
                    }
                })
            }else if(val.applyType == 513){ // 退货退款的编辑页面 不对 需修改
                this.$router.push({
                    path: "/regoodspermit/editapplication",
                    query: {
                        pageStatus: "5",
                    }
                })
            }else if(val.applyType == 513){ // 换货的编辑页面 没有 需确定 需修改
                this.$router.push({
                    path: "/exchangepermit/editapplication",
                    query: {
                        pageStatus: "6",
                        orderApplyId: val.orderApplyId
                    }
                })
            }else if(val.applyType == 517){ // 退折扣的编辑页面  退折扣在退款页
                this.$router.push({
                    path: "/rediscountpermit/editapplication",
                    query: {
                        pageStatus: "4",
                        orderApplyId: val.orderApplyId,
                    }
                })
            }else if(val.applyType == 521){ // 家装合同的编辑页面
                this.$router.push({
                    path: "/decorationpermit/editapplication",
                    query: {
                        pageStatus: "8",
                        orderApplyId: val.orderApplyId
                    }
                })
            }

            // this.currentPage = val;
            // this.searchfun()
        },
        // 删除
        delebHandle(val) {
            if(this.elsectVal.length > 0) {
                this.$message.warning("请勿选择");
                return;
            }
            // 待审核 驳回
            if(val.applyStatus == 0 ||  val.applyStatus == 2){
                this.$confirm('是否确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        orderApplyId: val.orderApplyId,
                    }
                    deleteOrderApply(data).then(res =>{
                        if(res.status == 200){
                            this.$message.success("操作成功");  
                            
                            this.$refs.multiTable.clearSelection();
                            let data = this.searchdatas();
                            this.getList(data);
                        }
                    }).catch(error =>{
                        console.log('申请 删除 表格列表 marketing/components/querycompon.vue', error);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    }); 
                });
            }else {
                this.$message({
                    message: '此订单状态不能删除',
                    type: 'warning'
                });
            }

        },
        
        // 改变页数
        currentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 改变单页条数
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
        },
        // 搜索条件获取
        searchdatas(){
            return {
                names: this.names,//订单编号
                applyTimeStart: this.searchData[0],//创建时间
                applyTimeEnd: this.searchData[1],
                auditTimeStart: this.searchData2[0],// 审核开始时间
                auditTimeEnd: this.searchData2[1],// 审核开始时间
             
                applyAt: this.applyAt, //申请人
                applyType: this.applyType,//申请类型
                applyStatus: this.applyStatus,//申请状态
                auditAt: this.auditAt,// 审核人

                
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        searchfun(){    //搜索
            this.currentPage = 1;
            let data = this.searchdatas();
            
            this.getList(data);
        },
        resetFun(){// 重置
          
            this.names = '';//订单编号
            this.searchData = [];//创建时间
            this.searchData2 = [],// 审核开始时间
             
            this.applyAt = ''; //申请人
            this.applyType = '';//申请类型
            this.applyStatus = '';//申请状态
            this.auditAt = '';// 审核人
            this.currentPage = 1;
    

            let data = this.searchdatas();
            this.getList(data);
        },
         // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
        
        // 获取表格数据
		getList(data){
            if(this.$route.path == "/discountpermit/discountapply") { // 折扣申请
                data.applyType = 1064;
            }else if(this.$route.path == "/projectpermit/projectapply"){ // 工期加急
                data.applyType = 1067;
            }

            listOrderApply(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    this.loading = false;   
                }
            }).catch(error =>{
                
                this.loading = false; 
                console.log('申请 表格列表 marketing/components/querycompon.vue', error);
            })
        },


        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},

    },
}
</script>
<style lang="scss">
.screencompon{
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
}
</style>
