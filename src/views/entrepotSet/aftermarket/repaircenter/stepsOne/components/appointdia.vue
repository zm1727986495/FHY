<template>
  <!-- 预约上门弹出框 -->
  <div class="noticedia">
    <el-dialog title :visible.sync="visible" width="60%" :before-close="handleClose">
      <div class="titlecals">预约上门</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form_class"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="维修条件" prop="installationCondition">
              <el-radio-group v-model="ruleForm.installationCondition">
                <el-radio label="1">满足</el-radio>
                <el-radio label="0">不满足</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="infoform_item">
            <el-form-item label="是否等通知" prop="isInform">
              <el-radio-group @change="isInformChange" v-model="ruleForm.isInform">
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
                :disabled="showTime1"
                type="datetime"
                placeholder="选择日期"
                v-model="ruleForm.appointmentTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="再约时间" prop='againAbout'>
              <el-date-picker
                :disabled="showTime2"
                type="datetime"
                placeholder="选择日期"
                v-model="ruleForm.againAbout"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="是否抗楼" prop="resistance">
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
          <el-form-item label="预约备注" class="width-100">
            <el-input v-model="ruleForm.remakes" type="textarea" class="width-100"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <div class="dialog-footer">
        <el-button type="primary" @click="handleok('ruleForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { mapMutations } from "vuex";
import { appointmentDoorDetails } from "api/Installation/dispatchcenter/dispatchcenter";
import {
  addAppointmentDoor //预约上门
} from "@/api/entrepotSet/aftermarket/repaircenter/repaircenter";
import { log } from "util";

export default {
  props: ["visible", "elsectVal",'customerPhone','customerName'],
  components: {
    breadcrumb,
    pagination
  },
  mounted(){
    // this.ruleForm.contactsPhone = this.customerPhone;
    // this.ruleForm.contacts = this.customerName;
    // console.log(this.customerPhone);
    
  },
  // name: 'brandmanagement',
  data() {
    return {
      showTime1:true,
      showTime2:true,
      ruleForm: {
        againAbout:"",
        appointmentTime:"",
        contactsPhone:"",
        contacts:""
      },
      rules: {
        installationCondition: [
          { required: true, message: "请选择维修条件", trigger: "change" }
        ],
        isInform: [
          { required: true, message: "请选择是否等通知", trigger: "change" }
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
        appointmentTime: [
          {
            required: false,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        
        // remakes: [{ required: true, message: "请输入备注", trigger: "blur" }],
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
    ...mapMutations(["SET_REPAIRCENTER"]),
    //关闭回调函数
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("close_appoint");
    },

    //是否等通知改变事件
    isInformChange() {
      if (this.ruleForm.isInform == "1") {
        this.rules.appointmentTime[0].required = false;
        this.rules.againAbout[0].required = true;
        this.ruleForm.appointmentTime = '';
        this.showTime2 = false;
        this.showTime1 = true;
      } else {
        this.rules.appointmentTime[0].required = true;
        this.rules.againAbout[0].required = false;
        this.ruleForm.againAbout = '';  
        this.showTime1 = false;
        this.showTime2 = true;
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
                if (this.ruleForm.isInform == "1") {
                  this.rules.appointmentTime[0].required = false;
                  this.rules.againAbout[0].required = true;
                  this.ruleForm.appointmentTime = '';
                  this.showTime2 = false;
                  this.showTime1 = true;
                } else {
                  this.rules.appointmentTime[0].required = true;
                  this.rules.againAbout[0].required = false;
                  this.ruleForm.againAbout = '';  
                  this.showTime1 = false;
                  this.showTime2 = true;
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
    handleok(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.installationOrderId = this.elsectVal[0].installationOrderId;
          addAppointmentDoor(this.ruleForm).then(res => {
            if (res.status == "200") {
              this.$message.success("预约上门成功");
              this.$refs["ruleForm"].resetFields();
              this.SET_REPAIRCENTER(`预约上门${new Date().getTime()}`);
              this.$emit("close_appoint");
            } else {
              this.$message.error("预约上门失败");
            }
          });
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

