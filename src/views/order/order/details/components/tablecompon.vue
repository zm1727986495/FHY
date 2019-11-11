<template>
    <div class="tablecompon lvs">
        <div v-if="defaultselectone == 0">
            <div class="titlecals">客增/补单/遗单</div>
            <!-- 附属订单 -->
            <el-table border key="0"
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                :data="fstabledata" style="width: 100%;" >
                <el-table-column prop="subsidiaryNumber" align="center" fixed="left" label="订单号" width="150" sortable>
                    <template slot-scope="scope">
                        <el-button type="text" @click="orderdetailsFn(scope.row)">{{scope.row.subsidiaryNumber}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="orderStatusName" align="center" label="订单状态" width="130" show-overflow-tooltip></el-table-column>
                <el-table-column prop="subsidiaryType" align="center" label="订单类型" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.subsidiaryType == 451">正单</div>
                        <div v-if="scope.row.subsidiaryType == 452">增单</div>
                        <div v-if="scope.row.subsidiaryType == 453">遗留单</div>
                        <div v-if="scope.row.subsidiaryType == 972">补单</div>
                        <div v-if="scope.row.subsidiaryType == 973">退货单</div>
                        <div v-if="scope.row.subsidiaryType == 974">上样</div>
                        <div v-if="scope.row.subsidiaryType == 975">撤样</div>
                        <div v-if="scope.row.subsidiaryType == 976">换货</div>
                        <div v-if="scope.row.subsidiaryType == 977">第三方订单</div>
                        <div v-if="scope.row.subsidiaryType == 978">售后问题</div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderGoodsType" align="center" label="货品类型" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.orderGoodsType == 1">成品</div>
                        <div v-if="scope.row.orderGoodsType == 2">定制</div>
                    </template>
                </el-table-column>
                <el-table-column prop="customerName" align="center" label="客户名称" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="客户电话" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="salesmanName" align="center" label="销售员" width="110" show-overflow-tooltip></el-table-column>
                <el-table-column prop="businessName" align="center" label="业务员" width="110" show-overflow-tooltip></el-table-column>
                <el-table-column prop="surveyorName" align="center" label="测量员" width="110" show-overflow-tooltip></el-table-column>
                <el-table-column prop="designerName" align="center" label="设计师" width="110" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderSourceName" align="center" label="订单来源" width="130" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
        <div v-if="defaultselectone == 4">
            <!-- 礼品 -->
            <el-table border key="4"
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                :data="lptabledata" style="width: 100%;" >
                <el-table-column prop="contactsName" align="center" width="200" label="领取状态" sortable></el-table-column>
                <el-table-column prop="giftName" align="center" width="200" label="礼品名称" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="赠送时间" sortable></el-table-column>
                <el-table-column prop="giftAmount" align="center" width="200" label="数量" sortable></el-table-column>
                <el-table-column prop="sendName" align="center" width="200" label="赠送人" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="备注" sortable></el-table-column>
            </el-table>
        </div>
        
        <div v-if="defaultselectone == 17">
            <!-- 违规 -->
            <el-table border key="17"
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                :data="wgtabledata" style="width: 100%;" >
                <el-table-column prop="illegalBillStatus" align="center" width="200" label="状态" sortable></el-table-column>
                <el-table-column prop="illegalBillSn" align="center" width="200" label="违规单号" sortable></el-table-column>
                <el-table-column prop="illegalType" align="center" width="200" label="违规处罚类型" sortable>
                    <template slot-scope="scope">
                        <div v-if="scope.row.illegalType == 1">活动违规</div>
                        <div v-if="scope.row.illegalType == 2">工期超期</div>
                        <div v-if="scope.row.illegalType == 3">晚交单处罚</div>
                        <div v-if="scope.row.illegalType == 4">清单价格处罚</div>
                        <div v-if="scope.row.illegalType == 5">返点违规处罚</div>
                        <div v-if="scope.row.illegalType == 6">款未清违规处罚</div>
                    </template>
                </el-table-column>
                <el-table-column prop="illegalLevel" align="center" width="200" label="违规等级" sortable></el-table-column>
                <el-table-column prop="illegalDescribe" align="center" width="200" label="违规描述" sortable></el-table-column>
                <el-table-column prop="createTime" align="center" width="200" label="违规单判罚时间" sortable></el-table-column>
                <el-table-column prop="createAt" align="center" width="200" label="判罚人" sortable></el-table-column>
                <!-- <el-table-column prop="contactsName" align="center" width="200" label="营销部门" sortable></el-table-column> -->
            </el-table>
        </div>
        <!-- <div class="pagination_wrap">
            <pagination
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange">
            </pagination>
        </div> -->
    </div>
</template>
<script>
import pagination from '@/views/components/pagination';

import { listIllegalBillByPage, issueGiftsList, orderDetails } from 'api/order/order/orderdetails';

export default {
    components: {
        pagination
    },
    data() {
        return {
            wgtabledata: [],//违规列表
            fstabledata: [],//附属订单列表
            lptabledata: [],//礼品列表
            tabledata: [],
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 0,//总条数
            plearsdata: {
                orderId: this.$route.query.orderId
            },
            status: this.defaultselectone
        }
    },
    watch: {
        defaultselectone(val){
            if(val == 0){
                this.fstabledatafun()
            }else if(val == 2){
                
            }else if(val == 4){
                this.lptabledatafun()
            }else if(val == 17){
                this.wgtabledatafun()
            }
        }
    },
    created() {
        let val = this.status
        if(val == 0){
            this.fstabledatafun()
        }else if(val == 2){
            
        }else if(val == 4){
            this.lptabledatafun()
        }else if(val == 17){
            this.wgtabledatafun()
        }
    },
    props: ["defaultselectone"],
    methods: {
        orderdetailsFn(val){
            this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId}});
        },
        wgtabledatafun(){
            listIllegalBillByPage(this.plearsdata).then(res => {
                if(res.status == 200) {
                    this.wgtabledata = res.data.rows;
                }
            }).catch(error => {
                console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
            })
        },
        fstabledatafun(){
            let data = {
                orderId: this.$route.query.orderId
            }
            orderDetails(data).then(res => {
                if(res.status == 200) {
                    this.fstabledata = res.data.orderSubsidiaryList;
                }
            }).catch(error => {
                console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
            })
        },
        lptabledatafun(){
            issueGiftsList(this.plearsdata).then(res => {
                if(res.status == 200) {
                    this.lptabledata = res.data.rows;
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
    },
}
</script>
<style lang="scss">
    .tablecompon{
        .titlecals{
            top: 0;
        }
    }
</style>