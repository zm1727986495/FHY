<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card class="lvs">
            <querycompon @searchfun ="getList"  :total="total">
                <!-- table表格 -->
                <div class="table_list lvs attribute m-top20">

                    <el-table
                        border
                        :row-class-name="tableRowClassName"
                        :row-style="tableBodycolor"
                        @selection-change="handleSelectionChange"
                        :data="tabList"
                        style="width: 100%;">

                        <el-table-column type="selection" width="55"></el-table-column>

                        <el-table-column
                            prop="name"
                            label="库取状态"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="是否执行完成"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="库取单号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="所属库房"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="房间"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="库取单金额"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="实际结算金额"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="预计交付日期"
                            width="240" sortable align="center">
                        </el-table-column>

                        
                        <el-table-column
                            prop="name"
                            label="客户合同号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="客户姓名"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="客户电话"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="所属门店"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="销售员"
                            width="240" sortable align="center">
                        </el-table-column>
                        

                        <el-table-column
                            prop="name"
                            label="订单地址"
                            width="240" sortable align="center">
                        </el-table-column>

                    </el-table>    

                </div>
            </querycompon>
			
      	</el-card>

    </div>
  
</template>
<script>


import breadcrumb from "../../../components/breadcrumb";
import querycompon from '../components/querycompon';

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';

export default {
	components: {
		breadcrumb,
        querycompon
        
	},
  // name: 'librariestake',
	data() {
		return {
            navList: [],//头部面包屑
    
            // 查询条件
            total: 10,

            elsectVal: [], // 表格选中的数据
            tabList:[{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            },], // 表格数据
			
			
		};
	},
  
    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };

        this.getList(data);
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
	// mounted() {
	// // 头部面包屑
	// 	this.navList = this.$route.meta;
	// },
	// created() {

    //     let data = {
    //         page: this.currentPage,
    //         limit: this.pageSize,
    //     };

    //     this.getList(data);

        

    // },
	methods: {
       
       handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
		
        
        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tabList = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
	

        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},

		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
			// return "height: 80px";
		},



	}
};
</script>
<style scoped lang='scss'>


</style>

