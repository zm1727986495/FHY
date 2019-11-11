<template>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            row-key="id"
            :row-class-name="tableRowClassName"
            @selection-change="selectChange"
            @row-click="rowClick"
            ref="table"
            >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column
            prop="paymentNumber"
            align="center"
            label="支出单号"
            width="320"
            fixed
            >
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.edit||btnJurisdiction.print||btnJurisdiction.submit">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" v-if="btnJurisdiction.edit" @click="edit(scope.row)">编辑</p>
                            <p class="operaItems" v-if="btnJurisdiction.print">打印</p>
                            <p class="operaItems" v-if="btnJurisdiction.submit">提交</p>
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip>
                    <p class="operation table_action_span" @click="onlyReady(scope.row)">{{scope.row.paymentNumber}}</p>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="paymentMoney"
            label="支付金额">
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
            label="联系电话">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="paymentType"
            label="支付方式">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="accountName"
            label="开户名">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="affiliatedBank"
            label="支付银行">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="bankCardNumber "
            label="支付账户">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="isPrinting"
            label="是否打印">
                <template slot-scope="scope">
                    {{scope.row.isPrinting==0?"不打印":"打印"}}
                </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="createName"
            label="创建人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="createTime"
            label="创建时间">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="payer"
            label="支付人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="payTime"
            label="支付时间">
            </el-table-column>
        </el-table>
        <el-dialog width="1200px" :visible.sync="dialog" >
            <div class="iconBox"><i class='Icon'></i><span>支出单</span></div>
            <div style="border-bottom:1px solid #cccccc;padding-bottom:20px;">
                <ul class="dialogList clearfloat">
                    <li><span>支出单号：</span>{{dialogData.paymentNumber}}</li>
                    <li><span>支出金额：</span>{{dialogData.paymentMoney}}元</li>
                    <li><span>创建人：</span>{{dialogData.createName}} {{dialogData.createTime}}</li>
                </ul>
                <div style="text-align:right">共1笔</div>
            </div>
            <div v-for="(item,idx) in dialogData.orderRefundVOS" :key="idx">
                <div>
                    <div style="border-bottom:1px solid #cccccc;padding-bottom:20px;margin-top:20px">
                        <div class="iconBox"><i class='Icon'></i><span>退款号：{{item.refundNumber}}</span></div>
                        <ul class="dialogMessage clearfloat">
                            <li><span>客户名称：</span>{{item.customerName}}</li>
                            <li><span>联系电话：</span>{{item.customerPhone}}</li>
                            <li><span>退款方式：</span>{{item.refundModeName}}</li>
                            <li><span>开户名：</span>{{item.accountName}}</li>
                            <li><span>退款银行：</span>{{item.affiliatedBank}}</li>
                            <li><span>退款账号：</span>{{item.bankCardNumber}} 变更</li>
                            <li><span>退款金额：</span>{{item.refundAmount}}元</li>
                        </ul>
                    </div>
                    <div>
                        <ul class="isNo clearfloat">
                            <li><span>是否已开发票：</span>{{item.isBill==0?"是":"否"}}</li>
                            <li><span>是否已归还发票：</span>{{item.refundBill==0?"是":"否"}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div v-for="(item,idx) in dialogData.returnOrderPayments" :key="idx">
                <ul class="clearfloat returnUser">
                    <li><span>退回人：</span>{{item.createAtName}}</li>
                    <li><span>退回时间：</span>{{item.createTime}}</li>
                    <li class="clearfloat"><span>退回原因：</span>
                        <el-input type="textarea" v-model="item.returnReason" style="width:80%" :disabled="true"></el-input>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveList">保存</el-button>
                <el-button type="primary" @click="subList">提 交</el-button>
                <el-button type="primary" @click="dialog = false">打 印</el-button>
                <el-button @click="dialog=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import {getOrderPayment, editPayment, commitOrderPayment} from "@/api/paymentManagement/paymentList/index"
export default {
    props:["tableData","btnJurisdiction"],
    data(){
        return{
            spot:spot,
            textArea:'',
            dialog:false,
            dialogData:[],
        }
    },
    methods: {
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        edit(val){
            this.dialog=true;
            getOrderPayment(
                {
                    orderPaymentId:val.orderPaymentId
                }
            ).then(res=>{
                this.dialogData=res.data;
            })
        },
        onlyReady(val){
            this.$emit("eidtOrReady",[val,false])
        },
        saveList(){
            this.editQuery(0)
        },
        subList(){
            this.editQuery(1)
        },
        selectChange(val){
            this.$emit("rows",val)
        },
        editQuery(status){
            let arr=[]
            this.dialogData.returnOrderPayments.map((item,idx)=>{
                arr.push(item.orderRefundId)
            })
            editPayment(
                {
                    orderPaymentId:this.dialogData.orderPaymentId,
                    refundIds:arr.join(","),
                    status:status,
                    paymentType:this.dialogData.paymentType,
                    paymentMoney:this.dialogData.allMoney,
                    isPrinting:this.dialogData.isPrinting,
                    customerBankCardId:this.dialogData.customerBankCardId,
                }
            ).then(res=>{
                this.dialog=false;
            })
        },
    },
}
</script>
<style scoped>
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
.returnUser{
    margin-top:20px;
}
.returnUser>li{
    float: left;
    width: 33.5%;
}
.returnUser>li:nth-last-child(1){
    width: 100%;
    margin-top:20px;
}
.returnUser>li>span{
    display: inline-block;
    text-align: right;
    width:120px;
    float: left;
}
</style>

