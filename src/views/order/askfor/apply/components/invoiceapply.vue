<template>
  <!-- 开票申请 -->
  <div class="invoiceapply">
    、
  </div>
</template>
<script>
import pagination from "../../../../components/pagination";
import breadcrumb from "../../../../components/breadcrumb";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
    
    };
  },

  mounted() {},
  methods: {
    

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.invoiceapply {
}
</style>

