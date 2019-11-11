<template>
  <div class="rejectorder">
    <el-dialog
      title="转单驳回原因"
      :visible.sync="isRejectorder"
      width="800px"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <div class="rl-padding20">
        <div class="remarks">
          <span class="width-80">是否驳回：</span>
          <el-radio v-model="bindInfo.radio" label="1">是</el-radio>
          <el-radio v-model="bindInfo.radio" label="2">否</el-radio>
        </div>
        <div class="remarks m-top10" v-if="bindInfo.radio=='1'">
          <span class="width-80">驳回原因：</span>
          <el-input
            type="textarea"
            :rows="2"
            resize="none"
            placeholder="请输入内容"
            v-model="bindInfo.remakes"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { edirRejectInstallationOrder } from "api/Installation/dispatchcenter/dispatchcenter";
import { mapMutations } from "vuex";
export default {
  props: ["rejectData", "isRejectorder"],
  data() {
    return {
      bindInfo: {
        radio: ""
      },
      i: 0
    };
  },
  methods: {
    ...mapMutations(["SET_PAYMENT", "SET_REPAIRCENTER"]),
    handleClose() {
      this.bindInfo = {};
      this.$emit("closeall");
    },
    determine() {
      if (this.bindInfo.radio == "") {
        this.$message.warning("请选择是否驳回!");
        return;
      } else if (this.bindInfo.radio == "2") {
        this.handleClose();
        return;
      } else {
      }
      let data = {
        installationOrderId: this.rejectData.installationOrderId,
        changeType: "2",
        remakes: this.bindInfo.remakes
      };
      edirRejectInstallationOrder(data)
        .then(res => {
          if (res.status == 200) {
            this.handleClose();
            this.SET_PAYMENT(`驳回${new Date().getTime()}`);
            this.SET_REPAIRCENTER(`驳回${new Date().getTime()}`);
            this.$message.success("驳回成功!");
          } else {
            this.$message.info("驳回失败!");
          }
        })
        .catch(error => {
          console.error("驳回", error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.rejectorder {
  .remarks {
    display: flex;
  }
  .width-80 {
    min-width: 70px;
    text-align: right;
  }
}
</style>
