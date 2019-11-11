<template>
  <!-- 预约上门弹出框 -->
  <div class="noticedia">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form_class">
      <div class="infoform">
        <div class="infoform_item">
          <el-form-item label="上门类型" prop="doorType">
            <el-radio-group v-model="ruleForm.doorType">
              <el-radio label="1">送装一体</el-radio>
              <el-radio label="2">送装分离</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="infoform_item">
          <el-form-item label="是否等通知" prop="isInform">
            <el-radio-group v-model="ruleForm.isInform" @change="isInformChange">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <div class="infoform">
        <div class="infoform_item">
          <el-form-item label="预约上门时间" prop="appointmentTime">
            <el-date-picker
              :disabled="isTime"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="ruleForm.appointmentTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </div>

        <div class="infoform_item">
          <el-form-item label="再约时间" prop="againAbout">
            <el-date-picker
              :disabled="isAgainT"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="ruleForm.againAbout"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </div>
      </div>

      <div class="infoform">
        <div class="infoform_item">
          <el-form-item label="是否扛楼" prop="resistance">
            <el-radio-group v-model="ruleForm.resistance">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="infoform_item">
          <el-form-item label="老房改造" prop="oldHouse">
            <el-radio-group v-model="ruleForm.oldHouse">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>

      <div class="infoform">
        <div class="infoform_item">
          <el-form-item label="上门联系人" prop="contacts">
            <el-input v-model="ruleForm.contacts"></el-input>
          </el-form-item>
        </div>
        <div class="infoform_item">
          <el-form-item label="联系电话" prop="contactsPhone">
            <el-input v-model="ruleForm.contactsPhone"></el-input>
          </el-form-item>
        </div>
      </div>

      <div class="infoform">
        <div class="infoform_item">
          <el-form-item label="安装条件" prop="installationCondition">
            <el-radio-group v-model="ruleForm.installationCondition">
              <el-radio label="0">满足</el-radio>
              <el-radio label="1">不满足</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <div class="infoform">
        <el-form-item label="预约备注" prop="remakes" class="width-100">
          <el-input v-model="ruleForm.remakes" type="textarea" class="width-100"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { addAppointmentDoor } from "api/Installation/dispatchcenter/dispatchcenter";
import { mapMutations } from "vuex";
import { appointmentDoorDetails } from "api/Installation/dispatchcenter/dispatchcenter";
export default {
  props: ["choseArr"],
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      ruleForm: {
        doorType: "1",
        appointmentTime: "",
        againAbout: ""
      },
      flag: true, //是否关闭弹框
      i: 0, //状态
      isTime: true,
      isAgainT: true,
      rules: {
        //验证
        installationCondition: [
          { required: true, message: "请选择安装条件", trigger: "change" }
        ],
        doorType: [
          { required: true, message: "请选择上门类型", trigger: "change" }
        ],
        resistance: [
          { required: true, message: "请选择是否抗楼", trigger: "change" }
        ],
        oldHouse: [
          { required: true, message: "请选择是否老房改造", trigger: "change" }
        ],
        contacts: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        contactsPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        isInform: [
          { required: true, message: "请选择是否等通知", trigger: "change" }
        ],
        remakes: [{ required: false, message: "请输入备注", trigger: "blur" }],
        appointmentTime: [
          {
            required: false,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        againAbout: [
          {
            required: false,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      }
    };
  },

  methods: {
    ...mapMutations(["SET_PAYMENT"]),
    //关闭回调函数
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("closeall");
    },

    isInformChange() {
      if (this.ruleForm.isInform == 1) {
        this.ruleForm.appointmentTime = "";
        this.rules.appointmentTime[0].required = false;
        this.rules.againAbout[0].required = true;
        this.isTime = true;
        this.isAgainT = false;
      } else {
        this.ruleForm.againAbout = "";
        this.rules.appointmentTime[0].required = true;
        this.rules.againAbout[0].required = false;
        this.isTime = false;
        this.isAgainT = true;
      }
    },
    //获取列表
    getData(installationOrderId,customerName,customerPhone) {
      let data = {
        installationOrderId
      };
      appointmentDoorDetails(data)
        .then(res => {
          if (res.status == 200) {
            if (res.data) {
              // this.ruleForm = res.data;
              this.$set(this,'ruleForm',res.data)
              if(res.data.contacts){
                this.$set(this.ruleForm,'contacts',res.data.contacts)
              }else{
                this.$set(this.ruleForm,'contacts',contacts)
              }

              if(res.data.contactsPhone){
                this.$set(this.ruleForm,'contactsPhone',res.data.contactsPhone)
              }else{
                this.$set(this.ruleForm,'contactsPhone',contactsPhone)
              }
              if (res.data.isInform != null) {
                this.ruleForm.isInform = String(res.data.isInform);
                if (this.ruleForm.isInform == 1) {
                  this.ruleForm.appointmentTime = "";
                  this.rules.appointmentTime[0].required = false;
                  this.rules.againAbout[0].required = true;
                  this.isTime = true;
                  this.isAgainT = false;
                } else {
                  this.ruleForm.againAbout = "";
                  this.rules.appointmentTime[0].required = true;
                  this.rules.againAbout[0].required = false;
                  this.isTime = false;
                  this.isAgainT = true;
                }
              }
            }else{
              this.$set(this.ruleForm,'contacts',customerName)
              this.$set(this.ruleForm,'contactsPhone',customerPhone)
            }
          }
        })
        .catch(error => {
          console.error("预约上门回显", error);
        });
    },

    //确认按钮
    handleok() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = {
            installationOrderId: this.choseArr[0].installationOrderId,
            ...this.ruleForm
          };
          addAppointmentDoor(data)
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                this.flag = true;
                this.$message.success("预约上门成功!");

                this.SET_PAYMENT(`预约上门${new Date().getTime()}`);
              }
            })
            .catch(error => {
              console.error("预约上门时间！", error);
            });
        } else {
          this.$message.error("请检查填写信息是否遗漏");
          this.flag = false;
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.noticedia {
  .timeappointment {
    display: flex;
    .el-input__icon {
      height: 0 !important;
    }
    p {
      min-width: 120px;
      text-align: right;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      font-weight: bold;
    }
  }
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

