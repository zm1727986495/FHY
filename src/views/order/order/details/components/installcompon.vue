<template>
    <div class="installcompon lvs">
        <el-tabs type="border-card" v-model="defaultselecttwo" @tab-click="activecli(defaultselecttwo)">
            <el-tab-pane :label="item" v-for="(item, idx) in tablisttwo" :name="idx+''" :key="idx">
                <div>{{item}}</div>
                <ul class="datalist">
                    <li>首次安装时间 2016-01-06</li>
                    <li>汇报完成日期 2016-01-06</li>
                    <li>回访完成日期 2016-01-06</li>
                    <li>安装完成用时 2016-01-06</li>
                    <li>距今完成时间 2016-01-06</li>
                </ul>
                <el-steps :active="2" align-center>
                    <el-step title="当日完成" description=""></el-step>
                    <el-step title="1周期" description=""></el-step>
                    <el-step title="2周期" description=""></el-step>
                    <el-step title="3周期" description=""></el-step>
                    <el-step title="4周期" description=""></el-step>
                    <el-step title="4+周期" description=""></el-step>
                </el-steps>
            </el-tab-pane>
            <div class="tableclas">
                <el-table border key="1"
                    :row-style="tableBodycolor" 
                    :row-class-name="tableRowClassName" 
                    @selection-change="handleSelectionChange" 
                    :data="tabledata" style="width: 100%;" >
                    <el-table-column type="selection" width="40" fixed align="center"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="任务编号" sortable></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="任务上门时间"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="上门联系人"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="上门联系电话"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="安装状态"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="单元格数量"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="上门备注"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="派货数量"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="安装单类型"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="指派安装次数"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="日志汇报人姓名"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="日志内容"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="预计安装日期"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="首次派工安装日期"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="安装图"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="合同金额"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="服务类型"></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="派单员"></el-table-column>
                </el-table>
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
        </el-tabs>
    </div>
</template>
<script>
import pagination from '@/views/components/pagination';
export default {
    components: {
        pagination
    },
    data() {
        return {
            defaultselecttwo: 0,
            tablisttwo: ["安装任务列表", "安装预约日志", "安装工汇报日志", "安装改制日志", "安装赔偿日志", "定责申请日志", "退货退款信息日志", "返厂信息", "库房出库日志", "评价"],
            tabledata: [],
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 0,//总条数
        }
    },
    methods: {
        activecli(val){

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
    .installcompon{
        .datalist{
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 20px;
            li{
                color: #ff0000c5;
                flex: 1;
                margin-right: 20px;
            }
        }
        .tableclas{
            margin-top: 20px;
        }
    }
</style>