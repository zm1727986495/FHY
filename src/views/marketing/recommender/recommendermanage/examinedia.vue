<template>
  <!-- 审核记录弹出框 -->
  <div class="examine_dia">
    <el-dialog title :visible.sync="visible" width="50%" :before-close="handleClose">
      <div class="titlecals">审核记录</div>

      <div class="table_list lvs attribute m-top20">
        <el-table border :row-class-name="tableRowClassName" :data="tabList" style="width: 100%;">
          <el-table-column prop="operateName" align="center" label="操作人" sortable></el-table-column>
          <el-table-column prop="operateTime" align="center" label="操作时间" sortable></el-table-column>
          <el-table-column prop="operateResult" align="center" label="操作结果" sortable>
            <template slot-scope="scope">
              <!-- 0:待提交 1:待审核 2:审核通过 3:驳回 -->
              <div>
                <p v-if="scope.row.operateResult == '0' ">待提交</p>
                <p v-if="scope.row.operateResult == '1' ">待审核</p>
                <p v-if="scope.row.operateResult == '2' ">审核通过</p>
                <p v-if="scope.row.operateResult == '3' ">驳回</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" align="center" label="备注" sortable></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination_wrap">
          <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
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
    return { currentPage: 1, pageSize: 10, total: 100, tabList: [] };
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
      listReferrerCheckLog(data).then(res => {
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
    //关闭回调函数
    handleClose() {
      this.$emit("close_examin");
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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

