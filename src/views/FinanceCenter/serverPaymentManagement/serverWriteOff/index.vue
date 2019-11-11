<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="span"><el-input size="medium" clearable placeholder="客户名称" v-model="formList.userList"></el-input></el-col>
                    <el-col :span="span"><el-input size="medium" clearable placeholder="客户电话" v-model="formList.userTel"></el-input></el-col>
                    <el-col :span="span"><el-input size="medium" clearable placeholder="账号" v-model="formList.accountNumber"></el-input></el-col>
                    <el-col :span="span"><el-input size="medium" clearable placeholder="订单号" v-model="formList.orderNum"></el-input></el-col>
                    <el-col :span="span"><el-input size="medium" clearable placeholder="支出单号" v-model="formList.paymentNum"></el-input></el-col>
                    <el-col :span="span" style="text-align:center">
                        <el-button size="medium" class="button-fc" type="warning" @click="searchTable">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div>
            <el-tabs type="border-card" @tab-click="tabClick">
                    <el-tab-pane label="待销账" name="0" >
                        <el-button class="button-96" size="small" v-if="btnJurisdiction.writeOff" @click="writeOffClick">销账</el-button>
                        <waitCancel :btnJurisdiction="btnJurisdiction" @selectRows="selectRows" style="margin-top:20px" :tableData="tableData" @showDialog="showDialog" @dialogs="dialogs"></waitCancel>
                    </el-tab-pane>
                    <el-tab-pane label="已销账" name="1">
                        <aleradyAccount :tableData="tableData" @showDialog="showDialog" :btnJurisdiction="btnJurisdiction"></aleradyAccount>
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
        <el-dialog width="1200px" :visible.sync="payDialog" custom-class="customDialogTitle" title="支出单">
            <!-- <div class="clearfix">
                <div>
                    <i class="icon"></i>
                    <span class="titles">支出单</span>
                </div>
            </div> -->
            <div style="border-bottom:1px solid #cccccc;padding-bottom:20px;">
                <ul class="dialogList clearfloat">
                    <li><span>支出单号：</span>{{paymentNumber}}</li>
                    <li><span>支出金额：</span>{{allMoney}}元</li>
                    <li><span>创建人：</span>{{createName}}</li>
                </ul>
                <div style="text-align:right">共{{creatArr.length}}笔</div>
            </div>
            <div v-for="(item,idx) in creatArr" :key="idx">
                <div style="border-bottom:1px solid #cccccc;padding-bottom:20px;margin-top:20px" >
                    <div class="clearfix">
                        <div style="float:left">
                            <i class="icon"></i>
                            <span class="titles">退款号：{{item.paymentNumber}}</span>
                        </div>
                        <!-- <el-button  class="fr button-96" size="small" v-if="onlyRead">删除</el-button> -->
                    </div>
                    <ul class="dialogMessage clearfloat">
                        <li><span>客户名称：</span>{{item.customerName}}</li>
                        <li><span>联系电话：</span>{{item.customerPhone}}</li>
                        <li><span>退款方式：</span>{{item.refundModeName}}</li>
                        <li><span>开户名：</span>{{item.accountName}}</li>
                        <li><span>退款银行：</span>{{item.affiliatedBank}}</li>
                        <li style="position:relative;"><span>退款账号：</span>{{item.bankCardNumber}}
                        <!-- <el-button style="position:absolute;right:0;top:9px;" class="button-96" size="small" v-if="onlyRead" @click="changeBank(item,idx)">变更</li> -->
                        <li><span>退款金额：</span>{{item.refundAmount}}元</li>
                    </ul>
                </div>
                <div>
                    <ul class="isNo clearfloat">
                        <li><span>是否已开发票：</span>{{item.isBill==0?"不开":"开"}}</li>
                        <li><span>是否已归还发票：</span>{{item.refundBill==0?"否":"是"}}</li>
                    </ul>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button :loading="confirmLoading" type="primary" v-if="onlyRead" @click="confirm">确认</el-button> -->
                <el-button @click="payDialog=false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="设定记账月份" width="500px" :visible.sync="dialog" custom-class="customDialogTitle">
            <div style="display:flex;justify-content:center;align-items:center">
                <span>
                    记账月份：
                </span>
                <div style="display:inline-block">
                    <el-date-picker
                        v-model="selectDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月">
                    </el-date-picker>
                    <!-- <el-select v-model="selectDate" clearable>
                        <el-option v-for="(item,idx) in month" :key="idx" :value="nowDates+'-'+item"></el-option>
                    </el-select> -->
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="confirmLoading" @click="confirm" type="primary">确定</el-button>
                <el-button @click="dialog=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../../components/breadcrumb";
