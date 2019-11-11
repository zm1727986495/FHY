<template>
    <!-- 折扣、工期、返点、开票、退款、退货退款、换货、退折扣、家装代收合同/申请 (所有的申请的申请列表) -->
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50" clearable  @keydown.enter.native="searchfun"></el-input>
                </div>
                <div>
                    <el-date-picker 
                    size="medium"
                    v-model="searchData"
                    type="daterange"
                    value-format='yyyy-MM-dd'
                    format='yyyy-MM-dd'
                    range-separator="-"
                    start-placeholder="申请年/月/日"
                    end-placeholder="申请年/月/日">
                    </el-date-picker>
                </div>
                <div>
                    <el-input placeholder="申请人" v-model="applyName" size="medium" maxlength="50" clearable  @keydown.enter.native="searchfun"></el-input>
                </div>
                <div>
                    <el-select v-model="applyStatus" placeholder="选择申请状态" size="medium"  clearable filterable >
                        <el-option v-for="item in statusList" :key="item.value"
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
               <div  v-if="isShow">
                   <el-input placeholder="审核人" v-model="auditName" size="medium" maxlength="50" clearable @keydown.enter.native="searchfun"></el-input>
                </div>
                <div  v-if="isShow">
                    <el-date-picker size="medium" v-model="searchData2" type="daterange" value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-" start-placeholder="审核年/月/日" end-placeholder="审核年/月/日">
                    </el-date-picker>
                </div>
            </div>
            <div class='head_nav_btn'>
                <span class="fontMore cursors margright" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                <el-button class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                <el-button  class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
            </div>
        </div>
        <div class="h-width"></div>
        <slot></slot>
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20"  v-loading="loading">
            <el-table ref="multiTable" border :row-key="getRowKeys"  max-height="500" @row-dblclick="rowClick" :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
                <el-table-column type="selection" width="55" :reserve-selection="true" fixed='left'></el-table-column>
                <el-table-column prop="applyStatus" align="center" label="申请状态" width="130" :formatter="statusformatter" fixed='left'>
                    <template slot-scope="scope">
                        <div>
                            <el-tooltip placement="right" visible-arrow >
                                <div slot="content" class="tips tipFon">
                                    <p @click="editbHandle(scope.row)" v-if="btnJurisdiction[editHandler] && scope.row.applyStatus == 2" class="operaItems">编辑</p>
                                    <!-- <p @click="delebHandle(scope.row)" v-if="scope.row.applyStatus == 2" class="operaItems">删除</p> -->
                                    <p @click="auditRecord(scope.row)" class="operaItems" v-if="btnJurisdiction[recordHandler]" >审核记录</p>
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
                <el-table-column  prop="applyCode" label="申请单号" width="150" sortable align="center" show-overflow-tooltip fixed='left'>
                    <template slot-scope="scope">
                        <div><p class="operation table_action_span" >{{scope.row.applyCode}}</p></div>
                    </template>
                </el-table-column>
                <el-table-column prop="customerName" label="客户姓名" width="120" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerPhone" label="客户电话" width="120" align="center"></el-table-column>
                <el-table-column prop="storeName" label="所属门店"  width="150" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="applyTime" label="申请时间" width="170" align="center"></el-table-column>
                <el-table-column prop="applyName" label="申请人" width="120" align="center"></el-table-column>
                <el-table-column prop="auditName" label="审核人" width="120" align="center"></el-table-column>
                <el-table-column prop="auditTime" label="审核时间" width="160" align="center"></el-table-column>
                <el-table-column prop="rowApplyName" label="申请类型" width="180" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="applyReason" label="申请原因" width="200" align="center" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="auditName" label="审核人"  width="120" align="center"></el-table-column>
                <el-table-column prop="auditTime" label="审核时间" width="170" align="center"></el-table-column> -->
                <el-table-column prop="orderNumber" label="订单号" width="150" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div><p class="operation table_action_span">{{scope.row.orderNumber}}</p></div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderTypeName"  label="订单类型" width="100" align="center"></el-table-column>
                <el-table-column prop="brandName" label="品牌" width="100" align="center"></el-table-column>
                <el-table-column prop="categoryName" label="品类" width="100" align="center"></el-table-column>
                <el-table-column prop="otherPhone" label="备用电话" width="120" align="center"></el-table-column>
                <el-table-column prop="address"  label="订单地址"  width="180" align="center" show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
        <!-- 点击单元格--申请单号的弹出框 -->
        <applydetail @close-dialog = "closeDialog" v-if="diaVisible" :rowData="rowData"></applydetail>
        <!-- 点击审核记录的操作按耨--审核记录 -->
        <examinedia v-if="examVisible"  :applyType="applyTypes" :orderId="orderId"  :orderApplyId="orderApplyId"  @close_examin="examineclose" @examin_ok="examinok" ></examinedia>

        <!-- 分页 -->
        <div class="pagination_wrap">
            <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" 
            @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
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
            isRefund: false,
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,
            rowData: '',
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
            editHandler: '', // 编辑
            recordHandler: '', // 审核记录

            orderId: '',
            applyTypes: '',
            orderApplyId: '',

            // 搜索条件
            names: '', // 条件搜索
            searchData: [],// 选择时间
            searchData2: [],// 选择时间
            applyName: '', // 选择申请人
            applyType: '', // 选择申请类型
            applyStatus: '',  // 状态
            auditName: '', // 选择审核人
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
            },{
                label: "拒绝", value: "4",
            }],  // 选择状态条件
            auditList: [],  // 选择审核人条件

            // 申请详情弹出框的显示与否
            diaVisible: false,
            examVisible: false, // 审核记录弹框是否显示
            // 表格
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
            loading: true, // table的loading控制
            isShow: false,
        }
    },
    watch: {
       
    },
    created() {

        let date = new Date();
        date.setDate(1);
        this.searchData[0] = date.getFullYear() + "-" +(date.getMonth() + 1) + "-" +date.getDate();
        this.searchData[1] = this.getNowFormatDate()
        //字典获取 申请类型
        // this.listBaseDictFun();
        
        // 审核记录
        if(this.$route.path == "/discountpermit/discountapply"){ // 折扣特批的申请页面
			this.applyTypes = 1064;
            this.editHandler = 'discountapply_edit'; // 编辑
            this.recordHandler = 'discountapply_record'; // 审核记录

		}else if(this.$route.path == "/projectpermit/projectapply"){ // 工期特批的申请页面
			this.applyTypes = 1067;
            this.editHandler = 'projectapply_edit'; // 编辑
            this.recordHandler = 'projectapply_audit'; // 审核记录

		}else if(this.$route.path == "/rebatespermit/rebatesapply"){ // 返点的申请页面
            this.applyTypes = 1078;
            
            this.editHandler = 'rebatesapply_edit'; // 编辑
            this.recordHandler = 'rebatesapply_record'; // 审核记录


		}else if(this.$route.path == "/invoicepermit/invoiceapply"){ // 开票的申请页面
			this.applyTypes = 1066;
            this.editHandler = 'invoiceapply_edit'; // 编辑
            this.recordHandler = 'invoiceapply_record'; // 审核记录

		}else if(this.$route.path == "/refundpermit/refundapply"){ // 退款的申请页面
			this.applyTypes = 1077;
            this.editHandler = 'refundapply_edit'; // 编辑
            this.recordHandler = 'refundapply_record'; // 审核记录
            this.isRefund = true; // 退款申请页面

		}else if(this.$route.path == "/decorationpermit/decorationapply"){ // 家装合同的申请页面
			this.applyTypes = 1065;
            this.editHandler = 'decorationapply_edit'; // 编辑
            this.recordHandler = 'decorationapply_record'; // 审核记录

        }

        let data = this.searchdatas();
        this.getList(data);

        // else if(this.$route.path == "/regoodspermit/regoodsapply"){ // 退货退款的审批页面
		// 	this.applyType = 1064;

		// }
    },
    methods: {
        
        getNowFormatDate() {
            //获取当前日期
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;

            

            //获取明天时间
            // var day3 = new Date();
            // day3.setTime(day3.getTime()+24*60*60*1000);
            // return day3.getFullYear()+"-" + (day3.getMonth()+1) + "-" + day3.getDate();
        },
        //字典获取 申请类型
        // listBaseDictFun(){
        //     let data = {
        //         dataType: "APPLY_TYPE"
        //     };
        //     listBaseDict(data).then(res=>{
        //         if(res.status == 200) {
        //             this.typeList = res.data;
        //         }
        //     })
        // },
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
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
        rowClick(row, column, event) {
            if(column.property == 'applyCode') {
                if( this.$route.path == "/discountpermit/discountapply" ){ // 折扣特批的申请页面

                    this.$router.push({
                        path: "/discountpermit/viewapplication", // 折扣特批的编辑页面
                        query: {
                            pageStatus: "0",
                            orderApplyId: row.orderApplyId,
                            orderId: row.orderId,
                        }
                    })
                }else if( this.$route.path == "/projectpermit/projectapply" ){ // 工期特批的编辑页面


                    this.$router.push({
                        path: "/projectpermit/viewapplication",
                        query: {
                            pageStatus: "1",
                            orderApplyId: row.orderApplyId,
                            orderId: row.orderId,
                        }
                    })
                }else if( this.$route.path == "/rebatespermit/rebatesapply"){ // 返点的编辑页面

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
                }else if( this.$route.path == "/invoicepermit/invoiceapply" ){ // 开票的编辑页面

                    this.$router.push({
                        path: "/invoicepermit/viewapplication",
                        query: {
                            pageStatus: "3",
                            orderApplyId: row.orderApplyId,
                            orderId: row.orderId,
                        }
                    })
                }if( this.$route.path == "/refundpermit/refundapply" ){ // 退款的编辑页面 
                        this.$router.push({
                            path: "/refundpermit/viewapplication",
                            query: {
                                pageStatus: "4",
                                orderApplyId: row.orderApplyId,
                                orderId: row.orderId,
                            }
                        })
                }else if( this.$route.path == "/decorationpermit/decorationapply" ){ // 家装合同的编辑页面

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
                }
                return;
            }else if(column.property == 'orderNumber') {
                this.$router.push({path: "/ordermm/details", query:{orderId: row.orderId, orderNumber: row.orderNumber}});
                return;
            }
            
            this.$refs.multiTable.toggleRowSelection(row)
        },
        // 审核记录 --- 打开审核记录弹框 
        auditRecord (val) {
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
        // 点击表格单元格 -- 申请单号
        clickApplyCode(rowData) {
            if( this.$route.path == "/refundpermit/refundapply" ){ // 退款的编辑页面 

                this.$router.push({
                    path: "/refundpermit/viewapplication",
                    query: {
                        pageStatus: "4",
                        orderApplyId: val.orderApplyId,
                        orderId: val.orderId,
                    }
                })
            }
            // this.rowData = rowData;
            // this.diaVisible = true;
        },

        closeDialog() {
            this.diaVisible = false;
        },

        // 编辑 -- 操作按钮2
        editbHandle(val) {
            if( this.$route.path == "/discountpermit/discountapply" ){ // 折扣特批的申请页面

                this.$router.push({
                    path: "/discountpermit/editapplication", // 折扣特批的编辑页面
                    query: {
                        pageStatus: "0",
                        orderApplyId: val.orderApplyId,
                        orderId: val.orderId,
                    }
                })
            }else if( this.$route.path == "/projectpermit/projectapply" ){ // 工期特批的编辑页面


                this.$router.push({
                    path: "/projectpermit/editapplication",
                    query: {
                        pageStatus: "1",
                        orderApplyId: val.orderApplyId,
                        orderId: val.orderId,
                    }
                })
            }else if( this.$route.path == "/rebatespermit/rebatesapply" ){ // 返点的编辑页面

                this.$router.push({
                    path: "/rebatespermit/editapplication",
                    query: {
                        pageStatus: "2",
                        orderApplyId: val.orderApplyId,
                        orderId: val.orderId,
                        recommendRebatesApplyId:val.recommendRebatesApplyId,
                        applyStatus: val.applyStatus,
                    }
                })
            }else if( this.$route.path == "/invoicepermit/invoiceapply" ){ // 开票的编辑页面

                this.$router.push({
                    path: "/invoicepermit/editapplication",
                    query: {
                        pageStatus: "3",
                        orderApplyId: val.orderApplyId,
                        orderId: val.orderId,
                    }
                })
            }else if( this.$route.path == "/refundpermit/refundapply" ){ // 退款的编辑页面 

                this.$router.push({
                    path: "/refundpermit/editapplication",
                    query: {
                        pageStatus: "4",
                        orderApplyId: val.orderApplyId,
                        orderId: val.orderId,
                    }
                })
            }else if( this.$route.path == "/decorationpermit/decorationapply" ){ // 家装合同的编辑页面

                this.$router.push({
                    path: "/decorationpermit/editapplication",
                    query: {
                        pageStatus: "8",
                        orderApplyId: val.orderApplyId,
                        orderId: val.orderId,
                        homeCollectionApplyId: val.homeCollectionApplyId,
                        applyStatus: val.applyStatus,
                        auditAt:  val.auditAt,
                        auditTime:  val.auditTime,
                        createAt:  val.createAt,
                        createTime:  val.createTime,
                    }
                })
            }

            // else if(val.applyType == 513){ // 退货退款的编辑页面 不对 需修改
            //     this.$router.push({
            //         path: "/regoodspermit/editapplication",
            //         query: {
            //             pageStatus: "5",
            //         }
            //     })
            // }else if(val.applyType == 513){ // 换货的编辑页面 没有 需确定 需修改
            //     this.$router.push({
            //         path: "/exchangepermit/editapplication",
            //         query: {
            //             pageStatus: "6",
            //             orderApplyId: val.orderApplyId
            //         }
            //     })
            // }else if(val.applyType == 517){ // 退折扣的编辑页面  退折扣在退款页
            //     this.$router.push({
            //         path: "/rediscountpermit/editapplication",
            //         query: {
            //             pageStatus: "4",
            //             orderApplyId: val.orderApplyId,
            //         }
            //     })
            // }

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
    
        // 搜索条件获取
        searchdatas(){
            if(this.searchData === null) {
                this.searchData = [];
            }else if(this.searchData2 == null) {
                this.searchData2 = [];
            }

            return {
                names: this.names,//订单编号
                applyTimeStart: this.searchData ? this.searchData[0] : '',//创建时间
                applyTimeEnd: this.searchData ? this.searchData[1] : '',
                auditTimeStart: this.searchData2 ? this.searchData2[0] : '',// 审核开始时间
                auditTimeEnd: this.searchData2 ? this.searchData2[1] : '',// 审核开始时间
                applyName: this.applyName, //申请人
                applyType: this.applyType,//申请类型
                applyStatus: this.applyStatus,//申请状态
                auditName: this.auditName,// 审核人

                
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
             
            this.applyName = ''; //申请人
            this.applyType = '';//申请类型
            this.applyStatus = '';//申请状态
            this.auditName = '';// 审核人
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
            // type =1 折扣申请 2 家装代收合同申请 3工期加急申请  4开票申请 5  返点申请  6退款申请  7成品上样申请  8备货申请  9报废申请 10内部销售申请  11外部推荐人申请  12定制品撤样申请  13成品撤样申请
            
            this.loading = true;
            if(this.$route.path == "/discountpermit/discountapply") { // 折扣申请
                data.type = 1;
            }else if(this.$route.path == "/projectpermit/projectapply"){ // 工期加急申请
                data.type = 3;
            }else if(this.$route.path == "/decorationpermit/decorationapply"){ // 家装代收合同申请
                data.type = 2;
            }else if(this.$route.path == "/invoicepermit/invoiceapply"){ // 开票申请
                data.type = 4;
            }else if(this.$route.path == "/refundpermit/refundapply"){ // 退款申请
                data.type = 6;
            }else if(this.$route.path == "/rebatespermit/rebatesapply"){ // 返点申请
                data.type = 5;
            }

            new Promise((resolve, reject) => {
                // 获取当前登陆人组织结构接口
                // this.getOrganizationByPresent();
                let data = {
                    dataType: "APPLY_TYPE"
                };
                listBaseDict(data).then(res=>{
                    if(res.status == 200) {
                        this.typeList = res.data;
                        this.$refs.multiTable.clearSelection();
                        resolve( this.typeList );
                    }
                }).catch(error => {
                    console.log('备货采购申请管理 备货管理 获取当前登陆人组织结构接口 views/stockmanagement/stockpurchase/components/stockform', error);
                });


                // getOrganizationByPresent().then(res => {
                //     if(res.status == 200) {
                //         this.purchase.organizationName = res.data.organizationName;
                //         this.purchase.organizationId =  res.data.organizationId;
                //         resolve( this.purchase.organizationId );
                //     }
                // }).catch(error => {
                //     console.log('备货采购申请管理 备货管理 获取当前登陆人组织结构接口 views/stockmanagement/stockpurchase/components/stockform', error);
                // });
                
            }).then((res)=>{
                listOrderApply(data).then(response =>{
                    if(response.status == 200){
                        this.total = response.data.total;
                        this.tabList = response.data.rows;
                        
                        this.tabList.forEach(item => {
                            // this.typeList.forEach(attr => {
                            res.forEach(attr => {
                                // console.log(item.applyType, attr.id,"item.applyType,attr.id");
                                if( item.applyType == attr.id ) { // 列表的applyType 与字典的对应
                                    // console.log(item.applyType, attr.id,"item.applyType == attr.id");
                                    item.rowApplyName = attr.dictName;
                                }
                            })
                        })
                        this.loading = false;   
                    }
                }).catch(error =>{
                    this.loading = false; 
                    console.log('申请 表格列表 marketing/components/querycompon.vue', error);
                })

                // this.getOrganizationParentList(res);
            });



            // listOrderApply(data).then(res =>{
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tabList = res.data.rows;
            //         this.loading = false;   
            //     }
            // }).catch(error =>{
            //     this.loading = false; 
            //     console.log('申请 表格列表 marketing/components/querycompon.vue', error);
            // })
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