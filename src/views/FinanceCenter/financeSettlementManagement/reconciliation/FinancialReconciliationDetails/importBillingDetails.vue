<template>
    <div>
        <div class="queryForm m-bottom15">
            <el-row :gutter="10">
                <el-col :span="span"><el-input @keyup.enter.native="search" placeholder="建材城收据号" v-model="formList.buildingReceiptNumber" size="medium"></el-input></el-col>
<!--                <el-col :span="span"><el-input placeholder="订单编号" v-model="formList.orderNumber"></el-input></el-col>-->
<!--                <el-col :span="span"><el-input placeholder="客户名称" v-model="formList.customerName"></el-input></el-col>-->
                <el-col :span="span"><el-input @keyup.enter.native="search" placeholder="卡号" v-model="formList.cardNumber" size="medium"></el-input></el-col>
                <el-col :span="span">
                    <el-select v-model="formList.paymentMethod" size="medium">
                        <el-option v-for="(item,idx) in paymentArr" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="span">
                    <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table
            border
            :data="tableObj.tableData"
            :row-class-name="tableRowClassName"
            v-loading="tableObj.tabLoading"
            >
                <el-table-column show-overflow-tooltip align="center" prop="transactionVoucher" label="建材城收据号"></el-table-column>
<!--                <el-table-column show-overflow-tooltip align="center" prop="orderNumber" label="订单编号"></el-table-column>-->
<!--                <el-table-column show-overflow-tooltip align="center" prop="customerName" label="客户姓名"></el-table-column>-->
                <el-table-column show-overflow-tooltip align="center" prop="paymentMethod" label="付款方式"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="amountCollected" label="收款金额"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="serviceCharge" label="刷卡手续费"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="cardNumber" label="刷卡卡号"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="dateCollection" label="收款日期"></el-table-column>
            </el-table>
        </div>
        <div class="pagination_wrap">
            <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="tableObj.total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import { listBmcSettlementDetailedVO } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index';
import { listBaseDict } from "@/api/pulicJava";
export default {
    props:["tableObj"],
    components:{
        pagination
    },
    mounted() {
        listBaseDict({
            dataType:"expenditure_payment_method"
        }).then(res=>{
            this.paymentArr=res.data;
        })
    },
    data(){
        return{
            span:6,
            currentPage:1,
            pageSize:10,
            formList:{
                page:1,
                limit:10,
                bmcSettlementId:this.$route.query.bmcSettlementId,
                orderNumber:"",
                buildingReceiptNumber:"",
                customerName:"",
                cardNumber:"",
                paymentMethod:"",
            },
            paymentArr:[],
        }
    },
    methods: {
        search(){
            this.formList.page=1;
            this.pages()
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        pages(){
            this.tableObj.tabLoading=true;
            listBmcSettlementDetailedVO(this.formList).then(res=>{
                this.tableObj.tableData=res.data.rows;
                this.tableObj.total=res.data.total;
                this.tableObj.tabLoading=false;
            })
        },
        currentChange(val) {
            this.currentPage = val;
            this.pages()
        //   this.getListData();
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.pages()
        //   this.getListData();
        },
    },
}
</script>
<style scoped>

</style>
