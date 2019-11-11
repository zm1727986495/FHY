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
                            label="采购单状态"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="是否执行完成"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="采购单号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="客户合同号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单类型"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="采购类型"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="到货方式"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="到货单号"
                            width="240" sortable align="center">
                        </el-table-column>

                        
                        <el-table-column
                            prop="name"
                            label="预计到货日期"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="所属导购"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="供应商"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="应收数量"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="货主"
                            width="240" sortable align="center">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="备注"
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
  // name: 'procurement',
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
  
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() {

        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };

        this.getList(data);

        

    },
	methods: {
       
       handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal1234");
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

