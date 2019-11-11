<template>
<!-- 退货退款 and 换货的Table -->
    <div class="refunddetail">
        
            
    <!-- table表格 -->
    <div class="table_list lvs attribute">
        <el-table
            border
            :row-class-name="tableRowClassName"
            :row-style="tableBodycolor"
            @selection-change="handleSelectionChange"
            :data="tabList"
            style="width: 100%;">
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column
                prop="name"
                width="240"
                label="房间"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="商品编码"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="名称"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="品牌"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="品类"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="型号"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="系列"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="材质"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="颜色"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="单位"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="宽"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="高"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="深"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="厚"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="计价方式"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="单价"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="非标系数"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="数量"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="原价"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="折扣率"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="活动价"
                sortable align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                width="240"
                label="备注"
                sortable align="center">
            </el-table-column>

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

  export default {
    components: {
        pagination
    },
    data() {
        return {
            //  表格
            elsectVal:[],//选中框
            tabList:[{
				name:'胖虎',
			},{
				name:'胖虎',
			},{
				name:'胖虎',
			},{
				name:'胖虎',
			},{
				name:'胖虎',
            },],//table数据
            
            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//总页数
            total: 100,//总条数
        };
    },
    props: [],
    mounted() {
        
    },
    
    created() {
		let data = {
			page: this.currentPage,
			limit: this.pageSize,
		};
		this.getList(data);

	},
    methods: {
       // 搜索条件获取
        searchdatas(){
            return {
                // names: this.names, 
                // searchData: this.searchData[0], 
                // dutyReason: this.dutyReason[0],
                // dutyType: this.dutyType[0], 
                // goodsSource: this.goodsSource[0],
		
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
        
        
		
		// 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.pageSize = val;
            let data = this.searchdatas();
            this.getList(data);
		},

        // 获取表格数据
		getList(data){
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

        // 表格勾选函数回调
		handleSelectionChange(val) {
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
        
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
        //   return "height: 80px";
        },
    },
  };
</script>

<style lang="scss" scoped>
    .refunddetail {
        .refundtable {
           
           
          
        }
            
    }
</style>



