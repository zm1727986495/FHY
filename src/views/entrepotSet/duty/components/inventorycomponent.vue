<template>
    <div class="ordercomponent">
        <!-- 查询条件组 -->
        <el-dialog  title="选择盘点单"  custom-class="customDialogTitle" :visible.sync="centerDialogVisible" width="70%" :before-close="closefun" >
            <div class="warp_head_list">
                <div class="list_top">
                    <div>
                        <el-input placeholder="订单号/合同号/采购合同号/商品名称/货位码" v-model="formline.textsearch" size="medium" class='width-100' @keydown.enter.native="searchFun"></el-input>
                    </div>
                    <div>
                        <el-date-picker size="medium" v-model="searchData" type="daterange" range-separator="-" value-format="yyyy-MM-dd" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style='width:100%'></el-date-picker>
                    </div>
                    <div>
                        <el-select v-model="formline.ownershipType" placeholder="所属仓库" size="medium" class="width-100" clearable filterable >
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-select v-model="formline.billType" placeholder="盘点方式" size="medium" class="width-100" clearable filterable >
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-select v-model="formline.billType" placeholder="盘点类型" size="medium" class="width-100" clearable filterable >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-select v-model="formline.billType" placeholder="盘点状态" size="medium" class="width-100" clearable filterable >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                            </el-option>
                        </el-select>
                    </div>

                    <div class="head_nav_datapick btns_center">
                        <el-button class="button-fc" type="warning" size="medium"  @click="searchFun">查询</el-button>
                        <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
                    </div>
                </div>
            </div>
            <div  class="table_list lvs attribute m-top20" v-loading="loading">
               <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" fixed='left' align="center" width="55"></el-table-column>
                    <el-table-column prop="blitemCode" align="center" label="盘点单号" width="200" sortable fixed='left'></el-table-column>
                    <el-table-column prop="storageName" align="center" label="所属仓库" width="200" sortable></el-table-column>
                    <el-table-column prop="status" align="center" label="状态" width="200" sortable>
                        <template slot-scope="scope">
                            <div>
                                <!-- //盘点状态//1待盘点 2盘点中 3盘点完成 -->
                                <p v-if="scope.row.status == 1">待盘点</p>
                                <p v-if="scope.row.status == 2">盘点中</p>
                                <p v-if="scope.row.status == 3">盘点完成</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="blitemDate" align="center" label="盘点日期" width="200" sortable></el-table-column>
                    <el-table-column prop="shouldBlitemAmount" align="center" label="应盘数量" width="200" sortable></el-table-column>
                    <el-table-column prop="blitemType" align="center" label="盘点类型" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>
                                <!-- //盘点类型 1.备货，2.订单 -->
                                <p v-if="scope.row.status == 1">备货</p>
                                <p v-if="scope.row.status == 2">订单</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="blitemName" align="center" label="盘点人" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" align="center" label="创建人" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" align="center" label="创建时间" width="200" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination_wrap">
                <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="handleSizeChange"
                    @currentChange="handleCurrentChange">
                </pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminbtn">确 定</el-button>
                <el-button @click="closefun">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import pagination from '@/views/components/pagination';

import { 
    listOrder, 
    listBaseDict,
} from 'api/order/order/order';

import {
    listBlitem, // 盘点的订单列表
} from "api/entrepotSet/duty/index";


  export default {
    components: {
        pagination,
    },
    data() {
        return {
            tableData:[],

            names: "",
            searchData: [], // 时间搜索
           
            
        
            options: [],

            formline: {
                textsearch: '',
                billType: '', // 盘点方式
                            // 盘点类型
                            // 盘点状态
            },
            
            loading: true, // table的loading控制
            total: 0,    // 总数
            pageSize: 5,  // 单页条数
            currentPage: 1, // 当前页
            tableSelectList: []
        };
    },
    // props: ["centerDialogVisible"],
    props: {
        centerDialogVisible: {
            type: Boolean,
        },
        orderId: {
            default() {
                return ''
            }
        },
    },
    filters: {
        // 千分号过滤方法
        // fenge(val){
        //     return (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',')
        // }
        fenge(amount) {
            const validateNumber = n =>
                !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;

            if (!validateNumber(+amount)) {
                return amount;
            }
            return (+amount)
                .toFixed(2)
                .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
        },
    },
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.orderdatafun(data);
        

    },
    mounted() {
    },
    watch: {
        tableData(val) {
            if(this.orderId) {
                this.$nextTick(() => {
                    if(this.orderId) {
                        // 如果已经选择orderId那么这个组件再次被打开 该条就会被选中
                        this.tableData.forEach(item => {
                            if(item.orderId == this.orderId) {
                                console.log(1111111111,"table中",item,"item");
                                
                                this.$refs.multipleTable.toggleRowSelection(item);
                            }
                        })
                    }
                });
            }
        }
    },
    methods: {
        getRowKeys(row) {
            return row.orderId;
        },
        // 搜索条件获取
        searchdatas(){
            return {
                // names: this.names,//订单编号
                // createTimeStart: this.searchData ? this.searchData[0] : "",//创建时间
                // createTimeEnd: this.searchData ? this.searchData[1] : "",

                // orderStatusIds: this.orderStatus.join(","),//订单状态
                page: this.currentPage,
                limit: this.pageSize,
            }
        },
        // 关闭弹窗
        closefun(){
            this.$emit("orderclosefun");
        },
        // 提交勾选
        subminbtn(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个盘点单',
                    type: 'warning'
                });
            } else if (this.tableSelectList.length < 1){
                this.$message({
                    message: '请进行选择',
                    type: 'warning'
                });
            } else {
                this.$emit("orderclosefun",this.tableSelectList)
            }
        },
        // 订单列表接口
        orderdatafun(data){
            listBlitem(data).then(res =>{ // 定责的盘点列表
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.loading = false;
                }
            }).catch(error =>{
                this.loading = false;
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        // 查询
        searchFun(){
            this.currentPage = 1;

            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        // 清空
        resetFun(){
            this.names = "";
            this.searchData = []
            this.orderStatus = [];
            this.currentPage = 1;

            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        // 单页条数改变
        handleSizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.orderdatafun(data);
        },

        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        handleSelectionChange(val){
            this.tableSelectList = val;

            console.log(val,"val order");
        },


    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
.ordercomponent{
    .warp_head_list{
        flex-wrap: wrap;
    }
    .btns_center {
        display: flex;
        flex-wrap: nowrap;
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
        .fontMore{
            color:#d0cfcf;
        }
        .btnone{
            margin-left: 10px;
        }
        .head_nav_btn{
            width: 100%;
            text-align: center;
            .fontMore{
                color:#d0cfcf;
            }
            .btnone{
                margin-left: 10px;
            }
        }
    }
}
</style>

