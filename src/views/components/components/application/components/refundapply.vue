<template>
  <!-- 退款申请 -->
	<div class="refundapply">
        <div class="selType">
            <span>退款类型:</span>
            <el-select v-model="refund.refundMode"  placeholder="" size="medium" :disabled="readonly" @change="modeChange">
                <el-option
                    v-for="item in refundList" :key="item.value"
                    :label="item.label" :value="item.value" :disabled="item.disabled">
                </el-option>
            </el-select>
        </div>
        <div class="h-widths"></div>
        <div class="status1">
            <div class="allMoney" >
                <div  v-if="refund.refundMode == 1 || refund.refundMode == 2">
                    <span>可退金额:</span>
                    <span style="color:red">{{orderMoney.refundableAmount}}元</span>
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
                <div>
                    <span>已退金额:</span>
                    <span style="color:red">{{orderMoney.refundMoney}}元</span>
                </div>
            </div>
            <div class="h-width"></div>
            <div>
                <el-form :model="refund" :rules="ruleForm" ref="refund" label-width="120px" class="demo-refund1" label-position="right">
                    <el-form-item label="退折扣率" prop="discount"  v-if="refund.refundMode == 3" :rules="{required: true, message: '不能为空', trigger: 'change'}" class="widmax">
                        <el-input-number class="numclass" placeholder="退折扣率/折" :disabled="readonly"
                            :controls="false" :precision="1" v-model="refund.discount" :min="0" :max="10" size="medium"></el-input-number>
                        <span>/折</span>
                    </el-form-item>
                    <el-form-item :label="refund.refundMode == 3 ? '退折扣金额' : '实际退款金额'" prop="refundMoney" class="widmax">
                        <el-input-number :disabled="readonly || disabrefundMoney" @input="refundModeFn" class="numclass" placeholder="实际退款金额/元"
                            :controls="false" v-model="refund.refundMoney" :precision="2" :min="0" size="medium"></el-input-number>
                    </el-form-item>
                    <el-form-item label="退款方式" prop="refundType">
                        <el-select v-model="refund.refundType" placeholder="请选择退款方式"
                        class="refunclass" :disabled="readonly" @change="typeChange">
                            <el-option v-for="item in typeList" :key="item.id"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="内部收据号" required v-if="insideSwitch">
                        <el-input placeholder="" size="medium" :disabled="readonly" v-model="refund.receiptNumber" class="refunclass"></el-input>
                    </el-form-item> -->
                    <el-form-item label="建材城收据号" required v-if="buildingSwitch">
                        <el-input placeholder="" size="medium" :disabled="readonly" v-model="refund.buildingReceiptNumber" class="refunclass"></el-input>
                    </el-form-item>
                    <el-form-item label="上传附件" v-if="refund.refundType == 3224">
                        <div  v-if="isAudit  || isView">
                            <ul class="el-upload-list el-upload-list--text downlists">
                                <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList1" :key="index">
                                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i> {{item.name}}</a>
                                    <a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
                                </li>
                            </ul>
                        </div>
                        <el-upload v-else list-type="text" class="upload-demo" action="string" :http-request="uploadSectionFile1" :file-list="fileList1" :on-remove="handleRemove1">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item> 
                    <el-form-item label="银行信息" prop="customerBankCardId" v-if="refund.refundType == 3221" class="widmax">
                        <div class="bankclass">
                            <el-select v-model="refund.customerBankCardId" placeholder="银行信息" :disabled="readonly" class="bankselect">
                                <el-option v-for="item in bankInfo" :key="item.customerBankCardId" 
                                    :label="item.customerBankCard" :value="item.customerBankCardId" class="optionSelf">
                                    <span>用户名: {{ item.accountName }}</span>
                                    <span>所属银行: {{ item.openingBankName }}</span>
                                    <span>开户行:{{ item.affiliatedBank }}</span>
                                    <span>卡号:{{ item.bankCardNumber }}</span>
                                </el-option>
                            </el-select>
                            <div class="newbtn"><el-button type="primary" @click="openDia3" :disabled="readonly">新增</el-button></div>
                        </div>
                    </el-form-item>
                    <el-form-item label="订单"  prop="transferOrderNumber" v-if="refund.refundType == 3222" 
                        :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                        <el-input v-model="refund.transferOrderNumber" placeholder="订单" :readonly="true" @focus="openOrderDia"></el-input>
                    </el-form-item>
                
                    <el-form-item :label="refund.refundMode == 3 ? '退折扣原因' : '退款原因'" class="widmax" prop="refundReason">
                        <el-input type="textarea" v-model="refund.refundReason" :readonly="readonly"></el-input>
                    </el-form-item>

                </el-form>
            </div>
        </div>

        <!-- 订单的弹框--退款订单申请列表2 -->
				<ordercomponent
					v-if="newcenterDialogVisible"
					:centerDialogVisible="newcenterDialogVisible" 
					@orderclosefun="orderclosefun"
                    refundType="2"
                    :orderRefund="orderId"
					:orderId="refund.transferOrderId">
				</ordercomponent>

                <!-- 新增银行信息弹框页面 -->
                <div class="dialog_con_box">
                    <el-dialog  title="银行账号"  custom-class="customDialogTitle"  :visible.sync="centerDialogVisible3" width="40%" :before-close="closeDia3">
                        <!-- <div class="content_box"> -->
                            <el-form :model="editBankCard" :rules="editBankCardRules" ref="editBankCard" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="所属银行" prop="openingBank">
                                    <el-select v-model="editBankCard.openingBank" filterable placeholder="请选择所属银行">
                                        <el-option v-for="item in bankList3" :key="item.id" :label="item.dictName" :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="开户行" prop="affiliatedBank">
                                   <el-input placeholder="请输入开户行" v-model="editBankCard.affiliatedBank" maxlength="50"></el-input>
                                </el-form-item>
                                <el-form-item label="开户名" prop="accountName">
                                    <el-input placeholder="请输入开户名" v-model="editBankCard.accountName" maxlength="50"></el-input>
                                </el-form-item>
                                <el-form-item label="银行卡号" prop="bankCardNumber">
                                    <el-input placeholder="请输入银行卡号" v-model="editBankCard.bankCardNumber" maxlength="50"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="isDefaultFlag">
                                    <el-checkbox v-model="editBankCard.isDefaultFlag" value="false">是否默认</el-checkbox>
                                </el-form-item>
                            </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="addBankCard('editBankCard')">确认</el-button>
                            <el-button @click="closeDia3">取消</el-button>
                        </span>
                    </el-dialog>
                </div>
		
        <!-- <div class="status1"  v-if="refund.refundMode == 3"> -->
            <!-- 折扣退款时的table -->
           <!-- <refundtable :discountRate="orderMoney.discountRate" ref="refundtable" :customerId="customerId" :storeCustomerId="storeCustomerId" :collectMoney="orderMoney.collectMoney"></refundtable> -->
        <!-- </div> -->

        <!-- 附件管理 -->
        <!-- <el-form-item label="上传附件" class="input_100" prop="referrerName" label-width="120px"> -->
            <div  v-if="isAudit  || isView">
                <div class="iconBox m-bottom" v-if="fileList && fileList.length != 0">
					<i class="Icon"></i>
					<span>附件管理</span>
				</div>
                <ul class="el-upload-list el-upload-list--text downlists" v-if="fileList && fileList.length != 0">
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

        <!-- </el-form-item> -->

		<div  class="refundcontent">
			<!-- <div class="refundinput"></div> -->

            <!-- 审批意见组件 -->
            <auditopinion v-if="isAudit" ref="auditcomponent" :orderId="orderId"></auditopinion>


            <div class="btn_btn" v-if="isAudit">
				<el-button type="primary" size="medium" class="reset_btn m-left20" @click="auditFun('refund')"  :loading="btnLoading">审 核</el-button>
				<!-- <el-button type="primary" size="medium" class="reset_btn m-left20" @click="rebackFun" :loading="btnLoading2">退 回</el-button> -->
				<el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
			</div>

			<div class="btn_btn" v-else>
                <el-button type="primary" size="medium" class="reset_btn m-left20" @click="applyFun('refund')" :loading="btnLoading"  v-if="!isView">申 请</el-button>
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
import ordercomponent from "@/views/components/ordercomponent";  //选择订单弹框
import { getUUID } from "api/pulicJava";
import { getHomeCompany } from '@/api/receivablesrun/clientcollection/index'
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
    listCustomerBankCardByCustomerId, // 银行信息回显
} from 'api/marketing/refundpermit/index';
import {
    listBaseDict,
} from 'api/order/order/order';

