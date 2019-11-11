<template>
  <div class="wrapper">
  
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card style="marginBottom: 54px;">
       		<div class="titlecals">新增报废单</div>

			<div class="add_head_list">
				<div class="addScrap" >
					<ul class="addlist">
						<li class="search_item">
							<el-date-picker
								size="medium" v-model="scrapDate" type="datetime" :readonly="true"
								format= "yyyy-MM-dd hh:mm" value-format='yyyy-MM-dd hh:mm'
								range-separator="-"
								placeholder="年/月/日 时/分">
							</el-date-picker>
						</li>
						<!-- <li class="search_item">
							<el-select v-model="scrapApplyType"  placeholder="报废类型" size="medium">
								<el-option
									v-for="item in typeList" :key="item.value"
									:label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</li> -->
						<li class="search_item">
							<el-input placeholder="申报人" v-model="name" size="medium" maxlength="50"></el-input>
						</li>
						<li class="search_item remarks">
							<span>报废备注</span>

							<el-input type="textarea" v-model="remark"></el-input>
						</li>
					</ul>
				</div>

				<div class="scrapPhoto">
					<span>照片</span>
					<el-upload
						list-type="picture-card"
						class="upload-demo"
						action="string"
						:accept="accept"
						:http-request="uploadSectionFile1"
						:file-list="fileList1"
						:on-remove="handleRemove1"
						>
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>

				<div class="typesel">
					<el-button size="small" class="button-96" @click="selectPro">选择商品</el-button> 
					<el-button size="small" class="button-96" @click="selectType">选择订单</el-button>
				</div>

				<div class="scrapList" v-if="tableVisible == 1">
					<div class="titlecals">报废货物列表</div>
					<div  class="table_list lvs attribute">
						<el-table
							border
							:row-class-name="tableRowClassName"
							@selection-change="handleSelectionChange"
							:data="tabList"
							style="width: 100%;">
							<el-table-column type="selection" width="40"></el-table-column>
							<el-table-column prop="storageName" label="所属仓库" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="commodityName" label="商品名称" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="commodityCode" label="商品编码" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="specification" label="商品规格" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="commodityModel" label="商品型号" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="classifyName" label="商品类型" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="materialName" label="商品材质" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="colourName" label="商品颜色" width="240" sortable align="center"></el-table-column>
							<!-- <el-table-column prop="status" label="商品属性" width="240" sortable align="center"></el-table-column> -->
							<el-table-column prop="commodityUnit" label="计量单位" width="240" sortable align="center"> </el-table-column>
							<el-table-column prop="inventoryNumber" label="实际库存" width="240" sortable align="center"> </el-table-column>
							<el-table-column
							prop="regionName"
							label="货区"
							width="240" sortable align="center">
						</el-table-column>

						<el-table-column
							prop="siteCode"
							label="货位" show-overflow-tooltip
							width="240" sortable align="center">
						</el-table-column>

							<el-table-column prop="remark" label="备注" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="scrapNumber" label="报废数量" width="240" sortable align="center">
								<!-- <template slot-scope="scope">
									<el-input-number
										class="width-100"
										:controls="false"
										v-model="scope.row.scrapNumber"
										:min="0"
										size="mini"
									></el-input-number>
								</template> -->
							</el-table-column>
						</el-table>    
					</div>

					 <!-- <div class="table_list lvs attribute"  v-if="tableVisible == 2">
						<el-table
							border
							:row-class-name="tableRowClassName"
							:row-style="tableBodycolor"
							@selection-change="handleSelectionChange"
							:data="tabList"
							style="width: 100%;">
							<el-table-column type="selection" width="40"></el-table-column>
							<el-table-column prop="name" label="订单号" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="name" label="采购合同号" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="name" label="订单创建时间" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="name" label="商品品牌" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="name" label="商品名称" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="name" label="所属门店" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="name" label="状态" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="name" label="所属仓库" width="240" sortable align="center"></el-table-column>
							<el-table-column prop="name" label="备注" width="240" sortable align="center"></el-table-column>
						</el-table>    
					</div> -->


				</div>
			</div>

			<div  class="backButton">
				<el-button type="primary" @click="getUUID(2)">提交审核</el-button>
				<el-button  @click="colseBtn">取消</el-button>
			</div>
        
		</el-card>

			<!-- 选择商品 -->
			<el-dialog title="成品"  custom-class="customDialogTitle"  :visible.sync="productVisible"  width="64%">
				<prolist ref="productlist" v-if="productVisible" :isArrivalOrder="isArrivalOrder"></prolist>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="confirmFun(1)">确 定</el-button>
					<el-button @click="closeFun(1)">取 消</el-button>
				</div>
			</el-dialog>
		
       		<!-- 选择订单 -->
			<el-dialog title="成品"  custom-class="customDialogTitle"  :visible.sync="orderVisible"  width="50%">
				<orderlist  ref="orderlist" v-if="orderVisible"></orderlist>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="confirmFun(2)">确 定</el-button>
					<el-button @click="closeFun(2)">取 消</el-button>
				</div>
			</el-dialog>
			<!-- 采购合同列表 -->
			<purchaseList v-if="purchaseVisible" @closurePurchase="closurePurchase" @closePur="closePurchase" ref="purchaseList" :orderId="orderId"></purchaseList>

			<!-- purchaseOrderId: this.selectArr[0].purchaseOrderId,
						purchaseNumber:  this.selectArr[0].purchaseNumber, -->


			<!-- 选择订单 -->
			
			<!-- 采购单明细 -->
			<el-dialog title="采购单明细"  custom-class="customDialogTitle"  :visible.sync="orderDetailVisible"  width="50%">
				<!-- <prolist ref="productlist" v-if="productVisible"></prolist> -->
				<choseord ref="orderDetails" v-if="orderDetailVisible" :purchaseOrderId="purchaseOrderId" :purchaseNumber="purchaseNumber"></choseord>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="getUUID(1)">确 定</el-button>
					<el-button @click="closeOrder">取 消</el-button>
				</div>
			</el-dialog>
			

  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { mapGetters } from 'vuex';
