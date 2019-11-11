<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card>
		
			<div class="btn_list_1">
                <el-button size="small" class="button-96" @click="addFun">新增第三方单</el-button> 
				<el-button size="small" class="button-96" @click="editFun">编辑第三方单</el-button>
                <el-button size="small" class="button-96" @click="ponitFun">指派</el-button> 
				<el-button size="small" class="button-96" @click="scrapFun">作废</el-button>
                <el-button size="small" class="button-96" @click="exportFun">导出</el-button>
			</div>    

            <!-- 指派 -->
			<el-dialog
				:visible.sync="pointVisible"
				width="20%">		
                    <div class="titlecals martop">指派任务</div>
					<el-form ref="form" :model="form" label-width="80px" >
                              
                        <el-form-item label="">
                            <el-checkbox-group v-model="form.task" class="ponitdialog" @change="changehandle">
                                <el-checkbox label="仓储入库任务" name="type"></el-checkbox>
                                <el-checkbox label="安装任务" name="type"></el-checkbox>
                                <el-checkbox label="物流任务" name="type"></el-checkbox>
                                <el-checkbox label="售后任务" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                            <el-button  @click="cancle">取消</el-button>
                        </el-form-item>

                    </el-form>
			</el-dialog>

            <!-- 
                附件管理组件
                orderId：订单id 不传默认为空
                accessoryTypes：(传Number类型)附件类型(根据模块传对应的参数)不传默认为1 
            -->
            <el-dialog :visible.sync="visibleDialog" width="960px">
                <accessory 
                    v-if="visibleDialog" 
                    :orderId="orderId" 
                    :accessoryTypes="accessoryTypes">
                </accessory>
            </el-dialog>

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
						label="订单编号"
						width="240" sortable align="center">
                        <template slot-scope="scope">
                            <div>
                                <p class="operation table_action_span">{{scope.row.name}}</p>
                            </div>
                        </template>
					</el-table-column>

					<el-table-column
						prop="name"
						label="状态"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="订单类型"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="负责安装部"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="安装类型"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="品牌"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="品类"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="预计安装日期"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="客户姓名"
						width="240" sortable align="center">
					</el-table-column>

					
					<el-table-column
						prop="name"
						label="联系方式"
						width="240" sortable align="center">
					</el-table-column>

					<el-table-column
						prop="name"
						label="地址"
						width="240" sortable align="center">
					</el-table-column>

                    <el-table-column
						prop="name"
						label="备用电话"
						width="240" sortable align="center">
					</el-table-column>

                    <el-table-column
						prop="name"
						label="订单来源"
						width="240" sortable align="center">
					</el-table-column>

                    <el-table-column
						prop="name"
						label="附件"
						width="240" sortable align="center">
                        <template slot-scope="scope">
                            <div>
                                <p class="operation table_action_span" >查看</p>
                            </div>
                        </template>
					</el-table-column>

                    <el-table-column
						prop="name"
						label="创建时间"
						width="240" sortable align="center">
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

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';

export default {
	components: {
		breadcrumb,
		pagination,
        accessory,
		// orderdetail,
		// contractdetails
	},
  // name: 'puniManagement',
	data() {
		return {
            navList: [],//头部面包屑
     
            // 指派操作按钮的值
            form: {
                task: [],
            },
            visibleDialog: false,
    
            pointVisible: false,
            orderId: "",
            accessoryTypes: 8,
     
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
        // 点击表格里面的查看
        clickStrategy(row,column,event,cell) {
            console.log(row,"row")
            
            // var id = row.priceStrategyId;
            if(column.label === "附件"){
                this.visibleDialog = true;
                
            }
        },
        changehandle(val) {
            console.log(val);
        },
        // 新增第三方单
        addFun() {

        },
        // 编辑第三方单
        editFun() {

        },
        // 指派
        ponitFun() {
            this.pointVisible = true;
        },
        // 作废
        scrapFun() {

        },
        // 导出
        exportFun() {

        },
        // 指派任务弹出框的确定按钮
        onSubmit() {
            this.form.task = [];
            this.pointVisible = false;
        },
        // 取消按钮
        cancle() {
            this.form.task = [];
            this.pointVisible = false;
        },

        printFun() {
            this.$router.push({
                path: 'punishrecord',
                // query: {
                //     activityId: row.activityId
                // }
            });
        },
		// 搜索条件获取
        searchdatas(){
            return {
                names: this.punish.names,//订单编号
                createTimeStart: this.searchData[0],//创建时间
				createTimeEnd: this.searchData[1],
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
            this.punish = {},
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
        // 时间的数据处理
        dataChange(type,dates) {
            if(type == 'punish'){
                this.punish.startTime = this.searchData ? this.searchData[0]:"";
                this.punish.endTime = this.searchData ? this.searchData[1]:"";
            }
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
	.ponitdialog {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        >label {
            width: 80%;
        }
    }
</style>

