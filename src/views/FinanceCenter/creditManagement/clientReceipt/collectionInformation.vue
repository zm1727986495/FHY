<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card v-if="datas.length">
            <div class="titles">驳回原因</div>
            <div>
                <ul style="margin-top:20px;" v-for="(item,idx) in datas" :key="idx">
                    <li style="display:inline-block;width:30%">
                        <span style="display:inline-block;width:100px;text-align:right;">驳回人：</span>
                        <div style="display:inline-block">{{item.createName}}</div>
                    </li>
                    <li style="display:inline-block;width:30%">
                        <span style="display:inline-block;width:100px;text-align:right;">驳回时间：</span>
                        <div style="display:inline-block">{{item.createTime}}</div>
                    </li>
                    <li style="display:inline-block;width:30%">
                        <span style="display:inline-block;text-align:right;float:left">驳回原因：{{item.returnReason}}</span>
                    </li>
                </ul>
            </div>
        </el-card>
        <el-card class="m-top20">
            <div class="iconBox"><i class='Icon'></i><span>收款信息</span></div>
            <div>
                <ul class="formList clearfloat">
                    <li class="list">
                        <span>所属门店：</span>
                        <div>{{formList.shop}}</div>
                    </li>
                    <li class="list">
                        <span>所属摊位：</span>
                        <div>{{formList.booth}}</div>
                    </li>
                    <li class="list">
                        <span>实收门店：</span>
                        <div>{{formList.realityShop}}</div>
                    </li>
                    <li class="list">
                        <span>实收摊位：</span>
                        <div>{{formList.realityBooth}}</div>
                    </li>
                    <li class="list">
                        <span>收款类型：</span>
                        <div>
                            <el-select size="medium" v-model="formList.selectType" :disabled="true" clearable style="width:100%">
                                <el-option v-for="(item,idx) in types" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="list">
                        <span>提交人：</span>
                        <div>{{formList.user}}</div>
                    </li>
                    <!-- <li class="list">
                        <span>内部收据号：</span>
                        <div>
                            <el-input v-model="formList.receiptNumber" :disabled="true" clearable></el-input>
                        </div>
                    </li>
                    <li class="list">
                        <span>建材城收据号：</span>
                        <div><el-input v-model="formList.buildingReceiptNumber" :disabled="true" clearable></el-input></div>
                    </li> -->
                    <li class="list">
                        <span>收款日期：</span>
                        <div>
                            <el-date-picker
                                v-model="formList.gatheringTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                size="medium"
                                :disabled="true"
                                placeholder="收款日期">
                            </el-date-picker>
                        </div>
                    </li>
                    <!-- <li class="remarks clearfloat">
                        <span>备注：</span>
                        <div><el-input type="textarea" v-model="formList.Remark" :disabled="true" clearable></el-input></div>
                    </li> -->
                </ul>
            </div>
        </el-card>
        <div class="m-top20">
            <el-card>
                <div class="m-top20">
                    <div style="padding:0 15px;">
                        <el-table
                        border
                        :row-class-name="tableRowClassName"
                        :data="childTable"
                        style="width: 100%;">
                            <el-table-column show-overflow-tooltip prop="orderNumber" align="center" label="订单号"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="orderTypeName" align="center" label="订单类型"></el-table-column>
                            <el-table-column prop="storeLeader" align="center" label="本次收款金额" width="200px">
                                <template slot-scope="scope">
                                    <el-input size="medium" v-model="scope.row.collectMoney" :disabled="true" clearable></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="boothNumber" align="center" label="商场代金券" width="500px">
                                <template slot-scope="scope">
                                    <label>代金券</label>
                                    <div style="display:inline-block;width:40%">
                                        <el-input size="medium" v-model="scope.row.shopCashCoupon" :disabled="true" clearable></el-input>
                                    </div>
                                    <label>金额</label>
                                    <div style="display:inline-block;width:20%">
                                        <el-input size="medium" v-model="scope.row.shopCashCouponAmount" :disabled="true" clearable></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="companyName" align="center" label="自有代金券" width="500px">
                                <template slot-scope="scope" >
                                    <div style="display:flex;align-items:center;justify-content:space-between">
                                        <label>代金券</label>
                                        <div style="display:inline-block;width:40%">
                                            <el-input size="medium" v-model="scope.row.ownCashCoupon" :disabled="true" clearable></el-input>
                                        </div>
                                        <!-- <div class="verify" style="display:inline-block;width:50px;height:35px;border:1px solid skyblue;line-height:35px;margin-left:20px;">
                                            验证
                                        </div> -->
                                        <span style="margin-left:20px;">
                                            金额：<el-input size="medium" clearable v-model="scope.row.ownCashCouponAmount" style="width:100px" :disabled="true"></el-input>元
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="m-top20">
            <el-card>
                <div class="iconBox"><i class='Icon'></i><span>财务确认</span></div>
                <div>
                    <div class="queryForm">
                        <el-form label-width="140px">
                             <div class="module model collec">
                                <el-form-item label="收款方式：">
                                    <el-select size="medium" v-model="MoneyType" :disabled="edit" @change="changeMethod">
                                        <el-option v-for="(item,idx) in methods" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="公司收款账号:" v-if="showBankCard" >
                                    <el-select :disabled="edit" v-model="companyBankCardId" filterable placeholder="公司收款账号" clearable>
                                        <el-option v-for="(item,idx) in bankArr" :label="item.openingBankName+'||'+item.accountName+'||'+item.bankCardNumber" :value="item.bankAccountId" :key="idx"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="内部收据号:"  v-if="isShowNumber">
                                    <el-input :disabled="edit" v-model="receiptNumber" placeholder="内部收据号" maxlength="50" class="ipts"></el-input>
                                </el-form-item>
                                <el-form-item label="建材城收据号:" v-if="showHomeBidding" >
                                    <el-input :disabled="edit" v-model="buildingReceiptNumber" placeholder="建材城收据号" maxlength="50" class="ipts"> </el-input>
                                </el-form-item>
                                <el-form-item label="家装公司:" v-if="showHomeContractNumber" >
                                    <el-input :disabled="edit" v-model="homeCompanyName" placeholder="家装公司" maxlength="50" class="ipts"> </el-input>
                                </el-form-item>
                                <el-form-item label="家装合同号:" v-if="showHomeContractNumber" >
                                    <el-input :disabled="edit" v-model="homeContractNumber" placeholder="家装合同号" maxlength="50" class="ipts"> </el-input>
                                </el-form-item>
                             </div>
                        </el-form>
                    </div>
                    <ul class="MoneyForm clearfloat" style="margin-top:20px;">
                        <li class="money-List">
                            <span style="padding-right:12px">备注：</span>
                            <div>
                                <el-input type="textarea" :disabled="edit" v-model="formList.Remark" maxlength="50"> </el-input>
                            </div>
                        </li>
                    </ul>
                    
                    
                    <!-- <ul class="MoneyForm clearfloat" style="margin-top:20px;">
                        <li class="money-List">
                            <span>收款方式：</span>
                            <div>
                                <el-select v-model="MoneyType" :disabled="edit" clearable @change="changeMethod">
                                    <el-option v-for="(item,idx) in methods" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="money-List">
                            <span>建材城收据号：</span>
                            <div>
                                <el-select v-model="MoneyType" :disabled="edit" clearable @change="changeMethod">
                                    <el-option v-for="(item,idx) in methods" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="money-List">
                            <span>内部收据号：</span>
                            <div>
                                <el-select v-model="MoneyType" :disabled="edit" clearable @change="changeMethod">
                                    <el-option v-for="(item,idx) in methods" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <!-- <li class="money-List">
                            公司收款账号：
                            <el-input></el-input>
                        </li> -->
                    <!-- </ul> -->
                    <ul style="margin-top:20px;display:flex;justify-content:space-between;padding-left:20px;align-items:center">
                        <li style="display:inline-block;height:36px">
                            <el-checkbox v-model="isPoundage" :disabled="edit">是否刷卡手续费：</el-checkbox>
                            <span v-if="isPoundage">刷卡卡号：</span>
                            <div v-if="isPoundage" style="display:inline-block">
                                <el-input v-model="bankCardId" :disabled="edit" clearable></el-input>
                            </div>
                        </li>
                        <li style="display:inline-block;height:36px" v-if="isPoundage">
                            <span>刷卡手续费：</span>
                            <div style="display:inline-block;width:200px">
                                <el-input @input="changeNum(costMoney,2)" v-model="costMoney" :disabled="edit" clearable></el-input>
                            </div>
                            元
                        </li>
                        <li style="display:inline-block;height:36px"> 
                            <el-checkbox v-model="isReady" :disabled="edit&&!show">收据是否齐备</el-checkbox>
                        </li>
                    </ul>
                    <div class="allMoney clearfloat" style="margin-top:20px;padding-left:20px">
                        <h3>实收总金额：<span style="color:red">{{receivables2}}元</span></h3>
                        <div style="float:right">
                            <span>下载附件：</span>
                            <div><el-button :disabled="edit" @click="downLoad">选择下载文件</el-button></div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <div  style="margin-top:20px">
            <el-card>
                <div class="btnList" v-if="collMoney">
                    <el-button type="primary" size="medium" @click="goBack">驳回</el-button>
                    <el-button type="primary" size="medium" :loading="isLoading" @click="pass">确认收款</el-button>
                    <el-button size="medium" @click="cancel">取消</el-button>
                </div>
                <div class="btnList" v-if="show">
                    <el-button type="primary" size="medium" @click="goBack">审核驳回</el-button>
                    <el-button type="primary" size="medium" :loading="isLoading" @click="confirmAudit">确认审核</el-button>
                    <el-button size="medium" @click="cancel">取消</el-button>
                </div>
                <div class="btnList" v-if="close">
                    <el-button size="medium" @click="cancel">关闭</el-button>
                </div>
            </el-card>
        </div>
        <el-dialog title="驳回原因" :visible.sync="goBackReason" width="30%" custom-class="customDialogTitle">
            <el-input type="textarea" v-model="goBackValues" clearable></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="goBackReason = false">取 消</el-button>
                <el-button type="primary" :loading="goBackLoading" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../../components/breadcrumb";
