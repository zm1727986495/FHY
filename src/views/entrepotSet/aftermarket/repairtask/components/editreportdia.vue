<template>
  <div class="editreportdia">
    <el-dialog
      title="编辑维修任务派单"
      :visible.sync="visible"
      width="60%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="formclass"
      >
        <el-form-item label="预约上门时间">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="ruleForm.date1"></el-date-picker>
          <el-checkbox v-model="ruleForm.name1" class="m-left20">派单后给客户推送派单信息</el-checkbox>
        </el-form-item>

        <div class="repairer">
          <div>
            <span id="repairer_title">选择维修工</span>
          </div>
          <div class="repairer_content">
            <el-form-item label="选择工长">
              <el-select v-model="ruleForm.name2" placeholder="选择工长">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择工人">
              <el-select v-model="ruleForm.name2" placeholder="选择工人">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="vehicle">
          <div>
            <span class="vehicle_title">选择派车</span>
          </div>
          <div class="vehicle_check">
            <div>
              <el-radio v-model="ruleForm.radio" label="1">内部派车</el-radio>
            </div>
            <div>
              <el-radio v-model="ruleForm.radio" label="2">外部派车</el-radio>
            </div>
          </div>
          <div class="m-top20">
            <el-input v-model="ruleForm.name3"></el-input>
          </div>
        </div>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.name4" style="width:90%"></el-input>
        </el-form-item>

        <el-form-item label="是否携带备货品">
          <el-radio v-model="ruleForm.name5" label="1">是</el-radio>
          <el-radio v-model="ruleForm.name5" label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否收费">
          <el-radio v-model="ruleForm.name6" label="1">是</el-radio>
          <el-radio v-model="ruleForm.name6" label="2">否</el-radio>
        </el-form-item>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="收费">
              <el-input v-model="ruleForm.companyName" style="width:50%"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="预计收费">
              <el-input v-model="ruleForm.referrerName" style="width:50%"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addedit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUpToken } from "@/utils/auth";

export default {
  props: ["visible"],
  data() {
    return {
      ruleForm: {},
      rules: {},
      options: [
        {
          value: "1",
          label: "工人1"
        },
        {
          value: "2",
          label: "工人2"
        }
      ]
    };
  },
  mounted() {},

  methods: {
    handleClose() {
      this.$emit("close_edit");
    },
    addedit() {
      this.$emit("close_edit");
    }
  }
};
</script>
<style scoped lang='scss'>
.editreportdia {
  .repairer {
    display: flex;
    #repairer_title {
      display: inline-block;
      min-width: 150px;
      text-align: right;
      font-weight: 700;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
    }
    .repairer_content {
      display: inline-block;
    }
  }
  .vehicle {
    display: flex;
    .vehicle_title {
      display: inline-block;
      min-width: 150px;
      text-align: right;
      font-weight: 700;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
    }
    .vehicle_check {
      > div {
        display: block;
        min-width: 150px;
        text-align: right;
        font-weight: 700;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
      }
    }
  }
  .infoform {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .infoform_item {
      width: 50%;
    }
  }
}
</style>

