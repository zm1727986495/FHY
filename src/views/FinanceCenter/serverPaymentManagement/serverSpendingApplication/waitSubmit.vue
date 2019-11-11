<template>
    <div class="unsortable">
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            :row-class-name="tableRowClassName"
            @selection-change="selectRows"
            @row-click="rowClick"
            ref="table"
            >
            <el-table-column
            align="center"
            type="selection">
            </el-table-column>
            <el-table-column
            prop="name"
            align="center"
            label="支出单号"
            width="320"
            show-overflow-tooltip
            fixed
            >
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.delete||btnJurisdiction.edit||btnJurisdiction.submit||btnJurisdiction.print">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" v-if="btnJurisdiction.delete" @click="deleteRow(scope.row)">删除</p>
                            <p class="operaItems" v-if="btnJurisdiction.edit" @click="edit(scope.row,true)">编辑</p>
                            <p class="operaItems" v-if="btnJurisdiction.submit" @click="submitRow(scope.row)">提交</p>
                            <p class="operaItems" v-if="btnJurisdiction.print">打印</p>
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
            prop="createAtName"
            show-overflow-tooltip
            label="创建人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="createTime"
            label="创建时间">
            </el-table-column>
        </el-table>
        
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
export default {
    props:["tableData","isNull","btnJurisdiction"],
    data(){
        return{
            spot:spot,
            expands:[],
            selectRowsData:[],
        }
    },
    watch: {
        isNull(val){
            if(val){
                this.selectRowsData=[]
            }
        }
    },
    methods:{
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        edit(val,onlyReady){
            this.$emit("listen",[val,true,onlyReady])
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        selectRows(val){
            this.selectRowsData=val;
            this.$emit("selectRows",this.selectRowsData)
        },
        getRowKeys(row) {
            return row.partnerExpenditureListId;
        },
        deleteRow(val){
            this.$emit("delectRow",val)
        },
        submitRow(val){
            this.$emit("submitRow",val)
        }
    }
}
</script>
<style scoped>

</style>