import waitCancel from './waitCancel';
import aleradyAccount from './aleradyAccount';
import pagination from '../../../components/pagination';
import { listOrderPaymentByPage, writeOffOrderPayment } from '@/api/FinanceCenter/serverPaymentManagement/serverWriteOff';
import {getOrderPayment} from '@/api/FinanceCenter/serverPaymentManagement/serverSpendingConfirm/index'
export default {
    components:{
        breadcrumb,
        waitCancel,
        aleradyAccount,
        pagination
    },
    activated(){
        this.btnInit()
        this.navList = this.$route.meta;
        this.pages()
        var currTime = new Date();
        var year = currTime.getFullYear();     //获取当前时间的年份
        var month = currTime.getMonth() + 1;   //获取当前时间的月份，月份从0开始，所以需要加一
        this.selectDate=year + '-' + month;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    //     this.pages()
    //     var currTime = new Date();
    //     var year = currTime.getFullYear();     //获取当前时间的年份
    //     var month = currTime.getMonth() + 1;   //获取当前时间的月份，月份从0开始，所以需要加一
    //     this.selectDate=year + '-' + month;
    // },
    data(){
        return{
            show:false,
            text:'更多',
            navList:[],
            searchtext:'',
            dialog:false,
            confirmLoading:false,
            span:4,
            currentPage:1,
            pageSize:10,
            total:10,
            tableData:[],
            formList:{
                userList:'',
                userTel:'',
                accountNumber:'',
                orderNum:'',
                paymentNum:'',
            },
            status:2,
            rowsData:[],
            rowData:{},
            month:[1,2,3,4,5,6,7,8,9,10,11,12],
            selectDate:new Date(),
            flag:0,
            btnJurisdiction:{
                writeOff:false
            },
            payDialog:false,
            paymentNumber:'',
            paymentMoney:'',
            createName:'',
            creatArr:[],
            paymentFrequency:'',
            createTime:'',
            paymentType:'',
            bankRows:[],
            bankParams:{
                page:1,
                limit:10,
                customerId:""
            },
            bankTotal:'',
            allMoney:'',
            onlyRead:null
        }
    },
    computed:{
        nowDates(){
            return new Date().getFullYear()
        }
    },
    methods: {
        showDialog(val){
            this.payDialog=true;
            getOrderPayment(
                {
                    orderPaymentId:val.orderPaymentId
                }
            ).then(res=>{
                this.creatArr=res.data.orderRefundVOS;
                this.allMoney=res.data.paymentMoney;
                this.paymentFrequency=res.data.paymentFrequency;
                this.createName=res.data.createName;
                this.createTime=res.data.createTime;
                this.paymentNumber=res.data.paymentNumber;
                this.orderPaymentId=res.data.orderPaymentId;
                this.paymentType=res.data.paymentType;
            })
        },
        btnInit(){
            this.btnJurisdiction.writeOff=JSON.parse(this.$loca.getItem('element'))["serverWriteOff:btn_writeOff"];
        },
        more(){
            this.show=!this.show;
            this.text=this.show?"收起":"更多";
        },
        reset(){
            this.currentPage=1;
            for(let i in this.formList){
                this.formList[i]="";
            }
            this.pages()
        },
        writeOffClick(){//销账按钮
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后在进行操作',
                    type: 'warning'
                });
            }else if(this.rowsData.length>0){
                this.dialog=true;
                this.flag=1
            }
        },
        pages(){
            this.tableData=[]
            listOrderPaymentByPage(
                {
                    customerName:this.formList.userList,
                    customerPhone:this.formList.userTel,
                    orderNumber:this.formList.orderNum,
                    bankCardNumber:this.formList.accountNumber,
                    status:this.status,
                    limit:this.pageSize,
                    page:this.currentPage,
                }
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total
            })
        },
        confirm(){ //销账确认按钮
            if(this.flag==1){
                
                if(this.selectDate){
                    this.confirmLoading=true;
                    let arr=[];
                    this.rowsData.map((item,idx)=>{
                        arr.push(item.orderPaymentId)
                    })
                    writeOffOrderPayment(
                        {
                            orderPaymentIds:arr.join(","),
                            sellMonth:this.selectDate,
                        }
                    ).then(res=>{
                        this.confirmLoading=false;
                        this.dialog=false;
                        this.pages();
                        this.rowData=null;
                    })
                }else{
                    this.$message({
                        message: '请选择销账日期',
                        type: 'warning'
                    });
                }
                
            }else{
                if(this.selectDate){
                    writeOffOrderPayment(
                        {
                            orderPaymentIds:this.rowData.orderPaymentId,
                            sellMonth:this.selectDate,
                        }
                    ).then(res=>{
                        this.dialog=false;
                        this.pages();
                        this.rowsData=[];
                    })
                }else{
                    this.$message({
                        message: '请选择销账日期',
                        type: 'warning'
                    });
                }
                
            }
        },
        dialogs(val){//子组件传值
            this.dialog=true;
            this.flag=0;
            this.rowData=val
        },
        selectRows(val){//子组件传值
            this.rowsData=val;
            this.flag=0;
        },
        searchTable(){//查询按钮
            this.currentPage=1;
            this.pages()
        },
        currentChange(val) {//换页
            this.currentPage = val;
            this.pages()
        },
        sizeChange(val) {//选择pageSize
            this.currentPage = 1;
            this.pageSize = val;
            this.pages()
        },
        tabClick(val){//tabs切换
            this.tableData=[];
            if(val.index==0){
                this.status=2;
            }else if(val.index==1){
                this.status=5;
            }
            
            this.pages()
        },
    },
}
</script>
<style scoped>
.isNo{
    width: 100%;
    margin-top:20px;
}
.isNo>li{
    float: left;
    width: 33.5%;
}
.isNo>li>span{
    display: inline-block;
    text-align: right;
    width:120px;
}
.clearfix>div{
    display: flex;
    align-items: center;
}
.icon{
    display: inline-block;
    width: 4px;
    height: 20px;
    background: #006ec6;
    margin-right: 15px;
    /* border-radius: 3px; */
    font-size: 18px;
}
.titles{
    font-size: 18px;
    color:#006ec6;
}
.dialogMessage{
    width: 100%;
}
.dialogMessage>li{
    width: 33.3%;
    float: left;;
    height: 50px;
    line-height: 50px;
}
.dialogMessage>li>span{
    text-align: right;
    display: inline-block;
    width:120px;;
}
.dialogList{
    width: 100%;
    
}
.dialogList>li>span{
    text-align: right;
    display: inline-block;
    width: 120px;;
}
.dialogList>li{
    width: 33.3%;
    float: left;;
    height: 50px;
    line-height: 50px;
}
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
</style>

