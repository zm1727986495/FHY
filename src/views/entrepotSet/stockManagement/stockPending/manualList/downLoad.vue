<template>
  <div class="downLoad">
    <el-dialog
      title="到货单模板"
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="customDialogTitle"
      :before-close="handleClose"
    >
      <div class="btnList"></div>
      <div class="table-width lvs attribute">
        <el-table
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          :data="tableData"
        >
          <el-table-column type="selection" align="center" width="55" fixed></el-table-column>
          <el-table-column
            align="center"
            prop="aogName"
            label="名称"
            width="200"
            sortable
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="companyName"
            label="供应商"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="createTime" label="生效时间" width="200"></el-table-column>
          <el-table-column align="center" prop="createName" label="创建人" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="remarks"
            label="备注"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTemplate">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import {
  listAogByPage,
  exportListAogTemplate
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
export default {
  props: ["dialogVisible"],
  components: {
    pagination
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      tableData: [],
      templateList: [],
      downFile: "",
      choseArr: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取到货模板
    getData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize
      };
      listAogByPage(data)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("到货模板", error);
        });
    },
    //关闭到货单模板
    handleClose() {
      this.$emit("closurePurchase");
    },
    //到货单模板弹框确定
    addTemplate() {
      if (this.choseArr.length < 1) {
        this.$message.warning("只少勾选一个模板!");
      } else if (this.choseArr.length > 1) {
        this.$message.warning("只能勾选一个模板!");
      } else {
        this.$parent.getPackage(this.choseArr[0].aogId, true);
        this.handleClose();
      }
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    handleSelectionChange(val) {
      this.choseArr = val;
    }
  }
};
</script>
<style lang='scss' scoped>
.downLoad {
  .btnList {
    margin-bottom: 20px;
  }
  .table_action_span {
    color: rgb(127, 221, 228);
    cursor: pointer;
  }
}
</style>