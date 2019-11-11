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
                <el-tab-pane label="待销账" name="0">
                    <el-button class="button-96" size="small" v-if="btnJurisdiction.writeOff" @click="closeRows">销账</el-button>
                    <waitCancel @rows="rows" @account="accounts" :btnJurisdiction="btnJurisdiction" style="margin-top:20px" :tableData="tableData"></waitCancel>
                </el-tab-pane>
                <el-tab-pane label="已销账" name="1">
                    <aleradyAccount :tableData="tableData"></aleradyAccount>
                </el-tab-pane>
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
        <el-dialog title="设定记账月份" width="500px" :visible.sync="dialog" custom-class="customDialogTitle" @close="close">
            <div style="display:flex;justify-content:center;align-items:center">
                <span>
                    记账月份：
                </span>
                <div style="display:inline-block">
                    <el-select v-model="selectValue" clearable>
                        <el-option v-for="(item,idx) in month" :key="idx" :value="nowDates+'-'+item"></el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirm" type="primary">确定</el-button>
                <el-button @click="dialog=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import waitCancel from './waitCancel';
import aleradyAccount from './aleradyAccount'
import pagination from '@/views/components/pagination';
import { listOrderCollectMoneyUnsettledByPage, writeOffOrderCollectMoney } from 'api/FinanceCenter/creditManagement/cancelAccount/index'
export default {
    components:{
        breadcrumb,
        waitCancel,
        aleradyAccount,
        pagination
    },
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
    data(){
        return{
            navList:[],
            searchtext:'',
            selectValue:'',
            dialog:false,
            status:3,
            currentPage:1,
            pageSize:10,
            total:10,
            tableData:[],
            rowData:[],
            rowsData:[],
            month:[1,2,3,4,5,6,7,8,9,10,11,12],
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
            flag:0,
            show:false,
            text:"更多",
            btnJurisdiction:{
                writeOff:false
            }
        }
    },
    computed:{
        nowDates(){
            return new Date().getFullYear()
        }
    },
    methods: {
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
            this.btnJurisdiction.writeOff=JSON.parse(this.$loca.getItem('element'))["cancelAccount:btn_writeOff"];
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
                this.formList[i]=""
            }
            this.pages()
        },
        close(){
            this.selectValue="";
        },
        closeRows(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后再进行销账',
                    type: 'warning'
                });
            }else{
                this.dialog=true;
                this.flag=0;
            }
        },
        search(){
            this.currentPage=1;
            this.total=0;
            this.tableData=[];
            this.pages()
        },
        tabClick(val){
            this.total=0;
            this.currentPage=1;
            if(val.index==0){
                this.status=3;
            }else if(val.index==1){
                this.status=4;
            }
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
                    type:this.status
                }
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        confirm(){
            if(this.flag==1){
                if(this.selectValue){
                    writeOffOrderCollectMoney(
                        {
                            collectMoneyIdss:this.rowData.collectMoneyId,
                            accountingMonth:this.selectValue
                        }
                    ).then(res=>{
                        this.pages()
                        this.$message({
                            message: '销账成功',
                            type: 'success'
                        });
                        this.dialog=false;
                    })
                }else{
                    this.$message({
                        message: '请选择销账月份',
                        type: 'warning'
                    });
                }
                
            }else if(this.flag==0){
                if(this.selectValue){
                    let arr=[];
                    this.rowsData.map((item,idx)=>{
                        arr.push(item.collectMoneyId)
                    })
                    console.log(arr)
                    writeOffOrderCollectMoney(
                        {
                            collectMoneyIdss:arr.join(","),
                            accountingMonth:this.selectValue
                        }
                    ).then(res=>{
                        this.pages()
                        this.dialog=false;
                        this.$message({
                            message: '销账成功',
                            type: 'success'
                        });
                    })
                }else{
                    this.$message({
                        message: '请选择销账月份',
                        type: 'warning'
                    });
                }
                
            }
        },
        accounts(data){
            this.rowData=data;
            this.dialog=true;
            this.flag=1;
        },
        rows(val){
            this.rowsData=val;
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
    },
}
</script>
<style scoped>
.audit_btn{
    min-width: 120px;
    display: flex;
    flex-wrap: nowrap;
}

</style>

