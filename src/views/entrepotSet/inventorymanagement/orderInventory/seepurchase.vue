<template>
  <div class="seepurchase">
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="titlecals">查看采购单</div>
      <div class="table_list lvs attribute m-top10">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" label="查看" width="80">
            <template slot-scope="scope">
              <div class="table_action_span" @click="seedetils(scope.row)">查看</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="采购单号" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="warehouseWarrantCode" label="入库单号" width="120"></el-table-column>
          <el-table-column align="center" prop="arrivalNoticeCode" label="到货单号" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="80"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="companyName" label="供应商" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="supplierCostMoney" label="采购金额" width="100"></el-table-column>
          <el-table-column align="center" prop="settlementMoney" label="对账金额" width="100"></el-table-column>
          <el-table-column align="center" prop="earning" label="加减收" width="100"></el-table-column>
          <el-table-column align="center" prop="extraEarning" label="额外加减收" width="100"></el-table-column>
        </el-table>
      </div>
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></pagination>
      </div>
    </el-card>

    <el-dialog title="查看数量" class="customDialogTitle" :visible.sync="dialogModel" width="900px">
      <!-- 包 -->
      <boxlist v-if="isboxList" :cargoMainList="packageList"></boxlist>

      <!-- 商品 -->
      <commoditylist :isWay="isWay" v-if="isCommodity" :tableList="tableList"></commoditylist>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModel = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb"; //导航
import pagination from "@/views/components/pagination";
import commoditylist from "./components/commoditylist";
import boxlist from "./components/boxlist";
import {
  listStoragePurchaseOrder,
  librariesTakeSingle,
  listPackageById,
  getLibrariesTakeGoods
} from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
// import {
//   getPutInStorageGoodsGjList, //顾家列表
//   listPurchaseOrderGoods //商品列表
// } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  components: {
    breadcrumb,
    pagination,
    commoditylist,
    boxlist
  },
  data() {
    return {
      dialogModel: false, //查看
      navList: [],
      tableData: [], //查看采购单详情
      tableList: [], //点击查看按钮
      packageList: [], //点击查看按钮
      isCommodity: false, //显示商品
      isWay: "",
      isboxList: false, //显示商品
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0 //总条数
    };
  },
  mounted() {
    this.navList = this.$route.meta;
  },
  created() {
    this.datafun();
  },
  methods: {
    datafun() {
      let data = {
        orderId: this.$route.query.orderId,
        storageId: this.$route.query.storageId
        // orderId: 1607
      };
      listStoragePurchaseOrder(data)
        .then(res => {
          this.tableData = res.data;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("订单库存列表", error);
        });
    },
    seedetils(val) {
      this.isWay = val.isWay;
      // val.type  1采购单  2库取单
      if (val.type == 1) {
        if (val.isWay == 2 || val.isWay == 1) {
          let data = {
            purchaseOrderId: val.purchaseOrderId
          };
          librariesTakeSingle(data)
            .then(res => {
              if (res.status == 200) {
                this.dialogModel = true;
                this.tableList = res.data;
                this.isCommodity = true;
                this.isboxList = false;
              }
            })
            .catch(error => {
              console.error("获取商品列表", error);
            });
        }

        if (val.isWay == 4 || val.isWay == 3) {
          let data = {
            purchaseOrderId: val.purchaseOrderId
          };
          listPackageById(data)
            .then(res => {
              if (res.status == 200) {
                this.dialogModel = true;
                this.packageList = res.data;
                this.isboxList = true;
                this.isCommodity = false;
              }
            })
            .catch(error => {
              console.error("采购单列表后的采购单明细", error);
            });
        }
      } else {
        let data = {
          librariesTakeId: val.purchaseOrderId
        };
        getLibrariesTakeGoods(data)
          .then(res => {
            if (res.status == 200) {
              this.dialogModel = true;
              this.tableList = res.data;
              this.isCommodity = true;
              this.isboxList = false;
            }
          })
          .catch(error => {
            console.error("获取库取单列表", error);
          });
      }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.datafun();
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.datafun();
    }
  }
};
</script>
<style lang="scss" scoped>
.seepurchase {
  .titlecals {
    top: 0px;
  }
  .item_body {
    max-height: 400px;
    overflow-y: auto;
    overflow-x: auto;
    .item_div {
      display: flex;
      flex-wrap: nowrap;
      ul {
        border-right: 1px solid #ebeef5;
        .item_tiele {
          height: calc(100% - 90px);
        }
        .textAl {
          display: flex;
          align-items: center;
        }
      }
      li {
        border-bottom: 1px solid #ebeef5;
        &:last-of-type {
          border: none;
        }
      }
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 30px;
      }
      .li_detail1 {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
      }
      .li_pro {
        display: flex;
        width: 300px;
        text-align: center;
      }
      .li_detail2 {
        min-width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>