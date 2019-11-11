<template>
    <div>
        <div class="queryForm">
            <el-row :gutter="10">
                <el-col :span="span">
                    <el-input class="ipts"  placeholder="订单编号"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" placeholder="客户名称"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" placeholder="建材城收据号"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" placeholder="内部收据号"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" placeholder="家装合同号"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" placeholder="收款单号"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-input class="ipts" placeholder="客户电话"></el-input>
                </el-col>
                <el-col :span="span">
                    <el-button size="medium" class="button-fc" type="warning">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="m-top20">
            <el-tabs type="border-card">
                <el-tab-pane label="不一致明细未确认" name="0">
                    <inconformity></inconformity>
                </el-tab-pane>
                <el-tab-pane label="未确认明细未确认" name="1">
                    <inexistence></inexistence>
                </el-tab-pane>
                <el-tab-pane label="对账单中不存在" name="2">
                    <unconfirm></unconfirm>
                </el-tab-pane>
            </el-tabs>
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
import pagination from "@/views/components/pagination";
import inconformity from './ShouldOutstanding/inconformity';
import inexistence from './ShouldOutstanding/inexistence';
import unconfirm from './ShouldOutstanding/unconfirm'
export default {
    components:{
        pagination,
        inconformity,
        inexistence,
        unconfirm
    },
    data(){
        return{
            span:6,
            currentPage:1,
            pageSize:10,
            total:10,
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.currentPage = val;
        //   this.getListData();
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        //   this.getListData();
        },
    },
}
</script>
<style scoped>

</style>
