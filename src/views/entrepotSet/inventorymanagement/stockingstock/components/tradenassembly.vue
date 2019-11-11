<template>
  <div class="tradenassembly">
    <div class="table_list lvs attribute">
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column align="center" prop="receiptsNum" label="商品名称" sortable width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品型号" sortable width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品型号" sortable width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="入库日期"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="库龄（天）"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="入库单号"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="采购单号"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品规格"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品类型"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="计量单位"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="实际库存"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="所属仓库"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="货位"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="可用库存"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="占用库存"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="期初成本"  width="200"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="来源单号"  width="200"></el-table-column>
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
  </div>
</template>
<script>
import pagination from "../../../../components/pagination";
import { getStockUpGoodsDetailsById } from "@/api/entrepotSet/inventorymanagement/stockingstock/stockingstock.js";

export default {
  components: {
    pagination
  },
  data() {
    return {
      skuGoodsId: this.shopdata,
      tableData: [],
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100 //总条数
    };
  },
  props: ["shopdata"],
  created() {
    // 根据sku商品id查看商品详情
    getStockUpGoodsDetailsById({skuGoodsId: this.skuGoodsId}).then(res => {
      console.log(res);
      if(res.status == 200){
        this.tableData = res.data;
        // this.total = res.total
      }
    })
    .catch(error => {
      console.error("获取备货列表", error);
    });
    
  },
  methods: {
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
.tradenassembly {
}
</style>
