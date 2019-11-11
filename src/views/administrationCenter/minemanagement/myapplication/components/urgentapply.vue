<template>
  <div class="urgentapply">

    <div class="app_text urgent_app">
        <div>
            <span class="header_span">加急天数：</span>
            <el-input-number v-model="num"  :min="0" ></el-input-number>
            <span>天</span>
        </div>

        <div>
            <span class="header_span">标准工期：</span>
            <span>45天</span>
        </div>
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
    <!-- 商品清单table -->
    <goodslist></goodslist>

    <div class="app_text">
        <span>上传附件：</span>
        <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </div>

    <!-- 审批意见组件 -->
    <auditopinion v-if="isAudit"></auditopinion>

    <div class="btn_btn">
        <el-button type="primary" size="medium" class="reset_btn m-left20" >申 请</el-button>
        <el-button type="info" size="medium" class="reset_btn m-left20" >取 消</el-button>
    </div>

  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import goodslist from "./goodslist";
import auditopinion from "../../components/auditopinion";

export default {
    components: {
      breadcrumb,
      pagination,
      goodslist,
      auditopinion
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1,//当前页数
      pageSize: 20,//总页数
        total: 100,//总条数
        num:"",
        textarea:"",
			isAudit: false,
			
      
    };
  },
  created() {
      if(this.$route.path == "/minemanagement/audit") {
          this.isAudit = true;
      }
  },
  mounted() {

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
.urgentapply{
	
	.app_text{
        padding: 12px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        span{
            min-width: 100px;
            padding-left: 12px;
            text-align: right;
            white-space: nowrap;
            font-size: 14px;
        }
	}
    .urgent_app {
        display: flex;
        flex-wrap: nowrap;
        >div:nth-of-type(even) {
            padding-left:20px;
        }
    }
	.btn_btn{
        width: 200px;
        margin: 10px auto;
    }
  


}



</style>

