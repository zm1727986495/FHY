<template>
    <div class="unsortable">
        <el-table
        border
        :row-class-name="tableRowClassName"
        :data="tableData">
            <el-table-column show-overflow-tooltip fixed width="180" align="center" prop="unprocessedStatus" label="状态">
                <template slot-scope="scope">
                    <div>
                        <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.audit">
                            <div slot="content" class="tips tipFon">
                                <p class="operaItems" @click="audit(scope.row)">审核</p>
                            </div>
                            <img :src="spot" alt="" class=" attributesTips">
                        </el-tooltip>
                        <span v-if="scope.row.unprocessedStatus==0">待结算</span>
                        <span v-if="scope.row.unprocessedStatus==1">结算中</span>
                        <span v-if="scope.row.unprocessedStatus==2">已结算</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="unprocessedData" label="未处理数据">
                <template slot-scope="scope">
                    <el-popover
                    placement="bottom-start"
                    width="400"
                    trigger="click">
                        <div style="display:inline-block">
                            未处理 {{}} 条
                        </div>
                        <div style="display:inline-block;float:right">
                            共 {{total}} 条数据
                        </div>
                        <el-table :data="tableData2" border :row-class-name="tableRowClassName">
                            <el-table-column show-overflow-tooltip align="center" prop="confirmationName" label="确认人"></el-table-column>
                            <el-table-column show-overflow-tooltip align="center" prop="confirmationPhone" label="联系方式"></el-table-column>
                            <el-table-column show-overflow-tooltip align="center" prop="handleCount" label="已处理"></el-table-column>
                        </el-table>
                        <p slot="reference" style="color:red;cursor: pointer;" @click="historyClick(scope.row)">{{scope.row.unprocessedData}}</p>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="settlementNumber" label="结算单号"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="costMonth" label="费用月份"></el-table-column>
            <el-table-column show-overflow-tooltip width="230" align="center" prop="companyName" label="付款方"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="storeName" label="结算门店"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="receivablesTypeName" label="收款方式"></el-table-column>
<!--            <el-table-column show-overflow-tooltip width="180" align="center" prop="bankCardNumber" label="收款账号"></el-table-column>-->
<!--            <el-table-column show-overflow-tooltip width="180" align="center" prop="amountSum" label="合同合计金额"></el-table-column>-->
            <el-table-column show-overflow-tooltip width="180" align="center" prop="countOrder" label="结算明细数量"></el-table-column>
<!--            <el-table-column show-overflow-tooltip width="180" align="center" prop="actualSettlementAmount" label="实际结算金额"></el-table-column>-->
            <el-table-column show-overflow-tooltip width="180" align="center" prop="settlementAmount" label="应结算金额"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="totalCost" label="应付费用总额"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="createName" label="创建人"></el-table-column>
            <el-table-column show-overflow-tooltip width="180" align="center" prop="createTime" label="创建时间"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import { getBmcSettlementHisVO } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index';
export default {
    props:["tableData","btnJurisdiction"],
    data(){
        return{
            spot:spot,
            tableData2:[
            ],
            total:10,
            unprocessedData:10
        }
    },
    methods: {
        historyClick(val){
            getBmcSettlementHisVO(
                {
                    bmcSettlementId:val.bmcSettlementId
                }
            ).then(res=>{
                this.tableData2=res.data.bmcSettlementConfirmations;
                this.total=res.data.total;
                this.unprocessedData=res.data.unprocessedData;
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        audit(val){
            this.$router.push({
                path:'audit',
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
