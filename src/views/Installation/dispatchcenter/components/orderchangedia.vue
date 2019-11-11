<template>
  <!-- 转单弹出框 -->
  <div class="orderchangedia">
    <el-dialog title="选择安装部" :visible.sync="visible" width="40%" :before-close="handleClose" top="1vh" custom-class="customDialogTitle">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="form_class">
        <el-form-item label="安装部：" prop="organizationId">
          <el-select filterable v-model="ruleForm.organizationId" placeholder="请选择安装部">
            <el-option
              v-for="item in optionsList"
              :key="item.serveGroupId"
              :label="item.serveGroupName"
              :value="item.serveGroupId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注：" prop="remakes">
          <el-input v-model="ruleForm.remakes" type="textarea"></el-input>
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
import { edirRejectInstallationOrder } from "@/api/entrepotSet/aftermarket/repaircenter/repaircenter";
import {
  listLoginServeGroup //获取列表
} from "@/api/Installation/dispatchcenter/dispatchcenter";
import { mapMutations } from "vuex";
export default {
  props: ["visible", "elsectVal"],
  components: {
    breadcrumb,
    pagination
  },
  mounted() {
    this.getlistServeGroup();
  },
  data() {
    return {
      optionsList: [],
      ruleForm: {
        organizationId: "",
        remakes: "",
        changeType: "1" //1代表转单
      },
      i: 0, //状态
      dialogVisible2: false, //组织机构弹框
      rules: {
        //验证
        organizationId: [
          { required: true, message: "请选择安装部", trigger: "change" }
        ]
      },
      treeData: [],
      companyId: "",
      label: "",
      names: ""
    };
  },

  methods: {
    getlistServeGroup() {
      let data = {
        dataCode: "INSTALL_DEPARTMENT"
      };
      listLoginServeGroup(data).then(res => {
        if (res.status == 200) {
          this.optionsList = res.data;
        }
      });
    },
    //关闭回调函数
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("close_order");
    },
    ...mapMutations(["SET_REPAIRCENTER", "SET_PAYMENT"]),
    //确认按钮
    handleok(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.installationOrderId = this.elsectVal[0].installationOrderId;
          console.log(this.ruleForm);
          edirRejectInstallationOrder(this.ruleForm).then(res => {
            if (res.status == "200") {
              this.$message.success("转单成功");
              this.SET_PAYMENT(`转单${new Date().getTime()}`);
              this.SET_REPAIRCENTER(`转单${new Date().getTime()}`);
              this.handleClose();
            } else {
              this.$message.error("转单失败");
            }
          });
        } else {
          this.$message.error("请检查填写信息是否遗漏");
          return false;
        }
      });
    },
    mechanism() {
      this.dialogVisible2 = true;
    },
    //组织机构确定按钮
    byConfirm() {
      this.ruleForm.organizationId = this.organizationId;
      this.names = this.label;
      this.dialogVisible2 = false;
    },
    //点击组织机构时获取到的数据
    nodeData(data) {
      this.organizationId = data.id;
      this.label = data.label;
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

