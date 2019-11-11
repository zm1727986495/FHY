<template>
    <div class="simTable table_list unsortable">
        <el-table border :data="tableObj.tableData">
            <el-table-column width="100" show-overflow-tooltip align="center" label="采购单状态">
                <template slot-scope="scope">
                    <div>
                        成功
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="180" show-overflow-tooltip prop="purchaseNumber" align="center" label="采购单号"></el-table-column>
            <el-table-column width="180" show-overflow-tooltip prop="contractSerialNumber" align="center" label="客户合同号"></el-table-column>
            <el-table-column width="180" show-overflow-tooltip prop="purchaseContractCode" align="center" label="采购合同号"></el-table-column>
            <el-table-column width="180" show-overflow-tooltip prop="orderNumber" align="center" label="订单号"></el-table-column>
            <el-table-column width="100" show-overflow-tooltip prop="orderTypeName" align="center" label="订单类型"></el-table-column>
            <el-table-column width="180" show-overflow-tooltip prop="createOrderTime" align="center" label="下单时间"></el-table-column>
            <el-table-column width="100" show-overflow-tooltip prop="createOrderAt" align="center" label="下单人"></el-table-column>
            <el-table-column width="180" show-overflow-tooltip prop="splitOrderTime" align="center" label="拆单时间"></el-table-column>
            <el-table-column width="100" show-overflow-tooltip prop="splitOrderAt" align="center" label="拆单人"></el-table-column>
            <el-table-column width="400px" show-overflow-tooltip prop="remark" align="center" label="备注"></el-table-column>
        </el-table>
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
import pagination from '@/views/components/pagination';
import { listPurchaseOrderBatchDataSuccess } from '@/api/administrationCenter/purchaseOrderAccountCheck/index';
export default {
    components:{
        pagination
    },
    props:["tableObj","purchaseOrderBatchId"],
    data(){
        return{
            formList:{
                page:1,
                limit:10,
                purchaseOrderBatchId:''
            }
        }
    },
    methods: {
        pages(){
            this.formList.purchaseOrderBatchId=this.purchaseOrderBatchId;
            listPurchaseOrderBatchDataSuccess(this.formList).then(res=>{
                this.tableObj.total=res.data.total;
                this.tableObj.tableData=res.data.rows;
            })
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        }
    },
}
</script>