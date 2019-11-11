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
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column
            prop="paymentNumber"
            align="center"
            label="支出单号"
            width="180"
            fixed
            show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.writeOff">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" @click="writeOff(scope.row)">销账</p>
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip>
                    <span class="table_action_span" @click="jumpMoney(scope.row)">{{scope.row.paymentNumber}}</span>
                </div>
            </template>
            </el-table-column>
            
            <el-table-column
            width="150"
            align="center"
            prop="paymentMoney"
            show-overflow-tooltip
            label="支付金额">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            prop="customerName"
            show-overflow-tooltip
            label="客户名称">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            prop="customerPhone"
            show-overflow-tooltip
            label="联系电话">
            </el-table-column>
            <el-table-column
            width="370"
            align="center"
            prop="address"
            show-overflow-tooltip
            label="客户地址">
            </el-table-column>
            <el-table-column
            width="150"
            show-overflow-tooltip
            align="center"
            prop="paymentTypeName"
            label="支付方式">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="accountName"
            label="开户名">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="affiliatedBank"
            label="收款银行">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="bankCardNumber"
            label="收款账号">
            </el-table-column>
            <el-table-column
            width="150"
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
            width="150"
            align="center"
            show-overflow-tooltip
            prop="comAccountName"
            label="付款公司">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="comOpeningBankName"
            label="付款银行">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="comBankCardNumber"
            label="支付账号">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="comAccountName"
            label="付款公司">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="comOpeningBankName"
            label="付款银行">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="comBankCardNumber"
            label="支付账号">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            prop="createName"
            show-overflow-tooltip
            label="创建人">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            prop="createTime"
            show-overflow-tooltip
            label="创建时间">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="payer"
            label="支出人">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            prop="payTime"
            show-overflow-tooltip
            label="支出时间">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import pagination from '../../../components/pagination';
import spot from '@/assets/images/spot.png';
export default {
    props:["tableData","btnJurisdiction"],
    components:{
        pagination
    },
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
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        selectChange(val){
            this.$emit("selectRows",val)
        },
        jumpMoney(val){
            this.$emit("showDialog",val)
            // this.$router.push({
            //     path:'/serverCollection/collectionInformation',
            //     query:{
            //         id:val.collectMoneyId,
            //         edit:true,
            //         close:true,
            //     }
            // })
        },
        writeOff(val){
            this.$emit("dialogs",val)
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
