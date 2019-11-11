<template>
    <div class="lendingdetails">
		<!-- 查询条件组 -->
		
		<el-card style="marginTop:20px">
			<div class="list_top" v-if="!lendingMoneyId">
				<div class="search_item">
					<el-input placeholder="借出单号" v-model="lend.lendnum" size="medium" maxlength="50"  @focus="selectType('outside')"></el-input>
				</div>
				<div class="search_item">
					<el-input placeholder="借入单号" v-model="borrownums" size="medium" maxlength="50"  @focus="selectType('inside')"></el-input>
				</div>
			</div>
			<!-- && isshop == 1 -->
			<!-- 包展示的内容 -->
			<div v-if="isshop == 1">
				<choseord ref="orderDetails1" v-if="orderDetailVisible" clickType = "outside" @chooseSelectedVal="chooseSelectedVal" 
					:purchaseOrderId="lendPurchaseOrderId" :purchaseNumber="lendPurchaseNumber">
				</choseord>

				<choselending ref="orderDetails2" v-if="orderDetailVisible2" :selectedVal="selectedVal" 
					:purchaseOrderId="borrowPurchaseOrderId" :purchaseNumber="borrowPurchaseNumber">
				</choselending>
			</div>
			<div v-if="isshop == 2 && orderDetailVisible">
				<div class="marginclass">借出单-采购单号：{{lendPurchaseNumber}}</div>
				<!-- 借出商品展示的内容 -->
				<div class="table_list lvs attribute">
					<el-table border :row-class-name="tableRowClassName" ref="multipleTable" @selection-change="handleSelectionChange" @select="selectfun"
            			@select-all="selectall" :data="tabledata" style="width: 100%;">
						<el-table-column type="selection" width="40"></el-table-column>
						<el-table-column prop="commodityName" label="商品名称" width="200" sortable align="center"></el-table-column>
						<el-table-column prop="commodityCode" label="商品编码" width="200" sortable align="center"></el-table-column>
						<el-table-column prop="commodityUnit" label="计量单位" width="200" sortable align="center"> </el-table-column>
						<el-table-column prop="siteCode" label="货区货位" width="200" sortable align="center"> </el-table-column>
						<el-table-column prop="inventoryNumber" label="数量" width="200" sortable align="center"></el-table-column>
					</el-table>
				</div>
			</div>
			<div v-if="isshop == 2 && orderDetailVisible2">
				<div class="marginclass">
					<el-button type="primary" @click="borrowshop">借货</el-button>
					<el-input-number v-model="borrownum" :min="0" :controls="false" v-if="borrowinpshow" size="small" :step="1" :precision="0"></el-input-number>
				</div>
				<div class="marginclass">借出单-采购单号：{{borrowPurchaseNumber}}</div>
				<!-- 借入商品展示的内容 -->
				<div class="table_list lvs attribute">
					<el-table border :row-class-name="tableRowClassName" :data="borrowtabledata" style="width: 100%;">
						<el-table-column prop="commodityName" label="商品名称" width="200" sortable align="center"></el-table-column>
						<el-table-column prop="commodityCode" label="商品编码" width="200" sortable align="center"></el-table-column>
						<el-table-column prop="commodityUnit" label="计量单位" width="200" sortable align="center"> </el-table-column>
						<el-table-column prop="siteCode" label="货区货位" width="200" sortable align="center"> </el-table-column>
						<el-table-column prop="inventoryNumber" label="数量" width="200" sortable align="center"></el-table-column>
					</el-table>
				</div>
			</div>
			
			<!-- <div v-if="isShow"><procurement :orderId="lend.lendId"></procurement></div> -->
			
			<!-- tableTitle 表格上面的题目 isCheckbox 是否有checkbox 
			isPurchase 第二列是采购合同还是库取单号 //fixed
			isPlace 货区货位是否拥有checkbox
			isLengend 最后一列的借入借出 -->
			<!-- 选择订单列表 -->
			<el-dialog title="订单" class="customDialogTitle" top="1vh" :visible.sync="orderVisible" width="900px">
				<orderlist ref="orderlist" v-if="orderVisible" :clickType="clickType" 
					:brandId="String(brandId)" :categoryId="String(categoryId)">
				</orderlist>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="confirmFun">确 定</el-button>
					<el-button @click="closeFun(2)">取 消</el-button>
				</div>
			</el-dialog>

			<!-- 选择采购合同列表 -->
			<purchaseList v-if="purchaseVisible" @closurePurchase="closurePurchase" ref="purchaseList" :orderId="orderId"></purchaseList>

			<div class="backButton">
				<el-button type="primary" @click="submission" :loading="btnloading">提 交</el-button>
				<el-button  @click="colseBtn">取 消</el-button>
			</div>
		</el-card>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import procurement from "./components/procurement";  // 采购订单
