<template>
  <!-- 这个组件只是用来展示库区的列表  通过安装单id来获取 库区的列表   -->

  <div class="librarytake" v-if="tableData.length != 0">
    <div class="m-top10">
      <div class="iconBox">
        <i class="Icon"></i>
        <span>库取</span>
      </div>
    </div>
    <div class="rl-padding20 m-top10">
      <div class="table_list lvs attribute">
        <el-table border :row-class-name="tableRowClassName" :data="tableData">
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
import { listLibrariesTakeor } from "api/Installation/dispatchcenter/dispatchcenter";
import pagination from "@/views/components/pagination";

export default {

  components: {
    pagination
  },

  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 10,
      elsectVal: [],
      librariesTakeDTOS: []
    };
  },
  mounted() {
    this.getWarehouse();
  },
  methods: {
    //库取单
    getWarehouse() {
      let data = {
        installationType: this.$route.query.installationType,
        installationOrderId:this.$route.query.installationOrderId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listLibrariesTakeor(data)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("获取库取单列表", error);
        });
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
