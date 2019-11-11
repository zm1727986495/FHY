<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input @keyup.enter.native="search" size="medium" placeholder="订单号/姓名/电话" v-model="formList.orderCustomer" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input @keyup.enter.native="search" size="medium" placeholder="收据号" v-model="formList.collectNumber" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input @keyup.enter.native="search" size="medium" placeholder="门店名称" v-model="formList.storeName" clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            @keyup.enter.native="search"
                            v-model="date"
                            type="daterange"
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
                            @keyup.enter.native="search"
                            v-model="date2"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="审核开始日期"
                            size="medium"
                            value-format="yyyy-MM-dd"
                            @change="resetDate2"
                            end-placeholder="审核结束日期">
                        </el-date-picker>
                    </el-col>
                    <!-- <el-col :span="4" class="center"> -->
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

                <div>
                    <el-tabs type="border-card" @tab-click="tabClick">
                        <el-tab-pane label="待收款" name="0">
                            <el-button size="small" class="button-96" v-if="btnJurisdiction.goBack" @click="sendBack">退回</el-button>
                            <el-button size="small" class="button-96" :loading="collectMoneyLoading" v-if="btnJurisdiction.receipt" @click="audit">收款</el-button>
                            <waitReceipt :btnJurisdiction="btnJurisdiction" style="margin-top:20px" @goBack="goBackQuestion" :tableData="tableData" @selectRows="selectRows"></waitReceipt>
                        </el-tab-pane>
                        <el-tab-pane label="已收款" name="1">
                            <el-checkbox v-model="isAccounting">
                                会计是否审核
                            </el-checkbox>
                            <moneyReceipt :btnJurisdiction="btnJurisdiction" style="margin-top:20px" :tableData="tableData"></moneyReceipt>
                        </el-tab-pane>
                        <el-tab-pane label="已审核待收票" name="2" v-if="btnJurisdiction.ticket">
                            <!-- <el-button class="button-96" size="small" @click="goBackMethods(1)">驳回</el-button> -->
                            <el-button class="button-96" size="small" :loading="ticketLoading" @click="confirmTicket">确认收票</el-button>
                            <alreadyAudit @changePages="changePages" @goBack="dialog" @selectRows="selectRows"  style="margin-top:20px;" :tableData="tableData"></alreadyAudit>
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
        </div>
        <el-dialog title="驳回原因" :visible.sync="visible" width="500px" custom-class="customDialogTitle" @close="close">
            <div>
                <el-input type="textarea" v-model="question" clearable></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="goBackLoading" @click="confirm">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button> 
            </span>
        </el-dialog>
    </div>
