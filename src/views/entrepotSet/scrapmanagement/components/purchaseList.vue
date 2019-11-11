<template>
  <div>
    <el-dialog title="采购单" :visible.sync="isPurchase" width="50%"  custom-class="customDialogTitle"  :close-on-press-escape="false"  :close-on-click-modal="false" :show-close="false">
      <div class="table_list lvs attribute">
        <el-table
          border
          :row-class-name="tableRowClassName"
          @selection-change="chooseChange"
          :data="tableList"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="采购单号" sortable></el-table-column>
          <el-table-column align="center" prop="purchaseContractCode" label="采购合同号"></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmFun">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listPurchaseOrder } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { 
	listSiteNumber, // 订单库存-货位分配-采购单
	listStoragePurchaseOrder, // 订单库存-查看采购单列表 -- 代替上面的
} from 'api/entrepotSet/scrapmanagement/index';

export default {
  props: ["orderId"],
	data() {
		return {
			selectArr: [], //勾选
			tableList: [], //采购单列表
			isPurchase: true, 
			purchaseOrderId: '',
			purchaseNumber: '',
			isArrivalOrder: '', //是否有到货单（1、到货单，2、商品）
		};
	},
	created() {
		this.getList(this.orderId); // 获取采购单列表
	},
	methods: {
		// 获取采购单列表
		getList(orderId) {
			let data = {
				orderId,
			};
			listStoragePurchaseOrder(data).then(res => {
				if(res.status == 200) {
					this.tableList = res.data;
					console.log(res.data,"tabList 22222222");
				} 
			}).catch(error => {
				console.log('报废管理:报废管理 获取采购单列表 entrepotSet/scrapmanagement/components/purchaseList.vue', error);
			});
		},
		// 关闭弹框
		handleClose() {
			this.$emit("closePur");
		},
		// 弹框确定操作按钮
		confirmFun() {
			if (this.selectArr.length < 1) {
				this.$message.warning("你没有勾选采购单!");
			} else if (this.selectArr.length > 1) {
				this.$message.warning("只能勾选一个采购单");
			} else {
				this.purchaseOrderId =  this.selectArr[0].purchaseOrderId;
				this.purchaseNumber =  this.selectArr[0].purchaseNumber;
				this.isArrivalOrder =  this.selectArr[0].isArrivalOrder;
				this.$emit("closurePurchase"); // 弹框确定操作按钮，触发父组件的方法
				// this.$router.push({
				// 	path: "/scrapmanagement/choseord",
				// 	query: {
				// 		purchaseOrderId: this.selectArr[0].purchaseOrderId,
				// 		purchaseNumber:  this.selectArr[0].purchaseNumber,
				// 	}
				// });
				// if (this.selectArr[0].isArrivalOrder == 2) {
				//   //调商接口
				//   let { purchaseOrderId, purchaseNumber } = this.selectArr[0];
				//   this.$parent.getPurchaseGoods(purchaseOrderId, purchaseNumber, true);
				// } else {
				// }
			}
			
		},
		// 表格斑马线设置
		tableRowClassName({ row, rowIndex }) {
			return rowIndex % 2 != 0 ? "el-f0" : "";
		},
		//勾选
		chooseChange(val) {
			this.selectArr = val;

			console.log(this.selectArr,"this.selectArr");
			
		}
	}
};
</script>
<style lang="scss" scoped>

</style>
