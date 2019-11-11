<template>
    <div class="unsortable">
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            :row-class-name="tableRowClassName"
            ref="topicTable">
            <el-table-column
            prop="name"
            align="center"
            label="支出单号"
            show-overflow-tooltip
            fixed
            width="320"
            >
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.print">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems">打印</p>
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip>
                    <span class="table_action_span" @click="edit(scope.row,false)">{{scope.row.paymentNumber}}</span>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="180"
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
            width="180"
            align="center"
            show-overflow-tooltip
            prop="companyName"
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
            align="center"
            show-overflow-tooltip
            prop="paymentTypeName"
            label="费用类型">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            show-overflow-tooltip
            label="结算单号">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            show-overflow-tooltip
            label="结算单类型">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="paymentMoney"
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
            show-overflow-tooltip
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
            currentPage:1,
            pageSize:10,
            total:10,
            spot:spot,
            expands:[],
        }
    },
    methods:{
        edit(val,onlyReady){
            this.$emit("listen",[val,true,onlyReady])
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
    }
}
</script>
<style scoped>

</style>
