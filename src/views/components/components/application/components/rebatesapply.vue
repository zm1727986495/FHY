<template>
  <!-- 返点申请 -->
	<div class="rebatesapply">

		<div  class="rebatescontent">
			<div class="rebatesinput">
				<el-form :model="rebates" :rules="rules" ref="ruleForm"  class="demo-ruleForm" label-width="115px">
					<el-form-item label="外部推荐人" prop="referrerName">
						<!-- <el-select v-model="rebates.referrerId" placeholder="外部推荐人" :size="size" @change="referrerChange"   :disabled="readonly">
							<el-option
								v-for="item in referrerNameList" :key="item.referrerId" :label="item.referrerName" :value="item.referrerId">
							</el-option>
						</el-select> -->
						<el-input v-model="rebates.referrerName" :disabled="true" :size="size"  placeholder="外部推荐人" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="电话" prop="phone">
						<el-input v-model="rebates.phone" :size="size" :disabled="true"  placeholder="电话" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="职位" prop="position">
						<el-input v-model="rebates.position" :size="size" :disabled="true"  placeholder="职位" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="所属公司" prop="companyName">
						<el-input v-model="rebates.companyName" :size="size" :disabled="true"  placeholder="所属公司" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="级别" prop="referrerLevel">
						<!-- <el-input v-model="rebates.referrerLevel" :size="size"  placeholder="级别" :readonly="readonly"></el-input> -->
						<!-- <el-select v-model="rebates.referrerLevel" placeholder="级别" :size="size" :disabled="readonly"> -->
						<el-select v-model="rebates.referrerLevel" placeholder="级别" :size="size" @change="levelFn">
							<el-option
								v-for="item in levelList" :key="item.id" :label="item.dictName" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
						<el-form-item label="开户行" prop="openingBank" required>
						<el-input v-model="rebates.openingBank" placeholder="开户行"></el-input>
					</el-form-item>
          <el-form-item label="开户姓名" prop="accountName" required>
						<el-input v-model="rebates.accountName" placeholder="开户姓名"></el-input>
					</el-form-item>
					<el-form-item label="银行卡号" prop="accountNumber" required>
						<el-input v-model="rebates.accountNumber" placeholder="银行卡号"></el-input>
					</el-form-item>

					<el-form-item label="返点次数" prop="totalRefundNumber">
              <el-input-number placeholder="返点次数" :controls="false" v-model="rebates.totalRefundNumber" :min="0" size="medium"></el-input-number>
					</el-form-item>
					
					<el-form-item label="外购商品金额" prop="purchasedGoodsMoney">
						<div style='display:flex;align-items:center;'>
              <!-- <el-input-number placeholder="外购商品金额/元" @change="outsourcing"  :controls="false" v-model="rebates.purchasedGoodsMoney" :precision="2" :min="0" size="medium"  :disabled="readonly"></el-input-number>
              <el-input-number style="margin-left:5px;" @change="outsourcing" :controls="false" v-model="rebates.purchasedFeeRate" :min="0" size="medium"  :disabled="readonly"></el-input-number> -->
              <!-- <el-input-number style="margin-left:5px;" :max='rebates.outsourcingGoodsStandard' :disabled="readonly" :controls="false" v-model="rebates.purchasedFeeRate" :min="0" size="medium"></el-input-number> -->
              <el-input-number placeholder="外购商品金额/元" :controls="false" v-model="rebates.purchasedGoodsMoney" :precision="2" :min="0" size="medium" ></el-input-number>
							<el-input style="margin-left:5px;" @input="outsourFn" v-model="rebates.purchasedFeeRate" size="medium"></el-input>%
						</div>
					</el-form-item>
					
					<el-form-item label="品牌金额" prop="brandMoney">
						<div style='display:flex;align-items:center;'>
              <!-- <el-input-number placeholder="品牌金额/元" @change="brandFn"  :controls="false" v-model="rebates.brandMoney" :precision="2" :min="0" size="medium"  :disabled="readonly"></el-input-number>
              <el-input-number style="margin-left:5px;" @change="brandFn"  :controls="false" v-model="rebates.brandFeeRate" :min="0" size="medium"  :disabled="readonly"></el-input-number> -->
              <!-- <el-input-number style="margin-left:5px;" @change="brandFn" :max='rebates.purchasedGoodsStandard' :disabled="readonly"  :controls="false" v-model.number="rebates.brandFeeRate" :min="0" size="medium"></el-input-number> -->
              <el-input-number placeholder="品牌金额/元" :controls="false" v-model="rebates.brandMoney" :precision="2" :min="0" size="medium" ></el-input-number>
              <el-input style="margin-left:5px;" @input="brandFn" v-model="rebates.brandFeeRate" size="medium"></el-input>%
						</div>
					</el-form-item>
					<el-form-item label="总合同金额" prop="totalContractAmount">
              <el-input-number :disabled="true" placeholder="合同金额" :controls="false" v-model="rebates.totalContractAmount" :min="0" size="medium"></el-input-number>
					</el-form-item>
					<el-form-item label="外购提成" prop="purchasedFee">
              <!-- <el-input-number placeholder="外购提成/元"  :controls="false" v-model="rebates.purchasedFee" :precision="2" :min="0" size="medium"  :disabled="readonly"></el-input-number> -->
              <el-input-number placeholder="外购提成/元"  :controls="false" v-model="rebates.purchasedFee" :precision="2" :min="0" size="medium" :disabled="true"></el-input-number>
					</el-form-item>

					<el-form-item label="品牌提成" prop="brandFee">
              <!-- <el-input-number placeholder="品牌提成/元"  :controls="false" v-model="rebates.brandFee" :precision="2" :min="0" size="medium"  :disabled="readonly"></el-input-number> -->
              <el-input-number placeholder="品牌提成/元"  :controls="false" v-model="rebates.brandFee" :precision="2" :min="0" size="medium"  :disabled="true"></el-input-number>
					</el-form-item>
				
					<!-- <el-form-item label="总返点金额" prop="totalRefundAmount">
            <el-input-number placeholder="返点金额/元"  :controls="false" v-model="rebates.totalRefundAmount" :precision="2" :min="0" size="medium"></el-input-number>
					</el-form-item> -->
			
					<el-form-item label="返点金额" prop="rebatesMoney">
            <!-- <el-input-number placeholder="返点金额/元"  :controls="false" v-model="rebates.rebatesMoney" :precision="2" :min="0" size="medium" :disabled="readonly"></el-input-number> -->
            <el-input-number placeholder="返点金额/元"  :controls="false" v-model="rebates.rebatesMoney" :precision="2" :min="0" size="medium" :disabled="isRebate"></el-input-number>
					</el-form-item>
					
					<el-form-item label="备注" prop="remake" label-width="140px" class="textItem">
						<el-input type="textarea" v-model="rebates.remake" resize='none'></el-input>
					</el-form-item>
				</el-form>
			</div>
			<!-- <div class="app_text">
				<div class="titlecals martop">附件管理</div>
                <el-upload list-type="text" class="upload-demo" action="string" :http-request="uploadSectionFile" :file-list="fileList" :on-remove="handleRemove">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
			</div> -->


			<div  v-if="isAudit || isView">
				<div v-if="fileList && fileList.length != 0">
					<div class="iconBox m-bottom">
			            <i class="Icon"></i>
			            <span>附件管理</span>
			        </div>
					<ul class="el-upload-list el-upload-list--text downlists">
						<li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
							<a class="el-upload-list__item-name">
								<i class="el-icon-document"></i> {{item.name}}
							</a>
							<a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
						</li>
					</ul>
				</div>
			</div>

			<div v-else>
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
    		<auditopinion v-if="isAudit"  ref="auditcomponent" :orderId="orderId"></auditopinion>

			<div class="btn_btn"  v-if="!isAudit">
				<el-button type="primary" size="medium" class="reset_btn m-left20"  @click="applyFun('ruleForm')" :loading="btnLoading" v-if="!isView">申 请</el-button>
				<el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
			</div>

			<div class="btn_btn" v-if="isAudit">
				<el-button type="primary" size="medium" class="reset_btn m-left20" @click="auditFun()" :loading="btnLoading" >确 定</el-button>
				<!-- <el-button type="primary" size="medium" class="reset_btn m-left20" @click="auditFun(3)" :loading="btnLoading">退 回</el-button> -->
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
import { listBaseDict } from "api/common/common";
import { getUpToken } from "@/utils/auth";
import { put, getBuffer } from "@/utils/pubilcFn";
import {
	listReferrerByPage, // 推荐人
	addReferrerReturnsApplication, // 新增推荐人返点申请
	getReferrerInfo, // 外部推荐返点信息 -- 回显
	editReferrerReturnsApplication, // 修改返点申请
	referrerReturnsApplicationAudit, // 推荐人返点审核
	getReferrer,
	getReferrerDetails
} from 'api/marketing/rebatespermit/index';
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
  props: ["orderId"],
  // name: 'brandmanagement',
  data() {
    return {
		btnLoading: false, // 按钮的loading Flag

		size: "medium",
		listReferrer: '', // 推荐人
		urls: '',
		readonly:false,

		rebates: {	
			outsourcingGoodsStandard:0,//外购返点
			purchasedGoodsStandard:0,//内购返点
			purchasedFeeRate:'',
			brandFeeRate:'',
			referrerId: '',
			phone: '',
			position: '', // 职位
			companyName: '', // 所属公司
			totalContractAmount:'',//合同金额
			level: '', // 级别
			accountNumber: '', // 银行卡号
			openingBank:'',//开户行
			accountName:'',//开户姓名
			purchasedGoodsMoney: '', // 外购商品金额/元
			purchasedFee: '', // 外购提成
			brandMoney: '', // 品牌金额
			brandFee: '', // 品牌提成
			rebatesMoney: '', // 返点金额
			totalRefundAmount:'',
			totalRefundNumber: '', // 推介单数
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
		isView: false, // 详情页
		levelList:[
			// {
			// 	name:'A级',
			// 	id:337
			// },
			// {
			// 	name:'B级',
			// 	id:338
			// },
			// {
			// 	name:'C级',
			// 	id:339
			// }
		],
		rules: {
			// referrerId: [
			// 	{ required: true, message: '请选择推荐人', trigger: 'change' }
			// ],
			referrerName:[
				{required: true, message: '外部推荐人', trigger: 'blur' }
			],
			remake: [
				{ message: '请填写备注', trigger: 'blur' }
			],
			// totalContractAmount: [
			// 	{ required: true, message: '请填写合同金额', trigger: 'change' }
			// ],
			openingBank:[
				{ required: true, message: '请填写开户行', trigger: 'change' }
			],
			accountName:[
				{ required: true, message: '请填写开户姓名', trigger: 'change' }
			],
			accountNumber:[
				{ required: true, message: '请填写银行卡号', trigger: 'change' }
			],
			rebatesMoney: [
				{ required: true, message: '请填写返点金额', trigger: 'change' }
			],
			totalRefundAmount:[
				{ required: true, message: '请填写总返点金额', trigger: 'change' }
			],
			// brandFee: [
			// 	{ required: true, message: '请填写品牌提成', trigger: 'change' }
			// ],
			// brandMoney: [
			// 	{ required: true, message: '请填写品牌金额', trigger: 'change' }
			// ],
			// purchasedFee: [
			// 	{ required: true, message: '请填写外购提成', trigger: 'change' }
			// ],
			// purchasedGoodsMoney: [
			// 	{ required: true, message: '请填写外购商品金额', trigger: 'change' }
			// ],
		},
		isFlag:true,
		isRebate:true
		
    };
  },
	watch: {
		orderId: function(val,attr) {
			if(this.isAudit || this.isEdit || this.isView) {
				this.getReferrerInfo(); // 外部推荐返点信息 -- 回显
			}
		},
		'rebates.brandFee':function (val) {
			// 详情的时候不做计算返点金额
			if(this.$route.path != "/rebatespermit/viewapplication") { // 返点详情页
				this.rebates.rebatesMoney =	this.rebates.brandFee*1 + this.rebates.purchasedFee*1
			}
		},
		'rebates.purchasedFee':function (val){
			// 详情的时候不做计算返点金额
			if(this.$route.path != "/rebatespermit/viewapplication") { // 返点详情页
				this.rebates.rebatesMoney =	this.rebates.brandFee*1 + this.rebates.purchasedFee*1
			}
		},
		'rebates.purchasedGoodsMoney':function(val){
			this.rebates.purchasedFee = this.rebates.purchasedGoodsMoney * (this.rebates.purchasedFeeRate/100)
		},
		'rebates.brandMoney':function(val){
			this.rebates.brandFee = this.rebates.brandMoney * (this.rebates.brandFeeRate/100)
		}
	},
	created() {
		if(this.$route.path == "/rebatespermit/editapplication") { // 编辑页
			this.isEdit = true;
			this.getReferrerInfo(); // 页面回显
		}
		if(this.$route.path == "/rebatespermit/auditmanagement") { // 返点审核页
			this.isAudit = true;
			this.readonly = true;
			this.isRebate = false;

			this.getReferrerInfo(); // 页面回显
		}

		if(this.$route.path == "/rebatespermit/viewapplication") { // 返点详情页
			this.isView = true;
			this.readonly = true;

			this.getReferrerInfo(); // 页面回显
		}
		if(this.$route.path == "/rebatespermit/addapplication") { // 新增页
			this.isAdd = true;
		}
		
		// 推荐人信息
		// this.listReferrerByPage();
	},
	mounted() {
		this.getLevel()
	},
	methods: {
		levelFn(){
			this.isFlag= false;
		},
		//品牌金额
		brandFn(){
			this.rebates.brandFeeRate = this.rebates.brandFeeRate.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
			this.rebates.brandFeeRate = this.rebates.brandFeeRate.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
			this.rebates.brandFeeRate = this.rebates.brandFeeRate.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); 
			if (this.rebates.brandFeeRate.indexOf(".") < 0 && this.rebates.brandFeeRate != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
			this.rebates.brandFeeRate = parseFloat(this.rebates.brandFeeRate);
			}
			if(this.isFlag&&this.rebates.purchasedGoodsStandard){
				if(this.rebates.brandFeeRate > this.rebates.purchasedGoodsStandard){
					this.rebates.brandFeeRate = this.rebates.purchasedGoodsStandard
				}
			}
			this.rebates.brandFee = this.rebates.brandMoney * (this.rebates.brandFeeRate/100)
		},
		//外购金额
		outsourFn(){
			this.rebates.purchasedFeeRate = this.rebates.purchasedFeeRate.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
			this.rebates.purchasedFeeRate = this.rebates.purchasedFeeRate.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
			this.rebates.purchasedFeeRate = this.rebates.purchasedFeeRate.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); 
			if (this.rebates.purchasedFeeRate.indexOf(".") < 0 && this.rebates.purchasedFeeRate != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
				this.rebates.purchasedFeeRate = parseFloat(this.rebates.purchasedFeeRate);
			}
			console.log(this.rebates.outsourcingGoodsStandard);
			
			if(this.isFlag&&this.rebates.outsourcingGoodsStandard){
				if(this.rebates.purchasedFeeRate > this.rebates.outsourcingGoodsStandard){
					this.rebates.purchasedFeeRate = this.rebates.outsourcingGoodsStandard
				}
			}
			this.rebates.purchasedFee = this.rebates.purchasedGoodsMoney * (this.rebates.purchasedFeeRate/100)
		},
		//获取级别
		getLevel(){
			listBaseDict({dataType:'return_Grade'}).then(res=>{
				this.levelList = res.data
			})
		},
		// 推荐人信息发生变化
		referrerChange(val) {
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
		listReferrerByPageFn(referrerId,orderId) {
			// getReferrer({referrerId}).then(res => {
			// 	if(res.status == 200) {
			// 		// this.referrerNameList = res.data.rows;
			// 		this.rebates = res.data;
			// 	}
			// })
			getReferrerDetails({referrerId,orderId}).then(res=>{
				if(res.status == 200){
					// console.log(res);
					this.rebates = res.data;
					if(res.data.referrerLevel == 0){
						this.rebates.referrerLevel = '';
					}
					// this.rebates.referrerLevel = res.data
					
				}
			}).catch(error=>{
				console.error('推荐人信息',error);
				
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
		
		// 外部推荐返点信息 -- 回显
        getReferrerInfo() {
            let data = {
							orderId: this.$route.query.orderId,
							recommendRebatesApplyId:this.$route.query.recommendRebatesApplyId
            };
            getReferrerInfo(data).then(res => {
                if(res.status == 200) {
								this.rebates = res.data;

								if(res.data.accessoryList && res.data.accessoryList.length != 0) {
									this.fileList = res.data.accessoryList.map(item =>{
										return{
											...item,
											name: item.sourceName,
											url: item.fileUrl
										}
									})
								}

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
					let recommendRebatesFile = this.imgArr.map(file => {
							return {
									fileUrl: file.url,
									sourceName: file.name
							};
					});
          this.$refs[formName].validate((valid) => {
						if (valid) {
							this.btnLoading = true;

												// applyType 申请类型 1折扣特批 2工期特批 3返点 4开票 5退款 6退货退款 7换货 8退折扣 9家装代收合同 ,
							let data = {
								...this.rebates,
								orderId: this.orderId, // 订单ID
								recommendRebatesFile, // 附件
							}
							data.applyStatus = this.$route.query.applyStatus;
							data.auditAt = this.$route.query.auditAt;
							data.auditTime = this.$route.query.auditTime;
							data.createAt = this.$route.query.createAt;
							data.createTime = this.$route.query.createTime;
							data.orderApplyId = this.$route.query.orderApplyId;

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
								// this.imgArr.forEach(item => {
								//     if (!item.accessoryId) {
								//         let data = {
								//             dataSourceId: this.orderApplyRefundId,
								//             sourceName: item.name,
								//             fileUrl: item.url,
								//             dataSourceEnum: "OrderApplyRefund"
								//         };
								//         addAccessory(data).then(res => {}).catch(error => {
								//             console.error("新增图片", error);
								//         });
								//     }
								// });
								editReferrerReturnsApplication(data).then(res => {
									if(res.status == 200) {
											this.$message.success("操作成功");
											this.btnLoading = false;
											this.$router.push("/rebatespermit/rebatesapply");
									}else{
										this.btnLoading = false;
									}
								}).catch(err =>{
									this.btnLoading = false;
									console.log('申请:返点管理 总申请 marketing/components/application/components/rebatesapply.vue', err);
								})
								}else if(this.isAdd){
									getUUID({ serialNumber: 'AR' }).then(res => {
										if(res.status == 200) {
											data.applyCode =  res.data;
											addReferrerReturnsApplication(data).then(res => {
												if(res.status == 200) {
													this.$message.success("操作成功");
													this.btnLoading = false;
													this.$router.push("/rebatespermit/rebatesapply");
												}else{
													this.btnLoading = false;
												}
											}).catch(err =>{
												this.btnLoading = false;
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
        
		// 推荐人返点审核
        auditFun(status) {
					if(this.$refs.auditcomponent.audit.operationStatus == 2 && !this.$refs.auditcomponent.audit.rejectionReasons) { // 如果是驳回
						this.$message.warning("请填写审批意见");
						return;
					}

					let data = {
						...this.rebates,
						recommendRebatesApplyId: this.$route.query.recommendRebatesApplyId,
						remake: this.$refs.auditcomponent.audit.rejectionReasons,
						workFlowBusinessId: this.$route.query.workFlowBusinessId,
						orderApplyId: this.$route.query.orderApplyId,
						referrerId:this.rebates.referrerId,
						totalRefundNumber: this.rebates.totalRefundNumber,
						totalRefundAmount: this.rebates.totalRefundAmount,
						totalContractAmount: this.rebates.totalContractAmount,
						rebatesMoney: this.rebates.rebatesMoney,
						contractMoney: this.rebates.contractMoney
					}

			// if(status){
			// 	data.status = 3;
			// }else{
			// 	if(this.$refs.auditcomponent.audit.operationStatus == ""){
			// 		this.$message.warning("请选择审核状态!");
			// 		return;
			// 	};
			// }
			data.status = this.$refs.auditcomponent.audit.operationStatus 
			this.btnLoading = true;
			console.log(data);
			
			referrerReturnsApplicationAudit(data).then(res => {
				if(res.status == 200) {
					this.$message.success("操作成功");
					this.btnLoading = false;
					this.$router.go(-1);
				}else{
					this.btnLoading = false;
				}
			}).catch(err =>{
				this.btnLoading = false;
				console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
			})
		},
		
		// 取消
        closeFun() {
            this.$router.go(-1);
		},

	}
};
</script>
<style scoped lang='scss'>
.rebatesapply {
	
	.app_text {
		padding: 12px;
		margin-top: 20px;
		.upload-demo{
			margin-left: 140px;
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
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				// justify-content: center;
				align-items: center;
				>div {
					box-sizing: border-box;
					width: 33%;
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
	width: 350px;
	margin: 10px auto;
	display: flex;
	flex-wrap: nowrap;
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