</template>
<script>
import waitReceipt from './waitReceipt'
import moneyReceipt from './moneyReceipt'
import pagination from '@/views/components/pagination';
import breadcrumb from "@/views/components/breadcrumb";
import alreadyAudit from '../customerDocumentAudit/alreadyAudit'
import{
listOrderCollectMoneyUnsettledByPage,
returnOrderCollectMoneySuatus,
receivedTicketOrderCollectMoney,
receivableOrderCollectMoneyList
} from 'api/FinanceCenter/creditManagement/clientReceipt/index'
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
        this.pages()
        this.btnInit()
        this.navList = this.$route.meta;
    },
    components:{
        waitReceipt,
        moneyReceipt,
        pagination,
        breadcrumb,
        alreadyAudit
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
        return {
            navList:[],
            question:'',
            visible:false,
            currentPage:1,
            pageSize:10,
            total:10,
            collectMoneyId:'',
            tableData:[],
            collectMoneyLoading:false,
            goBackLoading:false,
            idx:1,
            waitChildRows:[],
            isAccounting:false,
            date:['',''],
            date2:['',''],
            formList:{
                orderCustomer:'',
                collectNumber:'',
                storeName:'',
                auditStartTime:'',
                auditStartEnd:'',
                gatheringEndTime:'',
                gatheringStartTime:'',
            },
            isReady:'',
            show:false,
            text:'更多',
            btnJurisdiction:{
                goBack:false,
                receipt:false,
                ticket:false,
            },
            ticketLoading:false,
        }
    },
    watch: {
        isAccounting(val){
            this.total=0;
            this.currentPage=1;
            this.tableData=[];
            this.pages()
        }
    },
    methods: {
        changePages(){
            this.pages()
        },
        selectRows(val){
            this.statusBack=1;
            this.waitChildRows=val;
        },
        goBackMethods(val){
            if(this.waitChildRows.length==0){
                this.$message({
                    message: '选择后再进行驳回',
                    type: 'warning'
                });
            }else{
                this.visible = true;
            }
        },
        dialog(data){
            this.statusBack=0
            this.waitChildRows=data.collectMoneyId;
            this.visible=true
        },
        confirmTicket(){
            if(this.waitChildRows.length==0){
                this.$message({
                    message: '选择后再进行收票',
                    type: 'warning'
                });
            }else{
                let arr=[];
                this.ticketLoading=true;
                this.waitChildRows.map((item,idx)=>{
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
        btnInit(){
            this.btnJurisdiction.goBack=JSON.parse(this.$loca.getItem('element'))["clientReceipt:btn_goBack"];
            this.btnJurisdiction.receipt=JSON.parse(this.$loca.getItem('element'))["clientReceipt:btn_receipt"];
            this.btnJurisdiction.ticket=JSON.parse(this.$loca.getItem('element'))["clientReceipt:btn_ticket"];
        },
        more(){
            this.show=!this.show;
            this.text=this.show?"收起":"更多"
        },
        audit(){
            if(this.waitChildRows.length){
                let arr=[];
                this.waitChildRows.map((item,idx)=>{
                    arr.push(item.collectMoneyId)
                })
                this.collectMoneyLoading=true;
                receivableOrderCollectMoneyList({
                    collectMoneyIds:arr
                }).then(res=>{
                    this.collectMoneyLoading=false;
                    this.$message({
                        message: '收款成功',
                        type: 'success'
                    });
                    this.pages()
                })
            }else{
                this.$message({
                    message: '请选择后再进行收款',
                    type: 'warning'
                });
            }
            
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
            this.question="";
        },
        search(){
            this.currentPage=1;
            this.total=0;
            this.tableData=[];
            this.pages()
        },
        selectRows(val){
            console.log(val)
            this.waitChildRows=val;
        },
        currentChange(val) {
            this.currentPage = val;
            this.pages()
        },
        sizeChange(val){
            this.currentPage = 1;
            this.pageSize=val;
            this.pages()
        },
        pages(){
            listOrderCollectMoneyUnsettledByPage(
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
                    type:this.idx,
                    isReady:this.isReady,
                    isAccounting:this.isAccounting?1:null
                }
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        tabClick(data){
            this.tableData=[];
            this.total=0;
            this.currentPage=1;
            if(data.index==0){
                this.idx=1;
                this.isReady=null;
                this.pages()
            }else if(data.index==1){
                this.idx=2;
                this.isReady=1;
                this.pages()
            }else if(data.index==2){
                this.idx=2;
                this.isReady=0;
                this.pages()
            }
            
            
        },
        confirm(){
            
            if(this.waitChildRows instanceof Array){
                let arr=[];
                this.waitChildRows.map((item,idx)=>{
                    arr.push(item.collectMoneyId)
                })
                if(this.question){
                    this.goBackLoading=true;
                    returnOrderCollectMoneySuatus(
                        {
                            collectMoneyIdss:arr.join(","),
                            returnReason:this.question
                        }
                    ).then(res=>{
                        this.visible = false;
                        this.goBackLoading=false;
                        this.pages()
                        this.$message({
                            message: '退回成功',
                            type: 'success'
                        });
                    })
                }else{
                    this.$message({
                        message: '请输入退款原因',
                        type: 'warning'
                    });
                }
                
            }else{
                if(this.question){
                    this.goBackLoading=true;
                    returnOrderCollectMoneySuatus(
                        {
                            collectMoneyIdss:this.waitChildRows,
                            returnReason:this.question
                        }
                    ).then(res=>{
                        this.visible = false;
                        this.goBackLoading=false;
                        this.pages()
                        this.$message({
                            message: '退回成功',
                            type: 'success'
                        });
                    })
                }else{
                    this.$message({
                        message: '请输入退款原因',
                        type: 'warning'
                    });
                }
                
            }
            
        },
        goBackQuestion(data){
            this.visible=true;
            this.waitChildRows=data.collectMoneyId;
        },
        sendBack(){
            if(this.waitChildRows.length==0){
                this.$message({
                    message: '请选择后再退回',
                    type: 'warning'
                });
            }else{
                this.visible=true;
            }
        },
        currentChange(val) {
            this.currentPage = val;
            this.pages()
        },
        sizeChange(val){
            this.currentPage = 1;
            this.pageSize=val;
            this.pages()
        }
    },
}
</script>
<style scoped>
    .searchIpt{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .audit_btn{
        min-width: 120px;
        display: flex;
        flex-wrap: nowrap;
    }
</style>


