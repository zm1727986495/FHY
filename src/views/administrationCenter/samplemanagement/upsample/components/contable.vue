
<template>
    <div class="applypage">
        <el-table
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            border :cell-style="cellStyle" :header-cell-style = "cellStyle">

                <el-table-column 
                    type="selection" 
                    width="35">
                </el-table-column>

                <el-table-column
                    label="库存数"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="产品款型"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="名称款式"
                    prop="phone" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="型号"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="数量"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="单价"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>
                
                <el-table-column
                    label="非标系数"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="计价方式"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>
                
                <el-table-column
                    label="小计/元"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="材质"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="工艺"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="备注"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="产品分类"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="产品品牌"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>

                <el-table-column
                    label="产品编号"
                    prop="name" sortable  align="center" width="180">
                </el-table-column>
                
        </el-table>
					
			
    </div>
  
</template>
<script>

import pagination from "@/views/components/pagination";



import spot from '@/assets/images/spot.png';
export default {
    components: {
      pagination,

  },
  // name: 'brandmanagement',
  data() {
    return {
	  navList: [],//头部面包屑
	  // begin
        tableData: [],
		
	  // end
      
      
    };
  },
  
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    submitForm(formName) {
      
    },
     // 表格列的样式
    cellStyle({row, column, rowIndex, columnIndex}){
        // console.log(column,columnIndex)
        if(columnIndex === 1){ // 指定坐标-- 第一列
            return 'borderRight:none'
        }else{
            return ''
        }
    },

    // table 颜色切换
    tableRowClassName({row, rowIndex}) {//表格斑马线设置
        return rowIndex % 2 != 0 ? 'el-f0' : '';
    },

    // 多选改变
    handleSelectionChange(val) {
        this.multipleSelection = val;
        this.$emit('selection-change', this.multipleSelection);
    },

    
  }
};
</script>
<style scoped lang='scss'>

  .bottom_btnlist{
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid red;
  }
  .ordertitle{
    margin: 10px 0;
  }

	

</style>

