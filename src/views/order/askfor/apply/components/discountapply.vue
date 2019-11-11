<template>
  <!-- index -->
  <div class="disapply">
    <div class="iconBox m-bottom">
      <i class="Icon"></i>
      <span>审批权限</span>
    </div>
    <div class="dis_content">
      <span>特批折扣：</span>
      <el-input-number v-model="num" :min="0" :max="10" label="折扣值"></el-input-number>
      <span>折</span>
      <el-checkbox v-model="checked" class="m-left20">是否提交总经理</el-checkbox>
    </div>


    <div class="table_list lvs attribute m-top20" v-if="!checked">

        <el-table
          border
          :row-class-name="tableRowClassName"
          :row-style="tableBodycolor"
          :data="tabList"
          style="width: 100%;">
          <el-table-column
            prop="name1"
            label="审批职位"
            sortable align="center">
          </el-table-column>

          <el-table-column
            prop="name2"
            label="可审批折扣"
            sortable align="center">
          </el-table-column> 

          <el-table-column
            prop="name3"
            label="剩余次数"
            sortable align="center">
          </el-table-column>

          
        </el-table>    

    </div>

    <div class="app_text">
      <span>申请原因：</span>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </div>

    <div class="app_text">
      <span>
        上传附件：
      </span>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="3"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <div class="btn_btn">
      <el-button type="primary" size="medium" class="reset_btn m-left20" >申 请</el-button>
      <el-button type="info" size="medium" class="reset_btn m-left20" >取 消</el-button>
    </div>





  </div>
</template>
<script>

import pagination from '../../../../components/pagination';
import breadcrumb from "../../../../components/breadcrumb";
export default {
    components: {
      breadcrumb,
      pagination,
      
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1,//当前页数
      pageSize: 20,//总页数
      total: 100,//总条数
      num:"",
      checked:false,
      tabList:[{
        name1:"销售经理",
        name2:"8折",
        name3:"20",
      },
      {
        name1:"销售经理",
        name2:"8折",
        name3:"20",
      },
      {
        name1:"销售经理",
        name2:"8折",
        name3:"20",
      }],
      textarea:"",
      fileList:[],
      
    };
  },
  
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {

    //翻页方法
    sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
    },

    //翻页方法
    currentChange(val) {
        this.currentPage = val;
    },

    
    
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
    
    
  }
};
</script>
<style scoped lang='scss'>
.disapply{
  .dis_content{
    display: flex;
    flex-wrap: nowrap;
    // justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  .app_text{
    margin-top: 10px;
    display: flex;
    flex-wrap: nowrap;
    span{
      min-width: 80px;
      margin-left: 10px;
    }
  }
  .btn_btn{
    width: 200px;
    margin: 10px auto;
  }


}



</style>