import { mapMutations } from "vuex";
// import orderlist from "../allocationmanage/tobeallocated/orderlist";
import prolist from "./components/prolist"; // 商品
import orderlist from "./components/orderlist"; // 订单
import purchaseList from "./components/purchaseList"; // 采购合同
import choseord from "./components/choseord"; // 采购合同明细


import {
	addScrapApply, // 新增报废申请
} from 'api/entrepotSet/scrapmanagement/index';

import { getUUID } from "api/pulicJava";

import { put } from "@/utils/pubilcFn";

export default {
	components: {
		breadcrumb,
		pagination,
		prolist, // 商品
		orderlist,// 订单
		purchaseList, // 采购单
		choseord, // 采购合同明细

	},

	// name: 'addScrap',

	data() {
		return {
			//头部面包屑导航
			navList: [],

			purchaseOrderId: '',
			purchaseNumber: '',
			scrapApplyType: '',  // 报废类型
			scrapDate: '', // 申报时间
			remark: '', // 报废备注
			scrap: {
				scrapType: '', // 报废类型
				text: '', // 申报人
				desc: '', // 报废备注
			},

			scrapApplyUser: '', 
			scrapApplyId: '',
		

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
			
			scrapData: [], // 表格数据

			// 上传
			fileList1: [],
			imgArr1: [],
			delImgArr: [],
			accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",

			// 分页
			currentPage: 1,//当前页数
			pageSize: 20,//总页数
			total: 100,//总条数
			// 选择订单 商品
			productVisible: false, // 选择商品
			orderVisible: false, // 选择订单
			purchaseVisible: false, // 采购合同flag
			orderDetailVisible: false, // 采购明细flag
			oderList: [],// 选择的订单(只有一个)
			orderId: null, // 订单弹出框所选择的唯一订单的id
			tableVisible: 0, // 选择订单的table显示 1为商品 2为订单
			tabList: [], // 商品或者成品的table

			elsectVal:[],//table表单 勾选属性
			
			isArrivalOrder: 0,	
			// isDetails: true,
			// status:	0, // tab状态

			
		};
	
	},
  computed:{
	  	...mapGetters([
		  'name',
		  "id",
		  "productList", // 商品的数据
		//   "oderList", // 订单的数据
		]),
		// tableVisible() {
		// 	if(this.productList && this.productList.length != 0) { // 选择为商品
		// 		return  1; // 1为商品 2为订单
		// 	}else if(this.oderList && this.oderList.length != 0) {  // 选择为订单
		// 		return 2;
		// 	}else {
		// 		return 0;
		// 	}
		// },
  },
	mounted() {
		// 头部面包屑
		this.navList = this.$route.meta;

		// this.purchaseOrderId = this.$refs.purchaseList.purchaseOrderId;
		// console.log(this.purchaseOrderId,this.$refs.purchaseList.purchaseOrderId,"this.$refs.purchaseList.purchaseOrderId");
		
		// this.purchaseNumber = this$refs.purchaseList.purchaseNumber
	},


	created() {
		// let data = {
		// 	page: this.currentPage,
		// 	limit: this.pageSize,
		// };
		// this.getList(data);
		this.SET_PRODUCTLIST([]); // 清空商品即成品的数据
		this.SET_ORDERLIST([]); // 清空订单的数据

		if(this.productList && this.productList.length != 0) { // 选择为商品
			this.tableVisible = 1; // 1为商品 2为订单
		}else if(this.oderList && this.oderList.length != 0) {  // 选择为订单
			this.tableVisible = 2;
		}
		
		this.scrapApplyUser = this.name;
		this.scrapApplyId = this.id;

		this.scrapDate = this.getNowFormatDate();
		console.log(this.scrapDate,"date 232333333");
	},

    methods: {
		...mapMutations(["SET_PRODUCTLIST","SET_ORDERLIST"]),

		getNowFormatDate() { //获取当前时间
			var date = new Date();
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
			var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
			var currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
				+ " "  + date.getHours()  + seperator2  + date.getMinutes()
				+ seperator2 + date.getSeconds();
			return currentdate;
		},
		// 选择商品的操作按钮
		selectPro(){	
			if(this.oderList && this.oderList.length != 0 && this.tableVisible == 2) { // 已选择订单（并且有数据,table也显示）,改为选择商品
				this.$confirm('是否确定删除,进行下一步操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.SET_ORDERLIST([]); // 清空订单的数据
					this.tabList = this.oderList; // 清空订单table的数据
					this.tableVisible = 0; // 将table删除

					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.productVisible = true; // 打开商品的弹框
					return;
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});  
					return;        
				});
			}else if(this.tableVisible == 1 || this.tableVisible == 0) { // 当之前选择仍然是商品或者什么也没选择

				this.productVisible = true;  // 打开商品的弹框
			}

			console.log(this.tableVisible,"this.tableVisible");
			
		},
		// 选择订单的操作按钮
		selectType(){
			// if(!this.scrapApplyType) {
			// 	this.$message.warning("请填写报废类型");
			// 	return;
			// }

			if(this.productList && this.productList.length != 0 && this.tableVisible == 1) { // 已选择商品（并且有数据,table也显示为商品）,改为选择订单
				this.$confirm('是否确定删除,进行下一步操作?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.SET_PRODUCTLIST([]); // 清空商品即成品的数据
					this.tabList = this.productList; // 清空商品table的数据
					this.tableVisible = 0; // 将table清空

					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.orderVisible = true; // 打开订单的弹框
					return;
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});  
					return;        
				});
			}else if(this.tableVisible == 2 || this.tableVisible == 0) { // 当之前选择仍然是订单或者什么也没选择
				this.orderVisible = true;
			}
		},
		// 选择商品弹出框的确定按钮
		confirmFun(type) {
			if(type == 1) { // 选择商品
				console.log(this.$refs.productlist.elsectVal,"this.$refs.productlist.elsectVal 89++++++");
				

				if(this.$refs.productlist.elsectVal && this.$refs.productlist.elsectVal.length == 0) { // 商品没有数据即并没有选择
					this.$message.warning("请进行选择")
					return;
				}
				this.SET_PRODUCTLIST(this.$refs.productlist.elsectVal); // 选择的商品即成品
				this.tabList = this.productList; // 将table数据等于到全局productList变量

				this.tableVisible = 1; // 1为商品 2为订单
				// this.$router.push({
				// 	path: "chosepro",
				// 	query:{
						
				// 	}
				// });
				// this.producttableVisible = true;
				this.productVisible = false; // 关闭商品的弹框
			}else if(type == 2) { // 选择订单弹出框的确定操作按钮
				if(this.$refs.orderlist.elsectVal.length < 1) {
					this.$message.warning("请进行选择")
					return;
				}
				if(this.$refs.orderlist.elsectVal.length > 1) {
					this.$message.warning("抱歉，只能选择一个")
					return;
				}
				this.oderList = this.$refs.orderlist.elsectVal;
				// this.SET_ORDERLIST(this.$refs.orderlist.elsectVal); // 选择的订单

				let that = this;
				setTimeout(function() { 
					that.orderId  = that.oderList[0].orderId;
					that.orderVisible = false; // 关闭订单的弹出框
					that.purchaseVisible = true; // 打开采购单弹出框
				},100)
				// this.$router.push({
				// 	path: "choseord",
				// 	query:{
						
				// 	}
				// });
				
			}
		},
		//关闭采购单列表 打开采购单明细表 或者商品表
		closurePurchase() {
			console.log(this.$refs.purchaseList.isArrivalOrder,"this.$refs.purchaseList.isArrivalOrder");
			//是否有到货单（1、到货单，2、商品）
			if(Number(this.$refs.purchaseList.isArrivalOrder) == 1) {
				this.isArrivalOrder = 1;
				console.log(this.isArrivalOrder,"this.isArrivalOrder111");
				this.orderDetailVisible = true; // 打开采购单明细
			}else if(Number(this.$refs.purchaseList.isArrivalOrder) == 2) {
				this.isArrivalOrder = 2;
				this.productVisible = true;  // 打开商品的弹框
				console.log(this.isArrivalOrder,"this.isArrivalOrder222");
				
			}

			console.log(this.$refs.purchaseList,this.$refs.purchaseList.purchaseOrderId,"this.$refs.purchaseList");
			
			this.purchaseOrderId = this.$refs.purchaseList.purchaseOrderId; // 采购单id
			this.purchaseNumber = this.$refs.purchaseList.purchaseNumber; // 采购单编码
			this.closePurchase();
		},

		closePurchase(){
			this.purchaseVisible = false;
		},
		// 采购单明细的确定
		submitForm() {
			// if(!this.scrapApplyType) {
			// 	this.$message.warning("请填写报废类型");
			// 	return;
			// }

			// let fileUrlList = this.imgArr1.map(item => {
			// 	return {
			// 		// ...item,
			// 		fileUrl: item.url,
			// 		sourceName: item.name
			// 	};
			// });


			// 附件
			let fileUrlList = this.imgArr1.map(item => {
				return item.url;
			});
			// 订单的包
			let packageList = [];
			// this.$refs.orderDetails.tabList.forEach(item => {
			// 	item.siteNumberList.forEach(itm => {
			// 		if(itm.ischecked) {
			// 			packageList.push({
			// 				inventoryPurchasePackageId: itm.inventoryPurchasePackageId,
			// 				scrapNumber: itm.inventoryNumber,
			// 			});
			// 		}
			// 	})
			// });


			// tabList: [{
			//     aogTemplateName: item.aogTemplateName, // 名称
			//     aogTemplateId: item.aogTemplateId, // 名称对应的id
			//     numTotal: 0, // 数量
			//     aogTemplateisChecked: item.aogTemplateisChecked, // 名称是否被选中
			//     siteNumberList: [{ // 货区
			//         aogTemplateId: itm.aogTemplateId, // 货区的id与名称的id对应
			//         regionName: itm.regionName, // 货区的名字
			// 		   inventoryPurchasePackageDetailId: itm.inventoryPurchasePackageDetailId, //库存采购单包明细ID
			// 		   inventoryPurchasePackageId: itm.inventoryPurchasePackageId, // 库存采购单包ID
			//         inventoryNumber: itm.inventoryNumber, // 货区的数量
			//         ischecked: false, // // 货区checkbox控制
			//     }], 
			// }],
			let amount = 0;
			this.$refs.orderDetails.tabList.forEach(item => {
				item.siteNumberList.forEach(itm => {
					if(itm.ischecked) {
						amount += itm.inventoryNumber;
					}
				})
			});

			// packageList: [{
			// 	inventoryPurchasePackageId: '', // 库存采购单包ID
			// 	scrapNumber: '', // 报废数量
			// 	packageDetailsList: [{
			// 		inventoryPurchasePackageDetailId: '', // 库存采购单包明细ID
			// 		scrapNumber: '', //报废数量
			// 	}]
			// }]

			packageList = [];
			this.$refs.orderDetails.tabList.forEach(item => {
				let packageDetailsList = [];
				let numTotal = 0;
				item.siteNumberList.forEach(itm => {
					if(itm.ischecked) {
						numTotal += itm.inventoryNumber;
						packageDetailsList.push({
							inventoryPurchasePackageId: itm.inventoryPurchasePackageId, // 库存采购单包ID
							inventoryPurchasePackageDetailId: itm.inventoryPurchasePackageDetailId, //库存采购单包明细ID
							scrapNumber: itm.inventoryNumber, // 货区的数量
						})
					}
				})
				if(packageDetailsList && packageDetailsList.length != 0) {
					packageList.push({
						inventoryPurchasePackageId: packageDetailsList[0].inventoryPurchasePackageId, // 库存采购单包ID
						scrapNumber: numTotal, // 报废数量 
						packageDetailsList: packageDetailsList
					});
				}
				
			});

			


			let data = {
				scrapApplyTime: this.scrapDate, // 申请时间
				scrapApplyType: 2, // 报废类型 
				// scrapApplyUser: this.scrapApplyUser, // 申请人
				// scrapApplyId: this.scrapApplyId,
				scrapApplyUser:  this.scrapApplyId,// 申请人id
				remark: this.remark ? this.remark : '', // 报废备注
				fileUrlList: fileUrlList,
				amount, // 报废总数量

				packageList: packageList,
				status: 4,
				scrapApplyCode: this.scrapApplyCode,
			};
			console.log(this.$refs,this.$refs.purchaseList,this.purchaseOrderId,this.purchaseNumber,"this.$refs.purchaseList 2222222222");

			data.sourceId = this.purchaseOrderId; 
			data.sourceCode = this.purchaseNumber; 


			// data.sourceId = this.$refs.purchaseList.purchaseOrderId; 
			// data.sourceCode = this.$refs.purchaseList.purchaseNumber; // 采购单编码

			// if(data.packageList && data.packageList.length == 0){
			// 	console.log(data.packageList,"data.packageList");
					
			// 	this.$message.warning("请选择报废");
			// 	return;
			// }

			addScrapApply(data).then(res => {
				if (res.status == 200) {
					this.$message({
						message: "报废成功",
						type: "success"
					});
					this.$emit("closeOrder");
					// this.getPdf();
					this.$router.push("/scrapmanagement/scrap");
				}
			}).catch(err => {
				console.log('报废管理:报废管理 订单列表 entrepotSet/scrapmanagement/components/choseord.vue', err);
			});

		},
		// 关闭采购单明细
		closeOrder() {
			this.orderDetailVisible = false;
		},
		// 选择商品弹出框的取消按钮
		closeFun(type) {
			if(type == 1) { // 选择商品
				this.productVisible = false;
			}else if(type == 2) { // 选择订单

				this.orderVisible = false;
			}
		},
		// 页面的取消按钮
		colseBtn(){
			this.$router.push("/scrapmanagement/scrap");
		},

		getUUID(type) {
			let data = {
				serialNumber: 'SC'
			}
			getUUID(data).then(res => {
				if(res.status == 200) {
					this.scrapApplyCode = res.data;
					if(type == 1) {
						this.submitForm()
					}else if(type == 2){
						this.submission();
					}
				}
			}).catch(err => {
				console.log('报废管理:报废管理 增加报废 entrepotSet/scrapmanagement/addScrap.vue', err);	
			})
		},

		// 页面的提交审核按钮
		submission(){
			// if(!this.scrapApplyType) {
			// 	this.$message.warning("请填写报废类型");
			// 	return;
			// }

			// let fileUrlList = this.imgArr1.map(item => {
			// 	return {
			// 		// ...item,
			// 		fileUrl: item.url,
			// 		sourceName: item.name
			// 	};
			// });
			if(this.tabList && this.tabList.length == 0) {
				this.$message.warning("请选择报废");
				return;
			}

			let fileUrlList = this.imgArr1.map(item => {
				return item.url;
			});


			let amount = 0;
			this.tabList.forEach(item => {
				amount += item.scrapNumber;
			});
			

			let data = {
				scrapApplyTime: this.scrapDate, // 申请时间
				scrapApplyType: 2, // 报废类型 
				scrapApplyUser:  this.scrapApplyId,// 申请人id
				remark: this.remark ? this.remark : null, // 报废备注
				amount, // 报废总数量

				fileUrlList: fileUrlList,
				goodsList: this.tabList,
				status: 4,
				scrapApplyCode: this.scrapApplyCode,
			}

			data.sourceId = data.goodsList.map(item => {
				if(item) {
					return item.purchaseOrderId
				}else {
					return ''
				}
			}).join(",");

			
			data.sourceCode = data.goodsList.map(item => {
				if(item) {
					return item.purchaseNumber
				}else {
					return ''
				}
			}).join(",");

			addScrapApply(data).then(res => {
				if(res.status == 200) {
					this.$message.success("提交审核成功")
					this.$router.push("/scrapmanagement/scrap");
				}
			}).catch(err =>{
				console.log('报废管理:报废管理 增加报废 entrepotSet/scrapmanagement/addScrap.vue', err);
			})
		},

		

		//文件成功操作  //addAccessory编辑的新增接口
		uploadSectionFile1(res) {
			put(res).then(data => {
				this.imgArr1.push(data);
			});
		},

		 //文件删除操作
		handleRemove1(file, fileList) {
			if (file.dataSourceId) {
				//console.log("旧图片删除");
				let delobj = {
					accessoryId: file.accessoryId,
					dataSourceId: file.dataSourceId,
					dataSourceEnum: file.dataSourceEnum
				};
				this.delImgArr.push(delobj);
			} else {
				//console.log("新增图片删除");
				let lengs = String(file.raw.uid).length;
				this.imgArr1 = this.imgArr1.filter(item => {
					let str = item.name.substring(0, lengs);
					return str !== String(file.raw.uid);
				});
			}
		},


        // 搜索条件获取
        searchdatas(){
            return {
                // names: this.names, 
                // searchData: this.searchData[0], 
                // scrapReason: this.scrapReason[0],
                // scrapType: this.scrapType[0], 
                // goodsSource: this.goodsSource[0],
		
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
        
        // 查询
        onSearch(){
			let data = this.searchdatas();
			
            console.log(data);
            this.getList(data);
		},
		
        // 重置
        resetFun(){     
               
			this.names = '';
			this.searchData = [];
            this.scrapReason = [];
            // this.scrapApplyType = ''; // 报废类型 
            this.goodsSource = [];

            let data = this.searchdatas();
            this.getList(data);
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

		tableRowClassName({row, rowIndex}) {//表格斑马线设置
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
		
		//勾选函数回调
		handleSelectionChange(val) {
			this.elsectVal = val;
			console.log(this.elsectVal)
		},
        
  }
};
</script>
<style scoped lang='scss'>
.wrapper {
	.titlecals{
		top: 0px;
	}
}
.add_head_list {
	
	.addScrap{
		width: 100%;
		.addlist{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			// justify-content: center;
			align-items: center;
				.search_item{
					&:nth-of-type(1) {
						margin-left: 120px;
						padding-left: 0px;
					}
					display: flex;
					flex-wrap: nowrap;
					justify-content: center;
					align-items: center;
					margin: 10px 0px;
					padding: 0px 5px;
					width: 25%;
					>div{
						width: 100%;
					}
				}
				.remarks {
					width: 100%;
					>span {
						width: 120px;
						white-space: nowrap;
						text-align: right;
						padding-right: 12px;
					}
				}
		}
	}
		
	.scrapPhoto {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		span {
			width: 120px;
			white-space: nowrap;
			text-align: right;
			padding-right :12px;
		}
	}
	.typesel{
		width: 40%;
		margin: 0 auto;
		display: flex;
		justify-content: space-around;
		margin-bottom: 50px;
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


	.backButton {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}




</style>

