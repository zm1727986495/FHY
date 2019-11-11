<template>
  <!-- 预约上门弹出框 -->
  <div class="responsibilitydia">
    <el-dialog title :visible.sync="visible" width="60%" :before-close="handleClose">
      <div class="titlecals">定责汇报</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form_class"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="定责对象" prop="name1">
              <el-select v-model="ruleForm.name1" placeholder="请选择定责对象" class="width-100">
                <el-option label="定责对象一" value="0"></el-option>
                <el-option label="定责对象二" value="1"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="责任人姓名" prop="name2">
              <el-input v-model="ruleForm.name2"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="处罚金额" prop="name3">
              <el-input v-model="ruleForm.name3" placeholder="填写罚金数"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="收款方式" prop="name4">
              <el-select v-model="ruleForm.name4" placeholder="请选择定责对象" class="width-100">
                <el-option label="支付宝" value="0"></el-option>
                <el-option label="微信" value="1"></el-option>
                <el-option label="银行卡转账" value="2"></el-option>
                <el-option label="现金" value="3"></el-option>
                <el-option label="工资扣除" value="4"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <el-form-item label="定责照片">
            <el-upload
              class="avatar-uploader"
              :data="uptoken"
              list-type="picture-card"
              :action="action"
              :accept="accept"
              :on-remove="handleRemove"
              :on-error="handError"
              :file-list="fileList"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>

        <div class="infoform">
          <el-form-item label="定责描述" prop="name5" class="width-100">
            <el-input v-model="ruleForm.name5" type="textarea" class="width-100"></el-input>
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
import { getUpToken } from "@/utils/auth";

import { getNames } from "src/utils/pubilcFn.js";
export default {
  props: ["visible"],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      ruleForm: {},
      rules: {
        name1: [
          { required: true, message: "请选择定责对象", trigger: "change" }
        ],
        name2: [
          { required: true, message: "请输入责任人姓名", trigger: "blur" }
        ],
        name3: [{ required: true, message: "请填写罚金数", trigger: "blur" }],
        name4: [
          { required: true, message: "请选择付款方式", trigger: "change" }
        ],
        name5: [{ required: true, message: "请输入定责描述", trigger: "blur" }]
      },
      uptoken: {
        //上传参数
        token: "",
        key: ""
      },
      imgShow: "http://file.xczhihui.com/", //文件上传域名
      action: "http://up-z2.qiniup.com",
      accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
      fileList: []
    };
  },

  mounted() {
    // 头部面包屑
    this.uptoken.token = getUpToken();
  },

  methods: {
    //文件上传前操作
    beforeAvatarUpload(file) {
      //console.log(this.imgShow+file.lastModified+".jpg");
      this.uptoken.key = `${file.lastModified}.jpg`;
    },

    //文件删除操作
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },

    //文件上传失败
    handError(err) {
      this.$message.error("文件上传失败，可尝试退出登录重新操作");
    },

    //文件成功操作  //addAccessory编辑的新增接口
    handleAvatarSuccess(res, file, fileList) {
      this.fileList = fileList;
    },

    //关闭回调函数
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("close_respons");
    },

    //确认按钮
    handleok(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.fileList);
          this.$refs["ruleForm"].resetFields();
          this.$emit("close_respons");
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
.responsibilitydia {
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