import {  listBaseDict,getOrderCollectMoney, returnOrderCollectMoneySuatus } from '@/api/receivablesrun/clientcollection/index';
import{
receivableOrderCollectMoney
}from 'api/FinanceCenter/creditManagement/clientReceipt/index';
import { examineOrderCollectMoney} from 'api/FinanceCenter/creditManagement/customerDocumentAudit/index';
import { getBuffer, formatAmount } from 'utils/pubilcFn';
import { listCompanyBankAccount } from '@/api/receivablesrun/clientcollection/index';
import { getHomeCompany } from '@/api/receivablesrun/clientcollection/index';
export default {
    components:{
        breadcrumb
    },
    mounted() {
        listCompanyBankAccount().then(res=>{
            this.bankArr=res.data;
        })
        listBaseDict(
            {
                dataType:"PAYMENT_WAY"
            }
        ).then(res=>{
            this.methods=res.data
        })
        listBaseDict(
            {
                dataType:"PAYMENT_TYPE"
            }
        ).then(res=>{
            this.types=res.data
        })
    },
    watch: {
    },
    created() {
        getOrderCollectMoney(
            {
                collectMoneyId:this.id
            }
        ).then(res=>{
            let data=res.data;
            this.formList.shop=data.collectStoreName&&data.collectStoreName;
            this.formList.booth=data.collectStoreBoothName;
            this.formList.user=data.commitName;
            this.formList.realityShop=data.actualStoreName;
            this.formList.realityBooth=data.collectStoreBoothName;
            this.formList.selectType=Number(data.collectType)
            this.receiptNumber=data.receiptNumber;
            this.homeContractNumber=data.homeContractNumber;
            this.buildingReceiptNumber=data.buildingReceiptNumber;
            this.formList.Remark=data.remark;
            this.formList.gatheringTime=data.gatheringTime;
            this.isPoundage=data.isPoundage==0?false:true;
            this.bankCardId=data.bankCardId;
            this.costMoney=data.costMoney;
            this.childTable=data.relOrderCollectMoneyDTOS;
            this.MoneyType=Number(data.collectWay);
            this.paymentAmount=data.amount;
            this.companyBankCardId=data.companyBankCardId;
            this.homeCompanyName=data.homeCompanyName;
            this.receivables2=formatAmount(data.amount);
            // this.isReady=data.isReady?true:false;
            this.commodityPics=data.commodityPics;
            this.datas=data.returnOrderCollectMonies;
            if(this.MoneyType==223){
                this.showBankCard=true;
                this.showHomeBidding=false;
                this.showHomeContractNumber=false;
                this.isShowNumber=true;
            }else if(this.MoneyType==224){
                this.showHomeBidding=true;
                this.showBankCard=false;
                this.showHomeContractNumber=false;
                this.isShowNumber=false;
            }else if(this.MoneyType==225){
                this.showHomeBidding=false;
                this.showBankCard=false;
                this.isShowNumber=false;
                if(this.childTable.length>1){
                    this.MoneyType=null;
                    this.$message({
                        message: '只可选择一条',
                        type: 'warning'
                    })
                }else if(this.childTable.length==1){
                    getHomeCompany({
                        orderId:this.childTable[0].orderId
                    }).then(res=>{
                        if(res.data){
                            this.showHomeContractNumber=true;
                        }else{
                            this.MoneyType=null;
                            this.$message({
                                message: '当前订单没有申请通过',
                                type: 'warning'
                            })
                        }
                    })
                }else{
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            }else if(this.MoneyType==1277||this.MoneyType==1278){
                this.showBankCard=false;
                this.showHomeBidding=false;
                this.showHomeContractNumber=false;
                this.isShowNumber=false;
            }else{
                this.showBankCard=false;
                this.showHomeBidding=false;
                this.showHomeContractNumber=false;
                this.isShowNumber=true;
            }
        })
        this.navList = this.$route.meta;
    },
    data(){
        return{
            methods:[],
            types:[],
            edit:Boolean(this.$route.query.edit),
            id:this.$route.query.id,
            show:Boolean(this.$route.query.isShow),
            collMoney:Boolean(this.$route.query.collMoney),
            close:Boolean(this.$route.query.close),
            goBackReason:false,
            names:'',
            MoneyType:'',
            MoneyUser:'',
            navList: [],
            contractNum:'',
            selectType:'',
            tableData: [],
            goBackValues:'',
            childTable:[],
            paymentAmount:'',
            receivables2:'',
            receiptNumber:null,//  内部收据号
            buildingReceiptNumber:null,//建材城
            homeContractNumber:null,//家装
            homeCompanyName:null,//家装公司名
            companyBankCardId:null,//公司收款账号
            datas:[],
            bankArr:[],
            formList:{
                selectType:'',
                shop:'',
                booth:'',
                realityShop:'',
                realityBooth:'',
                receiptNumber:'',
                Num:'',
                homeContractNumber:'',
                buildingReceiptNumber:'',
                Remark:'',
                gatheringTime:''
            },
            isPoundage:false,
            bankCardId:'',
            costMoney:'',
            isReady:true,
            commodityPics:[],
            showBankCard:false,
            showHomeBidding:false,
            showHomeContractNumber:false,
            isShowNumber:false,
            isLoading:false,
            goBackLoading:false
        }
    },
    computed: {
        
    },
    methods:{
        changeMethod(val){
            // this.ruleForm.Number = null;
            // this.ruleForm.buildingNumber = null;
            // this.ruleForm.showHomeContractNumber = null;
            // this.ruleForm.companyBankCardId = null;
            if(val==223){
                this.showBankCard=true;
                this.showHomeBidding=false;
                this.showHomeContractNumber=false;
                this.isShowNumber=true;
            }else if(val==224){
                this.showHomeBidding=true;
                this.showBankCard=false;
                this.showHomeContractNumber=false;
                this.isShowNumber=false;
            }else if(val==225){
                this.showHomeBidding=false;
                this.showBankCard=false;
                this.isShowNumber=false;
                this.showHomeBidding=false;
                this.showBankCard=false;
                this.isShowNumber=false;
                if(this.childTable.length>1){
                    this.MoneyType=null;
                    this.$message({
                        message: '只可选择一条',
                        type: 'warning'
                    })
                }else if(this.childTable.length==1){
                    getHomeCompany({
                        orderId:this.childTable[0].orderId
                    }).then(res=>{
                        if(res.data){
                            this.showHomeContractNumber=true;
                        }else{
                            this.MoneyType=null;
                            this.$message({
                                message: '当前订单没有申请通过',
                                type: 'warning'
                            })
                        }
                    })
                }else{
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            }else if(val==1277||val==1278){
                this.showBankCard=false;
                this.showHomeBidding=false;
                this.showHomeContractNumber=false;
                this.isShowNumber=false;
            }else{
                this.showBankCard=false;
                this.showHomeBidding=false;
                this.showHomeContractNumber=false;
                this.isShowNumber=true;
            }
        },
        downLoad(){
            if(this.commodityPics.length){
                // 下载到本地
                getBuffer(this.commodityPics[0].sourceName).then(data=>{
                    var a = document.createElement('a');
                    a.href = data;
                    a.download = data;
                    document.body.appendChild(a);
                    a.click();
                }).catch(err => {
                    this.$message({
                        message: '下载失败',
                        type: 'danger'
                    });
                })
            }else{
                this.$message({
                    message: '无文件可下载',
                    type: 'warning'
                });
            }
        },
        changeNum(val,idx){
            if(idx==2){
                this.costMoney=val.replace(/[^\d]/g,'');
            }
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        goBack(){
            this.goBackReason=true;
        },
        pass(){
            
            let poundage=0,Ready=0;
            if(this.isPoundage){
                poundage=1
            }else{
                poundage=0
            }
            if(this.isReady){
                Ready=1
            }else{
                Ready=0
            }
            let params = {
              collectMoneyId:this.id,
              isPoundage:poundage,
              bankCardId:this.bankCardId,
              costMoney:this.costMoney,
              isReady:Ready,
              collectWay:this.MoneyType,
              receiptNumber:this.receiptNumber,//  内部收据号
              buildingReceiptNumber:this.buildingReceiptNumber,//建材城
              homeContractNumber:this.homeContractNumber,//家装
              homeCompanyName:this.homeCompanyName,//家装公司名
              companyBankCardId:this.companyBankCardId,//公司收款账号
              remark:this.formList.Remark
            }
            this.isLoading=true;
            receivableOrderCollectMoney(params).then(res=>{
                this.isLoading=false;
                this.$message({
                    message: '收款成功',
                    type: 'success'
                });
                this.$router.push({
                    path:'clientReceipt'
                })
            })
        },
        confirmAudit(){
            let poundage=0,Ready=0;
            if(this.isPoundage){
                poundage=1
            }else{
                poundage=0
            }
            if(this.isReady){
                Ready=1
            }else{
                Ready=0
            }
            this.isLoading=true;
            examineOrderCollectMoney(
                {
                    collectMoneyId:this.id,
                    isPoundage:poundage,
                    bankCardId:this.bankCardId,
                    costMoney:this.costMoney,
                    isReady:Ready,
                    collectWay:this.MoneyType,
                    receiptNumber:this.receiptNumber,//  内部收据号
                    buildingReceiptNumber:this.buildingReceiptNumber,//建材城
                    homeContractNumber:this.homeContractNumber,//家装
                    homeCompanyName:this.homeCompanyName,//家装公司名
                    companyBankCardId:this.companyBankCardId,//公司收款账号
                    remark:this.formList.Remark
                }
            ).then(res=>{
                this.isLoading=false;
                this.$message({
                    message: '审核成功',
                    type: 'success'
                });
                this.$router.push({
                    path:'customerDocumentAudit'
                })
            })
        },
        confirm(){
            if(this.goBackValues){
                this.goBackLoading=true;
                returnOrderCollectMoneySuatus(
                    {
                        collectMoneyIdss:this.id,
                        returnReason:this.goBackValues
                    }
                ).then(res=>{
                    this.goBackReason=false;
                    this.goBackLoading=true;
                    this.$router.push({
                        path:'customerDocumentAudit'
                    })
                    this.$message({
                        message: '驳回成功',
                        type: 'success'
                    });
                })
            }else{
                this.$message({
                    message: '请输入驳回原因',
                    type: 'warning'
                });
            }
            
        },
        cancel(){
            this.$router.go(-1)
        }
    }
}
</script>
<style scoped lang="scss">

.collec {
    display:flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width:100%;
    .input_item {
        width: 33%;
    }
    .credit_input {
        width: 30%;
    }
    .poundage_input {
        flex: 1;
        display: flex;
        flex-wrap: nowrap;
    }
}
.model {
    border-bottom: none;
}
.titles{
        position: relative;
        font-size: 20px;
        padding-left:30px;
        color:#006EC7;;
    }
    .titles::after {
        content: "";
        display: block;
        width: 4px;
        height: 20px;
        background: #006EC7;
        position: absolute;
        left:15px;
        top: 50%;;
        margin-top:-10px;
        border-radius: 5px;
    }
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.formList{
    width: 100%;
}
.head_nav_search{
    width: 500px;
    display: inline-block;
}
.formList>.list{
    float: left;
    width: 33.3%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.list>span{
    width:30%;
    text-align: right;
    display: inline-block;
}
.list>div{
    width: 70%;
    display: inline-block;
}
.remarks{
    width: 33.5%;
    float: left;
    margin-top:20px;
}
.remarks>span{
    width: 30%;
    text-align: right;
    display: inline-block;
    float: left;
}
.remarks>div{
    display: inline-block;
    width: 70%;
    float: left;
}
.money-List{
    // width: 20%;
    width: 100%;
    height: 80px;
    // float: left;
    display: flex;
}
.money-List>span{
    width:140px;
    text-align: right;
    display: inline-block;
    height: 80px;
    line-height: 80px;
}
.money-List>div{
    width: calc(100% - 190px);
    display: inline-block;
}
.allMoney>h3{
    float: left;
}
.allMoney>div>span{
    width: 100px;
    text-align: right;
    display: inline-block;
}
.allMoney>div>div{
    display: inline-block;
}
.allMoney>div{
    float: left;
}
.btnList{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.dialogBtns{
    width: 100%;
    
}
</style>
