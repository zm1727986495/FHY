<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input clearable @keyup.enter.native="search" size="medium" v-model="formList.settlementNumber" placeholder="结算单号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input clearable @keyup.enter.native="search" size="medium" v-model="formList.bankCardNumber" placeholder="收款账号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-select @keyup.enter.native="search" v-model="formList.storeId" size="medium" clearable filterable>
                            <el-option v-for="(item,idx) in listStoreArr" :key="idx" :label="item.storeName" :value="item.storeId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                         <el-select @keyup.enter.native="search" v-model="formList.companyId" size="medium" clearable filterable>
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
                        <el-button size="medium" class="button-fc" type="warning">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>

        <el-tabs type="border-card" @tab-click="tabClick" class="m-top20">
            <el-tab-pane label="财务对账">
                <TableOne :btnJurisdiction="btnJurisdiction" :tableData="tableData" @changePages="pages"></TableOne>
            </el-tab-pane>
            <!-- <el-tab-pane label="转业务对账">
                <TableTwo :btnJurisdiction="btnJurisdiction" :tableData="tableData"></TableTwo>
            </el-tab-pane> -->
            <el-tab-pane label="已完成对账">
                <TableThree :btnJurisdiction="btnJurisdiction" :tableData="tableData"></TableThree>
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
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
import TableOne from './tableOne';
import TableTwo from './tableTwo';
import TableThree from './tableThree';
import { listSettlement } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index';
import { listCompanyByAll, listStore} from "@/api/pulicJava"
export default {
    components:{
        breadcrumb,
        pagination,
        TableOne,
        TableTwo,
        TableThree
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
            navList:[],
            total:10,
            listCompanyArr:[],
            formList:{
                page:1,
                limit:10,
                settlementNumber:"",
                companyId:"",
                storeId:"",
                bankCardNumber:'',
                unprocessedStatus:"",
                type:1,
            },
            tableData:[],
            listStoreArr:[],
            btnJurisdiction:{
                edit:false,
                audit:false,
                delete:false,
                account:false
            }
        }
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.audit=JSON.parse(this.$loca.getItem('element'))["reconciliation:btn_audit"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["reconciliation:btn_delete"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["reconciliation:btn_edit"];
            this.btnJurisdiction.account=JSON.parse(this.$loca.getItem('element'))["reconciliation:btn_account"];
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
        tabClick(val){
            if(val.index==0){
                this.formList.type=1;
            }else if(val.index==1){
                this.formList.type=2;
            }else if(val.index==2){
                this.formList.type=3;
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
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        }
    },
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.queryBox{
    width: calc(100% - 70px);
    float: left;
}
.ipts{
    width: 15%;
}
</style>
