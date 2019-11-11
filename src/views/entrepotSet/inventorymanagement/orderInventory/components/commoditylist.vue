<template>
  <div>
    <div class="table_list lvs attribute m-top10">
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableList">
        <el-table-column align="center" prop="commodityName" show-overflow-tooltip label="商品名称"></el-table-column>
        <el-table-column
          align="center"
          prop="commodityCode"
          label="商品编码"
          show-overflow-tooltip
          sortable
        ></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类"></el-table-column>
        <el-table-column align="center" prop="piece" label="件" v-if="isWay==1"></el-table-column>
        <el-table-column align="center" prop="regionSite" label="货区货位" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="inventoryNumber" label="库存数量"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: ["tableList", "isWay"],
  data() {
    return {};
  },
  methods: {
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
