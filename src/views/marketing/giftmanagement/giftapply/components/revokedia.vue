<template>
  <!-- 撤销申请弹出框   应该不用了  需求去掉了 -->
  <div class="revoke_dia">
    <el-dialog title :visible.sync="visible" width="45%" :before-close="handleClose">
      <div class="titlecals">提示</div>
      <div class="re_content">
        <div class="re_content_div">
          <span>
            <i class="el-icon-warning col_red"></i>
          </span>
          <div class="re_content_div_input">是否确认撤销</div>
        </div>
        <div class="re_content_div">
          <span>撤销原因：</span>
          <div class="re_content_div_input">
            <el-input type="textarea" placeholder="请输入内容" v-model="textarea2"></el-input>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="selectok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateStoreGiftCollarStatus } from "@/api/order/giftmanagement/giftmanagement";

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { getNames } from "src/utils/pubilcFn.js";
export default {
  props: ["visible", "giftCollarId"],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      textarea2: ""
    };
  },

  mounted() {},
  methods: {
    //关闭回调函数
    handleClose() {
      this.textarea2 = "";
      this.$emit("close_rev");
    },

    //确认按钮
    selectok() {
      if (this.textarea2 == "") {
        this.$message.error("请填写撤销原因");
        return;
      }
      let data = {
        giftCollarId: this.giftCollarId,
        revokeReason: this.textarea2
      };
      console.log(data);

      updateStoreGiftCollarStatus(data).then(res => {
        if (res.status == "200") {
          this.$message.success("撤销申请单成功");
          this.textarea2 = "";
          this.$emit("send_rev");
        } else {
          this.$message.error("请求发送失败");
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.re_content {
  width: 80%;
  margin: 0 auto;
  .re_content_div {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 15px;
    span {
      display: inline-block;
      min-width: 100px;
      text-align: right;
      padding-right: 15px;
    }
    .re_content_div_input {
      flex: 1;
    }
    .col_red {
      color: red;
      font-size: 22px;
    }
  }
}
</style>

