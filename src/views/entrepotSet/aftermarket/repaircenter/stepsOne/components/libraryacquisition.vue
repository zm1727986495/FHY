<template>
  <div class="librarytake" v-if="tableData.length!=0">
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
          ref="multipleTable"
          :row-class-name="tableRowClassName"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" fixed='left'></el-table-column>
          <el-table-column align="center" prop="commodityName" label="商品名称" width="200" sortable></el-table-column>
          <el-table-column align="center" prop="number" label="数量" width="200"></el-table-column>
          <el-table-column align="center" prop="number1" label="申请数量" width="200">
            <template slot-scope="scope">
              <div>
                <el-input v-model.number="scope.row.number1"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="库取单号" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityCode " label="商品编码" width="200"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="商品类型" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityStatus" label="商品属性" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityUnit" label="计量单位" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="siteCode"
            label="货位"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="age" label="库龄" width="200"></el-table-column>
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
    <div class="h-width"></div>
  </div>
</template>
<script>
import { listLibrariesTake } from "api/Installation/dispatchcenter/dispatchcenter";
import pagination from "@/views/components/pagination";

export default {
  props: ["orderId"],

  components: {
    pagination
  },

  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      elsectVal: [],
      librariesTakeDTOS: []
    };
  },
  mounted() {
    this.getWarehouse();
  },

  methods: {
    //库取单
    getWarehouse(storageId) {
      let data = {
        storageId,
        orderId: this.orderId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listLibrariesTake(data).then(res => {
        if(res.status == 200){
          this.tableData = res.data.rows;
          this.total = res.data.total;
        }
      }).catch(error => {
        console.error("获取库取单列表", error);
      });
    },
    //勾选函数回调
    handleSelectionChange(val) {
      let isundefined = val.every(item => {
        return item.number1 != undefined;
      });
      if (isundefined) {
        this.elsectVal = val;
      }else {
        this.$message.error("您未填写勾选信息的申请数量")
        this.elsectVal = val;
      }
     
      console.log(this.elsectVal);
      
      // this.librariesTakeDTOS = this.elsectVal.map(item => {
      //   return {
      //     inventoryGoodsId: item.inventoryGoodsId,
      //     number: item.number1,
      //     relLibrariesTakeCommodity: item.relLibrariesTakeCommodity,
      //     storagePurchaseOrderId: item.storagePurchaseOrderId
      //   };
      // });
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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
