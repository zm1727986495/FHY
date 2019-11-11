<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="span"><el-input @keyup.enter.native="searchBtn" size="medium" clearable placeholder="客户名称" v-model="formList.userList"></el-input></el-col>
                    <el-col :span="span"><el-input @keyup.enter.native="searchBtn" size="medium" clearable placeholder="客户电话" v-model="formList.userTel"></el-input></el-col>
                    <el-col :span="span"><el-input @keyup.enter.native="searchBtn" size="medium" clearable placeholder="账号" v-model="formList.accountNumber"></el-input></el-col>
                    <el-col :span="span"><el-input @keyup.enter.native="searchBtn" size="medium" clearable placeholder="订单号" v-model="formList.orderNum"></el-input></el-col>
                    <el-col :span="span" v-if="show">
                        <el-select @keyup.enter.native="searchBtn" size="medium" clearable v-model="formList.selectId">
                            <el-option v-for="(item,idx) in selectArr" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="24" style="text-align:center">
                        <span @click="more">{{text}}</span>
                        <el-button size="medium" class="button-fc" @click="searchBtn">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-card>
                <div>
                    <!-- <el-button size="small" class="button-96" v-if="create" @click="creat">创建支出单</el-button> -->
                </div>
                <div class="m-top20">
                    <el-table
                    :data="tableData"
                    style="width: 100%;"
                    border
                    @select="selectChange"
                    :row-class-name="tableRowClassName"
                    @row-click="rowClick"
                    ref="table"
                    class="topicTable">
                        <el-table-column
                        prop="applyCode"
                        align="center"
                        label="退款号"
                        width="180"
                        fixed
                        >
                        <!-- <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="rowCreat(scope.row)">创建支出单</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <p class="operation">{{scope.row.applyCode}}</p>
                            </div>
                        </template> -->
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="orderNumber"
                        label="订单号">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="applyStatus"
                        label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.applyStatus==0">待审核</span>
                            <span v-if="scope.row.applyStatus==1">
                                <span v-if="scope.row.paymentStatus==0">
                                    审核通过待支付
                                </span>
                                <span v-if="scope.row.paymentStatus==1">
                                    已支付
                                </span>
                            </span>
                            <span v-if="scope.row.applyStatus==2">驳回</span>
                            <span v-if="scope.row.applyStatus==3">审核中</span>
                            <span v-if="scope.row.applyStatus==4">拒绝</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="refundReason"
                        label="退款原因">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="refundMode"
                        label="退款方式">
                        <template slot-scope="scope">
                            <span v-if="scope.row.refundMode==1">退款</span>
                            <span v-if="scope.row.refundMode==2">退单退款</span>
                            <span v-if="scope.row.refundMode==3">折扣退款</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="refundTypeName"
                        label="退款类型">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="customerName"
                        label="客户名称">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="customerPhone"
                        label="客户电话">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="contractMoney"
                        label="合同金额">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="paymentAmount"
                        label="已收金额">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="refundMoney"
                        label="退款金额">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="refundMode"
                        label="退款方式">
                        <template slot-scope="scope">
                            <div v-if="scope.row.refundMode==1">退款</div>
                            <div v-if="scope.row.refundMode==2">折扣退款</div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="bankCardNumber"
                        label="退款账号">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="isBill"
                        label="是否开据发票">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.isBill==0?"不开":"开"}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="refundBill"
                        label="是否退回发票">
                        <template slot-scope="scope">
                                <div>
                                    {{scope.row.refundBill==0?"否":"是"}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="currentPage"
                        :pageSize="pageSize"
                        :total="total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                    </pagination>
                </div>
            </el-card>
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
                    <li><span>支出单号：</span>ZC2326226262</li>
                    <li><span>支出金额：</span>{{payMoneyAll}}元</li>
                    <li><span>创建人：</span>张三 2019-02-01 13:11:35</li>
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
                        <el-button class="fr button-96" size="small" @click="deleteRows(item)">删除</el-button>
                    </div>
                    <ul class="dialogMessage clearfloat">
                        <li><span style="width:120px;display:inline-block;text-align:right">客户名称：</span>{{item.customerName}}</li>
                        <li><span style="width:120px;display:inline-block;text-align:right">联系电话：</span>{{item.customerPhone}}</li>
                        <li><span style="width:120px;display:inline-block;text-align:right">退款方式：</span>{{item.refundMode==1?"退款":"折扣退款"}}</li>
                        <li><span style="width:120px;display:inline-block;text-align:right">开户名：</span>{{item.accountName}}</li>
                        <li><span style="width:120px;display:inline-block;text-align:right">退款银行：</span>{{item.affiliatedBank}}</li>
                        <li style="position:relative;"><span style="width:120px;display:inline-block;text-align:right">退款账号：</span>{{item.bankCardNumber}} <el-button style="position:absolute;right:0;top:9px;" class="button-96" size="small" @click="changeBank(item,idx)">变更</el-button></li>
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
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveList">保存</el-button>
                <el-button type="primary" @click="subList">提 交</el-button>
                <el-button type="primary" @click="dialog = false">打 印</el-button>
                <el-button @click="dialog=false">取 消</el-button>
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
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import { listOrderRefundByPage, listBaseDict ,addPayment,listCompanyBankAccountByPage } from 'api/paymentManagement/waitPayList/index';
import { getUUID } from "@/api/pulicJava";
export default {
    components:{
        breadcrumb,
        pagination
    },
    // mounted() {
    //     // 头部面包屑
    //     this.navList = this.$route.meta;
    //     // 代收款--获取表格数据
    //     // this.getListData();
    //     this.create=JSON.parse(this.$loca.getItem('element'))["waitPayList:btn_create"];
    //     listBaseDict(
    //         {
    //             dataType:'method_of_refund_application'
    //         }
    //     ).then(res=>{
    //        this.selectArr=res.data
    //     })
    // },
    // created() {
    //     this.pages()
    // },
    activated(){
        this.pages()
        // 头部面包屑
        this.navList = this.$route.meta;
        // 代收款--获取表格数据
        // this.getListData();
        this.create=JSON.parse(this.$loca.getItem('element'))["waitPayList:btn_create"];
        listBaseDict(
            {
                dataType:'method_of_refund_application'
            }
        ).then(res=>{
           this.selectArr=res.data
        })
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data(){
        return{
            create:false,
            show:false,
            text:'更多',
            sel:"",
            bankDialog:false,
            navList:[],
            spot:spot,
            searchtext:'',
            span:6,
            currentPage:1,
            pageSize:10,
            total:10,
            bankTotal:10,
            dialog:false,
            selectArr:[],
            bankTable:[],
            formList:{
                userList:'',
                userTel:'',
                accountNumber:'',
                orderNum:'',
                selectId:""
            },
            tableData: [],
            rowsData:[],
            creatArr:[],
            bankParams:{
                page:1,
                limit:10,
                customerId:""
            },
            bankRows:[],
            idx:""
        }
    },
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
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        more(){
            this.show=!this.show;
            this.text=this.show?"收起":"更多"
        },
        reset(){
            this.currentPage=1;
            for(let i in this.formList){
                this.formList[i]="";
            }
            this.pages()
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
        searchBtn(){
            this.currentPage=1;
            this.pages()
        },
        saveList(){
            this.creatMethods(0)
        },
        subList(){
            this.creatMethods(1)
        },
        creatMethods(status){
            let arr=[]
            this.creatArr.map((item,idx)=>{
               arr.push(item.orderApplyRefundId)
            })
            getUUID({
                serialNumber:'PY'
            }).then(resion=>{
                addPayment(
                    {
                        refundIds:arr.join(","),
                        status:status,
                        paymentType:this.creatArr[0].refundMode,
                        paymentMoney:this.payMoneyAll,
                        isPrinting:'0',
                        customerBankCardId:this.creatArr[0].customerBankCardId,
                        paymentNumber:resion.data
                    }
                ).then(res=>{
                    this.dialog=false;
                    this.pages()
                    if(status==0){
                        this.$message({
                            message: '保存',
                            type: 'success'
                        });
                    }else if(status==1){
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                    }
                })
            })
            
        },
        rowCreat(val){
            this.creatArr=[val];
            this.dialog=true;
        },
        creat(){
            var arr=[];
            if(this.rowsData.length>1){
                for(let i=0;i<this.rowsData.length;i++){
                    console.log(this.rowsData[i].refundType)
                    if(this.rowsData[0].refundType==this.rowsData[i].refundType){
                        arr.push(this.rowsData[i])
                    }
                }
                console.log(arr)
                if(arr.length==this.rowsData.length){
                    this.dialog=true;
                    this.creatArr=arr;
                }else{
                    this.$message({
                        message: '请选择退款原因相同的进行创建支出单',
                        type: 'warning'
                    });
                }
                
            }else if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后再进行创建支出单',
                    type: 'warning'
                });
            }else{
                this.creatArr=this.rowsData;
                this.dialog=true;
            }

        },
        deleteRows(val){
            this.rowsData.map((item,idx)=>{
                if(item.refundNumber==val.refundNumber){
                    this.rowsData.splice(idx,1)
                }
            })
            this.creatArr.map((item,idx)=>{
                if(item.refundNumber==val.refundNumber){
                    this.creatArr.splice(idx,1)
                }
            })
            if(this.creatArr.length==0){
                this.dialog=false;
            }
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        pages(){
            listOrderRefundByPage(
                {
                    customerName:this.formList.userList,
                    customerPhone:this.formList.userTel,
                    orderNumber:this.formList.orderNum,
                    bankCardNumber:this.formList.accountNumber,
                    refundType:this.formList.selectId,
                    limit:this.pageSize,
                    page:this.currentPage,
                }
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        currentChange(val) {
            this.currentPage = val;
            this.pages()
        //   this.getListData();
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.pages()
        //   this.getListData();
        },
        selectChange(rows){
            this.rowsData=rows;
        }
    },
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.querybox {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.querybox>div{
    display: flex;
    justify-content: center;
    align-items: center;
}
.orderinp{
    max-width: 420px;
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
.dialogMessage{
    width: 100%;
}
.dialogMessage>li{
    width: 33.3%;
    float: left;;
    height: 50px;
    line-height: 50px;
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
