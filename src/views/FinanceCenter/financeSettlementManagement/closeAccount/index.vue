<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input @keyup.enter.native="search" clearable size="medium" v-model="formList.settlementNumber" placeholder="结算单号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input @keyup.enter.native="search" clearable  size="medium" v-model="formList.bankCardNumber" placeholder="收款账号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-select @keyup.enter.native="search" filterable clearable v-model="formList.storeId" size="medium">
                            <el-option v-for="(item,idx) in listStoreArr" :key="idx" :label="item.storeName" :value="item.storeId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                         <el-select @keyup.enter.native="search" clearable filterable v-model="formList.companyId" size="medium">
                            <el-option v-for="(item,idx) in listCompanyArr" :key="idx" :label="item.companyName" :value="item.companyId"></el-option>
                         </el-select>
                    </el-col>
                    <el-col :span="6">
                         <el-select @keyup.enter.native="search" v-model="formList.unprocessedStatus" size="medium" clearable filterable>
                            <el-option label="待结算" value="0"></el-option>
                            <el-option label="结算中" value="1"></el-option>
                            <el-option label="已结算" value="2"></el-option>
                         </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="待销账" name="0">
                    <waitWriteOff :btnJurisdiction="btnJurisdiction" :tableData="tableData" @requestQuery="changes"></waitWriteOff>
                </el-tab-pane>
                <el-tab-pane label="已销账" name="1">
                    <aleradyWriteOff :btnJurisdiction="btnJurisdiction" :tableData="tableData"></aleradyWriteOff>
                </el-tab-pane>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="formList.page"
                        :pageSize="formList.limit"
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
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
import waitWriteOff from './waitWrite-off';
import aleradyWriteOff from './aleradyWrite-off';
import { listSettlement } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index';
import { listCompanyByAll, listStore} from "@/api/pulicJava"
export default {
    components:{
        breadcrumb,
        pagination,
        waitWriteOff,
        aleradyWriteOff
    },
    activated(){
        this.btnInit()
        this.navList = this.$route.meta;
        listStore().then(res=>{
            this.listStoreArr=res.data;
        })
        listCompanyByAll(
            {
                companyType:1
            }
        ).then(res=>{
            this.listCompanyArr=res.data;
        })
        this.pages()
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    //     listStore().then(res=>{
    //         this.listStoreArr=res.data;
    //     })
    //     listCompanyByAll(
    //         {
    //             companyType:1
    //         }
    //     ).then(res=>{
    //         this.listCompanyArr=res.data;
    //     })
    //     this.pages()
    // },
    data(){
        return{
            span:6,
            navList:[],
            total:10,
            formList:{
                page:1,
                limit:10,
                settlementNumber:"",
                companyId:"",
                storeId:"",
                bankCardNumber:'',
                unprocessedStatus:"",
                status:7,
            },
            listStoreArr:[],
            listCompanyArr:[],
            tableData:[],
            btnJurisdiction:{
                writeOff:false
            }
        }
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.writeOff=JSON.parse(this.$loca.getItem('element'))["closeAccount:btn_writeOff"];
        },
        search(){
            this.formList.page=1;
            this.pages()
        },
        reset(){
            this.formList.page=1;
            this.formList.settlementNumber="";
            this.formList.companyId="";
            this.formList.storeId="";
            this.formList.bankCardNumber='';
            this.formList.unprocessedStatus="";
            this.pages()
        },
        changes(){
            this.pages()
        },
        tabClick(val){
            if(val.index==0){
                this.formList.status=7;
            }else if(val.index==1){
                this.formList.status=8;
            }
            this.pages()
        },
        pages(){
            listSettlement(this.formList).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages();
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        }
    },
}
</script>
<style scoped>

</style>
