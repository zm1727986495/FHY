<template>
  <div class="noticedia">
    <el-dialog :visible.sync="isReturnfactory" width="50%" :before-close="handleClose">
      <div class="titlecals">返厂详情</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form_class"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="返厂货品" prop="returnCommodity">
              <el-input v-model="ruleForm.returnCommodity"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="返厂数量" prop="returnNumber">
              <el-input v-model="ruleForm.returnNumber"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="工厂名称" prop="factoryName">
              <el-input v-model="ruleForm.factoryName"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="申报人">
              <el-input :disabled="true" v-model="name"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="申报时间：">
              <!-- <el-date-picker
                v-model="ruleForm.declarantTime"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-M-dd HH:mm:ss"
                format="yyyy-M-dd HH:mm:ss"
                style="width:100%"
              ></el-date-picker>-->
              <el-input :disabled="true" v-model="ruleForm.declarantTime"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <el-form-item label="返厂原因" class="width-100" prop="returnCause">
            <el-input type="textarea" v-model="ruleForm.returnCause" resize="none"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleok">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addReturnFactory } from "api/Installation/dispatchcenter/dispatchcenter";
import { mapGetters } from "vuex";
export default {
  props: {
    choseArr: Array,
    isReturnfactory: Boolean
  },
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      ruleForm: {},
      flag: true,
      rules: {
        returnCommodity: [
          { required: true, message: "请输入返厂货品", trigger: "blur" }
        ],
        returnNumber: [
          { required: true, message: "请输入返厂数量", trigger: "blur" }
        ],
        factoryName: [
          { required: true, message: "请输入工厂名称", trigger: "blur" }
        ],
        declarantGroup: [
          { required: false, message: "请输入申报人", trigger: "blur" }
        ],
        name6: [{ required: true, message: "请输入备注", trigger: "blur" }],
        declarantTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        returnCause: [
          { required: false, message: "请填返厂原因", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getNowFormatDate();
  },
  methods: {
    //确认按钮
    handleok() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = {
            ...this.ruleForm,
            installationOrderId: this.choseArr[0].installationOrderId,
            declarantGroup: this.name
          };
          addReturnFactory(data)
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                this.flag = false;
                this.$emit("handleClose");
                this.$message.success("添加返厂记录成功，等待审核!");
              }
            })
            .catch(error => {
              console.error("增加返厂", error);
            });
        } else {
          this.$message.error("请检查填写信息是否遗漏");
          return false;
        }
      });
    },
    //关闭弹框
    handleClose() {
      this.$emit("handleClose");
    },
    //补0
    repair0(str) {
      return str < 0 ? "0" + str : str;
    },
    //获取当前时间
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let currentdate = `${year}-${this.repair0(month)}-${this.repair0(
        strDate
      )} ${this.repair0(hours)}:${this.repair0(minutes)}:${this.repair0(
        seconds
      )}`;
      this.ruleForm.declarantTime = currentdate;
    }
  }
};
</script>
<style scoped lang='scss'>
.noticedia {
  .form_class {
    width: 90%;
    margin: 0 auto;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .infoform_item {
        width: 50%;
      }
    }
  }
  .dialog-footer {
    width: 95%;
    text-align: right;
  }
}
</style>