import orderlist from "./components/orderlist"; // 订单
import purchaseList from "./components/purchaseList"; // 采购合同
import choseord from "./components/choseord"; // 采购合同明细
import choselending from "./components/choselending"; // 采购合同明细
import { 
	addLendingMoney, //借货新增
	librariesTakeSingle,
	getGooodAndPackageById,//根据借货id获取借货的商品、包
	getById,//根据借货id查询信息
} from 'api/entrepotSet/borrowedmanage/index';
import { listBaseDict } from 'api/samplemanagement/upsample/upsample';
import orderlistVue from './components/orderlist.vue';
import { mapMutations } from 'vuex';

export default {
	components: {
		pagination,
		procurement,
		orderlist,// 订单
		purchaseList, // 采购单
		choseord, // 采购合同明细
		choselending, // 2
	},
	props:["isCheckbox","isPlace","isLengend"],
	data() {
		return {
			btnloading: false,
			borrownum: "",
			borrowinpshow: false,
			tableSelectList: [],//选中借出商品
			borrowtableSelectList: [],//选中借入商品列表
			tabledata: [],//借出商品列表
			plasedata: [],//借入商品
			borrowtabledata: [],//借入商品列表
            navList: [],//头部面包屑
			clickType: 'outside',
			isShow: false,// 查询条件
			lend: {
				lendnum: '',
				lendId: '',
			},
			lendnum: '', // 借出单号
			borrownums: '', // 借入单号
			orderVisible: false, // 选择订单
			categoryId: '', // 品类
			brandId: '', // 品牌
			selectedVal: [], // 借出选的包
			purchaseVisible: false, // 采购合同flag
			orderDetailVisible: false, // 采购明细flag1
			orderDetailVisible2: false, // 采购明细flag2
			purchaseOrderId: '',
			purchaseNumber: '',
			oderList: [],
			lendPurchaseNumber: '', // 借出采购单号
			lendPurchaseOrderId: '',
			borrowPurchaseNumber: '',
			borrowPurchaseOrderId: '',// 借入采购单号
			isshop: "",//借出1、到货单，2、商品
			dateData: '',
			lendingMoneyId: this.$route.query.lendingMoneyId,//借货id
		};
	},
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
		this.SET_SELECTEDDETAILS([]);
	},
	created() {
		let data = {
				page: this.currentPage,
				limit: this.pageSize,
		};
		this.dateData = this.getNowFormatDate();
		// 判断是否为还货
		if(this.lendingMoneyId){
			getGooodAndPackageById({lendingMoneyId: this.lendingMoneyId}).then(res => {
				console.log(res,"根据借货id获取借货的商品、包");
				if (res.status == 200) {
					// this.isshop = res.data.type
					// this.lendPurchaseOrderId = res.data.borrowId;
					// this.lendPurchaseNumber = res.data.borrowCode;
					// this.orderDetailVisible = true;
					// this.borrowPurchaseOrderId = res.data.lendId;
					// this.borrowPurchaseNumber = res.data.lendCode;
					// this.orderDetailVisible2 = true;
				}
			}).catch(err => {
				console.log('换货:根据借货id获取借货的商品、包 entrepotSet/scrapmanagement/components/choseord.vue', err);
			})

			// getById({lendingMoneyId: this.lendingMoneyId}).then(res => {
			// 	console.log(res,"根据借货id获取借货的商品、包");
			// 	if (res.status == 200) {
			// 		this.isshop = res.data.type
			// 		this.lendPurchaseOrderId = res.data.borrowId;
			// 		this.lendPurchaseNumber = res.data.borrowCode;
			// 		this.orderDetailVisible = true;
			// 		this.borrowPurchaseOrderId = res.data.lendId;
			// 		this.borrowPurchaseNumber = res.data.lendCode;
			// 		this.orderDetailVisible2 = true;
			// 	}
			// }).catch(err => {
			// 	console.log('换货:根据借货id获取借货的商品、包 entrepotSet/scrapmanagement/components/choseord.vue', err);
			// });
		}
    },
	methods: {
		selectall(selection) {
			this.$message.warning("不可多选！");
			this.$refs.multipleTable.clearSelection();
			
			//多选 暂时不用
			// let data = this.tableSelectList.every(item => {
			// 	return item.inventoryNumber == 0;
			// });
			// if(data){
			// 	this.$message.warning("包含商品数量为0的采购单，不可勾选");
			// 	this.$refs.multipleTable.clearSelection();
			// }
			// let data2 = this.tableSelectList.some(item =>{
			// 	let skuGoodsId = item.skuGoodsId
			// 	return this.borrowtabledata.some(itm =>{
			// 		return itmskuGoodsId != item.skuGoodsId
			// 	})
			// })
			// if(data2){
			// 	this.$message.warning("请勾选相同规格的商品！");
			// 	this.$refs.multipleTable.clearSelection();
			// }
		},
		// 单选判断只能勾选相同仓库
		selectfun(selection, row) {
			console.log(row);
			console.log(this.tableSelectList);
			if(row.inventoryNumber == 0){
				this.$message.warning("该商品下已无数量可借");
				this.$refs.multipleTable.toggleRowSelection(row);
			}
			let agreement = this.borrowtabledata.some(itm =>{
				return row.skuGoodsId != itm.skuGoodsId
			})
			if(agreement && this.tableSelectList.length){
				this.$message.warning("请勾选相同规格的商品！");
				this.$refs.multipleTable.toggleRowSelection(row);
			}
		},
		borrowshop(){
			if(this.tableSelectList.length == 0){
				this.$message.warning("请先选择借出商品")
			}else{
				if(Number(this.borrownum) < 1){
					this.$message.warning("请输入正确数量")
					return false
				}
				// 单选
				if(this.borrowinpshow){
					if(Number(this.borrownum) > this.tableSelectList[0].inventoryNumber){
						this.$message.warning("请输入正确数量")
						return false
					}
					let skuGoodsId = this.tableSelectList[0].skuGoodsId
					this.tabledata.forEach((itm, idx) =>{
						if(skuGoodsId == itm.skuGoodsId){
							let obj = {...itm, isborrow: true}
							obj.inventoryNumber = itm.inventoryNumber - this.borrownum
							this.$set(this.tabledata, idx, obj)

						}
					})
				}else{//多选 暂时不用
					this.tableSelectList.forEach(item =>{
						this.tabledata.forEach(itm =>{
							if(item.skuGoodsId == itm.skuGoodsId){
								// itm.inventoryNumber = 0;
								let obj = {...itm}
								obj.inventoryNumber = 0
								this.$set(this.tabledata, idx, obj)
							}
						})
					})
				}

				let tableobj = {...this.tableSelectList[0]}
				tableobj.inventoryNumber = this.borrownum
				console.log(tableobj.inventoryNumber,"1");
				// data[0].isborrow = true
				this.borrowtabledata.forEach((item, index) =>{
					if(tableobj.skuGoodsId == item.skuGoodsId){
						let obj = {...tableobj}
						obj.inventoryNumber = obj.inventoryNumber + item.inventoryNumber
						console.log(obj,"2");
						console.log(obj.inventoryNumber,"2");
						this.$set(this.borrowtabledata, index, obj)
					}
				})
				console.log(this.borrowtabledata,"3");
				// this.showborrowtabledata.push(...data);
				this.$refs.multipleTable.clearSelection();
			}
		},
		...mapMutations(["SET_SELECTEDDETAILS"]),
		handleSelectionChange(val){
			this.tableSelectList = val;
			if(this.tableSelectList.length == 1){
				this.borrownum = this.tableSelectList[0].inventoryNumber
				this.borrowinpshow = true;
			}else{
				this.borrowinpshow = false;
			}
		},
		tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
		borrowhandleSelectionChange(val){
            this.borrowtableSelectList = val;
        },
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
		// 关闭采购单明细
		closeOrder() {
			this.orderDetailVisible = false;
			this.orderDetailVisible2 = false;
		},
		chooseSelectedVal(val) {
			console.log(val,"val000000");
			this.selectedVal = val;
		},
		// 选择订单 -- 确定操作按钮
		confirmFun(type) {
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
			this.brandId = this.$refs.orderlist.elsectVal[0].brandId; // 品牌
			this.categoryId = this.$refs.orderlist.elsectVal[0].categoryId; // 品类
			
			let that = this;
			setTimeout(function() { 
				that.orderId  = that.oderList[0].orderId;
				that.orderVisible = false; // 关闭订单的弹出框
				that.purchaseVisible = true; // 打开采购单弹出框
			},100)
		},
		// 选择商品弹出框的取消按钮
		closeFun(type) {
			if(type == 1) { // 选择商品
				this.productVisible = false;
			}else if(type == 2) { // 选择订单
				this.orderVisible = false;
			}
		},
		shopdata(val, status){
			console.log(this.isshop,"1、到货单，2、商品");
			if(this.isshop == 2){
				if(status == "outside"){
					let vals = {
						purchaseOrderId: val.purchaseOrderId
					}
					librariesTakeSingle(vals).then(res => {
						console.log(res,"商品列表信息");
						if (res.status == 200) {
							this.tabledata = res.data;
							this.orderDetailVisible = true; // 打开采购单明细1
						}
					}).catch(err => {
						console.log('报废管理:报废管理 订单列表 entrepotSet/scrapmanagement/components/choseord.vue', err);
					});
				}else{
					let vals = {
						purchaseOrderId: val.purchaseOrderId
					}
					librariesTakeSingle(vals).then(res => {
						console.log(res,"商品列表信息");
						if (res.status == 200) {
							this.borrowtabledata = res.data;
							this.orderDetailVisible2 = true; // 打开采购单明细1
						}
					}).catch(err => {
						console.log('报废管理:报废管理 订单列表 entrepotSet/scrapmanagement/components/choseord.vue', err);
					});
				}
			}else{
				if(status == "outside"){
					this.orderDetailVisible = true; // 打开采购单明细1
					this.$nextTick(()=>{
						this.$refs.orderDetails1.listPackageByIdfun()
					})
				}else{
					console.log("insideinsideinsideinsideinsideinsideinside");
					this.orderDetailVisible2 = true; // 打开采购单明细2
					this.$nextTick(()=>{
						this.$refs.orderDetails2.listPackageByIdfun()
					})
				}
			}
		},
		//关闭采购单列表
		closurePurchase(type) {
			this.purchaseVisible = false; // 关闭采购单
			if(type == 1) {
				let selectdata = this.$refs.purchaseList
				let data = {
					brandId: selectdata.brandId,
					categoryId: selectdata.categoryId,
				}
				if(this.clickType == 'outside') {
					this.isshop = selectdata.isArrivalOrder//1、到货单，2、商品
					this.lendPurchaseNumber = selectdata.purchaseNumber;
					this.lendPurchaseOrderId = selectdata.purchaseOrderId;
					this.shopdata(selectdata, "outside")
					// this.orderDetailVisible = true; // 打开采购单明细1
				}else if(this.clickType == 'inside') {
					if(this.isshop == ""){//判断是否选择了借出商品
						this.$message.warning("请先选择借出单号")
						return false
					}else if(this.isshop != selectdata.isArrivalOrder){//判断借出和借入是否一致
						this.$message.warning("请选择相同属性的订单")
						return false
					}
					this.borrowPurchaseNumber = selectdata.purchaseNumber;
					this.borrowPurchaseOrderId = selectdata.purchaseOrderId;
					this.shopdata(selectdata, "inside")
				}
			}
		},
		// 选择订单
		selectType(type){
			this.clickType = type;
			console.log(this.clickType,"选择订单 2566click");
			this.orderVisible = true;
		},
		// 采购单明细的确定
		submission() {
			if(!this.orderDetailVisible){
				this.$message.warning("请选择借出单号")
				return 
			}
			if(!this.orderDetailVisible2){
				this.$message.warning("请选择借入单号")
				return 
			}
			this.btnloading = true;
			if(this.isshop == 1){
				// 订单的包
				let lendPackageList = []; // 借出的库存采购单包明细借出的库存采购单包明细
				this.$refs.orderDetails1.tabList.forEach(item => {
					let lendDetailList = []; // 详情
					let inventoryPurchasePackageId = '';
					item.siteNumberList.forEach(itm => {
						if(itm.isborrow){
							lendDetailList.push({ // 详情
								inventoryPurchasePackageId: itm.inventoryPurchasePackageId,
								inventoryPurchasePackageDetailId: itm.inventoryPurchasePackageDetailId,//借出数量
								lendNumber: itm.inventoryNumber,
								regionId: itm.regionId, // 货区货位id
								siteId: itm.siteId, // 货区货位id
								storageId: itm.storageId, // 仓库id
							})
							lendPackageList.push({
								inventoryPurchasePackageId:itm.inventoryPurchasePackageId,
								lendNumber: item.numTotal,
								lendDetailList, // 详情
							})
						}
					})
				})
				let borrowPackageList = []; // 借入的包
				this.$refs.orderDetails2.getCheckedData.forEach(item => {
					let borrowDetailsList = []
					let inventoryPurchasePackageId = '';
					let borrowNumber = 0;
					item.siteNumberList.forEach(itm => {
						inventoryPurchasePackageId = itm.inventoryPurchasePackageId;
						borrowNumber += itm.inventoryNumber
						borrowDetailsList.push({ // 详情
							borrowNumber: itm.inventoryNumber,
							regionId: itm.regionId, // 货区货位id
							siteId: itm.siteId, // 货区货位id
							storageId: itm.storageId, // 仓库id
						})
					})
					if(borrowNumber !== 0){
						borrowPackageList.push({// 借入的包
							inventoryPurchasePackageId, // 借入的库存采购单包表
							borrowNumber,
							borrowDetailsList
						})
					}
				})
				
				if(borrowPackageList.length == 0){
					this.$message.warning("请选择要借出的商品")
					return
				}
				if(borrowPackageList.length>1){
					this.$message.error('只能借一个包!')
					return
				}
				let data = {
					lendPackageList: lendPackageList,// 借出的库存采购单包明细
					borrowPackageList, // 借入的包
					lendCode: this.lendPurchaseNumber, //借出单号
					lendId: this.lendPurchaseOrderId, //借出单id
					borrowCode: this.borrowPurchaseNumber, //借入单号
					borrowId: this.borrowPurchaseOrderId,//借入单id
					lendingMoneyTime: this.getNowFormatDate(),//借货时间
					remark: '',//备注
					theGoodsTime: this.getNowFormatDate(),//预计还货时间
					type: 1, //借货类型 1 订单  2 商品
					// amount, // 报废总数量
					// packageList: packageList,
					// borrowPackageList: borrowPackageList, // 借入的包
				};
				if(this.lendingMoneyId){
					data.lendingMoneyId = this.lendingMoneyId
				}
				console.log(data);
				this.btnloading = true;
				addLendingMoney(data).then(res => {
					if (res.status == 200) {
						this.$message.success("借货成功");
						this.$router.push({path: "/borrowedmanage/lending"})
						this.SET_SELECTEDDETAILS([]);
						this.btnloading = false
					}
				}).catch(err => {
					console.log('报废管理:报废管理 订单列表 entrepotSet/scrapmanagement/components/choseord.vue', err);
					this.btnloading = false
				});
			}else{//借商品
				let data = {
					lendCode: this.lendPurchaseNumber, //借出单号
					lendId: this.lendPurchaseOrderId, //借出单id
					borrowCode: this.borrowPurchaseNumber, //借入单号
					borrowId: this.borrowPurchaseOrderId,//借入单id
					lendingMoneyTime: this.getNowFormatDate(),//借货时间
					remark: '',//备注
					type: 2, //借货类型 1 订单  2 商品
					inventoryGoodsId: [],
				}
				// 选中的商品借出信息
				// this.tableSelectList
				let tabone = this.tabledata[0];
				let tabtwo = this.borrowtabledata[0];
				let obj = {
					lendNumber: this.borrownum,//借货总数量
					borrowInventoryNumber: tabtwo.inventoryNumber,//借入后的库存数量
					borrowInventoryGoodsId: tabtwo.inventoryGoodsId,//借入库存商品ID
					storagePurchaseOrderId: this.borrowPurchaseOrderId,//借入库存采购单id
					inventoryGoodsId: tabone.inventoryGoodsId,//借出库存商品ID
					lendStoragePurchaseOrderId: this.lendPurchaseOrderId,//借出库存采购单id
					inventoryNumber: tabone.inventoryNumber,//借出后的库存数量
				};
				data.inventoryGoodsId.push(obj)
				this.btnloading = true;
				addLendingMoney(data).then(res => {
					if (res.status == 200) {
						this.$message.success("借货成功");
						this.$router.push({path: "/borrowedmanage/lending"})
						this.SET_SELECTEDDETAILS([]);
						this.btnloading = false
					}
				}).catch(err => {
					console.log('报废管理:报废管理 订单列表 entrepotSet/scrapmanagement/components/choseord.vue', err);
					this.btnloading = false
				});
			}
		},
		colseBtn() {
			this.$router.push({path: "/borrowedmanage/lending"})
		},
	}
};
</script>
<style scoped lang='scss'>
.lendingdetails{
	.el-dialog__body{
		padding: 0 20px;
	}
	.marginclass{
		margin-bottom: 20px;
	}
	.list_top{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
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
	.typesel{
		width: 40%;
		margin: 0 auto;
		display: flex;
		justify-content: space-around;
		margin-bottom: 50px;
	}
	.btn_list_1 {
		margin-top: 20px;
	}
	.backButton {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}
}

</style>
<style lang="scss">
	.lendingdetails{
		.el-dialog__body{
			padding: 0 20px;
		}
	}
</style>

