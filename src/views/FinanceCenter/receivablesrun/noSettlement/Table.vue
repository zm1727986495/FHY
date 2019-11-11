<template>
    <div class="unsortable">
        <el-table
            :data="tableData"
            style="width:100%"
            :row-class-name="tableRowClassName"
            v-loading="tableLoading.tableLoading"
            border :cell-style="cellStyle" :header-cell-style="cellStyle">
            <el-table-column
                label="收款单号"
                show-overflow-tooltip
                fixed
                prop="collectMoneyName" align="center" width="300">
                <template slot-scope="props">
                    <span class="table_action_span" @click="jumpNumber(props.row)">{{props.row.collectMoneyName}}</span>
                </template>
            </el-table-column>
            <el-table-column  fixed type="expand"  class-name="table_expand_cell"  width="20">
                <template slot-scope="scope" class="u">
                    <el-table
                    :data="scope.row.orderVOS"
                    style="width: 100%;"
                    border
                    :row-class-name="tableRowClassName">
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
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
                        align="center"
                        show-overflow-tooltip
                        prop="categoryName"
                        label="产品品类">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="brandName"
                        label="产品品牌">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="customerName"
                        show-overflow-tooltip
                        label="客户名称">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="customerPhone"
                        label="客户电话">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="otherPhone"
                        label="备用电话">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="Address"
                        label="订单地址">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="salesmanName"
                        label="销售">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="surveyorName"
                        show-overflow-tooltip
                        label="测量员">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="designerName"
                        label="设计师">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="storeName"
                        label="所属门店">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="boothNumber"
                        label="所属摊位">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="createOrderTime"
                        label="创建订单时间">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="givenTime"
                        label="合同签订时间">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="collectStoreBoothName"
            label="所属门店">
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
                label="实收门店"
                show-overflow-tooltip
                prop="actualStoreName"  align="center" width="180">
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
                label="家装合同号"
                show-overflow-tooltip
                prop="homeContractNumber"   align="center" width="180">
            </el-table-column>
            <el-table-column
                label="客户名称"
                show-overflow-tooltip
                prop="customerName"  align="center" width="180">
            </el-table-column>

            <el-table-column
                label="客户电话"
                show-overflow-tooltip
                prop="customerPhone"  align="center" width="180">
            </el-table-column>


            <el-table-column
                label="收款金额"
                show-overflow-tooltip
                prop="collectMoney"  align="center" width="180">
            </el-table-column>
            
            <el-table-column
                label="录入人"
                show-overflow-tooltip
                prop="createName"  align="center" width="180">
            </el-table-column>

            <el-table-column
                label="录入时间"
                show-overflow-tooltip
                prop="createTime"  align="center" width="180">
            </el-table-column>
            
            <el-table-column
                label="收款类型"
                show-overflow-tooltip
                prop="collectTypeName"  align="center" width="180">
            </el-table-column>

            <el-table-column
                label="收款方式"
                show-overflow-tooltip
                prop="collectWayName"  align="center" width="180">
            </el-table-column>
            <el-table-column
                label="公司收款账号"
                show-overflow-tooltip
                prop="bankCardId"   align="center" width="180">
            </el-table-column>

            <el-table-column
                label="所属摊位"
                show-overflow-tooltip
                prop="collectStoreBoothName"  align="center" width="180">
            </el-table-column>


            <el-table-column
                label="实收摊位"
                show-overflow-tooltip
                prop="actualStoreBoothName"  align="center" width="180">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import spot from '@/assets/images/spot.png';
import { billOrderCollectMoney } from '@/api/receivablesrun/clientcollection/index';
export default {
    props:["tableData","searchIpts","paginations",'tableLoading'],
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            spot:spot,
            childTable:[]
        }
    },
    methods: {
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 0){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        jumpNumber(val){
            this.$router.push({
                path: "goBackQuestion",
                query:{
                    isEdit:true,
                    id:val.collectMoneyId,
                    disabled:true,
                    names:this.names
                }
            });
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
