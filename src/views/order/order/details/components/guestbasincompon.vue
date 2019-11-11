<template>
    <div class="guestbasincompon lvs">
        <div class="titlecals">客盆</div>
        <div>
            <el-table border
                :row-style="tableBodycolor" 
                :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" 
                :data="tabledata" style="width: 100%;" >
                <el-table-column prop="contactsName" align="center" width="200" label="房间号" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="产品款型" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="名称款式" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="数量" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="单价" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="计价方式" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="小计" sortable></el-table-column>
                <el-table-column prop="contactsName" align="center" width="200" label="备注" sortable></el-table-column>
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

export default {
    components: {
        pagination
    },
    data() {
        return {
            tabledata: [],
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 0,//总条数
        }
    },
    created() {
        
    },
    props: ["defaultselectone"],
    methods: {
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
    .guestbasincompon{
        .titlecals{
            top: 0;
        }
    }
</style>