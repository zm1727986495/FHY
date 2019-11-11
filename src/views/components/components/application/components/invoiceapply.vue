<template>
  <!-- 开票申请 -->
	<div class="invoiceapply">
		<div class="allMoney">
			<div>
				<span>可开票金额:</span>
				<span style="color:red">{{invoice.invoiceLimit}}元</span>
			</div>

			<div>
				<span>合同金额:</span>
				<span style="color:red">{{invoice.contractMoney}}元</span>
			</div>

			<div>
				<span>收款金额:</span>
				<span style="color:red">{{invoice.receivableAmount}}元</span>
			</div>

			<div>
				<span>代金券金额:</span>
				<span style="color:red">{{invoice.voucherMoney}}元</span>
			</div>
		</div>

		<div class="app_text">
			<span>申请开票原因</span>
			<el-input
				type="textarea"
				:rows="2"  :readonly="readonly"
				placeholder="请输入内容"
				v-model="invoice.invoiceApplyCause">
			</el-input>
		</div>

		<div  class="invoicecontent">
			<div class="iconBox m-bottom">
                <i class="Icon"></i>
                <span>开票内容</span>
            </div>
			<div class="invoiceinput">
				<el-form :model="invoice" :rules="rules" ref="invoice" label-width="100px" class="demo-ruleForm">
					<el-form-item label="发票类型" prop="invoiceType">
						<el-radio-group v-model="invoice.invoiceType"  :disabled="readonly">
							<el-radio :label="1">普通电子发票</el-radio>
							<el-radio :label="2">增值税专用发票</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="发票种类" prop="invoiceKind">
						<el-radio-group v-model="invoice.invoiceKind"  :disabled="readonly">
							<el-radio :label="1">个人</el-radio>
							<el-radio :label="2">单位</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="开票日期" prop="invoiceDate">
						<el-date-picker
							:size="size"  :readonly="readonly"
							v-model="invoice.invoiceDate"
							type="date"
							value-format="yyyy-MM-dd"
							placeholder="年/月/日" >
						</el-date-picker>
					</el-form-item>

					<el-form-item label="开票金额" prop="invoiceMoney">
						<el-input-number :controls="false" v-model="invoice.invoiceMoney" :disabled="readonly" :precision="2" :min="0" :size="size"></el-input-number>
					</el-form-item>

					<el-form-item label="发票抬头" prop="invoiceRice" class="demo-end">
						<el-input v-model="invoice.invoiceRice" :size="size" :readonly="readonly" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="税号" prop="dutyParagraph"  class="demo-end">
						<el-input v-model="invoice.dutyParagraph" :size="size"  :readonly="readonly" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="开户行" prop="openingBank" class="demo-end">
						<el-input v-model="invoice.openingBank" :size="size"  :readonly="readonly" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="账号" prop="account" class="demo-end">
						<el-input v-model="invoice.account" :size="size"  :readonly="readonly" placeholder=""></el-input>
					</el-form-item>

					<el-form-item label="电话" prop="phone" class="demo-end">
						<el-input-number v-model="invoice.phone" :size="size" :controls="false" :disabled="readonly" step-strictly></el-input-number>
					</el-form-item>

					<el-form-item label="接收方式" prop="acceptWay" style="width:100%">
						<el-radio-group v-model="invoice.acceptWay"  :disabled="readonly">
							<el-radio :label="1">自取</el-radio>
							<el-radio :label="2">邮寄</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="" prop="address" style="width:100%" v-if="invoice.acceptWay == 2">
						<el-input v-model="invoice.address" :size="size"  :readonly="readonly" placeholder="请输入邮寄地址"></el-input>
					</el-form-item>

					<el-form-item label="其他说明" prop="otherState" style="width:100%">
						<el-input  :readonly="readonly"
							type="textarea"
							:rows="2"
							placeholder="请输入内容"
							v-model="invoice.otherState">
						</el-input>
					</el-form-item>
				</el-form>
			</div>

			<div  v-if="isAudit || isView">
				<div class="iconBox m-bottom" v-if="fileList && fileList.length != 0">
					<i class="Icon"></i>
					<span>附件管理</span>
				</div>
				<ul class="el-upload-list el-upload-list--text downlists" v-if="fileList && fileList.length != 0" >
					<li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
						<a class="el-upload-list__item-name">
							<i class="el-icon-document"></i> {{ item.name }}
						</a>
						<a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
					</li>
				</ul>
			</div>

			<div  v-else>
				<div class="iconBox m-bottom">
					<i class="Icon"></i>
					<span>附件管理</span>
				</div>
				<el-upload
					list-type="text"
					class="upload-demo"
					action="string"
					:http-request="uploadSectionFile"
					:file-list="fileList"
					:on-remove="handleRemove" 
					>
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</div>
			<!-- 审批意见组件 -->
    		<auditopinion v-if="isAudit" ref="auditcomponent" :orderId="orderId"></auditopinion>
			
			<div class="btn_center" v-if="isAudit">
				<el-button type="primary" :size="size" class="reset_btn m-left20" @click="auditFun('invoice')" :loading="btnLoading">确 定</el-button>
				<!-- <el-button type="primary" :size="size" class="reset_btn m-left20" @click="rebackFun" :loading="btnLoading">退 回</el-button> -->
				<el-button  :size="size" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
			</div>
						
			<div class="btn_center" v-else>
				<el-button type="primary" :size="size" @click="submitForm('invoice')" :loading="btnLoading" v-if="!isView">申 请</el-button>
				<el-button :size="size" @click="closeFun()">取 消</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import auditopinion from "../../components/auditopinion";

