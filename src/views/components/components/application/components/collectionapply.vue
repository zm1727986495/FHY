<!-- 家装代收合同申请 -->
<template>
  <div class="collectionapply">
    <div class="clo_content">
      <el-form
        :model="decoration"
        :rules="rules"
        ref="decoration"
        label-width="120px"
        class="demo-decoration" label-position="right">
  
			<!-- <el-form-item label="收款类型" prop="type">
				<el-select v-model="decoration.type" placeholder="">
				<el-option
					v-for="item in typeList" :key="item.value"
					:label="item.dictName" :value="item.id">
				</el-option>
				</el-select>
			</el-form-item> -->
          
			<el-form-item label="家装公司" prop="companyId">
				<el-select v-model="decoration.companyId" placeholder="" :size="size" :disabled="readonly">
					<el-option
						v-for="item in companyList" :key="item.companyId"
						:label="item.companyName" :value="item.companyId">
					</el-option>
				</el-select>
			</el-form-item>      
         
			<el-form-item label="合同金额" prop="contractMoney">
				<el-input-number class="width-100" :controls="false" v-model="decoration.contractMoney" :precision="2" :min="1" :size="size"  :disabled="readonly"></el-input-number>
				<!-- <el-input v-model="decoration.contractMoney"></el-input> -->
			</el-form-item>
        
			<!-- <el-form-item label="客户编号" prop="num">
				<el-input v-model="decoration.num"></el-input>
			</el-form-item> -->

			<el-form-item label="家装合同号"  prop="homeContractNumber">
				<el-input v-model="decoration.homeContractNumber" :size="size" :readonly="readonly"></el-input>
			</el-form-item>

			<el-form-item label="备注"  prop="remark" class="input_100">
				<el-input type="textarea" v-model="decoration.remark" :readonly="readonly"></el-input>
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
                    <i class="el-icon-document"></i> {{item.name}}
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
    <auditopinion v-if="isAudit" :orderId="orderId" ref="auditcomponent"></auditopinion>
	
	<div class="btn_btn" v-if="isAudit">
		<el-button type="primary" size="medium" class="reset_btn m-left20" @click="auditFun('refunds')" :loading="btnLoading">确 定</el-button>
		<!-- <el-button type="primary" size="medium" class="reset_btn m-left20" @click="rebackFun" :loading="btnLoading">退 回</el-button> -->
		<el-button  size="medium" class="reset_btn m-left20"  @click="closeFun(2)">取 消</el-button>
	</div>

    <div class="btn_btn" v-else>
		<el-button type="primary" size="medium" @click="submitForm('decoration')" :loading="btnLoading" v-if="!isView">申 请</el-button>
		<el-button size="medium" @click="closeFun(1)">取 消</el-button>
	</div>

  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import auditopinion from "../../components/auditopinion";

import { put, getBuffer } from "@/utils/pubilcFn";
import { getUUID } from 'api/pulicJava';
import {
	addHomeCollectionApply, // 添加
    editAuditStatus, // 审核
    homeCollectionApplyDetail, // 审核回显
    editHomeCollectionApply, // 编辑
    listCompanyServe, // 家装公司列表
} from 'api/administrationCenter/decorationpermit/index'; // 家装代收合同申请

import {  listCompanyByAll } from 'api/pulicJava';
import {
  removeAccessoryImg, //删除图片
  addAccessory, //新增图片
} from "@/api/order/recommender/recommender";

