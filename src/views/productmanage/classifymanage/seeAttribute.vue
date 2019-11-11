<template>
  <div>
    <div class="content_box">
        <el-table
           :row-class-name="tableRowClassName"
            :data="getAtter"
            style="width: 100%;"
            border 
            >  
            <el-table-column prop="commodity_attribute_id" label="序号" width="50"></el-table-column>
            <el-table-column prop="attribute_name" label="属性名称"></el-table-column>
            <el-table-column prop="attribute_unit" label="商品属性"></el-table-column>
            <el-table-column prop="mode" label="录入方式">
              <template slot-scope="scope">
                  <div >
                      {{scope.row.mode == 0 ? '手工输入' : '列表选择'}}
                  </div>
              </template>
            </el-table-column> 
        </el-table>
    </div>
  </div>
</template>
<script>
//新增商品组件
import {
  getNames,
  getTypes
} from 'src/utils/pubilcFn.js';
  export default {
    props:['getAtter'],
  // props:{
  //     getAtter: {
  //       type: Array,
  //         default: function () {
  //           return []
  //         }
  //     }
  // },
  data() {
    return {
        tables: this.getAtter
    };
  },
  created(){
    console.log(this.getAtter,221212)
  },
  methods: {
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
        // return "height: 80px"
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
  },
 
};
</script>
<style scoped>
.content_box{
  padding: 0 20px
}
</style>