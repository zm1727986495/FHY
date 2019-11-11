<template>
    <div class="assignmeasure">
        <el-dialog
            :visible.sync="isorderList" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false"
            width="74%">
            <div class="titlecals">查看安装任务</div>
            <div>
                <div class="warp_head_list">
                    <div class="list_top">
                            <div class="head_nav_search">
                                <el-input
                                    placeholder="客户姓名/客户电话"
                                    v-model="form.names"
                                    size="medium"
                                    maxlength="50">
                                    <el-button slot="append" size="mini" icon="el-icon-search"></el-button>
                                </el-input>
                            </div>
                    
                            <div class="head_nav_btn">
                                <el-button size="medium" class="button-fc" @click="searchFun">查询</el-button>
                                <el-button type='primary' size="medium" @click="resetFun">重置</el-button>
                            </div>
                    </div>
                </div>


               <div class="order_table">
                <el-table
					border
					:row-class-name="tableRowClassName"
					:row-style="tableBodycolor"
					@selection-change="handleSelectionChange"
					:data="tableData"
					style="width: 100%;">

					<el-table-column type="selection" width="55"></el-table-column>

					<el-table-column
						prop="name"
						label="合同号"
						sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="任务号单号"
						 sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="订单号"
						 sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="预约上门时间"
						 sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="客户地址"
						sortable align="center" show-overflow-tooltip >
					</el-table-column>

					<el-table-column
						prop="name"
						label="客户姓名"
						sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="手机号"
						sortable align="center" show-overflow-tooltip >
					</el-table-column>

					<el-table-column
						prop="name"
						label="任务类型"
						sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="任务状态"
						sortable align="center">
					</el-table-column>
                   
      
				</el-table>    

            </div>
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
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitBtn">提交</el-button>
                <el-button  @click="colseBtn">取消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import { listOrder,listBaseDict } from 'api/order/order/order';
import pagination from '../../../components/pagination';
  export default {
    components:{
        pagination
    },
    data() {
        return {
            currentPage: 1,//当前页数
            pageSize: 10,//当前页最大条数
            total: 0,//总条数
            names: '',//搜索姓名

            tableData:[],
            tableSelectList:[],
            isShow:false,
            form: {},
            isorderList: true,
        };
    },
    props: {},
    created() {
       this.getList()
     
    },
    mounted() {
       
    },
    methods: {
       
        //搜索
        searchFun(){    
            this.getList()
        },
        // 重置
        resetFun(){
            this.names= '' // 条件搜索
            
        },
        
      
       getList(){//获取订单列表
            // let data = {
            //     names: this.searchtext,
            //     createTimeStart: this.searchData[0],
            //     createTimeEnd: this.searchData[1],
            
            //     page: this.currentPage,
            //     limit: this.pageSize,
            // };
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
       },
       
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
			// return "height: 80px";
		},
       
        handleSelectionChange(val){//勾选
            this.tableSelectList = val;
        },
        
        sizeChange(val) {//单页条数改变方法
            this.currentPage = 1;
            this.pageSize = val;
            this.getList()
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            this.getList()
        },
        // 提交按钮
        submitBtn () {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

            // 表格数据
            this.$emit( "submint-change")

        },
        colseBtn(){
            this.$emit( "submint-change", "");
        },
    },
     
  };
</script>

<style lang="scss" scoped>
    
    .warp_head_list{
        width:80%;
        .list_top{
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            .head_nav_search{
                width: 40%;
            } 
            .head_nav_btn{
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        } 
    }   
    .order_table {
        margin-top: 20px;
    }
    
    body .el-table th.gutter{
        display: table-cell!important;
    }

    
</style>

