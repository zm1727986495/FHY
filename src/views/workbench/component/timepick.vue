<template>
    <div class="tiempick">
        <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" @change="timechange" size="medium"></el-date-picker>
    </div>
</template>
<script>
export default {
    components: {
    },
    data() {
      return {
          value1:[],
      }
    },
    methods: {
      //时间选择器改变
      timechange(){
        this.$emit('close_time')
      },
    }
  }
</script>
<style scope lang='scss'>
</style>

