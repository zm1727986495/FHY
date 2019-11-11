<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
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
                            @keyup.enter.native="search"
                            v-model="date"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="收款开始日期"
                            size="medium"
                            @change="resetDate1"
                            value-format="yyyy-MM-dd"
                            end-placeholder="收款结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            @keyup.enter.native="search"
                            v-model="date2"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="审核开始日期"
                            size="medium"
                            @change="resetDate2"
                            value-format="yyyy-MM-dd"
                            end-placeholder="审核结束日期">
                        </el-date-picker>
                    </el-col>
                    <!-- <el-col :span="24" class="center"> -->
                        <!-- <span @click="more">{{text}}</span> -->
                    <div class="audit_btn">
                        <el-button class="button-fc" type="warning" size="medium" @click="search">查询</el-button>
                        <el-button type="primary" size="medium" @click="reset">重置</el-button>
                    </div>    
                    <!-- </el-col> -->
                </el-row>
            </div>
        </el-card>
        <div>
             <el-tabs type="border-card" @tab-click="tabClick">
                    <el-tab-pane label="待审核" name="0">   
                        <el-button class="button-96" size="small" v-if="btnJurisdiction.goBack" @click="goBackMethods(0)">驳回</el-button>
                        <el-button size="small" class="button-96" :loading="auditLoading" v-if="btnJurisdiction.audit" @click="audit">审核</el-button>
                        <el-checkbox v-model="isCashier" @change="isConfirm" style="margin-left:10px">
                            出纳是否确认
                        </el-checkbox>
                        <waitAudit :tableData="tableData" :btnJurisdiction="btnJurisdiction" @selectRows="selectRows" @goBack="dialog" style="margin-top:20px;"></waitAudit>
                    </el-tab-pane>
                    <el-tab-pane label="已审核待收票" name="1" v-if="btnJurisdiction.ticket">
                        <!-- <el-button class="button-96" size="small" @click="goBackMethods(1)">驳回</el-button> -->
                        <el-button class="button-96" size="small" :loading="ticketLoading" @click="confirmTicket">确认收票</el-button>
                        <alreadyAudit @changePages="changePages" @goBack="dialog" @selectRows="selectRows"  style="margin-top:20px;" :tableData="tableData"></alreadyAudit>
                    </el-tab-pane>
                    <el-tab-pane label="已审核" name="2">
                        <el-checkbox v-model="isCashier" @change="isConfirm">
                            出纳是否确认
                        </el-checkbox>
                        <receiptNum :btnJurisdiction="btnJurisdiction" class="m-top20" :tableData="tableData"></receiptNum>
                    </el-tab-pane>
                    <ul class="priceclass">
                        <li>收款金额合计 {{collectMoneyAll}}</li>
                    </ul>
                    <div class="pagination_wrap">
                        <pagination
                            :current-page="currentPage"
                            :pageSize="pageSize"
                            :total="total"
                            @sizeChange="sizeChange"
                            @currentChange="currentChange">
                        </pagination>
                    </div>
             </el-tabs>
        </div>
        <el-dialog title="驳回原因" :visible.sync="dialogs" width="500px" custom-class="customDialogTitle" @close="close">
            <div>
                <el-input type="textarea" v-model="textArea" clearable></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="goBackLoading" @click="confirm">确 定</el-button>
                <el-button @click="dialogs = false">取 消</el-button> 
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import waitAudit from './waitAudit';
import alreadyAudit from './alreadyAudit';
import receiptNum from './receiptNum';
import pagination from '@/views/components/pagination';
import{
examineList,
returnOrderCollectMoneySuatus,
receivedTicketOrderCollectMoney,
examineOrderCollectMoneyList
} from 'api/FinanceCenter/creditManagement/customerDocumentAudit/index'
export default {
    mounted() {
        var now = new Date(); //当前日期 
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        var monthStartDate = new Date(nowYear, nowMonth, 1); 
        var monthEndDate = new Date(nowYear, nowMonth+1, 0);
        this.date=[
            monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth()+1) + '-' +monthStartDate.getDate(),
            monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth()+1) + '-' +monthEndDate.getDate()
        ];
        this.isReady=null;
        this.pages()
        this.init()
        this.navList = this.$route.meta;
    },
    components:{
        breadcrumb,
        waitAudit,
        alreadyAudit,
        receiptNum,
        pagination
    },
    computed: {
        collectMoneyAll(){
            let num=0;
            this.tableData.map((item,idx)=>{
                num+=Number(item.collectMoney);
            })
            return (num).toFixed(2)
        }
    },
    data(){
        return{
            navList:[],
            searchtext:'',
            dialogs:false,
            status:1,
            currentPage:1,
            pageSize:10,
            total:10,
            tableData:[],
            textArea:'',
            date:['',''],
            date2:['',''],
            show:false,
            text:'更多',
            formList:{
                orderCustomer:'',
                collectNumber:'',
                storeName:'',
                auditStartTime:'',
                auditStartEnd:'',
                gatheringEndTime:'',
                gatheringStartTime:'',
            },
            rowsData:[],
            ticketRows:[],
            statusBack:0,
            isReady:1,
            isCashier:false,
            btnJurisdiction:{
                ticket:false,
                audit:false,
                goBack:false
            },
            auditLoading:false,
            ticketLoading:false,
            goBackLoading:false,
        }
    },
    methods:{
        isConfirm(){
            this.tableData=[];
            this.total=0;
            this.currentPage=1;
            this.pages()
        },
        resetDate2(val){
            if(!val){
                this.date2=["",""]
            }
        },
        resetDate1(val){
            if(!val){
                this.date=["",""]
            }
            
        },
        init(){
            this.btnJurisdiction.ticket=JSON.parse(this.$loca.getItem('element'))["customerDocumentAudit:btn_ticket"];
            this.btnJurisdiction.audit=JSON.parse(this.$loca.getItem('element'))["customerDocumentAudit:btn_audit"];
            this.btnJurisdiction.goBack=JSON.parse(this.$loca.getItem('element'))["customerDocumentAudit:btn_goBack"];
        },
        audit(){
            if(this.ticketRows.length){
                this.auditLoading=true;
                let arr=[];
                this.ticketRows.map((item,idx)=>{
                    arr.push(item.collectMoneyId)
                })
                examineOrderCollectMoneyList({
                    collectMoneyIds:arr
                }).then(res=>{
                    this.auditLoading=false;
                    this.$message({
                        message: '审核成功',
                        type: 'success'
                    });
                    this.pages()
                })
            }else{
                this.$message({
                    message: '请选择后再进行审核',
                    type: 'warning'
                });
            }
        },
        more(){
            this.show=!this.show;
            this.text=this.show?"收起":"更多"
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
            this.currentPage=1;
            this.total=0;
            this.tableData=[];
            for(let i in this.formList){
                this.formList[i]="";
            }
            this.pages()
        },
        close(){
            this.textArea=""
        },
        confirmTicket(){
            if(this.ticketRows.length==0){
                this.$message({
                    message: '选择后再进行收票',
                    type: 'warning'
                });
            }else{
                let arr=[];
                this.ticketLoading=true;
                this.ticketRows.map((item,idx)=>{
                    arr.push(item.collectMoneyId)
                })
                receivedTicketOrderCollectMoney(
                    {
                        collectMoneyIdss:arr.join(",")
                    }
                ).then(res=>{
                    this.ticketLoading=false;
                    this.$message({
                        message: '收票成功',
                        type: 'success'
                    });
                    this.pages()
                })
            }
        },
        selectRows(val){
            this.statusBack=1;
            this.ticketRows=val;
        },
        goBackMethods(val){
            if(this.ticketRows.length==0){
                this.$message({
                    message: '选择后再进行驳回',
                    type: 'warning'
                });
            }else{
                this.dialogs = true;
            }
        },
        confirm(){
                if(this.statusBack==0){
                    if(this.textArea){
                        this.goBackLoading=true;
                        returnOrderCollectMoneySuatus(
                            {
                                collectMoneyIdss:this.rowsData.collectMoneyId,
                                returnReason:this.textArea
                            }
                        ).then(res=>{
                            this.dialogs = false;
                            this.goBackLoading=false;
                            this.$message({
                                message: '驳回成功',
                                type: 'success'
                            });
                            this.pages()
                        })
                    }else{
                        this.$message({
                            message: '请输入驳回原因',
                            type: 'warning'
                        });
                    }
                    
                }else{
                    if(this.textArea){
                        this.goBackLoading=true;
                        let arr=[]
                        this.ticketRows.map((item,idx)=>{
                            arr.push(item.collectMoneyId)
                        })
                        returnOrderCollectMoneySuatus(
                            {
                                collectMoneyIdss:arr.join(","),
                                returnReason:this.textArea
                            }
                        ).then(res=>{
                            this.dialogs = false;
                            this.goBackLoading=false;
                            this.$message({
                                message: '驳回成功',
                                type: 'success'
                            });
                            this.pages()
                        })
                    }else{
                        this.$message({
                            message: '请输入驳回原因',
                            type: 'warning'
                        });
                    }
                    
                }
        },
        search(){
            this.currentPage=1;
            this.total=0;
            this.tableData=[];
            this.pages()
        },
        pages(){
            examineList(
                {
                    orderCustomer:this.formList.orderCustomer,
                    collectNumber:this.formList.collectNumber,
                    storeName:this.formList.storeName,
                    collectMoneyName:this.formList.collectMoneyName,
                    gatheringStartTime:this.date[0],
                    gatheringEndTime:this.date[1],
                    auditStartTime:this.date2[0],
                    auditEndTime:this.date2[1],
                    page:this.currentPage,
                    limit:this.pageSize,
                    type:this.status,
                    isReady:this.isReady,
                    isCashier:this.isCashier?1:null
                }
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        dialog(data){
            this.statusBack=0
            this.rowsData=data;
            this.dialogs=true
        },
        tabClick(val){
            this.isCashier=false;
            this.tableData=[];
            this.currentPage=1;
            this.total=0;
            if(val.index==0){
                this.status=1;
                this.isReady=null;
                this.pages()
            }else if(val.index==1){
                this.status=2;
                this.isReady=0;
                this.pages()
            }else if(val.index==2){
                this.status=2;
                this.isReady=1;
                this.pages()
            }
        },
        currentChange(val) {
            this.currentPage = val;
            this.pages()
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.pages()
        },
        changePages(){
            this.pages()
        }
    }
}
</script>
<style scoped>
.audit_btn{
    min-width: 120px;
    display: flex;
    flex-wrap: nowrap;
}

</style>

