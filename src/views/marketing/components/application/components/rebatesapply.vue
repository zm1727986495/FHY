<template>
  <!-- 返点申请 -->
	<div class="rebatesapply">

		<div  class="rebatescontent">
			<div class="rebatesinput">
				<el-form :model="rebates" :rules="rules" ref="ruleForm"  class="demo-ruleForm" label-width="140px">
					<el-form-item label="外部推荐人" prop="referrerId">
						<el-select v-model="rebates.referrerId" placeholder="外部推荐人" :size="size" @change="referrerChange">
							<el-option
								v-for="item in referrerNameList" :key="item.referrerId"
								:label="item.referrerName" :value="item.referrerId">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="电话" prop="phone">
						<el-input v-model="rebates.phone" :size="size"  placeholder="电话" :readonly="readomly"></el-input>
					</el-form-item>

					<el-form-item label="职位" prop="position">
						<el-input v-model="rebates.position" :size="size"  placeholder="职位" :readonly="readomly"></el-input>
					</el-form-item>

					<el-form-item label="所属公司" prop="companyName">
						<el-input v-model="rebates.companyName" :size="size"  placeholder="所属公司" :readonly="readomly"></el-input>
					</el-form-item>

					<!-- <el-form-item label="级别" prop="name">
						<el-input v-model="rebates.phone" :size="size"  placeholder="级别"></el-input>
					</el-form-item> -->
					<el-form-item label="银行卡号" prop="accountNumber">
						<el-input v-model="rebates.accountNumber" :size="size"  placeholder="银行卡号" :readonly="readomly"></el-input>
					</el-form-item>

					<el-form-item label="外购商品金额" prop="purchasedGoodsMoney">
                        <el-input-number placeholder="外购商品金额/元"  :controls="false" v-model="rebates.purchasedGoodsMoney" :precision="2" :min="0" size="medium"></el-input-number>
					</el-form-item>
					<el-form-item label="外购提成" prop="purchasedFee">
                        <el-input-number placeholder="外购提成/元"  :controls="false" v-model="rebates.purchasedFee" :precision="2" :min="0" size="medium"></el-input-number>
					</el-form-item>

					<el-form-item label="品牌金额" prop="brandMoney">
                        <el-input-number placeholder="品牌金额/元"  :controls="false" v-model="rebates.brandMoney" :precision="2" :min="0" size="medium"></el-input-number>
					</el-form-item>
					<el-form-item label="品牌提成" prop="brandFee">
                        <el-input-number placeholder="品牌提成/元"  :controls="false" v-model="rebates.brandFee" :precision="2" :min="0" size="medium"></el-input-number>
					</el-form-item>

					<el-form-item label="返点金额" prop="rebatesMoney">
                        <el-input-number placeholder="返点金额/元"  :controls="false" v-model="rebates.rebatesMoney" :precision="2" :min="0" size="medium"></el-input-number>
					</el-form-item>
					<el-form-item label="推介单数" prop="recommendNumber">
                        <el-input-number placeholder="推介单数"  :controls="false" v-model="rebates.recommendNumber" :precision="2" :min="0" size="medium"></el-input-number>
					</el-form-item>
					
					<el-form-item label="备注" prop="remake" label-width="140px" class="textItem">
						<el-input type="textarea" v-model="rebates.remake"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div class="app_text">
				<div class="titlecals martop">附件管理</div>
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
    		<auditopinion v-if="isAudit"  ref="auditcomponent"></auditopinion>

			<div class="btn_btn"  v-if="!isAudit">
				<el-button type="primary" size="medium" class="reset_btn m-left20"  @click="applyFun('ruleForm')">申 请</el-button>
				<el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
			</div>

			<div class="btn_btn" v-if="isAudit">
				<el-button type="primary" size="medium" class="reset_btn m-left20" @click="auditFun('refunds')">审 核</el-button>
				<el-button type="primary" size="medium" class="reset_btn m-left20" @click="rebackFun">退 回</el-button>
				<el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
			</div>
			
		</div>
	</div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import auditopinion from "../../components/auditopinion";
