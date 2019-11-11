<template>
    <div class="basicson">
        <div v-if="defaultselectone == 1">
            <div class="titlecals">收款信息</div>
            <el-table border :row-style="tableBodycolor" :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" :data="orderDetailsCollectVOS" style="width: 100%;" >
                <el-table-column prop="collectMoneyName" align="center" width="150" label="收款单号" sortable>
                    <template slot-scope="scope">
                       <p class="table_action_span" @click="collectdetils(scope.row)">{{scope.row.collectMoneyName}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" width="120" label="收费状态" sortable>
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 0">未提交</div>
                        <div v-if="scope.row.status == 1">已提交</div>
                        <div v-if="scope.row.status == 2">已驳回</div>
                        <div v-if="scope.row.status == 4">已审核</div>
                        <div v-if="scope.row.status == 6">已销账</div>
                    </template>
                </el-table-column>
                <el-table-column prop="isReady" align="center" width="120" label="是否收票">
                    <template slot-scope="scope">
                        <div>
                            <p v-if="scope.row.isReady==0">否</p>
                            <p v-if="scope.row.isReady==1">是</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="returnReason" align="center" width="150" label="驳回原因" show-overflow-tooltip></el-table-column>
                <el-table-column prop="gatheringName" align="center" width="160" label="收费人"></el-table-column>
                <el-table-column prop="gatheringTime" align="center" width="160" label="收费时间"></el-table-column>
                <el-table-column prop="collectWayName" align="center" width="120" label="收费方式" show-overflow-tooltip></el-table-column>
                <el-table-column prop="collectTypeName" align="center" width="120" label="收费类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="collectMoney" align="center" width="120" label="收款金额" show-overflow-tooltip></el-table-column>
                <el-table-column prop="auditName" align="center" width="120" label="收费审核人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="auditTime" align="center" width="160" label="审核时间"></el-table-column>
                <el-table-column prop="ticketName" align="center" width="120" label="收票人"></el-table-column>
                <el-table-column prop="ticketTime" align="center" width="160" label="收票时间"></el-table-column>
                <el-table-column prop="receiptNumber" align="center" width="150" label="内部收据号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="homeContractNumber" align="center" width="150" label="系统收据号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="buildingReceiptNumber" align="center" width="150" label="建材城收据号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bankCardId" align="center" width="150" label="刷卡号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="costMoney" align="center" width="120" label="刷卡手续费" show-overflow-tooltip></el-table-column>
                <el-table-column prop="shopCashCouponAmount" align="center" width="120" label="优惠券" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ownCashCouponAmount" align="center" width="120" label="代金券" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" align="center" width="150" label="备注" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="titlecals">退款信息</div>
            <el-table border :row-style="tableBodycolor" :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" :data="orderDetailsRefundVOS">
                <el-table-column width="120" align="center" prop="applyStatus" label="状态" sortable fixed="left">
                    <template slot-scope="scope">
                        <span v-if="scope.row.applyStatus==0">待审核</span>
                        <span v-if="scope.row.applyStatus==1">
                            <span v-if="scope.row.paymentStatus==0 && scope.row.refundTypeName == '转账'">审核通过待支付</span>
                            <span v-else-if="scope.row.paymentStatus==1 && scope.row.refundTypeName == '转账'">审核通过已支付</span>
                            <span v-else>审核通过</span>
                        </span>
                        <span v-if="scope.row.applyStatus==2">驳回</span>
                        <span v-if="scope.row.applyStatus==3">审核中</span>
                        <span v-if="scope.row.applyStatus==4">拒绝</span>
                    </template>
                </el-table-column>
                <el-table-column width="150" align="center" prop="applyCode"label="退款单号">
                    <template slot-scope="scope">
                       <p class="table_action_span" @click="viewapplication(scope.row)">{{scope.row.applyCode}}</p>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" prop="contractMoney" label="合同金额"> </el-table-column>
                <el-table-column width="120" align="center" prop="refundMoney" label="退款金额"> </el-table-column>
                <el-table-column width="180" align="center" prop="refundReason" label="退款原因" show-overflow-tooltip></el-table-column>
                <el-table-column width="100" align="center" prop="refundMode" label="退款类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.refundMode==1">退款</span>
                        <span v-if="scope.row.refundMode==2">退单退款</span>
                        <span v-if="scope.row.refundMode==3">折扣退款</span>
                        <span v-if="scope.row.refundMode==4">退货退款</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center" prop="refundTypeName" label="退款方式"> </el-table-column>
                <el-table-column width="150" align="center" prop="transferOrderNumber" label="内部转账订单号" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <p class="table_action_span" @click="toOrderDetail(scope.row)">{{ scope.row.transferOrderNumber }}</p>
                  </template>
                </el-table-column>
                <!-- <el-table-column width="150" align="center" prop="receiptNumber" label="内部收据号" show-overflow-tooltip></el-table-column> -->
                <el-table-column width="150" align="center" prop="buildingReceiptNumber" label="建材城收据号" show-overflow-tooltip></el-table-column>
                <el-table-column width="100" align="center" prop="customerName" label="客户名称"> </el-table-column>
                <el-table-column width="120" align="center" prop="customerPhone" label="客户电话"> </el-table-column>
                <!-- <el-table-column width="180" align="center" prop="paymentAmount" label="已收金额"> </el-table-column> -->
                <el-table-column width="150" align="center" prop="bankCardNumber" label="退款账号"> </el-table-column>
                <el-table-column width="150" align="center" prop="refundableName" label="退款人"> </el-table-column>
                <el-table-column width="150" align="center" prop="applyName" label="申请人"> </el-table-column>
                <el-table-column width="160" align="center" prop="applyTime" label="申请时间"> </el-table-column>
                <el-table-column width="150" align="center" prop="auditName" label="审核人"> </el-table-column>
                <el-table-column width="160" align="center" prop="auditTime" label="审核时间"> </el-table-column>
                <el-table-column width="160" align="center" prop="disbursementName" label="支出人"> </el-table-column>
                <el-table-column width="160" align="center" prop="disbursementTime" label="支出时间"> </el-table-column>
            </el-table>
        </div>
        <div v-if="defaultselectone == 7">
            <div class="titlecals">合同审核</div>
            <el-table border :row-style="tableBodycolor" :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" :data="tabledata" style="width: 100%;">
                <el-table-column prop="auditResult" align="center" label="审核状态" width="110">
                    <template slot-scope="scope">
                        <div v-if="scope.row.auditResult == 1">通过</div>
                        <div v-if="scope.row.auditResult == 2">拒绝</div>
                        <div v-if="scope.row.auditResult == 3">正单驳回</div>
                    </template>
                </el-table-column>
                <el-table-column prop="contactsName" align="center" label="审核类型" width="110"></el-table-column>
                <el-table-column prop="auditAtName" align="center" label="审单人" width="110"></el-table-column>
                <el-table-column prop="createTime" align="center" label="审单时间" width="180" sortable></el-table-column>
                <el-table-column prop="auditOpinion" align="center" label="审核描述" width="280" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
        <div v-if="defaultselectone == 9">
            <div class="titlecals">结算信息</div>
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="status" align="center" width="200" label="采购单状态" sortable>
                    <template slot-scope="scope">
                        <!-- 0对账中 1对账完成 -->
                        <div v-if="scope.row.status=='0'">对账中</div>
                        <div v-if="scope.row.status=='1'">对账完成</div>
                    </template>
                </el-table-column>
                <el-table-column prop="purchaseNumber" align="center" width="200" label="采购单号" sortable></el-table-column>
                <el-table-column prop="settlementMoney" align="center" width="200" label="结算金额" sortable></el-table-column>
                <el-table-column prop="additionalAsAmount" align="center" width="200" label="加减收金额" sortable></el-table-column>
                <el-table-column prop="contractSerialNumber" align="center" width="200" label="客户合同号" sortable></el-table-column>
                <el-table-column prop="purchaseContractCode" align="center" width="200" label="采购合同号" sortable></el-table-column>
                <el-table-column prop="orderNumber" align="center" width="200" label="订单号" sortable></el-table-column>
                <el-table-column prop="orderTypeName" align="center" width="200" label="订单类型" sortable></el-table-column>
                <el-table-column prop="storeName" align="center" width="200" label="所属门店" sortable></el-table-column>
                <el-table-column prop="companyName" align="center" width="200" label="供应商" sortable></el-table-column>
                <el-table-column prop="createOrderTime" align="center" width="200" label="下单完成时间" sortable></el-table-column>
                <el-table-column prop="lastImportTime" align="center" width="200" label="末次导入时间" sortable></el-table-column>
                <el-table-column prop="checkBillTime" align="center" width="200" label="对账完成时间" sortable></el-table-column>
                <el-table-column prop="createTime" align="center" width="200" label="提交结算时间" sortable></el-table-column>
                <el-table-column prop="settlementTime" align="center" width="200" label="结算完成时间" sortable></el-table-column>
                <el-table-column prop="remark" align="center" width="200" label="备注" sortable></el-table-column>
            </el-table>
        </div>
        <!-- <div v-if="defaultselectone == 8">
            <div class="titlecals">送货信息</div>
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="contactsName" align="center" width="200" label="附件" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="送货状态" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="未完成原因" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="送货时间" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="送货人" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="送货描述" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="汇报人" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="汇报时间" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="汇报内容" sortable></el-table-column>
            </el-table>
        </div> -->
        <!-- <div v-if="defaultselectone == 11">
            <div class="titlecals">安装信息</div>
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="contactsName" align="center" width="200" label="附件" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="安装状态" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="未完成原因" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="安装时间" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="安装人" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="安装描述" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="汇报人" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="汇报时间" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="汇报内容" sortable></el-table-column>
            </el-table>
        </div>
        <div v-if="defaultselectone == 15">
            <div class="titlecals">回访信息</div>
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="contactsName" align="center" width="200" label="回访状态" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="回访时间" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="回访人" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="回访描述" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="是否安装完成" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="销售员满意度" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="设计师满意度" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="送货员满意度" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="安装工满意度" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="客户反馈" sortable></el-table-column>
            </el-table>
        </div> -->
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
import pagination from '@/views/components/pagination';
import { listAuditRecord, getOrderMoneyCollectAndRefund,listPurchaseOrderDataVOByOrderId } from 'api/order/order/orderdetails';
import { 
    getCustomerContract,//查询合同基本信息
    } from 'api/order/contract/contract';
import { error } from 'util';
export default {
    components: {
        pagination
    },
    data() {
        return {
            tabledata: [],
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 0,//总条数
            orderId: this.$route.query.orderId,
            statusdata: this.defaultselectone,
            orderDetailsCollectVOS: [],
            orderDetailsRefundVOS: [],
            chargedata: {
            },
        }
    },
    props: ["defaultselectone"],
    watch: {
        defaultselectone(val){
            this.creafun(val);
        }
    },
    created() {
        this.creafun(this.statusdata);
    },
    methods: {
        viewapplication(val){
            let pageStatus = "4";
            let orderApplyId = val.orderApplyId;
            let orderId = this.$route.query.orderId;
            this.$router.push({path: "/refundpermit/viewapplication", query:{orderId: orderId, orderApplyId: orderApplyId, pageStatus: pageStatus,}})
        },
        collectdetils(val){

            this.$router.push({
                path: "/collection/goBackQuestion",
                query:{
                    isEdit: true,
                    id: val.collectMoneyId,
                    disabled: true
                }
            });
            // this.$router.push({path: "/refundpermit/viewapplication", query:{orderId: orderId, orderApplyId: orderApplyId, pageStatus: pageStatus,}})
        },
        creafun(val){
            if(val == 1){
                this.charge()
            }else if(val == 7){
                // 审单信息
                this.getcontent()
            }else if(val == 9){
                let data = {
                    orderId:this.$route.query.orderId,
                    page:this.currentPage,
                    limit:this.pageSize
                }
                listPurchaseOrderDataVOByOrderId(data).then(res=>{
                    if(res.status == '200'){
                        this.tablist = res.data.rows;
                        this.total = res.data.total;
                    }
                }).catch(error=>{
                    console.log('订单详情:结算列表 order/order/components/basicson.vue', error);
                })
            }else if(val == 15){

            }
        },
        charge(){
            let data = {
                orderId: this.orderId
            }
            //获取订单收退费信息
            getOrderMoneyCollectAndRefund(data).then(res => {
                console.log(res,"获取订单收退费信息");
                if(res.status == 200) {
                    this.orderDetailsCollectVOS = res.data.orderDetailsCollectVOS;
                    this.orderDetailsRefundVOS = res.data.orderDetailsRefundVOS;
                }
            }).catch(error => {
                console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
            })
        },
        getcontent(){
            getCustomerContract({orderId: this.orderId}).then(res =>{
                if(res.status == 200){
                    // 合同id有的时候回显
                    if(res.data.customerContractId){
                        let customerContractId = res.data.customerContractId;
                        this.sdtabledatafun(customerContractId);
                    }else{
                        this.$message.warning("该订单未生成有效合同");
                    }
                }
            }).catch(error =>{
                console.log('合同详情:获取合同信息 order/order/order.vue', error);
            })
        },
        // 审单接口
        sdtabledatafun(val){
            listAuditRecord({customerContractId: val}).then(res => {
                if(res.status == 200) {
                    this.tabledata = res.data.rows
                }
            }).catch(error => {
                console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
            })
        },
        sizeChange(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize = val;
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            // this.getListData();
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //勾选函数回调
        handleSelectionChange(val){
           this.selections = val;
        },
        toOrderDetail(row) {
            this.$router.push({
              path: '/ordermm/details',
              query: {
                orderId: row.transferOrder,
                orderNumber: row.transferOrderNumber
              }
            })
        }
    },
}
</script>
<style lang="scss">
    .basicson{
        .titlecals{
            top: 0;
        }
        .el-table{
            margin-top: 20px;
        }
    }
</style>
