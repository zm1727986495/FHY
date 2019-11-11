<template>
    <div class="surveydesign">
        <ul class="ul_btn_list">
            <li :class="{'chanclas': activeval === index}"
            v-for="(item,index) in tablistone"
            :key="index"
            @click="butGroupActions(index)">{{item}}</li>
            <div class="clearfix"></div>
        </ul>
        <div v-if="activeval == 0">
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="assignedNumber" align="center" label="指派单号/变更单号" sortable></el-table-column>
                <el-table-column prop="assignedType" align="center" label="类型">
                    <!-- 0测量 1设计 -->
                    <template slot-scope="scope">
                        <div v-if="scope.row.assignedType=='0'">测量</div>
                        <div v-if="scope.row.assignedType=='1'">设计</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="contactsName" align="center" width="200" label="制单人"></el-table-column> -->
                <el-table-column prop="assignedName" align="center" label="原设计师"></el-table-column>
                <el-table-column prop="createTime" align="center" width="200" label="单据日期"></el-table-column>
                <el-table-column prop="assignedName" align="center" label="设计师"></el-table-column>
                <!-- 0待接受 1拒绝 2待汇报 3已汇报 -->
                <el-table-column prop="status" align="center" label="审核状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status=='0'">待接受</div>
                        <div v-if="scope.row.status=='1'">拒绝</div>
                        <div v-if="scope.row.status=='2'">待汇报</div>
                        <div v-if="scope.row.status=='3'">已汇报</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="activeval == 1">
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="assignedNumber" align="center" width="200" label="指派单号/变更单号" sortable></el-table-column>
                <el-table-column prop="assignedName" align="center" width="200" label="汇报人"></el-table-column>
                <el-table-column prop="createTime" align="center" width="200" label="单据日期"></el-table-column>
                <el-table-column prop="reportTime" align="center" width="200" label="汇报日期"></el-table-column>
                <el-table-column prop="assignedName" align="center" width="200" label="设计师"></el-table-column>
                <el-table-column prop="assignedName" align="center" width="200" label="测量师"></el-table-column>
                <el-table-column prop="status" align="center" label="审核状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status=='0'">待接受</div>
                        <div v-if="scope.row.status=='1'">拒绝</div>
                        <div v-if="scope.row.status=='2'">待汇报</div>
                        <div v-if="scope.row.status=='3'">已汇报</div>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" align="center" width="200" label="备注"></el-table-column>
            </el-table>
        </div>
        <div v-if="activeval == 2">
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="appointmentDoorTime" align="center" width="200" label="预约上门时间" sortable></el-table-column>
                <el-table-column prop="appointmentName" align="center" width="200" label="预约人"></el-table-column>
                <el-table-column prop="appointmentTime" align="center" width="200" label="预约时间"></el-table-column>
                <el-table-column prop="designerName" align="center" width="200" label="设计师"></el-table-column>
                <el-table-column prop="status" align="center" width="200" label="状态">
                    <template slot-scope="scope">
                        <!-- 0 待测量 1 以失败 2已成功 -->
                        <div v-if="scope.row.status=='0'">待测量</div>
                        <div v-if="scope.row.status=='1'">已失败</div>
                        <div v-if="scope.row.status=='2'">已成功</div>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" align="center" width="200" label="备注"></el-table-column>
            </el-table>
        </div>
        <div v-if="activeval == 3">
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="budgetNumber" align="center" label="预算清单编号"></el-table-column>
                <el-table-column prop="discountAmount" align="center" label="金额" show-overflow-tooltip></el-table-column>
                <el-table-column prop="designer" align="center" label="制单人"></el-table-column>
                <el-table-column prop="orderTime" align="center" label="报价日期"></el-table-column>
                <el-table-column prop="activityName" align="center" label="参与活动"></el-table-column>
                <el-table-column prop="designer" align="center"  label="设计师" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
        <div class="pagination_wrap">
            <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
        </div>
    </div>
</template>
<script>
import pagination from '@/views/components/pagination';
import {
listAssigned,//指派测量列表   和   测量设计汇报列表
listAppointmentByOrderId,//预约上门
listOrderBudget,//制作预算清单
} from 'api/order/order/orderdetails';

export default {
    components: {
        pagination
    },
    data() {
        return {
            tablistone: ["指派测量", "测量设计汇报", "预约上门时间", "制作预算清单"],
            activeval: 0,
            tabledata: [],
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 0,//总条数
            plearsdata: {
                orderId: this.$route.query.orderId
            },
        }
    },
    created() {
        console.log(this.activeval);
        this.creafun(this.activeval)
    },
    methods: {
        creafun(val){
            let data = {
                ...this.plearsdata,
                page:this.currentPage,
                limit:this.pageSize
            }
            //指派测量列表
            if(val == 0){
                listAssigned(data).then(res => {
                    console.log(res, "指派测量列表");
                    if(res.status == 200) {
                        this.tabledata = res.data.rows;
                        this.total = res.data.total;
                    }
                }).catch(error => {
                    console.log('订单详情:指派测量列表 order/order/components/ordFollow.vue', error);
                })

            }else if(val == 1){
                //测量设计汇报
                let query = {
                    ...data,
                    assignedType:'3'
                }
                listAssigned(query).then(res => {
                    console.log(res, "测量设计汇报");
                    if(res.status == 200) {
                        this.tabledata = res.data.rows;
                        this.total = res.data.total;
                    }
                }).catch(error => {
                    console.log('订单详情:测量设计汇报 order/order/components/ordFollow.vue', error);
                })

            }else if(val == 2){
                //预约上门
                listAppointmentByOrderId(data).then(res => {
                    console.log(res, "预约上门");
                    if(res.status == 200) {
                        this.tabledata = res.data.rows;
                        this.total = res.data.total;
                    }
                }).catch(error => {
                    console.log('订单详情:预约上门 order/order/components/ordFollow.vue', error);
                })
            }else if(val == 3){
                //制作预算清单
                listOrderBudget(data).then(res => {
                    console.log(res, "制作预算清单");
                    if(res.status == 200) {
                        this.tabledata = res.data.rows;
                        this.total = res.data.total;
                    }
                }).catch(error => {
                    console.log('订单详情:制作预算清单 order/order/components/ordFollow.vue', error);
                })

            }
        },
        butGroupActions(index) {
            this.activeval = index;
            this.creafun(index)
        },
        sizeChange(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize = val;
            this.creafun(this.activeval)
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            this.creafun(this.activeval)
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
    .surveydesign{
        .titlecals{
            top: 0;
        }
        .el-table{
            margin-top: 20px;
        }
    }
</style>