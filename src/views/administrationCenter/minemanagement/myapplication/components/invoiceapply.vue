<template>
  <!-- 开票申请 -->
	<div class="invoiceapply">
		<div class="allMoney">
			<div>
				<span>可开票金额:</span>
				<span style="color:red">312,348元</span>
			</div>

			<div>
				<span>合同金额:</span>
				<span style="color:red">312,348元</span>
			</div>

			<div>
				<span>收款金额:</span>
				<span style="color:red">312,348元</span>
			</div>

			<div>
				<span>代金券金额:</span>
				<span style="color:red">312,348元</span>
			</div>
		</div>

		<div class="app_text">
			<span>申请开票原因：</span>
			<el-input
				type="textarea"
				:rows="2"
				placeholder="请输入内容"
				v-model="textarea">
			</el-input>
		</div>

		<div  class="invoicecontent">
			<div class="iconBox m-bottom">
                <i class="Icon"></i>
                <span>开票内容</span>
            </div>
			<div class="invoiceinput">
				<div class="card">
					<ul>
						<li>
							<span>发票类型:</span>
							<el-radio-group v-model="invoice.type">
								<el-radio :label="0">普通电子发票</el-radio>
								<el-radio :label="1">增值税专用发票</el-radio>
							</el-radio-group>
						</li>
						<li>
							<span>发票抬头:</span>
							<el-radio-group v-model="invoice.header">
								<el-radio :label="0">个人</el-radio>
								<el-radio :label="1">单位</el-radio>
							</el-radio-group>
						</li>
						<li>
							<span>开票日期:</span>
							<el-date-picker
								v-model="invoice.date"
								type="date"
								value-format="yyyy-MM-dd"
								placeholder="年/月/日">
							</el-date-picker>
						</li>
						<li>
							<span>开票金额:</span>
							<el-input v-model="invoice.money" size="medium" disabled placeholder="" style="width:38%;"></el-input>
						</li>
					</ul>
				</div>

				<div class="card invoiceright">
					<ul>
						<li>
							<span>发票抬头:</span>
							<el-input v-model="invoice.headernum" size="medium" disabled placeholder=""></el-input>
						</li>
						<li>
							<span>税号:</span>
							<el-input v-model="invoice.duty" size="medium" disabled placeholder=""></el-input>
						</li>
						<li>
							<span>开户行:</span>
							<el-input v-model="invoice.bank" size="medium" disabled placeholder=""></el-input>
						</li>
						<li>
							<span>账号:</span>
							<el-input v-model="invoice.account" size="medium" disabled placeholder=""></el-input>
						</li>
						<li>
							<span>电话:</span>
							<el-input v-model="invoice.phone" size="medium" disabled placeholder=""></el-input>
						</li>
					</ul>
				</div>
			</div>
			<div class="cardbottom">
				<div>
					<span>发送方式:</span>
					<el-radio-group v-model="invoice.send">
						<el-radio :label="0">短信</el-radio>
						<el-radio :label="1">邮件</el-radio>
					</el-radio-group>
					<el-input v-model="invoice.address" size="medium" disabled placeholder="邮件地址" class="addressinput" v-show="invoice.send == 1"></el-input>
				</div>
				<div>
					<span>接收方式:</span>
					<el-radio-group v-model="invoice.accept">
						<el-radio :label="0">自取</el-radio>
						<el-radio :label="1">邮寄</el-radio>
					</el-radio-group>
				</div>
				<div>
					<span>其他说明:</span>
					<el-input
						type="textarea"
						:rows="2"
						placeholder="请输入内容"
						v-model="invoice.desc">
					</el-input>
				</div>
			</div>
			<div class="app_text">
				<span>上传附件：</span>
				<el-upload
					class="avatar-uploader"
					:data="uptoken"
					list-type="picture-card"
					:action="action"
					:accept="accept"
					:on-remove="handleRemove"
					:on-error="handError"
					:file-list="fileList"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload">
					<i class="el-icon-plus"></i>
				</el-upload>
			</div>
			<!-- 审批意见组件 -->
    		<auditopinion v-if="isAudit"></auditopinion>

			<div class="btn_btn">
				<el-button type="primary" size="medium" class="reset_btn m-left20" >申 请</el-button>
				<el-button  size="medium" class="reset_btn m-left20" >取 消</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import auditopinion from "../../components/auditopinion";

import { getUpToken } from "@/utils/auth";

