<template>
<!-- 家装合同审核 -->
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="申请单号/订单编号/客户姓名/客户电话/客户地址" v-model="orderGroup" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
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
                    <el-input placeholder="申请人" v-model="applyName" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
                </div>
                <div>
                    <el-select v-model="status" placeholder="选择状态" size="medium"  clearable filterable>
                        <el-option
                            v-for="item in statusList" :key="item.value"
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="head_nav_btn">
                <el-button class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                <el-button class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
            </div>
        </div>
        <div class="h-width"></div>
        <slot></slot>

        <!-- table表格 -->
                <div class="table_list lvs attribute m-top20"   v-loading="loading">

                    <el-table
                        border  :row-key="getRowKeys" @row-click="rowClick"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange"
                        :data="tabList" ref="multipleTable"
                        style="width: 100%;" @cell-click="clickCell">
                        <el-table-column type="selection" width="55" :reserve-selection="true"  fixed></el-table-column>
                        <el-table-column prop="statusName" align="center" label="审核状态" width="150" sortable fixed>
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip placement="right" visible-arrow >
                                        <div slot="content" class="tips tipFon">
                                            <p @click="auditHandle(scope.row)"  v-if="(scope.row.applyStatus == 0 || scope.row.applyStatus == 3) && btnJurisdiction.decorationaudit_audit"  class="operaItems">审核</p>
                                            <p @click="auditRecord(scope.row)" class="operaItems"  v-if="btnJurisdiction.decorationaudit_record">审核记录</p>
                                        </div>
                                        <img :src="spot" alt="" class="attributesTips">
                                    </el-tooltip>

                                    <p class="text" v-if="scope.row.applyStatus == 0">待审核</p>
                                    <p class="text" v-if="scope.row.applyStatus == 1">审核通过</p>
                                    <p class="text" v-if="scope.row.applyStatus == 2">驳回</p>
                                    <p class="text" v-if="scope.row.applyStatus == 3">审核中</p>
                                    <p class="text" v-if="scope.row.applyStatus == 4">拒绝</p>
                                </div>       
                            </template>
                        </el-table-column>

                        <el-table-column prop="homeContractNumber" align="center" label="家装合同号" width="180" sortable fixed>
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.homeContractNumber}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="contractMoney" label="合同金额" width="180" sortable align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.contractMoney | fenge}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="companyName" label="家装公司"  width="180" sortable align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderNumber" label="订单号" width="180" sortable align="center">
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.orderNumber}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="contractSerialNumber" label="客户合同号"  width="240" sortable align="center" show-overflow-tooltip></el-table-column> -->
                        <el-table-column prop="orderTypeName" label="订单类型"  width="120" sortable align="center"></el-table-column>
                        <el-table-column prop="customerName" label="客户姓名" width="120" sortable align="center"></el-table-column>
                        <el-table-column prop="customerPhone" label="客户电话" width="120" sortable align="center"></el-table-column>
                        <el-table-column prop="categoryName" label="产品类别"  width="120" sortable align="center"></el-table-column>
                        <el-table-column prop="brandName" label="产品品牌" width="120" sortable align="center"></el-table-column>
                        <el-table-column prop="storeName" label="所属门店" width="150" sortable align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" label="订单地址"  width="150" sortable align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="applyTime" label="申请时间" width="160" sortable align="center"></el-table-column>
                        <el-table-column prop="applyName" label="申请人" width="120" sortable align="center"></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间" width="160" sortable align="center"></el-table-column>
                        <el-table-column prop="auditName" label="审核人" width="120" sortable align="center"></el-table-column>
                    </el-table>    

                </div>
            <!-- 点击单元格--申请单号的弹出框 -->
            <!-- <applydetail @close-dialog = "closeDialog" v-if="diaVisible"></applydetail> -->
            <!-- 点击审核记录的操作按耨--审核记录 -->
            <examinedia v-if="examVisible"  :applyType="1065" :orderId="orderId"  :orderApplyId="orderApplyId" @close_examin="examineclose" @examin_ok="examinok"></examinedia>

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
import {
    listBaseDict,
} from 'api/order/order/order';
import spot from '@/assets/images/spot.png';
import pagination from "@/views/components/pagination";

// import applydetail from './applydetail'; // 申请详情
import examinedia from '@/views/components/components/examinedia'; // 审核记录

