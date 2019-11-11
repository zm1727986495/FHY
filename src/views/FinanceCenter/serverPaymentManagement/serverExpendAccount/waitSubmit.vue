<template>
    <div class="unsortable">
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            :row-class-name="tableRowClassName"
            @selection-change="selectChange"
            @row-click="rowClick"
            ref="table">
            <el-table-column
            align="center"
            type="selection">
            </el-table-column>
            <el-table-column
            prop="paymentNumber"
            align="center"
            label="支出单号"
            show-overflow-tooltip
            fixed
            width="320"
            >
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.writeOff">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" @click="writeOff(scope.row)">销账</p>
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
            prop="costMonth"
            show-overflow-tooltip
            label="费用月份">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="paymentTypeName"
            show-overflow-tooltip
            label="费用类型">
            </el-table-column>
            <!-- <el-table-column
            width="180"
            align="center"
            prop="address"
            label="结算单号">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="结算单类型">
            </el-table-column> -->
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
            show-overflow-tooltip
            prop="paymentMethodName"
            label="付款方式">
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
            prop="openingBankName"
            label="所属银行">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="bankCardNumber"
            label="付款账号">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="createAtName"
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
            prop="commitAtName"
            label="提交人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="commitTime"
            label="提交时间">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="auditAt"
            label="审核人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="auditAtName"
            label="审核时间">
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
            align="center"
            prop="commitTime"
            show-overflow-tooltip
            label="提交时间">
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
            currentPage:1,
            pageSize:10,
            total:10,
            spot,
            expands:[],
        }
    },
    methods:{
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        onlyRead(val){
            this.$emit("listen",val)
        },
        writeOff(val){
            this.$emit("writeOff",val)
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        selectChange(val){
            console.log(val)
            this.$emit("selectRows",val)
        },
        getRowKeys(row) {
            return row.partnerExpenditureListId;
        },
    }
}
</script>
<style scoped>

</style>
