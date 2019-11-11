<template>
    <div>
        <div class="queryForm">
            <el-row :gutter="10">
                <el-col :span="span">
                    <el-input class="ipts" @keyup.enter.native="search" placeholder="订单编号" v-model="formList.orderNumber"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" @keyup.enter.native="search" placeholder="客户名称" v-model="formList.customerName"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input placeholder="客户电话" @keyup.enter.native="search" v-model="formList.customerPhone"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input placeholder="收款单号" @keyup.enter.native="search" v-model="formList.collectMoneyName"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" @keyup.enter.native="search" placeholder="建材城收据号" v-model="formList.buildingReceiptNumber"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" @keyup.enter.native="search" placeholder="内部收据号" v-model="formList.receiptNumber"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input placeholder="家装合同号" @keyup.enter.native="search" v-model="formList.homeContractNumber"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="m-top20">
        <el-table
            border
            :data="tableObj.tableData"
            :cell-style="cellStyle" :header-cell-style ="cellStyle"
            :row-class-name="tableRowClassName"
            v-loading="tableObj.tabLoading"
            >
                <el-table-column fixed show-overflow-tooltip width="180" align="center" prop="collectMoneyName" label="收款单号">
                    <template slot-scope="scope">
                        <div>
                            <el-tooltip placement="right" visible-arrow >
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" @click="addStatement(scope.row)">加入到对账单</p>
                                </div>
                                <img :src="spot" alt="" class=" attributesTips">
                            </el-tooltip>
                            <span class="table_action_span" >{{scope.row.collectMoneyName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip
                align="center"
                type="expand"
                width="20px"
                >
                    <template slot-scope="scope">
                        <el-table
                        :data="scope.row.orderVOS"
                        style="width: 100%;"
                        :row-class-name="tableRowClassName"
                        border
                        row-key="id">
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="orderNumber"
                            label="订单编号">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="orderStatus"
                            label="订单状态">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="orderType"
                            label="订单类型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="orderGoodsType"
                            label="订单货品类型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="categoryName"
                            label="产品品类">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="brandName"
                            label="产品品牌">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="contractMoney"
                            label="合同金额">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="paymentAmount"
                            label="已收金额">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="paymentAmount"
                            label="本次收款金额">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="customerName"
                            label="客户名称">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="customerPhone"
                            label="客户电话">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="otherPhone"
                            label="备用电话">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="Address"
                            label="订单地址">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="salesmanName"
                            label="销售">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="surveyorName"
                            label="测量员">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="designerName"
                            label="设计师">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="storeName"
                            label="所属门店">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="boothNumber"
                            label="所属摊位">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="createOrderTime"
                            label="创建订单时间">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="givenTime"
                            label="合同签订时间">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="customerName" label="客户名称"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="customerPhone" label="客户电话"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="paymentAmount" label="本次收款"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createName" label="录入人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createTime" label="录入时间"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="collectType" label="收款类型"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="collectWay" label="收款方式"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="collectStoreName" label="所属门店"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="collectStoreBoothName" label="所属摊位"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="actualStoreName" label="实收门店"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="actualStoreBoothName" label="实收摊位"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="receiptNumber" label="内部收据号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="buildingReceiptNumber" label="建材城收据号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="homeContractNumber" label="家装合同号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="commitName" label="提交人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="commitTime" label="提交时间"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="auditName" label="审核人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="auditTime" label="审核时间"></el-table-column>
            </el-table>
        </div>
        <div class="pagination_wrap">
            <pagination
                :current-page="formList.page"
                :pageSize="formList.limit"
                :total="tableObj.total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
import { listOrderCollectMoneyByBmcSettlementId, addSettlementComparison } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index'
export default {
    props:["tableObj"],
    components:{
        pagination
    },
    data(){
        return{
            span:6,
            spot,
            childTable:[],
            formList:{
                page:1,
                limit:10,
                bmcSettlementId:this.$route.query.bmcSettlementId,
                orderNumber:"",
                customerName:"",
                buildingReceiptNumber:"",
                receiptNumber:"",
                customerPhone:"",
                homeContractNumber:"",
                collectMoneyName:""
            },
        }
    },
    methods: {
        search(){
            this.formList.page=1;
            this.pages()
        },
        addStatement(val){
            addSettlementComparison(
                {
                    transactionVoucher:val.buildingReceiptNumber
                }
            ).then(res=>{
                this.$message({
                    message: '加入成功',
                    type: 'success'
                });
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.formList.page = val;
            this.pages()
        //   this.getListData();
        },
        sizeChange(val) {
            this.formList.page = 1;
            this.formList.limit = val;
            this.pages()
        //   this.getListData();
        },
        pages(){
            this.tableObj.tabLoading=true;
            listOrderCollectMoneyByBmcSettlementId(this.formList).then(res=>{
                this.tableObj.tableData=res.data.rows;
                this.tableObj.total=res.data.total;
                this.tableObj.tabLoading=false;
            })
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 0){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },
    },
}
</script>
<style scoped>

</style>
