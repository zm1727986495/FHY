<template>
    <div class="tableimgcomp">
        <div class="excepboxlist">
            <slot></slot>
            <div class="">
                <el-table border :data="tableData" tooltip-effect="dark"
                    :row-class-name="tableRowClassName">
                    <el-table-column prop="orderStatus" align="center" label="客户订单号" sortable></el-table-column>
                    <el-table-column prop="customerName" align="center" label="采购合同号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="柜身" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="门板" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="备注" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            <div class="imgtitle">图片</div>
            <ul class="imglist">
                <li>图片</li>
                <li>图片</li>
                <li>图片</li>
                <li>图片</li>
                <li>图片</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData:[{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },
            ],
            tableSelectList: [],
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
        }
    },
    methods: {

        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList);
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            let data = {
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    },
}
</script>
<style lang="scss">
.tableimgcomp{
    margin-bottom: 20px;
    .excepboxlist{
        .titlecals{
            top: 0px;
            margin-bottom: 20px;
        }
        .imgtitle{
            font-size: 17px;
            font-weight: 600;
            color: #006EC7;
            margin: 10px;
        }
        .imglist{
            display: flex;
            li{
                margin: 5px;
                width: 100px;
                height: 100px;
                background: #eeeeee;
            }
        }
    }
    .titlecals{
        top: 0px;
        margin-bottom: 20px;
    }

}
</style>

