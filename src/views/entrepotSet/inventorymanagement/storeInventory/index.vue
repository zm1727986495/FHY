<template>
  <div>
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <div class="table_list lvs attribute">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column align="center" prop="storeName" label="名称" sortable show-overflow-tooltip>
            <!-- <template slot-scope="scope">
              <p class="table_action_span" @click="nameFun(scope.row.storeId)">{{scope.row.storeName}}</p>
            </template> -->
          </el-table-column>
          <el-table-column align="center" prop="address" label="地址" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="shopManager" label="店长"></el-table-column>
          <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
          <el-table-column align="center" prop="inventoryTotal" label="库存总数"></el-table-column>
          <el-table-column align="center" prop="costing" label="成本金额"></el-table-column>
          <el-table-column align="center" prop="remark" label="备注"></el-table-column>
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
      <div v-if="outerVisible">
        <detailedialog :outerVisible="outerVisible" :storeids="storeId" @closeFun="closeFun"></detailedialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import detailedialog from "./components/detailedialog";
import { mapGetters } from "vuex";
import { storeInventoryByPage } from "api/entrepotSet/inventorymanagement/storeInventory/storeInventory";

export default {
  components: {
    breadcrumb,
    pagination,
    detailedialog
  },
  data() {
    return {
      storeId: "",//门店id
      navList: [],
      tableData: [],
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      outerVisible: false
    };
  },
  computed: {
    ...mapGetters(["maxHeight"]),
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getData();
  },
  methods: {
    //获取店面库存列表
    getData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize
      };
      storeInventoryByPage(data)
        .then(res => {
          if(res.status==200){
            this.tableData = res.data.rows;
            this.total = res.data.total;
          }
        })
        .catch(error => {
          console.error("获取店面库存列表", error);
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    },
    //点击名称
    nameFun(val) {
      this.storeId = 144;
      this.outerVisible = true;
    },
    closeFun() {
      this.outerVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