export default {
  components: {
    breadcrumb,
    pagination,
    auditopinion,
  },
  props: ["orderId",'homeData'],
  // name: 'brandmanagement',
  data() {
    return {
        btnLoading: false, // 按钮的loading Flag

		isAudit: false,
		isEdit: false,
        isAdd: false,
        isView: false,

        size: 'medium',
        urls: '',
         // 上传
		fileList: [],
		imgArr: [],
        delImgArr: [],
        readonly: false,
        
        decoration: {
            companyId: '', // 家装公司
            contractMoney: '', // 合同金额
            homeContractNumber: '', // 家装合同号
            remark: '', // 备注
		},
        // 条件
        typeList: [],
        companyList: [], // 供应商

        rules: {
            companyId: [{ 
                required: true, message: "请选择家装公司", trigger: "change" 
            }],
            homeContractNumber:[{
                required: true, message: "家装合同号", trigger: "blur" 
            }],
            contractMoney: [{ 
                required: true, message: '请输入合同金额', trigger: 'blur' 
            },],
        }
    };
  },
	created() {
		if(this.$route.path == "/decorationpermit/addapplication") { // 新增
			this.isAdd = true;
        }
    
        if(this.$route.path == "/decorationpermit/editapplication") { // 编辑
            this.isEdit = true;
            
            this.homeCollectionApplyDetail(); // 回显
        }

        if(this.$route.path == "/decorationpermit/auditmanagement") { // 审核
            this.isAudit = true;
            this.readonly = true;
            this.homeCollectionApplyDetail(); // 回显
        }

        if(this.$route.path == "/decorationpermit/viewapplication") { // 详情
            this.isView = true;
            this.readonly = true;
            this.homeCollectionApplyDetail(); // 回显
        }



		
		// 供应商
		this.getCompanyList();
	},

    methods: {
		// 获取供应商
		getCompanyList() {
			listCompanyServe({ companyType: 1 }).then(response => {
				this.companyList = response.data;
			}).catch(error => {
				console.log('views/contractmanagement/audit.vue:getCompanyList', error);
			})
		},

		// 家装合同申请编辑页回显
        homeCollectionApplyDetail() {
            let data = {
                orderApplyId: this.$route.query.orderApplyId,
                homeCollectionApplyId: this.$route.query.homeCollectionApplyId,// 家装代收合同id
            }
            homeCollectionApplyDetail(data).then(res => {
                if(res.status == 200) {

                    // 附件
                    this.fileList = res.data.homeAcc; // 家装代收合同附件
                    this.fileList = this.fileList.map(item => {
                        return {
                            ...item,
                            name: item.sourceName,
                            url: item.fileUrl
                        }
                    })
                    
					this.decoration.companyId =  res.data.companyId; // 供应商id,
					this.decoration.contractMoney = res.data.contractMoney; // 代收金额,
					this.decoration.homeContractNumber = res.data.homeContractNumber;// 家装合同号,
					this.decoration.remark = res.data.remark;
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 编辑页回显 marketing/components/application/components/urgentapply.vue', err);
            })
        },

        submitForm(formName) {
            if(!this.orderId) {
                this.$message.warning("请选择订单");
                return;
            }

          this.$refs[formName].validate(valid => {
            if (valid) {
                this.btnLoading = true;
                
				let homeCollectionApplyAcc = this.imgArr.map(file => {
					return {
						fileUrl: file.url,
						sourceName: file.name
					};
				});

				// 家装代收合同
                let data = {
					orderId: this.orderId,//订单id
					companyId: this.decoration.companyId,// 供应商id,
					contractMoney: this.decoration.contractMoney,// 代收金额,
					homeContractNumber: this.decoration.homeContractNumber,// 家装合同号,
					remark:  this.decoration.remark,
                    homeCollectionApplyAcc, // 家装代收合同附件
				}
				
				 
                    if(this.isEdit) {
                        data.orderApplyId = this.$route.query.orderApplyId;
                        data.projectDelayUrgentApplyId = this.projectDelayUrgentApplyId;

                        editHomeCollectionApply(data).then(res => {
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
                                this.$router.push("/decorationpermit/decorationapply");
                            }
                        }).catch(err =>{
                            console.log('申请:退款管理 总申请 marketing/components/application/components/urgentapply.vue', err);
                        })
                    }else if(this.isAdd){
                        getUUID({serialNumber: 'AC'}).then(res => {
                            if(res.status == 200) {
                                if(res.message == "该订单已经被申请") {
                                    this.$message.warning("该订单已经被申请,补课申请");
                                    return;
                                }
                                    
                                data.applyCode = res.data;

                                addHomeCollectionApply(data).then(res => {
                                    if(res.status == 200) {
                                        this.$message.success("操作成功");
                                        this.btnLoading = false;
                                        this.$router.push("/decorationpermit/decorationapply");
                                    }
                                }).catch(err =>{
                                    this.btnLoading = false;
                                    console.log('申请:工期加急管理 总申请 marketing/components/application/components/urgentapply.vue', err);
                                })
                            }
                        }).catch(err => {
                            console.log('申请:工期管理 总申请 marketing/components/application/components/urgentapply.vue', err);    
                        })
                    }



            } else {
              return false;
            }
		  });
		},
		// 取消
        closeFun(type) {
                this.$router.go(-1);
            // if(type == 1) {
            //     this.$router.push("/decorationpermit/decorationapply");
            // }else if(type == 2) {
            //     this.$router.push("/decorationpermit/decorationaudit");   
            // } 
		},
		 // 退回
        rebackFun() {
            this.btnLoading = true;

            let data = {
                workFlowBusinessId: this.$route.query.workFlowBusinessId, //  业务工作流程ID    
                orderApplyId: this.$route.query.orderApplyId, //    业务流程ID  
                status: 3, //     操作状态 1通过 2拒绝 3退回上一步  
                auditCause: this.$refs.auditcomponent.audit.rejectionReasons, //    驳回原因
            }

            editAuditStatus(data).then(res => {
                if(res.status == 200) {
                    this.$message.success("操作成功");
                    this.btnLoading = false;
                    this.$router.push("/decorationpermit/decorationaudit");
                }
            }).catch(err =>{
                this.btnLoading = false;
                console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
            })
		},
		// 推荐人返点审核
        auditFun() { 
            if(!this.$refs.auditcomponent.audit.operationStatus) {
                this.$message.warning("请选择审批状态");
                return;
            }

            if(this.$refs.auditcomponent.audit.operationStatus == 2 && !this.$refs.auditcomponent.audit.rejectionReasons) { // 如果是驳回
                this.$message.warning("请填写审批意见");
                return;
            }

            this.btnLoading = true;

            let data = {
				workFlowBusinessId: this.$route.query.workFlowBusinessId, //  业务工作流程ID 
				status: this.$refs.auditcomponent.audit.operationStatus,// 状态 1通过 2驳回
				auditCause: this.$refs.auditcomponent.audit.rejectionReasons, // 驳回原因
				orderApplyId: this.$route.query.orderApplyId,//订单申请id
				homeCollectionApplyId: this.$route.query.homeCollectionApplyId, // 家装代收合同id
            }
            editAuditStatus(data).then(res => {
                if(res.status == 200) {
                    this.$message.success("操作成功");
                    this.btnLoading = false;
                    this.$router.push("/decorationpermit/decorationaudit");
                }
            }).catch(err =>{
                this.btnLoading = false;
                console.log('申请:家装代收合同管理 总申请 marketing/components/application/components/refundapply.vue', err);
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
.collectionapply {
  .clo_content {
    width: 80%;
    .el-form {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		>div {
			width: 50%;
			.el-select {
				width: 100%;
			}
			&.input_100 {
				width: 100%;
			}
		}
    }
  }

  .btn_btn {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;

  }
}
</style>

<style lang="scss">
	.collectionapply{
		.el-input-number .el-input__inner{
			text-align: left;
		}
		.el-select--medium {
			width: 100%;
		}
	}
</style>

