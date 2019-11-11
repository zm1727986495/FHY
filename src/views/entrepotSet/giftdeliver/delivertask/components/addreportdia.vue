<template>
  <div class="addreportdia">
    <el-dialog title="礼品汇报日志" :visible.sync="visible" width="750px" :before-close="handleClose" custom-class="customDialogTitle">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="是否送达" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="1">已送达</el-radio>
            <el-radio label="0">未送达</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.reportRemark"></el-input>
        </el-form-item>
        <el-form-item class="btn_list">
          <el-button type="primary" v-if="isShow" @click="handleOK">提交汇报</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  addReportReamke,
  reportRemakeDetails
} from "api/entrepotSet/giftdeliver/giftdeliver";
export default {
  props: ["visible", "giftSendId", "isShow"],
  components: {},
  data() {
    return {
      ruleForm: {},
      rules: {
        status: [
          { required: true, message: "请选择是否送达", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    //如果为查看页面   回显信息  没有提交按钮
    if (!this.isShow) {
      let data = {
        giftSendId: this.giftSendId
      };
      reportRemakeDetails(data)
        .then(res => {
          if (res.status == "200") {
            this.ruleForm = res.data;
            this.ruleForm.status = String(this.ruleForm.status);
          }
        })
        .catch(error => {
          console.log(
            error +
              "views/entrepotSet/giftdeliver/delivertask/components/addreportdia"
          );
        });
    }
  },

  methods: {
    //确认
    handleOK() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.ruleForm.giftSendId = this.giftSendId; //赋值id
          addReportReamke(this.ruleForm)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("添加汇报成功");
                this.$emit("closeok_add");
              }
            })
            .catch(error => {
              console.log(
                error +
                  "views/entrepotSet/giftdeliver/delivertask/components/addreportdia"
              );
            });
        } else {
          console.log("请检车填写信息");
          return false;
        }
      });
    },
    //取消
    handleClose() {
      this.$emit("close_addreport");
    }
  }
};
</script>
<style scoped lang='scss'>
.addreportdia {
  .demo-ruleForm {
    width: 97%;
  }
  .btn_list {
    width: 100%;
    text-align: right;
  }
}
</style>

