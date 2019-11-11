<template>
  <div class="tabshow">
      <div class="tabHead">
        <el-button size="small" class="button-96" v-popover:popover >设置 </el-button>
        <el-popover ref="popover" placement="bottom" width="300">
          <el-col :span="12" v-for="(item, index) in this.dataItem" :key="index">
            <el-checkbox @change="showHIde(index)">
                    {{item.name}}
            </el-checkbox>
          </el-col>
        </el-popover>
      </div>
  </div>
</template>

<script>

  export default {
    name: "tabshow",
    props:{
      dataItem: {
        type: Array,
          default: function () {
            return []
          }
      }
    },
    data() {
      return {
        index:0,
      }
    },
    methods:{
        showHIde(index){
          this.index = index;
          console.log(index,2)
            this.$emit('childByValue', this.index);
        }
    },
  };
</script>

<style scoped  lang="scss">

</style>

