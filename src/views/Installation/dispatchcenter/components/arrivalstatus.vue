<template>
  <!-- 通知弹出框 -->
  <div class="noticedia">
    <el-dialog
      title="到货状态"
      :visible.sync="isArrivalstatus"
      width="30%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <!-- <div class="rl-padding20 m-bottom"> 
        
      </div>-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="m-left20">
        <el-form-item prop="commodityPrepare">
          <el-radio-group v-model="ruleForm.commodityPrepare">
            <el-radio label="0">未到货</el-radio>
            <el-radio label="1">部分到货</el-radio>
            <el-radio label="2">货品到齐</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleok">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapMutations } from "vuex";

import {
  editIsSpeed,
} from "api/Installation/dispatchcenter/dispatchcenter";

export default {
  props:['elsectVal','isArrivalstatus'],
  data() {
    return {
      ruleForm: {},
      rules: {
        commodityPrepare: [
          { required: true, message: "请选择到货状态", trigger: "change" }
        ]
      },
      i:0
    };
  },

  methods: {
    ...mapMutations(["SET_REPAIRCENTER","SET_PAYMENT"]),
    
    //关闭回调函数
    handleClose() {
      this.$refs['ruleForm'].resetFields();
      this.$emit("closeall");
    },
    //确认按钮
    handleok(formName) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let data = {
            installationOrderId : this.elsectVal[0].installationOrderId,
            commodityPrepare : this.ruleForm.commodityPrepare,
          }
          console.log(data);
          editIsSpeed(data).then(res => {
            if(res.status == "200"){
              this.$message.success("修改到货状态成功")
              this.SET_PAYMENT(`修改到货状态${new Date().getTime()}`)
              this.SET_REPAIRCENTER(`修改到货状态${new Date().getTime()}`)
              this.handleClose();
            }else{
              this.$message.error("修改到货状态失败")
            }
          })
          
        } else {
          this.$message.error("请选择到货状态")
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.noticedia {
  .dialog-footer {
    width: 95%;
    text-align: right;
  }
}
</style>

