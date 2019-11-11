<template>
    <div>
        <el-table
            border
            :data="tableData"
            :cell-style="cellStyle" :header-cell-style ="cellStyle"
            :row-class-name="tableRowClassName"
            >
                <el-table-column fixed show-overflow-tooltip width="180" align="center" prop="collectMoneyName" label="收款单号">
                    <!-- <template slot-scope="scope">
                        <div>
                            <span class="table_action_span" >{{scope.row.collectMoneyName}}</span>
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column show-overflow-tooltip
                align="center"
                type="expand"
                width="20px"
                >
                    <template slot-scope="scope">
                        <el-table
                        :data="scope.row.orderVOS"
                        style="width: 100%;"
                        :row-class-name="tableRowClassName"
                        border
                        row-key="id">
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="orderNumber"
                            label="订单编号">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="orderStatus"
                            label="订单状态">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="orderType"
                            label="订单类型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="orderGoodsType"
                            label="订单货品类型">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="categoryName"
                            label="产品品类">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="brandName"
                            label="产品品牌">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="contractMoney"
                            label="合同金额">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="paymentAmount"
                            label="已收金额">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="paymentAmount"
                            label="本次收款金额">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="customerName"
                            label="客户名称">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="customerPhone"
                            label="客户电话">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="otherPhone"
                            label="备用电话">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="Address"
                            label="订单地址">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="salesmanName"
                            label="销售">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="surveyorName"
                            label="测量员">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="designerName"
                            label="设计师">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="storeName"
                            label="所属门店">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="boothNumber"
                            label="所属摊位">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="createOrderTime"
                            label="创建订单时间">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip
                            align="center"
                            prop="givenTime"
                            label="合同签订时间">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="customerName" label="客户名称"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="customerPhone" label="客户电话"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="paymentAmount" label="本次收款"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createName" label="录入人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="createTime" label="录入时间"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="collectType" label="收款类型"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="collectWay" label="收款方式"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="collectStoreName" label="所属门店"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="collectStoreBoothName" label="所属摊位"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="actualStoreName" label="实收门店"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="actualStoreBoothName" label="实收摊位"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="receiptNumber" label="内部收据号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="buildingReceiptNumber" label="建材城收据号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="homeContractNumber" label="家装合同号"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="commitName" label="提交人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="commitTime" label="提交时间"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="auditName" label="审核人"></el-table-column>
                <el-table-column show-overflow-tooltip width="180" align="center" prop="auditTime" label="审核时间"></el-table-column>
            </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return{
            tableData:[
                {
                    data:1
                },
                {
                    data:2
                }
            ],
            childTable:[],
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        expendChange(row){
            
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 0){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },
    },
}
</script>
<style scoped>

</style>
