<template>
    <div class="simTable table_list unsortable">
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            :row-class-name="tableRowClassName"
            @selection-change="selectChange"
            @row-click="rowClick"
            ref="table"
            >
            <el-table-column
            align="center"
            type="selection">
            </el-table-column>
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
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.pay">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" v-if="btnJurisdiction.pay" @click="payIt(scope.row,1)">支付</p>
                            <!-- <p class="operaItems" v-if="btnJurisdiction.goBack" @click="goBack(scope.row)">退回</p> -->
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip>
                    <span class="table_action_span" @click="payIt(scope.row,0)">{{scope.row.paymentNumber}}</span>
                </div>
            </template>
            </el-table-column>
            
            <!-- <el-table-column
            width="100"
            align="center"
            prop="paymentFrequency"
            show-overflow-tooltip
            label="支出笔数">
            </el-table-column> -->
            <el-table-column
            width="100"
            align="center"
            show-overflow-tooltip
            prop="paymentMoney"
            label="支付金额">
            </el-table-column>
            <el-table-column
            width="100"
            align="center"
            prop="customerName"
            show-overflow-tooltip
            label="客户名称">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="customerPhone"
            label="联系电话">
            </el-table-column>
            <el-table-column
            width="370"
            align="center"
            show-overflow-tooltip
            prop="address"
            label="客户地址">
            </el-table-column>
            <el-table-column
            width="100"
            align="center"
            prop="paymentTypeName"
            show-overflow-tooltip
            label="支付方式">
            </el-table-column>
            <el-table-column
            width="130"
            align="center"
            prop="accountName"
            show-overflow-tooltip
            label="开户名">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            prop="affiliatedBank"
            show-overflow-tooltip
            label="开户银行">
            </el-table-column>
            <el-table-column
            align="center"
            show-overflow-tooltip
            prop="bankCardNumber"
            width="160"
            label="收款账号">
            </el-table-column>
            <el-table-column
            width="100"
            align="center"
            prop="isPrinting"
            show-overflow-tooltip
            label="是否打印">
            <template slot-scope="scope">
                <div>
                    {{scope.row.isPrinting==0?"是":"否"}}
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="100"
            align="center"
            show-overflow-tooltip
            prop="createName"
            label="创建人">
            </el-table-column>
            <el-table-column
            width="160"
            align="center"
            prop="createTime"
            show-overflow-tooltip
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
            
            spot:spot,
            expands:[],
        }
    },
    methods:{
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        payIt(val,idx){
            this.$emit("showDialogs",val,idx)
        },
        selectChange(val){
            this.$emit("rowsData",val)
        },
        goBack(val){
            this.$emit("goBack",val)
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        getRowKeys(row) {
            return row.partnerExpenditureListId;
        },
    }
}
</script>
<style scoped>

</style>
