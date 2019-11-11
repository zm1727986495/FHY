<template>
<!-- 撤销申请弹出框   这个弹框应该是不用了  需求去掉了-->        
  <div class="revoke_dia">
        <el-dialog
        title=""
        :visible.sync="visible"
        width="35%"
        :before-close="handleClose">
        <div class="titlecals">选择审核类型</div>
            <div class="audit_radio">
                <el-radio v-model="radio" label="1">审核通过</el-radio>
                <el-radio v-model="radio" label="2">驳回</el-radio>
            </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="selectclo">取 消</el-button>
          <el-button type="primary" @click="selectok">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>


import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
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
        radio:""

    };
  },
  
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
      //关闭回调函数
      handleClose(){
        this.radio = ""; 
        this.$emit("close_aud")
      },
      //点击取消按钮
      selectclo(){
        this.radio = ""; 
        this.$emit("close_aud")
      },


      //确认按钮
      selectok(){
        this.$emit("send_aud",this.radio)
        this.radio = ""; 
      },


      
  }
};
</script>
<style scoped lang='scss'>
.audit_radio{
    width: 80%;
    margin: 0 auto;
}


</style>

