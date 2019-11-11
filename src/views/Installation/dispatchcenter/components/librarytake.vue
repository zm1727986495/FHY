<template>
  <div class="librarytake">
    <div class="m-top10">
      <div class="iconBox">
        <i class="Icon"></i>
        <span>库取</span>
      </div>
    </div>
    <div class="rl-padding20 m-top10">
      <div class="table_list lvs attribute">
        <el-table border :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" prop="commodityName" label="商品名称" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="库取单号" width="150" show-overflow-tooltip=""></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityCode " label="商品编码" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityStatus" label="商品属性" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityUnit" label="计量单位" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="number" label="数量" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="siteCode" label="货位" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="privateIntegerage" label="库龄" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="storageTime" label="入库时间" width="160"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { listLibrariesTake } from "api/Installation/dispatchcenter/dispatchcenter";
export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.getWarehouse()
  },
  props:['orderId'],
  methods: {
     //库取单
    getWarehouse() {
      let data = {
        orderId: this.orderId
      };
      listLibrariesTake(data)
        .then(res => {
          this.tableData = res.data.rows;
        })
        .catch(error => {
          console.error("获取库取单列表", error);
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
