<template>
  <!-- 变更弹出框 -->
  <div class="examine_dia">
    <el-dialog title :visible.sync="visible" width="800px" :before-close="selectok">
      <div class="titlecals">外部推荐人变更记录</div>

      <div class="table_list lvs attribute m-top20">
        <el-table
          border
          :row-style="tableBodycolor"
          :row-class-name="tableRowClassName"
          :data="tabList"
          style="width: 100%;"
        >
          <el-table-column prop="beforeChange" show-overflow-tooltip align="center" label="变更前" sortable ></el-table-column>
          <el-table-column prop="afterChange" show-overflow-tooltip align="center" label="变更后" sortable ></el-table-column>
          <el-table-column prop="createName" align="center" label="操作人" sortable ></el-table-column>
          <el-table-column prop="createTime" align="center" label="更改时间" sortable ></el-table-column>
        </el-table>

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
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import {
  listReferrerCheckLog, //获取推荐人审核记录
  referrerChangeRecord //变更记录
} from "@/api/order/recommender/recommender";
export default {
  props: ["visible", "referrerId"],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      radio: "",
      currentPage: 1,
      pageSize: 10,
      total: 100,
      tabList: []
    };
  },
  mounted() {
    this.getdata();
  },

  methods: {
    getdata() {
      let data = {
        referrerId: this.referrerId,
        page: this.currentPage,
        limit: this.pageSize
      };
      referrerChangeRecord(data).then(res => {
        this.tabList = res.data.rows;
        this.total = res.data.total;
      });
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getdata();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getdata();
    },

    //确认按钮
    selectok() {
      this.$emit("close_change");
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    }
  }
};
</script>
<style scoped lang='scss'>
.examine_dia {
}
</style>

