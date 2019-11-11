<template>
  <div class="stockuplist" v-loading="loading">
    <!-- 查询 -->
    <div class="btn-list m-bottom15">
      <el-button size="small" class="button-96" v-for="(item,index) in btnList" :key="index" @click="butGroupAction(item.type)">{{item.name}}</el-button>
    </div>
    <div class="table_list lvs attribute">
      <el-table border :row-class-name="tableRowClassName" :data="tableData" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column align="center" type="selection" fixed width="50"></el-table-column>
        <el-table-column align="center" prop="maintainStatus" label="状态" sortable width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.maintainStatus==0">待处理</p>
            <p v-if="scope.row.maintainStatus==1">处理中</p>
            <p v-if="scope.row.maintainStatus==2">再处理</p>
            <p v-if="scope.row.maintainStatus==3">已处理</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="maintainSource" label="来源" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="oddNumbers" label="订单号" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="purchaseNumber" label="采购合同号" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="templateName" label="类型" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="storageName" label="所属仓库" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="regionName" label="货区" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="siteCode" label="货位" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="handling" label="处理方式" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if='scope.row.handling==1'>新增</p>
            <p v-if='scope.row.handling==2'>转可用</p>
            <p v-if='scope.row.handling==3'>报废</p>
            <p v-if='scope.row.handling==4'>内部销售</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import { maintenanceOrderByPage } from "api/entrepotSet/inventorymanagement/temporarymaintenance/index.js";
import module from "../../../../../../config/index.js";
export default {
  components: {
    pagination
  },
  props: ['params', 'isReset'],
  created() {
    this.getData();
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      btnList: [
        {
          name: "导出",
          type: 0
        },
        {
          name: "报废",
          type: 1
        }
      ],
      loading: false,
      selection: []
    };
  },
  methods: {
    sizeChange(val) {
      this.$emit('resetPage');
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    currentChange(val) {
      this.$emit('resetPage');
      this.currentPage = val;
      this.getData();
    },
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 获取订单列表
    getData() {
      this.loading = true;
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        ...this.params
      };
      maintenanceOrderByPage(data)
        .then(res => {
          this.loading = false;
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          this.loading = false;
          console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/components/orderList.vue-getData:' + error)
        });
    },
    // 点击按钮组
    butGroupAction(type) {
      // 导出
      if (type == 0) {
        // let str = module.dev.proxyTable["/api"].target + "/api/pc/maintainGoods/exportMaintainGoods";
        // window.location.href = str;
      } else if (type == 1) {
        // 报废
        if (this.selection.length) {
          this.$confirm('确定报废?', '提示', {
            type: 'warning'
          }).then(() => {
            this.scrap();
          }).catch(() => {});
        } else {
          this.$message.warning('请先选择');
        }
      }
    },
    // 表格选择数据
    handleSelectionChange(val) {
      this.selection = val;
      if (this.selection.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(this.selection[0]);
      }
    },
    // 报废
    scrap() {
      this.$router.push({
        path: '/scrapmanagement/addscrap'
      })
    }
  },
  watch: {
    isReset(newVal, oldVal) {
      if (newVal) {
        this.currentPage = 1;
      }
    }
  }
};
</script>
