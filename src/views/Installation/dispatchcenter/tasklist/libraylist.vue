<template>
  <div class="librarytake" v-if="tableData.length!=0">
    <div class="h-width"></div>
    <div class="m-top10">
      <div class="iconBox">
        <i class="Icon"></i>
        <span>库取</span>
      </div>
    </div>
    <div class="rl-padding20 m-top10">
      <div class="table_list lvs attribute">
        <el-table
          border
          :row-class-name="tableRowClassName"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" fixed></el-table-column>
          <el-table-column align="center" prop="commodityName" label="商品名称" width="200" sortable></el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="库取单号" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityCode " label="商品编码" width="200"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="商品类型" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityStatus" label="商品属性" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityUnit" label="计量单位" width="200"></el-table-column>
          <el-table-column align="center" prop="number" label="数量" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="siteCode"
            label="货位"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="privateIntegerage" label="库龄" width="200"></el-table-column>
          <el-table-column align="center" prop="storageTime" label="入库时间" width="200"></el-table-column>
        </el-table>
      </div>
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
  </div>
</template>
<script>
import { listDesignateOutLibraryLibrariesTake } from "api/Installation/dispatchcenter/dispatchcenter";
import pagination from "@/views/components/pagination";

export default {
  props: ["designateOutLibraryId"],

  components: {
    pagination
  },

  data() {
    return {
      tableData: [],//列表数据
      currentPage: 1,//当前页
      pageSize: 10,//每页
      total: 0,//总页数
      elsectVal: [],//勾选
      librariesTakeDTOS: []
    };
  },
  mounted() {
    this.getWarehouse();
  },
  methods: {
    //库取单
    getWarehouse() {
      console.log(this.designateOutLibraryId);

      let data = {
        designateOutLibraryId: this.designateOutLibraryId
      };

      listDesignateOutLibraryLibrariesTake(data)
        .then(res => {
          console.log(res);
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("出库清单库取", error);
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      this.librariesTakeDTOS = this.elsectVal.map(item => {
        return {
          inventoryGoodsId: item.inventoryGoodsId,
          number: item.number,
          relLibrariesTakeCommodity: item.relLibrariesTakeCommodity,
          storagePurchaseOrderId: item.storagePurchaseOrderId
        };
      });
    },

    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getWarehouse();
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getWarehouse();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
