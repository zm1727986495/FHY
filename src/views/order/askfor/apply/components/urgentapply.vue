<template>
  <div class="urgentapply">

		<div class="header_60 m-left10">
			<div>
				<span class="header_span">申请类型：</span>
				<span>加急单</span>
			</div>

			<div>
				<span class="header_span">门店级别：</span>
				<span>一级店</span>
			</div>

			<div>
				<span class="header_span">剩余次数：</span>
				<span>20次</span>
			</div>
		</div>

		<div class="header_60 m-left10">
			<div>
				<span class="header_span">加急天数：</span>
				<el-input-number v-model="num" controls-position="right" :min="0"></el-input-number>
				<span>天</span>
			</div>

			<div>
				<span class="header_span">标准工期：</span>
				<span>45天</span>
			</div>

			<div class="header_file">
				<span class="header_span">上传附件：</span>
				<el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="3">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
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

		<div class="app_text">
      <span>
        上传附件：
      </span>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="3"
        >
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
			textarea:"",
			
			
      
    };
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
	.header_60{
		>div{
			width: 32%;
			margin: 10px 0px;
		}
		width: 60%;
		font-size: 15px;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		.header_span{
			font-weight: bold;
		}
		.header_file{
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
		}
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

