<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- <div class="pageTitle">查询条件</div> -->
        <!-- 查询条件组 -->
			<el-card class="m-bottom">
					<div class="warp_head_list">
							<div class="list_top">
									<div class="search_item">
											<el-input placeholder="报废单号/订单号/采购单" v-model="text" size="medium" maxlength="50"  @keydown.enter.native="onSearch"></el-input>
									</div>
									<div class="search_item">
											<el-date-picker
													size="medium" v-model="searchData" type="daterange" 
													value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
													range-separator="-"
													start-placeholder="年/月/日" end-placeholder="年/月/日">
											</el-date-picker>
									</div>
									<!-- <div class="search_item">
											<el-select v-model="scrapReason" multiple placeholder="报废原因" size="medium" >
													<el-option
															v-for="item in reasonList" :key="item.value"
															:label="item.dictName" :value="item.id">
													</el-option>
											</el-select>
									</div> -->
									<div class="search_item">
											<el-select v-model="scrapApplyType"  placeholder="报废类型" size="medium"  clearable filterable >
													<el-option
															v-for="item in typeList" :key="item.value"
															:label="item.label" :value="item.value">
													</el-option>
											</el-select>
									</div>
									<!-- <div class="search_item head_nav_left head_nav_source">
											<el-select v-model="goodsSource" multiple placeholder="货品来源" size="medium" >
													<el-option
															v-for="item in sourceList" :key="item.value"
															:label="item.dictName" :value="item.id">
													</el-option>
											</el-select>
									</div> -->
									<div class="search_item">
					<el-button class="button-fc" type="warning" size="medium"  @click="onSearch">查询</el-button>
					<el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
				</div>
							</div>
					</div>
			</el-card>
        
        <!-- tab页 -->
      <el-tabs type="border-card" v-model="status" @tab-click="tabclickH">
				<el-tab-pane label="待审批" name="4">
					<div class="table_warp_box">
						<!-- 待审批按钮组 -->
						<div class="m-bottom" style="display:flex;flex-wrap:nowrap;">
							<div 
								v-for="(item,index) in actionBtnList4"
								:key="index" style="marginLeft: 10px;">
								<el-button
									v-if="btnJurisdiction[item.str]"
									:type="item.style"
									size="small" class="button-96"
									@click="butGroupActions4(item.url,item.type)"
								>{{item.name}}</el-button>
							</div>
						</div>
						<!-- 待审批表格 -->
						<scrapTable status = "4" ref="tablelists4" :text="text" :searchData="searchData" :scrapApplyType="scrapApplyType"></scrapTable>
					</div> 
				</el-tab-pane>

        <el-tab-pane label="审批中" name="1">
			  	<!-- 审批中按钮组 -->
					<div class="m-bottom" style="display:flex;flex-wrap:nowrap;">
						<div 
							v-for="(item,index) in actionBtnList1"
							:key="index" style="marginLeft: 10px;">
							<el-button
								v-if="btnJurisdiction[item.str]"
								:type="item.style"
								size="small" class="button-96"
								@click="butGroupActions1(item.url,item.type)"
							>{{item.name}}</el-button>
						</div>
					</div>
					<!-- 审批中表格 -->
					<scrapTable status = "1" ref="tablelists1"  :text="text" :searchData="searchData" :scrapApplyType="scrapApplyType"></scrapTable>
		  	</el-tab-pane>

        <el-tab-pane label="已审批" name="2">
          <div class="table_warp_box">
                <!-- 已审批按钮组 -->
						<div class="m-bottom"  style="display:flex;flex-wrap:nowrap;">
							<div v-for="(item,index) in actionBtnList2" :key="index"  style="marginLeft: 10px;">
								<el-button
									v-if="btnJurisdiction[item.str]"
									:type="item.style"
									size="small" class="button-96"
									@click="butGroupActions2(item.url,item.type)"
								>{{item.name}}</el-button>
							</div>
						</div>
            <!-- 已审批表格 -->
						<scrapTable status = "2" ref="tablelists2"  :text="text" :searchData="searchData" :scrapApplyType="scrapApplyType"></scrapTable>
          </div>
        </el-tab-pane>
      </el-tabs>
		
		<inventoryPop 
			v-if="dialogVisible"
			:datapop = "datapop"
			@submint-change = 'submintChange'
			title = ""/> 

        
      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import scrapTable from "./components/scrapTable";
