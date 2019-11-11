<template>
    <div class="bodys">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <!-- <el-card>
            <div class="borderLine">
                <div class="iconBox"><i class='Icon'></i><span>供货商结算单</span></div>
                <ul class="lists clearfloat">
                    <li>
                        <span>供货商：</span>
                        <label>{{messageQuery.companyName}}</label>
                    </li>
                    <li>
                        <span>费用月份：</span>
                        <label>{{messageQuery.feeMonth}}</label>
                    </li>
                </ul>
            </div>
            <div class="borderLine">
                <div class="iconBox"><i class='Icon'></i><span>供货商结算</span></div>
                <ul class="lists clearfloat">
                    <li>
                        <span>结算金额：</span>
                        <label>{{messageQuery.settlementAmount}}</label>
                    </li>
                    <li>
                        <span>加减收金额：</span>
                        <label>{{messageQuery.asAmount}}</label>
                    </li>
                    <li>
                        <span>额外加减收金额：</span>
                        <label>{{messageQuery.additionalAsAmount}}</label>
                    </li>
                </ul>
            </div>
        </el-card> -->
        <el-card>
            <el-row :gutter="10">
                <el-col :span="6"><el-input clearable size="medium" @keyup.enter.native="search" placeholder="采购单号" v-model="params.purchaseNumber"></el-input></el-col>
                <el-col :span="18">
                    <el-button size="medium" class="button-fc" @click="search">查询</el-button>
                    <el-upload
                        action="/api/pc/purchasingSettlement/importPurchasingSettlement"
                        class="upload-demo"
                        multiple
                        :headers="headers"
                        :data="costParams"
                        :show-file-list="false"
                        :before-upload="beforeUploat"
                        :on-success="uploadSuccess"
                        :on-error="onError"
                        style="display:inline-block;margin-right:10px"
                        >
                        <el-button class="button-96" size="medium">导入成本</el-button>
                    </el-upload>
                </el-col>
            </el-row>
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="完全一致" name="0">
                    <ShouldOutstanding :params="params" :tableObj="obj"></ShouldOutstanding>
                </el-tab-pane>
                <el-tab-pane label="不一致" name="1">
                    <BillingDetails :params="params" :tableObj="obj" :status="status"></BillingDetails>
                </el-tab-pane>
                <el-tab-pane label="无业务" name="2">
                    <SubmitDetailed :params="params" :tableObj="obj"></SubmitDetailed>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-card class="m-top20">
            <div style="display:flex;justify-content:center;align-items:center">
                <el-button size="medium" type="primary" @click="auditPass">通过</el-button>
                <el-button size="medium" @click="cancel">取消</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import BillingDetails from './reviewDetailed/BillingDetails';
import ShouldOutstanding from './reviewDetailed/ShouldOutstanding';
import SubmitDetailed from './reviewDetailed/SubmitDetailed';
import ImportDetail from './reviewDetailed/ImportDetail';
import { returnPurchasingSettlement, passPurchasingSettlement, listPurchasingSettlementDetail, listUnfinishedDetail, listBusinessDetail, listFinanceDetail, getPurchasingSettlement } from "@/api/FinanceCenter/statementReview/index";
import { setTimeout } from 'timers';
import { getToken } from 'utils/auth';// 登录Token
export default {
    components:{
        breadcrumb,
        BillingDetails,
        ShouldOutstanding,
        SubmitDetailed,
        ImportDetail,
    },
    data(){
        return{
            navList:[],
            breadcrumb,
            messageQuery:{
                additionalAsAmount:"",
                asAmount:"",
                settlementAmount:"",
                companyName:'',
                feeMonth:"",
            },
            params:{
                purchaseNumber:'',
                purchasingSettlementId:this.$route.query.purchasingSettlementId,
                page:1,
                limit:10,
                contrastResults:0
            },
            headers: {
                Authorization: getToken(),
                // contentType:"application/x-www-form-urlencoded; charset=UTF-8"
            },
            obj:{
                total:10,
                tableData:[],
                feeMonth:'',
                tabLoading:false
            },
            status:0,
            returnReason:'',
            costParams:{
                purchasingSettlementId:'',
                feeMonth:'',
            },
        }
    },
    mounted() {
        this.navList = this.$route.meta;
        this.status=1
    },
    methods: {
        beforeUploat(val){
            this.costParams.purchasingSettlementId=this.$route.query.purchasingSettlementId;
            this.costParams.feeMonth=this.$route.query.feeMonth;
            return true
        },
        uploadSuccess(val){
            if(this.params.contrastResults==0){
                if(this.status==0){
                        this.status=1;
                    }else{
                        this.status=0;
                    }
            }else{
                this.pages()
            }
            this.$message({
                message: '导入成功',
                type: 'success'
            });
        },
        onError(val){
            this.$message.error("导入失败")
        },
        search(){
            this.pages()
        },
        auditPass(){
            passPurchasingSettlement(
                {
                    purchasingSettlementId:this.$route.query.purchasingSettlementId
                }
            ).then(res=>{
                this.$message({
                    message: '审核通过',
                    type: 'success'
                });
                setTimeout(()=>{
                    this.$router.push({
                        path:'statementReview'
                    })
                },500)
            })
        },
        cancel(){
            this.$router.push({
                path:'statementReview'
            })
        },
        tabClick(val){
            this.obj.tableData=[];
            this.obj.total=0;
            this.params.page=1;
            switch(Number(val.index)){
                //一致
                case 0:
                    this.params.contrastResults=0;
                    this.pages()
                break;
                //不一致
                case 1:
                    this.params.contrastResults=1;
                    if(this.status==0){
                        this.status=1;
                    }else{
                        this.status=0;
                    }
                break;
                //无业务
                case 2:
                    this.params.contrastResults=2;
                    this.pages()
                break;
            }
        },
        pages(){
            this.obj.tabLoading=true;
            listPurchasingSettlementDetail(
                this.params
            ).then(res=>{
                this.obj.tableData=res.data.rows;
                this.obj.total=res.data.total;
                this.obj.tabLoading=false;
            })
        }
    }
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.bodys{
    font-family: "微软雅黑"
}
.lists{
    margin-top:20px;
}
    .lists>li{
        float: left;
        width: 25%;
    }
    .lists>li>span{
        display: inline-block;
        width: 120px;
        text-align: right;
        color:#666;
    }
    .lists>li>label{
        font-size: 16px;
    }
    .borderLine{
        border-bottom:1px solid #EBEEF5;
        padding-bottom:20px;
        margin-bottom: 20px;
    }
</style>
