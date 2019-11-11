<template>
  <div>
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card class="box-card">
      <div class="headerStyle">成品</div>
      <div class="m-top20 table_list lvs attribute">
        <el-table
          border
          style="width: 100%"
          @selection-change="handleChange"
          :row-class-name="tableRowClassName"
          :data="tableData"
        >
          <el-table-column align="center" type="selection" fixed='left'></el-table-column>
          <el-table-column
            align="center"
            prop="commodityName"
            label="商品名称"
            width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="150"></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="120"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="120"></el-table-column>
          <el-table-column
            align="center"
            prop="materialName"
            label="商品材质"
            width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            prop="colourName"
            label="商品颜色"
            width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="inventoryType" label="库存类型" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.inventoryType == 1">新品可用</div>
              <div v-if="scope.row.inventoryType == 2">占用</div>
              <div v-if="scope.row.inventoryType == 3">二次可用</div>
              <div v-if="scope.row.inventoryType == 4">暂扣</div>
              <div v-if="scope.row.inventoryType == 5">门店暂存</div>
              <div v-if="scope.row.inventoryType == 6">样品</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="regionName"
            label="货区"
            width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="库存数量" width="120"></el-table-column>
          <el-table-column align="center" label="转移数量" width="120">
            <template slot-scope="scope">
              <div>
                <el-input
                  @input="transferFn(scope.row)"
                  v-model.number="scope.row.transferTheNumber"
                  size="mini"
                ></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 订单库存 -->
      <div class="headerStyle">订单</div>
      <div class="m-top20" style="width:200px;">
        <el-input
          @keyup.enter.native="getDataOrder()"
          size="small"
          v-model="text"
          placeholder="订单号"
        ></el-input>
      </div>
      <div class="m-top10 table_list lvs attribute">
        <el-table
          border
          ref="multipleTable"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :data="tableList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" fixed="left"></el-table-column>
          <el-table-column align="center" prop="factoryContractNo" label="采购合同号" width="200"></el-table-column>
          <el-table-column align="center" prop="orderNumber" label="订单号" width="150"></el-table-column>
          <el-table-column align="center" prop="createTime" label="订单创建时间" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="storeName"
            label="所属门店"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="status" label="状态" width="120">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.status==0">部分到货</span>
                <span v-if="scope.row.status==1">全部到货</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="totality" label="总数量" width="120"></el-table-column>
          <el-table-column align="center" prop="paidInCount" label="实际库存" width="120"></el-table-column>
          <el-table-column align="center" prop="storageName" label="所属仓库" width="140"></el-table-column>
          <el-table-column align="center" prop="libraryOfAge" label="库龄" width="120"></el-table-column>
          <el-table-column
            align="center"
            prop="loading"
            label="备注"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
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
    <div class="foot_btn_box">
      <el-button type="primary" @click="submission" :loading="loadingBtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import {
  getStockUpGoodsById,
  changeOrder
} from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock";
import { listStoragePurchaseOrderByPage } from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      navList: [],
      tableData: [], //成品列表数量
      tableList: [], //订单库存列表
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      text: "",
      purchaseList: [], //订单库存勾选
      productList: [], //成品库存勾选
      loadingBtn:false
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getData();
    this.getDataOrder();
  },
  methods: {
    //获取订单库存列表
    getDataOrder() {
      let data = {
        text: this.text,
        page: this.currentPage,
        limit: this.pageSize
      };
      listStoragePurchaseOrderByPage(data)
        .then(res => {
          if (res.status == 200) {
            this.tableList = res.data.rows;
            this.total = res.data.total;
          }
        })
        .catch(error => {
          console.error("订单库存列表", error);
        });
    },
    //获取成品列表
    getData() {
      let data = {
        skuGoodsId: this.$route.query.skuGoodsId,
        storageId: this.$route.query.storageId
      };
      getStockUpGoodsById(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.map(item => {
              return { ...item, transferTheNumber: "" };
            });
          }
        })
        .catch(error => {
          console.error("订单库存:备货库存-转订单", error);
        });
    },
    //确定
    submission() {
      let inventoryGoodsList = [];
      let allotGoodsList = [];
      if (!this.productList.length && !this.purchaseList.length) {
        this.$message.error("当前没有要转移的成品!");
        return;
      }
      if (!this.productList.length) {
        this.$message.error("没有选择成品!");
        return;
      }

      if (!this.purchaseList.length) {
        this.$message.error("没有选择订单!");
        return;
      }
      this.productList.forEach(item => {
        if (!item.transferTheNumber && item.transferTheNumber == 0) {
          return;
        }
        inventoryGoodsList.push({
          storageId: item.storageId,
          skuGoodsId: item.skuGoodsId,
          regionId: item.regionId,
          siteId: item.siteId,
          inventoryStatus: 1,
          inventoryNumber: item.transferTheNumber,
          transferTheNumber: item.transferTheNumber,
          purchaseOrderId: item.purchaseOrderId ? item.purchaseOrderId : 0,
          inventoryType: item.inventoryType
        });

        let num = item.inventoryNumber - item.transferTheNumber;
        allotGoodsList.push({
          transferTheNumber: item.transferTheNumber,
          skuGoodsId: item.skuGoodsId,
          inventoryGoodsId: item.inventoryGoodsId,
          regionId: item.regionId,
          siteId: item.siteId,
          storageId: item.storageId,
          inventoryNumber: num,
          purchaseOrderId: item.purchaseOrderId ? item.purchaseOrderId : 0,
          inventoryType: item.inventoryType
        });
      });

      if (inventoryGoodsList.length == 0) {
        this.$message.error("没有转移数量");
        return;
      }
      let data = {
        orderId: this.purchaseList[0].orderId,
        inventoryGoodsList,
        allotGoodsList
      };
      console.log(data);
      this.loadingBtn = true;
      changeOrder(data).then(res => {
          if (res.status == 200) {
            this.$message.success("提交成功!");
            this.loadingBtn = false;
            this.$router.go(-1);
          }else{
            this.loadingBtn = false;
          }
        })
        .catch(error => {
          this.loadingBtn = false;
          console.error("转订单提交", error);
        });
    },
    // 取消
    cancel() {
      this.$router.go(-1);
    },
    //转移数量@input
    transferFn(row) {
      this.tableData.forEach(item => {
        if (row.inventoryGoodsId == item.inventoryGoodsId) {
          if (row.transferTheNumber > item.inventoryNumber) {
            this.$message.error("转移数量大于库存数量");
            item.transferTheNumber = item.inventoryNumber;
          }
        }
      });
    },
    //勾选订单库存
    handleSelectionChange(val) {
      this.purchaseList = val;
      if (this.purchaseList.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(this.purchaseList[0]);
      }
    },
    //勾选成品商品
    handleChange(val) {
      this.productList = val;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getDataOrder();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getDataOrder();
    }
  }
};
</script>
<style lang="scss" scoped>
.headerStyle {
  font-size: 18px;
  font-weight: 500;
  color: #006ec7;
  margin: 15px 35px 0px;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 4px;
    height: 15px;
    background: #006ec7;
    position: absolute;
    left: -16px;
    top: 50%;
    border-radius: 5px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
}
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>