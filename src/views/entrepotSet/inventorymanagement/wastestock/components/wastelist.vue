<template>
  <div class="stockuplist">
    <!-- 查询 -->
    <div class="btn-list">
      <div v-for="(item,index) in btnList" :key="index">
        <el-button size="small" class="button-96" @click="butGroupAction(item.type)">{{item.name}}</el-button>
      </div>
    </div>
    <div>
      <wasteform></wasteform>
    </div>
    <div>
      <el-dialog :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
        <div class="titlecals">处理</div>
        <div>
          <outboundbox></outboundbox>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import wasteform from "./wasteform";
import outboundbox from "./outboundbox";
export default {
  components: {
    wasteform,
    outboundbox
  },
  data() {
    return {
      btnList: [
        {
          name: "导出",
          type: 0
        },
        {
          name: "处理",
          type: 1
        }
      ],
      dialogVisible: false
    };
  },
  methods: {
    //点击按钮组
    butGroupAction(type) {
      if (type == 0) {
      } else {
        this.dialogVisible = true;
      }
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.stockuplist {
  .btn-list {
    position: relative;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    > div {
      margin: 5px;
    }
  }
}
</style>
