<template>
    <div class="customerorder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <!-- 补货单管理 -->
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
                        class="button-96" @click="benlistfun(itm)">
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
                        <el-table-column prop="subsidiaryNumber" align="center" label="单号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderNumber" align="center" label="主单号" width="200" sortable></el-table-column>
                        <el-table-column prop="orderType" align="center" label="单据类型" width="200" sortable>
                            <template slot-scope="scope">
                            <div v-if="scope.row.orderType == 0">正单</div>
                            <div v-if="scope.row.orderType == 1">增单</div>
                            <div v-if="scope.row.orderType == 2">补单</div>
                            <div v-if="scope.row.orderType == 3">遗留单</div>
                            <div v-if="scope.row.orderType == 4">备货采购单</div>
                            <div v-if="scope.row.orderType == 5">挑拨入库单</div>
                            <div v-if="scope.row.orderType == 6">退货入库单</div>
                            <div v-if="scope.row.orderType == 7">上样</div>
                            <div v-if="scope.row.orderType == 8">撤样</div>
                            <div v-if="scope.row.orderType == 9">手动</div>
                            <div v-if="scope.row.orderType == 10">退款</div>
                            <div v-if="scope.row.orderType == 11">换货</div>
                        </template>
                        </el-table-column>
                        <el-table-column prop="orderGoodsType" align="center" label="订单货品类型" width="200" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div v-if="scope.row.orderGoodsType == 1">成品</div>
                                <div v-if="scope.row.orderGoodsType == 2">定制</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="brandName" align="center" label="产品品牌" width="200" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="categoryName" align="center" label="品类" width="200" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderExpectMoney" align="center" label="合同金额/元" width="200" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{scope.row.orderExpectMoney | fenge}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="paymentAmount" align="center" label="实收金额/元" width="200" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{scope.row.paymentAmount | fenge}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="giftName" align="center" label="礼品名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="giftAmount" align="center" label="礼品数量" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="sendWay" align="center" label="赠送方式" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reportedType" align="center" label="报备类型" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="creported" align="center" label="c类报备" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerName" align="center" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="otherPhone" align="center" label="备用电话" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="salesmanName" align="center" label="销售员" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="businessName" align="center" label="业务员" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="surveyorName" align="center" label="测量员" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="designerName" align="center" label="设计师" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="storeName" align="center" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderChannelName" align="center" label="订单渠道" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderSourceName" align="center" label="订单来源" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createOrderTime" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="surveyor_assigned_time" align="center" label="指派测量时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="designer_assigned_time" align="center" label="指派设计时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="visit_time" align="center" label="自定义回访时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
        </screencompon>
        <!-- 弹框页面 -->
        <ordercomponent 
            v-if="centerDialogVisible" 
            :centerDialogVisible="centerDialogVisible" 
            @orderclosefun="orderclosefun">
        </ordercomponent>
    </div>
</template>
<script>
import ordercomponent from "../../components/ordercomponent";
import breadcrumb from "@/views/components/breadcrumb";
import screencompon from "@/views/order/components/screencompon"//筛选条件
import { listOrder, addInvalidOrderCancel } from 'api/order/order/order';
import { getUUID } from "api/pulicJava";

export default {
    components: {
        breadcrumb,
        screencompon,
        ordercomponent,
    },
    data() {
        return {
            centerDialogVisible: false,
            navList: [],
            btnlistdata: ["新增补货单","修改补货单","作废","下单","商品明细","附件管理","批量下载","导出",],//按钮列表
            tableData: [
                {orderStatus: 1},
                {orderStatus: ""},
            ],//表格数据
            tableSelectList: [],//选中数据
            total: 0,
            orderType: 2,
        }
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
            return (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',')
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
        orderclosefun(val){
            if(val && val.length > 0){
                console.log(val)
                getUUID({serialNumber: "RO"}).then(datas =>{
                    let data = {
                        orderType: 2,
                        orderId: val[0].orderId,
                        orderNumber: datas.data
                    }
                    if(datas.status == 200){
                        addInvalidOrderCancel(data).then(res =>{
                            if(res.status == 200){
                                this.centerDialogVisible = false;
                                this.$message.success("新增补单成功")
                                this.creafundata();
                            }
                        }).catch(error =>{
                            console.log('订单管理:新增补单 order/customerorder/index.vue', error);
                        })
                    }
                }).catch(error =>{
                    console.log('订单管理:新增订单 order/justOrder/addJustOrder.vue', error);
                })
            }else{
                this.centerDialogVisible = false;
            }
        },
        creafundata(){
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
                console.log('订单管理:订单列表 order/customerorder/index.vue', error);
            })
        },
        benlistfun(val){
            let orderdatas = this.tableSelectList[0]
            if(val === "新增补货单"){
                this.centerDialogVisible = true;
            }else if(val === "修改补货单"){
                if(this.newbudget()){
                    this.$router.push({path: "/ordermm/operateorder",query: {orderId: orderdatas.orderId, orderType: 2}})
                }
            }
        },
        newbudget(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个订单',
                    type: 'warning'
                });
                return false
            } else if (this.tableSelectList.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
                return false
            } else {
                return true
            }
        },
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