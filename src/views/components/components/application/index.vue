<template>
    <!-- index -->
    <div>
        <div class="application">
            <!-- 导航栏 -->
            <div class="head_nav">
                <breadcrumb :navList="navList"></breadcrumb>
            </div>
            <!-- 按钮组 -->
            <el-card class="apply_a m-bottom" v-if="!$route.query.orderId">
                <div class="iconBox gift_title_btom">
                    <i class="Icon"></i>
                    <span>选择订单</span>
                    <!-- <span class="status">当前状态： <span class="statusContent">代签合同</span></span> -->
                </div>
                <div class="order_info m-top20">
                    <div class="order_info_input m-bottom15">
                        <el-input class="input_250" v-model="orderNumber" placeholder="订单号" :readonly="true"
                                  :size="size"></el-input>
                        <el-button type="primary" size="medium" class="reset_btn m-left20" @click="openOrderDia"
                                   :disabled="readonly">选择
                        </el-button>
                    </div>
                    <!-- 订单的弹框 -->
                    <ordercomponent
                        v-if="newcenterDialogVisible"
                        :centerDialogVisible="newcenterDialogVisible"
                        @orderclosefun="orderclosefun"
                        :applyType="pageStatus"
                        :orderId="orderId">
                    </ordercomponent>
                </div>
            </el-card>
            <!-- 订单详情 -->
            <orderdetail :orderId="orderId" ref="orderdetail"></orderdetail>
            <contractdetails :orderId="orderId" v-show="false" v-if="contractId" :contract-id="contractId"></contractdetails>

            <el-card class="cradclass">
                <!-- 订单步骤列表active -->
                <!-- applyStatus'申请状态：0待审核，1审核通过，2驳回，3审核中 4拒绝', -->
                <!-- nodeStatus： 1：当前节点 2：已过 0：未执行 -->
                <!-- 未完成灰色 执行完成绿色 拒绝紫色 当前橙色 驳回红色 -->
                <ul class="steps_box" v-if="showLine">
                    <li :class="{activeli: itm.nodeStatus == 1,
					active: itm.nodeStatus == 2,
					retustatus: itm.nodeStatus == 1 && itm.applyStatus == 2,
					refuse: itm.nodeStatus == 1 && itm.applyStatus == 4}"
                        v-for="(itm, idx) in stepdata" :key="idx">
                        <!-- <el-tooltip placement="bottom"> -->
                        <div>{{itm.workFlowNodeName}}</div>
                        <div slot="content" v-if="idx == 0">申请人:{{itm.username}}<br/>申请时间:{{itm.time}}</div>
                        <div slot="content" v-else>岗位名称:{{itm.postName}}<br/>审核人:{{itm.username}}<br/>审核时间:{{itm.time}}
                        </div>
                        <!-- </el-tooltip> -->
                    </li>
                </ul>
                <div v-if="examinelist.length != 0">
                    <div class="titlecals">审核记录列表</div>
                    <el-table :row-style="tableBodycolor" :row-class-name="tableRowClassName" :data="examinelist">
                        <el-table-column prop="createAt" align="center" label="审核人"></el-table-column>
                        <el-table-column prop="createTime" align="center" label="审核时间" show-overflow-tooltip
                                         sortable></el-table-column>
                        <el-table-column prop="operationStatus" align="center" label="审核操作">
                            <template slot-scope="scope">
                                <div v-if="scope.row.operationStatus == 1">同意</div>
                                <div v-if="scope.row.operationStatus == 2">拒绝</div>
                                <div v-if="scope.row.operationStatus == 3">驳回</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="rejectionReasons" align="center" show-overflow-tooltip
                                         label="审核意见"></el-table-column>
                    </el-table>
                </div>

            </el-card>
            
            <el-tabs type="border-card" @tab-click="handleClick" v-model="pageStatus">
                <el-tab-pane label="折扣申请" name="0" v-if="pageStatus == '0' || pageValid == true">
                    <discountapply :orderId="orderId"></discountapply>
                </el-tab-pane>

                <el-tab-pane label="工期加急申请" name="1" v-if="pageStatus == '1' || pageValid == true">
                    <urgentapply :orderId="orderId" :customerId="customerId" ref="urgentapply"></urgentapply>
                </el-tab-pane>

                <el-tab-pane label="返点申请" name="2" v-if="pageStatus == '2' || pageStatus == '7'|| pageValid == true">
                    <rebatesapply :orderId="orderId" :customerId="customerId" ref="rebatesapply"></rebatesapply>
                </el-tab-pane>

                 <el-tab-pane label="商品信息" name="7" v-if="pageStatus == '2' || pageStatus == '7'">
                    
                    <commodity v-if="pageStatus == '7'" :order-id="orderId"></commodity>
                </el-tab-pane>

                <el-tab-pane label="开票申请" name="3" v-if="pageStatus == '3' || pageValid == true">
                    <invoiceapply :orderId="orderId" :customerId="customerId" ref="invoiceapply"></invoiceapply>
                </el-tab-pane>

                <el-tab-pane label="退款申请" name="4" v-if="pageStatus == '4' || pageValid == true">
                    <refundapply :orderId="orderId" :customerId="customerId" :storeCustomerId="storeCustomerId"
                                 ref="refundapply"></refundapply>
                </el-tab-pane>

                <el-tab-pane label="退货退款申请" name="5" v-if="pageStatus == '5' || pageValid == true">
                    <!-- 退货退款申请 -->
                    <regoodsapply :status="5"></regoodsapply>
                </el-tab-pane>

                <el-tab-pane label="换货申请" name="6" v-if="pageStatus == '6' || pageValid == true">
                    <!-- 换货申请 -->
                    <regoodsapply :status="6"></regoodsapply>
                </el-tab-pane>

                <!-- 退折扣在退款里面 -->

                <el-tab-pane label="家装代收合同申请" name="8" v-if="pageStatus == '8' || pageValid == true">
                    <collectionapply :orderId="orderId" :customerId="customerId"
                                     ref="collectionapply"></collectionapply>
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
</template>
<script>
    import contractdetails from "@/views/administrationCenter/contractmanagement/components/contractdetails";
    import commodity from '@/views/administrationCenter/contractmanagement/components/commodity';//商品信息
    import pagination from "@/views/components/pagination";
    import breadcrumb from "@/views/components/breadcrumb";
    import orderdetail from "@/views/order/components/orderdetail";
    // import orderdetail from "./components/orderdetail";   //订单详情
    import orderdia from "./components/orderdia";  //选择订单弹框
    import ordercomponent from "@/views/components/ordercomponent";  //选择订单弹框
    import discountapply from "./components/discountapply";   //折扣申请
    import urgentapply from "./components/urgentapply";   //加急申请
    import collectionapply from "./components/collectionapply";   //代收申请
    import invoiceapply from "./components/invoiceapply";   //开票申请
    import rebatesapply from "./components/rebatesapply";   // 返点申请
    import refundapply from "./components/refundapply";   // 退款申请
    import regoodsapply from "./components/regoodsapply";   // 退货退款申请 and 换货申请
    import {orderDetails} from "api/entrepotSet/aftermarket/aftermarket/aftersaleproblem";

    import {
        getOrderReturnMoney,  // 退款编辑/审核回显
        listApplyWorkFlowProcess,
        getOrderCollectMoney
    } from 'api/marketing/refundpermit/index';

    import {
        projectDelayUrgentApplyDetails, // 工期加急编辑/审核页回显
    } from 'api/marketing/projectpermit/index';

    import {
        discountApplyDetails,// 折扣编辑/审核回显
    } from "api/marketing/discountpermit/discountpermit"

    import {
        homeCollectionApplyDetail, // 家装代收合同编辑/审核回显
    } from 'api/administrationCenter/decorationpermit/index'; // 家装代收合同申请
    import {
        invoiceApplyDetails, // 开票申请编辑/审核 回显
    } from "api/marketing/invoicepermit/index"; // 开票申请
    import {
        listWorkFlowProcessRecording,
        getReferrerInfo, // 外部推荐返点信息 -- 回显
    } from 'api/marketing/rebatespermit/index';
    export default {
        components: {
            contractdetails,
            breadcrumb,
            pagination,
            orderdia,  // 选择订单弹框
            ordercomponent, // 订单弹框
            orderdetail, // 订单详情
            discountapply, // 折扣申请
            urgentapply, // 加急申请
            collectionapply, // 代收申请
            invoiceapply, // 开票申请
            rebatesapply, // 返点申请
            refundapply,  // 退款申请
            regoodsapply,  // 退货退款申请 and 换货申请
            commodity //商品信息
        },
        // name: 'brandmanagement',
        data() {
            return {
                contractId:'',
                showLine: true,
                stepdata: [
                    {orderProcessConfigureName: "新增退单", orderProcessConfigureId: 1},
                    {orderProcessConfigureName: "新增退单", orderProcessConfigureId: 2},
                    {orderProcessConfigureName: "新增退单", orderProcessConfigureId: 3},
                    {orderProcessConfigureName: "新增退单", orderProcessConfigureId: 4},
                ],
                sizeval: 2,
                size: 'medium',
                // 分页
                currentPage: 1, // 当前页数
                pageSize: 20, // 总页数
                total: 0,  // 总条数

                readonly: false,
                isEdit: false,
                isAudit: false,

                orderNumber: '', // 订单number
                orderId: '', // 订单id
                customerId: '',
                storeCustomerId: '',
                navList: [], //头部面包屑
                examinelist: [], //审核意见
                orderdia_vis: false,
                newcenterDialogVisible: false, // 选择订单flag
                fromdata: {},
                status: 0,
                pageValid: false,
                isAudit: false, //是否是审核页面
                pageStatus: String(this.$route.query.pageStatus) ? String(this.$route.query.pageStatus) : "0", //是由哪个申请页面进入该页面的
                homeData:{}
            };
        },

        created() {
            if (this.$route.path == "/refundpermit/addapplication"
                || this.$route.path == "/invoicepermit/addapplication"
                || this.$route.path == "/decorationpermit/addapplication"
                || this.$route.path == "/rebatespermit/addapplication"
                || this.$route.path == "/projectpermit/addapplication"
                || this.$route.path == "/discountpermit/addapplication") { // 退款 开票 家装  返点 工期 折扣
                this.showLine = false; // 不显示流程（所有新增页面不显示流程）
            }


            let datas = this.$route.query
            if (datas.orderId) {
                this.orderId = datas.orderId;
                this.orderNumber = datas.orderNumber;
                this.storeCustomerId = datas.storeCustomerId;
            }
            if (datas.orderApplyId) {
                listApplyWorkFlowProcess({orderApplyId: datas.orderApplyId}).then(res => {
                    if (res.status == 200) {
                        console.log(res, "退款流程");
                        this.stepdata = res.data;
                    }
                }).catch(err => {
                    console.log('申请:退款管理 退款流程 marketing/components/application/components/refundapply.vue', err);
                })

            }
            // console.log(this.$route,this.$route.query.pageStatus,typeof(this.$route.query.pageStatus),"$route");

            // console.log(this.pageStatus,typeof(this.pageStatus),"pageStatus");

            if (this.$route.path == "/minemanagement/editapplication" || this.$route.path == "/minemanagement/addapplication" || this.$route.path == "/minemanagement/audit") {
                this.pageValid = true;
            }

            if (this.$route.path == "/refundpermit/editapplication") {  // 退款编辑页面
                this.isEdit = true;
                this.readonly = true; // 只可读
                this.getOrderReturnMoney(); // 回显编辑页信息
            }

            if (this.$route.path == "/refundpermit/auditmanagement") {  // 退款审核页面
                this.isAudit = true;

                this.readonly = true; // 只可读
                this.getOrderReturnMoney(); // 回显编辑页信息
            }

            if (this.$route.path == "/refundpermit/viewapplication" || this.$route.path == "/refundpermit/viewauditapplication") {  // 退款详情页面分为申请和审核

                this.readonly = true; // 只可读
                this.getOrderReturnMoney(); // 回显编辑页信息
            }


            // if(this.$route.path == "/projectpermit/editapplication"){  // 工期编辑页面
            //     this.isEdit = true;

            // 	this.readonly = true; // 只可读
            //     this.projectDelayUrgentApplyDetails(); // 回显编辑页信息
            // }


            if (this.$route.path == "/discountpermit/auditmanagement" || this.$route.path == "/discountpermit/editapplication" || this.$route.path == "/discountpermit/viewapplication") { // 折扣审核 / 编辑页面
                this.readonly = true;

                this.discountApplyDetails(); // 折扣页面回显
            }

            if (this.$route.path == "/decorationpermit/auditmanagement" || this.$route.path == "/decorationpermit/editapplication" || this.$route.path == "/decorationpermit/viewapplication") { // 家装代收合同审核 / 编辑页面
                this.readonly = true;

                this.homeCollectionApplyDetail(); // 家装代收合同审核 / 编辑页面回显
            }

            if (this.$route.path == "/invoicepermit/auditmanagement" || this.$route.path == "/invoicepermit/editapplication" || this.$route.path == "/invoicepermit/viewapplication") { // 开票申请审核 / 编辑页面
                this.readonly = true;

                this.invoiceApplyDetails(); // 开票申请合同审核 / 编辑页面回显
            }
            if (this.$route.path == "/projectpermit/auditmanagement" || this.$route.path == "/projectpermit/editapplication" || this.$route.path == "/projectpermit/viewapplication") { // 工期加急申请审核 / 编辑页面
                this.readonly = true;

                this.projectDelayUrgentApplyDetails();
            }

            if (this.$route.path == "/rebatespermit/auditmanagement" || this.$route.path == "/rebatespermit/editapplication" || this.$route.path == "/rebatespermit/viewapplication") { // 外部推荐人申请审核 / 编辑页面
                this.readonly = true;

                this.getReferrerInfo();
            }

            if (datas.orderId) {
                getOrderCollectMoney({
                    orderId: datas.orderId
                }).then(res => {
                    this.storeCustomerId = res.data.storeCustomerId
                })
            }
        },

        mounted() {
            // 头部面包屑
            this.navList = this.$route.meta;
        },
        methods: {
            // getlistWorkFlow(){
            // 	let data = {
            // 		currentPage: this.currentPage,
            // 		pageSize: this.pageSize,
            // 		orderApplyId: this.$route.query.orderApplyId
            // 	}
            // 	listWorkFlowProcessRecording(data).then(res => {
            // 		if(res.status == 200) {
            // 			this.total = res.data.total;
            // 			this.examinelist = res.data.rows;
            // 		}
            // 	}).catch(err =>{
            // 		console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
            // 	})
            // },
            // 获取订单退款信息回显
            getOrderReturnMoney() {
                let data = {
                    orderApplyId: this.$route.query.orderApplyId,
                };

                getOrderReturnMoney(data).then(res => {
                    if (res.status == 200) {
                        this.refunds = res.data;
                        this.orderId = res.data.orderId;
                        this.orderNumber = res.data.orderNumber;
                        this.examinelist = res.data.workFlowProcessRecordings;
                    }
                }).catch(err => {
                    console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
                })
            },
            orderclosefun(val) {
                if (val && val.length > 0) {
                    this.contractId = val[0].comtractId;
                    this.orderId = val[0].orderId;
                    this.orderNumber = val[0].orderNumber;
                    this.storeCustomerId = val[0].storeCustomerId;
                    //返点
                    if(this.pageStatus == 2){
                        this.$refs.rebatesapply.listReferrerByPageFn(val[0].referrerId,val[0].orderId)
                    }
                }
                this.newcenterDialogVisible = false;
            },
            //弹出订单选择弹框
            openOrderDia() {
                this.newcenterDialogVisible = true;
                // this.orderdia_vis = true;
            },
            // 工期特批编辑 / 审核页回显
            projectDelayUrgentApplyDetails() {
                let data = {
                    orderApplyId: this.$route.query.orderApplyId,
                };

                projectDelayUrgentApplyDetails(data).then(res => {
                    if (res.status == 200) {
                        this.orderId = res.data.orderId;
                        this.orderNumber = res.data.orderNumber;
                    }
                }).catch(err => {
                    console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
                })
            },

            // 折扣申请编辑 / 审核页回显信息
            discountApplyDetails() {
                let data = {
                    orderApplyId: this.$route.query.orderApplyId,
                    orderId: this.$route.query.orderId
                }
                discountApplyDetails(data).then(res => {
                    this.orderId = res.data.orderId;
                    this.orderNumber = res.data.orderNumber;

                }).catch(error => {
                    console.log(error + "views/marketing/components/application/components/discountapply");
                })

            },

            // 家装合同申请编辑 / 审核页回显
            homeCollectionApplyDetail() {
                let data = {
                    orderApplyId: this.$route.query.orderApplyId,
                    homeCollectionApplyId: this.$route.query.homeCollectionApplyId,// 家装代收合同id
                }
                homeCollectionApplyDetail(data).then(res => {
                    if (res.status == 200) {
                        this.orderId = res.data.orderId;
                        this.orderNumber = res.data.orderNumber;
                    }
                }).catch(err => {
                    console.log('申请:退款管理 总申请 编辑页回显 marketing/components/application/components/urgentapply.vue', err);
                })
            },

            // // 开票详情编辑 / 审核页回显
            // invoiceApplyDetails() {
            // 	let data = {
            //         orderApplyId: this.orderApplyId ? this.orderApplyId : '',
            //     };

            //     invoiceApplyDetails(data).then(res => {
            //         if(res.status == 200) {
            // 			this.orderId = res.data.orderId;
            // 			this.orderNumber = res.data.orderNumber;
            //         }
            //     }).catch(err =>{
            //         console.log('申请:开票管理 总申请 获取详情回显 components/components/application/index.vue', err);
            //     })
            // },

            // 工期加急回显
            // projectDelayUrgentApplyDetails() {
            //     let data = {
            //         orderApplyId: this.$route.query.orderApplyId,
            //     }
            //     projectDelayUrgentApplyDetails(data).then(res => {
            //         if(res.status == 200) {
            // 			this.orderId = res.data.orderId;
            // 			this.orderNumber = res.data.orderNumebr;
            //         }
            //     }).catch(err =>{
            //         console.log('申请:退款管理 总申请 编辑页回显 marketing/components/application/components/urgentapply.vue', err);
            //     })
            // },

            // 外部推荐返点信息 -- 回显
            getReferrerInfo() {
                let data = {
                    orderId: this.$route.query.orderId,
                    recommendRebatesApplyId: this.$route.query.recommendRebatesApplyId
                };
                getReferrerInfo(data).then(res => {
                    if (res.status == 200) {
                        this.orderId = res.data.orderId;
                        this.orderNumber = res.data.orderNumber;
                        this.contractId = res.data.contractId;
                    }
                }).catch(err => {
                    console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
                })
            },

            // 开票编辑 / 审核回显
            invoiceApplyDetails() {
                let data = {
                    orderApplyId: this.$route.query.orderApplyId
                };

                invoiceApplyDetails({orderApplyId: this.$route.query.orderApplyId}).then(res => {
                    if (res.status == 200) {
                        this.orderId = res.data.orderId;
                        this.orderNumber = res.data.orderNumber;
                    }
                }).catch(err => {
                    console.log('申请:开票管理 总申请 获取详情回显 components/components/application/components/invoiceapply.vue', err);
                })
            },
            // 改变tablebody颜色
            tableBodycolor({row, rowIndex}) {
                // return "height: 80px"
            },
            tableRowClassName({row, rowIndex}) {//表格斑马线设置
                return rowIndex % 2 != 0 ? 'el-f0' : '';
            },
            //tab切换
            handleClick(tab) {
                this.status = tab.name
                console.log(tab.name);
            },
            // 改变页码
            currentChange(val) {
                this.currentPage = val;
                this.getlistWorkFlow()
            },
            // 改变单页条数
            sizeChange(val) {
                this.currentPage = 1;
                this.pageSize = val;
                this.getlistWorkFlow()
            },

        }
    };
