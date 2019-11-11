<template>
  <div>
    <el-dialog
      title="历史价格"
      :visible.sync="coeffDialog"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <div class="table_list lvs attribute m-top20">
        <el-table
          border
          :row-class-name="tableRowClassName"
          :data="tabList"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="hisCoefficient" align="center" sortable label="历史价格"></el-table-column>
          <el-table-column prop="startTime" align="center" label="生效日期"></el-table-column>
          <el-table-column prop="endTime" align="center" label="截止日期"></el-table-column>
        </el-table>
        <!-- 点击批次记录ID分页条 -->
        <div class="pagination_wrap">
          <pagination
            background
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import { listAllRelCostPriceCoefficient } from "api/administrationCenter/salecost/costguard/costguard";

export default {
  props: ["coeffDialog"],
  components: {
    pagination
  },
  data() {
    return {
      //分页
      total: 0, // 总数
      pageSize: 20, // 单页条数
      currentPage: 1, // 当前页
      tabList: [] //列表数据
    };
  },
  methods: {
    //获取成本价系数历史
    getData(costPriceId) {
      let data = {
        costPriceId
      };
      listAllRelCostPriceCoefficient(data)
        .then(res => {
          if (res.status == 200) {
            this.tabList = res.data.rows;
            this.total = res.data.total;
          }
        })
        .catch(error => {
          console.error("获取成本价系数历史", error);
        });
    },
    //关闭销售价弹框
    handleClose() {
      this.$emit("closeFn");
    },
    // 改变条数方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getCostPrice(data);
    },
    // 翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getCostPrice(data);
    },
    //勾选
    handleSelectionChange(val) {
      this.selectVal = val;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
