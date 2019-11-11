<template>
  <div class="stockuplist">
    <div class="btn_list_1">
      <el-button size="small" class="button-96" type="default">导出</el-button>
      <el-button size="small" class="button-96" type="default" @click="approvalFun">审批</el-button>
    </div>
    <div class="table_list lvs attribute">
      <el-table
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @selection-change="chooseDelete"
        :data="tableData"
      >
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" sortable width="200">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.status==1">申请中</p>
              <p v-if="scope.row.status==2">通过</p>
              <p v-if="scope.row.status==3">驳回</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="maintainSource" label="来源" width="200"></el-table-column>
        <el-table-column align="center" prop="commodityName" label="商品名称" width="200"></el-table-column>
        <el-table-column align="center" prop="commodityCode" label="商品编码" width="200"></el-table-column>
        <el-table-column align="center" prop="commodityModel" label="商品型号" width="200"></el-table-column>
        <el-table-column align="center" prop="brandName" label="商品品牌" width="200"></el-table-column>
        <el-table-column align="center" prop="classifyName" label="商品分类" width="200"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="商品品类" width="200"></el-table-column>
        <el-table-column align="center" prop="materialName" label="商品材质" width="200"></el-table-column>
        <el-table-column align="center" prop="colourName" label="商品颜色" width="200"></el-table-column>
        <el-table-column align="center" prop="storageName" label="所属仓库" width="200"></el-table-column>
        <el-table-column align="center" prop="regionName" label="货区" width="200"></el-table-column>
        <el-table-column align="center" prop="siteCode" label="货位" width="200"></el-table-column>
        <el-table-column align="center" prop="handling" label="处理方式" width="200">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.handling==1">新增</p>
              <p v-if="scope.row.handling==2">转可用</p>
              <p v-if="scope.row.handling==3">报废</p>
              <p v-if="scope.row.handling==4">内部销售</p>
            </div>
          </template>
        </el-table-column>
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
    <el-dialog
      title="审批"
      :visible.sync="dialogVisible"
      width="20%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <div class="approval">
        <el-radio v-model="radio" label="2">审批通过</el-radio>
        <el-radio v-model="radio" label="3">驳回</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="approvalconfirmation">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import {
  maintenanceGoodsSalesByPage,
  auditInternalSalesApply
} from "api/entrepotSet/inventorymanagement/internalsales/internalsales.js";
export default {
  components: {
    pagination
  },
  data() {
    return {
      tableData: [], //列表
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      choseArr: [], //勾选
      dialogVisible: false, //弹框
      radio: ""
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //验证
    canonlyFun() {
      if (this.choseArr.length < 1) {
        this.$message.warning("您未勾选!");
        return false;
      } else if (this.choseArr.length > 1) {
        this.$message.warning("只能勾选一条!");
        return false;
      } else {
        return true;
      }
    },
    //维修暂存-备货-内部销售管理列表
    getData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize
      };
      maintenanceGoodsSalesByPage(data)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("维修暂存-备货-内部销售管理列表", error);
        });
    },

    //审批
    approvalFun() {
      if (this.canonlyFun()) {
        if (this.choseArr[0].status == 2) {
          this.$message.warning("此单已经通过!");
        } else if (this.choseArr[0].status == 3) {
          this.$message.warning("此单已经驳回!");
        } else {
          this.dialogVisible = true;
        }
      }
    },
    //审批确定
    approvalconfirmation() {
      if (this.radio == "") {
        this.$message.error("请选择审批!");
        return;
      }
      let data = {
        status: this.radio,
        maintainGoodsId: this.choseArr[0].maintainGoodsId,
        internalSalesApplyId: this.choseArr[0].internalSalesApplyId
      };
      auditInternalSalesApply(data)
        .then(res => {
          if (res.status == 200) {
            this.$message.success(
              `${this.radio == 2 ? "驳回成功!" : "审批通过成功!"}`
            );
            this.handleClose();
            this.radio = "";
            this.getData();
          }
        })
        .catch(error => {
          console.error("维修暂存审批", error);
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
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.stockuplist {
  .btn_list_1 {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    > button {
      margin: 5px;
    }
  }
  .approval {
    display: flex;
    justify-content: center;
  }
}
</style>
