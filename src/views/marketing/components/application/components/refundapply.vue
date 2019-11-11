<template>
  <!-- 退款申请 -->
	<div class="refundapply">
        <div class="selType">
            <span>退款类型:</span>
            <el-select v-model="refund.refundMode"  placeholder="" size="medium" :disabled="isView">
                <el-option
                    v-for="item in refundList" :key="item.value"
                    :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="h-widths"></div>
        <div class="status1">
            <div class="allMoney" >
                <div>
                    <span>可退金额:</span>
                    <span style="color:red">{{orderMoney.collectMoney}}元</span>
                </div>

                <div>
                    <span>合同金额:</span>
                    <span style="color:red">{{orderMoney.contractMoney}}元</span>
                </div>

                <div>
                    <span>代金券金额:</span>
                    <span style="color:red">{{orderMoney.shopCashCouponAmount}}元</span>
                </div>

                <div>
                    <span>实收金额:</span>
                    <span style="color:red">{{orderMoney.collectMoney}}元</span>
                </div>
            </div>
            <div class="h-width"></div>
            <div  v-if="status1 == 1 || status1 == 2">
                <el-form
                    :model="refund"
                    :rules="ruleForm"
                    ref="refund"
                    label-width="120px"
                    class="demo-refund" label-position="right">

                    <!-- <el-form-item  label="退款原因" class="search_item"  prop="reason"  v-if="isAudit">
                        <el-radio-group v-model="refund.reason">
                            <el-radio :label="1">多收款</el-radio>
                            <el-radio :label="2">退预付款</el-radio>
                        </el-radio-group>
                    </el-form-item> -->

                    <el-form-item label="实际退款金额" prop="refundMoney" >
                        <el-input-number :disabled="isView" class="width-100" placeholder="实际退款金额/元"  :controls="false" v-model="refund.refundMoney" :precision="2" :min="0" size="medium"></el-input-number>
                    </el-form-item>
                    
                    <el-form-item label="退款方式" prop="refundType" class="refundType">
                        <el-select v-model="refund.refundType" placeholder="请选择付款方式" :disabled="isView">
                            <el-option
                                v-for="item in typeList" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>      
                    <el-form-item label="银行信息" prop="customerBankCardId" v-if="refund.refundType == '2'">
                        <el-select v-model="refund.customerBankCardId" placeholder="银行信息" :disabled="isView">
                            <el-option
                                v-for="item in bankInfo"
                                :key="item.customerBankCardId"
                                :label="item.customerBankCard"
                                :value="item.customerBankCardId"
                                class="optionSelf"
                            >
                                <span>用户名: {{ item.accountName }}</span>
                                <span>开户行:{{ item.affiliatedBank }}</span>
                                <span>卡号:{{ item.bankCardNumber }}</span>
                            </el-option>
                            <!-- 用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber} -->
                        </el-select>
                    </el-form-item>
                
                    <el-form-item label="退款原因"  prop="refundReason">
                        <el-input type="textarea" v-model="refund.refundReason" :readonly="isView"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
		
        <div class="status1" v-if="status1 == 3">
            <!-- 折扣退款时的table -->
           <refundtable :discountRate="orderMoney.discountRate" ref="refundtable"></refundtable>
        </div>

        <!-- 附件管理 -->
        <!-- <el-form-item label="上传附件" class="input_100" prop="referrerName" label-width="120px"> -->
            <div  v-if="isAudit">
                <div class="titlecals martop">附件管理</div>
                <ul class="el-upload-list el-upload-list--text downlists">
                    <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
                        <a class="el-upload-list__item-name">
                            <i class="el-icon-document"></i> {{item.name}}
                        </a>
                        <a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
                    </li>
                </ul>
            </div>

            <div  v-else>
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

        <!-- </el-form-item> -->

		<div  class="refundcontent">
			<div class="refundinput">
				
				
			</div>

            <!-- 审批意见组件 -->
            <auditopinion v-if="isAudit" ref="auditcomponent"></auditopinion>

			<div class="btn_btn" v-if="!isAudit">
				<el-button type="primary" size="medium" class="reset_btn m-left20" @click="getUUID" v-if="isAdd">申 请</el-button>
                <el-button type="primary" size="medium" class="reset_btn m-left20" @click="applyFun('refund')" v-if="isEdit">申 请</el-button>
				<el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
			</div>

            <div class="btn_btn" v-if="isAudit">
				<el-button type="primary" size="medium" class="reset_btn m-left20" @click="auditFun('refund')">审 核</el-button>
				<el-button type="primary" size="medium" class="reset_btn m-left20" @click="rebackFun">退 回</el-button>
				<el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import refundtable from './refundtable';
