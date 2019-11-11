<template>
    <div>
        <div class="titlecals">关联部门</div>
        <div>
            <div class="search_ipt" style="width:120px;display:inline-block">
              <el-input></el-input>
            </div>
            <el-button  type="primary">搜索</el-button>
            <el-button type="success">新增</el-button>
            <el-button >删除</el-button>
          </div>
          <div  class="m-top20 lvs">
            <el-table
            border
            style="width:100%"
            @selection-change="chooseChange"
            :row-class-name="tableRowClassName"
            :data="tableData">
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column  prop="num" align="center" label="序号"></el-table-column>
              <el-table-column  prop="name" align="center" label="名称"></el-table-column>
              <el-table-column  prop="status" align="center" label="状态" :filters="status" :filter-method="filterHandler">
                <template slot-scope="scope">
                    {{scope.row.status==0?"非关联":"关联"}}
                </template>
              </el-table-column>
            </el-table>
          </div>
    </div>
</template>
<script>
import { getNames, getTypes } from 'src/utils/pubilcFn.js';
export default {
    data(){
        return {
            status:0,
            tableData:[
                {
                    num:1,
                    name:'测试',
                    status:'0'
                },
                {
                    num:2,
                    name:'测试',
                    status:'1'
                }
            ],
        }
    },
    created() {
         this.status=getTypes("status",this.tableData,"关联","非关联")
    },
    methods:{
        chooseChange(row){

        },
        filterHandler(value, row, column) { //筛选方法调用
            const property = column['property'];
            return row[property] === value;                
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    }
}
</script>
<style scoped>
    
</style>