export default {
  components: {
    breadcrumb,
	pagination,
    auditopinion,
	
  },
  // name: 'brandmanagement',
  data() {
    return {
		textarea: '',
		invoice: {	
			type: '',
			header: '',
			date: '',
			money: '',
			headernum: '', // 发票抬头--num
			duty: '', // 税号
			bank: '', // 开户行
			account: '',
			phone: '',
			send: '', // 发动方式
			address: '', // 邮件地址
			accept: '', // 接收方式
			desc: '', // 其他说明
		},
		// 上传
		fileList:[], 
		imgShow: "http://file.xczhihui.com/", //文件上传域名
		action: "http://up-z2.qiniup.com",
		accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
		uptoken: {
			//上传参数
			token: "",
			key: ""
		},
		isAudit: false,
    };
  },

  mounted() {
	  this.uptoken.token = getUpToken();
  },
  created() {
      if(this.$route.path == "/minemanagement/audit") {
          this.isAudit = true;
      }
  },
  methods: {
		//文件上传前操作
		beforeAvatarUpload(file) {
			//console.log(this.imgShow+file.lastModified+".jpg");
			this.uptoken.key = `${file.lastModified}.jpg`;
		},
		//文件成功操作  //addAccessory编辑的新增接口
		handleAvatarSuccess(res, file, fileList) {
			if (this.referrerId) {
			let data = {
				dataSourceEnum: "IdCopiesImg",
				dataSourceId: this.referrerId,
				fileUrl: this.imgShow + res.key
			};
			addAccessory(data).then(res => {
				console.log(res);
				if (res.status == "200") {
				this.$message.success("图片上传成功");
				} else {
				this.$message.error("图片上传失败");
				}
			});
			} else {
			this.fileList = fileList;
			}
		},
			//文件上传失败
		handError(err) {
			this.$message.error("文件上传失败，可尝试退出登录重新操作");
		},
		//文件删除操作
		handleRemove(file, fileList) {
			if (this.referrerId) {
			let data = {
				accessoryId: file.accessoryId,
				dataSourceId: file.dataSourceId,
				dataSourceEnum: file.dataSourceEnum
			};
			removeAccessoryImg(data).then(res => {
				if (res.status == "200") {
				this.$message.success("删除图片成功");
				} else {
				this.$message.error("删除图片失败");
				}
			});
			} else {
			this.fileList = fileList;
			}
		},

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
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.invoiceapply {
	.allMoney{
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-around;
		>div {
			font-size: 14px;
			display: flex;
			flex-wrap: nowrap;
			>span{
				white-space: nowrap;
				&:nth-of-type(odd){
					display: inline-block;
					min-width: 80px;
					text-align: right;
					padding-right: 12px;
				}
			}
		}
	}
	.app_text {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		padding: 12px;
		>span:nth-of-type(odd){
			display: inline-block;
			min-width: 80px;
			text-align: right;
			padding-right: 12px;
			white-space: nowrap;
		}
	}
	.invoicecontent {
		.invoiceinput {
			display: flex;
			flex-wrap: nowrap;
			justify-content: center;
			div.card {
				width: 50%;
				min-width: 340px;
				box-sizing: border-box;
				padding:12px 12px 0px;
				ul {
					height: 100%;
					display: flex;
					align-content: stretch;
					flex-wrap: wrap;
					li{
						width: 100%;
						display: flex;
						flex-wrap: nowrap;
						align-items: center;
						>span{
							min-width: 80px;
							white-space: nowrap;
							text-align: right;
							padding-right: 12px;
						}
						>div{
							display: flex;
							flex-wrap: nowrap;
							align-items: center;
						}
					}
				}
				&:nth-of-type(even) {
					border-left: 1px solid #999;
				}
			}
			div.card.invoiceright{
				ul {
					li{
						box-sizing: border-box;
						padding-bottom: 12px;
						>div {
							width: 42%;
						}
					}
				}
			}
		}
		.cardbottom{
			>div{
				display: flex;
				flex-wrap: nowrap;
				align-items: center;
				padding: 12px 12px 0px;
				>span {
					min-width: 80px;
					text-align: right;
					padding-right: 12px;
					white-space: nowrap;
				}
				
				>div {
					display: flex;
					flex-wrap: nowrap;
					&.addressinput {
						width: 36%;
						padding-left:12px;
					}
				}
			}
			
		}
	}
}
.btn_btn{
	width: 200px;
	margin: 10px auto;
}
</style>

