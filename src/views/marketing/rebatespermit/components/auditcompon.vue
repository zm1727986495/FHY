<template>
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="申请单号/订单编号/客户姓名/客户电话/客户地址" v-model="names" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
                </div>
                <div>
                    <el-date-picker
                        size="medium" v-model="searchData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="申请年/月/日" end-placeholder="申请年/月/日">
                    </el-date-picker>
                </div>
                <div>
                    <el-input placeholder="申请人" v-model="applyName" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
                </div>
                <div>
                    <el-select v-model="applyStatus" placeholder="选择状态" size="medium" clearable filterable >
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
                <div class="table_list lvs attribute m-top20"  v-loading="loading">

                    <el-table
                        border  :row-key="getRowKeys" @row-click="rowClick"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange"
                        :data="tabList"
                        style="width: 100%;" ref="multipleTable">

                        <el-table-column type="selection" width="55" :reserve-selection="true"  fixed="left"></el-table-column>
                        <el-table-column prop="applyStatus" align="center" label="审核状态" width="120" sortable  fixed="left">
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip placement="right" visible-arrow >
                                        <div slot="content" class="tips tipFon">
                                            <p @click="auditHandle(scope.row)" v-if="(scope.row.applyStatus == 0 ||scope.row.applyStatus == 3)  && btnJurisdiction.rebatesaudit_audit" class="operaItems">审核</p>
                                            <p @click="auditRecord(scope.row)" class="operaItems"  v-if="btnJurisdiction.rebatesaudit_record">审核记录</p>
                                        </div>
                                        <img :src="spot" alt="" class="attributesTips">
                                    </el-tooltip>
                                    <!-- 0待审核，1审核通过，2驳回 -->
                                    <p class="text" v-if="scope.row.applyStatus == 0">待审核</p>
                                    <p class="text" v-if="scope.row.applyStatus == 1">审核通过</p>
                                    <p class="text" v-if="scope.row.applyStatus == 2">驳回</p>
                                    <p class="text" v-if="scope.row.applyStatus == 3">审核中</p>
                                    <p class="text" v-if="scope.row.applyStatus == 4">拒绝</p>
                                </div>       
                            </template>
                        </el-table-column>
                        <el-table-column  prop="applyCode" label="申请单号"  width="130" sortable align="center"  fixed="left">
                            <template slot-scope="scope">
                                <div>
                                     <!-- @click="clickCode" -->
                                    <p class="operation table_action_span">{{scope.row.applyCode}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="rebatesMoney" label="返点金额/元" width="130" sortable align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.rebatesMoney | fenge}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNumber" label="订单编号" width="130" sortable align="center">
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.orderNumber}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="storeName" label="所属门店" width="130" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="contractSerialNumber" label="客户合同号" width="130" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="referrerName" label="推荐人姓名" width="120" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="phone" label="电话" width="130" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="所属公司"  width="130" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="position" label="职位" width="120" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="referrerLevelName" label="返点级别" width="130" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderGoodsType" label="订单货品类型" width="120" align="center">
                            <!-- 订单货品类型  1成品 2订制品 -->
                            <template slot-scope="scope">
                                <div>
                                    <p v-if="scope.row.orderGoodsType == '1'">成品</p>
                                    <p v-if="scope.row.orderGoodsType == '2'">订制品</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderTypeName" label="订单类型" width="120" align="center"></el-table-column>
                        <el-table-column prop="brandName" label="品牌" width="120" align="center"></el-table-column>
                        <el-table-column prop="categoryName" label="品类" width="120" align="center"></el-table-column>
                        <el-table-column prop="customerName" label="客户姓名" width="130" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" label="客户电话" width="130" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="otherPhone" label="备用电话"  width="130" align="center"></el-table-column>
                        <el-table-column prop="applyName" label="申请人" width="120" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createTime" label="申请时间" width="160" align="center"></el-table-column>
                        <el-table-column prop="auditName"  label="审核人"  width="120" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间"  width="160" align="center"></el-table-column>
                        <el-table-column prop="address"  label="订单地址"  width="150" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="remake"  label="备注" width="150" align="center" show-overflow-tooltip></el-table-column>
                    </el-table>    

                </div>
            <!-- 点击单元格--申请单号的弹出框 -->
            <!-- <applydetail @close-dialog = "closeDialog" v-if="diaVisible"></applydetail> -->
            <!-- 点击审核记录的操作按耨--审核记录 -->
            <examinedia v-if = "examVisible" :applyType="1078"  :orderApplyId="orderApplyId" :orderId="orderId" @close_examin="examineclose" @examin_ok="examinok"></examinedia>
            <!-- <examinedia v-if = "examVisible" @close_examin="examineclose" @examin_ok="examinok"></examinedia> -->

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

