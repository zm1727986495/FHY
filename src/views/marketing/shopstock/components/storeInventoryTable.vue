<template>
  <div class="table_list">
    <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="datas" ref="multipleTable">
      <el-table-column type="selection" width="45" align="center" fixed="left"></el-table-column>
      <el-table-column prop="commodityName" label="商品名称" width="220" sortable align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="commodityCode" label="商品编码" width="140" sortable align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="acceptanceNumber" label="门店库存数" width="120" sortable align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="inventoryNumber" label="仓库暂存数量" width="140" sortable align="center" v-if="type==2" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="openstock">{{ scope.row.inventoryNumber }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="120" sortable align="center"></el-table-column>
      <el-table-column prop="categoryName" label="品类" width="120" sortable align="center"></el-table-column>
      <el-table-column prop="referrerType" label="销售价格" width="120" sortable align="center"></el-table-column>
<!--      <el-table-column prop="jobState" label="货品是否可售" width="150" sortable align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <p v-if="scope.row.jobState == '1' ">是</p>-->
<!--          <p v-if="scope.row.jobState == '0' ">否</p>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column  prop="applyName" align="center" label="备注" min-width="160" sortable show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "storeInventoryTable",
    props: {
      datas: {
        type: Array,
        default: () => []
      },
      type: {
        default: () => 1
      }
    },
    data() {
      return {
        multipleSelection: []
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        return rowIndex % 2 != 0 ? "el-f0" : "";
      },
      // 勾选函数回调
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0]);
        }
        this.$emit('selectionChange', this.multipleSelection);
      },
      // 点击门店库存数量
      openstock() {
        this.$emit('openstock');
      }
    }
  }
</script>

<style scoped>

</style>
