<template>
  <div class="temporaryorder">
     <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card>
        <div class="queryStyle">
          <el-input type="textarea" autosize placeholder="请输入内容" style="min-height:300px;" v-model="text"></el-input>
          <el-button type="primary" @click="queryFn" class="button-fc m-left10" size="medium">查询</el-button>
        </div>

        <div class="table_list lvs attribute m-top10">
          <el-table border :row-class-name="tableRowClassName" max-height="400" :data="datas" @selection-change="handleSelectionChange">
            <el-table-column v-for="(item,index) in headerList" :key="index" align="center" prop="receiptsType" :label="item" width="200">
              <template slot-scope="scope">
                <div>
                  {{scope.row[item]}}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import { 
executeQuerySQL
} from 'api/order/contract/contract';
export default {
  components:{
    breadcrumb
  },
  data(){
    return{
      navList:[],
      text:'',
      datas:[],
      headerList:[]
    }
  },
  mounted() {
    this.navList = this.$route.meta;
  },
  methods: {
    //查询
    queryFn(){
      executeQuerySQL({sqlStr:this.text}).then(res=>{
        if(res.status== 200){
          this.headerList = res.data.column;
          this.datas = res.data.valueList;
        }else{
          this.$message.error(res.message)
        }
      }).catch(error=>{
        console.error('特殊接口',error);
      })
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 采购单勾选
    handleSelectionChange(val) {
      this.choseArr = val;
    }
  }
}
</script>
<style lang="scss" scoped>
.queryStyle{
  display: flex;
  align-items: center;
  button{
    width: 100px;
  }
}
</style>
<style lang="scss">
.temporaryorder{
  .el-textarea__inner{
    min-height: 300px !important;
  }
}
</style>