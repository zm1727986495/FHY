<template>
  <div class="applypage">
		<!-- 导航栏 -->
		<div class="head_nav">
			<breadcrumb :navList="navList"></breadcrumb>
		</div>

		<el-tabs @tab-click="tabclickH" type="border-card">
			<el-tab-pane label="基础信息" name="0">
				<div class="ordertitle">
					<!-- 订单详情 -->
					<orderdetail :isInstall="true"></orderdetail>
					<!-- <details></details> -->
				</div>
			</el-tab-pane>

      <el-tab-pane label="回访跟进记录" name="1">
				<!-- 回访内容 --> 
				<reviewcontent></reviewcontent>
				<followRecord ref="followRecord"></followRecord>	
		  </el-tab-pane>
    </el-tabs>
			<!-- 处理问题详情 -->
    <el-dialog title="处理问题详情" custom-class="customDialogTitle" :visible.sync="dialogFormVisible" width="30%" >
			<div class="head_list">
				<el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="" class="radioLine">
						<el-radio-group v-model="ruleForm.status">
							<el-radio :label="1">回访已完成</el-radio>
							<el-radio :label="3">回访未完成</el-radio>
							<el-radio :label="2">驳回</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer backButton">
				<el-button type="primary" @click="submission('ruleForm')" :loading="btnLoading">提交</el-button>
				<el-button  @click="colseBtn('ruleForm')">取消</el-button>
			</div>
    </el-dialog>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import orderdetail from "@/views/order/components/orderdetail";
import details from "@/views/order/order/details/details";
import reviewcontent from "./components/reviewcontent";
import followRecord from "./components/followRecord";

import {
  customerServiceDatails, // 沟通记录回显
  editCustomerService, // 处理问题
} from 'api/administrationCenter/administrativeservice/index';

export default {
  components: {
		breadcrumb,
		pagination,
		orderdetail,
		reviewcontent,
		followRecord,
		details
  },
  // name: 'brandmanagement',
  data() {
    return {
	  navList: [],//头部面包屑
		remake: '',
		btnLoading: false, // 按钮的loading Flag
	  ruleForm: {
		status: '',
		},
		dialogFormVisible: false,
    };
  },
  created() {
	  // 沟通记录回显
	  this.customerServiceDatails();
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    submitForm(formName) {
		
		this.dialogFormVisible = true;
	},
	colseBtn() {
		this.dialogFormVisible = false;
		this.$refs[formName].resetFields();
	},
	// 沟通记录回显
	customerServiceDatails() {
		let data = {
			customerServiceId: this.$route.query.customerServiceId,
		}
		customerServiceDatails(data).then(res => {
			if(res.status == 200) {
				this.remake = res.data.remake;
			}
		}).catch(error => {
			console.log('行政中心:客服回访 沟通记录回显 views/administrationCenter/administrativeservice/custservice/reviewcontent', error);
		})
	},
	// 指派责任部门 -- 确定
	submission() {
		let data = {
			status: this.ruleForm.status,
			remake: this.remake,
			customerServiceId: this.$route.query.customerServiceId,
		};
		this.btnLoading = true;
		editCustomerService(data).then(res => {
			if(res.status == 200) {
				this.$message({
					message: '处理问题成功',
					type: 'success'
				});
				this.btnLoading = false;
				this.dialogFormVisible = false;
				this.$refs[formName].resetFields();
				this.$router.push("/administrativeservice/servicereturn");
			}
		}).then(err => {
			this.btnLoading = false;
			console.log('行政中心:客服回访 指派责任部门 views/administrationCenter/administrativeservice/custservice/reviewcontent', error);	
		})
	},

    // tab页选择
	tabclickH(e) {
	// 	let data = this.searchdatas();

	// 	if (e.name == 0){ // 基础信息
	// 		// let data = 

	// 		// this.status = 0;
	// 		// this.getList(data);
	// 	} else if (e.name == 1) { // 售后跟进记录

	// 		// this.status = 1;
	// 		// this.getList(data);
	// 	} else if (e.name == 2) { // 相关附件

	// 		// this.status = 2;
	// 		// this.getList(data);
	// 	}

		if(e.name == 1) {
			let data = this.$refs.followRecord.searchdatas();
        	this.$refs.followRecord.getList(data);

			
		}

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
	// .radioLine{
	// 	// >div{
	// 	// 	>div{
	// 	// 		display: flex;
	// 	// 		flex-wrap: wrap;
	// 	// 		justify-content: center;
	// 	// 		align-items: center;
	// 	// 		>label {
	// 	// 			width: 50%;
	// 	// 			padding:20px 0px;
	// 	// 		}
	// 	// 	}
	// 	// }
	// }
	// .search_item {

	// }

</style>

