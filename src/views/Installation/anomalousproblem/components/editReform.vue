<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="isReform"
      width="800px"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="form_class"
      >
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
          <div class="infoform_item">
            <el-form-item label="改制费" prop="stryppedDownMoney">
              <el-input v-model="ruleForm.stryppedDownMoney"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="改板厂" prop="stryppedDownFactory">
              <el-input v-model="ruleForm.stryppedDownFactory"></el-input>
            </el-form-item>
          </div>
        </div>
        <div style="padding-left:50px;">
          <el-upload
            list-type="picture-card"
            class="upload-demo"
            action="string"
            :limit="5"
            :http-request="uploadSectionFile"
            :file-list="fileList"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <div class="infoform m-top20">
          <el-form-item label="改制内容" style="width:100%">
            <el-input type="textarea" placeholder="请输入内容" v-model="ruleForm.stryppedDownContent"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submissionFn">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  stryppedDownDetails,
  editStryppedDown
} from "api/Installation/anomalousproblem/reformlist";
import {
  addAccessory,
  removeAccessoryImg //删除图片
} from "@/api/order/recommender/recommender";
import { put } from "@/utils/pubilcFn";
export default {
  props: ["stryppedDownId", "isReform"],
  data() {
    return {
      ruleForm: {}, //信息
      fileList: [], //图片回显
      TechnologyList: [], //新增图片
      delImgArr: [], //删除图片
      //验证
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
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取回显信息
    getData() {
      let data = {
        stryppedDownId: this.stryppedDownId
      };
      stryppedDownDetails(data)
        .then(res => {
          this.ruleForm = res.data;
          this.fileList = res.data.stryppedPic.map(item => {
            return {
              ...item,
              url: item.fileUrl
            };
          });
        })
        .catch(error => {
          console.error("获取改制信息回显", error);
        });
    },
    //提交
    submissionFn() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.delImgArr.length > 0) {
            this.delImgArr.forEach(item => {
              removeAccessoryImg(item).then(res => {});
            });
          }
          this.TechnologyList.forEach(item => {
            let data = {
              dataSourceEnum: "StryppedPic",
              dataSourceId: this.stryppedDownId,
              fileUrl: item.url,
              sourceName: item.name
            };
            addAccessory(data).then(res => {});
          });
          this.ruleForm.stryppedDownId = this.stryppedDownId;

          editStryppedDown(this.ruleForm)
            .then(res => {
              if (res.status == 200) {
                this.$message.success(res.message);
                this.handleClose();
              }
            })
            .catch(error => {
              console.error("编辑提交", error);
            });
        } else {
          this.$message.error("当前还没有未填写!");
          return false;
        }
      });
    },
    //取消
    handleClose() {
      this.$emit("close");
    },
    //上传CAD图片
    uploadSectionFile(res) {
      put(res).then(data => {
        this.TechnologyList.push(data);
      });
    },
    //刪除CAD图片
    handleRemove(file, fileList) {
      if (file.dataSourceId) {
        //console.log("旧图片删除");
        let delobj = {
          accessoryId: file.accessoryId,
          dataSourceId: file.dataSourceId,
          dataSourceEnum: file.dataSourceEnum
        };
        this.delImgArr.push(delobj);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form_class {
  width: 90%;
  margin: 0 auto;
  .infoform {
    display: flex;
    flex-wrap: nowrap;
    // justify-content: space-between;
    .infoform_item {
      width: 50%;
    }
  }
}
</style>
