<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input size="medium" placeholder="订单号" v-model="formList.orderNumber" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" placeholder="客户名称" v-model="formList.customerName" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" placeholder="客户电话" v-model="formList.customerPhone" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" placeholder="收款单号" v-model="formList.collectMoneyName" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" placeholder="内部收据号" v-model="formList.receiptNumber" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" placeholder="建材城收据号" v-model="formList.buildingReceiptNumber" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" placeholder="家装合同号" v-model="formList.homeContractNumber" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="button-fc" type="warning" size="medium" @click="search">查询</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                    <el-tab-pane label="未结算" name="0">
                        <waitCancel @account="accounts" style="margin-top:20px" :tableData="tableData"></waitCancel>
                    </el-tab-pane>
                    <el-tab-pane label="已结算" name="1">
                        <aleradyAccount style="margin-top:20px" :tableData="tableData"></aleradyAccount>
                    </el-tab-pane>
                    <div class="pagination_wrap">
                        <pagination
                            :current-page="currentPage"
                            :pageSize="pageSize"
                            :total="total"
                            @sizeChange="sizeChange"
                            @currentChange="currentChange">
                        </pagination>
                    </div>
             </el-tabs>
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import waitCancel from './waitCancel';
import aleradyAccount from './aleradyAccount';
import {billOrderCollectMoney} from 'api/FinanceCenter/creditManagement/noSettlement/index'
export default {
    components:{
        breadcrumb,
        waitCancel,
        aleradyAccount,
        pagination
    },
    mounted() {
        this.pages()
        this.navList = this.$route.meta;
    },
    data(){
        return{
            navList:[],
            searchtext:'',
            dialog:false,
            status:4,
            tableData:[],
            currentPage:1,
            pageSize:10,
            total:10,
            formList:{
                orderNumber:'',
                customerName:"",
                customerPhone:"",
                collectMoneyName:"",
                receiptNumber:"",
                buildingReceiptNumber:"",
                homeContractNumber:"",
            },
        }
    },
    methods: {
        search(){
            this.pages()
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.pages()
        },
        currentChange(val) {
            this.currentPage = val;
            this.pages()
        },
        pages(){
            this.currentPage = 1;
            this.pages()
        },
        accounts(data){
            this.dialog=true;
        },
        tabClick(val){
            if(val.index==0){
                this.status=4
            }else if(val.index==1){
                this.status=5;
            }
            this.pages()
        }
    },
}
</script>
<style scoped>

</style>

