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
                    <el-col  :span="span"><el-input size="medium" clearable placeholder="支出单号" v-model="formList.paymentNum"></el-input></el-col>
                    <el-col :span="span" style="text-align:center">
                        <el-button size="medium" class="button-fc" type="warning" @click="searchTable">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <!-- 待支付已支付表格 -->
        <div>
            <el-tabs type="border-card" @tab-click="tabClick">
                    <el-tab-pane label="待支付" name="0">
                        <el-button class="button-96" size="small" v-if="btnJurisdiction.pay" :loading="confirmPayLoading" @click="comfirmPay">确认支付</el-button>
                        <!-- <el-button class="button-96" size="small" v-if="btnJurisdiction.goBack" @click="goBackList">退回</el-button> -->
                        <waitCancel :btnJurisdiction="btnJurisdiction" class="m-top20" :tableData="tableData" @showDialogs="dialogs" @rowsData="rowsChange"></waitCancel>
                    </el-tab-pane>
                    <el-tab-pane label="已支付" name="1">
                        <el-button class="button-96" size="small" v-if="btnJurisdiction.goBack" @click="goBackAll">退回</el-button>
                        <aleradyAccount class="m-top20" @selectRows="goBackRows" @goBack="showGoBackDialog" :btnJurisdiction="btnJurisdiction" @showDialogs="dialogs" :tableData="tableData"></aleradyAccount>
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
        <!-- 支出详情 -->
        <el-dialog width="1200px" :visible.sync="dialog" custom-class="customDialogTitle" title="支出单" @closed="closed">
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
                            <span class="titles">退款号：{{item.applyCode}}</span>
                        </div>
                        <!-- <el-button  class="fr button-96" size="small" v-if="onlyRead">删除</el-button> -->
                    </div>
                    <ul class="dialogMessage clearfloat">
                        <li>
                            <span style="width:120px;display:inline-block;text-align:right">客户名称：</span>
                            {{item.customerName}}
                        </li>
                        <li>
                            <span style="width:120px;display:inline-block;text-align:right">联系电话：</span>
                            {{item.customerPhone}}
                        </li>
                        <li>
                            <span style="width:120px;display:inline-block;text-align:right">退款金额：</span>
                            {{item.refundMoney}}元
                        </li>
                        <li><span style="width:120px;display:inline-block;text-align:right">开户名：</span>
                            <a v-if="bankText=='编辑'">
                                {{item.accountName}}
                            </a>
                            <div v-else style="width:calc(100% - 120px)">
                                <el-input  size="medium" placeholder="请输入开户名" v-model="item.accountName"></el-input>
                            </div>
                        </li>
                        <li><span style="width:120px;display:inline-block;text-align:right">退款银行：</span>
                            <a v-if="bankText=='编辑'">
                                {{item.affiliatedBank}}
                            </a>
                            <div v-else style="width:217px">
                                <el-input  size="medium" placeholder="请输入退款银行" v-model="item.affiliatedBank"></el-input>
                            </div>
                        </li>
                        <li style="position:relative;"><span style="width:120px;display:inline-block;text-align:right">退款账号：</span>
                            <a v-if="bankText=='编辑'">
                                {{item.bankCardNumber}}
                            </a>
                            <div v-else style="width:217px">
                                <el-input  size="medium" placeholder="请输入退款账号" v-model="item.bankCardNumber"></el-input>
                            </div>
                            <el-button style="position:absolute;right:-60px;top:9px;" class="button-96" size="small" @click="changeBank(item,idx)">{{bankText}}</el-button>
                        </li>                   
                        <li>
                            <span style="width:120px;display:inline-block;text-align:right">退款方式：</span>{{item.paymentTypeName}}
                        </li>
                        <li>
                            <span style="width:120px;display:inline-block;text-align:right">支付账号：</span>
                            <el-select v-model="item.paymentBackCardId" size="medium">
                                <el-option v-for="(item,idx) in bankCardArr" :key="idx" :label="item.openingBankName+'||'+item.accountName+'||'+item.bankCardNumber" :value="item.bankAccountId">
                                </el-option>
                            </el-select>
                        </li>
                        <li><span style="width:120px;display:inline-block;text-align:right">支出时间：</span>
                            <el-date-picker
                                size="medium"
                                v-model="item.time"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="请选择支出时间">
                            </el-date-picker>
                        </li>
                    </ul>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="confirmLoading" type="primary" v-if="onlyRead" @click="confirm">确认</el-button>
                <el-button @click="dialog=false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 退回原因 -->
        <el-dialog :visible.sync="visible" custom-class="customDialogTitle" title="退回原因" @closed="closed">
            <el-input type="textarea" placeholder="请输入" v-model="returnReason"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="goBackLoading" @click="goBackMethod">确认</el-button>
                <el-button @click="visible=false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 批量支付 -->
        <el-dialog :visible.sync="allPayDialog" custom-class="customDialogTitle" title="退回原因" @closed="closed">
            <div>
                <span style="width:120px;display:inline-block;text-align:right">支付账号：</span>
                <el-select v-model="paymentBackCardId" size="medium">
                    <el-option v-for="(item,idx) in bankCardArr" :key="idx" :label="item.openingBankName+'||'+item.accountName+'||'+item.bankCardNumber" :value="item.bankAccountId">
                    </el-option>
                </el-select>
            </div> 
            <div>
                <span style="width:120px;display:inline-block;text-align:right">支出时间：</span>
                <el-date-picker
                    size="medium"
                    v-model="time"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择支出时间">
                </el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="confirmLoading" type="primary" @click="confirm">确认</el-button>
                <el-button @click="allPayDialog=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import waitCancel from './waitCancel';
