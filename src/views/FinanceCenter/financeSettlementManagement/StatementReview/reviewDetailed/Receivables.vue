<template>
    <div>
        <div class="m-top20">
            <div>
                <el-table
                border
                :row-class-name="tableRowClassName"
                :data="data">
                    <el-table-column width="220" prop="data" fixed align="center" label="应收款方">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems">编辑收款</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <span class="table_action_span" >{{scope.row.data}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="180" prop="data" label="应收金额">
                    </el-table-column>
                    <el-table-column align="center" prop="data" label="结算系数"></el-table-column>
                    <el-table-column align="center" prop="data" label="实际应收金额"></el-table-column>
                    <el-table-column align="center" prop="data" label="采购单数量"></el-table-column>
                    <el-table-column align="center" prop="data" label="收款方式"></el-table-column>
                    <el-table-column align="center" prop="data" label="收款账号"></el-table-column>
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
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
export default {
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            radio:"0",
            currentPage:1,
            pageSize:10,
            total:10,
            spot:spot,
            data:[
                {
                    data:1,
                    id:1
                },
                {
                    data:2,
                    id:1
                },
                {
                    data:3,
                    id:2
                },
                {
                    data:4,
                    id:2
                },
                {
                    data:5,
                    id:4
                },
                {
                    data:6,
                    id:5
                }
            ],
            spanArr:[],
            pos:0,
        }
    },
    mounted() {
        this.getSpanArr(this.data)
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
        // 计算跨列（按房源）
        spanMethodByHouse({ row, column, rowIndex, columnIndex }){
            if(columnIndex <= 3){
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        getSpanArr(data){
            this.spanArr = [];
            for (var i = 0; i < data.length; i++){
                if(i === 0){
                    this.spanArr.push(1);
                    this.pos = 0;
                }else{
                    if (data[i].id=== data[i - 1].id){
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    }else{
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
    },
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
</style>
