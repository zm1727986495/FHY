<template>
    <div class="unsortable">
        <el-table
        border
        :row-class-name="tableRowClassName"
        :data="tableData">
            <el-table-column show-overflow-tooltip fixed width="200" align="center" prop="unprocessedStatus" label="状态">
                <template slot-scope="scope">
                    <div>
                        <el-tooltip placement="right" visible-arrow v-if="scope.row.status==4||scope.row.status==5">
                            <div slot="content" class="tips tipFon">
                                <p class="operaItems" v-if="scope.row.status==4&&btnJurisdiction.edit" @click="goToUrl(scope.row)">编辑</p>
                                <p class="operaItems" v-if="scope.row.status==4&&btnJurisdiction.delete" @click="deleteRows(scope.row)">删除</p>
                                <p class="operaItems" v-if="scope.row.status==5&&btnJurisdiction.account" @click="reconciliation(scope.row)">对账</p>
                            </div>
                            <img :src="spot" alt="" class=" attributesTips">
                        </el-tooltip>
                        <span v-if="scope.row.status==0">未导入</span>
                        <span v-if="scope.row.status==1">未导入结算明细</span>
                        <span v-if="scope.row.status==2">未导入费用</span>
                        <span v-if="scope.row.status==3">导入完成</span>
                        <span v-if="scope.row.status==4">待结算</span>
                        <span v-if="scope.row.status==5">结算中</span>
                        <span v-if="scope.row.status==6">转业务对账</span>
                        <span v-if="scope.row.status==7">结算完成</span>
                        <span v-if="scope.row.status==8">已销帐</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="settlementNumber" label="结算单号"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="costMonth" label="费用月份"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="companyName" label="付款方"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="storeName" label="结算门店"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="receivablesTypeName" label="收款方式"></el-table-column>
<!--            <el-table-column show-overflow-tooltip width="200" align="center" prop="bankCardNumber" label="收款账号"></el-table-column>-->
<!--            <el-table-column show-overflow-tooltip width="200" align="center" prop="amountSum" label="合同合计金额"></el-table-column>-->
            <el-table-column show-overflow-tooltip width="200" align="center" prop="countOrder" label="结算明细数量"></el-table-column>
<!--            <el-table-column show-overflow-tooltip width="200" align="center" prop="actualSettlementAmount" label="实际结算金额"></el-table-column>-->
            <el-table-column show-overflow-tooltip width="200" align="center" prop="settlementAmount" label="应结算金额"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="totalCost" label="应付费用总额"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="createName" label="创建人"></el-table-column>
            <el-table-column show-overflow-tooltip width="200" align="center" prop="createTime" label="创建时间"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import { deleteBmcSettlement } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index'
export default {
    props:["tableData","btnJurisdiction"],
    data(){
        return{
            spot:spot,
        }
    },
    methods: {
        deleteRows(val){
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBmcSettlement({
                    bmcSettlementId:val.bmcSettlementId
                }).then(res=>{
                    this.$emit("changePages")
                })
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        goToUrl(val){
            this.$router.push({
                path:'finalStatement',
                query:{
                    bmcReceivablesId:val.bmcReceivablesId,
                    bmcBatchId:val.bmcBatchId,
                    bmcSettlementId:val.bmcSettlementId
                }
            })
        },
        reconciliation(val){
            console.log(val)
            this.$router.push({
                path:'FinancialReconciliationDetails',
                query:{
                    bmcSettlementId:val.bmcSettlementId
                }
            })
        }
    },
}
</script>
<style scoped>

</style>
