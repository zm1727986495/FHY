<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="iconBox"><i class='Icon'></i><span style="display:inline-block;width:80px">结算单</span><p style="margin-left:50px; color:#999">家装公司</p></div>
            <div style="margin-top:20px;border-bottom:1px solid #EBEEF5;padding:0 20px 20px;">
                <ul class="formList clearfloat">
                    <li class="list" style="border-top:1px solid #EBEEF5">
                        <span>付款方</span>
                        <div>
                            {{settlement.companyName}}
                        </div> 
                    </li>
                    <li class="list" style="border-top:1px solid #EBEEF5">
                        <span>收款方式</span>
                        <div>
                            {{settlement.receivablesType}}
                        </div> 
                    </li>
                    <li class="list" style="border-top:1px solid #EBEEF5">
                        <span>费用月份</span>
                        <div>{{settlement.costMonth}}</div> 
                    </li>
                    <li class="list">
                        <span>汇款账号</span>
                        <div>{{settlement.openingBankName}}||{{settlement.accountName}}||{{settlement.bankCardNumber}}</div> 
                    </li>
                    <li class="list">
                        <span>汇款金额</span>
                        <div>{{settlement.receivablesMoney}} 元</div> 
                    </li>
                    <li class="list">
                        <span>结算门店</span>
                        <div>{{settlement.storeName}}</div> 
                    </li>
                </ul>
            </div>
            <div class="iconBox" style="margin-top:20px"><i class='Icon'></i><span style="display:inline-block;width:80px">对账结果</span><p style="margin-left:50px; color:red">汇款金额与实际结算金额不符（差额 20,000 元）</p></div>
            <ul class="MoneyList clearfloat">
                <li>
                    <span>应结算金额：250,000 元</span>
                </li>
                <li>
                    <span>费用总额：30,000 元</span>
                </li>
                <li>
                    <span>实际结算金额：220,000 元</span>
                </li>
            </ul>
        </el-card>
        <el-card class="m-top20" v-if="!$route.query.onlyReady">
            <el-button class="button-96" size="small" @click="goBackAllChange">退回</el-button>
            <el-button class="button-96" size="small" @click="settlementCompletion">结算完成</el-button>
        </el-card>
        <div class="m-top20">
                <el-tabs type="border-card" @tab-click="tabClick">
                    <el-tab-pane label="对账明细">
                        <checkDetil :tableObj="obj1"></checkDetil>
                    </el-tab-pane>
                    <el-tab-pane label="已导入结算明细">
                        <importBillingDetails :tableObj="obj2"></importBillingDetails>
                    </el-tab-pane>
                    <el-tab-pane label="已导入费用明细">
                        <importCostBreakdown :tableObj="obj3"></importCostBreakdown>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="应结未结">
                        <ShouldOutstanding></ShouldOutstanding>
                    </el-tab-pane> -->
                </el-tabs>
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import checkDetil from './audit/checkDetil';
import importBillingDetails from './audit/importBillingDetails';
import importCostBreakdown from './audit/importCostBreakdown';
import ShouldOutstanding from './audit/ShouldOutstanding';
import { 
    getSettlement, 
    listSettlementComparisonVO,
    listBmcSettlementDetailedVO,
    listSettlementDetailedVO,
    listOrderCollectMoneyByBmcSettlementId,
    updateSettlementComparison,
    completionBmcSettlement,
    returnPartnerExpenditureList
 } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index'
export default {
    components:{
        breadcrumb,
        pagination,
        checkDetil,
        importBillingDetails,
        importCostBreakdown,
        ShouldOutstanding,
    },
    mounted() {
        this.navList = this.$route.meta;
        getSettlement({
            bmcSettlementId:this.$route.query.bmcSettlementId
        }).then(res=>{
            for(let i in this.settlement){
                this.settlement[i]=res.data[i]
            }
        })
        this.checkDetilPages()
    },
    data(){
        return{
            navList:[],
            settlement:{
                companyName:"",
                storeName:"",
                costMonth:"",
                openingBankName:"",
                accountName:"",
                bankCardNumber:"",
                receivablesMoney:"",
                settlementType:"",
            },
            param1:{
                page:1,
                limit:10,
                orderNumber:"",
                customerName:"",
                buildingReceiptNumber:"",
                receiptNumber:"",
                failReasons:"",
                settlementComparisonResult:"",
                chooseType:1,
                bmcSettlementId:this.$route.query.bmcSettlementId,
                chooseType:2
            },
            param2:{
                page:1,
                limit:10,
                bmcSettlementId:this.$route.query.bmcSettlementId
            },
            param3:{
                page:1,
                limit:10,
                bmcSettlementId:this.$route.query.bmcSettlementId
            },
            obj1:{
                tableData:[],
                total:10
            },
            obj2:{
                tableData:[],
                total:10
            },
            obj3:{
                tableData:[],
                total:10
            },
        }
    },
    methods: {
        goBackAllChange(){
            returnPartnerExpenditureList({
                bmcSettlementId:this.$route.query.bmcSettlementId
            }).then(res=>{
                this.$message({
                    message: '退回成功',
                    type: 'success'
                });
            })
        },
        settlementCompletion(){
            completionBmcSettlement(
                {
                    bmcSettlementId:this.$route.query.bmcSettlementId,
                    settlementStatus:0,
                    differenceAmount:2000
                }
            ).then(res=>{
                this.$message({
                    message: '结算完成',
                    type: 'success'
                });
                setTimeout(()=>{
                    this.$router.push({
                        path:"reconciliation"
                    })
                },500)
            })
        },
        checkDetilPages(){
            listSettlementComparisonVO(this.param1).then(res=>{
                this.obj1.tableData=res.data.rows;
                this.obj1.total=res.data.total;
            })
        },
        //已导入结算明细
        billingDetailsPages(){
            listBmcSettlementDetailedVO(this.param2).then(res=>{
                this.obj2.tableData=res.data.rows;
                this.obj2.total=res.data.total
            })
        },
        //已导入费用明细
        costBreakdownPages(){
            listSettlementDetailedVO(this.param3).then(res=>{
                this.obj3.tableData=res.data.rows;
                this.obj3.total=res.data.total
            })
        },
        tabClick(val){
            if(val.index==0){
                this.checkDetilPages()
            }else if(val.index==1){
                this.billingDetailsPages()
            }else if(val.index==2){
                this.costBreakdownPages()
            }
        },
    },
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.formList{
    width: 100%;
    border-left: 1px solid #EBEEF5;
    border-top: 1px solid #EBEEF5;
}
.list{
    width: 33.3%;
    height: 50px;

    border-right:1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    float: left;
}
.list>span{
    display: inline-block;
    width: 100px;
    border-right: 1px solid #EBEEF5;
    height: 100%;
    text-align: center;
    line-height: 50px;
}
.list>div{
    width: calc(100% - 105px);
    display: inline-block;
    text-align: center;
    color:#666;
}
.MoneyList{
    margin-top:20px;
    padding:0 20px;
}
.MoneyList>li{
    width: 25%;
    float: left;;
}
</style>
