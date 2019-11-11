<template>
  <div class="repaircom6">
    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20">
      <el-table border :data="tabList" style="width: 100%;" :row-class-name="tableRowClassName">
        <el-table-column prop="outboundNumber" label="出库单号" sortable align="center"></el-table-column>

        <el-table-column prop="outboundName" label="出库人" align="center"></el-table-column>

        <el-table-column prop="outboundTime" label="出库时间" align="center"></el-table-column>

        <el-table-column prop="storageName" label="所属仓库" align="center"></el-table-column>

        <el-table-column prop="factoryName" label="出库清单" align="center">
          <template slot-scope="scope">
            <div>
              <p class="table_action_span" @click="seeFun(scope.row)">查看</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="outboundStatus" label="出库状态" align="center"></el-table-column>

        <el-table-column prop="remake" label="出库备注" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination_wrap">
      <pagination
        :current-page="currentPage"
        :pageSize="pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>
    <el-dialog
      title="出库清单"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <!-- 订单 -->
      <purchaseList :designateOutLibraryId="designateOutLibraryId" v-if="dialogVisible"></purchaseList>

      <!-- 库取 -->
      <libraylist :designateOutLibraryId="designateOutLibraryId" v-if="dialogVisible"></libraylist>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {
  listDesignateOutLibrary,
  listDesignateOutLibraryLibrariesTake,
  listDesignateOutLibraryCommodity
} from "api/Installation/dispatchcenter/dispatchcenter";
import libraylist from "./libraylist";
import purchaseList from "./purchaseList";

export default {
  components: {
    breadcrumb,
    pagination,
    libraylist,
    purchaseList
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      navList: [], //头部面包屑

      elsectVal: [], //选中框
      tabList: [], //table数据
      dialogVisible: false,
      designateOutLibraryId: ""
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.searchFun();
  },
  methods: {
    // 查询按钮
    searchFun() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        orderId: this.$route.query.orderId
      };
      listDesignateOutLibrary(data)
        .then(res => {
          console.log(res);
          this.tabList = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("返厂日志", error);
        });
    },
    //查看
    seeFun(row) {
      this.designateOutLibraryId = row.designateOutLibraryId;
      this.dialogVisible = true;
    },
    //关闭弹框
    handleClose() {
      this.dialogVisible = false;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.searchFun();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.searchFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.repaircom6 {
  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_item {
    width: calc(((94vw - 250px)) / 4);
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    .fontMore {
      color: #d0cfcf;
    }
  }
  .table_action_span {
    color: rgb(127, 221, 228);
    cursor: pointer;
  }
}
</style>

