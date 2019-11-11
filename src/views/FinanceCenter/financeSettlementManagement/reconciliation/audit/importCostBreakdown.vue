<template>
    <div>
        <div>
            <div style="display:inline-block"><el-input placeholder="摘要" v-model="formList.costAbstract"></el-input></div>
            <div style="display:inline-block">费用类型：
                <el-select v-model="formList.costType">
                    <el-option v-for="(item,idx) in costType" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                </el-select>
            </div>
            <div style="display:inline-block;float:right;"><el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button></div>
        </div>
        <div class="m-top20">
            <el-table
            border
            :data="tableObj.tableData"
            :row-class-name="tableRowClassName"
            >
                <el-table-column show-overflow-tooltip align="center" prop="costName" label="费用类型"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="costAbstract" label="摘要"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="costMonth" label="费用月份"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="costMoney" label="费用金额"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="remarks" label="备注"></el-table-column>
            </el-table>
        </div>
        <div class="pagination_wrap">
            <pagination
                :current-page="formList.page"
                :pageSize="formList.limit"
                :total="tableObj.total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import { listSettlementDetailedVO } from '@/api/FinanceCenter/financeSettlementManagement/reconciliation/index';
import { listBaseDict } from "@/api/pulicJava"
export default {
    props:["tableObj"],
    components:{
        pagination
    },
    mounted() {
        listBaseDict({
            dataType:'CostType'
        }).then(res=>{
            this.costType=res.data;
        })
    },
    data(){
        return{
            currentPage:1,
            pageSize:10,
            span:6,
            formList:{
                page:1,
                limit:10,
                costAbstract:"",
                bmcSettlementId:this.$route.query.bmcSettlementId,
                costType:"",
            },
            costType:[]
        }
    },
    methods: {
        search(){
            this.formList.page=1;
            this.pages()
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        pages(){
            listSettlementDetailedVO(this.formList).then(res=>{
                this.tableObj.tableData=res.data.rows;
                this.tableObj.total=res.data.total;
            })
        },
        currentChange(val) {
            this.formList.page = val;
            this.pages();
        },
        sizeChange(val) {
            this.formList.page = 1;
            this.formList.limit = val;
            this.pages();
        },
    },
}
</script>
<style scoped>

</style>