import scrapDetails from "./components/scrapDetails";
import inventoryPop from "./components/inventoryPop";
import module from '../../../../config/index.js';
import { getToken } from '@/utils/auth';

import {
	listScrapApplyByPage, // 报废列表查询
	scrapReview, // 报废申请审核 -- 即待审批的提交操作按钮
	exportScrapApply, // 导出报废列表
	deleteById, // 报废
} from 'api/entrepotSet/scrapmanagement/index';



import spot from '@/assets/images/spot.png';
import {
  getNames,
} from 'src/utils/pubilcFn.js';

export default {
	components: {
		breadcrumb,
		pagination,
		scrapTable,
		scrapDetails,
		inventoryPop
	},
	data() {
		return {
			
			navList: [],
			text: '', // 条件搜索
			searchData: ['',''],// 创建订单时间
			scrapApplyType: '', // 报废类型

			scrapReason: [],
			goodsSource: [],

			// 条件
			typeList:[{
				label: '盘点报废', value: '1',	
			},{
				label: '手动报废', value: '2',	
			},{
				label: '维修报废', value: '3',	
			},{
				label: '入库报废', value: '4',	
			},],   // 报废类型条件
			sourceList:[],  // 货品来源条件
			btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
			downFile4: '', //  待审批页面操作按钮导出
			// 待审批页面操作按钮list
			actionBtnList4: [
				{ name: "导出", style: "default", url: "/addbrand", type: 1,str:'scrapwait_export' },
				{ name: "提交", style: "default", url: "/addbrand", type: 2,str:'scrapwait_submit' },
				{ name: "新增", style: "default", url: "addscrap", type: 3,str:'scrapwait_add' },
				// { name: "编辑", style: "default", url: "/addbrand", type: 4 },
				{ name: "作废", style: "default", url: "/addbrand", type: 5,str:'scrapwait_scrap' }
			],
			// 审批中
			actionBtnList1: [
				{ name: "审批通过", style: "default", url: "/addbrand", type: 1,str:'scraping_through' },
				{ name: "驳回", style: "default", url: "/addbrand", type: 2,str:'scraping_reject' }
			],
			// 已审批
			actionBtnList2: [
				{ name: "导出", style: "default", url: "/addbrand", type: 1,str:'scraped_export' }
			],
			status:	'4', // tab状态

			

			// 测试用
			dialogVisible: false,
			datapop: {},


	};
		
	},

	// mounted() {
	// 	// 头部面包屑
	// 	this.navList = this.$route.meta;
	// },

	// created() {
	// 	// ?text=&scrapApplyType=&status=4&page=1&limit=20
	// 	//  text : this.text,  // 报废单号/订单号/采购单
	// 	// startTime: this.searchData[0], 
	// 	// endTime: this.searchData[1],
	// 	// scrapApplyType: this.scrapApplyType,  // 报废类型
	// 	// status: Number(this.status), // tab状态
	// 	this.downFile4 = module.dev.proxyTable['/api'].target + '/api/pc/scrapApply/exportScrapApply?';
	// },
	activated(){
		// 头部面包屑
		this.navList = this.$route.meta;
		this.downFile4 = module.dev.proxyTable['/api'].target + '/api/pc/scrapApply/exportScrapApply?';
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
		// 测试用
		// 弹出框的提交 -- 子组件触发
        submintChange(item) {
            console.log("this status")
            // this.currentPage = 1;
            // this.getListData(); // 获取表格数据

            this.dialogVisible = false; // 关闭弹出框

            // this.dateDate= [];
        },
		

        
        // 查询
        onSearch(){
			if(this.status  == "4") {
				this.$refs.tablelists4.currentPage = 1;

				let data = this.$refs.tablelists4.searchdatas();
				this.$refs.tablelists4.getList(data);
			}else if(this.status  == "1") {
				this.$refs.tablelists1.currentPage = 1;

				let data = this.$refs.tablelists1.searchdatas();
				this.$refs.tablelists.getList(data);
			}else if(this.status  == "2") {
				this.$refs.tablelists2.currentPage = 1;

				let data = this.$refs.tablelists2.searchdatas();
				this.$refs.tablelists.getList(data);
			}
		},
		
        // 重置
        resetFun(){
			this.text = '',  // 报废单号/订单号/采购单
			this.searchData = []; 
			this.scrapApplyType = ''  // 报废类型

			if(this.status  == "4") {
				this.$refs.tablelists4.currentPage = 1;

				let data = this.$refs.tablelists4.searchdatas();
				this.$refs.tablelists4.getList(data);
			}else if(this.status  == "1") {
				this.$refs.tablelists1.currentPage = 1;

				let data = this.$refs.tablelists1.searchdatas();
				this.$refs.tablelists.getList(data);
			}else if(this.status  == "2") {
				this.$refs.tablelists2.currentPage = 1;

				let data = this.$refs.tablelists2.searchdatas();
				this.$refs.tablelists.getList(data);
			}
		},
		

		// tab页选择
		tabclickH(e) {
			if (e.name == '4'){ // 待审批
				this.status = '4';

				let data = this.$refs.tablelists4.searchdatas();
				this.$refs.tablelists4.getList(data);
			} else if (e.name == '1') { // 审批中
				this.status = '1';

				let data = this.$refs.tablelists1.searchdatas();
				this.$refs.tablelists1.getList(data);
			} else if (e.name == '2') { // 已审批
				this.status = '2';

				let data = this.$refs.tablelists2.searchdatas();
				this.$refs.tablelists2.getList(data);
			} 
		},

		// 待审批的按钮组函数
		butGroupActions4(url, type) {
			if (type == 1) { // 导出
				if (this.$refs.tablelists4.selectVal.length > 0) {
					this.$message({
						message: "抱歉， 请勿勾选",
						type: "warning"
					});
					return;
				}


				let data1 = this.$refs.tablelists4.searchdatas();
				// text=${}&scrapApplyType=${}&status=${}&startTime=${}&endTime=${}
				window.location.href = this.downFile4 + `text=${data1.text}&scrapApplyType=${data1.scrapApplyType}&status=${data1.status}&startTime=${data1.startTime}&endTime=${data1.endTime}`;
				
			} else if (type == 2) { // 提交操作按钮 -- 即审核
				
				// let scrapApplyId = this.$refs.tablelists4.selectVal.map(item => {
				// 	return item.scrapApplyId
				// }).join(",")

				// console.log(scrapApplyId,"scrapApplyIdlkkk");
				if(this.warnMessage4()) {
					this.$confirm('是否确定此操作，进而进行下一步?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							scrapApplyId: Number(this.$refs.tablelists4.selectVal[0].scrapApplyId),
							status: 1
						}
						// 报废申请审核
						scrapReview(data).then(res => {
							if(res.status == 200) {
								this.$message.success("提交成功")
							}

							let data = this.$refs.tablelists4.searchdatas();
							this.$refs.tablelists4.getList(data);
							this.$refs.tablelists4.$refs.multipleTable.clearSelection();
						}).catch(err =>{
							console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消作废'
						}); 
					});


					// let data = {
					// 	scrapApplyId: Number(this.$refs.tablelists4.selectVal[0].scrapApplyId),
					// 	status: 1
					// }
					// // 报废申请审核
					// scrapReview(data).then(res => {
					// 	if(res.status == 200) {
					// 		this.$message.success("提交成功")
					// 	}

					// 	let data = this.$refs.tablelists4.searchdatas();
					// 	this.$refs.tablelists4.getList(data);
					// 	this.$refs.tablelists4.$refs.multipleTable.clearSelection();
					// }).catch(err =>{
					// 	console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
					// })
				}

			} else if (type == 3) { // 新增
				// this.dialogFormVisible = true;
				if (this.$refs.tablelists4.selectVal.length > 0) {
					this.$message({
						message: "抱歉， 请勿勾选",
						type: "warning"
					});
					return;
				}

				this.$router.push({ path: url });
			}else if (type == 4) { // 编辑
				this.$message({
					message: "抱歉， 此功能为开发",
					type: "warning"
				});
				return;

				// this.dialogFormVisible = true;
				this.$router.push({ path: url });
			}else if (type == 5) { // 作废


				if(this.warnMessage4()) {
					this.$confirm('是否确定作废?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							scrapApplyId: this.$refs.tablelists4.selectVal[0].scrapApplyId
						}
						console.log(data,"datasssss");
						
						deleteById(data).then(res => {
							if(res.status == 200) {
								this.$message.success("作废成功")
								this.$refs.tablelists4.getList(data);
								this.$refs.tablelists4.$refs.multipleTable.clearSelection();
								this.$refs.tablelists4.$refs.multipleTable.clearSelection();
							}
						}).catch(err =>{
							console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消作废'
						}); 
					});
				}
			}
		},


		//按钮组函数
		butGroupActions1(url, type) {
			if (type == 1) {  // 审批通过
				if(this.warnMessage1()) {
					this.$confirm('是否确定此操作，进而进行下一步?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							scrapApplyId: Number(this.$refs.tablelists1.selectVal[0].scrapApplyId),
							status: 2
						}
						// 报废申请审核
						scrapReview(data).then(res => {
							if(res.status == 200) {
								this.$message.success("提交成功")

								let data = this.$refs.tablelists1.searchdatas();
								this.$refs.tablelists1.getList(data);
								this.$refs.tablelists1.$refs.multipleTable.clearSelection();
							}
						}).catch(err =>{
							console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消作废'
						}); 
					});
				}


				// if(this.warnMessage1()) {
				// 	let data = {
				// 		scrapApplyId: Number(this.$refs.tablelists1.selectVal[0].scrapApplyId),
				// 		status: 2
				// 	}
				// 	// 报废申请审核
				// 	scrapReview(data).then(res => {
				// 		if(res.status == 200) {
				// 			this.$message.success("提交成功")

				// 			let data = this.$refs.tablelists1.searchdatas();
				// 			this.$refs.tablelists1.getList(data);
				// 			this.$refs.tablelists1.$refs.multipleTable.clearSelection();
				// 		}
				// 	}).catch(err =>{
				// 		console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
				// 	})
				// }
			} else if (type == 2) { // 驳回
				if(this.warnMessage1()) {
					this.$confirm('是否确定此操作，进而进行下一步?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							scrapApplyId: Number(this.$refs.tablelists1.selectVal[0].scrapApplyId),
							status: 3
						}
						// 报废申请审核
						scrapReview(data).then(res => {
							if(res.status == 200) {
								this.$message.success("提交成功")

								let data = this.$refs.tablelists1.searchdatas();
								this.$refs.tablelists1.getList(data);
								this.$refs.tablelists1.$refs.multipleTable.clearSelection();
							}
						}).catch(err =>{
							console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消作废'
						}); 
					});


					// let data = {
					// 	scrapApplyId: Number(this.$refs.tablelists1.selectVal[0].scrapApplyId),
					// 	status: 3
					// }
					// // 报废申请审核
					// scrapReview(data).then(res => {
					// 	if(res.status == 200) {
					// 		this.$message.success("提交成功")

					// 		let data = this.$refs.tablelists1.searchdatas();
					// 		this.$refs.tablelists1.getList(data);
					// 		this.$refs.tablelists1.$refs.multipleTable.clearSelection();
					// 	}
					// }).catch(err =>{
					// 	console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
					// })
				}
				
			}
		},

		//按钮组函数
		butGroupActions2(url, type) {
			if (type == 1) {  // 导出
				if (this.$refs.tablelists2.selectVal.length > 0) {
					this.$message({
						message: "抱歉， 请勿勾选",
						type: "warning"
					});
					return;
				}

				let data1 = this.$refs.tablelists2.searchdatas();
				// text=${}&scrapApplyType=${}&status=${}&startTime=${}&endTime=${}
				window.location.href = this.downFile4 + `text=${data1.text}&scrapApplyType=${data1.scrapApplyType}&status=${data1.status}&startTime=${data1.startTime}&endTime=${data1.endTime}`;
				
				
				// let data = {
				// 	endTime: data1.endTime,
				// 	scrapApplyType: data1.scrapApplyType,
				// 	startTime: data1.startTime,
				// 	status: 4,
				// 	text: data1.text,
				// }
				
				// 导出报废列表
				// exportScrapApply(data1).then(res => {
				// 	if(res.status == 200) {
				// 		this.$message.success("导出成功")
				// 	}
				// }).catch(err =>{
				// 	console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
				// })
			} else if (type == 2) { // 处理
				if(this.warnMessage2()) {
					let data = {
						scrapApplyId: Number(this.$refs.tablelists4.selectVal[0].scrapApplyId),
						status: 3
					}
					// 报废申请审核
					scrapReview(data).then(res => {
						if(res.status == 200) {
							this.$message.success("提交成功")
						}
					}).catch(err =>{
						console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/index.vue', err);
					})
				}
				
			}
		},
		
		// 表格选中警示信息 -- 只能选择一个订单并且必须选择
		warnMessage4() {
			if (this.$refs.tablelists4.selectVal.length > 1) {
				this.$message({
					message: "抱歉， 只能选择一个",
					type: "warning"
				});
				return;
			} else if (this.$refs.tablelists4.selectVal.length < 1) {
				this.$message({
					message: "抱歉， 请进行选择",
					type: "warning"
				});
				return;
			}
			return true;
		},

		// 表格选中警示信息 -- 只能选择一个订单并且必须选择
		warnMessage1() {
			if (this.$refs.tablelists1.selectVal.length > 1) {
				this.$message({
					message: "抱歉， 只能选择一个",
					type: "warning"
				});
				return;
			} else if (this.$refs.tablelists1.selectVal.length < 1) {
				this.$message({
					message: "抱歉， 请进行选择",
					type: "warning"
				});
				return;
			}
			return true;
		},

		// 表格选中警示信息 -- 只能选择一个订单并且必须选择
		warnMessage2() {
			if (this.$refs.tablelists2.selectVal.length > 1) {
				this.$message({
					message: "抱歉， 只能选择一个",
					type: "warning"
				});
				return;
			} else if (this.$refs.tablelists2.selectVal.length < 1) {
				this.$message({
					message: "抱歉， 请进行选择",
					type: "warning"
				});
				return;
			}
			return true;
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
			flex-wrap: wrap;
			// justify-content: center;
			align-items: center;
				.search_item{
					display: flex;
					flex-wrap: nowrap;
					// justify-content: center;
					align-items: center;
					margin: 10px 0px;
					padding: 0px 5px;
					width: 25%;
					>div{
						width: 100%;
					}
				}
			
		}
	}

	.add_head_list {
		.addScrap {
			.addlist {
				display: flex;
				align-items: center;
				// justify-content: center;
				flex-wrap: wrap;
				li {
					width: 50%;
					margin: 20px 0px;
					display: flex;
					flex-wrap: nowrap;
					justify-content: center;
					align-items: center;
					div	{
						display: flex;
						flex-wrap: nowrap;
						justify-content: center;
						align-items: center;
						span {
							width: 120px;
							display: inline-block;
							white-space: nowrap;
							text-align: right;
							padding-right :12px;
							box-sizing: border-box;
						}
					}
					

				}
				.remarks {
					width: 100%;
					.search_item {
						display: flex;
						flex-wrap: nowrap;
						justify-content: center;
						align-items: center;
						width: 100%;
						.el-textarea {
							width: 80%;
						}
					}		
				}
			}
		}
		.scrapPhoto {
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			span {
				width: 144px;
				display: inline-block;
				white-space: nowrap;
				text-align: right;
				padding-right :12px;
				box-sizing: border-box;
			}
		}
		.scrapList{
			display: flex;
			flex-wrap: wrap;
			.table_list {
				width: 90%;
				margin: 20px auto 0;
			}
		}
		
	}
	.dialog-footer {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
	}

	.contentBox{
		display: flex;
		flex-direction:row;
		margin-top:10px;

		.collapse_cell_div {
			background: #ecedf0;
			overflow: hidden;
			padding: 10px 0;
			display: block;
			margin-right:20px;
			border:1px solid #b7b9bb;
			padding: 10px;
			.setPicture{
				display: flex;
				justify-content:space-between;
				p{
					cursor: pointer;
					color:#006ec6;
				}
				.co{
					color:red;
				}
			}
		
		}
	}

</style>