import { getUUID } from "api/pulicJava";
import { getUpToken } from "@/utils/auth";
import { put, getBuffer } from "@/utils/pubilcFn";
import {
	listReferrerByPage, // 推荐人
	addReferrerReturnsApplication, // 新增推荐人返点申请
	getReferrerInfo, // 外部推荐返点信息 -- 回显
	editReferrerReturnsApplication, // 修改返点申请
	referrerReturnsApplicationAudit, // 推荐人返点审核
} from 'api/marketing/rebatespermit/index';

export default {
  components: {
    breadcrumb,
	pagination,
	auditopinion,
  },
  props: ["orderId"],
  // name: 'brandmanagement',
  data() {
    return {
		size: "medium",
		listReferrer: '', // 推荐人
		readomly: true,
		rebates: {	
			referrerId: '',
			phone: '',
			position: '', // 职位
			companyName: '', // 所属公司
			level: '', // 级别
			accountNumber: '', // 银行卡号
			purchasedGoodsMoney: '', // 外购商品金额/元
			purchasedFee: '', // 外购提成
			brandMoney: '', // 品牌金额
			brandFee: '', // 品牌提成
			rebatesMoney: '', // 返点金额
			recommendNumber: '', // 推介单数
			remake: '', // 备注
		},
		 // 上传
        fileList: [],
        imgArr: [],
		delImgArr: [],
		
		// 条件
		referrerNameList: [], // 推荐人信息
		isEdit: false, // 编辑页
		isAdd: false, // 新增页
		isAudit: false, // 审核页
		rules: {
			referrerId: [
				{ required: true, message: '请选择推荐人', trigger: 'change' }
			],
			remake: [
				{ message: '请填写备注', trigger: 'blur' }
			],
			rebatesMoney: [
				{ required: true, message: '请填写返点金额', trigger: 'change' }
			],
			brandFee: [
				{ required: true, message: '请填写品牌提成', trigger: 'change' }
			],
			brandMoney: [
				{ required: true, message: '请填写品牌金额', trigger: 'change' }
			],
			purchasedFee: [
				{ required: true, message: '请填写外购提成', trigger: 'change' }
			],
			purchasedGoodsMoney: [
				{ required: true, message: '请填写外购商品金额', trigger: 'change' }
			],
		}
		
    };
  },
	watch: {
		orderId: function(val,attr) {
			if(this.isAudit || this.isEdit) {
				this.getReferrerInfo(); // 外部推荐返点信息 -- 回显
			}
		},
	},
	created() {
		if(this.$route.path == "/minemanagement/audit") { // 审核
			this.isAudit = true;
			this.getReferrerInfo(); // 页面回显
		}
		if(this.$route.path == "/rebatespermit/editapplication") { // 编辑页
			this.isEdit = true;
			this.getReferrerInfo(); // 页面回显
		}
		if(this.$route.path == "/rebatespermit/addapplication") { // 新增页
			this.isAdd = true;
		}
		
		// 推荐人信息
		this.listReferrerByPage();
	},
	methods: {
		// 推荐人信息发生变化
		referrerChange(val) {
			console.log(val,"vallllll");
			this.referrerNameList.forEach(item => {
				if(item.referrerId == val) {
					this.rebates.phone = item.phone; // 电话
					this.rebates.position = item.position; // 职位
					this.rebates.companyName = item.companyName; // 公司
					this.rebates.accountNumber = item.openingBank; // 银行卡号
				}
			})
		},
		// 推荐人信息
		listReferrerByPage() {
			listReferrerByPage().then(res => {
				if(res.status == 200) {
					this.referrerNameList = res.data.rows;
				}
			})
		},
		// 文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile(res) {
            put(res).then(data => {
                this.imgArr.push(data);
                console.log(this.imgArr,"this.imgArr 52366");
                
            });
        },

        // 文件删除操作
        handleRemove(file, fileList) {
            if (file.accessoryId) {
                //console.log("旧图片删除");
                let delobj = {
                    accessoryId: file.accessoryId,
                    dataSourceId: file.dataSourceId,
                    dataSourceEnum: file.dataSourceEnum
                };
                this.delImgArr.push(delobj);
                console.log(file,this.delImgArr,"file delImgArr");
            } else {
                //console.log("新增图片删除");
                console.log(file,"file 2223344");
                
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
		
		// 外部推荐返点信息 -- 回显
        getReferrerInfo() {
            let data = {
                orderId: this.orderId,
            };

            getReferrerInfo(data).then(res => {
                if(res.status == 200) {
                    this.rebates = res.data;
                    // this.orderMoney = res.data;
                    // this.refund.refundMode = res.data.refundMode;
                    // this.refunds.refundType = String(res.data.refundType);
                    // // this.orderId = res.data.orderId;
                    // this.fileList = res.data.pics;
                    // this.fileList = this.fileList.map(item => {
                    //     return {
                    //         ...item,
                    //         name: item.sourceName,
                    //         url: item.fileUrl
                    //     }
                    // })
                    // this.orderApplyRefundId = res.data.orderApplyRefundId;
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
            })
        },

		// 新增
        applyFun(formName) {
            if(!this.orderId) {
                this.$message.warning("请选择订单");
                return;
            }

            if(this.isAudit){ // 如果是审批
                console.log(this.$refs.auditcomponent.audit+"4556415151654165");
            
                if(this.$refs.auditcomponent.audit.operationStatus == 2 && !this.$refs.auditcomponent.audit.rejectionReasons) { // 如果是驳回
                    this.$message.warning("请填写审批意见");
                    return;
                }
                console.log(this.$refs.auditcomponent.audit,"编辑 审批意见 请填写审批意见");
                
            }

            let accessoryList = this.imgArr.map(file => {
                return {
                    fileUrl: file.url,
                    sourceName: file.name
                };
            });
            console.log(this.$refs.auditcomponent,"this.$refs.auditcomponent");
            

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // applyType 申请类型 1折扣特批 2工期特批 3返点 4开票 5退款 6退货退款 7换货 8退折扣 9家装代收合同 ,
                    let data = {
						...this.rebates,
						orderId: this.orderId, // 订单ID
						accessoryList, // 附件
                        // rebates: {	
						// 	referrerId: '', // 推荐人id
						// 	phone: '',
						// 	position: '', // 职位
						// 	company: '', // 所属公司
						// 	level: '', // 级别
						// 	accountNumber: '', // 银行卡号
						// 	purchasedGoodsMoney: '', // 外购商品金额/元
						// 	purchasedFee: '', // 外购提成
						// 	brandMoney: '', // 品牌金额
						// 	brandFee: '', // 品牌提成
						// 	rebatesMoney: '', // 返点金额
						// 	recommendNumber: '', // 推介单数
						// 	remake: '', // 备注
						// },

                    }
                    
                    if(this.isEdit) {
                        if ( this.delImgArr.length > 0 ) {
                            //有删除旧图片
                            console.log("有删除旧图片",this.delImgArr);
                            this.delImgArr.forEach(item => {
                                removeAccessoryImg(item).then(res => {});
                                
                            });
						}
						data.recommendRebatesApplyId = this.$route.query.recommendRebatesApplyId; // id
						data.orderId = this.orderId;

                        this.imgArr.forEach(item => {
                            if (!item.accessoryId) {
                                let data = {
                                    dataSourceId: this.orderApplyRefundId,
                                    sourceName: item.name,
                                    fileUrl: item.url,
                                    dataSourceEnum: "OrderApplyRefund"
                                };
                                addAccessory(data).then(res => {}).catch(error => {
                                    console.error("新增图片", error);
                                });
                            }
                        });

                        editReferrerReturnsApplication(data).then(res => {
                            if(res.status == 200) {
                                this.$message.success("操作成功");
                                this.$router.push("/rebatespermit/rebatesapply");
                            }
                        }).catch(err =>{
                            console.log('申请:返点管理 总申请 marketing/components/application/components/rebatesapply.vue', err);
                        })
                    }else if(this.isAdd){
						console.log(JSON.stringify(data),"data 44444");
						
						getUUID({ serialNumber: 'AR' }).then(res => {
							if(res.status == 200) {
								this.applyCode = res.data;
								data.applyCode =  this.applyCode;
								addReferrerReturnsApplication(data).then(res => {
									if(res.status == 200) {
										this.$message.success("操作成功");
										this.$router.push("/rebatespermit/rebatesapply");
									}
								}).catch(err =>{
									console.log('申请:返点管理 总申请 marketing/components/application/components/rebatesapply.vue', err);
								})
							}
						}).catch(err => {
							console.log('申请:返点管理 总申请 marketing/components/application/components/rebatesapply.vue', err);    
						})
                    }

                } else {
                    return false;
                }
            });

            
        },
        // 取消
        closeFun() {
            this.$router.push("/rebatespermit/rebatesapply");
		},
		// 推荐人返点审核
		referrerReturnsApplicationAudit() {
			
		},
		// 推荐人返点审核
        auditFun() {
            let operationStatus = 0;
            // operationStatus 操作状态 1通过 2拒绝 3退回上一步
            if(this.$refs.auditcomponent.audit.operationStatus == 1) { // 同意
               operationStatus = 1;
            }else if(this.$refs.auditcomponent.audit.operationStatus == 2) { // 拒绝
               operationStatus = 2;
            }

            let data = {
                workFlowBusinessId: this.$route.query.workFlowBusinessId, //  业务工作流程ID    
                dataSourceId: this.$route.query.orderApplyId, //    业务流程ID  
				operationStatus: operationStatus, //     操作状态 1通过 2拒绝 3退回上一步
				
				// recommendRebatesApplyId 申请Id
				// Status: this.$refs.auditcomponent.audit.operationStatus, // 审核状态 1通过 0驳回

                remake: this.$refs.auditcomponent.audit.rejectionReasons, // 审批意见

            }
            referrerReturnsApplicationAudit(data).then(res => {
                if(res.status == 200) {
                    this.$message.success("操作成功");
                    this.$router.push("/refundpermit/refundapply");
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
            })
                    
        },
        // 退回
        rebackFun() {
            let data = {
                workFlowBusinessId: this.$route.query.workFlowBusinessId, //  业务工作流程ID    
                dataSourceId: this.$route.query.orderApplyId, //    业务流程ID  
                operationStatus: 3, //     操作状态 1通过 2拒绝 3退回上一步  
                rejectionReasons: this.$refs.auditcomponent.audit.rejectionReasons, //    驳回原因
            }

            examineOrderApply(data).then(res => {
                if(res.status == 200) {
                    this.$message.success("操作成功");
                    this.$router.push("/refundpermit/refundapply");
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
            })
        },

	}
};
</script>
<style scoped lang='scss'>
.rebatesapply {
	
	.app_text {
		padding: 12px;
		.upload-demo{
			margin-top: 20px;
		}
		// >div{	
		// 	>span{
		// 		min-width: 120px;
		// 		text-align: right;
		// 		padding-right: 12px;
		// 		white-space: nowrap;
		// 	}
		// }
	}
	.rebatescontent {
		.rebatesinput {
			.demo-ruleForm{
				width: 80%;
				display: flex;
				flex-wrap: wrap;
				// justify-content: center;
				align-items: center;
				>div {
					width: 50%;
					margin: 10px 0px;
    				padding: 0px 5px;
					.el-input-number--medium {
						width: 100%;
					}
					&.textItem {
						width: 100%;
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

<style lang="scss">
	.rebatesinput{
		.el-input-number .el-input__inner{
			text-align: left;
		}
		.el-select--medium {
			width: 100%;
		}
	}
</style>


