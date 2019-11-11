<template>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            row-key="id"
            :row-class-name="tableRowClassName"
            @select="selectRows"
            @row-click="rowClick"
            ref="table"
            >
            <el-table-column
            type="selection"
            align="center"
            fixed
            >
            </el-table-column>
            <el-table-column
            prop="paymentNumber"
            align="center"
            label="支出单号"
            width="320"
            fixed
            >
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.edit||btnJurisdiction.print">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" v-if="btnJurisdiction.edit" @click="edit(scope.row)">编辑</p>
                            <p class="operaItems" v-if="btnJurisdiction.print">打印</p>
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
        </el-table>

    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
export default {
    props:["tableData","btnJurisdiction"],
    data(){
        return{
            dialog:false,
            spot:spot,
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
            console.log(val)
            this.$emit("eidtOrReady",[val,true])
            // this.$router.push({
            //     path:'disbursementSlip'
            // })
        },
        onlyReady(val){
             this.$emit("eidtOrReady",[val,false])
        },
        selectRows(val){
            this.$emit("rows",val)
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

