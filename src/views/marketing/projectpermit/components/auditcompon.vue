<template>
<!-- 工期特批审核 -->
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
                <div class="table_list lvs attribute m-top20">

                    <el-table v-loading="loading"
                        border  :row-key="getRowKeys" @row-click="rowClick"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange"
                        :data="tabList"
                        style="width: 100%;" ref="multipleTable">
                        <el-table-column type="selection" width="55" :reserve-selection="true"  fixed></el-table-column>
                        <el-table-column prop="applyStatusName" align="center" label="审核状态" width="280" sortable fixed>
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip placement="right" visible-arrow >
                                        <div slot="content" class="tips tipFon">
                                            <p @click="auditHandle(scope.row)"  v-if="(scope.row.status == 0 || scope.row.status == 3) && btnJurisdiction.projectaudit_audit"  class="operaItems">审核</p>
                                            <p @click="auditRecord(scope.row)" class="operaItems" v-if="btnJurisdiction.projectaudit_record">审核记录</p>
                                        </div>
                                        <img :src="spot" alt="" class="attributesTips">
                                    </el-tooltip>

                                    <p class="text">{{scope.row.applyStatusName}}</p>
                                </div>       
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="name" label="当前节点"  width="240" sortable align="center"></el-table-column> -->
                        <el-table-column prop="applyCode" label="申请单号"  width="240" sortable align="center" fixed>
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.applyCode}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNumber" label="订单号" width="240" sortable align="center">
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.orderNumber}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="contractSerialNumber"  label="客户合同号" width="240" sortable align="center"></el-table-column>
                        <el-table-column  prop="orderType" label="订单类型" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="urgentDay" label="加急天数" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="originalTime" label="原预计交货日期"  width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="applyTime" label="申请后预计交货日期" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="storeName" label="所属门店" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="customerName" label="客户姓名" width="240" sortable align="center"> </el-table-column>
                        <el-table-column prop="customerPhone"  label="客户电话"  width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="otherPhone"  label="备用电话" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="address" label="订单地址" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="applyTime" label="申请时间" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="applyName" label="申请人" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="auditName" label="审核人" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="applyReasons" label="备注" width="240" sortable align="center"></el-table-column>
                    </el-table>
                </div>
            <!-- 点击单元格--申请单号的弹出框 -->
            <!-- <applydetail @close-dialog = "closeDialog" v-if="diaVisible"></applydetail> -->
            <!-- 点击审核记录的操作按耨--审核记录 -->
           <examinedia v-if = "examVisible" :applyType="applyTypes" :orderId="orderId"  :orderApplyId="orderApplyId" @close_examin="examineclose" @examin_ok="examinok"></examinedia>

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

import examinedia from "@/views/components/components/examinedia"; //审核记录

import {
    listProjectDelayUrgentApply, // 审核列表
} from 'api/marketing/projectpermit/index';

export default {
    components: {
        pagination,
        // applydetail,
        examinedia
    },
    data() {
        return {
            spot,
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,

            orderId: '',
            applyTypes: '',
            orderApplyId: '',

            // 搜索条件
            orderGroup: '',//订单编号
            applyName: '', //申请人
            applyType: '',//申请类型
            applyStatus: '',//申请状态
            auditName: '',// 审核人
            searchData: [],// 选择时间
            searchData2: [], // 审核时间
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
        //字典获取 申请类型
        this.listBaseDictFun(); 

        if(this.$route.path == "/discountpermit/discountaudit"){ // 折扣特批的审批页面
			  this.applyTypes = 1064;

		}else if(this.$route.path == "/projectpermit/projectaudit"){ // 工期特批的审批页面
			this.applyTypes = 1067;

		}else if(this.$route.path == "/rebatespermit/rebatesaudit"){ // 返点的审批页面
			this.applyTypes = 1078;

		}else if(this.$route.path == "/invoicepermit/invoiceaudit"){ // 开票的审批页面
			this.applyTypes = 1066;

		}else if(this.$route.path == "/refundpermit/refundaudit"){ // 退款的审批页面
			this.applyTypes = 1077;

		}else if(this.$route.path == "/decorationpermit/decorationaudit"){ // 家装合同的审批页面
			this.applyTypes = 1064;
        }
        
        // else if(this.$route.path == "/exchangepermit/exchangeapply"){ // 换货的审批页面
		// 	this.applyType = 1064;

		// }else if(this.$route.path == "/rediscountpermit/rediscountapply"){ // 退折扣的审批页面  退折扣在退款页
		// 	this.applyType = 1064;

		// }else if(this.$route.path == "/regoodspermit/regoodsapply"){ // 退货退款的审批页面
		// 	this.applyType = 1064;

		// }

    },
    methods: {
        getRowKeys(row) {
            return row.projectDelayUrgentApplyId;
        },
        rowClick(row, column, event) {
            if(column.property == 'applyCode') {
                if( this.$route.path == "/projectpermit/projectapply" ){ // 工期特批的编辑页面
                    this.$router.push({
                        path: "/projectpermit/viewapplication",
                        query: {
                            pageStatus: "1",
                            orderApplyId: row.orderApplyId,
                            orderId: row.orderId,
                        }
                    })
                }
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
        auditRecord (val) {
            this.orderId = val.orderId;
            this.orderApplyId= val.orderApplyId;

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
                path: "/projectpermit/auditmanagement",
                query: {
                    pageStatus: "1",
                    orderApplyId: val.orderApplyId,
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
                orderGroup: this.orderGroup,//订单编号
                applyStartTime: this.searchData ? this.searchData[0] : '',//创建时间
                applyEndTime: this.searchData ?  this.searchData[1] : '',
             
                applyName: this.applyName, //申请人
                applyStatus: this.applyStatus,//申请状态

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
            listProjectDelayUrgentApply(data).then(res =>{
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
                
                console.log('备货采购申请管理 备货管理 列表页 views/stockmanagement/stockpurchase/components/querycompon', error);
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