<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="span"><el-input @keyup.enter.native="search" size="medium" placeholder="客户名称" clearable v-model="formList.userList"></el-input></el-col>
                    <el-col :span="span"><el-input @keyup.enter.native="search" size="medium" placeholder="客户电话" v-model="formList.userTel" clearable></el-input></el-col>
                    <el-col :span="span"><el-input @keyup.enter.native="search" size="medium" placeholder="账号" v-model="formList.accountNumber" clearable></el-input></el-col>
                    <el-col :span="span"><el-input @keyup.enter.native="search" size="medium" placeholder="订单号" v-model="formList.orderNum" clearable></el-input></el-col>
                    <div v-if="show">
                        <el-col :span="span"><el-input @keyup.enter.native="search" size="medium" placeholder="支出单号" v-model="formList.paymentNum" clearable></el-input></el-col>
                        <el-col :span="span">
                            <el-select @keyup.enter.native="search" size="medium" v-model="formList.isPrinting" clearable>
                                <el-option label="打印" value="1"></el-option>
                                <el-option label="不打印" value="0"></el-option>
                            </el-select>
                        </el-col>
                    </div>
                    <el-col :span="24" style="text-align:center">
                        <span @click="more">{{text}}</span>
                        <el-button size="medium" class="button-fc" @click="search">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                <!-- <el-tab-pane label="待提交" name="0">
                    <div>
                        <div class="clientcontent">
                        <div class="btn m-bottom10">
                            <el-button size="small" class="button-96" v-if="btnJurisdiction.create" @click="createList">创建支出单</el-button>
                            <el-button size="small" class="button-96" v-if="btnJurisdiction.delete" @click="deleteList">删除支出单</el-button>
                        </div>
                        </div>
                        <div  class="table_list">
                            <waitSubmit :btnJurisdiction="btnJurisdiction" :tableData="tableData" @eidtOrReady="eidtOrReady" @rows="choseRows"></waitSubmit>
                        </div>
                    </div>
                </el-tab-pane> -->
                <el-tab-pane label="已提交" name="0">
                    <onSubmit :btnJurisdiction="btnJurisdiction" :tableData="tableData" @eidtOrReady="eidtOrReady"></onSubmit>
                </el-tab-pane>
                <el-tab-pane label="已支付" name="1">
                    <havePaid :btnJurisdiction="btnJurisdiction" :tableData="tableData" @eidtOrReady="eidtOrReady"></havePaid>
                </el-tab-pane>
                <!-- <el-tab-pane label="已退回" name="3">
                    <div>
                        <div class="clientcontent">
                            <div class="btns m-bottom10">
                                <el-button size="small" class="button-96" v-if="btnJurisdiction.delete" @click="deleteList">删除支出单</el-button>
                                <el-button size="small" class="button-96" v-if="btnJurisdiction.submit" @click="resubmit">重新提交</el-button>
                            </div>
                        </div>
                        <haveReturn :btnJurisdiction="btnJurisdiction" :tableData="tableData" @eidtOrReady="eidtOrReady" @rows="choseRows"></haveReturn>
                    </div>
                </el-tab-pane> -->
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
        <el-dialog width="1200px" :visible.sync="dialog" >
            <div class="clearfix">
                <div>
                    <i class="icon"></i>
                    <span class="titles">支出单</span>
                </div>
            </div>
            <div style="border-bottom:1px solid #cccccc;padding-bottom:20px;">
                <ul class="dialogList clearfloat">
                    <li><span>支出单号：</span>{{paymentNumber}}</li>
                    <li><span>支出金额：</span>{{allMoney}}元</li>
                    <li><span>创建人：</span>{{createName}} {{createTime}}</li>
                </ul>
                <div style="text-align:right">共{{creatArr.length}}笔</div>
            </div>
            <div v-for="(item,idx) in creatArr" :key="idx">
                <div style="border-bottom:1px solid #cccccc;padding-bottom:20px;margin-top:20px">
                    <!-- <div class="titlecals"><span></span><span class="fr">删除</span></div> -->
                    <div class="clearfix">
                        <div style="float:left">
                            <i class="icon"></i>
                            <span class="titles">退款号：{{item.refundNumber}}</span>
                        </div>
                        <el-button v-if="isEdit" class="fr button-96" size="small" @click="deleteRows(item)">删除</el-button>
                    </div>
                    <ul class="dialogMessage clearfloat">
                        <li><span style="width:120px;display:inline-block;text-align:right">客户名称：</span>{{item.customerName}}</li>
                        <li><span style="width:120px;display:inline-block;text-align:right">联系电话：</span>{{item.customerPhone}}</li>
                        <li><span style="width:120px;display:inline-block;text-align:right">退款方式：</span>{{item.refundModeName}}</li>
                        <li><span style="width:120px;display:inline-block;text-align:right">开户名：</span>{{item.accountName}}</li>
                        <li><span style="width:120px;display:inline-block;text-align:right">退款银行：</span>{{item.affiliatedBank}}</li>
                        <li style="position:relative;"><span style="width:120px;display:inline-block;text-align:right">退款账号：</span>{{item.bankCardNumber}}
                        <el-button v-if="isEdit" style="position:absolute;right:0;top:9px;" class="button-96" size="small" @click="changeBank(item,idx)">变更</el-button></li>
                        <li><span style="width:120px;display:inline-block;text-align:right">退款金额：</span>{{item.refundAmount}}元</li>
                    </ul>
                </div>
                <div>
                    <ul class="isNo clearfloat">
                        <li><span>是否已开发票：</span>{{item.isBill==0?"不开":"开"}}</li>
                        <li><span>是否已归还发票：</span>{{item.refundBill==0?"否":"是"}}</li>
                    </ul>
                </div>
            </div>
            <span slot="footer" class="dialog-footer" v-if="isEdit">
                <el-button type="primary" @click="saveList">保存</el-button>
                <el-button type="primary" @click="subList">提 交</el-button>
                <el-button type="primary" @click="dialog = false">打 印</el-button>
                <el-button @click="dialog=false">取 消</el-button>
            </span>
            <span slot="footer" class="dialog-footer" v-else>
                <el-button @click="dialog=false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="bankDialog" title="选择银行" custom-class="customDialogTitle">
            <el-table :data="bankTable" border :row-class-name="tableRowClassName" @selection-change="selectBank">
                <el-table-column align="center" type="selection"></el-table-column>
                <el-table-column align="center" prop="accountName" label="开户名"></el-table-column>
                <el-table-column align="center" prop="affiliatedBank" label="开户行"></el-table-column>
                <el-table-column align="center" prop="bankCardNumber" label="银行账号"></el-table-column>
            </el-table>
            <div class="pagination_wrap">
                <pagination
                    :current-page="bankParams.page"
                    :pageSize="bankParams.limit"
                    :total="bankTotal"
                    @sizeChange="bankLimit"
                    @currentChange="bankChange">
                </pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bankConfirm" type="primary">确定</el-button>
                <el-button @click="bankDialog=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import waitSubmit from './waitSubmit'
