<template>
  <div class="chargedia">
    <el-dialog title="收费详情" :visible.sync="visible" width="60%" :before-close="handleClose" custom-class="customDialogTitle">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="formclass">
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="收费类型" prop="chargeMold">
              <el-input v-model="ruleForm.chargeMold"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="金额" prop="chargeMoney">
              <el-input v-model="ruleForm.chargeMoney"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="收费方式" prop="chargeWay">
              <el-input v-model="ruleForm.chargeWay"></el-input>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="备注">
          <el-input v-model="ruleForm.remake" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="收费凭证" required>
          <el-upload multiple list-type="picture-card" class="upload-demo" action="string" :accept="accept" 
          :http-request="uploadSectionFile" :file-list="fileList" :on-remove="handleRemove">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pushdit" v-if="!OneTime">新增</el-button>
        <el-button type="primary" @click="addedit" v-if="OneTime">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { put } from "@/utils/pubilcFn";

import {
  addCharge, // 收费
  chargeMoneyDetails // 收费回显
} from "@/api/entrepotSet/aftermarket/repairtask/repairtask";

export default {
  props: ["visible", "designateInstallationId"],
  data() {
    return {
      OneTime: false,
      ruleForm: {},
      rules: {
        chargeMold: [
          { required: true, message: "请输入收费类型", trigger: "blur" }
        ],
        chargeMoney: [
          { required: true, message: "请输入金额", trigger: "blur" }
        ],
        chargeWay: [
          { required: true, message: "请输入收费方式", trigger: "blur" }
        ]
      },
      options: [
        {
          value: "1",
          label: "工人1"
        },
        {
          value: "2",
          label: "工人2"
        }
      ],
      accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
      fileList: [],
      imgArr: []
    };
  },
  mounted() {
    this.getInfo();
  },

  methods: {
    //回显信息
    getInfo() {
      let data = {
        designateInstallationId: this.designateInstallationId
      };
      chargeMoneyDetails(data)
        .then(res => {
          if (res.status == "200") {
            if (res.data == null) {
              this.ruleForm = {};
            } else {
              this.ruleForm = res.data;
              if (this.ruleForm.chargePic.length > 0) {
                this.fileList = this.ruleForm.chargePic.map(item => {
                  return {
                    ...item,
                    url: item.fileUrl
                  };
                });
              }
            }
          }
        })
        .catch(error => {
          console.log("收费信息回显");
        });
    },

    //文件成功操作
    uploadSectionFile(res) {
      put(res).then(data => {
        this.imgArr.push(data);
      });
    },

    //刪除图片
    handleRemove(file) {
      let lengs = String(file.raw.uid).length;
      this.imgArr = this.imgArr.filter(item => {
        let str = item.name.substring(0, lengs);
        return str !== String(file.raw.uid);
      });
    },

    handleClose() {
      this.ruleForm = {};
      this.fileList = [];
      this.imgArr = [];
      this.$emit("close_charge");
    },
    pushdit() {
      this.OneTime = true;
      this.ruleForm = {};
      this.fileList = [];
      this.imgArr = [];
    },
    addedit() {
      if (this.imgArr.length == 0) {
        this.$message.error("请上传图片");
        return;
      }

      this.ruleForm.chargePic = this.imgArr.map(item => {
        return {
          fileUrl: item.url,
          sourceName: item.name
        };
      });
      this.ruleForm.designateInstallationId = this.designateInstallationId;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          addCharge(this.ruleForm)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("添加收费成功");
                this.ruleForm = {};
                this.fileList = [];
                this.$emit("ok_charge");
              }
            })
            .catch(error => {
              console.log("收费" + error);
            });
        } else {
          this.$message.error("检查填写信息");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.chargedia {
  .formclass {
    width: 90%;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .infoform_item {
        width: 50%;
      }
    }
  }
}
</style>

