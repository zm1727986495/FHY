<template>
    <div class="goodslist">

        <div class="iconBox m-bottom">
            <i class="Icon"></i>
            <span>商品清单</span>
        </div>
        <div class="list_top">
            <div>
                <el-input placeholder="商品编码/商品名称/供应商" v-model="orderGroup" size="medium" maxlength="50"></el-input>
            </div>
            <div class="head_nav_datapick">
                <el-button class="button-fc" type="warning" size="medium"  @click="onSearch">查询</el-button>
            </div>
        </div>
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20">
            <el-table
                border
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column  prop="commodityCode" label="商品编码"  width="240" sortable align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="commodityName" label="商品名称" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="constructionPeriod" label="工期" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="onePrice" label="单价"  width="240" sortable align="center"></el-table-column>
                <el-table-column prop="amount" label="数量" width="240" sortable align="center"></el-table-column>
                <el-table-column prop="classifyName" label="商品分类" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="companyName" label="供应商" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="color" label="颜色"  width="240" sortable align="center"></el-table-column>
                <el-table-column prop="material" label="材质" width="240" sortable align="center"></el-table-column>
                <el-table-column  prop="series" label="系列"  width="240" sortable align="center"></el-table-column>
            </el-table>    
        </div>
        <!-- 分页 -->
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
import breadcrumb from "@/views/components/breadcrumb";

import spot from "@/assets/images/spot.png";

import {
    listOrderCommodity, // table
} from 'api/marketing/projectpermit/index';

export default {
    components: {
       pagination
    },
    // name: 'brandmanagement',
    data() {
        return {
            orderGroup: '', // 
            // 表格数据
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据

            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,

        };
    },
    props: ["orderId"],
    created() {
        let data = this.searchdatas();
        
        this.getList(data);
    },
    watch: {
        orderId: function(val,attr) {
            console.log(val,attr,"商品清单的orderId");

            let data = this.searchdatas();
            this.getList(data);
        }
    },
    methods: {
        onSearch() {
            this.currentPage = 1;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
       // 分页函数回调
        currentChange(val) {
			this.currentPage = val;
			
            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
			this.currentPage = 1;

            this.pageSize = val;
            let data = this.searchdatas();
            this.getList(data);
		},
		// 表格勾选函数回调
		handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal1234");
        },
		// 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.elsectVal.length > 1){
                this.$message({
                    message: '抱歉，只能选择一个',
                    type: 'warning'
                });
                return;
            } else if (this.elsectVal.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
                return;
            }
            return true;
        },
		// 搜索条件获取
        searchdatas(){
            return {
                orderId: this.orderId , // 订单ID
                showType: 1, //  默认传1

                orderGroup: this.orderGroup, //订单编号

                page: this.currentPage,
                limit: this.pageSize,
            };
		},

        // 获取表格数据
		getList(data){
            listOrderCommodity(data).then(res => {
                if(res.status == 200) {
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 获取可申请天数 marketing/components/application/components/urgentapply.vue', err);
            })
        },

	

        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
    }
};
</script>
<style scoped lang='scss'>
    .goodslist {
        .list_top{
            display: flex;
            flex-wrap: nowrap;
            width: 35%;
            .head_nav_datapick {
                margin-left: 12px;
            }
        }
    }
</style>

