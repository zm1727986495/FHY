<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input v-model="formList.paymentNumber" placeholder="支出单号" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="formList.companyName" placeholder="支付对象" clearable></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="formList.bankCardNumber" placeholder="银行账号" clearable></el-input>
                        </el-col>
                    <el-col :span="6">
                        <el-select v-model="formList.paymentType" clearable>
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
                <el-tab-pane label="待销账" name="0">
                        <el-button class="button-96" size="small" v-if="btnJurisdiction.writeOff" @click="writeOffDialog">销账</el-button>
                        <waitSubmit :btnJurisdiction="btnJurisdiction" style="margin-top:20px" @listen="marks" @writeOff="listens" :tableData="tableData" @selectRows="selectRows"></waitSubmit>
                </el-tab-pane>
                <el-tab-pane label="已销账" name="1">
                    <aleradySubmit :btnJurisdiction="btnJurisdiction" @listen="marks" @writeOff="listens" :tableData="tableData"></aleradySubmit>
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
            <div slot="title">
                支出单 <span>{{paymentNumber}}</span>
            </div>
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
                        <el-input v-model="dialogFormList.paymentMoney" clearable placeholder="支付金额" style="width:260px" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" class="remark">
                        <el-input type="textarea" v-model="dialogFormList.remark" clearable style="width:630px" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span style="display:flex;justify-content:center;align-items:center">
                <el-button size="medium" type="primary">打印</el-button>
                <el-button size="medium" @click="dialog=false;">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="设定记账月份" width="500px" :visible.sync="dialogs" custom-class="customDialogTitle">
            <div style="display:flex;justify-content:center;align-items:center">
                <span>
                    记账月份：
                </span>
                <div style="display:inline-block">
                    <el-select v-model="selectMonth" clearable>
                        <el-option v-for="(item,idx) in monthArr" :key="idx" :value="nowDate+'-'+item"></el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmMonth">确定</el-button>
                <el-button @click="dialogs=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import waitSubmit from './waitSubmit';
import aleradySubmit from './aleradySubmit'
import pagination from '@/views/components/pagination';
import { getPartnerExpenditureListVOByPage,listPartnerExpenditureListVOByPage, listBaseDict, listCompanyByAll, writeOffPartnerExpenditureList} from "@/api/FinanceCenter/serverPaymentManagement/serverExpendAccount/index"
export default {
    components:{
        breadcrumb,
        waitSubmit,
        aleradySubmit,
        pagination
    },
    activated(){
        this.navList = this.$route.meta;
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
    //     this.navList = this.$route.meta;
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
            navList:[],
            searchtext:'',
            dialog:false,
            dialogs:false,
            selectList:[],
            formList:{
                paymentNumber:"",
                paymentType:"",
                companyName:"",
                bankCardNumber:"",
                status:4,
                page:1,
                limit:15
            },
            total:10,
            paymentMethodArr:[],
            companyArr:[],
            tableData:[],
            selectMonth:'',
            monthArr:["01","02","03","04","05","06","07","08","09","10","11","12"],
            rowsData:[],
            rowData:[],
            flag:false,
            createAtName:'',
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
                writeOff:false
            }
        }
    },
    computed:{
        nowDate(){
             let dates=new Date();
             return dates.getFullYear()
        }
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.writeOff=JSON.parse(this.$loca.getItem('element'))["serverExpendAccount:btn_writeOff"];
        },
        reset(){
            this.formList.paymentNumber="";
            this.formList.paymentType="";
            this.formList.companyName="";
            this.formList.bankCardNumber="";
            this.formList.page=1;
            this.pages()
        },
        pages(){
            listPartnerExpenditureListVOByPage(this.formList).then(res=>{
                this.tableData=res.data.rows
            })
        },
        listens(data){
            this.flag=false,
            this.dialogs=true;
            this.rowData=data;
        },
        marks(data){
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
        searchTable(){
            this.pages()
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        selectRows(val){
            this.rowsData=val;
        },
        tabClick(val){
            this.tableData=[];
            if(val.index==0){
                this.formList.status=4
            }else if(val.index==1){
                this.formList.status=5
            }
            this.pages()
        },
        confirmMonth(){
            if(this.flag){
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.partnerExpenditureListId)
                })
                if(this.selectMonth){
                    writeOffPartnerExpenditureList(
                        {
                            partnerExpenditureListIds: arr.join(","),
                            accountingMonth:this.selectMonth,
                        }
                    ).then(res=>{
                        this.dialogs=false;
                        this.pages()
                    })
                }else{
                    this.$message({
                        message: '请选择销账月份',
                        type: 'warning'
                    });
                }
                
            }else{
                this.rowsData.map((item,idx)=>{
                    if(this.rowData.partnerExpenditureListId===item.partnerExpenditureListId){
                        this.rowsData.splice(idx,1)
                    }
                })
                if(this.selectMonth){
                    writeOffPartnerExpenditureList(
                        {
                            partnerExpenditureListIds: this.rowData.partnerExpenditureListId,
                            accountingMonth:this.selectMonth,
                        }
                    ).then(res=>{
                        this.dialogs=false;
                        this.pages()
                    })
                }else{
                    this.$message({
                        message: '请选择销账月份',
                        type: 'warning'
                    });
                }
                
            }
            
        },
        writeOffDialog(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后在进行销账',
                    type: 'warning'
                });
            }else{
                this.dialogs=true;
                this.flag=true;
            }
            
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