import auditopinion from "../../components/auditopinion";
import { put, getBuffer } from "@/utils/pubilcFn";

import { getUUID } from "api/pulicJava";
import {
    orderCollectMoneyDetails, // 客户银行信息表
} from "api/entrepotSet/compensationmanage/index";
import {
  removeAccessoryImg, //删除图片
  addAccessory, //新增图片
} from "@/api/order/recommender/recommender";

import {
    getOrderCollectMoney, // 获取订单收款信息
    addOrderApply, // 新增申请
    getOrderReturnMoney,  // 获取订单退款信息回显
    editOrderReturnMoney, // 修改
    examineOrderApply, // 审核
} from 'api/marketing/refundpermit/index';



export default {
  components: {
    breadcrumb,
    pagination,
    refundtable,
    auditopinion,
  },
  props: ["orderId"],
  // name: 'brandmanagement',
  data() {
    return {
        applyCode: '', // UUId
        customerId: '', // 客户id
        orderMoney: {
            collectMoney: 0, // 可退金额
            contractMoney: '', // 合同金额
            shopCashCouponAmount: '', // 代金券金额
        }, // 几个金额
        
        isAdd: false, // 是否是新增页
        isAudit: false, // 是否是审核页
        isEdit: false, // 是否是编辑页
        isView: false,// 是否只看
        // 条件
        refundList: [{ // 退款类型 1退款 2 退单退款 3折扣退款  2删掉了
            label: '退款',value: 1,
        },{
            label: '折扣退款',value: 3,
        },], 
        typeList: [{ // 退款方式
            label: '现金',value: '1',
        },{
            label: '转账',value: '2',
        },{
            label: '内部转账',value: '3',
        },],
        bankInfo: {}, // 银行信息

		 // 上传
        fileList: [],
        imgArr: [],
        delImgArr: [],
        orderApplyRefundId: '',

        status1: 1, // 退款方式状态 -- 上面的
        rules: {
            money: [
                { required: true, message: '请输入退单金额', trigger: 'blur' },
            ],
            type2: [
            	{ required: true, message: '请选择退款方式', trigger: 'change' }
            ],
            desc: [
                { required: true, message: '请输入描述',trigger: 'blur'}, 
            ]
        },
        ruleForm: {
            refundMoney: [
                { required: true, message: '请输入退单金额', trigger: 'blur' },
            ],
            refundType: [
            	{ required: true, message: '请选择退款方式', trigger: 'change' }
            ],
            refundReason: [
                { required: true, message: '请输入描述',trigger: 'blur'}, 
            ]
        },
        urls: "",
        refund: { // 退款申请，选择 退款 的退款方式出现的input
            refundMode:  1 , // 上面的退款方式 -- 需监听
            // money : '', // 上面的退款方式 -- 需监听
            // type2: '', // 内容的退款方式
			// desc: '', // 其他说明
            reason: '' , // reason
            refundMoney: '' , //   实际退款金额
            refundType: '' , //  退款方式 
            refundReason: '' , 
            customerBankCardId: "", // 银行信息
        }
    };
  },

    watch: {  
        // orderId(val) {
        //     this.orderId = val;
        //     this.getOrderCollectMoney();
        //     console.log(val,"orderId 在退款申请的watch");
        // },
        orderId: function(val,attr) {
            // this.orderId = attr;
            this.getOrderCollectMoney();
        },
        customerId(val) {
            this.customerId = val;
            this.getorderCollectMoneyDetails();
        },
        
        'refund.refundType'(val) { // 收款方式
            if(val == '1') {
                this.refund.customerBankCardId = ''; // 清空银行信息
            }else if(val == '2') {

            }else if(val == '3'){

                this.refund.customerBankCardId = ''; // 清空银行信息
            }
        },
        'refund.refundMode'(val) { // 退款类型 1退款 2 退单退款 3折扣退款 
            if(val == 1) {
                this.status1 = 1;
            }else if(val == 2) {
                this.status1 = 2;
            }else if(val == 3){
                this.status1 = 3;
            }
        }
    },
    created() {
        
        if(this.$route.path == "/refundpermit/auditmanagement") { // 审批页
            this.isAudit = true;

            this.isView = true;
            this.getOrderReturnMoney(); // 回显审批页信息
            this.getOrderCollectMoney(); // 四个金额
        }

        if(this.$route.path == "/refundpermit/addapplication") {
            this.isAdd = true;
        }

        if(this.$route.path == "/refundpermit/editapplication"){ // 编辑页
            this.isEdit = true;

            this.getOrderReturnMoney(); // 回显编辑页信息
            this.getOrderCollectMoney(); // 四个金额
        }
    },
    methods: {
        // 获取订单退款信息回显
        getOrderReturnMoney() {
            let data = {
                orderApplyId: this.$route.query.orderApplyId,
            };

            getOrderReturnMoney(data).then(res => {
                if(res.status == 200) {
                    this.refund = res.data;
                    // this.orderMoney = res.data;
                    this.refund.refundMode = res.data.refundMode;
                    this.refund.refundType = String(res.data.refundType);
                    // this.orderId = res.data.orderId;
                    this.fileList = res.data.pics;
                    this.fileList = this.fileList.map(item => {
                        return {
                            ...item,
                            name: item.sourceName,
                            url: item.fileUrl
                        }
                    })
                    this.orderApplyRefundId = res.data.orderApplyRefundId;
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
            })
        },
        //  获取订单收款信息 -- 回显
        getOrderCollectMoney() {
            let data = {
                orderId: this.orderId ? this.orderId : '',
            };

            getOrderCollectMoney(data).then(res => {
                if(res.status == 200) {
                    this.orderMoney = res.data;
                    this.orderMoney.collectMoney = res.data.collectMoney; // 可退金额
                    this.orderMoney.contractMoney =  res.data.collectMoney; // 合同金额
                    this.orderMoney.shopCashCouponAmount =  res.data.shopCashCouponAmount; // 代金券金额
                    
                    // this.orderMoney.collectMoney = res.data.collectMoney;
                    this.customerId = res.data.customerId;
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
            })
        },

        getUUID() {
            let data = {
                serialNumber: 'AE',
            }
            getUUID(data).then(res => {
                if(res.status == 200) {
                    this.applyCode = res.data;
                    this.applyFun("refund");
                }
            }).catch(err => {
                console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
            })
        },
        // 审核
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
        
        // 新增
        applyFun(formName) {
            if(!this.orderId) {
                this.$message.warning("请选择订单");
                return;
            }else if(!this.refund.refundMode) {
                this.$message.warning("请选择退款类型");
                return;
            }

            if(this.isAudit){ // 如果是审批
                if(this.$refs.auditcomponent.audit.operationStatus == 2 && !this.$refs.auditcomponent.audit.rejectionReasons) { // 如果是驳回
                    this.$message.warning("请填写审批意见");
                    return;
                }
            }

            let pisc = this.imgArr.map(file => {
                return {
                    fileUrl: file.url,
                    sourceName: file.name
                };
            });
            

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // applyType 申请类型 1折扣特批 2工期特批 3返点 4开票 5退款 6退货退款 7换货 8退折扣 9家装代收合同 ,
                    let data = {
                        applyCode: this.applyCode,
                        // 编辑
                        orderApplyId: this.isEdit && this.$route.query.orderApplyId ? this.$route.query.orderApplyId : '', // 区分编辑和新增
                        orderId: this.orderId, // 订单ID
                        refundType: this.refund.refundMode == 3 ? '' : this.refund.refundType, // 退款方式 1现金 2转账 3内部转账
                        refundMode: this.refund.refundMode, //退款类型 1退款 2 退单退款 3折扣退款 
                        customerBankCardId: this.refund.customerBankCardId, // 客户银行卡id 
                        
                        discount: this.refund.refundMode == 3 ? this.$refs.refundtable.formDiscount.discount :'', // 现在折扣率 
                        refundMoney: this.refund.refundMode == 3 ? this.$refs.refundtable.formDiscount.discount : this.refund.refundMoney, // 退折扣金额 or 实际退款金额
                        refundReason: this.refund.refundMode == 3 ? this.$refs.refundtable.formDiscount.discount : this.refund.refundReason,// 退款原因 or 退折扣原因
                        pisc,



                        // 审批
                        operationStatus: this.isAudit ? this.$refs.auditcomponent.audit.operationStatus : '',
                        rejectionReasons: this.isAudit ? this.$refs.auditcomponent.audit.rejectionReasons : '',

                    }
                    
                    if(this.isEdit) {
                        if ( this.delImgArr.length > 0) {
                            //有删除旧图片
                            console.log("有删除旧图片",this.delImgArr);
                            this.delImgArr.forEach(item => {
                                removeAccessoryImg(item).then(res => {});
                                
                            });
                        }

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

                        editOrderReturnMoney(data).then(res => {
                            if(res.status == 200) {
                                this.$message.success("操作成功");
                                this.$router.push("/refundpermit/refundapply");
                            }
                        }).catch(err =>{
                            console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
                        })
                    }else if(this.isAdd){
                        addOrderApply(data).then(res => {
                            if(res.status == 200) {
                                this.$message.success("操作成功");
                                this.$router.push("/refundpermit/refundapply");
                            }
                        }).catch(err =>{
                            console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
                        })
                    }

                } else {
                    return false;
                }
            });

            
        },
        // 取消
        closeFun() {
            this.$router.push("/refundpermit/refundapply");
        },
        // 银行信息
        getorderCollectMoneyDetails() { // 回显过来的customerId
            let data = {
                customerId: this.customerId,
            };

            orderCollectMoneyDetails(data).then(res => {
                if (res.status == 200) {
                    this.bankInfo = res.data.rows;

                    this.bankInfo = this.bankInfo.map(item => {
                        item.customerBankCard = `用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber}`;
                        return item;
                    });

                
                }
            }).catch(err => {
                console.log("仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue",err);
            });
        },
        

        // 文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile(res) {
            put(res).then(data => {
                this.imgArr.push(data);
                
            });
        },

        // 文件删除操作
        handleRemove(file, fileList) {
            console.log(file,"file 52252");
            
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
        // 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            
            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;
            
            let data = this.searchdatas();
            this.getList(data);
        },
        
        // 搜索条件获取
        searchdatas(){
            return {
                // text : this.text ? this.text : '',  // 报废单号 订单号 采购单
                // startTime: this.searchData[0] ? this.searchData[0] : '', 
                // endTime: this.searchData[1] ? this.searchData[0] : '',
                // scrapApplyType: this.scrapApplyType ? this.scrapApplyType : '',  // 报废类型
                // status: Number(this.status), // tab状态

                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        //表格斑马线设置
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? "el-f0" : "";
        }
    }
};
</script>
<style scoped lang='scss'>
.refundapply {
    .selType{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        >span {
            min-width: 120px;
            padding-right: 12px;
            white-space: nowrap;
            text-align: right;
        }
    }
    .h-widths{
        margin-top: 20px;
    }
    .status1 {
        margin-top: 20px;
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
        .typeMoney {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            // justify-content: space-around;
            padding: 6px 0px;
            >span {
                width: 120px;
                font-size: 18px;
                font-weight: bold;
            }
             >div {
                font-size: 16px;
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
        .demo-refund{
            .refundType{
                >div {
                    >div.el-input{
                        width: 36%;
                        padding-left: 12px;
                    }
                }
            }
        }
        .card {
            margin-top: 20px;
            .demo-refund {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                >div.el-form-item {
                    width: 100%;
                    >div.el-form-item__content{
                        width: 36%;
                    }
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
	.refundcontent {
		.refundinput {
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
			div.card.refundright{
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
    display: flex;
	flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
}

.downlists {
    >li {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }
}   

</style>

<style  lang='scss'>
    .demo-refund {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        >div.el-form-item {
            width: 100%;
            >div.el-form-item__content{
                width: 36%;
            }
        }
    }
    .demo-refund{
        .el-input-number .el-input__inner{
            text-align: left;
        }
    }
</style>

