<template>
<!-- 导出数据弹出框 -->
  <div class="subnext_dia">
        <el-dialog
        title=""
        :visible.sync="visible"
        width="50%"
        :before-close="handleClose">
        <div class="titlecals">提交</div>
        <div class="sub_title">
          当前流程节点为第二步【主管审核】张三（办理中）
        </div>
        <div class="sub_info">
          提交到下一流程节点:
        </div>
        <div class="sub_body">
          <div class="body_left">
            <el-radio v-model="radio" label="1" class="pd_top">店长审核</el-radio>
            <el-radio v-model="radio" label="2" class="pd_top">下单部审核</el-radio>
            <el-radio v-model="radio" label="3" class="pd_top">结束</el-radio>
          </div>
          <div class="body_right">
            <el-button type="primary" @click="handleClose">选择审批人</el-button>
            审核人：李四

          </div>
        </div>
        
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
        radio:"",
    };
  },
  
  methods: {

      filepath(){
        this.$message.error("选择文件保存位置，功能待确定")
      },
      //关闭回调函数
      handleClose(){
        this.$emit("close_subnext")
      },
        
        


      //确认按钮
      selectok(){
        this.$emit("subnext_ok")
      },

      
  }
};
</script>
<style scoped lang='scss'>

.subnext_dia{
  .sub_title{
    border: 1px solid #E4E4E4;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .sub_info{
    height: 50px;
    line-height: 50px;
    font-size: 20px;
  }
  .sub_body{
    display: flex;
    flex-wrap: nowrap;
    .body_left{
      .pd_top{
        padding-top:15px;
      }
      padding-left: 5%;
      width: 40%;
      display: flex;
      flex-direction:column;


    }
    .body_right{
      display: flex;
      justify-items: center;
      align-items: center;
      width: 60%;
    }

  }

}


</style>

