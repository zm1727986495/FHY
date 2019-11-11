<template>
    <div class="editTable" style="padding:0 15px">
        <div class="m-top20">
        <div  class="table_list lvs">
            <el-table
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName"
                @row-click="rowClick"
                @select="select"
                border
                ref="table">
                <el-table-column 
                    type="selection" 
                    fixed="left"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column fixed label="订单编号"  prop="orderNumber" show-overflow-tooltip sortable align="center" width="160">
                    <template slot-scope="scope">
                        <div class="operation table_action_span" @click="orderDetails(scope.row)">
                            {{scope.row.orderNumber}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单类型"
                    show-overflow-tooltip
                    prop="orderTypeName" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="客户名称"
                    show-overflow-tooltip
                    prop="customerName" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="客户电话"
                    show-overflow-tooltip
                    prop="customerPhone" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="订单地址"
                    show-overflow-tooltip
                    prop="address" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="产品品牌"
                    show-overflow-tooltip
                    prop="brandName" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="产品品类"
                    show-overflow-tooltip
                    prop="categoryName" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="订单货品类型"
                    show-overflow-tooltip
                    prop="orderGoodsType" sortable  align="center" width="180">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.orderGoodsType==1?"成品":"定制品"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="合同金额"
                    show-overflow-tooltip
                    prop="contractMoney" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="已收金额"
                    show-overflow-tooltip
                    prop="paymentAmount" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="合同签订时间"
                    show-overflow-tooltip
                    prop="givenTime" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="销售"
                    show-overflow-tooltip
                    prop="salesmanName" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="设计师"
                    show-overflow-tooltip
                    prop="designerName" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="所属门店"
                    show-overflow-tooltip
                    prop="storeName" sortable  align="center" width="180">
                </el-table-column>
                <el-table-column
                    label="创建订单时间"
                    show-overflow-tooltip
                    prop="createOrderTime" sortable  align="center" width="180">
                </el-table-column>
            </el-table>
        </div>
        </div>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import { setTimeout } from 'timers';

export default {
    name: 'editTable',
    props: {
        // 表数据
        tableData: {
            type: Array,
            default () {
                return [];
            }
        },
        selects:{
            type:Array,
            default () {
                return [];
            }
        },
        isMoneyWayId:{
            type:Number,
            default(){
                return null
            }
        }
    },
    watch: {
        "tableData":{
            // immediate: true,
            handler:function(newValue,oldValue){
                if(this.$route.query.source){
                    if(newValue.length){
                        this.$nextTick(()=>{
                            newValue.map((item,idx)=>{
                                this.$refs.table.toggleRowSelection(item,true)
                            })
                        })
                    }
                }
            },
            deep:true,
        }
    },
    data() {
        return {
            spot,// 操作图片
            rowsData:[]
        };
    },
    mounted() {
        
        // if(this.select.length!=0){
            // 
        // }
        // 代收款--获取表格数据
        // this.getListData();
    },
    updated(){
        let arr=[];
        for(let i=0;i<this.selects.length;i++){
            for(let j=0;j<this.tableData.length;j++){
                if(this.selects[i].orderId==this.tableData[j].orderId){
                    arr.push(this.tableData[j])
                }
            }
        }
        if(this.rowsData.length){
            arr=[];
        }
        for(let i=0;i<arr.length;i++){
            this.$refs.table.toggleRowSelection(arr[i],true)
        }
        
    },
    methods: {
        select(selection, row){
            selection.map((item,idx)=>{
                if(item.orderId!=row.orderId){
                    delete row.collectMoney
                    delete row.shopCashCoupon
                    delete row.shopCashCouponAmount
                    delete row.ownCashCoupon
                    delete row.ownCashCouponAmount
                }
            })
        },
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        // 表格列的样式
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 2){ // 指定坐标-- 第一列
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
        },
        // table 颜色切换
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },

        // 多选改变
        handleSelectionChange(val,index) {
            this.rowsData=val;
            if(this.selects.length){
                this.rowsData.map((item,idx)=>{
                    this.selects.map((info,index)=>{
                        if(item.orderId==info.orderId){
                            this.rowsData.splice(idx,1,info)
                        }
                    })
                })
            }
            if(this.rowsData.length>1){
                if(this.rowsData[0].customerId!=this.rowsData[this.rowsData.length-1].customerId){
                    var vs=this.rowsData.splice(this.rowsData.length-1,1)
                    this.$refs.table.toggleRowSelection(vs[0],false)
                    this.$message({
                        message: '必须是同一客户',
                        type: 'warning'
                    });
                }
                if(this.rowsData.length>1&&this.isMoneyWayId==225){
                    this.$message({
                        message: '当收款方式为家装代收款时只可选择一条',
                        type: 'warning'
                    });
                    return
                }
                this.$emit('selection-change', this.rowsData);
            }else{
                this.$emit('selection-change', this.rowsData);
            }
        },
        editReceivables(rows) {
            this.$router.push({
                //新增时需传入客户id
                path: "proedit",
                // query:{
                //     id:this.$route.query.id
                // }
            });
        }


    }
};
</script>
<style scoped lang="scss">
    .operaItems{
        color: rgb(127, 221, 228);
        border: none;
        background: transparent;
        &:hover {
            background: transparent;
        }
    }
</style>
