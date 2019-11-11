<template>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            row-key="id"
            :row-class-name="tableRowClassName"
            ref="topicTable">
            <el-table-column
            prop="name"
            align="center"
            label="收款单号"
            width="180"
            >
            <template slot-scope="scope">
                <div>
                    <el-tooltip placement="right" visible-arrow >
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems">退回</p>
                            <p class="operaItems">通过</p>
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip>
                    <p class="operation table_action_span" @click="listens">{{scope.row.name}}</p>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="客户名称">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="客户电话">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="收款金额">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="客户电话">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="收款金额">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="客户电话">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="收款金额">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="客户电话">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="address"
            label="收款金额">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
export default {
    data(){
        return{
            spot:spot,
            sel:'',
            tableData: [{
                id: 1,
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路'
                }, {
                id: 2,
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路'
                }, {
                id: 3,
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路',
                }, {
                id: 4,
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路'
            }]
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        edit(){

        },
        listens(){
            this.$emit("listen",true)
        }
    },
}
</script>
<style scoped>

</style>