import { getUpToken } from "@/utils/auth";

import { put, getBuffer } from "@/utils/pubilcFn";
import { getUUID } from 'api/pulicJava';

import {
	addInvoiceApply, // 添加
	getCustomerContract, // 金额，选择订单后
	getOrderCollectMoney, // 金额回显2
	invoiceApplyDetails, // 申请详情 回显
	editOrderApplyStatus, // 审核
	editInvoiceApply, // 编辑
} from "api/marketing/invoicepermit/index";

import {
  removeAccessoryImg, //删除图片
  addAccessory, //新增图片
} from "@/api/order/recommender/recommender";
import { loadavg } from 'os';


export default {
  components: {
    breadcrumb,
    auditopinion,
	
  },
  // name: 'brandmanagement',
  data() {
    return {
		btnLoading: false, // 按钮的loading Flag

		isAudit: false,
		isEdit: false,
		isAdd: false,
		isView: false,

		size: 'medium',
		
		// orderApplyId: this.$route.query.orderApplyId,
		invoiceApplyId: '', // 开票申请id 
		urls: '',
		readonly: false,
		customerContractId: '', // 客户合同id

		// invoiceMoney: {
		// 	invoiceLimit: '', // 可开票金额
		// 	contractMoney: '', // 合同金额
		// 	receivableAmount: '', // 收款金额
		// 	voucherMoney: '', // 代金券金额
		// },

		invoice: {
			invoiceApplyNumber: '',// 开票号
			invoiceApplyCause: '',// 申请原因",
			invoiceLimit: '',// 可开票金额,
			receivableAmount: '',// 收款金额,
			voucherMoney: '',// 代金券金额,
			invoiceType: '',// 发票类型 1普通电子发票 2增值税专用发票,
			invoiceKind: '',// 开票种类1个人 2单位,
			invoiceMoney: '',// 开票金额,
			invoiceDate: '', // 开票日期
			invoiceRice: '',// 发票抬头
			dutyParagraph: '',// 税号
			openingBank: '',// 开户行
			account: '',// 账号
			phone: '',// 电话
			otherState: '',// 其他说明
			acceptWay: '',// 接受方式 1自取 2邮寄,
			address: '',// 地址
		},
		// 上传
		fileList: [],
		imgArr: [],
		delImgArr: [],

		rules: {
            invoiceType: [{ 
                required: true, message: "请选择发票类型", trigger: "change" 
			}],
			invoiceKind: [{ 
                required: true, message: "请选择开票种类", trigger: "change" 
            }],
            invoiceMoney: [{ 
                required: true, message: '请输入开票金额', trigger: 'blur' 
			},],
            invoiceDate: [{ 
                required: true, message: '请输入开票日期', trigger: 'change' 
			},],
			address: [{
				required: true, message: '请输入邮寄地址', trigger: 'blur' 
			}]
        }
    };
  },
  props: ["orderId"],
  created() {
      if(this.$route.path == "/invoicepermit/addapplication") {
			this.isAdd = true;
        }
    
        if(this.$route.path == "/invoicepermit/editapplication") { // 编辑
            this.isEdit = true;
            if(this.orderId) {
				this.getCustomerContract(); // 四个金额回显
				this.getOrderCollectMoney();// 四个金额回显2
			}
			this.invoiceApplyDetails(); // 编辑审核回显
        }

        if(this.$route.path == "/invoicepermit/auditmanagement") { // 审核
			this.isAudit = true;
			this.readonly  = true;
            if(this.orderId) {
				this.getCustomerContract(); // 四个金额回显
				this.getOrderCollectMoney();// 四个金额回显2
			}
			this.invoiceApplyDetails(); // 编辑审核回显
		}

		if(this.$route.path == "/invoicepermit/viewapplication") { // 详情
			this.isView = true;
			this.readonly  = true;
            if(this.orderId) {
				this.getCustomerContract(); // 四个金额回显
				this.getOrderCollectMoney();// 四个金额回显2
			}
			this.invoiceApplyDetails(); // 编辑审核回显
		}
		

  },
	watch: {
		orderId(val) {
			this.getCustomerContract();  // 四个金额回显
			this.getOrderCollectMoney();// 四个金额回显2
		},
		'invoice.acceptWay'(val) {
			if(val == 2) {
				
			}else if(val == 1) {
				this.invoice.address = '';
			}
		}
	},
  methods: {

		//  获取订单金额信息 -- 回显
        getCustomerContract() {
            let data = {
                orderId: this.orderId ? this.orderId : '',
            };

            getCustomerContract(data).then(res => {
                if(res.status == 200) {
					this.invoice.contractMoney =  res.data.contractMoney; // 合同金额
					this.customerContractId =  res.data.customerContractId; // 客户合同id
                }
            }).catch(err =>{
                console.log('申请:开票管理 总申请 获取订单金额信息 components/components/application/components/invoiceapply.vue', err);
            })
		},

		//  获取订单金额信息 -- 回显2
        getOrderCollectMoney() {
            let data = {
                orderId: this.orderId ? this.orderId : '',
            };
			
            getOrderCollectMoney(data).then(res => {
                if(res.status == 200) {
					this.invoice.invoiceLimit = res.data.collectMoney; // 可开票金额 = 收款金额
					this.invoice.receivableAmount = res.data.collectMoney; // 收款金额
					this.invoice.voucherMoney =  res.data.shopCashCouponAmount +  res.data.ownCashCouponAmount; // 代金券金额
                }
            }).catch(err =>{
                console.log('申请:开票管理 总申请 获取订单金额信息 components/components/application/components/invoiceapply.vue', err);
            })
		},
		
		// 编辑 / 审核回显
		invoiceApplyDetails() {
			let data = {
                orderApplyId: this.$route.query.orderApplyId 
			};
			
            invoiceApplyDetails({ orderApplyId: this.$route.query.orderApplyId }).then(res => {
                if(res.status == 200) {
					this.invoice = res.data;
					this.invoiceApplyId = res.data.invoiceApplyId; // 开票申请id 

					this.fileList = res.data.invoiceApplyAcc;
					if(this.fileList && this.fileList.length != 0) {

						this.fileList = this.fileList.map(item => {
							return {
								...item,
								name: item.sourceName,
								url: item.fileUrl
							}
						})
					}

                }
            }).catch(err =>{
                console.log('申请:开票管理 总申请 获取详情回显 components/components/application/components/invoiceapply.vue', err);
            })
		},

	  	// 提交按钮
		submitForm(formName) {
            if(!this.orderId) {
                this.$message.warning("请选择订单");
                return;
			}

			this.$refs[formName].validate(valid => {
				if (valid) {
					this.btnLoading = true;

					let invoiceApplyAcc = this.imgArr.map(file => {
						return {
							fileUrl: file.url,
							sourceName: file.name
						};
					});

					// 家装代收合同
					let data = {
						orderId:  this.orderId, //订单id,

						...this.invoice,
						invoiceLimit:  this.invoice.invoiceLimit, // 可开票金额,
						receivableAmount:   this.invoice.receivableAmount, // 收款金额,
						voucherMoney:   this.invoice.voucherMoney, // 代金券金额,

						invoiceApplyNumber: this.invoice.invoiceApplyNumber, //"开票号",
						customerContractId: this.customerContractId, //客户合同id,
						invoiceApplyCause:  this.invoice.invoiceApplyCause, //申请原因",
						invoiceType:   this.invoice.invoiceType, // 发票类型 1普通电子发票 2增值税专用发票,
						invoiceKind:   this.invoice.invoiceKind, // 开票种类1个人 2单位,
						invoiceMoney:   this.invoice.invoiceMoney, // 开票金额,
						invoiceRice:   this.invoice.invoiceRice, // 发票抬头
						dutyParagraph:   this.invoice.dutyParagraph, // 税号
						openingBank:   this.invoice.openingBank, // 开户行
						account:   this.invoice.account, // 账号
						phone:   this.invoice.phone, // 电话
						otherState:   this.invoice.otherState, // 其他说明
						acceptWay:   this.invoice.acceptWay, // 接收方式 1自取 2邮寄,
						address:   this.invoice.address, // 地址
						invoiceApplyAcc,
					}
					
						if(this.isEdit) {
							data.orderApplyId = this.$route.query.orderApplyId;
							data.invoiceApplyId = this.invoiceApplyId;

							editInvoiceApply(data).then(res => {
								if(res.status == 200) {
									if ( this.delImgArr.length > 0) {
										//有删除旧图片
										console.log("有删除旧图片",this.delImgArr);
										this.delImgArr.forEach(item => {
											removeAccessoryImg(item).then(res => {});
										});
									}

									// this.imgArr.forEach(item => { // 编辑的新增
									//     if (!item.accessoryId) {
									//         let data = {
									//             dataSourceId: this.projectDelayUrgentApplyId,
									//             sourceName: item.name,
									//             fileUrl: item.url,
									//             dataSourceEnum: "ProjectDelayUrgentApplyAcc"
									//         };
									//         addAccessory(data).then(res => {}).catch(error => {
									//             console.error("新增图片", error);
									//         });
									//     }
									// });

									this.$message.success("操作成功");
									this.btnLoading = false;
									this.$router.push("/invoicepermit/invoiceapply");
								}
							}).catch(err =>{
								this.btnLoading = false;
								console.log('申请:退款管理 总申请 marketing/components/application/components/urgentapply.vue', err);
							})
						}else if(this.isAdd){
							getUUID({serialNumber: 'AP'}).then(res => {
								if(res.status == 200) {
									data.applyCode = res.data;

									addInvoiceApply(data).then(res => {
										if(res.status == 200) {
											this.$message.success("操作成功");
											this.btnLoading = false;
											this.$router.push("/invoicepermit/invoiceapply");
										}
									}).catch(err =>{
										this.btnLoading = false;
										console.log('申请:开票申请管理 总申请 components/components/application/components/invoiceapply.vue', err);
									})
								}
							}).catch(err => {
								console.log('申请:开票申请管理 总申请 components/components/application/components/invoiceapply.vue', err);    
							})
						}



				} else {
					return false;
				}
			});
		},
		// 取消
        closeFun() {
			console.log(1);
			this.$router.go(-1);
			// if(this.isAudit) {
			// 	this.$router.push("/invoicepermit/invoiceaudit");
			// }else {
			// 	this.$router.push("/invoicepermit/invoiceapply");	
			// }
		},
		 // 审核
        auditFun() {
			if(this.$refs.auditcomponent.audit.operationStatus == 2 && !this.$refs.auditcomponent.audit.rejectionReasons) { // 如果是驳回
                this.$message.warning("请填写审批意见");
                return;
            }


            if(!this.$refs.auditcomponent.audit.operationStatus) {
                this.$message.warning("请选择审核状态");
                return;
            }

            let data = { 
                workFlowBusinessId: this.$route.query.workFlowBusinessId, //  业务工作流程ID    
                orderApplyId: this.$route.query.orderApplyId, //    业务流程ID  
                auditType:  this.$refs.auditcomponent.audit.operationStatus, //     操作状态 1 通过 2驳回
                auditCause: this.$refs.auditcomponent.audit.rejectionReasons, //    驳回原因
            }
            editOrderApplyStatus(data).then(res => {
                if(res.status == 200) {
                    this.$message.success("操作成功");
                    this.$router.push("/invoicepermit/invoiceaudit");
                }
            }).catch(err =>{
                console.log('申请:开票申请管理 总申请 components/components/application/components/invoiceapply.vue', err);
            })
                    
        },
        // 退回
        rebackFun() {
			this.btnLoading = true;

            let data = {
                workFlowBusinessId: this.$route.query.workFlowBusinessId, //  业务工作流程ID    
                orderApplyId: this.$route.query.orderApplyId, //    业务流程ID  
                auditType: 3, //     操作状态 1 通过 2 拒绝 3 退回上一步  
                auditCause: this.$refs.auditcomponent.audit.rejectionReasons, //    驳回原因
            }

            editOrderApplyStatus(data).then(res => {
                if(res.status == 200) {
					this.$message.success("操作成功");
					this.btnLoading = false;
                    this.$router.push("/invoicepermit/invoiceaudit");
                }
            }).catch(err =>{
				this.btnLoading = false;
                console.log('申请:开票申请管理 总申请 components/components/application/components/invoiceapply.vue', err);
            })
        },

		// 文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile(res) {
            put(res).then(data => {
                this.imgArr.push(data); 
            });
        },

        // 文件删除操作
        handleRemove(file, fileList) {
            console.log(file,"filer 555");
            
            if (file.accessoryId) {
                //console.log("旧图片删除");
                let delobj = {
                    accessoryId: file.accessoryId,
                    dataSourceId: file.dataSourceId,
                    dataSourceEnum: file.dataSourceEnum
                };
                this.delImgArr.push(delobj);
            } else {
                //console.log("新增图片删除");
                
                let lengs = String(file.raw.uid).length;
                this.imgArr = this.imgArr.filter(item => {
                let str = item.name.substring(0, lengs);
                    return str !== String(file.raw.uid);
                });
            }
        },
        enlargePic(item) {
            this.dialogImageUrl = item.fileUrl;
            this.dialogVisible = true;
        },
        downPic(item) {
            getBuffer(item.sourceName).then(res => {
                this.urls = res;
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
		},
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
        width: 80%;
        display: flex;
		flex-wrap: nowrap;
		margin-top: 20px;
		>span {
			font-size: 14px;
			color: #606266;
			line-height: 40px;
			font-weight: 700;
			text-align: right;
			min-width: 120px;
			box-sizing: border-box;
			padding-right: 12px;
			white-space: nowrap;
		}
  }
	.invoicecontent {
		.invoiceinput {
			width: 80%;
			display: flex;
			flex-wrap: wrap;
			.demo-ruleForm {
				display: flex;
				flex-wrap: wrap;
				.el-form-item {
					width: 40%;
				}
			}
			.demo-end{
				align-self: flex-end;
			}
		}
	}
}

</style>

<style lang="scss"> 
.invoiceapply{
	.demo-ruleForm {
		.el-input-number--medium {
			width: 100%;
		}
		.el-input-number .el-input__inner{
			text-align: left;
			width: 100%;
		}
		.el-date-editor.el-input{
			width: 100%;
		}
		&:nth-of-type(1) {
			.el-form-item{
				width: 80%;
			}
		}
	}
}
</style>

