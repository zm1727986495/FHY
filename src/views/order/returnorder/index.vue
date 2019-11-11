<template>
    <div class="customerorder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <!-- 退货单管理 -->
        <!-- 查询条件组件 -->
        <screencompon ref="screencompondata" 
            @searchfun="searchfun" :total="total" :orderType="orderType">
            <!-- 插槽 -->
            <div>
                <div class="order_btn_list">
                    <el-button 
                        v-for="(itm, idx) in btnlistdata"
                        :key="idx"
                        size="small" 
                        class="button-96">
                        {{itm}}
                    </el-button>
                </div>
                <div class="order_table">
                    <el-table border
                        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                        :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                        <el-table-column prop="orderStatus" align="center" label="订单状态" width="280" sortable>
                            <template slot-scope="scope">
                                <div v-if="scope.row.orderStatus == 0">未指派</div>
                                <div v-else>已完成</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNumber" align="center" label="订单号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderNumber" align="center" label="退货单号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderNumber" align="center" label="订单类型" width="200" sortable></el-table-column>
                        <el-table-column prop="orderGoodsType" align="center" label="订单货品类型" width="200" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="brandName" align="center" label="产品品牌" width="200" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="categoryName" align="center" label="产品类别" width="200" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="businessName" align="center" label="合同金额/元" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="businessName" align="center" label="实收金额/元" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="优惠卷编码" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="优惠卷金额/元" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="礼品名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="礼品数量" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="赠送方式" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="合同扣款/元" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="扣款原因" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="初始状态" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="报备类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="C类报备" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="otherPhone" align="center" label="备用电话" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="salesmanName" align="center" label="销售员" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="surveyorName" align="center" label="测量员" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="designerName" align="center" label="设计师" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="designerName" align="center" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderChannel" align="center" label="订单渠道" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderSourceId" align="center" label="订单来源" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createOrderTime" align="center" label="创建订单日期" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createOrderTime" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createOrderTime" align="center" label="指派测量时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createOrderTime" align="center" label="指派设计时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createOrderTime" align="center" label="合同签订日期" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="designerName" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
        </screencompon>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import screencompon from "@/views/order/components/screencompon"//筛选条件
import { listOrder } from 'api/order/order/order';

export default {
    components: {
        breadcrumb,
        screencompon,
    },
    data() {
        return {
            total: 0,
            orderType: 6,
            navList: [],
            btnlistdata: ["新增退货单","修改退货单","退货单作废","导出","打印"],//按钮列表
            tableData: [
                {orderStatus: 1},
                {orderStatus: ""},
            ],//表格数据
            tableSelectList: [],//选中数据
        }
    },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        let data = {
            page: this.$refs.screencompondata.currentPage,
            limit: this.$refs.screencompondata.pageSize,
            orderType: this.orderType,
        }
        listOrder(data).then(res =>{
            if(res.status == 200){
                this.total = res.data.total;
                this.tableData = res.data.rows;
            }
        }).catch(error =>{
            console.log('订单管理:订单列表 order/order/order.vue', error);
        })
    },
    methods: {
        searchfun(data){    //搜索
            console.log(data)
            listOrder(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableData = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
    },
}
</script>
<style lang="scss">
.customerorder{
    .order_btn_list{
        margin: 20px 0px;
        display: flex;
        flex-wrap: wrap;
        >button{
            margin: 5px;
        }
    }
}
</style>