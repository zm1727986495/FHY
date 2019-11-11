<template>
    <div class="applicainformation">
        
        <div v-if="activeval == 0">
            <el-table border :row-style="tableBodycolor" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabledata" style="width: 100%;" >
                <el-table-column prop="applyCode" align="center" width="200" label="申请单编号" sortable></el-table-column>
                <el-table-column prop="applyName" align="center" width="150" label="申请人"></el-table-column>
                <el-table-column prop="storeName" align="center" width="180" label="门店"></el-table-column>
                <el-table-column prop="applyTypeName" align="center" width="150" label="申请类型"></el-table-column>
                <el-table-column prop="applyTime" align="center" width="180" label="申请时间"></el-table-column>
                <el-table-column prop="applyStatus" align="center" width="120" label="审核状态">
                    <template slot-scope="scope">
                            <div v-if="scope.row.applyStatus == 0">待审核</div>
                            <div v-if="scope.row.applyStatus == 1">审核通过</div>
                            <div v-if="scope.row.applyStatus == 2">驳回</div>
                            <div v-if="scope.row.applyStatus == 3">审核中</div>
                            <div v-if="scope.row.applyStatus == 4">拒绝</div>
                        </template>
                </el-table-column>
                <el-table-column prop="auditName" align="center" width="150" label="审核人"></el-table-column>
                <!-- <el-table-column prop="contactsName" align="center" width="200" label="申请折扣额"></el-table-column> -->
            </el-table>
        </div>
        <div class="pagination_wrap">
            <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>
    </div>
</template>
<script>
import pagination from '@/views/components/pagination';
import { listOrderApplyAuthority } from 'api/order/order/orderdetails';
export default {
    components: {
        pagination
    },
    data() {
        return {
            activeval: 0,
            tablistone: ["折扣申请"],
            tabledata: [],
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 0,//总条数
            orderId: this.$route.query.orderId,
        }
    },
    created() {
        this.pleasefun(0)
    },
    methods: {
        pleasefun(val){
            let data = {
                orderId: this.orderId,
            }
            listOrderApplyAuthority(data).then(res => {
                if(res.status == 200) {
                    this.tabledata = res.data.rows;
                }
            }).catch(error => {
                console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
            })
        },
        butGroupActions(index) {
            this.pleasefun(index);
            this.activeval = index;
        },
        sizeChange(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize = val;
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            // this.getListData();
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //勾选函数回调
        handleSelectionChange(val){
           this.selections = val;
        },
    },
}
</script>
<style lang="scss">
    .applicainformation{
        .titlecals{
            top: 0;
        }
        .el-table{
            margin-top: 20px;
        }
    }
</style>