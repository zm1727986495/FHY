<template>
  <!-- 返点申请 -->
	<div class="rebatesapply">

		<div  class="rebatescontent">
			<div class="rebatesinput">
				<ul>
					<li>
						<span>外部推荐人:</span>
						<el-select v-model="rebates.recommend" multiple placeholder="" size="medium">
							<el-option
								v-for="item in recommendList" :key="item.value"
								:label="item.dictName" :value="item.id">
							</el-option>
						</el-select>
					</li>
					
					<li>
						<span>电话:</span>
						<el-input v-model="rebates.phone" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					
					<li>
						<span>职位:</span>
						<el-input v-model="rebates.position" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
											
					<li>
						<span>所属公司:</span>
						<el-input v-model="rebates.company" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					
					<li>
						<span>级别:</span>
						<el-input v-model="rebates.level" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					
					<li>
						<span>银行卡号:</span>
						<el-input v-model="rebates.num" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					
					<li>
						<span>外购商品金额:</span>
						<el-input v-model="rebates.money" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					
					<li>
						<span>外购提成:</span>
						<el-input v-model="rebates.commission" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					
					<li>
						<span>品牌金额:</span>
						<el-input v-model="rebates.returnnum" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					
					<li>
						<span>品牌提成:</span>
						<el-input v-model="rebates.brandroyalty" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					
					<li>
						<span>返点金额:</span>
						<el-input v-model="rebates.rebatesamount" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>

					<li>
						<span>推介单数:</span>
						<el-input v-model="rebates.promote" size="medium" disabled placeholder="" style="width:38%;"></el-input>
					</li>
					<li class="inputremark">
						<span>备注:</span>
						<el-input
							type="textarea"
							:rows="2"
							placeholder="请输入内容"
							v-model="rebates.desc">
						</el-input>
					</li>
				</ul>
			</div>
			<div class="app_text">
				<div>
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
		rebates: {	
			recommend: '',
			phone: '',
			position: '', // 职位
			company: '', // 所属公司
			level: '', // 级别
			num: '',
			money: '',
			commission: '', // 外购提成
			returnnum: '',
			brandroyalty: '',
			rebatesamount: '', // 返点金额
			promote: '', // 推介单数
			desc: '',
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
		recommendList: [],
		isAudit: false,
    };
  },
	created() {
      if(this.$route.path == "/minemanagement/audit") {
          this.isAudit = true;
      }
  },
  mounted() {
	  this.uptoken.token = getUpToken();
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
.rebatesapply {
	
	.app_text {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		padding: 12px;
		>div{	
			width: 80%;
			display: flex;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: center;
			>span{
				min-width: 120px;
				text-align: right;
				padding-right: 12px;
				white-space: nowrap;
			}
		}
	}
	.rebatescontent {
		.rebatesinput {
			ul {
				height: 100%;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: center;
				li{
					width: 40%;
					padding: 12px;
					display: flex;
					flex-wrap: nowrap;
					align-items: center;
					>span{
						min-width: 120px;
						white-space: nowrap;
						text-align: right;
						padding-right: 12px;
					}
					>div{
						width: 48%;
						display: flex;
						flex-wrap: nowrap;
						align-items: center;
					}
					&.inputremark{
						width: 80%;
						>div{
							width: 70%;
						}
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

