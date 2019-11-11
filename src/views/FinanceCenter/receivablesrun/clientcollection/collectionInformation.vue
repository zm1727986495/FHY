<template>
    <div>
      <div style="border-bottom:1px solid #cccccc;padding-bottom:30px">
                <div class="titles">录入收款信息</div>
                <div class="m-top20">
                    <div class="queryForm">
                        <el-form :model="ruleForm" ref="ruleForm" :rules="rules"  :label-width="formLabelWidth" :size="size" :disabled="$route.query.noOrder">
                            <div class="module model collec">
                                <el-form-item label="所属门店:" prop="storeName" style="margin-bottom:30px">             
                                    <el-input disabled v-model="ruleForm.storeName" placeholder="请输入所属门店" maxlength="50" class="ipts" clearable></el-input>
                                    <!-- <el-input  v-model="transferForm.transferStoreId" placeholder="请输入所属门店" @focus="openDia(0)" maxlength="50" style='display:none' class="ipts"></el-input>               -->
                                </el-form-item>

                                <storePop :title="randomTitle"
                                    :childDialog="childDialog"
                                    :storeId="defaultStoreId"
                                    @close-pop = 'closePop'/>
                                <el-form-item label="所属摊位:" style="margin-bottom:30px">
                                    <el-select disabled v-model="ruleForm.companyId" filterable placeholder="所属摊位" clearable>
                                        <el-option v-for="item in companyList" :label="item.boothNumber" :value="item.storeBoothId" :key="item.companyId"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="实收门店:" prop="storeName2" style="margin-bottom:30px">
                                    <el-input :disabled="disabled" v-model="ruleForm.storeName2" placeholder="当前所在门店" @focus="openDia(1)" maxlength="50" class="ipts"></el-input>
                                    <!-- <el-input  v-model="transferForm.transferStoreId" placeholder="当前所在门店" @focus="openDia(1)" maxlength="50" style='display:none' class="ipts"></el-input> -->
                                </el-form-item>
                                <el-form-item label="实收摊位:" style="margin-bottom:30px">
                                    <el-select :disabled="disabled" v-model="ruleForm.companyId2" filterable placeholder="实收摊位" clearable @change="changeBooth">
                                        <el-option v-for="item in companyList2" :label="item.boothNumber" :value="item.storeBoothId" :key="item.companyId"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item  label="收款类型:" prop="moneyType" style="margin-bottom:30px">
                                    <el-select disabled v-model="ruleForm.moneyType" filterable placeholder="收款类型" clearable>
                                        <el-option v-for="item in payType" :label="item.dictName" :value="item.id" :key="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="收款日期:" prop="gatheringTime" style="margin-bottom:30px">
                                    <el-date-picker
                                        v-model="ruleForm.gatheringTime"
                                        type="date"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        class="ipts"
                                        disabled
                                        :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="收款方式:" prop="moneyWay" style="margin-bottom:30px">
                                    <el-select :disabled="disabled" v-model="ruleForm.moneyWay" filterable placeholder="收款方式" clearable @change="changeMoneyWay">
                                        <el-option v-for="item in payMeth" :label="item.dictName" :value="item.id" :key="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="公司收款账号" prop="companyBankCardId" v-if="showBankCard" style="margin-bottom:30px">
                                    <el-select :disabled="disabled" v-model="ruleForm.companyBankCardId" filterable placeholder="公司收款账号" clearable>
                                        <el-option v-for="item in bankArr" :label="item.openingBankName+'||'+item.accountName+'||'+item.bankCardNumber" :value="item.bankAccountId" :key="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="内部收据号:" prop="Number" style="margin-bottom:30px" v-if="isShowNumber">
                                    <el-input :disabled="disabled" v-model="ruleForm.Number" placeholder="内部收据号" maxlength="50" class="ipts"></el-input>
                                </el-form-item>
                                <el-form-item label="建材城收据号:" prop="buildingNumber" v-if="showHomeBidding" style="margin-bottom:30px">
                                    <el-input :disabled="disabled" v-model="ruleForm.buildingNumber" placeholder="建材城收据号" maxlength="50" class="ipts"> </el-input>
                                </el-form-item>
                                <el-form-item label="家装公司:" prop="homeCompanyName" v-if="homeContractNumber" style="margin-bottom:30px">
                                    <el-input :disabled="true" v-model="ruleForm.homeCompanyName" placeholder="家装公司" maxlength="50" class="ipts"> </el-input>
                                </el-form-item>
                                <el-form-item label="家装合同号:" v-if="homeContractNumber" style="margin-bottom:30px">
                                    <el-input :disabled="true" v-model="ruleForm.homeContractNumber" placeholder="家装合同号" maxlength="50" class="ipts"> </el-input>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                </div>
                <div style="padding:0 15px;" class="unsortable">
                    <el-table
                    border
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    :data="childTable.multiSelection"
                    style="width: 100%;">
                        <el-table-column fixed width="180" show-overflow-tooltip prop="orderNumber" align="center" label="订单号">
                            <template slot-scope="prop">
                              <el-button type="text" @click="orderDetails(prop.row)"> {{prop.row.orderNumber}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderTypeName" align="center" label="订单类型" width="140">
                        </el-table-column>
                        <el-table-column prop="storeLeader" align="center" placeholder="请输入本次收款金额" label="本次收款金额" width="200px">
                            <template slot-scope="scope">
                                <el-input clearable size="small" @input.native="changeCode(scope.row,1)" v-model="scope.row.collectMoney" :disabled="disabled"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="boothNumber" align="center" label="商场代金券" width="500px">
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center;justify-content:space-between">
                                    <label>代金券号</label>
                                    <div style="display:inline-block;width:200px">
                                        <el-input clearable size="small" placeholder="请输入代金券号" v-model="scope.row.shopCashCoupon" :disabled="disabled"></el-input>
                                    </div>
                                    <label>金额</label>
                                    <div style="display:inline-block;width:100px">
                                        <el-input clearable size="small" @input.native="changeCode(scope.row,2)" v-model="scope.row.shopCashCouponAmount" :disabled="disabled"></el-input>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="companyName" align="center" label="自有代金券" width="500px">
                            <template slot-scope="scope" >
                                <div style="display:flex;align-items:center;justify-content:space-between">
                                    <label>代金券号</label>
                                    <div style="display:inline-block;width:200px">
                                        <el-input clearable size="small" placeholder="请输入代金券号" v-model="scope.row.ownCashCoupon" :disabled="disabled"></el-input>
                                    </div>
                                  <label>金额</label>
                                  <div style="display:inline-block;width:100px">
                                    <el-input clearable size="small" @input.native="changeCode(scope.row,3)" v-model="scope.row.ownCashCouponAmount" :disabled="disabled"></el-input>
                                  </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <el-form :inline="true" :label-width="formLabelWidth" :status-icon="true" :size="size" class="formCredit" ref="cardNum" :rules="cardNumRule" :model="ruleForm">
                <div style="margin-top:20px;padding-left:70px">
                    <el-form-item label="" class=" isCredit credit_input">
                        <div style="width: 160px;">
                            <el-checkbox v-model="ruleForm.isSignOrder" :disabled="disabled" @change="isSignOrder">是否刷卡手续费:</el-checkbox>
                        </div>
                    </el-form-item>
                    <el-form-item label="刷卡卡号:" prop="cardNum" class="credit_input" v-if="ruleForm.isSignOrder">
                        <el-input clearable size="medium" v-model="ruleForm.cardNum" placeholder="刷卡卡号" maxlength="50" class="ipts" :disabled="disabled"></el-input>
                    </el-form-item>
                    <!-- 点击上传操作按钮后出现的弹框 -->
                    <el-form-item label="刷卡手续费:" class="credit_input poundage_input"  v-if="ruleForm.isSignOrder">
                        <el-input clearable size="medium" @input.native="changeCode(undefined,5)" v-model="ruleForm.cardMoney" maxlength="50" class="ipts" style="width:100px" :disabled="disabled"></el-input> 元
                    </el-form-item>
                </div>
                <div style="display:inline-block;padding-left:15px">
                    <h3>本次收款金额合计：<span style="color:red">{{moneyAll}}元</span></h3>
                </div>
                <div style="display:inline-block;padding-left:100px">
                    <h3>代金券金额合计：<span style="color:red">{{totalVouchers}}元</span></h3>
                </div>
                <!-- <div style="padding-left:15px">
                    <h3>本次收款总金额合计：<span style="color:red">{{moneyAllChange}}元</span></h3>
                </div> -->
                <div class="m-top20">  
                    <el-form-item label="上传附件:" prop="file" v-if="!disabled">
                        <el-upload
                            action="string"
                            :limit="1"
                            :http-request="uploadSectionFile"
                            :on-remove="removeFile"
                            :file-list="commodityPics"
                            :disabled="disabled"
                            :on-exceed="onExceed"
                            style="display:inline-block">
                            <el-button class="button-96" size="small" :disabled="disabled">上传附件</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="下载附件:" prop="file" v-if="disabled">
                            <el-button class="button-96" size="small" @click="downLoad">下载附件</el-button>
                    </el-form-item>
                    <el-form-item label="备注:" style="width:100%" class="textarea">
                        <el-input size="medium" v-model="ruleForm.remark" type="textarea" placeholder="备注" style="width:1472px" :disabled="disabled"></el-input>
                    </el-form-item>
                </div>
                <div class="btnInfo" >
                    <el-form-item style="display: block; text-align: center" v-if="disabled">
                        <el-button @click="$router.push({path:'receivablesrun',query:{names:$route.query.names}})">关闭</el-button>
                    </el-form-item>
                    <el-form-item style="display: block; text-align: center" v-else-if="cancel">
                        <el-button type="primary" v-if="btnJurisdiction.cancel" :loading="cancelLoading" @click="cancels('ruleForm')">取消收款</el-button>
                        <el-button type="primary" v-if="btnJurisdiction.save" :loading="saveLoading" @click="saveCustomer('ruleForm')">保 存</el-button>
                        <el-button type="primary" v-if="btnJurisdiction.submit" :loading="submitLoading" @click="submitForm('ruleForm')">重新提交</el-button>
                        <el-button @click="$router.push({path:'receivablesrun',query:{names:$route.query.names}})">关闭</el-button>
                    </el-form-item>
                    <el-form-item style="display: block; text-align: center" v-else-if="!disabled">
                       <el-button type="primary" v-if="btnJurisdiction.save&&!$route.query.noOrder==1" :loading="saveLoading" @click="saveCustomer('ruleForm')">保 存</el-button>
                        <el-button type="primary" v-if="btnJurisdiction.submit" :loading="submitLoading" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="goBack">取消</el-button>
                    </el-form-item>
                </div>
            </el-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import spot from '@/assets/images/spot.png';
import storePop from './storePop';
import { getHomeCompany, listStoreBooth,listCompanyBankAccount, editOrderCollectMoney,editOrderCollectMoneyEs, addOrderCollectMoney, listBaseDict, getEchoOrderCollectMoney, commitOrderCollectMoney, getOrderCollectMoney,cancelOrderCollectMoney } from '@/api/receivablesrun/clientcollection/index';
import {
  listStorePage,
} from '@/api/price/price';
import { getUpToken } from '@/utils/auth';
import { getFileType } from 'src/utils/pubilcFn'
import { addAccessory, removeAccessoryImgById} from '@/api/pulicJava';
import { put } from '@/utils/pubilcFn';
import { getUUID } from "@/api/pulicJava";
export default {
    props:["childTable","storeStatus"],
    created() {
        this.init()
        this.btnJurisdiction.save=JSON.parse(this.$loca.getItem("element"))['proedit:btn_save'];
        this.btnJurisdiction.submit=JSON.parse(this.$loca.getItem("element"))['receivablesrun:btn_submit'];
        this.btnJurisdiction.cancel=JSON.parse(this.$loca.getItem("element"))['receivablesrun:btn_cancel'];
    },
    components:{
        storePop
    },
    computed:{
        ...mapGetters(['name','id',"activeStoreId"]),
        moneyAll(){
            let moneyAll=0;
            this.childTable.multiSelection&&this.childTable.multiSelection.map((item,idx)=>{
                if(item.collectMoney!=undefined){
                    moneyAll+=Number(item.collectMoney)
                }
            })
            return moneyAll
        },
        totalVouchers(){
            let totalVouchers=0;
            this.childTable.multiSelection&&this.childTable.multiSelection.map((item,idx)=>{
                if(item.shopCashCouponAmount==undefined){
                    this.$set(this.childTable.multiSelection[idx],"shopCashCouponAmount",0);
                }
                if(item.ownCashCouponAmount == undefined){
                    this.$set(this.childTable.multiSelection[idx],"ownCashCouponAmount",0);
                }
                totalVouchers=totalVouchers+Number(item.shopCashCouponAmount)+Number(item.ownCashCouponAmount)
            })
            return totalVouchers
        },
        ...mapGetters([
            'orderSelectList',
        ])
    },
    data() {
        return {
            saveLoading:false,
            submitLoading:false,
            cancelLoading:false,
            btnJurisdiction:{
                save:false,
                submit:false,
                cancel:false,
            },
            formLabelWidth: '140px',
            size: 'medium',
            shareImg: {
                key: '',
                token: getUpToken()
            },
            defaultStoreId:0,
            popTan: false,
            popTan2:false,
            showBankCard:false,
            homeContractNumber:false,
            isShowNumber:false,
            cancel:this.$route.query.cancel,
            disabled:Boolean(this.$route.query.disabled),
            navList: [],
            value: "",
            isIndex:0,
            spot,
            tablists:["待收款","已提交","未交票","已收款","已退回"],
            pickerOptions: {
                disabledDate(time) {
                    return  Date.now() < time.getTime();
                },
            },
            ruleForm: {
                storeName: '',
                companyId: null,
                companyId2: null,
                storeName2:'',
                Number:null,
                buildingNumber:null,
                cardNum:'',
                cardMoney:'',
                file:'',
                moneyType:'',
                moneyWay:'',
                isSignOrder: false,
                remark: '',
                companyBankCardId:null,
                homeContractNumber:null,
                gatheringTime:'',
                homeCompanyName:null
            },
            rules: {
                storeName: [
                    { required: true, message: '请选择所属门店' }
                ],
                storeName2: [
                    { required: true, message: '请选择当前所在门店' }
                ],
                moneyType: [
                    { required: true, message: '请选择收款类型', }
                ],
                Number: [
                    { required: true, message: '请输入内部收据号' }
                ],
                buildingNumber: [
                    { required: true, message: '请输入建材城收据号' }
                ],
                moneyWay: [
                    { required: true, message: '请选择付款方式', }
                ],
                companyBankCardId:[
                    { required: true, message: '请选择银行信息',}
                ],
                gatheringTime:[{
                    required: true, message: '请选择收款日期',
                }]
            },
            cardNumRule:{
                cardNum:[
                    {
                        required: false, message: '请输入收款账号',
                    }
                ]
            },
            companyList: [],
            companyList2: [],
            payType : [],
            payMeth: [],
            count: [],
            transferForm:{
                storeCustomerIds:[],				    //客户id
                storeCustomerTransferType:2,		//移交类型,2共享
                transferStoreId:"",				      //移交负责门店
                transferStoreAtId:"",           //移交负责人
                isShareDemand:"",                //是否共享客户需求
                isShareAddress:"",               //是否共享客户地址
                isShareWx:"",                    //是否共享客户微信
                isSharePhone:"",                 //是否共享客户电话
                submitStatus:""                  //是否提交        
            },
            // 弹出框的名字
            randomTitle: "",
            dialogFormVisible: false,
            storeList: [],
            id1:0,
            id2:1,
            boothId1:undefined,
            boothId2:undefined,
            southName:'',
            childDialog:{
                isShow:false
            },
            showHomeBidding:false,
            fileValue:{},
            status:0,
            commodityPics:[],
            accessoryId:null,
            bankArr:[],
            echoStatus:null,
            echoStroeStatus:null
        }
    },
    watch: {
        boothId1(news,old){
            listStoreBooth({storeId:news}).then(res=>{
                this.companyList=res.data;
                if(res.data.length){
                    this.ruleForm.companyId=res.data[0].storeBoothId;
                }
            })
        },
        boothId2(news,old){
            listStoreBooth({storeId:news}).then(res=>{
                this.companyList2=res.data;
                if(res.data.length){
                    this.ruleForm.companyId2=res.data[0].storeBoothId;
                }
            })
        },
        // activeStoreId(val){
        //     if(val){
        //         this.boothId1=val.storeId;
        //         this.ruleForm.storeName=val.storeName;
        //     }
        // },
        childTable:{
            handler(newValue, oldValue) {
                let ids=newValue.multiSelection.every((item,idx)=>{
                    return item.settlementStatus!=1;
                })
                if(newValue.multiSelection.length){
                    this.ruleForm.moneyType=ids?216:215;
                }else{
                    this.ruleForm.moneyType=null;
                }
                let flag1=newValue.multiSelection.every((item,idx)=>{
                    return item.collectMoney
                })
                let flag2=newValue.multiSelection.every((item,idx)=>{
                    return item.shopCashCoupon
                })
                let flag3=newValue.multiSelection.every((item,idx)=>{
                    return item.shopCashCouponAmount
                })
                let flag4=newValue.multiSelection.every((item,idx)=>{
                    return item.ownCashCoupon
                })
                let flag5=newValue.multiSelection.every((item,idx)=>{
                    return item.ownCashCouponAmount
                })
                if(!(flag1||flag2||flag3||flag4||flag5)){
                    if(this.ruleForm.moneyWay==225){
                        this.ruleForm.moneyWay=null;
                        this.homeContractNumber=false;
                    }
                }
                if(newValue.multiSelection.length){
                    let storeids = newValue.multiSelection[0];
                    if(!(flag1||flag2||flag3||flag4||flag5)){
                        if(storeids.collectStoreId){
                            this.defaultStoreId=storeids.actualStoreId;
                            this.boothId2=storeids.actualStoreId;
                            this.boothId1=storeids.collectStoreId;
                            this.ruleForm.storeName=storeids.collectStoreName;
                            this.ruleForm.storeName2=storeids.actualStoreName;
                        }else{
                            let storeids = newValue.multiSelection[0];
                            this.defaultStoreId=storeids.storeId;
                            this.boothId2=storeids.storeId;
                            this.boothId1=storeids.storeId;
                            this.ruleForm.storeName=storeids.storeName;
                            this.ruleForm.storeName2=storeids.storeName;
                        }
                    }
                }else{
                    let storeids = null;
                    this.defaultStoreId=null;
                    this.boothId2=null;
                    this.boothId1=null;
                    this.ruleForm.storeName=null;
                    this.ruleForm.storeName2=null;
                }
            },
    　　　　 deep: true
        },
    },
    methods: {
        changeBooth(val){
            if(val==""){
                this.ruleForm.companyId2=null;
            }
        },
        isSignOrder(val){
            if(!val){
                if(this.ruleForm.moneyWay==220){
                    this.ruleForm.moneyWay=null;
                    this.cardNumRule.cardNum[0].required=false;
                }
            }
        },
        downLoad(){
            if(this.commodityPics.length){
                window.location.href=this.commodityPics[0].fileUrl;
            }
        },
        init(){
            if(this.$route.query.isEdit){
                this.echoStatus=1;
                this.echoStroeStatus=1;
                getOrderCollectMoney(
                    {
                        collectMoneyId:this.$route.query.id
                    }
                ).then(res=>{
                    this.$emit("goBackQuestion",res.data)
                    let data=res.data;
                    data.relOrderCollectMoneyDTOS.map((item,idx)=>{
                        item.actualStoreId=data.actualStoreId;
                        item.actualStoreName=data.actualStoreName;
                        item.collectStoreId=data.collectStoreId;
                        item.collectStoreName=data.collectStoreName;
                    })
                    this.childTable.multiSelection=data.relOrderCollectMoneyDTOS;
                    this.$emit("Tables",data.relOrderCollectMoneyDTOS)
                    // if(data.collectWay==220){
                    //     this.rules.cardNum[0].required=true;
                    // }else{
                    //     this.rules.cardNum[0].required=false;
                    // }
                    if(data.collectWay==223){
                        this.showBankCard=true;
                        this.showHomeBidding=false;
                        this.homeContractNumber=false;
                        this.isShowNumber=true;
                    }else if(data.collectWay==224){
                        this.showHomeBidding=true;
                        this.showBankCard=false;
                        this.homeContractNumber=false;
                        this.isShowNumber=false;
                    }else if(data.collectWay==225){
                        this.showHomeBidding=false;
                        this.showBankCard=false;
                        this.homeContractNumber=true;
                        this.isShowNumber=false;
                    }else if(data.collectWay==1277||data.collectWay==1278){
                        this.showBankCard=false;
                        this.showHomeBidding=false;
                        this.homeContractNumber=false;
                        this.isShowNumber=false;
                    }else{
                        this.showBankCard=false;
                        this.showHomeBidding=false;
                        this.homeContractNumber=false;
                        this.isShowNumber=true;
                    }
                    if(data.collectWay==220){
                        this.cardNumRule.cardNum[0].required=true;
                    }else{
                        this.cardNumRule.cardNum[0].required=false;
                    }
                    this.ruleForm.storeName=data.collectStoreName;
                    this.ruleForm.storeName2=data.actualStoreName;
                    listStoreBooth({storeId:data.actualStoreId}).then(res=>{
                        this.companyList2=res.data;
                        this.ruleForm.companyId2=Number(data.actualStoreBoothId);
                    })
                    listStoreBooth({storeId:data.collectStoreId}).then(res=>{
                        this.companyList=res.data;
                        this.ruleForm.companyId=Number(data.collectStoreBoothId);
                    })
                    this.ruleForm.moneyType=data.collectType;
                    setTimeout(()=>{
                        this.ruleForm.moneyWay=data.collectWay;
                    },0)
                    this.ruleForm.Number=data.receiptNumber;
                    this.ruleForm.buildingNumber=data.buildingReceiptNumber;
                    this.ruleForm.isSignOrder=data.isPoundage==0?false:true;
                    this.ruleForm.cardNum=data.bankCardId;
                    this.ruleForm.cardMoney=data.costMoney;
                    this.ruleForm.remark=data.Remark;
                    this.ruleForm.remark=data.remark;
                    this.ruleForm.gatheringTime=data.gatheringTime;
                    this.boothId1=data.collectStoreId;
                    this.ruleForm.companyBankCardId = data.companyBankCardId;
                    this.ruleForm.homeCompanyName=data.homeCompanyName;
                    this.boothId2=data.actualStoreId;
                    this.ruleForm.homeContractNumber=data.homeContractNumber;
                    data.commodityPics.map((item,idx)=>{
                        item.name=item.sourceName
                    })
                    if(data.commodityPics.length){
                        this.accessoryId=data.commodityPics[0].accessoryId;
                    }
                    this.commodityPics=data.commodityPics;
                    
                })
            }else if(this.$route.query.editMoney){
                this.echoStatus=1;
                getEchoOrderCollectMoney(
                    {
                        collectMoneyId:this.$route.query.id,
                        bmcSettlementId:this.$route.query.bmcSettlementId,
                        settlementComparisonId:this.$route.query.settlementComparisonId
                    }
                ).then(res=>{
                    this.$emit("goBackQuestion",res.data)
                    let data=res.data;
                    if(data.collectWay==223){
                        this.showBankCard=true;
                        this.showHomeBidding=false;
                        this.homeContractNumber=false;
                        this.isShowNumber=true;
                    }else if(data.collectWay==224){
                        this.showHomeBidding=true;
                        this.showBankCard=false;
                        this.homeContractNumber=false;
                        this.isShowNumber=false;
                    }else if(data.collectWay==225){
                        this.showHomeBidding=false;
                        this.showBankCard=false;
                        this.homeContractNumber=true;
                        this.isShowNumber=false;
                    }else if(data.collectWay==1277||data.collectWay==1278){
                        this.showBankCard=false;
                        this.showHomeBidding=false;
                        this.homeContractNumber=false;
                        this.isShowNumber=false;
                    }else{
                        this.showBankCard=false;
                        this.showHomeBidding=false;
                        this.homeContractNumber=false;
                        this.isShowNumber=true;
                    }
                    if(data.collectWay==220){
                        this.cardNumRule.cardNum[0].required=true;
                    }else{
                        this.cardNumRule.cardNum[0].required=false;
                    }
                    // if(data.collectWay==220){
                    //     this.rules.cardNum[0].required=true;
                    // }else{
                    //     this.rules.cardNum[0].required=false;
                    // }
                    this.ruleForm.storeName=data.collectStoreName;
                    this.ruleForm.storeName2=data.actualStoreName;
                    listStoreBooth({storeId:data.collectStoreId}).then(res=>{
                        this.companyList=res.data;
                        this.ruleForm.companyId=Number(data.collectStoreBoothId);
                    })
                    listStoreBooth({storeId:data.actualStoreId}).then(res=>{
                        this.companyList2=res.data;
                        this.ruleForm.companyId2=Number(data.actualStoreBoothId);
                    })
                    this.ruleForm.moneyType=data.collectType;
                    this.ruleForm.moneyWay=data.collectWay;
                    this.ruleForm.Number=data.receiptNumber;
                    this.ruleForm.buildingNumber=data.buildingReceiptNumber;
                    this.ruleForm.isSignOrder=data.isPoundage==0?false:true;
                    this.ruleForm.cardNum=data.bankCardId;
                    this.ruleForm.cardMoney=data.costMoney;
                    this.ruleForm.remark=data.Remark;
                    this.ruleForm.gatheringTime=data.gatheringTime;
                    this.boothId1=data.collectStoreId;
                    this.boothId2=data.actualStoreId;
                    this.ruleForm.homeContractNumber=data.homeContractNumber;
                    this.ruleForm.companyBankCardId = data.companyBankCardId;
                    this.ruleForm.remark=data.remark;
                    data.commodityPics.map((item,idx)=>{
                        item.name=item.sourceName
                    })
                    if(data.commodityPics.length){
                        this.accessoryId=data.commodityPics[0].accessoryId;
                    }
                    this.commodityPics=data.commodityPics
                    this.$emit("Tables",data.relOrderCollectMoneyDTOS)
                    this.childTable.multiSelection=data.relOrderCollectMoneyDTOS;
                })
            }else{
                // let storeids = JSON.parse(this.$loca.getItem('activeStoreId'))
                // this.defaultStoreId=storeids.storeId;
                // this.boothId2=storeids.storeId;
                // this.boothId1=storeids.storeId;
                // this.ruleForm.storeName=storeids.storeName;
                // this.ruleForm.storeName2=storeids.storeName;
                var data = new Date();
                var y = data.getFullYear();
                var m = data.getMonth() + 1;
                var d = data.getDate();
                this.ruleForm.gatheringTime=y+'-'+m+'-'+d;
            }
            listCompanyBankAccount().then(res=>{
                this.bankArr=res.data;
            })
            listBaseDict(
                {
                    dataType:"PAYMENT_WAY"
                }
            ).then(res=>{
                this.payMeth=res.data
            })
            listBaseDict(
                {
                    dataType:"PAYMENT_TYPE"
                }
            ).then(res=>{
                this.payType=res.data;
            })
        },
        changeCode(val,index){
            this.$nextTick(() => {
                switch(index){
                    case 1:
                        if(val.collectMoney !== null && val.collectMoney != ''){
                          let reg = /^\d+(\.\d{0,2})?$/;
                          if (!reg.test(val.collectMoney)) {
                            val.collectMoney = '';
                          }
                        }
                        break;
                    case 2:
                        if(val.shopCashCouponAmount !== null && val.shopCashCouponAmount != ''){
                          let reg = /^\d+(\.\d{0,2})?$/;
                          if (!reg.test(val.shopCashCouponAmount)) {
                            val.shopCashCouponAmount = '';
                          }
                        }
                        break;
                    case 3:
                        if(val.ownCashCouponAmount !== null && val.ownCashCouponAmount != ''){
                          let reg = /^\d+(\.\d{0,2})?$/;
                          if (!reg.test(val.ownCashCouponAmount)) {
                            val.ownCashCouponAmount = '';
                          }
                        }
                        break;
                    case 5:
                        if(this.ruleForm.cardMoney !== null && this.ruleForm.cardMoney != ''){
                          let reg = /^\d+(\.\d{0,2})?$/;
                          if (!reg.test(this.ruleForm.cardMoney)) {
                            this.ruleForm.cardMoney = '';
                          }
                        }
                    break;
                }
            })
        },
        removeFile(val,fileList){
            if(this.$route.query.id){
                removeAccessoryImgById({
                    accessoryId:this.accessoryId
                }).then(res=>{
                    this.$message({
                        message: '移除成功',
                        type: 'success'
                    })
                })
            }else{
                this.fileValue={};
                this.status=1;
                this.commodityPics=[];
            }
            
        },
        onExceed(val){
            this.$message({
                message: '请删除之前的附件',
                type: 'warning'
            })
        },
        uploadSectionFile(val){
            if(this.$route.query.id){
                put(val).then(resion=>{
                    addAccessory(
                        {
                            dataSourceId:this.$route.query.id,
                            dataSourceEnum:"CollectMoneyFile",
                            sourceName:resion.name,
                            fileUrl:resion.url,
                        }
                    ).then(res=>{
                        this.accessoryId=res.data;
                        this.$message({
                            message: '上传成功',
                            type: 'success'
                        })
                    })
                })
            }else{
                this.commodityPics.push(val.file)
                this.fileValue=val;
                this.status=1;
                console.log(this.commodityPics)
            }
        },
        orderDetails(val){
            this.$router.push({
                path:'/ordermm/details',
                query:{
                    orderId:val.orderId
                }
            })
        },
        changeMoneyWay(val){
            this.$emit("moneyWayId",val);
            this.ruleForm.Number = null;
            this.ruleForm.buildingNumber = null;
            this.ruleForm.homeContractNumber = null;
            this.ruleForm.companyBankCardId = null;
            if(val==223){
                this.showBankCard=true;
                this.showHomeBidding=false;
                this.homeContractNumber=false;
                this.isShowNumber=true;
            }else if(val==224){
                this.showHomeBidding=true;
                this.showBankCard=false;
                this.homeContractNumber=false;
                this.isShowNumber=false;
            }else if(val==225){
                this.showHomeBidding=false;
                this.showBankCard=false;
                this.isShowNumber=false;
                if(this.childTable.multiSelection.length>1){
                    this.ruleForm.moneyWay=null;
                    this.$message({
                        message: '只可选择一条',
                        type: 'warning'
                    })
                }else if(this.childTable.multiSelection.length==1){
                    getHomeCompany({
                        orderId:this.childTable.multiSelection[0].orderId
                    }).then(res=>{
                        if(res.data){
                            this.homeContractNumber=true;
                            this.ruleForm.homeCompanyName=res.data.companyName;
                            this.ruleForm.homeContractNumber=res.data.homeContractNumber;
                        }else{
                            this.ruleForm.moneyWay=null;
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
                this.homeContractNumber=false;
                this.isShowNumber=false;
            }else{
                this.showBankCard=false;
                this.showHomeBidding=false;
                this.homeContractNumber=false;
                this.isShowNumber=true;
            }
            if(val==220){
                this.ruleForm.isSignOrder=true;
                this.cardNumRule.cardNum[0].required=true;
                // this.rules.cardNum[0].required=true;
            }else{
                this.ruleForm.isSignOrder=false;
                this.cardNumRule.cardNum[0].required=false;
                this.ruleForm.cardNum=null;
                this.ruleForm.cardMoney=null;
                // this.rules.cardNum[0].required=false;
            }
        },
        cancels(){
            this.cancelLoading=true;
            cancelOrderCollectMoney(
                {
                    collectMoneyIdss:this.$route.query.id
                }
            ).then(res=>{
                this.cancelLoading=false;
                this.$router.push({path:'receivablesrun',params:{names:this.$route.query.names}})
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
            })
        },
        saveCustomer(formName){
            this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    this.$refs.cardNum.validate((valid2)=>{
                        if(valid2){
                            
                            if(this.childTable.multiSelection.length){
                                let arr=[]
                                this.childTable.multiSelection.map((item,idx)=>{
                                    let obj={
                                        orderId:item.orderId,
                                        collectMoney:Number(item.collectMoney),
                                        shopCashCoupon:item.shopCashCoupon,
                                        shopCashCouponAmount:Number(item.shopCashCouponAmount),
                                        ownCashCoupon:item.ownCashCoupon,
                                        ownCashCouponAmount:Number(item.ownCashCouponAmount),
                                    }
                                    arr.push(obj)
                                })
                                let money = arr.every((item,idx)=>{
                                    return item.collectMoney>0
                                })
                                if(money){
                                    this.saveLoading=true;
                                    if(this.$route.query.editMoney){
                                        editOrderCollectMoney(
                                            {
                                                status:0,
                                                collectStoreId:this.boothId1,
                                                collectStoreBoothId:this.ruleForm.companyId,
                                                actualStoreId:this.boothId2,
                                                actualStoreBoothId:this.ruleForm.companyId2,
                                                collectType:this.ruleForm.moneyType,
                                                collectWay:this.ruleForm.moneyWay,
                                                receiptNumber:this.ruleForm.Number,
                                                buildingReceiptNumber:this.ruleForm.buildingNumber,
                                                amount:this.moneyAll,
                                                // paymentAmount:this.moneyAllChange,
                                                isPoundage:this.ruleForm.isSignOrder?1:0,
                                                bankCardId:this.ruleForm.cardNum,
                                                costMoney:Number(this.ruleForm.cardMoney),
                                                remark:this.ruleForm.remark,
                                                relOrderCollectMoneyDTOS:arr,
                                                companyBankCardId:this.ruleForm.companyBankCardId,
                                                customerId:this.childTable.multiSelection[0].customerId,
                                                settlementComparisonId:this.$route.query.settlementComparisonId,
                                                bmcSettlementId:this.$route.query.bmcSettlementId,
                                                collectMoneyId:this.$route.query.id,
                                                homeContractNumber:this.ruleForm.homeContractNumber,
                                                gatheringTime:this.ruleForm.gatheringTime
                                            }
                                        ).then(res=>{
                                            this.saveLoading=false;
                                            if(res.status==500){
                                                this.$message({
                                                    message: res.message,
                                                    type: 'warning'
                                                })
                                            }else{
                                                this.$message({
                                                    message: '编辑成功',
                                                    type: 'success'
                                                })
                                                this.$router.push({
                                                    path:'receivablesrun',
                                                    query:{
                                                        names:this.$route.query.names
                                                    }
                                                })
                                            }
                                        })
                                    }else if(this.$route.query.isEdit){
                                        editOrderCollectMoneyEs({
                                            status:0,
                                            collectStoreId:this.boothId1,
                                            collectStoreBoothId:this.ruleForm.companyId,
                                            actualStoreId:this.boothId2,
                                            actualStoreBoothId:this.ruleForm.companyId2,
                                            collectType:this.ruleForm.moneyType,
                                            collectWay:this.ruleForm.moneyWay,
                                            receiptNumber:this.ruleForm.Number,
                                            buildingReceiptNumber:this.ruleForm.buildingNumber,
                                            amount:this.moneyAll,
                                            // paymentAmount:this.moneyAllChange,
                                            isPoundage:this.ruleForm.isSignOrder?1:0,
                                            bankCardId:this.ruleForm.cardNum,
                                            costMoney:Number(this.ruleForm.cardMoney),
                                            remark:this.ruleForm.remark,
                                            relOrderCollectMoneyDTOS:arr,
                                            companyBankCardId:this.ruleForm.companyBankCardId,
                                            customerId:this.childTable.multiSelection[0].customerId,
                                            collectMoneyId:this.$route.query.id,
                                            homeContractNumber:this.ruleForm.homeContractNumber,
                                            gatheringTime:this.ruleForm.gatheringTime,
                                            homeCompanyName:this.ruleForm.homeCompanyName,
                                        }).then(res=>{
                                            this.saveLoading=false;
                                            if(res.status==500){
                                                this.$message({
                                                    message: res.message,
                                                    type: 'warning'
                                                })
                                            }else{
                                                this.$message({
                                                    message: '编辑成功',
                                                    type: 'success'
                                                })
                                                this.$router.go(-1)
                                            }
                                        })
                                    }else{
                                        getUUID({
                                            serialNumber:'MC'
                                        }).then(resions=>{
                                            if(this.status==1){
                                                put(this.fileValue).then(resion=>{
                                                    this.commodityPics[0].fileUrl=resion.url;
                                                    this.commodityPics[0].sourceName=resion.name;
                                                    addOrderCollectMoney(
                                                        {
                                                            status:0,
                                                            collectStoreId:this.boothId1,
                                                            collectStoreBoothId:this.ruleForm.companyId,
                                                            actualStoreId:this.boothId2,
                                                            actualStoreBoothId:this.ruleForm.companyId2,
                                                            collectType:this.ruleForm.moneyType,
                                                            collectWay:this.ruleForm.moneyWay,
                                                            receiptNumber:this.ruleForm.Number,
                                                            buildingReceiptNumber:this.ruleForm.buildingNumber,
                                                            amount:this.moneyAll,
                                                            // paymentAmount:this.moneyAllChange,
                                                            isPoundage:this.ruleForm.isSignOrder?1:0,
                                                            bankCardId:this.ruleForm.cardNum,
                                                            costMoney:Number(this.ruleForm.cardMoney),
                                                            remark:this.ruleForm.remark,
                                                            relOrderCollectMoneyDTOS:arr,
                                                            companyBankCardId:this.ruleForm.companyBankCardId,
                                                            customerId:this.childTable.multiSelection[0].customerId,
                                                            commodityPics:this.commodityPics,
                                                            homeContractNumber:this.ruleForm.homeContractNumber,
                                                            homeCompanyName:this.ruleForm.homeCompanyName,
                                                            gatheringTime:this.ruleForm.gatheringTime,
                                                            collectMoneyName:resions.data
                                                        }
                                                    ).then(res=>{
                                                        this.saveLoading=false;
                                                        if(res.status==500){
                                                            this.$message({
                                                                message: res.message,
                                                                type: 'warning'
                                                            })
                                                        }else{
                                                            this.$message({
                                                                message: '保存成功',
                                                                type: 'success'
                                                            })
                                                            setTimeout(()=>{
                                                                this.$router.go(-1)
                                                            })
                                                        }
                                                        
                                                    })
                                                })
                                            }else if(this.status==0){
                                                addOrderCollectMoney(
                                                    {
                                                        status:0,
                                                        collectStoreId:this.boothId1,
                                                        collectStoreBoothId:this.ruleForm.companyId,
                                                        actualStoreId:this.boothId2,
                                                        actualStoreBoothId:this.ruleForm.companyId2,
                                                        collectType:this.ruleForm.moneyType,
                                                        collectWay:this.ruleForm.moneyWay,
                                                        receiptNumber:this.ruleForm.Number,
                                                        buildingReceiptNumber:this.ruleForm.buildingNumber,
                                                        amount:this.moneyAll,
                                                        // paymentAmount:this.moneyAllChange,
                                                        isPoundage:this.ruleForm.isSignOrder?1:0,
                                                        bankCardId:this.ruleForm.cardNum,
                                                        costMoney:Number(this.ruleForm.cardMoney),
                                                        remark:this.ruleForm.remark,
                                                        relOrderCollectMoneyDTOS:arr,
                                                        companyBankCardId:this.ruleForm.companyBankCardId,
                                                        customerId:this.childTable.multiSelection[0].customerId,
                                                        commodityPics:this.commodityPics,
                                                        homeContractNumber:this.ruleForm.homeContractNumber,
                                                        gatheringTime:this.ruleForm.gatheringTime,
                                                        collectMoneyName:resions.data,
                                                        homeCompanyName:this.ruleForm.homeCompanyName,
                                                    }
                                                ).then(res=>{
                                                    this.saveLoading=false;
                                                    if(res.status==500){
                                                        this.$message({
                                                            message: res.message,
                                                            type: 'warning'
                                                        })
                                                    }else{
                                                        this.$message({
                                                            message: '保存成功',
                                                            type: 'success'
                                                        })
                                                        setTimeout(()=>{
                                                            this.$router.go(-1)
                                                        })
                                                    }
                                                    
                                                })
                                            }
                                        })
                                        
                                    }
                                }else{
                                    this.$message({
                                        message: '请填写完本次收款金额',
                                        type: 'warning'
                                    })
                                }
                            }else{
                                this.$message({
                                    message: '请选择未结订单',
                                    type: 'warning'
                                })
                            }
                        }else{
                            return false
                        }
                    })
                    
                    
                } else {
                    return false;
                }
            });
            
        },
        // 提交表单
        submitForm(formName) {
            this.$refs.ruleForm.validate((valid) => {
                if(valid){
                    this.$refs.cardNum.validate((valid2)=>{
                        if(valid2){
                            if(this.childTable.multiSelection.length){
                                let arr=[];
                                this.childTable.multiSelection.map((item,idx)=>{
                                    let obj={
                                        orderId:item.orderId,
                                        collectMoney:Number(item.collectMoney),
                                        shopCashCoupon:item.shopCashCoupon,
                                        shopCashCouponAmount:Number(item.shopCashCouponAmount),
                                        ownCashCoupon:item.ownCashCoupon,
                                        ownCashCouponAmount:Number(item.ownCashCouponAmount),
                                    }
                                    arr.push(obj)
                                })
                                let money = arr.every((item,idx)=>{
                                    return item.collectMoney>0
                                })
                                if(money){
                                    this.submitLoading=true;
                                    if(this.$route.query.editMoney){
                                            editOrderCollectMoney(
                                            {
                                                status:1,
                                                collectStoreId:this.boothId1,
                                                collectStoreBoothId:this.ruleForm.companyId,
                                                actualStoreId:this.boothId2,
                                                actualStoreBoothId:this.ruleForm.companyId2,
                                                collectType:this.ruleForm.moneyType,
                                                collectWay:this.ruleForm.moneyWay,
                                                receiptNumber:this.ruleForm.Number,
                                                buildingReceiptNumber:this.ruleForm.buildingNumber,
                                                amount:this.moneyAll,
                                                // paymentAmount:this.moneyAllChange,
                                                isPoundage:this.ruleForm.isSignOrder?1:0,
                                                bankCardId:this.ruleForm.cardNum,
                                                costMoney:Number(this.ruleForm.cardMoney),
                                                remark:this.ruleForm.remark,
                                                relOrderCollectMoneyDTOS:arr,
                                                companyBankCardId:this.ruleForm.companyBankCardId,
                                                customerId:this.childTable.multiSelection[0].customerId,
                                                settlementComparisonId:this.$route.query.settlementComparisonId,
                                                bmcSettlementId:this.$route.query.bmcSettlementId,
                                                collectMoneyId:this.$route.query.id,
                                                homeContractNumber:this.ruleForm.homeContractNumber,
                                                gatheringTime:this.ruleForm.gatheringTime,
                                                homeCompanyName:this.ruleForm.homeCompanyName,
                                            }
                                        ).then(res=>{
                                            this.submitLoading=false;
                                            if(res.status==500){
                                                this.$message({
                                                    message: res.message,
                                                    type: 'warning'
                                                })
                                            }else{
                                                this.$message({
                                                    message: '编辑成功',
                                                    type: 'success'
                                                })
                                                setTimeout(()=>{
                                                    this.$router.go(-1)
                                                })
                                            }
                                            
                                        })
                                    }else if(this.$route.query.isEdit){
                                        editOrderCollectMoneyEs({
                                                status:1,
                                                collectStoreId:this.boothId1,
                                                collectStoreBoothId:this.ruleForm.companyId,
                                                actualStoreId:this.boothId2,
                                                actualStoreBoothId:this.ruleForm.companyId2,
                                                collectType:this.ruleForm.moneyType,
                                                collectWay:this.ruleForm.moneyWay,
                                                receiptNumber:this.ruleForm.Number,
                                                buildingReceiptNumber:this.ruleForm.buildingNumber,
                                                amount:this.moneyAll,
                                                // paymentAmount:this.moneyAllChange,
                                                isPoundage:this.ruleForm.isSignOrder?1:0,
                                                bankCardId:this.ruleForm.cardNum,
                                                costMoney:Number(this.ruleForm.cardMoney),
                                                remark:this.ruleForm.remark,
                                                relOrderCollectMoneyDTOS:arr,
                                                companyBankCardId:this.ruleForm.companyBankCardId,
                                                customerId:this.childTable.multiSelection[0].customerId,
                                                collectMoneyId:this.$route.query.id,
                                                homeContractNumber:this.ruleForm.homeContractNumber,
                                                gatheringTime:this.ruleForm.gatheringTime,
                                                homeCompanyName:this.ruleForm.homeCompanyName,
                                            }).then(res=>{
                                                this.submitLoading=false;
                                                if(res.status==500){
                                                    this.$message({
                                                        message: res.message,
                                                        type: 'warning'
                                                    })
                                                }else{
                                                    this.$message({
                                                        message: '编辑成功',
                                                        type: 'success'
                                                    })
                                                    setTimeout(()=>{
                                                        this.$router.go(-1)
                                                    })
                                                }
                                                
                                            })
                                    }else{
                                        getUUID({
                                            serialNumber:'MC'
                                        }).then(resionUid=>{
                                            if(this.status==1){
                                                put(this.fileValue).then(resion=>{
                                                    this.commodityPics[0].fileUrl=resion.url;
                                                    this.commodityPics[0].sourceName=resion.name;
                                                    addOrderCollectMoney(
                                                        {
                                                            status:1,
                                                            collectStoreId:this.boothId1,
                                                            collectStoreBoothId:this.ruleForm.companyId,
                                                            actualStoreId:this.boothId2,
                                                            actualStoreBoothId:this.ruleForm.companyId2,
                                                            collectType:this.ruleForm.moneyType,
                                                            collectWay:this.ruleForm.moneyWay,
                                                            receiptNumber:this.ruleForm.Number,
                                                            buildingReceiptNumber:this.ruleForm.buildingNumber,
                                                            amount:this.moneyAll,
                                                            // paymentAmount:this.moneyAllChange,
                                                            isPoundage:this.ruleForm.isSignOrder?1:0,
                                                            bankCardId:this.ruleForm.cardNum,
                                                            costMoney:Number(this.ruleForm.cardMoney),
                                                            remark:this.ruleForm.remark,
                                                            relOrderCollectMoneyDTOS:arr,
                                                            companyBankCardId:this.ruleForm.companyBankCardId,
                                                            customerId:this.childTable.multiSelection[0].customerId,
                                                            commodityPics:this.commodityPics,
                                                            homeContractNumber:this.ruleForm.homeContractNumber,
                                                            gatheringTime:this.ruleForm.gatheringTime,
                                                            collectMoneyName:resionUid.data,
                                                            homeCompanyName:this.ruleForm.homeCompanyName,
                                                        }
                                                    ).then(res=>{
                                                        this.submitLoading=false;
                                                        if(res.status==500){
                                                            this.$message({
                                                                message: res.message,
                                                                type: 'warning'
                                                            })
                                                        }else{
                                                            this.$message({
                                                                message: '保存成功',
                                                                type: 'success'
                                                            })
                                                            setTimeout(()=>{
                                                                this.$router.go(-1)
                                                            })
                                                        }
                                                        
                                                    })
                                                })
                                            }else if(this.status==0){
                                                addOrderCollectMoney(
                                                    {
                                                        status:1,
                                                        collectStoreId:this.boothId1,
                                                        collectStoreBoothId:this.ruleForm.companyId,
                                                        actualStoreId:this.boothId2,
                                                        actualStoreBoothId:this.ruleForm.companyId2,
                                                        collectType:this.ruleForm.moneyType,
                                                        collectWay:this.ruleForm.moneyWay,
                                                        receiptNumber:this.ruleForm.Number,
                                                        buildingReceiptNumber:this.ruleForm.buildingNumber,
                                                        amount:this.moneyAll,
                                                        // paymentAmount:this.moneyAllChange,
                                                        isPoundage:this.ruleForm.isSignOrder?1:0,
                                                        bankCardId:this.ruleForm.cardNum,
                                                        costMoney:Number(this.ruleForm.cardMoney),
                                                        remark:this.ruleForm.remark,
                                                        relOrderCollectMoneyDTOS:arr,
                                                        companyBankCardId:this.ruleForm.companyBankCardId,
                                                        customerId:this.childTable.multiSelection[0].customerId,
                                                        commodityPics:this.commodityPics,
                                                        homeContractNumber:this.ruleForm.homeContractNumber,
                                                        gatheringTime:this.ruleForm.gatheringTime,
                                                        collectMoneyName:resionUid.data,
                                                        homeCompanyName:this.ruleForm.homeCompanyName,
                                                    }
                                                ).then(res=>{
                                                    this.submitLoading=false;
                                                    if(res.status==500){
                                                        this.$message({
                                                            message: res.message,
                                                            type: 'warning'
                                                        })
                                                    }else{
                                                        this.$message({
                                                            message: '保存成功',
                                                            type: 'success'
                                                        })
                                                        setTimeout(()=>{
                                                            this.$router.go(-1)
                                                        })
                                                    }
                                                    
                                                })
                                            }
                                        })
                                        
                                    }
                                }else{
                                    this.$message({
                                        message: '请填写完本次收款金额',
                                        type: 'warning'
                                    })
                                }
                                
                            }else{
                                this.$message({
                                    message: '请选择未结订单',
                                    type: 'warning'
                                })
                            }
                        }else{
                            return false
                        }
                    })
                }else {
                    return false;
                }
            });
            
        },

        // 取消 返回上一页
        goBack() {
            this.$router.go(-1);
        },

        //打开门店列表弹出层
        openDia(val){
            this.isIndex=val;
            this.randomTitle = "选择门店";
            this.childDialog.isShow = true;
        },

        // 弹出框的关闭 -- 子组件触发
        closePop(item) {
            if(this.isIndex===0&&item instanceof Array){
                this.boothId1=item[0].storeId;
                this.ruleForm.storeName=item[0].storeName;
            }else if(this.isIndex===1&&item instanceof Array){
                this.boothId2=item[0].storeId
                this.ruleForm.storeName2=item[0].storeName;
            }
            this.childDialog.isShow = false;
        },

        // 导入操作按钮的弹出框控制
        showDialog () {
            this.dialogFormVisible = true;
        },
        dialogUpload () {
            this.dialogFormVisible = false;
            this.$router.push({
                path: 'verifyGoods',
            });
        },
        cancleUpload() {

        },
        // table 颜色切换
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        // 多选改变
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit('selection-change', this.multipleSelection);
        }
    }
}
</script>
<style scoped lang="scss">
.ipts{
    width: 217px;
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

    .querybox {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        padding-left:42px;
        margin-top:20px;
        
        .orderinp {
            max-width: 420px;
            
        }
        .searchButton{
            margin-left:10px;
        }
    }

    .formCredit{
        margin-top:20px;
    }

    .clientcontent {
        margin-top: 20px;
        .btns {
            margin-top: 20px;
        }
    }
    
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


</style>
