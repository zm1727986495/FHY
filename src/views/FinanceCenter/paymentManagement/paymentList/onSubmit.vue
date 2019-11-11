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
            width="180"
            show-overflow-tooltip
            fixed
            >
            <template slot-scope="scope">
                <div>
                    <!-- <el-tooltip placement="right" visible-arrow  v-if="btnJurisdiction.print">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems">打印</p>
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip> -->
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
            show-overflow-tooltip
            prop="customerPhone"
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
            prop="accountName"
            show-overflow-tooltip
            label="开户名">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="affiliatedBank"
            label="支付银行">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="bankCardNumber"
            show-overflow-tooltip
            label="支付账户">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="isPrinting"
            show-overflow-tooltip
            label="是否打印">
                <template slot-scope="scope">
                    {{scope.row.isPrinting==0?"不打印":"打印"}}
                </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="createName"
            show-overflow-tooltip
            label="创建人">
            </el-table-column>
            <el-table-column
            width="180"
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

</style>

