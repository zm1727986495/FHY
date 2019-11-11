<template>
  <div class="fastenterdia">
        <el-dialog title="编辑快捷入口" :visible.sync="visible" :before-close="handleClose" custom-class="customDialogTitle">
          
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleClose">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>


import pagination from "@/views/components/pagination";
export default {
  props:["visible"],
  components: {
    pagination
  },
  data() {
    return {
    };
  },
  methods: {

    handleClose(){
      this.$emit("close_fast")
    },


      
  }
};
</script>
<style scoped lang='scss'>
.fastenterdia{
}


</style>

