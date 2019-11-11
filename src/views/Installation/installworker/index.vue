<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card class="lvs m-bottom">
          <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="search_item">
                        <el-input placeholder="员工ID/姓名/手机号" v-model="worker.names" size="medium" maxlength="50">
                            <el-button slot="append" size="mini" icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                   
                    <div class="search_item">
                        <el-select v-model="worker.part" placeholder="所属部门" size="medium">
                            <el-option
                                v-for="item in partList" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    
                    <div class="search_item search_btn">
						<div class="operationbtns">
							<el-button class="button-fc" type="warning" size="medium"  @click="onSearch">查询</el-button>
							<el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
						</div>
					</div>
                </div>
            </div>
      </el-card>

		<el-card>
            
		
			<div class="btn_list_1">   
                <el-button size="small" class="button-96" @click="exportFun">导出</el-button>
			</div>    

            <orderlist
                v-if='isorderList' @submint-change = 'submintChange'>

            </orderlist>
			<!-- table表格 -->
			<div class="table_list lvs attribute m-top20">

				<el-table
					border
					:row-class-name="tableRowClassName"
					:row-style="tableBodycolor"
					@selection-change="handleSelectionChange"
					:data="tabList"
					style="width: 100%;"
                    @cell-click="clickStrategy">
                    <el-table-column type="selection" width="55"></el-table-column>

					<el-table-column
						prop="name"
						label="员工ID"
						sortable align="center">
                        <template slot-scope="scope">
                            <div>
                                <p class="operation table_action_span">{{scope.row.name}}</p>
                            </div>
                        </template>
					</el-table-column>

					<el-table-column
						prop="name"
						label="姓名"
						sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="性别"
						sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="年龄"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="级别"
						sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="手机号"
					    sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="所属部门"
						sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="任务数"
						sortable align="center">
                        <template slot-scope="scope">
                            <div>
                                <p class="operation table_action_span">{{scope.row.name}}</p>
                            </div>
                        </template>
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
      	</el-card>

    </div>
  
</template>
<script>

import pagination from '../../components/pagination';
import breadcrumb from "../../components/breadcrumb";
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
import orderlist from "./components/orderlist";//订单列表

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';

export default {
	components: {
		breadcrumb,
		pagination,
        accessory,
        orderlist
		// orderdetail,
		// contractdetails
	},
  // name: 'puniManagement',
	data() {
		return {
            navList: [],//头部面包屑
            isorderList: false,//指派测量设计开关

            worker: {},
            partList:[{
                label:"安装一部",value:1,
            },{
                label:"安装二部",value:2,
            },{
                label:"安装三部",value:3,
            },{
                label:"安装四部",value:4,
            },],
            visibleDialog: false,
   
       
            tabList: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],

            elsectVal: [], // 表格选中的数据
           
			
			// 分页
			currentPage:1,
			pageSize:10,
			total:100,
			
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
        // 点击表格里面的查看
        clickStrategy(row,column,event,cell) {
            
            // var id = row.priceStrategyId;
            if(column.label === "任务数"){
                this.isorderList = true;
                
            }
        },
        
        // 弹出框的提交 -- 子组件触发
        submintChange(item) {

            this.isorderList = false; // 关闭弹出框
        },
        
        // 导出
        exportFun() {

        },

		// 搜索条件获取
        searchdatas(){
            return {
                names: this.worker.names,//订单编号
               
				// orderStatusIds: this.orderStatus.join(","),//订单状态
		
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
		
		onSearch(){    //搜索
            let data = this.searchdatas();
            console.log(data);
            this.getList(data);
		},

		// 重置
        resetFun(){     
            this.worker = {},
			// this.names = '';
            this.searchData = [];

            let data = this.searchdatas();
            this.getList(data);
        },
        
        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableList = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
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
		// 表格勾选函数回调
		handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal1234");
        },
		// 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.elsectVal.length > 1){
                this.$message({
                    message: '只能选择一个订单 新增预算清单',
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
	 .warp_head_list{
		width: 100%;
		.list_top{
			width: 100%;
			display: flex;
			flex-wrap: nowrap;
			// justify-content: center;
			align-items: center;
				.search_item{
					margin: 10px 0px;
					padding: 0px 5px;
					width: 25%;
					>div{
						width: 100%;
					}
				}
			
		}
		
	}  
</style>

