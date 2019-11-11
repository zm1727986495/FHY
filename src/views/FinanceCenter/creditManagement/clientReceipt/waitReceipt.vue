<template>
    <div class="simTable table_list unsortable">
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            :cell-style="cellStyle" :header-cell-style="cellStyle"
            :row-class-name="tableRowClassName"
            @selection-change="selectionChange"
            @row-click="rowClick"
            ref="table"
            >
            <el-table-column
            align="center"
            fixed
            type="selection">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            prop="name"
            align="center"
            label="收款单号"
            width="180"
            fixed
            >
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.goBack||btnJurisdiction.receipt">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" v-if="btnJurisdiction.goBack" @click="goBack(scope.row)">驳回</p>
                            <p class="operaItems" v-if="btnJurisdiction.receipt" @click="jumpMoney(scope.row)">收款</p>
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip>
                    <p class="operation table_action_span" @click="MoneyNumber(scope.row)">{{scope.row.collectMoneyName}}</p>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            align="center"
            type="expand"
            width="20px"
            fixed
            >
                <template slot-scope="scope" class="simTable table_list unsortable">
                    <el-table
                    :data="scope.row.orderVOS"
                    style="width: 100%;"
                    :row-class-name="tableRowClassName"
                    border
                    row-key="id">
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="orderNumber"
                        label="订单编号">
                            <template slot-scope="prop">
                                <div class="operation table_action_span" @click="orderDetails(prop.row)">
                                    {{prop.row.orderNumber}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="orderStatusName"
                        show-overflow-tooltip
                        label="订单状态">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="orderTypeName"
                        show-overflow-tooltip
                        label="订单类型">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="orderGoodsType"
                        show-overflow-tooltip
                        label="订单货品类型">
                        <template slot-scope="scope">
                            {{scope.row.orderGoodsType==0?"定制":"标品"}}
                        </template>
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="categoryName"
                        label="产品品类">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="brandName"
                        label="产品品牌">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="customerName"
                        label="客户名称">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="customerPhone"
                        label="客户电话">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="otherPhone"
                        label="备用电话">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="address"
                        label="订单地址">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="salesmanName"
                        label="销售">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="surveyorName"
                        label="测量员">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="designerName"
                        label="设计师">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="storeName"
                        label="所属门店">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="boothNumber"
                        label="所属摊位">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="createOrderTime"
                        label="创建订单时间">
                        </el-table-column>
                        <el-table-column
                        show-overflow-tooltip
                        align="center"
                        prop="givenTime"
                        label="合同签订时间">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="collectStoreName"
            label="所属门店">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="actualStoreName"
            label="实收门店">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="collectMoney"
            label="收款金额">
            </el-table-column>
            <el-table-column
                label="建材城收据号"
                show-overflow-tooltip
                prop="buildingReceiptNumber"   align="center" width="180">
            </el-table-column>
            <el-table-column
                label="内部收据号"
                show-overflow-tooltip
                prop="receiptNumber"   align="center" width="180">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="customerName"
            label="客户名称">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="customerPhone"
            label="客户电话">
            </el-table-column>
            <el-table-column
                label="商场代金券"
                show-overflow-tooltip
                prop="shopCashCoupons" align="center" width="180">
            </el-table-column>
            <el-table-column
                label="自有代金券"
                show-overflow-tooltip
                prop="ownCashCoupons" align="center" width="180">
            </el-table-column>
            <el-table-column
            label="刷卡卡号"
            show-overflow-tooltip
            prop="bankCardId" align="center" width="180">
            </el-table-column>
            <el-table-column
                label="备注"
                show-overflow-tooltip
                prop="remark" align="center" width="180">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="createName"
            label="录入人">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="createTime"
            label="录入时间">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="collectTypeName"
            label="收款类型">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="collectWayName"
            label="收款方式">
            </el-table-column>
            <el-table-column
                label="家装合同号"
                show-overflow-tooltip
                prop="homeContractNumber"   align="center" width="180">
            </el-table-column>
            <el-table-column
                label="公司收款账号"
                show-overflow-tooltip
                prop="bankCardId"   align="center" width="180">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="collectStoreBoothName"
            label="所属摊位">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="actualStoreBoothName"
            label="实收摊位">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="gatheringTime"
            label="收款时间">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="commitName"
            label="提交人">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="commitTime"
            label="提交时间">
            </el-table-column>
            <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="auditTime"
            label="审核日期">
            </el-table-column>
        </el-table>
        
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import{
pages,
listOrderCollectMoneyUnTicketByPage,
getOrderCollectMoney,
listStoreBooth,
returnOrderCollectMoneySuatus
} from '@/api/receivablesrun/clientcollection/index'
export default {
    props:["tableData","btnJurisdiction"],
    data(){
        return{
            spot:spot,
            // tableData: [],
            childTable:[],
            currentPage:1,
            pageSize:20,
            total:10,
        }
    },
    methods: {
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        selectionChange(val){
           this.$emit("selectRows",val)
        },
        goBack(val){
            this.$emit("goBack",val)
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 1){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },
        jumpMoney(val){
            this.$router.push({
                path:'collectionInformation',
                query:{
                    id:val.collectMoneyId,
                    edit:false,
                    collMoney:true,
                }
            })
        },
        MoneyNumber(val){
            this.$router.push({
                path:'collectionInformation',
                query:{
                    id:val.collectMoneyId,
                    edit:true,
                    close:true,
                }
            })
        },
        addTable(val){
            this.expand=!this.expand;
            console.log(this.expand)
            this.$refs.topicTable.toggleRowExpansion(val,this.expand)

        },
        orderDetails(val){
            this.$router.push({
                path:'/ordermm/details',
                query:{
                    orderId:val.orderId
                }
            })
        }
    },
}
</script>
<style scoped>

</style>