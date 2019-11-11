<template>
    <div class="simTable table_list unsortable">
        <el-table
            :data="tableData"
            border
            :cell-style="cellStyle" :header-cell-style ="cellStyle"
            @selection-change="selectChange"
            :row-class-name="tableRowClassName"
            @row-click="rowClick"
            ref="table"
            style="width: 100%">
            <el-table-column
            align="center"
            fixed
            type="selection">
            </el-table-column>
            <el-table-column
            prop="collectMoneyName"
            align="center"
            fixed
            label="收款单号"
            show-overflow-tooltip
            width="180">
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.goBack||btnJurisdiction.audit">
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems" v-if="btnJurisdiction.goBack" @click="goBack(scope.row)">驳回</p>
                            <p class="operaItems" v-if="btnJurisdiction.audit" @click="audit(scope.row)">审核</p>
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip>
                    <p class="operation table_action_span" @click="jumpMoney(scope.row)">{{scope.row.collectMoneyName}}</p>
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
                        align="center"
                        prop="orderNumber"
                        show-overflow-tooltip
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
                        prop="categoryName"
                        show-overflow-tooltip
                        label="产品品类">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="brandName"
                        show-overflow-tooltip
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
                        prop="customerPhone"
                        show-overflow-tooltip
                        label="客户电话">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="otherPhone"
                        show-overflow-tooltip
                        label="备用电话">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="address"
                        show-overflow-tooltip
                        label="订单地址">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="salesmanName"
                        show-overflow-tooltip
                        label="销售">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="surveyorName"
                        label="测量员">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="designerName"
                        show-overflow-tooltip
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
                        prop="createOrderTime"
                        show-overflow-tooltip
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
            prop="collectStoreName"
            show-overflow-tooltip
            label="所属门店">
            </el-table-column>
            <el-table-column
            width="180"
            show-overflow-tooltip
            align="center"
            prop="collectMoney"
            label="收款金额">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="actualStoreName"
            label="实收门店">
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
            width="180"
            align="center"
            show-overflow-tooltip
            prop="createName"
            label="录入人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="createTime"
            label="录入时间">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="collectTypeName"
            label="收款类型">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="collectWayName"
            show-overflow-tooltip
            label="收款方式">
            </el-table-column>
            <el-table-column
                label="公司收款账号"
                show-overflow-tooltip
                prop="bankCardId"   align="center" width="180">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="collectStoreBoothName"
            label="所属摊位">
            </el-table-column>
           
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
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
            width="180"
            align="center"
            prop="commitName"
            show-overflow-tooltip
            label="提交人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="commitTime"
            label="提交时间">
            </el-table-column>
            <!-- <el-table-column
            show-overflow-tooltip
            width="180"
            align="center"
            prop="auditTime"
            label="审核日期">
            </el-table-column> -->
        </el-table>
        
    </div>
</template>
<script>

import spot from '@/assets/images/spot.png';
import {listOrder} from 'api/FinanceCenter/creditManagement/customerDocumentAudit/index'
export default {
    props:["tableData","btnJurisdiction"],
    data(){
        return{
            
            spot:spot,
            childTable:[]
        }
    },
    methods:{
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        selectChange(val){
            this.$emit("selectRows",val)
        },
        goBack(val){
            this.$emit("goBack",val)
        },
        audit(val){
            this.$router.push({
                path:'collectionInformation',
                query:{
                    id:val.collectMoneyId,
                    edit:false,
                    isShow:true,
                }
            })
        },
        expendChange(val){
            listOrder(
                {
                  collectMoneyId:val.collectMoneyId
                }
            ).then(res=>{
                this.childTable=res.data.rows;
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        jumpMoney(val){
            this.$router.push({
                path:'collectionInformation',
                query:{
                    id:val.collectMoneyId,
                    edit:true,
                    isShow:false,
                }
            })
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 1){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },
        orderDetails(val){
            this.$router.push({
                path:'/ordermm/details',
                query:{
                    orderId:val.orderId
                }
            })
        }
    }
}
</script>
<style scoped>

</style>