import aleradyAccount from './aleradyAccount';
import pagination from '@/views/components/pagination';
import { listOrderPaymentByPage, paymentOrderPayment, returnOrderPayment,getOrderPayment,updateCustomerBankCard} from '@/api/FinanceCenter/serverPaymentManagement/serverSpendingConfirm/index';
import { listCustomerBankCardByCustomerId } from 'api/paymentManagement/waitPayList/index';
import { listCompanyBankAccount } from '@/api/receivablesrun/clientcollection/index'
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
        listCompanyBankAccount().then(res=>{
            this.bankCardArr=res.data;
        })
        var currTime = new Date();
        var year = currTime.getFullYear();     //获取当前时间的年份
        var month = currTime.getMonth() + 1;   //获取当前时间的月份，月份从0开始，所以需要加一
        var day = currTime.getDate();          //获取当前时间的日期
        var hour = currTime.getHours();        //获取当前时间的小时数
        var minute = currTime.getMinutes();    //获取当前时间的分钟数
        var second = currTime.getSeconds();    //获取当前时间的秒数
        this.time=year + '-' + month + '-' + day +' '+ hour + ':' + minute + ':' + second;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    //     this.pages()
    //     listCompanyBankAccount().then(res=>{
    //         this.bankCardArr=res.data;
    //     })
    //     var currTime = new Date();
    //     var year = currTime.getFullYear();     //获取当前时间的年份
    //     var month = currTime.getMonth() + 1;   //获取当前时间的月份，月份从0开始，所以需要加一
    //     var day = currTime.getDate();          //获取当前时间的日期
    //     var hour = currTime.getHours();        //获取当前时间的小时数
    //     var minute = currTime.getMinutes();    //获取当前时间的分钟数
    //     var second = currTime.getSeconds();    //获取当前时间的秒数
    //     this.time=year + '-' + month + '-' + day +' '+ hour + ':' + minute + ':' + second;

    // },
    data(){
        return{
            show:false,
            confirmPayLoading:false,
            confirmLoading:false,
            goBackLoading:false,
            text:"更多",
            bankText:'编辑',
            navList:[],
            searchtext:'',
            dialog:false,
            span:4,
            visible:false,
            allPayDialog:false,
            datePicker:'',
            currentPage:1,
            pageSize:10,
            total:10,
            tableData:[],
            payDetails:false,
            bankDialog:false,
            bankTable:[],
            formList:{
                userList:'',
                userTel:'',
                accountNumber:'',
                orderNum:'',
                paymentNum:'',
            },
            status:1,
            rowsData:[],
            goBackRowsData:[],
            returnReason:'',
            changeData:[],
            btnJurisdiction:{
                pay:false,
                goBack:false
            },
            paymentNumber:'',
            paymentMoney:'',
            createName:'',
            creatArr:[
                {
                    customerName:'',
                    customerPhone:'',
                    refundMoney:'',
                    accountName:'',
                    affiliatedBank:'',
                    bankCardNumber:'',
                    paymentTypeName:'',
                    paymentBackCardId:'',
                    time:'',
                    customerBankCardId:'',
                    storeCustomerId:'',
                    applyCode:'',
                    customerId:'',
                    openingBank:''
                }
            ],
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
            onlyRead:null,
            payStatus:1,
            rowData:{},
            customerBankCardId:null,
            bankCardArr:[],
            paymentBackCardId:'',
            time:'',
            storeCustomerId:'',
            goBackRowData:{},
            goBackStatus:1
        }
    },
    methods: {
        //批量获取值
        goBackRows(val){
            this.goBackRowsData=val;
        },
        //批量退回
        goBackAll(){
            if(this.goBackRowsData.length){
                this.visible=true;
                this.goBackStatus=1;
            }else{
                this.$message({
                    message: '请选择后再进行退回操作',
                    type: 'warning'
                });
            }
        },
        //单项退回
        showGoBackDialog(val){
            this.visible=true;
            this.goBackStatus=2;
            this.goBackRowData=val;
        },
        //退回接口
        goBackMethod(val){
            if(this.goBackStatus==1){
                let arr=[];
                this.goBackRowsData.map((item,idx)=>{
                    arr.push(item.orderPaymentId)
                })
                this.returnOrderPayment(arr.join(","))
            }else if(this.goBackStatus==2){
                this.returnOrderPayment(this.goBackRowData.orderPaymentId)
            }
        },
        returnOrderPayment(val){
            this.goBackLoading=true;
            returnOrderPayment({
                orderPaymentIds:val,
                returnReason:this.returnReason,
            }).then(res=>{
                this.pages()
                this.$message({
                    message: '退回成功',
                    type: 'success'
                });
                this.visible=false;
                this.goBackLoading=false;
            })
        },
        //支出单详情弹窗关闭回调
        closed(){
            this.bankText="编辑";
            this.returnReason='';
        },
        changeBank(val,idx){
            this.idx=idx;
            this.bankText=this.bankText=="编辑"?"保存":"编辑";
            if(this.bankText=="编辑"){
                if(val.accountName&&val.affiliatedBank&&val.bankCardNumber){
                    updateCustomerBankCard({
                        accountName: val.accountName,
                        bankCardNumber: val.bankCardNumber,
                        customerBankCardIds: [this.customerBankCardId],
                        customerId: val.customerId,
                        isDefault: 0,
                        openingBank: val.openingBank,
                        storeCustomerId: this.storeCustomerId,
                        affiliatedBank:val.affiliatedBank
                    }).then(res=>{
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        this.bankText="编辑";
                    })
                }else{
                    this.$message({
                        message: '请填写完银行信息',
                        type: 'warning'
                    });
                    this.bankText="保存";
                }
            }
            // this.bankPages()
            // this.bankDialog=true;
        },
        selectBank(val){
            this.bankRows=val;
        },
        //按钮权限
        btnInit(){
            this.btnJurisdiction.pay=JSON.parse(this.$loca.getItem('element'))["serverSpendingConfirm:btn_pay"];
            this.btnJurisdiction.goBack=JSON.parse(this.$loca.getItem('element'))["serverSpendingConfirm:btn_goBack"];
        },
        more(){
            this.show=!this.show;
            this.text=this.show?"收起":"更多";
        },
        rowsChange(val){
            this.rowsData=val;
            this.goBackRowsData=val;
        },
        close(){
            this.returnReason="";
        },
        reset(){
            this.currentPage=1;
            for(let i in this.formList){
                this.formList[i]="";
            }
            this.pages()
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        dialogs(val,idx){
            this.onlyRead=idx;
            this.dialog=true;
            this.payStatus=2;
            this.rowData=val;
            // this.rowsData=[val];
            getOrderPayment(
                {
                    orderPaymentId:val.orderPaymentId
                }
            ).then(res=>{
                var currTime = new Date();
                var year = currTime.getFullYear();     //获取当前时间的年份
                var month = currTime.getMonth() + 1;   //获取当前时间的月份，月份从0开始，所以需要加一
                var day = currTime.getDate();          //获取当前时间的日期
                var hour = currTime.getHours();        //获取当前时间的小时数
                var minute = currTime.getMinutes();    //获取当前时间的分钟数
                var second = currTime.getSeconds();    //获取当前时间的秒数
                for(let i in this.creatArr[0]){
                    this.creatArr[0][i]=res.data[i]
                }
                this.creatArr[0].time=year + '-' + month + '-' + day +' '+ hour + ':' + minute + ':' + second;
                this.allMoney=res.data.paymentMoney;
                this.paymentFrequency=res.data.paymentFrequency;
                this.createName=res.data.createName;
                this.createTime=res.data.createTime;
                this.paymentNumber=res.data.paymentNumber;
                this.orderPaymentId=res.data.orderPaymentId;
                this.paymentType=res.data.paymentType;
                this.customerBankCardId=res.data.customerBankCardId;
                this.storeCustomerId=res.data.storeCustomerId;
            })
        },
        searchTable(){
            this.pages()
        },
        tabClick(val){
            this.tableData=[];
            if(val.index==0){
                this.status=1;
            }else if(val.index==1){
                this.status=2;
            }
            this.pages()
        },
        comfirmPay(){
            if(this.rowsData.length==0){
                 this.$message({
                    message: '请选择后再进行操作',
                    type: 'warning'
                });
            }else if(this.rowsData.length){
                this.allPayDialog=true;
                this.payStatus=1;
            }
        },
        confirm(){
            this.payQuery()
        },
        paymentMethods(val){
            if((this.paymentBackCardId&&this.time)||(this.creatArr[0].paymentBackCardId&&this.creatArr[0].time)){
                this.confirmLoading=true;
                paymentOrderPayment(
                    {
                        orderPaymentPayDTOS:val
                    }
                ).then(res=>{
                    this.dialog=false;
                    this.confirmLoading=false;
                    this.allPayDialog=false;
                    this.rowsData=[];
                    this.paymentBackCardId="";
                    this.time="";
                    this.creatArr[0].paymentBackCardId="";
                    this.creatArr[0].time="";
                    this.pages()
                    this.$message({
                        message: '支付成功',
                        type: 'success'
                    });
                })
            }else{
                this.$message({
                    message: '请填写完支付账号和支出时间',
                    type: 'warning'
                });
            }
            
        },
        payQuery(){
            if(this.payStatus==1){//批量
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    let obj={
                        orderPaymentId:item.orderPaymentId,
                        time:this.time,
                        paymentBackCardId:this.paymentBackCardId
                    }
                    arr.push(obj)
                })
                this.paymentMethods(arr)
            }else if(this.payStatus==2){//单个
                // console.log(this.rowData)
                let arr=[];
                this.creatArr.map((item,idx)=>{
                    let obj={
                        orderPaymentId:this.rowData.orderPaymentId,
                        time:item.time,
                        paymentBackCardId:item.paymentBackCardId
                    }
                    arr.push(obj)
                })
                this.paymentMethods(arr)
            }
        },
        pages(){
            listOrderPaymentByPage(
                {
                    customerName:this.formList.userList,
                    customerPhone:this.formList.userTel,
                    orderNumber:this.formList.orderNum,
                    bankCardNumber:this.formList.accountNumber,
                    isPrinting:this.formList.isPrinting,
                    status:this.status,
                    limit:this.pageSize,
                    page:this.currentPage,
                }
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total
            })
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
    display: flex;
}
.dialogMessage>li:nth-of-type(3n+1){
    width: 28%;
    float: left;;
    height: 50px;
    line-height: 50px;
}
.dialogMessage>li:nth-of-type(3n+3){
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

