<template>
  <div class="librarytake" v-if="tableData!=0">
    <div class="m-top10">
      <div class="iconBox">
        <i class="Icon"></i>
        <span>礼品</span>
      </div>
    </div>
    <div class="rl-padding20 m-top10">
      <div class="table_list lvs attribute">
        <el-table
          border
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          :data="tableData"
        >
          <el-table-column align="center" type="selection" width="40"></el-table-column>
          <el-table-column
            align="center"
            prop="arrivalNoticeCode"
            label="礼品名称"
            width="200"
            sortable
          ></el-table-column>
          <el-table-column align="center" prop="type" label="库取单号" width="200"></el-table-column>
          <el-table-column align="center" prop="status" label="商品型号" width="200"></el-table-column>
          <el-table-column align="center" prop="companyName" label="商品编码" width="200"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="商品类型" width="200"></el-table-column>
          <el-table-column align="center" prop="storageName" label="商品属性" width="200"></el-table-column>
          <el-table-column align="center" prop="cardNum" label="计量单位" width="200"></el-table-column>
          <el-table-column align="center" prop="deliveryDate" label="数量" width="200"></el-table-column>
          <el-table-column align="center" prop="createTime" label="货位" width="200"></el-table-column>
          <el-table-column align="center" prop="stevedoreName" label="库龄" width="200"></el-table-column>
          <el-table-column align="center" prop="isDelete" label="入库时间" width="200"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{}]
    };
  },
  methods: {
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    handleSelectionChange(val) {
      console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
