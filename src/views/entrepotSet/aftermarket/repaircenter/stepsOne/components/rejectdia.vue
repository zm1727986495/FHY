<template>
  <!-- 转单弹出框 -->
  <div class="orderchangedia">
    <el-dialog title :visible.sync="visible" width="50%" :before-close="handleClose">
      <div class="titlecals">驳回订单原因</div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="form_class"
      >
        <el-form-item label="是否驳回：" prop="name1">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="驳回原因：" prop="name2">
          <el-input v-model="ruleForm.name2" type="textarea"></el-input>
        </el-form-item>

        <el-form-item class="btn_footer">
          <el-button type="primary" @click="handleok('ruleForm')">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </el-form-item>
      </el-form>
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
    return {
      ruleForm: {
        name1: "",
        name2: ""
      },
      rules: {
        name1: [{ required: true, message: "请选择是否驳回", trigger: "change" }],
        name2: [{ required: true, message: "请输入驳回原因", trigger: "blur" }]
      }
    };
  },

  methods: {
    //关闭回调函数
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("close_reject");
    },

    //确认按钮
    handleok(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs["ruleForm"].resetFields();
          this.$emit("close_reject");
        } else {
          this.$message.error("请检查填写信息是否遗漏");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.orderchangedia {
  .form_class {
    width: 90%;
    margin: 0 auto;
    .btn_footer {
      width: 100%;
      text-align: right;
    }
  }
}
</style>

