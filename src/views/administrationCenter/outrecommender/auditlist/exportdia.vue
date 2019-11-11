<template>
<!-- 导出数据弹出框 -->
  <div class="export_dia">
        <el-dialog
        title=""
        :visible.sync="visible"
        width="50%"
        :before-close="handleClose">
        <div class="titlecals">导出数据</div>
        <el-card class="card_dia">
          <el-button type="primary" @click="filepath">选择导出位置</el-button>

        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="selectok">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>

import pagination from '../../../components/pagination';
import breadcrumb from "../../../components/breadcrumb";
import {
  getNames,
} from 'src/utils/pubilcFn.js';
export default {
  props:["visible"],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
        tabList:[],
        elsectVal:[],

    };
  },
  
  methods: {

      filepath(){
        this.$message.error("选择文件保存位置，功能待确定")
      },
      //关闭回调函数
      handleClose(){
        this.$emit("close_export")
      },
        


      //确认按钮
      selectok(){
        this.$emit("export_ok")
      },

      
  }
};
</script>
<style scoped lang='scss'>

.export_dia{
  .card_dia{
    width: 90%;
    margin: 0 auto;
  }

}


</style>

