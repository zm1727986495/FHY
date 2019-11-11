<template>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            row-key="id"
            :row-class-name="tableRowClassName"
            ref="topicTable">
            <el-table-column
            prop="paymentNumber"
            align="center"
            label="支出单号"
            show-overflow-tooltip
            width="180"
            fixed
            >
            <template slot-scope="scope">
                <div>
                    <p class="operation table_action_span" @click="onlyReady(scope.row)">{{scope.row.paymentNumber}}</p>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="paymentMoney"
            show-overflow-tooltip
            label="支付金额">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="customerName"
            show-overflow-tooltip
            label="客户名称">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="customerPhone"
            show-overflow-tooltip
            label="联系电话">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            show-overflow-tooltip
            label="客户地址">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="paymentTypeName"
            show-overflow-tooltip
            label="支付方式">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="accountName"
            label="开户名">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="affiliatedBank"
            label="收款银行">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="bankCardNumber"
            label="收款账号">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="isPrinting"
            label="是否打印">
            <template slot-scope="scope">
                <div>
                    {{scope.row.isPrinting==0?"是":"否"}}
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="comAccountName"
            label="付款公司">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="comOpeningBankName"
            label="付款银行">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="comBankCardNumber"
            label="支付账号">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="createName"
            label="创建人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="createTime"
            label="创建时间">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="payer"
            label="支付人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="payTime"
            show-overflow-tooltip
            label="支付时间">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
export default {
    props:["tableData","btnJurisdiction"],
    data(){
        return{
            spot:spot,
            dialog:false,
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        edit(){

        },
        onlyReady(val){
            this.$emit("eidtOrReady",[val,false])
        }
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
</style>

