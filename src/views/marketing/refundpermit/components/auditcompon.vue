<template>
    <div class="auditcompon">
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
                    <el-input placeholder="建材城收据号" v-model="buildingReceiptNumber" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
                </div>
                <div v-if="isShow">
                    <el-select v-model="applyStatus" placeholder="选择状态" size="medium" clearable filterable >
                        <el-option
                            v-for="item in statusList" :key="item.value"
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="storeId" placeholder="门店" size="medium" clearable filterable >
                        <el-option
                            v-for="item in storeList" :key="item.storeId"
                            :label="item.storeName" :value="item.storeId">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-input placeholder="申请人" v-model="applyName" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
                </div>
            </div>
            <div class="head_nav_btn">
                <span class="fontMore cursors margright" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                <el-button class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                <el-button class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
            </div>
        </div>
        <div class="h-width"></div>
        <slot></slot>
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20"  v-loading="loading">
            <el-table max-height="500" border :row-key="getRowKeys" @row-click="rowClick"
                :row-class-name="tableRowClassName" @selection-change="handleSelectionChange"
                :data="tabList" style="width: 100%;" ref="multipleTable">
                <el-table-column type="selection" width="55" :reserve-selection="true" fixed='left'></el-table-column>
                <el-table-column prop="applyStatus" align="center" label="退款状态" width="120" fixed='left'>
                    <template slot-scope="scope">
                        <div>
                            <el-tooltip placement="right" visible-arrow >
                                <div slot="content" class="tips tipFon">
                                    <p @click="auditHandle(scope.row)"  v-if="(scope.row.applyStatus == 0 || scope.row.applyStatus == 3 || scope.row.applyStatus == 2)  && btnJurisdiction.refundaudit_audit" class="operaItems">审核</p>
                                    <p @click="auditRecord(scope.row)" class="operaItems" v-if="btnJurisdiction.refundaudit_record">审核记录</p>
                                </div>
                                <img :src="spot" alt="" class="attributesTips">
                            </el-tooltip>
                            <!-- 0待审核，1审核通过，2驳回 -->
                            <!-- 申请状态：0待审核，1审核通过，2驳回，3审核中 4拒绝 -->
                            <p class="text" v-if="scope.row.applyStatus == 0">待审核</p>
                            <p class="text" v-if="scope.row.applyStatus == 1">审核通过</p>
                            <p class="text" v-if="scope.row.applyStatus == 2">驳回</p>
                            <p class="text" v-if="scope.row.applyStatus == 3">审核中</p>
                            <p class="text" v-if="scope.row.applyStatus == 4">拒绝</p>
                        </div>       
                    </template>
                </el-table-column>
                <el-table-column  prop="applyCode" label="退款单号" width="150" align="center" fixed='left'show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                        <div><p class="operation table_action_span">{{scope.row.applyCode}}</p></div>
                    </template>
                </el-table-column>
                <el-table-column prop="customerName" label="客户姓名" width="120" align="center"></el-table-column>
                <el-table-column prop="customerPhone" label="客户电话" width="150" align="center"></el-table-column>
                <el-table-column  prop="address" label="订单地址"  width="200" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="storeName" label="所属门店"  width="150" align="center"></el-table-column>
                <el-table-column prop="refundMode" label="退款类型" width="150" align="center">
                    <template slot-scope="scope">
                        <div>
                            <p v-if="scope.row.refundMode==1">退款</p>
                            <p v-if="scope.row.refundMode==2">退单退款</p>
                            <p v-if="scope.row.refundMode==3">折扣退款</p>
                            <p v-if="scope.row.refundMode==4">退货退款</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="refundTypeName" label="退款方式" width="160" align="center"></el-table-column>
                <el-table-column prop="refundReason" label="退款原因" width="180" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="refundMoney" label="退款金额"  width="150" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.refundMoney | fenge}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="buildingReceiptNumber" label="建材城收据号" width="160" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderNumber" label="订单编号" width="150" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                    <div>
                      <p
                        class="table_action_span"
                        @click="orderDetails(scope.row)"
                      >{{scope.row.orderNumber}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="applyName" label="申请人" width="120" align="center"></el-table-column>
                <el-table-column prop="applyTime" label="申请时间"  width="170" align="center"></el-table-column>
                <el-table-column prop="contractSerialNumber" label="客户合同号" width="150" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="contractMoney" label="合同金额"  width="150" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.contractMoney | fenge}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" label="品牌"  width="100" align="center"></el-table-column>
                <el-table-column prop="categoryName" label="品类"  width="100" align="center"></el-table-column>
                <el-table-column prop="auditName" label="审核人" width="120" align="center"></el-table-column>
                <el-table-column prop="auditTime" label="审核时间" width="160" align="center"></el-table-column>
                <!-- <el-table-column prop="contractMoneyRemark" label="合同金额备注"  width="180" align="center"  show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="name" label="地址备注" width="200" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
            <ul class="priceclass">
                <li>退款合计金额： {{priceAll | fenge}}</li>
                <li>合同合计金额： {{contractMoney | fenge}}</li>
            </ul>
        </div>
        <!-- 点击单元格--申请单号的弹出框 -->
        <!-- <applydetail @close-dialog = "closeDialog" v-if="diaVisible"></applydetail> -->
        <!-- 点击审核记录的操作按耨--审核记录 -->
        <examinedia v-if = "examVisible" @close_examin="examineclose"  :orderApplyId="orderApplyId" @examin_ok="examinok"></examinedia>

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
    listOrderApply, // 申请列表 -- 应该改成审核列表
    listStockUpApply, 
    listOrderApplyExamineVO,
    recommendedStores
} from 'api/marketing/refundpermit/index';
import { 
    listBaseDict //字典
} from "api/order/order/order";
export default {
    components: {
        pagination,
        // applydetail,
        examinedia
    },
    data() {
        return {
            isShow: false,
            spot,
            loading: true, // table的loading控制
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,

            orderApplyId:'',

             // 搜索条件
            orderGroup: '',//订单编号
            buildingReceiptNumber: '',//订单编号
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
            storeList:[],
            storeId:''
            
            
        }
    },
    computed: {
        // 退款金额总和
        priceAll(){
            let num = 0
            this.tabList.forEach(item =>{
                num+=Number(item.refundMoney)
            })
            return num
        },
        // 合同金额总和
        contractMoney(){
            let num = 0
            this.tabList.forEach(item =>{
                num+=Number(item.contractMoney)
            })
            return num
        },
    },
    filters: {
        // 千分号过滤方法
        // fenge(val){
        //     return val ? (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',') : 0;
        // }
        fenge(amount) {
            const validateNumber = n =>
                !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;
            if (!validateNumber(+amount)) {
                return amount;
            }
            return (+amount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
        },
    },
    created() {
        // let start = new Date()
        // start.setTime(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1))
        // this.searchData[0] = start
        // this.searchData[1] = new Date((new Date).getTime() + 24*60*60*1000)
        let date = new Date();
        date.setDate(1);
        this.searchData[0] = date.getFullYear() + "-" +(date.getMonth() + 1) + "-" +date.getDate();
        this.searchData[1] = this.getNowFormatDate()
        let data = this.searchdatas();
        this.getList(data);  

        //字典获取 申请类型
        this.listBaseDictFun();
        this.getStore()
    },
    methods: {
        //订单详情
        orderDetails(row) {
            this.$router.push({
            path: "/ordermm/details",
            query: { orderId: row.orderId }
            });
        },
        //获取门店
        getStore(){
            recommendedStores().then(res=>{
               if(res.status == 200){
                   this.storeList = res.data;
               }
            }).catch(error=>{
                console.error('获取门店',error);
            })
        },
        clearTable(){
            this.$refs.multipleTable.clearSelection();
        },
        getNowFormatDate() {
            //获取当前日期
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;



            //获取明天日期
            // var day3 = new Date();
            // day3.setTime(day3.getTime()+24*60*60*1000);
            // return day3.getFullYear()+"-" + (day3.getMonth()+1) + "-" + day3.getDate();
        },
        getRowKeys(row) {
            return row.orderApplyRefundId;
        },
        rowClick(row, column, event) {
            if(column.property == 'applyCode') {
                this.$router.push({
                    path: "/refundpermit/viewauditapplication",
                    query: {
                        pageStatus: "4",
                        orderApplyId: row.orderApplyId,
                        orderId: row.orderId,
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
        //  1退款 2 退单退款 3折扣退款
        statusformatter(row) {
            let status = "";

            if(row.refundMode == 1) {
                status = "退款"
            }else if(row.refundMode == 3) {
                status = "折扣退款"
            }
            return status;
        },
        // 审核记录 --- 打开审核记录弹框 
        auditRecord (rowData) {
            this.orderApplyId= rowData.orderApplyId;

            this.examVisible = true;
        },

        //关闭弹框   审核记录
        examineclose() {
            this.examVisible = false; // 关闭弹框 
        },

        //确认关闭弹框   审核记录
        examinok() {
            this.examVisible = false; // 关闭弹框 
            // this.$message("审核信息成功");
        },
        // 点击表格单元格申请人
        clickCell() {
            this.diaVisible = true;
        },

        closeDialog() {
            this.diaVisible = false;
        },

        // 审核
        auditHandle(val) {
            this.$router.push({
                path: "/refundpermit/auditmanagement",
                query: {
                    pageStatus: "4",
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
                buildingReceiptNumber: this.buildingReceiptNumber,//订单编号
                applyStartTime: this.searchData ? this.searchData[0] : '',//创建时间
                applyEndTime: this.searchData ?  this.searchData[1] : '',
             
                applyName: this.applyName, //申请人
                applyStatus: this.applyStatus,//申请状态
                storeId:this.storeId,
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
        },
        searchfun(){    //搜索
            this.currentPage = 1;

            let data = this.searchdatas();
            this.getList(data);
        },
        resetFun(){// 重置
            this.orderGroup = '';//订单编号
            this.buildingReceiptNumber = '';//订单编号
            this.searchData = [];//创建时间
             
            this.applyName = ''; //申请人
            this.applyStatus = '';//申请状态
            this.currentPage = 1;
            this.storeId = ''
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
            listOrderApplyExamineVO(data).then(res =>{
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
.auditcompon{
    .warp_head_list {
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        .head_nav_btn{
            width: 120px;
        }
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
            // text-align: center;
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