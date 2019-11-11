<template>
  <div class="detailstorage">
    <el-dialog title="出库详情" :visible.sync="dialogVisible" width="700px" :before-close="handleClose" custom-class="customDialogTitle">
      <div>
        <ul class="storage">
          <li>
            <span>出库单号：</span>
            <span>nx26793547</span>
          </li>
          <li>
            <span>商品名称：</span>
            <span>大木门</span>
          </li>
          <li>
            <span>来源单号：</span>
            <span>ly68900</span>
          </li>
          <li>
            <span>商品型号：</span>
            <span>x-8974</span>
          </li>
          <li>
            <span>商品类型：</span>
            <span>橱柜</span>
          </li>
          <li>
            <span>商品材质：</span>
            <span>nx26793547</span>
          </li>
          <li>
            <span>商品颜色：</span>
            <span>nx26793547</span>
          </li>
          <li>
            <span>数量：</span>
            <span>nx26793547</span>
          </li>
        </ul>
      </div>
      <div class="receiptnumber">
        <div>
          <span>
            <i class="redS"></i>售价：
          </span>
          <el-input size="small" v-model="input" style="width:60%"></el-input>
        </div>
        <div>
          <span>
            <i class="redS">*</i>收据号：
          </span>
          <el-input size="small" v-model="input" style="width:60%"></el-input>
        </div>
      </div>
      <!-- 图片 -->
      <div class="picture">
        <el-upload
          class="upload-demo"
          :data="technology"
          :action="TechnologyimgUrl"
          :limit="num"
          list-type="picture-card"
          :accept="Technologyaccept"
          :on-remove="Technologydel"
          :on-success="TechnologySwiper"
          :before-upload="beforeAvatarUp"
          :on-error="uploadError"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="processPicture.dialogVisible" class="box">
          <img width="100%" :src="processPicture.dialogImageUrl" alt>
        </el-dialog>
      </div>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUpToken } from "@/utils/auth";
export default {
  props: {
    dialogVisible: Boolean
  },
  data() {
    return {
      input: "",
      Technologyaccept: "image/jpeg,image/gif,image/png,image/bmp", //上传的文件类型
      TechnologyimgShow: "http://file.xczhihui.com/",
      TechnologyimgUrl: "http://up-z2.qiniup.com", //上传地址
      TechnologyList: [], //图片列表
      technology: {
        //图片上传参数
        token: "",
        key: ""
      },
      num: 10,
      processPicture: {} //图片
    };
  },
  created() {
    this.technology.token = getUpToken();
  },
  methods: {
    handleClose() {
      this.$emit("outerVisibleFun");
    },
    //图片删除移除
    Technologydel(file, fileList) {},
    // 图片上传成功
    TechnologySwiper(val) {
      if (this.TechnologyList.length <= 10) {
        this.processPicture.dialogImageUrl = this.TechnologyimgShow + val.key;
        this.TechnologyList.push({
          fileUrl: this.processPicture.dialogImageUrl,
          sourceName: val.key
        });
      }
    },
    //图片上传之前
    beforeAvatarUp(file) {
      this.technology.key = `${file.lastModified}.png`;
    },
    // 上传失败
    uploadError(err, file, fileList) {
      console.log(err, file, fileList);
    }
  }
};
</script>
<style lang="scss" scoped>
.detailstorage {
  .storage {
    display: flex;
    flex-wrap: wrap;
    padding: 0 20px;
    li {
      width: 33%;
      margin-bottom: 15px;
    }
  }
  .receiptnumber {
    display: flex;
    padding: 0 20px;
  }
  .redS {
    color: red;
  }
  .picture {
    margin-top: 20px;
    padding: 0 15px;
  }
}
</style>
