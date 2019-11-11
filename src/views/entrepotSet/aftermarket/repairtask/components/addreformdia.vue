<template>
  <div class="addreformdia">
    <el-dialog title="改制汇报" :visible.sync="visible" width="60%" :before-close="handleClose" custom-class="customDialogTitle">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="formclass">
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="改制板数" prop="stryppedDownNumber">
              <el-input v-model="ruleForm.stryppedDownNumber"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="单块价格" prop="unitPrice">
              <el-input v-model="ruleForm.unitPrice"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="材料成本" prop="materialCost">
              <el-input v-model="ruleForm.materialCost"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="改制费" prop="stryppedDownMoney">
              <el-input v-model="ruleForm.stryppedDownMoney"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="改板厂" prop="stryppedDownFactory">
              <el-input v-model="ruleForm.stryppedDownFactory"></el-input>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="改制照片" required>
          <el-upload multiple list-type="picture-card" class="upload-demo" action="string" :accept="accept" 
          :http-request="uploadSectionFile" :file-list="fileList" :on-remove="handleRemove">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="改制内容" prop="stryppedDownContent">
          <el-input v-model="ruleForm.stryppedDownContent" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addedit">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { put } from "@/utils/pubilcFn";
import {
  addStryppedDown // 添加改制
} from "@/api/entrepotSet/aftermarket/repairtask/repairtask";

export default {
  props: ["visible", "designateInstallationId"],
  data() {
    return {
      ruleForm: {},
      rules: {
        stryppedDownNumber: [
          { required: true, message: "请输入改制板数", trigger: "blur" }
        ],
        unitPrice: [
          { required: true, message: "请输入单块价格", trigger: "blur" }
        ],
        materialCost: [
          { required: true, message: "请输入材料成本", trigger: "blur" }
        ],
        stryppedDownMoney: [
          { required: true, message: "请输入改制费", trigger: "blur" }
        ],
        stryppedDownFactory: [
          { required: true, message: "请输入改板厂", trigger: "blur" }
        ],
        stryppedDownContent: [{ required: false }]
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
  mounted() {},

  methods: {
    //文件成功操作
    uploadSectionFile(res) {
      put(res).then(data => {
        this.imgArr.push(data);
      });
    },

    //刪除图片
    handleRemove(file) {
      console.log(file);
      let lengs = String(file.raw.uid).length;
      this.imgArr = this.imgArr.filter(item => {
        let str = item.name.substring(0, lengs);
        return str !== String(file.raw.uid);
      });
    },

    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.fileList = [];
      this.$emit("close_addref");
    },
    addedit() {
      if (this.imgArr.length == 0) {
        this.$message.error("请上传图片");
        return;
      }

      console.log(this.imgArr);
      this.ruleForm.stryppedPic = this.imgArr.map(item => {
        return {
          fileUrl: item.url,
          sourceName: item.name
        };
      });

      this.ruleForm.designateInstallationId = this.designateInstallationId;

      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          addStryppedDown(this.ruleForm)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("添加改制成功");
                this.$refs["ruleForm"].resetFields();
                this.fileList = [];
                this.$emit("ok_addref");
              }
            })
            .catch(error => {
              console.log("添加改制" + error);
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
.addreformdia {
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

