<template>
  <div>
    <el-dialog
      title="采购单"
      :visible.sync="isPurchase"
      width="50%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <div class="table_list lvs attribute">
        <el-table
          border
          :row-class-name="tableRowClassName"
          @selection-change="chooseDelete"
          :data="tableData"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="采购单号" sortable></el-table-column>
          <el-table-column align="center" prop="orderNumber" label="采购合同号"></el-table-column>
          <el-table-column align="center" prop="isArrivalOrder" label="入库方式">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.isArrivalOrder==1">到货单</p>
                <p v-if="scope.row.isArrivalOrder==2">商品</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="determineFun">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listPurchaseOrder } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  props: ["isPurchase", "orderId"],
  data() {
    return {
      choseArr: [], //勾选
      tableData: [] //采购单列表
    };
  },
  methods: {
    //获取采购单列表
    getData(orderId) {
      let data = {
        orderId
      };
      listPurchaseOrder(data)
        .then(res => {
          this.tableData = res.data;
        })
        .catch(error => {
          console.error("获取采购单列表", error);
        });
    },
    //关闭弹框
    handleClose() {
      this.$emit("closurePurchase");
    },
    //弹框确定
    determineFun() {
      if (this.choseArr.length < 1) {
        this.$message.error("你没有勾选采购单!");
      } else if (this.choseArr.length > 1) {
        this.$message.error("只能勾选一个采购单");
      } else {
        //结构赋值
        let {
          purchaseOrderId,
          purchaseNumber,
          isArrivalOrder,
          brandId
        } = this.choseArr[0];
        if (brandId == 2) {
          this.$parent.isFlag = 3;
          this.$parent.getDataDJ(purchaseOrderId);
        } else {
          if (isArrivalOrder == 2) {
            this.$parent.isFlag = 1;
            this.$parent.getPurchaseGoods(purchaseOrderId);
          } else {
            this.$parent.isFlag = 2;
          }
        }

        this.$parent.purchaseNumber = purchaseNumber;
        this.handleClose();
      }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.purchaseList {
}
</style>
