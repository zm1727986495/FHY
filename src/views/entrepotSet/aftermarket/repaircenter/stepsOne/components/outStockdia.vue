<template>
  <!-- 指派出库弹出框 -->
  <div class="outStockdia">
    <el-dialog title :visible.sync="visible" width="40%" :before-close="handleClose">
      <div class="titlecals">指派出库</div>
      <p class="noticedia_text">内容待确定</p>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleok">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import { getNames } from "src/utils/pubilcFn.js";
export default {
  props: ["visible"],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {};
  },

  methods: {
    //关闭回调函数
    handleClose() {
      this.$emit("close_outStock");
    },

    //确认按钮
    handleok(formName) {
      this.$emit("close_outStock");
    }
  }
};
</script>
<style scoped lang='scss'>
.outStockdia {
  .noticedia_text {
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 20px;
  }
  .dialog-footer{
    width: 95%;
    text-align: right;
  }
}
</style>

