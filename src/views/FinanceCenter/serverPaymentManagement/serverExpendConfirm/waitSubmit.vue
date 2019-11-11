<template>
    <div class="unsortable">
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
            width="320"
            show-overflow-tooltip
            fixed
            >
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.pay||btnJurisdiction.goBack">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" v-if="btnJurisdiction.pay" @click="payIt(scope.row)">支付</p>
                            <p class="operaItems" v-if="btnJurisdiction.goBack" @click="goBack(scope.row)">退回</p>
                            
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip>
                    <span class="table_action_span" @click="onlyRead(scope.row)">{{scope.row.paymentNumber}}</span>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="companyName"
            show-overflow-tooltip
            label="合作商">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="costMonth"
            label="费用月份">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="paymentTypeName"
            label="费用类型">
            </el-table-column>
            <!-- <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="address"
            label="结算单号">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="address"
            label="结算类型">
            </el-table-column> -->
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="paymentMoney"
            label="支付金额">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="paymentMethodName"
            label="付款方式">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="accountName"
            label="开户名">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="openingBankName"
            label="所属银行">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="bankCardNumber"
            label="付款账号">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="createAtName"
            label="创建人">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="createTime"
            label="创建时间">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="commitAtName"
            label="提交人">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="commitTime"
            label="提交时间">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="auditAtName"
            label="审核人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="auditTime"
            label="审核时间">
            </el-table-column>
        </el-table>
        
    </div>
</template>
<script>

import spot from '@/assets/images/spot.png';
import { expenditurePartnerExpenditureList } from "@/api/FinanceCenter/serverPaymentManagement/serverExpendConfirm/index"
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
        onlyRead(val){
            console.log(111)
            this.$emit("listen",val)
        },
        goBack(val){
            this.$emit('question',val)
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        selectChange(val){
            console.log(val)
            this.$emit("selectRows",val)
        },
        payIt(val){
            this.$emit("payIt",val.partnerExpenditureListId)
        },
    }
}
</script>
<style scoped>

</style>
