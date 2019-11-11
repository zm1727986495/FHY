<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input size="medium" v-model="formList.paymentNumber" clearable placeholder="支出单号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" v-model="formList.companyName" clearable placeholder="支付对象"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input size="medium" v-model="formList.bankCardNumber" clearable placeholder="银行账号"></el-input>
                        </el-col>
                    <el-col :span="6">
                        <el-select size="medium" v-model="formList.paymentType" clearable>
                            <el-option v-for="(item,idx) in selectList" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="24" style="display:flex;justify-content:center;align-items:center">
                        <el-button size="medium" class="button-fc" type="warning" @click="searchTable">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="待审核" name="0" >
                    <el-button class="button-96" size="small" v-if="btnJurisdiction.goBack" @click="goBack">退回</el-button>
                    <el-button class="button-96" size="small" :loading="auditLoading" v-if="btnJurisdiction.auditPass" @click="audit">审核通过</el-button>
                    <waitSubmit :btnJurisdiction="btnJurisdiction" style="margin-top:20px" @onlyRead="marks" @listen="marks" @question="questions" :tableData="tableData" @selectRows="selectRows"></waitSubmit>
                </el-tab-pane>
                <el-tab-pane label="已审核" name="1">
                    <aleradySubmit :btnJurisdiction="btnJurisdiction" @listen="marks" :tableData="tableData" @onlyRead="marks"></aleradySubmit>
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
            <div slot="title" class="el-dialog__title">支出单<span>{{paymentNumber}}</span></div>
            <div>
                <div style="text-align:left;height:40px;display:inline-block;width:48.4%">
                    <span style="width:100px;text-align:right;display:inline-block">创建人：</span>{{createAtName}} {{createTime}}
                </div>
                <div style="text-align:left;height:40px;display:inline-block;width:50%">
                    <span style="width:100px;text-align:right;display:inline-block">提交人：</span>{{commitAtName}} {{commitTime}}
                </div>
                <el-form label-width="100px" :inline="true">
                    <el-form-item label="支出类型">
                        <el-select v-model="dialogFormList.paymentType" style="width:260px" :disabled="true" clearable>
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
                        <el-input clearable v-model="dialogFormList.paymentMoney" placeholder="支付金额" style="width:260px" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" class="remark">
                        <el-input clearable type="textarea" v-model="dialogFormList.remark" style="width:630px" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button type="primary" v-if="isShow" @click="dialogGoBack">退回</el-button>
                <el-button type="primary" v-if="isShow" @click="auditOK">通过</el-button>
                <el-button type="primary" v-if="!isShow">打印</el-button>
                <el-button @click="dialog=false;">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="退回原因" :visible.sync="visible" width="500px" custom-class="customDialogTitle">
            <div>
                <el-input type="textarea" v-model="question" clearable></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="goBackLoading" @click="clickQuestion">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button> 
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../../components/breadcrumb";
import waitSubmit from './waitSubmit';
import aleradySubmit from './aleradySubmit';
import pagination from '../../../components/pagination';
import { listPartnerExpenditureListVOByPage, listBaseDict,getPartnerExpenditureListVOByPage, listCompanyByAll, returnPartnerExpenditureList, examinePartnerExpenditureList } from '@/api/FinanceCenter/serverPaymentManagement/serverExpendAudit'
export default {
    components:{
        breadcrumb,
        waitSubmit,
        aleradySubmit,
        pagination
    },
    activated(){
        this.btnInit()
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
        listCompanyByAll({
            companyType:1
        }).then(res=>{
            this.companyArr=res.data;
        })
        this.pages()
        this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.btnInit()
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
    //     listCompanyByAll({
    //         companyType:1
    //     }).then(res=>{
    //         this.companyArr=res.data;
    //     })
    //     this.pages()
    //     this.navList = this.$route.meta;
    // },
    data(){
        return{
            show:false,
            visible:false,
            goBackLoading:false,
            auditLoading:false,
            navList:[],
            searchtext:'',
            dialog:false,
            selectList:[],
            paymentMethodArr:[],
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
                status:1,
                page:1,
                limit:10
            },
            createTime:'',
            createAtName:'',
            commitTime:"",
            commitAtName:"",
            companyArr:[],
            total:10,
            tableData:[],
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
            paymentNumber:'',
            question:"",
            rowsData:[],
            isShow:false,
            partnerExpenditureListId:'',
            flag:false,
            btnJurisdiction:{
                goBack:false,
                auditPass:false,
            }
        }
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.auditPass=JSON.parse(this.$loca.getItem('element'))["serverExpendAudit:btn_auditPass"];
            this.btnJurisdiction.goBack=JSON.parse(this.$loca.getItem('element'))["serverExpendAudit:btn_goBack"];
        },
        reset(){
            this.formList.paymentNumber="";
            this.formList.paymentType="";
            this.formList.companyName="";
            this.formList.bankCardNumber="";
            this.formList.page=1;
            this.pages()
        },
        clickQuestion(){
            this.goBackLoading=true;
            if(this.flag){
                this.rowsData.map((item,idx)=>{
                    if(item.partnerExpenditureListId==this.partnerExpenditureListId){
                        this.rowsData.splice(idx,1)
                    }
                })
                returnPartnerExpenditureList(
                    {
                        partnerExpenditureListIds:this.partnerExpenditureListId,
                        returnReason:this.question
                    }
                ).then(res=>{
                    this.visible=false;
                    this.dialog=false;
                    this.goBackLoading=false;
                    this.pages()
                    this.$message({
                        message: '退回成功',
                        type: 'success'
                    });
                })
            }else{
                let arr=[]
                this.rowsData.map((item,idx)=>{
                    arr.push(item.partnerExpenditureListId)
                })
                returnPartnerExpenditureList(
                    {
                        partnerExpenditureListIds:arr.join(","),
                        returnReason:this.question
                    }
                ).then(res=>{
                    this.goBackLoading=false;
                    this.visible=false;
                    this.dialog=false;
                    this.rowsData=[];
                    this.pages()
                    this.$message({
                        message: '退回成功',
                        type: 'success'
                    });
                })
            }
            
        },
        goBack(){
            if(this.rowsData.length>0){
                this.visible=true;
                this.flag=false;
            }else{
                this.$message({
                    message: '请选择后再进行操作',
                    type: 'warning'
                });
            }
        },
        searchTable(){
            this.pages()
        },
        auditOK(){
            examinePartnerExpenditureList(
                {
                    partnerExpenditureListIds:this.rowsData[0].partnerExpenditureListId,
                }
            ).then(res=>{
                this.dialog=false;
                this.rowsData=[];
                this.$message({
                    message: '审核通过',
                    type: 'success'
                });
                this.pages()
            })
        },
        tabClick(val){
            this.tableData=[];
            if(val.index==0){
                this.formList.status=1
            }else if(val.index==1){
                this.formList.status=3
            }
            this.pages()
        },
        selectRows(val){
            this.rowsData=val;
        },
        pages(){
            listPartnerExpenditureListVOByPage(
                this.formList
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        questions(data){
            this.visible=true;
            this.flag=true;
            this.partnerExpenditureListId=data.partnerExpenditureListId;
        },
        audit(){
            if(this.rowsData.length>0){
                this.auditLoading=true;
                let arr=[]
                this.rowsData.map((item,idx)=>{
                    arr.push(item.partnerExpenditureListId)
                })
                examinePartnerExpenditureList(
                    {
                        partnerExpenditureListIds:arr.join(","),
                    }
                ).then(res=>{
                    this.auditLoading=false;
                    this.$message({
                        message: '审核通过',
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
        marks(data,val){
            if(val===true){
                this.isShow=false;
            }else{
                this.isShow=true
            }
            this.rowsData=[data]
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
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        },
        dialogGoBack(val){
            this.visible=true;
            this.flag=true;
            this.partnerExpenditureListId=val.partnerExpenditureListId;
        }
    },
}
</script>
<style scoped>
.querybox{
    /* display: flex; */
    /* justify-content: space-between; */
}
.querybox>div{
    width:calc(calc(100% - 100px) / 3)
}
.userInfo>.el-form-item:nth-child(1){
    width: 165px;
    display: inline-block;
}
.userInfo>.el-form-item:nth-child(2){
    width: 180px;
    display: inline-block;
}
.userInfo>.el-form-item:nth-child(3){
    width: 253px;
}
.choose{
    text-align:right;
    display: inline-block;
    line-height: 38px;
}
.remark{
    width: 100%;
}
</style>

