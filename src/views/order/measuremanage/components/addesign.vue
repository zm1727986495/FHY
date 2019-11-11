<template>
  <div class="addesign">
    <el-form
      :label-position="labelPosition"
      label-width="110px"
      :model="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="上传线框图（只支持图片）" prop="resource" required>
        <template>
          <el-upload
            list-type="picture-card"
            class="upload-demo"
            action="string"
            multiple
            accept="image/jpeg, image/png"
            :http-request="uploadSectionFile"
            :file-list="fileList"
            :on-remove="handleRemove"
          >
            <!-- accept="image/jpeg" -->
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="上传效果图" prop="resource" required>
        <template>
          <el-upload
            class="upload-demo"
            action="string"
            multiple
            :http-request="upEffectFile"
            :file-list="fileList"
            :on-remove="effectRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="上传预算清单">
        <template>
          <el-upload
            class="upload-demo"
            action="string"
            multiple
            :http-request="budgetFile"
            :file-list="fileList"
            :on-remove="budgetRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="汇报描述">
        <el-input type="textarea" v-model="addesigndata.describe"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button type="primary" size="medium" @click="subminbtn" :loading="loadingbtn">提交</el-button>
      <el-button size="medium" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { editOrderAccessoryDesign } from "api/order/measuremanage/measuremanage";
import { put } from "@/utils/pubilcFn";
export default {
  data() {
    return {
      processPicture: {}, //图片
      effectmapPicture: {}, //图片
      num: 15,
      TechnologyList: [], //图片列表
      effectmapList: [], //图片列表
      budgetmapList: [], //附件列表
      loadingbtn:false,
      dialogImageUrl: "",
      dialogVisible: false,
      labelPosition: "right",
      value: "",
      value1: "",
      addval: "",
      fileList: [],
      formInline: {
        user: "",
        region: "",
        desc: "",
        type: [],
        resource: ""
      }
    };
  },
  props: ["addesigndata"],
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    subminbtn() {
      this.addesigndata.effectPic = this.effectmapList.map(item => {
        return {
          fileUrl: item.url,
          sourceName: item.name
        };
      });

      this.addesigndata.cadPic = this.TechnologyList.map(item => {
        return {
          fileUrl: item.url,
          sourceName: item.name
        };
      });
      this.addesigndata.budgetPic = this.budgetmapList.map(item => {
        return {
          fileUrl: item.url,
          sourceName: item.name
        };
      });
      if (this.addesigndata.cadPic.length == 0) {
        this.$message.error("请上传线框图");
        return;
      }
      if (this.addesigndata.effectPic.length == 0) {
        this.$message.error("请上传效果图");
        return;
      }
      this.loadingbtn = true;

      editOrderAccessoryDesign(this.addesigndata)
        .then(res => {
          if (res.status === 200) {
            console.log("设计汇报提交成功");
            this.$router.push({ path: "measuremanage" });
            this.loadingbtn = false;
          }else{
            this.loadingbtn = false;
            this.$message.error(res.message)
          }
        })
        .catch(error => {
          this.loadingbtn = false;
          console.error(
            "指派测量:设计汇报提交 order/measuremanage/designdetails.vue",
            error
          );
        });
    },

    //上传CAD图片
    uploadSectionFile(res) {
      put(res).then(data => {
        this.TechnologyList.push(data);
      });
    },
    //刪除CAD图片
    handleRemove(file) {
      let lengs = String(file.raw.uid).length;
      this.TechnologyList = this.TechnologyList.filter(item => {
        let str = item.name.substring(0, lengs);
        return str !== String(file.raw.uid);
      });
    },
    //上传效果图
    upEffectFile(res) {
      put(res).then(data => {
        this.effectmapList.push(data);
      });
    },
    //删除效果图
    effectRemove(file) {
      let lengs = String(file.raw.uid).length;
      this.effectmapList = this.effectmapList.filter(item => {
        let str = item.name.substring(0, lengs);
        return str !== String(file.raw.uid);
      });
    },

    //上传预算清单
    budgetFile(res) {
      put(res).then(data => {
        this.budgetmapList.push(data);
      });
    },
    //删除预算清单
    budgetRemove(file) {
      let lengs = String(file.raw.uid).length;
      this.budgetmapList = this.budgetmapList.filter(item => {
        let str = item.name.substring(0, lengs);
        return str !== String(file.raw.uid);
      });
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.addesign {
  .addresbox {
    display: flex;
    .explaintxttwo {
      width: 140px;
      display: block;
    }
  }
  .addresslist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .input-with-select {
      max-width: 150px;
    }
    .addresele {
      max-width: 150px;
    }
  }
  .btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>