</script>
<style scoped lang='scss'>
    .application {
        .titlecals {
            top: 0;
        }

        .cradclass {
            margin-bottom: 10px;
        }

        .apply_a {
            position: relative;

            .gift_title_btom {
                // border-bottom: 1px solid rgb(151, 150, 150);
                padding-bottom: 8px;
                width: 250px;

                .status {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    font-size: 14px;
                    color: #999;
                    white-space: nowrap;

                    .statusContent {
                        font-size: 14px;
                        color: #FF9900;
                    }
                }
            }

            .order_info {
                .input_250 {
                    width: 250px;
                }

                .order_info_input {
                    margin-left: 2.5%;
                }
            }
        }

        .btn_list_1 {
            height: 55px;
            float: left;
        }

        .pagination_wrap {
            text-align: center;
            height: 50px;
            /* line-height: 50px; */
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .steps_box {
            width: 100%;
            margin-top: 20px;
            display: flex;
            overflow-x: auto;

            li {
                min-width: 110px;
                flex: 1;
                text-align: center;
                padding: 50px 0px 20px 0px;
                position: relative;
                color: #666666;

                &.activeli {
                    &::after {
                        border: 2px solid orange;
                    }

                    &::before {
                        border: 1px solid lightgrey;
                    }
                }

                &.retustatus {
                    &::after {
                        border: 2px solid red !important;
                    }

                    &::before {
                        border: 1px solid lightgrey;
                    }
                }

                &.refuse {
                    &::after {
                        border: 2px solid rgb(225, 0, 255) !important;
                    }

                    &::before {
                        border: 1px solid lightgrey;
                    }
                }

                &.active {
                    &::after {
                        border: 2px solid #85c229;
                    }

                    &::before {
                        border: 1px solid lightgrey;
                    }
                }

                &::after {
                    position: absolute;
                    top: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: block;
                    content: "";
                    width: 25px;
                    height: 25px;
                    border: 2px solid lightgrey;
                    border-radius: 50%;
                    background: #ffffff;
                    z-index: 2;
                }

                &::before {
                    z-index: 1;
                    position: absolute;
                    top: 26px;
                    left: -50%;
                    display: block;
                    content: "";
                    width: 100%;
                    height: 0;
                    border: 1px dashed lightgrey;
                }
            }

            :first-of-type {
                &::before {
                    display: none;
                }
            }
        }
    }
</style>

