<template>
  <div class="goodspositable">
    <el-dialog
      top='2vh'
      :visible.sync="isFlag"
      width="900px"
      title="货位分配"
      class="customDialogTitle"
      :before-close="handleClose"
    >
      <ul class="selecthuoqu">
        <li class="allocationclas">
          <el-button type="primary" size="medium" @click.stop="changehw">选择货区货位</el-button>
          <!-- 选择货区 -->
          <allocationstock
            :storageIds="storageIds"
            :isShow="isShow"
            class="allocationbox"
            @closeallocation="closeallocation"
          ></allocationstock>
        </li>
      </ul>
      <div class="table_list lvs attribute">
        <el-table
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :data="tableData"
        >
          <el-table-column align="center" type="selection" fixed="left"></el-table-column>
          <el-table-column
            align="center"
            prop="purchaseNumber"
            label="采购单编号"
            sortable
            width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            prop="commodityName"
            label="名称"
            width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="siteCode" label="转出货位" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量" width="120"></el-table-column>
          <el-table-column align="center" prop="receiptsnumber" label="转出数量" width="120">
            <template slot-scope="scope">
              <div>
                <el-input
                  v-model.number="scope.row.receiptsnumber"
                  @input="turnoutFn(scope.row)"
                  size="mini"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="receiptsNum"
            label="转入货位"
            show-overflow-tooltip
            width="200"
          ></el-table-column>
          <!-- <el-table-column align="center" prop="count" label="目前数量" width="120"></el-table-column>
          <el-table-column align="center" prop="count" label="最终数量" width="120"></el-table-column> -->
        </el-table>
        <div class="pagination_wrap">
          <pagination
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subfun">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import allocationstock from "./allocationstock";
import {
  listStockUpGoodsByPage,
  goodsAllocation
} from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock.js";
export default {
  components: {
    allocationstock,
    pagination
  },
  props: ["idlist", "storageIds", "isFlag"],
  data() {
    return {
      keyval: 1,
      hqhwidobj: {}, //选择的货区货位id
      commodityId: this.idlist,
      isShow: false,
      tableData: [], //获取列表
      currentPage: 1, //当前页数
      pageSize: 10, //每页个数
      total: 0, //总条数
      chArr: [] //勾选
    };
  },
  created() {
    this.listfun();
  },
  mounted() {
    let that = this;
    document.addEventListener("click", function(e) {
      if (e.target.className.indexOf("allocationclas") == -1) {
        that.isShow = false;
      }
    });
  },
  methods: {
    // 获取列表数据
    listfun() {
      let data = {
        commodityId: this.commodityId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listStockUpGoodsByPage(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          }
        })
        .catch(error => {
          console.error("获取备货列表", error);
        });
    },
    // 点击确定
    subfun() {
      if (!this.hqhwidobj.siteId) {
        this.$message({
          message: "请选择货区货位",
          type: "warning"
        });
        return false;
      }
      if(this.chArr.length == 0){
        this.$message.error('当前没有勾选!')
        return
      }
      let inventoryGoodsList = [];
      let allotGoodsList = [];

      this.chArr.forEach(item => {
        allotGoodsList.push({
          storagePurchaseOrderId: item.storagePurchaseOrderId, //库存采购单id
          inventoryGoodsId: item.inventoryGoodsId, //库存商品ID
          storageId: item.storageId, //仓库ID
          regionId: item.regionId, //货区ID
          siteId: item.siteId, //货位ID
          skuGoodsId: item.skuGoodsId, //sku商品id
          inventoryNumber: item.receiptsnumber, //库存数量
          inventoryType: item.inventoryType, //库存类型
          availableAmount: item.availableAmount, //可售金额
          costing: item.costing, //成本金额
          storeId: item.storeId, //门店id
          piece: item.piece //件
        })

        let total = item.inventoryNumber * 1 - item.receiptsnumber * 1;

        inventoryGoodsList.push({
          storagePurchaseOrderId: item.storagePurchaseOrderId,//库存采购单id
          inventoryGoodsId: item.inventoryGoodsId,//库存商品ID
          storageId: item.storageId,//仓库ID
          regionId: item.regionId,//货区ID
          siteId: item.siteId,//货位ID
          skuGoodsId: item.skuGoodsId,//sku商品id
          inventoryNumber: total,//分配后的库存数量
          inventoryType: item.inventoryType,//库存类型
          availableAmount: item.availableAmount, //可售金额
          costing: item.costing, //成本金额
          storeId: item.storeId, //门店id
          piece: item.piece //件
        })
      })

      let data = {
        inventoryGoodsList, //旧数据
        allotGoodsList //新货位数据
      };
      console.log(data);
      // return
      goodsAllocation(data)
        .then(res => {
          if (res.status == 200) {
            this.handleClose();
            this.$message({
              message: "分配成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          console.error("备货库存-货位分配", error);
        });
    },
    //关闭弹框
    handleClose() {
      this.$emit("cancalfun");
    },
    changehw() {
      if (this.chArr.length < 1) {
        this.$message.error("当前没有勾选");
        return;
      }
      this.isShow = !this.isShow;
    },
    // 点击货位
    closeallocation(val) {
      this.hqhwidobj = val;
      this.chArr.forEach(attr => {
        this.tableData.forEach((item, idx) => {
          if (attr.inventoryGoodsId == item.inventoryGoodsId) {
            item.receiptsNum = val.regionSiteName;
            item.regionId = val.regionId;
            item.siteId = val.siteId;

            // item.count = val.count ? val.count : 0;
          }
        });
      });
      this.keyval++;
      console.log(this.tableData);
      this.isShow = false;
    },
    // 转出数量输入
    turnoutFn(row) {
      this.tableData.forEach(item => {
        if (item.inventoryGoodsId == row.inventoryGoodsId) {
          if(row.receiptsnumber > item.inventoryNumber){
            this.$message.error('当前数量超出!')
            item.receiptsnumber = item.inventoryNumber;
          }
        }
      });
    },
    //勾选
    handleSelectionChange(val) {
      this.chArr = val;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.listfun();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.listfun();
    }
  }
};
</script>
<style lang="scss" scoped>
.goodspositable {
  .selecthuoqu {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .allocationclas {
    position: relative;
    .allocationbox {
      z-index: 999;
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
