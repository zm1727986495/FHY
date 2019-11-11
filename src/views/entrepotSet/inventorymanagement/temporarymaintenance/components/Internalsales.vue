<template>
  <div class="Internalsales">
    <el-dialog title="内部销售申请单" :visible.sync="internalVisible" width="700px" :before-close="handleClose" custom-class="customDialogTitle">
      <div>
        <ul class="storage">
          <li>
            <span>出库单号：</span>
            <span>nx26793547</span>
          </li>
          <li>
            <span>商品名称：</span>
            <span>大木门</span>
          </li>
          <li>
            <span>来源单号：</span>
            <span>ly68900</span>
          </li>
          <li>
            <span>商品型号：</span>
            <span>x-8974</span>
          </li>
          <li>
            <span>商品类型：</span>
            <span>橱柜</span>
          </li>
          <li>
            <span>商品材质：</span>
            <span>nx26793547</span>
          </li>
          <li>
            <span>商品颜色：</span>
            <span>nx26793547</span>
          </li>
          <li>
            <span>数量：</span>
            <span>nx26793547</span>
          </li>
        </ul>
      </div>
      <div class="step">
        <el-steps :active="active" finish-status="success">
          <el-step title="提交申请"></el-step>
          <el-step title="行政审批"></el-step>
          <el-step title="审批通过"></el-step>
        </el-steps>
      </div>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">提交申请</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    internalVisible: Boolean
  },
  data() {
    return {
      active:0
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeFun");
    }
  }
};
</script>
<style lang="scss" scoped>
.Internalsales {
  .storage {
    display: flex;
    flex-wrap: wrap;
    padding: 0 20px;
    li {
      width: 33%;
      margin-bottom: 15px;
    }
  }
  .step{
    padding: 0 20px;
  }
}
</style>
