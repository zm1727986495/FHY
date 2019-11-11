<template>
    <div class="followRecord">

        
			<div class="table_list lvs attribute m-top20" v-loading="loading">
				<el-table
					border
					:row-class-name="tableRowClassName"
					:data="tableList"
					style="width: 100%"
					@selection-change="handleSelectionChange">
                    <el-table-column label="回访时间" prop="recordTime" sortable align="center"></el-table-column>
                    <el-table-column label="回访备注" prop="remark" sortable  align="center"></el-table-column>
                    <el-table-column label="跟进人"  prop="recordName" sortable  align="center"></el-table-column>
                    <el-table-column label="再回访时间"  prop="againRecordTime" sortable  align="center"></el-table-column>
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
import {
  listCustomerServiceRecord, // table数据
} from 'api/administrationCenter/administrativeservice/index';
import pagination from "@/views/components/pagination";

export default {
    name: 'followRecord',
    props: [],
        
    data() {
        return {
            elsectVal: [], // table表单 勾选属性
            tableList: [],
            loading: true, // table的loading控制
            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//总页数
            total: 100,//总条数
        };
    },
    components: {
        pagination,
    },
    created() {
        
        let data = this.searchdatas();
        this.getList(data);
    },
    mounted() {
        // 代收款--获取表格数据
        // this.getListData();
    },
    methods: {
        getRowKeys(row) {
            return row.customerServiceId;
        },
        // table 颜色切换
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },

        //勾选函数回调
		handleSelectionChange(val) {
			this.elsectVal = val;
			console.log(this.elsectVal,"this.elsectVal");
			
        },
        // 搜索条件获取
        searchdatas(){
            return {
                customerServiceId: this.$route.query.customerServiceId,
                page: this.currentPage,
                limit: this.pageSize,
            };
		},

        // 搜索
        searchFun(){   
            this.currentPage = 1;
            let data = this.searchdatas();

            console.log(data);
            this.orderdatafun(data);
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

        // 获取表格数据
		getList(data){
            listCustomerServiceRecord(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableList = res.data.rows;
                    this.loading = false;
                }
            }).catch(error =>{
                console.log('行政中心:客服回访 views/administrationCenter/administrativeservice/custservice/components/followRecord', error);
            })
        },



    }
};
</script>
<style scoped lang="scss">
    .table_list{
        margin: 0 auto;
    }
</style>