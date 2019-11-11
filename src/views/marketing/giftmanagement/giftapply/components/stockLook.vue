<template>
  <!-- 审核页面的礼品库存数弹出框   -->
  <div class="stockNumdia">
    <el-dialog
      title="查看领用数量"
      :visible="visible"
      width="950px"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <div class="search_item_list table_list lvs attribute">
        <el-table border :row-class-name="tableRowClassName" :data="rowObj.inventoryGoodsVOList">
          <el-table-column prop="commodityName" align="center" label="商品名称" sortable></el-table-column>
          <el-table-column prop="storageName" align="center" label="所属仓库" sortable></el-table-column>
          <el-table-column prop="siteCode" align="center" label="货位编号" sortable></el-table-column>
          <el-table-column prop="inventoryNumber" align="center" label="数量" sortable></el-table-column>
          <el-table-column prop="receiveNumber" align="center" label="申请领用数量" sortable></el-table-column>
        </el-table>
      </div>
      <div class="btn_fotter">
        <el-button @click="handleClose" type="warning">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["visible", "rowObj"],
  data() {
    return {};
  },
  methods: {
    handleClose() {
      this.$emit("close_num");
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.stockNumdia {
  .btn_fotter {
    display: flex;
    margin-top: 20px;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

