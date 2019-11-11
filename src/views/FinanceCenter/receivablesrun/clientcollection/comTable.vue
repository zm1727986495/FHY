<template>
  <div class="simTable table_list unsortable">
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      @row-click="rowClick"
      ref="table"
      v-loading="tableLoading"
      border :cell-style="cellStyle" :header-cell-style="cellStyle">
      <el-table-column
        type="selection"
        fixed="left"
        align="center"
        width="50">
      </el-table-column>

      <el-table-column fixed="left" label="收款单号" show-overflow-tooltip  prop="collectMoneyName"  align="center" width="200">
        <template slot-scope="scope">
          <div>
            <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.edit||btnJurisdiction.submit||btnJurisdiction.cancel">
              <div slot="content" class="tips tipFon">
                <p class="operaItems" v-if="btnJurisdiction.cancel"  @click="cancelReceivables(scope.row)">取消</p>
                <p class="operaItems" v-if="btnJurisdiction.edit" @click="editReceivables(scope.row)">编辑</p>
                <p class="operaItems" v-if="btnJurisdiction.submit" @click="submitOrder(scope.row)">提交</p>
              </div>
              <img :src="spot" alt="" class=" attributesTips">
            </el-tooltip>
            <el-button type="text" @click="userinfoHandle(scope.row)">{{scope.row.collectMoneyName}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed type="expand" width="20px">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.orderVOS"
            border
            :row-class-name="tableRowClassName"
            row-key="id">
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="orderNumber"
              label="订单编号">
              <template slot-scope="prop">
                <el-button type="text" @click="orderDetails(prop.row)">{{prop.row.orderNumber}}</el-button>
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
                {{scope.row.orderGoodsType==0?"定制品":"成品"}}
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
              show-overflow-tooltip
              prop="contractMoney"
              label="合同金额">
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="paymentAmount"
              label="已收金额">
            </el-table-column>
            <el-table-column
              align="center"
              prop="paymentAmount"
              show-overflow-tooltip
              label="实收金额">
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
              show-overflow-tooltip
              prop="otherPhone"
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
              show-overflow-tooltip
              prop="salesmanName"
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
              prop="givenTime"
              show-overflow-tooltip
              label="合同签订时间">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="客户名称"
        show-overflow-tooltip
        prop="customerName"   align="center" width="180">
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="客户电话"
        prop="customerPhone"   align="center" width="180">
      </el-table-column>

      <el-table-column
        label="本次收款金额"
        show-overflow-tooltip
        prop="collectMoney"   align="center" width="180">
      </el-table-column>

      <el-table-column
        label="录入人"
        show-overflow-tooltip
        prop="createName"   align="center" width="180">
      </el-table-column>

      <el-table-column
        label="录入时间"
        show-overflow-tooltip
        prop="createTime"   align="center" width="180">
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
        label="收款类型"
        show-overflow-tooltip
        prop="collectTypeName"   align="center" width="180">
      </el-table-column>

      <el-table-column
        label="收款方式"
        show-overflow-tooltip
        prop="collectWayName"   align="center" width="180">
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
        label="建材城收据号"
        show-overflow-tooltip
        prop="buildingReceiptNumber"   align="center" width="180">
      </el-table-column>
      <el-table-column
        label="公司收款账号"
        show-overflow-tooltip
        prop="bankCardId"   align="center" width="180">
      </el-table-column>
      <el-table-column
        label="所属门店"
        show-overflow-tooltip
        prop="collectStoreName"   align="center" width="180">
      </el-table-column>

      <el-table-column
        label="所属摊位"
        show-overflow-tooltip
        prop="collectStoreBoothName"   align="center" width="180">
      </el-table-column>

      <el-table-column
        label="实收门店"
        show-overflow-tooltip
        prop="actualStoreName"   align="center" width="180">
      </el-table-column>

      <el-table-column
        label="实收摊位"
        show-overflow-tooltip
        prop="actualStoreBoothName"   align="center" width="180">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import {listOrder} from '@/api/receivablesrun/clientcollection/index'
import {
commitOrderCollectMoney,
getOrderCollectMoney,
cancelOrderCollectMoney
} from '@/api/receivablesrun/clientcollection/index';

export default {
    name: 'comTable',
    props: {
        // 表数据
        tableData: {
            type: Array,
            default () {
                return [];
            }
        },
        tabstatus:{
            
        },
        names:{

        },
        btnJurisdiction:{
            type:Object
        },
        tableLoading:{
          type:Boolean
        }
    },
    data() {
        return {
            spot,// 操作图片
            childTable:[]
        };
    },
    mounted() {
        // 代收款--获取表格数据
        // this.getListData();
        
    },
    updated() {
    },
    methods: {
        rowClick(row){
          this.$refs.table.toggleRowSelection(row)
        },
        userinfoHandle(rows){
            this.$router.push({
                path: "goBackQuestion",
                query:{
                    isEdit:true,
                    id:rows.collectMoneyId,
                    disabled:true,
                    names:this.names
                }
            });
        },
        cancelReceivables(val){
            this.$confirm('是否取消收款?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              cancelOrderCollectMoney(
                    {
                        collectMoneyIdss:val.collectMoneyId
                    }
                ).then(res=>{
                    this.$message({
                        message: '取消收款成功',
                        type: 'success'
                    });
                    this.$emit("pages")
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });          
            });
            
        },
        submitOrder(val){
          this.$confirm('是否提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            commitOrderCollectMoney({
                collectMoneyIdss:val.collectMoneyId
            }).then(res=>{
                this.$message({
                    message: '提交成功',
                    type: 'success'
                });
                this.$emit("pages")
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });
        },
        // 表格列的样式
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 1){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },

        // table 颜色切换
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },

        // 多选改变
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit('selection-change', this.multipleSelection);
        },

        editReceivables(rows) {
            if(this.tabstatus==0){
                this.$router.push({
                    //新增时需传入客户id
                    path: "proedit",
                    query:{
                        isEdit:true,
                        id:rows.collectMoneyId,
                        names:this.names
                    }
                });
            }else if(this.tabstatus==2){
                this.$router.push({
                    //新增时需传入客户id
                    path: "goBackQuestion",
                    query:{
                        isEdit:true,
                        id:rows.collectMoneyId,
                        cancel:true,
                        names:this.names
                    }
                });
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
};
</script>
<style scoped lang="scss">
    .operaItems{
        border: none;
        background: transparent;
        &:hover {
            background: transparent;
        }
    }
</style>
