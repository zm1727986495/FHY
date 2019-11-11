<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="searchIpts">
                <el-input placeholder="订单号/客户名称/客户电话/收款单号/内部收据号/建材城收据号/家装合同号" class="orderinp">
                    <el-button slot="append" size="mini" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            <el-button class="button-fc fr" type="warning" size="medium">查询</el-button>
        </el-card>
        <div class="m-top20">
            <el-card>
            <el-tabs type="border-card" >
                <el-tab-pane label="待审核" name="0">
                    <el-table
                        :data="tableData"
                        style="width: 100%;"
                        border
                        row-key="id"
                        :expand-row-keys="expands"
                        :row-class-name="tableRowClassName"
                        :cell-style="cellStyle" :header-cell-style = "cellStyle"
                        @row-click="rowClick"
                        ref="topicTable">
                        <el-table-column
                        align="center"
                        fixed
                        type="selection">
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        align="center"
                        label="收款单号"
                        width="160"
                        fixed
                        >
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="auditClick">审核</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <p class="operation table_action_span" @click="jumpList">{{scope.row.name}}</p>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        align="center"
                        type="expand"
                        width="20px"
                        >
                            <template slot-scope="scope">
                                <el-table
                                :data="tableData"
                                style="width: 100%;"
                                :row-class-name="tableRowClassName"
                                border
                                row-key="id">
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
                                    label="客户名称">
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
                                    label="客户名称">
                                </el-table-column>
                            </el-table>
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
                        label="声音金额">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="录入人">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="录入时间">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="收款类型">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="收款方式">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="所属门店">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="所属摊位">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="实收门店">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="实收摊位">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="内部收据号">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="提交人">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="提交时间">
                        </el-table-column>
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
                </el-tab-pane>
                
                <el-tab-pane label="已审核" name="1">
                    <el-table
                        :data="tableData"
                        style="width: 100%;"
                        border
                        row-key="id"
                        :expand-row-keys="expands"
                        :row-class-name="tableRowClassName"
                        :cell-style="cellStyle" :header-cell-style = "cellStyle"
                        @row-click="rowClick"
                        ref="topicTable">
                        <el-table-column
                        align="center"
                        type="selection">
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        align="center"
                        label="收款单号"
                        width="160"
                        >
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="auditClick">审核</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <p class="operation table_action_span" @click="jumpList">{{scope.row.name}}</p>
                            </div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        align="center"
                        type="expand"
                        width="20px"
                        >
                            <template slot-scope="scope">
                                <el-table
                                :data="tableData"
                                style="width: 100%;"
                                :row-class-name="tableRowClassName"
                                border
                                row-key="id">
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
                                    label="客户名称">
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
                                    label="客户名称">
                                </el-table-column>
                            </el-table>
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
                        label="声音金额">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="录入人">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="录入时间">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="收款类型">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="收款方式">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="所属门店">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="所属摊位">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="实收门店">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="实收摊位">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="内部收据号">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="提交人">
                        </el-table-column>
                        <el-table-column
                        width="180"
                        align="center"
                        prop="address"
                        label="提交时间">
                        </el-table-column>
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
                </el-tab-pane>
            </el-tabs>
        </el-card>
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import spot from '@/assets/images/spot.png';
export default {
    components:{
        breadcrumb,
        pagination
    },
    mounted() {
    // 头部面包屑
        this.navList = this.$route.meta;
        // 代收款--获取表格数据
        // this.getListData();
    },
    data(){
        return{
            currentPage:1,
            pageSize:10,
            total:10,
            spot:spot,
            navList: [],
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
            }],
            expands:[],
        }
    },
    methods:{
        jumpList(){
            this.$router.push({
                path:'creditCheck'
            })
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 1){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        auditClick(){
            this.$router.push({
                path:"gatheringinformation"
            })
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
        rowClick(row){
            console.log(row);
            if (this.expands.indexOf(row.id) < 0) {
                    this.expands = [];
                    this.expands.push(row.id);
                } else {
                    let arr = this.expands.indexOf(row.id);
                    this.expands.splice(arr,1);
                }
        }
    }
}
</script>
<style scoped>
    .searchIpts{
        width: 40%;
        display: inline-block;
    }
    .orderinp {
      max-width: 420px;
    }
</style>