import onSubmit from './onSubmit'
import havePaid from './havePaid'
import haveReturn from './haveReturn';
import pagination from "@/views/components/pagination";
import { listOrderPaymentByPage,getOrderPayment, editPayment, commitOrderPayment,deleteOrderPayment } from '@/api/paymentManagement/paymentList/index'
import { listCompanyBankAccountByPage } from 'api/paymentManagement/waitPayList/index' 
export default {
    components:{
        pagination,
        breadcrumb,
        waitSubmit,
        onSubmit,
        havePaid,
        haveReturn
    },
    data(){
        return{
            show:false,
            text:'更多',
            span:6,
            sel:'',
            currentPage:1,
            pageSize:10,
            total:10,
            dialog:false,
            bankDialog:false,
            searchtext:'',
            names:'',
            navList:[],
            formList:{
                userList:'',
                userTel:'',
                accountNumber:'',
                orderNum:'',
                paymentNum:'',
                isPrinting:'',
            },
            tableData:[],
            status:1,
            creatArr:[],
            isEdit:true,
            allMoney:0,
            paymentFrequency:0,
            createName:'',
            createTime:'',
            paymentNumber:'',
            orderPaymentId:"",
            paymentType:'',
            rowsData:[],
            bankParams:{
                page:1,
                limit:10,
                customerId:""
            },
            bankRows:[],
            idx:"",
            bankTotal:10,
            bankTable:[],
            btnJurisdiction:{
                delete:false,
                create:false,
                submit:false,
                edit:false,
                print:false
            }
        }
    },
    // mounted() {
    //     // 头部面包屑
    //     this.navList = this.$route.meta;
    //     this.pages()
    //     this.btnInit()
    // },
    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        this.pages()
        this.btnInit()
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    computed: {
        payMoneyAll(){
            let num=0;
            this.creatArr.map((item,idx)=>{
                num+=Number(item.refundAmount)
            });
            return num
        }
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["paymentList:btn_delete"];
            this.btnJurisdiction.create=JSON.parse(this.$loca.getItem('element'))["waitPayList:btn_create"];
            this.btnJurisdiction.submit=JSON.parse(this.$loca.getItem('element'))["paymentList:btn_sub"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["paymentList:btn_edit"];
            this.btnJurisdiction.print=JSON.parse(this.$loca.getItem('element'))["btn:print"];
        },
        more(){
            this.show=!this.show;
            this.text=this.show?"收起":"更多"
        },
        search(){
            this.currentPage=1;
            this.pages()
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
        selectBank(val){
            this.bankRows=val;
        },
        bankConfirm(){
            if(this.bankRows.length==0){
                this.$message({
                    message: '请选择',
                    type: 'warning'
                });
            }else if(this.bankRows.length>1){
                this.$message({
                    message: '只可选择一条',
                    type: 'warning'
                });
            }else{
                this.creatArr[this.idx].accountName=this.bankRows[0].accountName;
                this.creatArr[this.idx].affiliatedBank=this.bankRows[0].affiliatedBank;
                this.creatArr[this.idx].bankCardNumber=this.bankRows[0].bankCardNumber;
                this.creatArr[this.idx].customerBankCardId=this.bankRows[0].customerBankCardId;
                this.bankDialog=false;
            }
        },
        changeBank(val,idx){
            this.idx=idx;
            this.bankParams.customerId=val.customerId;
            this.bankPages()
            this.bankDialog=true;
        },
        bankPages(){
            listCompanyBankAccountByPage(this.bankParams).then(res=>{
                this.bankTable=res.data.rows;
                this.bankTotal=res.data.total;
            })
        },
        bankLimit(val){
            this.bankParams.page=1;
            this.bankParams.limit=val;
            this.bankPages()
        },
        bankChange(val){
            this.bankParams.page=val;
            this.bankPages()
        },
        resubmit(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后再进行操作',
                    type: 'warning'
                });
            }else{
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    console.log(item)
                    arr.push(item.orderPaymentId)  
                })
                commitOrderPayment(
                    {
                        orderPaymentIds:arr.join(",")
                    }
                ).then(res=>{
                    this.pages()
                })
            }
        },
        choseRows(val){
            this.rowsData=val;
        },
        deleteList(){
            this.deleteMethods()
        },
        eidtOrReady(val){
            console.log(val)
            this.dialog=true;
            this.isEdit=val[1];
            getOrderPayment(
                {
                    orderPaymentId:val[0].orderPaymentId
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
        createList(){
            this.$router.push({
                path:'waitPayList'
            })
        },
        tabClick(val){
            this.tableData=[];
            this.status=Number(val.index)+1;
            this.pages()
        },
        deleteMethods(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后再进行操作',
                    type: 'warning'
                });
            }else{
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr=[];
                    this.rowsData.map((item,idx)=>{
                        console.log(item)
                        arr.push(item.orderPaymentId)  
                    })
                    deleteOrderPayment(
                        {
                            orderPaymentIds:arr.join(",")
                        }
                    ).then(res=>{
                        this.pages();
                        this.dialog=false;
                        this.rowsData=[];
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
                
            }
        },
        deleteRows(){
            deleteOrderPayment(
                {
                    orderPaymentIds:this.orderPaymentId
                }
            ).then(res=>{
                this.pages();
                 this.dialog=false;
            })
        },
        saveList(){
            this.editQuery(0)
        },
        subList(){
            this.editQuery(1)
        },
        editQuery(status){
            let arr=[]
            this.creatArr.map((item,idx)=>{
                arr.push(item.orderRefundId)
            })
            editPayment(
                {
                    orderPaymentId:this.orderPaymentId,
                    refundIds:arr.join(","),
                    status:status,
                    paymentType:this.paymentType,
                    paymentMoney:this.allMoney,
                    isPrinting:this.isPrinting,
                    customerBankCardId:this.creatArr[0].customerBankCardId,
                }
            ).then(res=>{
                this.dialog=false;
            })
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
.orderinp{
    max-width: 420px;
}
.querybox{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
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
.clearfix>div{
    display: flex;
    align-items: center;
}
</style>