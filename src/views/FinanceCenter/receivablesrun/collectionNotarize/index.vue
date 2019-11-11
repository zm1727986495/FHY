<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="queryForm">
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input size="medium" @keyup.enter.native="search" placeholder="订单号/姓名/电话" v-model="formList.orderCustomer" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input size="medium" @keyup.enter.native="search" placeholder="收据号" v-model="formList.collectNumber" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input size="medium" @keyup.enter.native="search" placeholder="门店名称" v-model="formList.storeName" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            @keyup.enter.native="search"
                            range-separator="-"
                            start-placeholder="收款开始日期"
                            size="medium"
                            value-format="yyyy-MM-dd"
                            @change="resetDate1"
                            end-placeholder="收款结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            v-model="date2"
                            type="daterange"
                            @keyup.enter.native="search"
                            range-separator="-"
                            start-placeholder="审核开始日期"
                            size="medium"
                            @change="resetDate2"
                            value-format="yyyy-MM-dd"
                            end-placeholder="审核结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-button class="button-fc" type="warning" size="medium" @click="search">查询</el-button>
                        <el-button type="primary" size="medium" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-tabs type="border-card" @tab-click="tabClick">
            <el-tab-pane label="不一致明细" name="0">
                <inconformity :tableLoading="tableLoading" :btnJurisdiction="btnJurisdiction" :tableData="tableData" class="m-top20"></inconformity>
            </el-tab-pane>
            <el-tab-pane label="无法确认明细" name="1">
                <cannotConfirm :tableLoading="tableLoading" :btnJurisdiction="btnJurisdiction" :tableData="tableData" class="m-top20"></cannotConfirm>
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
import inconformity from './inconformity';
import cannotConfirm from './cannotConfirm'
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import { listBmcOrderCollectMoneyVO, listBmcOrderCollectMoneyNOVO } from '@/api/receivablesrun/collectionNotarize/index'
export default {
    // mounted() {
    //     var now = new Date(); //当前日期 
    //     var nowMonth = now.getMonth(); //当前月 
    //     var nowYear = now.getFullYear(); //当前年 
    //     var monthStartDate = new Date(nowYear, nowMonth, 1); 
    //     var monthEndDate = new Date(nowYear, nowMonth+1, 0);
    //     this.date=[
    //         monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth()+1) + '-' +monthStartDate.getDate(),
    //         monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth()+1) + '-' +monthEndDate.getDate()
    //     ];
    //     this.navList=this.$route.meta;
    //     this.pages()
    //     this.btnJurisdiction.editPrice=JSON.parse(this.$loca.getItem("element"))["collectionNotarize:btn_editPrice"]
    //     this.btnJurisdiction.relevance=JSON.parse(this.$loca.getItem("element"))["collectionNotarize:btn_relevance"]
    // },
    activated(){
        var now = new Date(); //当前日期 
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        var monthStartDate = new Date(nowYear, nowMonth, 1); 
        var monthEndDate = new Date(nowYear, nowMonth+1, 0);
        this.date=[
            monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth()+1) + '-' +monthStartDate.getDate(),
            monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth()+1) + '-' +monthEndDate.getDate()
        ];
        this.navList=this.$route.meta;
        this.pages()
        this.btnJurisdiction.editPrice=JSON.parse(this.$loca.getItem("element"))["collectionNotarize:btn_editPrice"]
        this.btnJurisdiction.relevance=JSON.parse(this.$loca.getItem("element"))["collectionNotarize:btn_relevance"]
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    components:{
        inconformity,
        cannotConfirm,
        breadcrumb,
        pagination
    },
    data(){
        return{
            navList:[],
            names:'',
            searchData: [],
            searchtext:'',
            selIpt:'',
            date:['',''],
            date2:['',''],
            total:0,
            tableData:[],
            show:false,
            text:'更多',
            formList:{
                page:1,
                limit:10,
                orderCustomer:'',
                collectNumber:'',
                storeName:'',
                auditStartTime:'',
                auditStartEnd:'',
                gatheringEndTime:'',
                gatheringStartTime:'',
            },
            btnJurisdiction:{
                editPrice:false,
                relevance:false,
            },
            index:0,
            tableLoading:false
        }
    },
    methods: {
        resetDate2(val) {
            if(!val){
            this.date2 = ["", ""]
            }
        },
        resetDate1(val) {
            if(!val){
            this.date = ["", ""]
            }
        },
        more(){
            this.show=!this.show;
            this.text=this.show?"收起":"更多"
        },
        tabClick(val){
            this.index=val.index
            if(val.index==0){
                this.formList.page=1;
                this.pages()
            }else if(val.index==1){
                this.formList.page=1;
                this.noneOKPages()
            }
            
        },
        noneOKPages(){
            this.tableLoading=true;
            this.formList.auditStartTime=this.date2[0];
            this.formList.auditStartEnd=this.date2[1];
            this.formList.gatheringEndTime=this.date[0];
            this.formList.gatheringStartTime=this.date[1];
            let obj=Object.assign({},this.formList);
            obj.collectStoreId=JSON.parse(this.$loca.getItem("activeStoreId")).storeId;
            listBmcOrderCollectMoneyNOVO(obj).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
                this.tableLoading=false;
            })
        },
        reset(){
            var now = new Date(); //当前日期 
            var nowMonth = now.getMonth(); //当前月 
            var nowYear = now.getFullYear(); //当前年 
            var monthStartDate = new Date(nowYear, nowMonth, 1); 
            var monthEndDate = new Date(nowYear, nowMonth+1, 0);
            this.date=[
            monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth()+1) + '-' +monthStartDate.getDate(),
            monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth()+1) + '-' +monthEndDate.getDate()
            ];
            for(let i in this.formList){
                this.formList[i]="";
            }
            this.formList.page=1;
            this.formList.limit=10;
            this.pages()
        },
        search(){
            this.formList.page=1;
            if(this.index==0){
                this.formList.page=1;
                this.pages()
            }else if(this.index==1){
                this.formList.page=1;
                this.noneOKPages()
            }
        },
        pages(){
            this.tableLoading=true;
            this.formList.auditStartTime=this.date2[0];
            this.formList.auditStartEnd=this.date2[1];
            this.formList.gatheringEndTime=this.date[0];
            this.formList.gatheringStartTime=this.date[1];
            listBmcOrderCollectMoneyVO(this.formList).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
                this.tableLoading=false;
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
</style>
