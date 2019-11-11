<template>
  <div class="picPreviewDia">
    <el-dialog
      title="图片预览"
      :visible.sync="visible"
      width="60%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <ul class="imglist">
        <li v-for="(item, idx) in picList" :key="idx">
          <img :src="item.fileUrl" alt />
          <div class="glarclas"></div>
          <ul class="iconclass">
            <li class="el-icon-zoom-in pointer" @click="enlargePic(item)"></li>
            <a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
          </ul>
        </li>
      </ul>

      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getBuffer } from "@/utils/pubilcFn";

export default {
  props: ["visible", "picList"],
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      urls: ""
    };
  },

  methods: {
    handleClose() {
      this.$emit("close_pic");
    },
    enlargePic(item) {
      this.dialogImageUrl = item.fileUrl;
      this.dialogVisible = true;
    },
    downPic(item) {
      getBuffer(item.sourceName).then(res => {
        this.urls = res;
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.picPreviewDia {
  .imglist {
    display: flex;
    flex-wrap: wrap;
    > li {
      width: 120px;
      height: 120px;
      margin: 10px;
      position: relative;
      img {
        width: 100%;
        border-radius: 8px;
        height: 100%;
      }
      .glarclas {
        z-index: 99999;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        transition: all 0.3s;
        border-radius: 8px;
      }
      &:hover {
        .glarclas {
          background: rgba(0, 0, 0, 0.5);
          transition: all 0.4s;
        }
        .iconclass {
          z-index: 999999;
          display: inline-block;
          display: flex;
          justify-content: space-around;
          align-items: center;
          transition: all 0.4s;
        }
      }
      .iconclass {
        padding: 0px 15px;
        position: absolute;
        display: flex;
        justify-content: space-around;
        align-items: center;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        color: #ffffff;
        font-size: 25px;
        display: none;
        transition: all 0.3s;
      }
    }
  }
}
</style>

