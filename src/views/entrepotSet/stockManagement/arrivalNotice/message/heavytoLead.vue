<template>
  <div>
    <div>
      <ul class="formList clearfloat">
        <li>
          <span>上传到货单：</span>
          <div class="uploadarrival m-right20">
            <el-input v-model="uploadText" disabled></el-input>
          </div>
          <div class="browse">
             <el-upload
                  multiple
                  class="upload-demo"
                  action="string"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  :http-request="uploadSectionFile"
                  :before-upload="beforeAvatarUpload"
                >
                   <el-button size="small" class="button-96" style="height:35px;">浏览</el-button>
                </el-upload>
            <!-- <el-button size="small" class="button-96" @click=''>浏览</el-button> -->
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

import { againImportArrivalNotice } from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import { put } from "@/utils/pubilcFn";
export default {
  data() {
    return {
      uploadText: "",
      lengs:'',
      upLoadList:''
    };
  },
  mounted() {
  },
  methods: {
    eliminate() {
      this.uploadText = "";
    },
    beforeAvatarUpload(file) {
      this.lengs = String(file.lastModified).length;
      const isxls =
        file.type == "application/vnd.ms-excel" ||
        file.type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt2M = file.size / 1024 / 1024 < 100;

      // if (!isxls) {
      //   this.$message.error("上文件只能是 xls 格式!");
      //   return isxls;
      // }
      if (!isLt2M) {
        this.$message.error("上文件大小不能超过 100MB!");
        return isLt2M;
      }
    },
    //上传文件
    uploadSectionFile(res) {
      put(res).then(data => {
        this.upLoadList = data.url;
        this.uploadText = data.name.substring(this.lengs);
      });
    },
    // 上传失败
    uploadError(err, file, fileList) {
      console.log(err, file, fileList);
    }
  }
};
</script>
<style scoped>
.el-upload-list--text {
  display: none;
}
.uploadarrival {
  width: 217px;
  display: inline-block;
}
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfloat {
  zoom: 1;
}
.formList {
  width: 100%;
}
.formList > li > span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.formList > li {
  width: 50%;
  float: left;
  margin-bottom: 20px;
  display: flex;
  /* justify-content: center;
        align-items: center; */
}
.formList > li:nth-last-child(1) {
  width: 100%;
}
</style>
