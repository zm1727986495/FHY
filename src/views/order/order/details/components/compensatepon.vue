<template>
    <div class="compensatepon">
        <div class="list_top">
            <div>
                <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50"></el-input>
            </div>
            <div>
                <el-date-picker
                    prefix-icon="el-icon-date"
                    size="medium" v-model="searchData" type="datetimerange" 
                    value-format='yyyy-M-dd' format='yyyy-M-dd' 
                    range-separator="-"
                    start-placeholder="选择创建订单时间" end-placeholder="选择创建订单时间">
                </el-date-picker>
            </div>
            <div>
                <el-select v-model="orderStatus" multiple placeholder="选择状态" size="medium">
                    <el-option
                        v-for="item in stateList" :key="item.value"
                        :label="item.dictName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="head_nav_datapick">
                <el-button @click="searchfun" type="warning" class="button-fc" size="medium">查询</el-button>
                <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
            </div>
        </div>
        <div class="tableclas">
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column type="selection" width="40" fixed align="center"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="赔偿类型" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="定责对象"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="责任人姓名"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="赔偿金额"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="赔偿方式"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="收款银行账号"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="开户名"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="礼品清单"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="赔偿原因"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="汇报人"></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="汇报时间"></el-table-column>
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
            names: "",
            searchData: [],
            stateList: [],
            orderStatus: "",
            tabledata: [],
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 0,//总条数
        }
    },
    methods: {
        searchfun(){

        },
        resetFun(){
            
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
.compensatepon{
    .list_top,.list_bottom{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        >div{
            margin: 10px 0px;
            padding: 0px 5px;
            width: 25%;
            >div{
                width: 100%;
            }
        }
    }
    .tableclas{
        margin-top: 20px;
    }
}
</style>