// import applydetail from './applydetail'; // 申请详情
import examinedia from "@/views/components/components/examinedia"; //审核记录

import {
    listRecommendRebatesAudit// 返点审核列表
} from 'api/marketing/rebatespermit/index';


export default {
    components: {
        pagination,
        // applydetail,
        examinedia
    },
    filters: {
        // 千分号过滤方法
        // fenge(val){
        //        return val ? (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',') : 0;
        // }
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
    data() {
        return {
            spot,
            loading: true, // table的loading控制
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,

            orderId: '',
            orderApplyId: '',

             // 搜索条件
            names: '',//订单编号
            applyName: '', //申请人
            applyType: '',//申请类型
            applyStatus: '',//申请状态
            auditName: '',// 审核人
            searchData: [],// 选择时间

            // 条件
            applyList: [],  // 选择申请人条件
            typeList: [],  // 选择申请类型条件
            statusList: [{
                label: "待审核", value: "0",
            },{
                label: "审核通过", value: "1",
            },{
                label: "驳回", value: "2",
            },{
                label: "审核中", value: "3",
            }],
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
			btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
			
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

    },
    methods: {
         // 审核记录 --- 打开审核记录弹框 
        auditRecord (rowData) {
            this.orderId = rowData.orderId;
            this.orderApplyId = rowData.orderApplyId;

            this.examVisible = true;
        },

        getRowKeys(row) {
            return row.recommendRebatesApplyId;
        },

        rowClick(row, column, event) {
            if(column.property == 'applyCode') {
                if( this.$route.path == "/rebatespermit/rebatesaudit"){ // 返点的编辑页面

                    this.$router.push({
                        path: "/rebatespermit/viewapplication",
                        query: {
                            pageStatus: "2",
                            orderApplyId: row.orderApplyId,
                            orderId: row.orderId,
                            recommendRebatesApplyId: row.recommendRebatesApplyId,
                            applyStatus: row.applyStatus,
                        }
                    })
                }
                return;
            }else if(column.property == 'orderNumber'){
                this.$router.push({path:'/ordermm/details',query:{orderId:row.orderId}})
            }
            
            this.$refs.multiTable.toggleRowSelection(row)
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
        clickCode() {
            this.diaVisible = true;
        },

        closeDialog() {
            this.diaVisible = false;
        },
        // 审核
        auditHandle(val) {
            this.$router.push({
                path: "/rebatespermit/auditmanagement",
                query: {
                    pageStatus: "2",
                    orderId: val.orderId,
                    orderApplyId: val.orderApplyId,
                    recommendRebatesApplyId:val.recommendRebatesApplyId,
                    workFlowBusinessId: val.workFlowBusinessId,
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
                names: this.names,//订单编号
                applyStartTime: this.searchData ?this.searchData[0] : "",//创建时间
                applyEndTime: this.searchData ? this.searchData[1] : "",
                applyName: this.applyName, //申请人
                status: this.applyStatus,//申请状态
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
            this.applyName = ''; //申请人
            this.applyStatus = '';//申请状态
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
            listRecommendRebatesAudit(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    this.loading = false;
                }
            }).catch(error =>{
                this.loading = false;
                console.log('返点申请管理 审核列表页 views/marketing/rebatespermit/components/auditcompon', error);
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