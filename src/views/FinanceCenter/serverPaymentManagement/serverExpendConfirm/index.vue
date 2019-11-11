<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input clearable v-model="formList.paymentNumber" placeholder="支出单号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input clearable v-model="formList.companyName" placeholder="支付对象"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input clearable v-model="formList.bankCardNumber" placeholder="银行账号"></el-input>
                        </el-col>
                    <el-col :span="6">
                        <el-select clearable v-model="formList.paymentType">
                            <el-option v-for="(item,idx) in selectList" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                     <el-col :span="24" class="center">
                        <el-button size="medium" class="button-fc" type="warning" @click="searchTable">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="待支付" name="0">
                    <el-button class="button-96" size="small" v-if="btnJurisdiction.pay" :loading="confirmPayLoading" @click="confirmPayIt">确认支付</el-button>
                    <el-button class="button-96" size="small" v-if="btnJurisdiction.goBack" @click="goBackDialog">退回</el-button>
                    <waitSubmit :btnJurisdiction="btnJurisdiction" style="margin-top:20px" @payIt="payIt" @listen="marks" @question="questions" :tableData="tableData" @selectRows="selectRows"></waitSubmit>
                </el-tab-pane>
                <el-tab-pane label="已支付" name="1">
                <aleradySubmit :btnJurisdiction="btnJurisdiction" @listen="marks" :tableData="tableData"></aleradySubmit>
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
        <el-dialog width="800px" :visible.sync="dialog" custom-class="customDialogTitle">
            <div slot="title">支出单 <span>{{paymentNumber}}</span></div>
            <div>
                <div style="text-align:left;height:40px;display:inline-block;width:48.4%">
                    <span style="width:100px;text-align:right;display:inline-block">创建人：</span>{{createAtName}} {{createTime}}
                </div>
                <div style="text-align:left;height:40px;display:inline-block;width:50%">
                    <span style="width:100px;text-align:right;display:inline-block">提交人：</span>{{commitAtName}} {{commitTime}}
                </div>
                <el-form label-width="100px" :inline="true">
                    <el-form-item label="支出类型">
                        <el-select v-model="dialogFormList.paymentType" clearable style="width:260px" :disabled="true">
                            <el-option v-for="(item,idx) in selectList" :key="idx" :label="item.dictName" :value="item.id" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合作商家">
                        <el-select v-model="dialogFormList.companyId" style="width:260px" :disabled="true" clearable>
                            <el-option v-for="(item,idx) in companyArr" :key="idx" :label="item.companyName" :value="item.companyId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="付款方式">
                         <el-select v-model="dialogFormList.paymentMethod" style="width:260px" :disabled="true" clearable>
                            <el-option v-for="(item,idx) in paymentMethodArr" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="费用月份">
                        <el-date-picker 
                            style="width:260px"
                            size="large"
                            v-model="dialogFormList.costMonth"
                            type="date"
                            value-format="yyyy-MM"
                            format="yyyy-MM"
                            placeholder="日期" :disabled="true">
                        </el-date-picker> 
                    </el-form-item> 
                    <div class="userInfo">
                        <el-form-item label="开户名">
                            张三
                        </el-form-item>
                        <el-form-item label="所属银行">
                            招商银行
                        </el-form-item>
                        <el-form-item label="银行账号">
                            6225 2222 3333 222
                        </el-form-item>
                    </div>
                    <el-form-item label="支付金额">
                        <el-input @input="filterNumber(dialogFormList.paymentMoney)" clearable v-model="dialogFormList.paymentMoney" placeholder="支付金额" style="width:260px" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" class="remark">
                        <el-input clearable type="textarea" v-model="dialogFormList.remark" style="width:630px" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span style="display:flex;justify-content:center;align-items:center">
                <el-button type="primary">打印</el-button>
                <el-button @click="dialog=false;">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="visible"
        width="500px">
            <div class="titlecals">退回原因</div>
            <div>
                <el-input type="textarea" v-model="question" clearable></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="goBackConfirm" @click="confirmGoBack">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button> 
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import waitSubmit from './waitSubmit';
import pagination from '@/views/components/pagination';
import aleradySubmit from './aleradySubmit';
import {getPartnerExpenditureListVOByPage, returnPartnerExpenditureList, listPartnerExpenditureListVOByPage,listBaseDict, listCompanyByAll, expenditurePartnerExpenditureList} from "@/api/FinanceCenter/serverPaymentManagement/serverExpendConfirm/index"
export default {
    components:{
        breadcrumb,
        waitSubmit,
        aleradySubmit,
        pagination
    },
    activated(){
        this.btnInit()
        this.navList = this.$route.meta;
        listBaseDict(
            {
                dataType:'expenditure_type'
            }
        ).then(res=>{
            this.selectList=res.data;
        })
        listBaseDict(
            {
                dataType:'expenditure_payment_method'
            }
        ).then(res=>{
            this.paymentMethodArr=res.data;
        })
        listCompanyByAll(
            {
                companyType:1
            }
        ).then(res=>{
            this.companyArr=res.data;
        })
        this.pages()
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    //     listBaseDict(
    //         {
    //             dataType:'expenditure_type'
    //         }
    //     ).then(res=>{
    //         this.selectList=res.data;
    //     })
    //     listBaseDict(
    //         {
    //             dataType:'expenditure_payment_method'
    //         }
    //     ).then(res=>{
    //         this.paymentMethodArr=res.data;
    //     })
    //     listCompanyByAll(
    //         {
    //             companyType:1
    //         }
    //     ).then(res=>{
    //         this.companyArr=res.data;
    //     })
    //     this.pages()
    // },
    data(){
        return{
            show:false,
            visible:false,
            goBackConfirm:false,
            navList:[],
            searchtext:'',
            currentPage:1,
            pageSize:10,
            confirmPayLoading:false,
            total:10,
            dialog:false,
            selectList:[],
            paymentMethodArr:[],
            companyArr:[],
            tableData:[],
            data:[
                {
                    userName:'张三',
                    cardNum:12345645646,
                    status:"是",
                    Name:'招商'
                }
            ],
            formList:{
                paymentNumber:"",
                paymentType:"",
                companyName:"",
                bankCardNumber:"",
                status:3,
                page:1,
                limit:15
            },
            rowsData:[],
            question:'',
            flag:false,
            rowData:[],
            createAtName:"",
            createTime:"",
            commitAtName:"",
            commitTime:"",
            paymentNumber:"",
            dialogFormList:{
                paymentType:"",
                companyId:"",
                paymentMethod:"",
                bankAccountId:0,
                costMonth:"",
                paymentMoney:"",
                isPrinting:0,
                remark:"",
                status:"",
            },
            btnJurisdiction:{
                pay:false,
                goBack:false
            }
        }
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.pay=JSON.parse(this.$loca.getItem('element'))["serverExpendConfirm:btn_pay"];
            this.btnJurisdiction.goBack=JSON.parse(this.$loca.getItem('element'))["serverExpendConfirm:btn_goBack"];
        },
        filterNumber(val){
            this.dialogFormList.paymentMoney=val.replace(/[^\d]/g,'');
        },
        reset(){
            this.formList.paymentNumber="";
            this.formList.paymentType="";
            this.formList.companyName="";
            this.formList.bankCardNumber="";
            this.formList.page=1;
            this.pages();
        },
        tabClick(val){
            this.tableData=[];
            if(val.index==0){
                this.formList.status=3
            }else if(val.index==1){
                this.formList.status=4
            }
            this.pages();
        },
        pages(){
            listPartnerExpenditureListVOByPage(this.formList).then(res=>{
                this.tableData=res.data.rows
            })
        },
        confirmGoBack(){
            this.goBackConfirm=true;
            if(this.flag){
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.partnerExpenditureListId)
                })
                returnPartnerExpenditureList(
                    {
                        partnerExpenditureListIds:arr.join(",")
                    }
                ).then(res=>{
                    this.goBackConfirm=false;
                    this.pages()
                    // this
                    this.$message({
                        message: '退回成功',
                        type: 'success'
                    });
                })
            }else{
                returnPartnerExpenditureList(
                    {
                        partnerExpenditureListIds:this.rowData.partnerExpenditureListId
                    }
                ).then(res=>{
                    this.pages()
                    this.$message({
                        message: '退回成功',
                        type: 'success'
                    });
                })
            }
            this.visible=false;
        },
        goBackDialog(){
            this.flag=true
            if(this.rowsData.length>0){
                this.visible=true;
            }else{
                this.$message({
                    message: '请选择后在进行操作',
                    type: 'warning'
                });
            }
        },
        confirmPayIt(){
            if(this.rowsData.length>0){
                this.confirmPayLoading=true;
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.partnerExpenditureListId)
                })
                expenditurePartnerExpenditureList(
                    {
                        partnerExpenditureListIds:arr.join(",")
                    }
                ).then(res=>{
                    this.confirmPayLoading=false;
                    this.$message({
                        message: '支付成功',
                        type: 'success'
                    });
                    this.pages()
                })
            }else{
                this.$message({
                    message: '请选择后再进行操作',
                    type: 'warning'
                });
            }
        },
        payIt(val){
            // this.dialog=true
            if(this.rowsData.length>0){
                this.rowsData.map((item,idx)=>{
                    if(item.partnerExpenditureListId==val){
                        this.rowsData.splice(idx,1)
                    }
                })
            }
            expenditurePartnerExpenditureList(
                {
                    partnerExpenditureListIds:val
                }
            ).then(res=>{
                this.$message({
                    message: '支付成功',
                    type: 'success'
                });
                this.pages()
            })
        },
        selectRows(val){
            this.rowsData=val;
        },
        questions(data){
            this.flag=false;
            this.rowData=data;
            this.visible=true;
        },
        marks(data){
            console.log(111)
            this.dialog=true;
            getPartnerExpenditureListVOByPage(
                {
                    partnerExpenditureListId:data.partnerExpenditureListId
                }
            ).then(res=>{
                this.createAtName=res.data.createAtName;
                this.createTime=res.data.createTime;
                this.commitAtName=res.data.commitAtName;
                this.commitTime=res.data.commitTime;
                this.paymentNumber=res.data.paymentNumber
                for(let i in this.dialogFormList){
                    this.dialogFormList[i]=res.data[i]
                }
                this.dialog=true;
            })
        },
        accounts(data){
            this.dialog=true;
        },
        clickOk(){
            this.show=false;
        },
        searchTable(){
            this.pages()
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        },
    },
}
</script>
<style scoped>
.querybox>div{
    width:calc(calc(100% - 100px) / 3)
}
.formList{
    margin-bottom:20px;
}
.formList>li{
    width: 31%;
}
.formList>li>span{
    display: inline-block;
    width: 100px;;
    text-align: right;
}
.formList>li>div{
    width: calc(100% - 120px);
}
</style>

