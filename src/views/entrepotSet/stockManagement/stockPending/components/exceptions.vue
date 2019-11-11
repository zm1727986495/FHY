<template>
  <div>
    <el-dialog title="异常提交" :visible.sync="dialogModel" width="40%">
      <div class="pl-20">
        <div class="solve m-bottom10">
          <div>
            <span>建议解决方案：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>跟进人：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div>
          <span>照片：</span>
          <div class="m-top10">
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
        </div>
        <div class="solve m-top20">
          <span style="min-width:80px;">异常备注：</span>
          <el-input type="textarea" resize="none" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendJava">异常提交</el-button>
        <el-button @click="dialogModel = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUpToken } from "@/utils/auth";
export default {
  data() {
    return {
      dialogModel: false,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      technology: {
        //图片上传参数
        token: "",
        key: ""
      },
      Technologyaccept: "image/jpeg,image/gif,image/png,image/bmp", //上传的文件类型
      TechnologyimgShow: "http://file.xczhihui.com/",
      TechnologyimgUrl: "http://up-z2.qiniup.com", //上传地址
      num: 10,
      TechnologyList: [], //图片列表
      processPicture: {}, //图片
      value: "",
      textarea: ""
    };
  },
  mounted() {
    this.technology.token = getUpToken();
  },
  methods: {
    //图片删除移除
    Technologydel(file, fileList) {},
    TechnologySwiper(val) {
      if (this.TechnologyList.length <= 20) {
        this.processPicture.dialogImageUrl = this.TechnologyimgShow + val.key;
        this.TechnologyList.push({
          fileUrl: this.processPicture.dialogImageUrl,
          sourceName: val.key
        });
      }
    },
    beforeAvatarUp(file) {
      //图片上传之前
      // console.log(file)
      this.technology.key = `${file.lastModified}.png`;
      // console.log(this.technology);
    },
    // 上传失败
    uploadError(err, file, fileList) {
      console.log(err, file, fileList);
    }
  }
};
</script>
<style lang="scss" scoped>
.solve {
  display: flex;
  justify-content: space-between;
}
</style>