import {
    listHomeCollectionApply, // 家装代收合同审核列表
} from 'api/administrationCenter/decorationpermit/index';

export default {
    components: {
        pagination,
        // applydetail,
        examinedia
    },
    data() {
        return {
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
            spot,
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索条件
            orderGroup: '',//订单编号
            applyName: '', //申请人
            applyType: '',//申请类型
            status: '',//申请状态
            auditName: '',// 审核人
            searchData: [],// 选择时间

            orderApplyId: '',

            // 条件
            applyList: [],  // 选择申请人条件
            typeList: [],  // 选择申请类型条件
            statusList: [{
                label: "待审核", value: "0",
            },{
                label: "审核通过", value: "1",
            },{
                label: "驳回", value: "2",
            }],
            auditList: [],  // 选择审核人条件
            // 申请详情弹出框的显示与否
            diaVisible: false,
            examVisible: false, // 审核记录弹框是否显示
            // 表格
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据

            loading: true, // table的loading控制
            
            
        }
    },
    filters: {
        // 千分号过滤方法
        // fenge(val){
        //     return val ? (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',') : 0;
        // },

        fenge(amount) {
            const validateNumber = n =>
                !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;

            if (!validateNumber(+amount)) {
                return amount;
            }
            return (+amount)
                .toFixed(2)
                .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
        },
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
        getRowKeys(row) {
            return row.homeCollectionApplyId;
        },
        

        rowClick(row, column, event) {
            if(column.property == 'homeContractNumber') {
                this.$router.push({
                    path: "/decorationpermit/viewapplication",
                    query: {
                        pageStatus: "8",
                        orderApplyId: row.orderApplyId,
                        orderId: row.orderId,
                        homeCollectionApplyId: row.homeCollectionApplyId,
                        applyStatus: row.applyStatus,
                        auditAt:  row.auditAt,
                        auditTime:  row.auditTime,
                        createAt:  row.createAt,
                        createTime:  row.createTime,
                    }
                })
                
                return;
            }
            
            this.$refs.multiTable.toggleRowSelection(row)
        },
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
        // 审核记录 --- 打开审核记录弹框 
        auditRecord(val) {
            this.orderId = val.orderId;
            this.orderApplyId = val.orderApplyId;

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
        clickCell(row,column,event,cell) {
            if(column.label === "申请单号"){
                // this.getinStoreList(id);
                this.diaVisible = true;
            }
        },

        closeDialog() {
            this.diaVisible = false;
        },

        // 审核
        auditHandle(val) {
            this.$router.push({
                path: "/decorationpermit/auditmanagement",
                query: {
                    pageStatus: "8",
                    orderApplyId: val.orderApplyId,
                    workFlowBusinessId: val.workFlowBusinessId,
                    homeCollectionApplyId: val.homeCollectionApplyId,
                }
            });
        },

        // 改变页码
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

        // 搜索条件获取
        searchdatas(){
            return {
                orderGroup: this.orderGroup,//订单编号
                applyStartTime: this.searchData ? this.searchData[0] : '',//创建时间
                applyEndTime:  this.searchData ? this.searchData[1] : '',
             
                applyName: this.applyName, //申请人
                status: this.status,//申请状态

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
            this.orderGroup = '';//订单编号
            this.searchData = [];//创建时间
             
            this.applyName = ''; //申请人
            this.status = '';//申请状态
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
            this.loading = true;
            listHomeCollectionApply(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    
                    this.tabList.forEach(item => {
                        Number(item.applyStatus)
                    })
                    this.loading = false;
                }
            }).catch(error =>{
                
                this.loading = false;
                console.log('家装合同申请管理 审核列表页 views/administrationCenter/decorationpermit/components/auditcompon', error);
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
    .warp_head_list {
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        .list_top{
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            >div{
                margin-bottom: 10px;
                padding: 0px 5px;
                width: 25%;
                >div{
                    width: 100%;
                }
            }
            .fontMore{
                color:#d0cfcf;
            }
            .margright{
                margin-right: 5px;
            }
        }
        .head_nav_btn{
            width: 200px;
            text-align: center;
            margin-bottom: 0px;
            .fontMore{
                color:#d0cfcf;
            }
            button+button{
                margin-left: 10px;
            }
        }
    }
}
</style>