import {
    insertCustomerBankCard, //客户银行账号_新增
} from "api/customermanagement/myclient/myclient";

export default {
  components: {
    breadcrumb,
    pagination,
    refundtable,
    auditopinion,
    ordercomponent,
  },
  props: ["orderId","storeCustomerId"],
  // name: 'brandmanagement',
  data() {
    return {
        disabrefundMoney: false,
        btnLoading: false, // 按钮的loading Flag
        btnLoading2: false, // 退回按钮的loading Flag
        // 订单
        newcenterDialogVisible: false, // 选择订单flag
        applyCode: '', // UUId
        customerId: '', // 客户id
        orderMoney: {
            refundableAmount: '',
            collectMoney: 0, // 可退金额
            contractMoney: '', // 合同金额
            shopCashCouponAmount: '', // 代金券金额
        }, // 几个金额
        
        // insideSwitch: false, // 是否显示内部收据号
        buildingSwitch: false, // 是否显示建材城收据号
        isAdd: false, // 是否是新增页
        isAudit: false, // 是否是审核页
        isEdit: false, // 是否是编辑页
        isView: false, // 是否是详情页

        readonly: false,// 是否只看
        // 条件
        refundList: [{ // 退款类型 1退款 2 退单退款 3折扣退款  2删掉了
            label: '退款',value: 1,
        },{ 
            label: '退单',value: 2,
        },{
            label: '退折扣',value: 3,
        },
        {
            label: '退货退款',value: 4, disabled: true
        }
        ], 
        typeList: [],
        bankInfo: {}, // 银行信息
        collectMoneyName: '', // 收款单号
		 // 上传
        fileList: [],
        imgArr: [],
        delImgArr: [],

        // 上传1
        fileList1: [],
        imgArr1: [],
        delImgArr1: [],

        // 新增银行信息弹框
        centerDialogVisible3: false,
        bankList3: [],
        editBankCard: {
            isDefaultFlag: false,
            isDefault: "", //添加银行卡是否是默认
            customerId: "", //客户id
            accountName: "", //开户名
            openingBank: "", //开户行,
            bankCardNumber: "", //银行卡号
            affiliatedBank: "" //所属银行
        },

        orderApplyRefundId: '',
        collectType: '', // 内部转账时收款类型 1预付款 2合同款
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
            customerBankCardId: [
                { required: true, message: '请选择银行信息', trigger: 'change' }
            ],
            refundReason: [
                { required: true, message: '请输入描述',trigger: 'blur'}, 
            ]
        },
        editBankCardRules: {
            openingBank: [
                { required: true, message: '请选择所属银行', trigger: 'change' },
            ],
            affiliatedBank: [
                { required: true, message: '请输入开户行', trigger: 'blur' }
            ],
            accountName: [
            	{ required: true, message: '请输入开户名', trigger: 'blur' }
            ],
            bankCardNumber: [
                { required: true, message: '请输入银行卡号', trigger: 'blur' }
            ],
        },
        numChange: 1,
        urls: "",
        refund: { // 退款申请，选择 退款 的退款方式出现的input
            refundMode:  1 , // 上面的退款方式 -- 需监听
            transferOrderNumber: '', // 订单号
            transferOrderId: '', // 订单id
            // money : '', // 上面的退款方式 -- 需监听
            // type2: '', // 内容的退款方式
			// desc: '', // 其他说明
            reason: '' , // reason
            refundMoney: '' , //   实际退款金额
            refundType: '' , //  退款方式 
            buildingReceiptNumber: '' , //建材城收据号 
            // receiptNumber: '' , //内部收据号 
            refundReason: '' , 
            customerBankCardId: "", // 银行信息
            storeCustomerId: '', // 门店客户id
            transferOrderNumber: '', // 
            storeId: '', // 门店id
        },
        editMoney: '', // 审批或编辑实际退款金额或者退折扣金额
    };
  },
    computed: {
        limitMoney() {
            if(this.refund.refundType == 3225) { // 家装
                return Infinity;
            }else {
                return Number(this.orderMoney.refundableAmount);
            }
        }
    },
    watch: {  
        // orderId(val) {
        //     this.orderId = val;
        //     this.getOrderCollectMoney();
        //     console.log(val,"orderId 在退款申请的watch");
        // },
        orderId: function(val,attr) {
            // this.orderId = attr;
            if(this.isEdit || this.isAudit || this.isView) {
                new Promise((resolve, reject) => {
                    let data = {
                        orderId: this.orderId ? this.orderId : '',
                    };
                    // contractMoney 合同金额     collectMoney 实收金额    refundMoney 可退金额  ownCashCouponAmount  代金券金额
                    getOrderCollectMoney(data).then(res => {
                        if(res.status == 200) {
                            this.orderMoney = res.data;
                            this.orderMoney.contractMoney =  res.data.contractMoney; // 合同金额
                            this.orderMoney.collectMoney = res.data.collectMoney; // 实收金额
                            this.orderMoney.refundableAmount = res.data.refundableAmount; // 可退金额
                            this.orderMoney.ownCashCouponAmount =  res.data.ownCashCouponAmount; // 代金券金额
                            
                            // this.orderMoney.collectMoney = res.data.collectMoney;
                            this.customerId = res.data.customerId;
                            resolve( this.orderMoney.collectMoney );
                        }
                    }).catch(err =>{
                        console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
                    })
                    
                }).then((res)=>{
                    this.refund.refundMoney = this.editMoney;
                });
            }else {
                this.getOrderCollectMoney();
            }
        },
        customerId(val) {
            // this.customerId = val;
            this.getorderCollectMoneyDetails();
        },
        // dictName: "现金", id: 3220
        // dictName: "转账", id: 3221
        // dictName: "内部转账", id: 3222
        // dictName: "特殊转账", id: 3223
        // dictName: "建材城退款", id: 3224
        // dictName: "家装退款", id: 3225
        // 'refund.refundType'(val) { // 收款方式
        //     if(val == 3220) { // 现金
        //         // 转账
        //         this.refund.customerBankCardId = ''; // 清空银行信息

        //         // 内部转账
        //         this.refund.transferOrderNumber = ''; // 清空订单number
        //         this.refund.transferOrderId = ''; // 清空订单Id
        //         // 建材城收款
        //         this.fileList1 = [];

        //     }else if(val == 3221) { // 转账
                
        //         this.refund.transferOrderNumber = ''; // 清空订单number
        //         this.refund.transferOrderId = ''; // 清空订单Id
        //         this.fileList1 = [];
        //     }else if(val == 3222) { // 内部转账
        //         this.refund.customerBankCardId = ''; // 清空银行信息
        //         this.fileList1 = [];
        //     }else if(val == 3223) { // 特殊转账
        //         this.refund.customerBankCardId = ''; // 清空银行信息
        //         this.refund.transferOrderNumber = ''; // 清空订单number
        //         this.refund.transferOrderId = ''; // 清空订单Id
        //         this.fileList1 = [];
        //     }else if(val == 3224) { // 建材城退款
        //         this.refund.customerBankCardId = ''; // 清空银行信息
        //         this.refund.transferOrderNumber = ''; // 清空订单number
        //         this.refund.transferOrderId = ''; // 清空订单Id
        //     }else if(val == 3225) { // 家装退款
        //         this.refund.customerBankCardId = ''; // 清空银行信息
        //         this.refund.transferOrderNumber = ''; // 清空订单number
        //         this.refund.transferOrderId = ''; // 清空订单Id
        //         this.fileList1 = [];
        //     }
        // },
    },
    created() {
        
        if(this.$route.path == "/refundpermit/auditmanagement") { // 审批页
            this.isAudit = true;

            this.readonly = true;
            this.getOrderReturnMoney(); // 回显审批页信息
            this.getOrderCollectMoney(); // 四个金额
        }
        if(this.$route.path == "/refundpermit/viewapplication" || this.$route.path == "/refundpermit/viewauditapplication") { // 详情页
            this.isView = true;

            this.readonly = true;
            this.getOrderReturnMoney(); // 回显审批页信息
            this.getOrderCollectMoney(); // 四个金额
        }
        

        if(this.$route.path == "/refundpermit/addapplication") { // 新增页
            this.isAdd = true;

            if(this.$route.query.orderId) {
                this.orderId = this.$route.query.orderId;
                this.getOrderCollectMoney(); // 四个金额
            }
            console.log(this.$route.query.orderId,"this.$route.query.orderId");
            
        }

        if(this.$route.path == "/refundpermit/editapplication"){ // 编辑页
            this.isEdit = true;

            this.getOrderReturnMoney(); // 回显编辑页信息
            this.getOrderCollectMoney(); // 四个金额
        }
        //字典获取 退款申请退款方式
        this.listBaseDict(); 
        // 所有银行信息获取
        this.getYinHangFun('opening_bank');
    },
    methods: {
        refundModeFn(){
            if(this.refund.refundMode == 2){
                console.log(this.refund.refundMoney > this.orderMoney.refundableAmount);
                if(this.refund.refundMoney > this.orderMoney.refundableAmount 　&& Number(this.orderMoney.refundableAmount) != 0){
                    this.$nextTick(()=>{
                        this.refund.refundMoney = this.orderMoney.refundableAmount;
                    })
                }
            }
        },
        // 退款类型发生变化时触发的函数
        modeChange() {
            if(this.isAdd) {
                this.refund.transferOrderNumber = '';// 订单号
                this.refund.transferOrderId = '';// 订单id
                this.refund.reason = '' ;// reason
                this.refund.refundMoney = '' ;//   实际退款金额
                this.refund.refundType = '' ;//  退款方式 
                this.refund.refundReason = '' ;
                this.refund.customerBankCardId = "";// 银行信息
                this.refund.storeCustomerId = '';// 门店客户id
                this.refund.transferOrderNumber = '';// 
                this.refund.storeId = '';// 门店id
                
                this.imgArr = [];
                this.imgArr1 = [];
                this.delImgArr = [];
                this.delImgArr1 = [];
            }else if(this.isEdit || this.isAudit || this.isView) {
                console.log(this.numChange,"this.numChange 退款类型发生变化触发的函数");
                this.refund.transferOrderNumber = '';// 订单号
                this.refund.transferOrderId = '';// 订单id
                this.refund.reason = '' ;// reason
                this.refund.refundMoney = '' ;//   实际退款金额
                this.refund.refundType = '' ;//  退款方式 
                this.refund.refundReason = '' ;
                this.refund.customerBankCardId = "";// 银行信息
                this.refund.storeCustomerId = '';// 门店客户id
                this.refund.transferOrderNumber = '';// 
                this.refund.storeId = '';// 门店id
                
                
                this.imgArr = [];
                this.imgArr1 = [];
                this.delImgArr = [];
                this.delImgArr1 = [];
                
                // if(this.numChange != 1) {
                //     this.refund.transferOrderNumber = '';// 订单号
                //     this.refund.transferOrderId = '';// 订单id
                //     this.refund.reason = '' ;// reason
                //     this.refund.refundMoney = '' ;//   实际退款金额
                //     this.refund.refundType = '' ;//  退款方式 
                //     this.refund.refundReason = '' ;
                //     this.refund.customerBankCardId = "";// 银行信息
                //     this.refund.storeCustomerId = '';// 门店客户id
                //     this.refund.transferOrderNumber = '';// 
                //     this.refund.storeId = '';// 门店id
                    
                    
                //     this.imgArr = [];
                //     this.imgArr1 = [];
                //     this.delImgArr = [];
                //     this.delImgArr1 = [];
                // }
            }
            this.numChange += 1;

            if(this.refund.refundMode == 2 && Number(this.orderMoney.refundableAmount) != 0){
                this.refund.refundMoney = this.orderMoney.refundableAmount
                this.disabrefundMoney = true
            }else{
                this.disabrefundMoney = false
            }
        },
        // 退款方式改变时触发的函数
        typeChange(val) {
            // if(!this.refund.transferOrderId) {
            //     this.$message.warning("请选择订单");
            //     return;
            // }
            console.log("退款方式改变时触发的函数");
            
            // this.refund.receiptNumber = "";//清空内部收据号
            // this.insideSwitch = false;//显示内部收据号
            this.refund.buildingReceiptNumber = "";//清空建材城收据号
            this.buildingSwitch = false;//显示建材城收据号
            // if(val == 3220 || val == 3221){
            //     this.insideSwitch = true;
            // }else 
            if(val == 3224){
                this.buildingSwitch = true;
            }

            if(val == 3221) { // 转账
                // 内部转账
                this.refund.transferOrderNumber = ''; // 清空订单number
                this.refund.transferOrderId = ''; // 清空订单Id
                // 建材城收款
                this.fileList1 = [];
            }else if(val == 3222) { // 内部转账
                // 转账
                this.refund.customerBankCardId = ''; // 清空银行信息
                // 建材城收款
                this.fileList1 = [];
            }else if(val == 3224) { // 建材城退款
                // 转账
                this.refund.customerBankCardId = ''; // 清空银行信息
                // 内部转账
                this.refund.transferOrderNumber = ''; // 清空订单number
                this.refund.transferOrderId = ''; // 清空订单Id
            }else {
                // 转账
                this.refund.customerBankCardId = ''; // 清空银行信息
                // 内部转账
                this.refund.transferOrderNumber = ''; // 清空订单number
                this.refund.transferOrderId = ''; // 清空订单Id
                // 建材城收款
                this.fileList1 = [];
            }
            if(val==3225){
                getHomeCompany({
                    orderId:this.orderId
                }).then(res=>{
                    if(res.data){
                        
                    }else{
                        this.refund.refundType = null;
                        this.$message({
                            message: '当前订单没有申请通过',
                            type: 'warning'
                        })
                    }
                  })
            }
        },
        // 银行信息
        getYinHangFun(typeName){
            let data = {
                dataType: typeName
            };
            listBaseDict(data).then(res=>{
                this.bankList3 = res.data;
            })
        },
        //弹出添加添加银行卡页面
        openDia3() {
            (this.dialogTitle = "添加银行"), (this.centerDialogVisible3 = true);
        },

        //关闭添加银行卡页面
        closeDia3() {
            (this.dialogTitle = "添加银行"), (this.centerDialogVisible3 = false);
            this.editBankCard = {
                isDefaultFlag: false,
                isDefault: "", //添加银行卡是否是默认
                customerId: "", //客户id
                accountName: "", //开户名
                openingBank: "", //开户行,
                bankCardNumber: "", //银行卡号
                affiliatedBank: "" //所属银行
                
            };
        },
    //点击添加银行卡的提交   提交银行卡信息   id=202599&customerId=324292
    addBankCard(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.editBankCard.customerId = this.customerId;
              // this.editBankCard.storeCustomerId = this.userInfo.storeCustomerId;
      
              if (this.editBankCard.isDefaultFlag) {
                  this.editBankCard.isDefault = 1;
              } else {
                  this.editBankCard.isDefault = 0;
              }
              console.log(this.editBankCard);

              let data = this.editBankCard;
              data.storeCustomerId = this.storeCustomerId;

              insertCustomerBankCard(data)
              .then(res => {
                  if (res.status == "200") {
                      this.$message.success("添加银行账号信息成功");
                      this.centerDialogVisible3 = false;
                      this.editBankCard.customerId = "";
                      this.editBankCard.accountName = "";
                      this.editBankCard.openingBank = "";
                      this.editBankCard.bankCardNumber = "";
                      this.editBankCard.affiliatedBank = "";

                      this.getorderCollectMoneyDetails(1); // 重新请求银行信息
                      this.editBankCard.isDefaultFlag = false;
                  } else {
                      this.$message.error("添加银行账号信息失败");
                  }
              })
              .catch(error => {
                  console.error(
                  "添加银行卡  customermanagementmyclientindex",
                  error
                  );
              });

          } else {
            return false;
          }
        });
    },


        //字典获取 退款申请退款方式
        listBaseDict(){
            let data = {
                dataType: "method_of_refund_application"
            }; 
            listBaseDict(data).then(res=>{
                if(res.status == 200) {
                    this.typeList = res.data;
                }
            })
        },
         // 订单
        orderclosefun(val){
			if(val && val.length > 0){
				this.refund.transferOrderId = val[0].orderId;
                this.refund.transferOrderNumber = val[0].orderNumber;
                this.refund.storeCustomerId = val[0].storeCustomerId; // 门店客户id
                this.refund.storeId = val[0].storeId; // 门店id

                if(val[0].paymentAmount == 0) {
                    this.collectType = 1; // 内部转账时收款类型 1预付款 2合同款
                }else {
                    this.collectType = 2; // 内部转账时收款类型 1预付款 2合同款
                }

                // let query = {
                //     serialNumber: 'MC',
                // }
                // getUUID(query).then(res => {
                //     if(res.status == 200) {
                //         this.collectMoneyName = res.data; // 收款单号
                    
                //     }
                // }).catch(err => {
                    //     console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
                // })

                 this.newcenterDialogVisible = false;

            }else{
                this.newcenterDialogVisible = false;
            }
        },
        //弹出订单选择弹框
		openOrderDia(){
            if(this.isAudit || this.isView) {
                return;
            }

            if(!this.orderId) {
                this.$message.warning("请选择订单");
                return;
            }
			this.newcenterDialogVisible = true;
			// this.orderdia_vis = true;
		},
        // getorderCollectMoneyDetails(customerId) { // 子组件带过来的customerId
        //     this.customerId = customerId;

        //     let data = {
        //         customerId
        //     };

        //     orderCollectMoneyDetails(data)
        //         .then(res => {
        //             if (res.status == 200) {
        //                 this.bankInfo = res.data.rows;

        //                 this.bankInfo = this.bankInfo.map(item => {
        //                     item.customerBankCard = `用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber}`;
        //                     return item;
        //                 });
        //             }
        //         })
        //         .catch(err => {
        //             console.log(
        //                 "仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue",
        //                 err
        //             );
        //         });
        // },

        // 获取订单退款信息回显
        getOrderReturnMoney() {
            let data = {
                orderApplyId: this.$route.query.orderApplyId,
            };

            getOrderReturnMoney(data).then(res => {
                if(res.status == 200) {
                    this.refund = res.data;
                    console.log(this.refund,this.refund.refundMoney,"refundMoneyfasdf");
                    this.refund.refundMoney = this.refund.refundMoney;

                    if(this.isEdit){
                        this.orderMoney.refundableAmount = this.orderMoney.refundableAmount + this.refund.refundMoney; // 可退金额
                        this.orderMoney.refundMoney = this.orderMoney.refundMoney - this.refund.refundMoney;//已退金额
                    }

                    this.editMoney = this.refund.refundMoney;

                    // this.orderMoney = res.data;
                    this.refund.refundMode = res.data.refundMode;
                    this.refund.refundType = Number(res.data.refundType);
                    let refundType =res.data.refundType
                    // if(refundType == 3220 || refundType == 3221){
                    //     this.insideSwitch = true;
                    //     this.refund.receiptNumber = res.data.receiptNumber
                    // }else 
                    if(refundType == 3224){
                        this.buildingSwitch = true;
                        this.refund.buildingReceiptNumber = res.data.buildingReceiptNumber
                    }
                    // this.orderId = res.data.orderId;
                    this.fileList = res.data.pics;
                    this.fileList = this.fileList.map(item => {
                        return {
                            ...item,
                            name: item.sourceName,
                            url: item.fileUrl
                        }
                    });
                    this.fileList1 = res.data.companyPisc;
                    this.fileList1 = this.fileList1.map(item => {
                        return {
                            ...item,
                            name: item.sourceName,
                            url: item.fileUrl
                        }
                    });
                    console.log(this.fileList1,"this.fileList1");
                    
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
            // contractMoney 合同金额     collectMoney 实收金额    refundableAmount 可退金额  ownCashCouponAmount  代金券金额
            getOrderCollectMoney(data).then(res => {
                if(res.status == 200) {
                    this.orderMoney = res.data;
                    this.orderMoney.contractMoney =  res.data.contractMoney; // 合同金额
                    this.orderMoney.collectMoney = res.data.collectMoney; // 实收金额
                    this.orderMoney.refundableAmount = res.data.refundableAmount; // 可退金额
                    this.orderMoney.ownCashCouponAmount =  res.data.ownCashCouponAmount; // 代金券金额
                    if(this.isEdit){
                        this.orderMoney.refundableAmount = this.orderMoney.refundableAmount + this.refund.refundMoney; // 可退金额
                        this.orderMoney.refundMoney = this.orderMoney.refundMoney - this.refund.refundMoney;//已退金额
                    }
                    // this.orderMoney.collectMoney = res.data.collectMoney;
                    this.customerId = res.data.customerId;
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 获取订单收款信息 marketing/components/application/components/refundapply.vue', err);
            })
        },
        getUUID1(item) {
            return new Promise((resolve, reject) => {
                getUUID({serialNumber: item}).then(res => { // 收款单号
                    resolve(res.data)
                }).catch(err => {
                    console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
                })
            })
        },
        setDatas(item){
                examineOrderApply(item).then(res => {
                    if(res.status == 200) {
                        this.$message.success("操作成功");
                        this.btnLoading = false;
                        this.btnLoading2 = false;
                        this.$router.push("/refundpermit/refundaudit");
                        resolve(res.data)
                    }
                }).catch(err =>{
                    this.btnLoading = false;
                    this.btnLoading2 = false;
                    console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
                })
        },

        // 审核
        auditFun() {
            // 拒绝或者退回的时候审批意见必填
            if((this.$refs.auditcomponent.audit.operationStatus == 2 || this.$refs.auditcomponent.audit.operationStatus == 3) && !this.$refs.auditcomponent.audit.rejectionReasons) { // 如果是驳回
                this.$message.warning("请填写审批意见");
                return;
            }
            if(this.$refs.auditcomponent.audit.operationStatus == ""){
                this.$message.warning("请选择审核状态!");
                return;
             };

            this.btnLoading = true;
            this.btnLoading2 = true;
            let operationStatus = 0;
            // operationStatus 操作状态 1通过 2拒绝 3退回上一步
            if(this.$refs.auditcomponent.audit.operationStatus == 1) { // 同意
               operationStatus = 1;
            }else if(this.$refs.auditcomponent.audit.operationStatus == 2) { // 拒绝
               operationStatus = 2;
            }else if(this.$refs.auditcomponent.audit.operationStatus == 3) { // 驳回
               operationStatus = 3;
            }
            
            let datas = {    
                workFlowBusinessId: this.$route.query.workFlowBusinessId, //  业务工作流程ID    
                dataSourceId: this.$route.query.orderApplyId, //    业务流程ID  
                operationStatus: operationStatus, //     操作状态 1通过 2拒绝 3退回上一步  
                rejectionReasons: this.$refs.auditcomponent.audit.rejectionReasons, //    驳回原因
                collectMoneyName:'',
                paymentNumber:''
            }
            // const p1 = new Promise(resolve => {
            //     getUUID({serialNumber: 'MC'}).then(res => { // 收款单号
            //         resolve(res.data)
            //     }).catch(err => {
            //         console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
            //     })
            // });

            // const p2 = new Promise(resolve => {
            //     getUUID({serialNumber: 'PY'}).then(res => { // 收款单号
            //         resolve(res.data)
            //     }).catch(err => {
            //         console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
            //     })
            // });

            getUUID({serialNumber: 'MC'}).then(res => { // 收款单号
                if(res.status == 200) {
                    datas.collectMoneyName = res.data; // 收款单号
                    getUUID({serialNumber: 'PY'}).then(res => { // 收款单号
                        if(res.status == 200) {
                            datas.paymentNumber = res.data;  // 收款单号  
                            examineOrderApply(datas).then(res => {
                                if(res.status == 200) {
                                    this.$message.success("操作成功");
                                    this.btnLoading = false;
                                    this.btnLoading2 = false;
                                    this.$router.push("/refundpermit/refundaudit");
                                    // resolve(res.data)
                                }
                            }).catch(err =>{
                                this.btnLoading = false;
                                this.btnLoading2 = false;
                                console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
                            })
                        }
                    }).catch(err => {
                        console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
                    })
                }
            }).catch(err => {
                console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
            })
            
            // Promise.all([ p1, p2 ]).then(res => {
            //     datas.collectMoneyName = res[0].data; // 收款单号
            //     datas.paymentNumber = res[1].data;  // 收款单号  

            //     examineOrderApply(datas).then(res => {
            //         if(res.status == 200) {
            //             this.$message.success("操作成功");
            //             this.btnLoading = false;
            //             this.btnLoading2 = false;
            //             this.$router.push("/refundpermit/refundaudit");
            //             // resolve(res.data)
            //         }
            //     }).catch(err =>{
            //         this.btnLoading = false;
            //         this.btnLoading2 = false;
            //         console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
            //     })
            // });

            // this.getUUID1('MC').then(res=>{datas.collectMoneyName = res; }); // 收款单号
            // this.getUUID1('PY').then(res=>{datas.paymentNumber = res; this.setDatas(datas)}); // 收款单号        
        },
        // 退回
        rebackFun() {
            this.btnLoading = true;
            this.btnLoading2 = true;
            let data = {
                workFlowBusinessId: this.$route.query.workFlowBusinessId, //  业务工作流程ID    
                dataSourceId: this.$route.query.orderApplyId, //    业务流程ID  
                operationStatus: 3, //     操作状态 1通过 2拒绝 3退回上一步  
                rejectionReasons: this.$refs.auditcomponent.audit.rejectionReasons, //    驳回原因
            }

            examineOrderApply(data).then(res => {
                if(res.status == 200) {
                    this.$message.success("操作成功");
                    this.btnLoading = false;
                    this.btnLoading2 = false;
                    this.$router.push("/refundpermit/refundapply");
                }
            }).catch(err =>{
                this.btnLoading = false;
                this.btnLoading2 = false;
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
            }else if(this.refund.refundType == 3224) {
                // if(this.imgArr1 && this.imgArr1.length == 0) {
                //     this.$message.warning("请上传附件");
                //     return;
                // }
                if(this.refund.buildingReceiptNumber == ""){
                    this.$message.warning("请输入建材城收据号");
                    return;
                }
                // if(this.refund.refundType == 3220 || this.refund.refundType == 3221) {
                //     if(this.refund.receiptNumber == ""){
                //         this.$message.warning("请输入内部收据号");
                //         return;
                //     }
                // }else 
            }else if(this.refund.refundType == 3222 && this.refund.transferOrderId == "") {
                this.$message.warning("请选择内部转账单");
                return;
            }else if(Number(this.refund.refundMoney) == 0){
                this.$message.warning("退款金额不得为0");
                return;
            }
            
            if(this.refund.refundMode != 3 && this.refund.refundMode != 4 && this.refund.refundType != 3225){
                if(this.refund.refundMoney > Number(this.orderMoney.refundableAmount)) { // 输入的可退金额 > 最大可退金额
                    this.$message.warning("可退金额已超出正常范围，请重新输入");
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
                    this.btnLoading = true;
                    // applyType 申请类型 1折扣特批 2工期特批 3返点 4开票 5退款 6退货退款 7换货 8退折扣 9家装代收合同 ,
                    let data = {
                        orderId: this.orderId, // 订单ID
                        refundType: this.refund.refundType, // 退款方式 1现金 2转账 3内部转账
                        refundMode: this.refund.refundMode, //退款类型 1退款 2 退单退款 3折扣退款  4退货退款
                        
                        refundMoney: this.refund.refundMoney, // 退折扣金额 or 实际退款金额
                        refundReason: this.refund.refundReason,// 退款原因 or 退折扣原因
                        pisc,

                    }
                    if(this.refund.refundType == 3221) { // 银行信息
                        data.customerBankCardId = this.refund.customerBankCardId; // 客户银行卡id 
                    }
                    
                    // if(this.refund.refundType == 3220 || this.refund.refundType == 3221){
                    //     data.receiptNumber = this.refund.receiptNumber
                    //     data.buildingReceiptNumber = null
                    // }else 
                    if(this.refund.refundType == 3224){
                        data.receiptNumber = null
                        data.buildingReceiptNumber = this.refund.buildingReceiptNumber
                    }

                    if(this.refund.refundType == 3222) { // 退款类型是退款并且是内部转账(选择订单)
                        data.transferOrderId = this.refund.transferOrderId;
                        data.storeCustomerId = this.refund.storeCustomerId; // 门店客户id
                        data.customerId = this.customerId;
                        // data.transferOrderNumber = this.refund.transferOrderNumber; // 内部转账订单编号
                        // data.collectMoneyName  = this.collectMoneyName; // 收款单号
                        // data.storeId = this.refund.storeId; // 门店id
                        // data.collectType = this.collectType; // 内部转账时收款类型 1预付款 2合同款
                    }

                    if(this.refund.refundType == 3224) { // 退款类型是退款并且是建材城的退款方式
                        let companyPisc = this.imgArr1.map(file => {
                            return {fileUrl: file.url, sourceName: file.name};
                        });
                        data.companyPisc = companyPisc;
                    }
                    // if(this.refund.refundMode == 3 && this.$refs.refundtable.refund.refundType == 3222) { // 退款类型是退款并且是内部转账
                    //     data.transferOrderId = this.$refs.refundtable.refund.transferOrderId;
                    // }
                    if(this.refund.refundMode == 3 ) { // 退折扣率/折
                        data.discount = this.refund.discount;
                    }
                    if(this.isEdit) {
                        data.orderApplyId = this.$route.query.orderApplyId; // 区分编辑和新增
                        if ( this.delImgArr.length > 0) {
                            //有删除旧图片
                            console.log("有删除旧图片",this.delImgArr);
                            this.delImgArr.forEach(item => {
                                removeAccessoryImg(item).then(res => {});
                            });
                        }
                        if ( this.delImgArr1.length > 0) {
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
                        // 建材城
                        this.imgArr1.forEach(item => {
                            if (!item.accessoryId) {
                                let data = {
                                    dataSourceId: this.orderApplyRefundId,
                                    sourceName: item.name,
                                    fileUrl: item.url,
                                    dataSourceEnum: "OrderApplyRefundCompany"
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
                        let query = {
                            serialNumber: 'AE',
                        }
                        getUUID(query).then(res => {
                            if(res.status == 200) {
                                data.applyCode = res.data;
                                
                                addOrderApply(data).then(res => {
                                    if(res.status == 200) {
                                        this.$message.success("操作成功");
                                        this.btnLoading = false;
                                        this.$router.push("/refundpermit/refundapply");
                                    }
                                }).catch(err =>{
                                    this.btnLoading = false;
                                    console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);
                                })
                            }
                        }).catch(err => {
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
            this.$router.go(-1);
            // if(this.$router.path == "/refundpermit/addapplication" || this.$router.path == "/refundpermit/editapplication" || this.$router.path == "/refundpermit/viewapplication") { // 申请页面的新增 编辑 详情
            //     this.$router.push("/refundpermit/refundapply");
            // }else if(this.$router.path == "/refundpermit/auditmanagement" || this.$router.path == "/refundpermit/viewauditapplication") { // 审核页面的 审核和详情
            //     this.$router.push("/refundpermit/refundaudit")
            // }
        },
        // 银行信息
        getorderCollectMoneyDetails(val) { // 传过来的customerId
            let data = {
                customerId: this.customerId,
            };

            listCustomerBankCardByCustomerId(data).then(res => {
                if (res.status == 200) {
                    this.bankInfo = res.data;

                    this.bankInfo = this.bankInfo.map(item => {
                        item.customerBankCard = `用户名:${item.accountName} 所属银行: ${ item.openingBankName } 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber}`;
                        return item;
                    });
                    if(val && val == 1){
                        this.refund.customerBankCardId = this.bankInfo[0].customerBankCardId
                    }
                }
            }).catch(err => {
                console.log("仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue",err);
            });
        },
        // 文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile1(res) {
            put(res).then(data => {
                this.imgArr1.push(data);
            });
        },

        // 文件删除操作
        handleRemove1(file, fileList) {
            console.log(file,"file 52252");
            
            if (file.accessoryId) {
                //console.log("旧图片删除");
                let delobj = {
                    accessoryId: file.accessoryId,
                    dataSourceId: file.dataSourceId,
                    dataSourceEnum: file.dataSourceEnum
                };
                this.delImgArr1.push(delobj);
            } else {
                //console.log("新增图片删除");
                
                let lengs = String(file.raw.uid).length;
                this.imgArr1 = this.imgArr1.filter(item => {
                let str = item.name.substring(0, lengs);
                    return str !== String(file.raw.uid);
                });
            }
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
        .demo-refund1{
            display: flex;
            flex-wrap: wrap;
            >div{
                width: 45%;
            }
            .numclass{
                max-width: 100px;
            }
            .refunclass{
                max-width: 200px;
            }
            .widmax{
                width: 100%;
                .bankclass{
                    width: 100%;
                    display: flex;
                    .bankselect{
                        flex: 1;
                    }
                    .newbtn{
                        text-align: right;
                        width: 80px;
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
                >div {
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

<style lang='scss'>
.refundapply{

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
}
</style>

