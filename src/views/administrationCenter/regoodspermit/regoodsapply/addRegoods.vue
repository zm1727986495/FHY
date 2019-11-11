<template>
  <!-- index -->
  <div >
    <div class="addRegoods">
		<!-- 导航栏 -->
		<div class="head_nav">
			<breadcrumb :navList="navList"></breadcrumb>
		</div>
		<!-- 订单详情 -->
		<el-card class="apply_regoods m-bottom" v-if="isAdd">
            <div class="titlecals">选择订单</div>
			<div class="order_info m-top20">
				<div class="order_info_input m-bottom15">
					<el-input class="input_250" v-model="orderNumber" placeholder="订单号" :readonly="true" :size="size"></el-input>
					<el-button type="primary" size="medium" class="reset_btn m-left20" @click="openOrderDia">选择</el-button>
				</div>
                 <!-- 订单的弹框 -->
                <ordercomponent
                    v-if="newcenterDialogVisible" 
                    :centerDialogVisible="newcenterDialogVisible" 
                    @orderclosefun="orderclosefun"
                    :orderId="orderId">
                </ordercomponent>
			</div>
		</el-card>

        <!-- 订单详情 -->
        <orderdetail :orderId="orderId"  ref="orderdetail"></orderdetail>

        <!-- 选择商品 -->
        <!-- <div class="btn_list_1">
            <el-button size="small" class="button-96" @click="addProduct">添加商品</el-button>
        </div> -->
        <!-- <el-card class="apply_regoods m-bottom"> -->
        <el-tabs type="border-card" @tab-click="handleClick" v-model="pageStatus" style="marginTop: 20px;" v-if="isAdd || isEdit">
            <el-tab-pane label="退货商品" name = "0">
                <goodsTable :orderId="orderId" ref="addGoods" @change_payMoney="changePayMoney"></goodsTable>
            </el-tab-pane>
        </el-tabs>
        <!-- </el-card> -->
        <el-card class="apply_regoods m-bottom" style="marginTop: 20px;">
            <el-form :model="regoods" :rules="rules" ref="ruleForm"  class="demo_ruleForm" label-width="140px">
                <el-form-item label="退货退款单号" prop="chargeBackNumber"  v-if="!isAdd">
                    <el-input placeholder="退货退款单号" v-model="regoods.chargeBackNumber" disabled :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="退货退款金额" prop="payMoney">
                    <el-input-number placeholder="退货退款金额/元" :controls="false" v-model="regoods.payMoney" 
                        :disabled="readonly && !isLeadAudit" :precision="2" size="medium" style="max-width: 217px;"></el-input-number>
                </el-form-item>
                <el-form-item label="付款方式" prop="payType" required>
                    <el-select v-model="regoods.payType" placeholder="付款方式" 
                        :size="size" @change="typeChange" :disabled="readonly">
                        <el-option v-for="item in typeList" :key="item.id":label="item.dictName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行信息" prop="customerBankCardId" v-if="regoods.payType == 3221" class="widmax">
                    <div class="bankclass">
                        <el-select v-model="regoods.customerBankCardId" :disabled="readonly" placeholder="银行信息" class="bankselect">
                            <el-option v-for="item in bankInfo" :key="item.customerBankCardId" 
                                :label="item.customerBankCard" :value="item.customerBankCardId" class="optionSelf">
                                <span>用户名: {{ item.accountName }}</span>
                                <span>所属银行: {{ item.openingBankName }}</span>
                                <span>开户行:{{ item.affiliatedBank }}</span>
                                <span>卡号:{{ item.bankCardNumber }}</span>
                            </el-option>
                        </el-select>
                        <div class="newbtn"><el-button type="primary" @click="openDia3" :disabled="readonly" size="medium">新增</el-button></div>
                    </div>
                </el-form-item>
                <el-form-item label="建材城收据号" v-if="regoods.payType == 3224">
                    <el-input placeholder="" size="medium" :disabled="readonly" v-model="regoods.buildingReceiptNumber"></el-input>
                </el-form-item>
                <el-form-item label="上传附件" v-if="regoods.payType == 3224">
                    <div v-if="!isAdd">
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
                <el-form-item label="订单" v-if="regoods.payType == 3222">
                    <el-input v-model="regoods.transferOrderNumber" placeholder="订单" readonly  @focus="transferopenOrderDia"></el-input>
                </el-form-item>
                <el-form-item label="退货退款原因" prop="remark" label-width="140px" class="widmax">
                    <el-input type="textarea" v-model="regoods.remark" :disabled="readonly"></el-input>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 订单详情 || 是否审核 || 下单员标注是否排产-->
		<el-card class="apply_regoods m-bottom" v-if="isDetail || isAudit || orderaudit">
            <goodsTable ref="goodsTable2"></goodsTable>
		</el-card>
        
        <!-- 审批意见 -->
        <auditopinion  v-if="isAudit" ref="auditcomponent"></auditopinion>
        <div v-if="!isDetail">
            <!-- 下单员标注是否排产 -->
            <div class="btn_btn" v-if="orderaudit">
                <el-button type="primary" size="medium" class="reset_btn m-left20" :loading="btnloading" @click="submitOrderFun('ruleForm',1)">确 定</el-button>
                <el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
            </div>

            <!-- 行政审核 -->
            <div class="btn_btn" v-else-if="isAudit">
                <el-button type="primary" size="medium" class="reset_btn m-left20" :loading="btnloading" @click="submitAuditFun('ruleForm',1)">确 定</el-button>
                <el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
            </div>

            <div class="btn_btn" v-else>
                <!-- <el-button type="primary" size="medium" class="reset_btn m-left20"  @click="submitFun('ruleForm',0)">保 存</el-button> -->
                <el-button type="primary" size="medium" class="reset_btn m-left20" :loading="btnloading" @click="submitFun('ruleForm',1)">提 交</el-button>
                <el-button  size="medium" class="reset_btn m-left20"  @click="closeFun">取 消</el-button>
            </div>
        </div>

        <el-dialog title="商品列表"   custom-class="customDialogTitle" :visible.sync="productDialog" width="1024px" top="2vh" class="lvs">
            <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="productList" v-if="productDialog"></select-commodity>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectProductConfirm">确定</el-button>
                <el-button  @click="productDialog = false">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="银行账号"  custom-class="customDialogTitle"  :visible.sync="centerDialogVisible3" width="600px" :before-close="closeDia3">
            <!-- <div class="content_box"> -->
            <el-form :model="editBankCard" :rules="editBankCardRules" ref="editBankCard" label-width="100px" class="demo-ruleForm">
                <el-form-item label="所属银行" prop="openingBank">
                    <el-select v-model="editBankCard.openingBank" filterable placeholder="请选择所属银行">
                        <el-option v-for="item in bankList3" :key="item.id" :label="item.dictName" :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属支行" prop="affiliatedBank">
                    <el-input placeholder="请输入所属支行" v-model="editBankCard.affiliatedBank" maxlength="50"></el-input>
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

        <ordercomponent
            v-if="transferDialogVisible"
            :centerDialogVisible="transferDialogVisible" 
            @orderclosefun="transferclosefun"
            refundType="2"
            :orderRefund="orderId">
        </ordercomponent>
    </div>
  </div>
</template>
<script>
import { put, getBuffer } from "@/utils/pubilcFn";
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "../../../order/components/orderdetail";
import selectCommodity from "@/views/components/selectCommodity";
// import orderdetail from "./components/orderdetail";   //订单详情
import ordercomponent from "@/views/components/ordercomponent";  //选择订单弹框
// import discountapply from "./components/discountapply";   //折扣申请
import goodsTable from "../components/goodsTable";
import auditopinion from "../components/auditopinion"; // 审批意见
import { getUUID } from "src/api/pulicJava";
import spot from '@/assets/images/spot.png';
import {
    insertCustomerBankCard, //客户银行账号_新增
} from "api/customermanagement/myclient/myclient";
import {
    listCustomerBankCardByCustomerId, // 银行信息回显
} from 'api/marketing/refundpermit/index';
import { 
    listOrderCommodity, // 获取订单商品列表接口
    insertOrderChargeBack, // 新增—退货退款接口
    verifyOrderCanBack, // 退货订单验证
    getOrderChargeBack, // 查询退货详情接口
    auditOrderChargeBack,// 退货下单员审核接口
} from '@/api/administrationCenter/regoodspermit/index';

import {
    listBaseDict, orderDetails,
} from 'api/order/order/order';
export default {
    components: {
        breadcrumb,
        pagination,

        ordercomponent,  // 选择订单弹框
        orderdetail, // 订单详情
        selectCommodity, // 商品弹框
        // discountapply, // 折扣申请 
        goodsTable,
        auditopinion, // 审批意见
    },
    // name: 'application',
    data() {
        return {
            btnloading: false,
            buildingSwitch: false,//显示建材城收据号
            spot,   // 操作图片
            navList: [], //头部面包屑
            size: 'medium',
            imgArr1: [],
            fileList1: [],
            urls: "",
            tabList: [], // 表格数据
            pageStatus: '', // tab状态值
            isAdd: false, // 是否是增加页面
            isAudit: false, // 是否是审核页面
            isDetail: false,// 是否是详情页
            isEdit: false, // 是否是编辑页 
            isLeadAudit: false, // 是否是行政部领导审核
            isFirAudit: false, // 是否是行政部一审核
            isSecAudit: false,// 是否是行政部二审核
            orderaudit: false, // 下单员标注是否排产
    
            // 分页
            currentPage: 1, // 当前页数
            pageSize: 20, // 总页数
            total: 0,  // 总条数
            // 选择商品
            productDialog: false,
            productList: {
                selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
                height: "350px", // 设置表格高度 可不传（弹出层最好传下）
                isDialog: true, // 是否为弹出层（不传默认为页面）
            },
            flag: false,
            selectedProducts: [], // 选择商品
            tableData: [], //  // 表格数据
            elsectVal: [], // table表单 勾选属性
            newcenterDialogVisible : false, // 订单弹出框flag
            transferDialogVisible : false, // 转移订单弹出框flag
            orderId: '',
            orderNumber: '',
            readonly: false,// 条件
            // 付款方式
            typeList: [], 
            editBankCard: {
                isDefaultFlag: false,
                isDefault: "", //添加银行卡是否是默认
                customerId: "", //客户id
                storeCustomerId: "", //门店客户id
                accountName: "", //开户名
                openingBank: "", //开户行,
                bankCardNumber: "", //银行卡号
                affiliatedBank: "" //所属银行
            },
            transferOrderId: "",//转移单单号
            centerDialogVisible3: false,
            bankList3: [],
            customerId: "",
            moneys: 0,//金额最大不得超过
            regoods: {	
                chargeBackNumber: '', // 退货退款单号
                payMoney: '', // 退货退款金额
                payType: '', // 付款方式
                customerBankCardId: '', // 银行信息
                remark: '', // 备注
                buildingReceiptNumber: '', // 建材城收据号
                transferOrderNumber: '', // 订单
            },
            bankInfo: [],
            rules: {
                payMoney: [
                    { required: true, message: '请填写退货退款金额', trigger: 'change' }
                ],
                remark: [
                    { required: true, message: '请填写退货退款原因', trigger: 'change' }
                ],
                payType: [
                    { required: true, message: '请选择付款方式', trigger: 'change' }
                ],
            },
            editBankCardRules: {
                openingBank: [
                    { required: true, message: '请选择所属银行', trigger: 'change' },
                ],
                accountName: [
                    { required: true, message: '请输入开户名', trigger: 'blur' }
                ],
                bankCardNumber: [
                    { required: true, message: '请输入银行卡号', trigger: 'blur' }
                ],
                affiliatedBank: [
                    { required: true, message: '请输入所属支行', trigger: 'blur' }
                ]
            },
        };
    },

	created() {
        // 是否是添加页面
        if(this.$route.path == "/regoodspermit/addapplication") {
            this.isAdd = true;
        }
        // 是否是编辑页面
        if(this.$route.path == "/regoodspermit/editapplication") {
            this.isEdit = true;
            this.getOrderChargeBack(); // 回显
        }
        // 是否是查看详情页面
        if(this.$route.path == "/regoodspermit/viewapplication") {
            this.isDetail = true;
            this.readonly = true;
            this.getOrderChargeBack(); // 回显
        }
        // 行政部一审核
        if(this.$route.path == "/regoodspermit/adminfiraudit") {
            this.isAudit = true;
            this.readonly = true;
            this.isFirAudit = true;
            this.getOrderChargeBack(); // 回显
        }
        // 行政部二审核
        if(this.$route.path == "/regoodspermit/adminsecaudit") {
            this.isAudit = true;
            this.readonly = true;
            this.isSecAudit = true;
            this.getOrderChargeBack(); // 回显
        }
        // 行政部领导审核
        if(this.$route.path == "/regoodspermit/adminsleadeaudit") {
            this.isAudit = true;
            this.readonly = true;
            this.isLeadAudit = true;
            this.getOrderChargeBack(); // 回显
        }
        // 下单员标注是否排产
        if(this.$route.path == "/regoodspermit/orderaudit") {
            this.orderaudit = true;
            this.readonly = true;
            this.getOrderChargeBack(); // 回显
        }
        
        let data = {
            dataType: "method_of_refund_application"
        }; 
        listBaseDict(data).then(res=>{
            if(res.status == 200) {
                this.typeList = res.data;
            }
        })
        this.getYinHangFun()

        if(this.isAdd && this.$route.query.orderId){
            this.urlcreate(this.$route.query.orderId)
        }
    },
    watch: {
        customerId(val){
            if(val != ""){
                this.editBankCard.customerId = val
                this.getorderCollectMoneyDetails()
            }
        }
    },
	mounted() {
		// 头部面包屑
        this.navList = this.$route.meta;
    },
    computed: {
        commodityIds() {
            let arr = [];
            this.tableList.forEach(item => {
                arr.push(item.commodityId);
            });
            return arr;
        }
    },
	methods: {
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
        uploadSectionFile1(res) {
            put(res).then(data => {
                this.imgArr1.push(data);
            });
        },
        downPic(item) {
            getBuffer(item.sourceName).then(res => {
                this.urls = res;
            });
        },

        // 付款类型变化的时候
        typeChange(val){
            this.regoods.buildingReceiptNumber = "";//清空建材城收据号
            
        },
        // 回显 （编辑 / 下单员标注是否排产）
        getOrderChargeBack() {
            let data = {
                chargeBackId: this.$route.query.chargeBackId,
            }
            getOrderChargeBack(data).then(res => {
                if(res.status == 200) {
                    this.orderId = res.data.orderId;
                    this.regoods.chargeBackNumber = res.data.chargeBackNumber; //退货单号
                    this.moneys = res.data.payMoney;
                    this.regoods.payMoney = res.data.payMoney; //退货金额
                    this.regoods.payType =  res.data.payType; //退货类型
                    this.regoods.remark =  res.data.remark; //退货原因
                    this.regoods.buildingReceiptNumber =  res.data.buildingReceiptNumber; //清空建材城收据号
                    this.orderNumber = this.$refs.orderdetail.orderNumber;
                    this.customerId = res.data.customerId
                    this.regoods.customerBankCardId = res.data.customerBankCardId; //银行信息
                    this.regoods.transferOrderNumber = res.data.transferOrderNumber; //转移单号
                    this.fileList1 = res.data.companyPisc || [];
                    this.fileList1 = this.fileList1.map(item => {
                        return {
                            ...item,
                            name: item.sourceName,
                            url: item.fileUrl
                        }
                    });
                }
            }).then(err => {
                console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);
            })
        },
        changePayMoney(val) {
            if(this.isAdd){
                this.moneys = val;
                this.regoods.payMoney = val;
            }
        },
        getRowKeys(row) {
            return row.commodityId;
        },
		//弹出订单选择弹框转移订单
		transferopenOrderDia(){
			this.transferDialogVisible = true;
        },
		//弹出订单选择弹框
		openOrderDia(){
			this.newcenterDialogVisible = true;
        },
        transferclosefun(val){
            if(val && val.length > 0){
                this.regoods.transferOrderNumber = val[0].orderNumber;
                this.transferOrderId = val[0].orderId
            }
            this.transferDialogVisible = false;
        },
        urlcreate(orderId){
            orderDetails({orderId: orderId}).then(res => {
				if(res.status == 200) {
                    let val = []
                    val.push(res.data)
                    this.orderclosefun(val)
				}
			}).catch(err => {
                console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
            })
        },
		// 弹出订单选择弹框 -- 确定操作按钮
		orderclosefun(val){
			if(val && val.length > 0){
                // this.verifyOrderCanBack();
                new Promise((resolve, reject) => {
                    verifyOrderCanBack({ orderId: val[0].orderId }).then(res => {
                        if(res.status == 200) {
                            if(res.data == "1") {
                                this.flag = true;
                            }else {
                                this.flag = false;
                                this.$message.warning(res.data);
                            }
                            resolve( this.flag );
                        }
                    }).catch(err => {
                        console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
                    })
                    
                }).then((res)=>{
                    if(res){ // 该订单可进行
                        this.orderId = val[0].orderId;
                        this.orderNumber = val[0].orderNumber;
                        this.editBankCard.customerId = val[0].customerId
                        this.editBankCard.storeCustomerId = val[0].storeCustomerId
                        this.customerId = val[0].customerId
                        this.newcenterDialogVisible = false; // 关闭订单弹框
                    }
                });
            }else{
                this.newcenterDialogVisible = false;
            }
        },
        // 银行信息
        getYinHangFun(){
            let data = {
                dataType: "opening_bank"
            };
            listBaseDict(data).then(res=>{
                this.bankList3 = res.data;
            })
        },
        //关闭添加银行卡页面
        closeDia3() {
            this.centerDialogVisible3 = false;
            // let editBankCardNew = {
            //     isDefaultFlag: false,
            //     isDefault: "", //添加银行卡是否是默认
            //     accountName: "", //开户名
            //     openingBank: "", //开户行,
            //     bankCardNumber: "", //银行卡号
            //     affiliatedBank: "" //所属银行
            // } 
            // Object.assign(this.editBankCard,editBankCardNew);
            this.editBankCard = {
                ...this.editBankCard,
                isDefaultFlag: false,
                isDefault: "", //添加银行卡是否是默认
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
                    // 是否默认
                    this.editBankCard.isDefault = this.editBankCard.isDefaultFlag ? 1 : 0
                    insertCustomerBankCard(this.editBankCard).then(res => {
                        if (res.status == "200") {
                            this.$message.success("添加银行账号信息成功");
                            this.centerDialogVisible3 = false;
                            this.getorderCollectMoneyDetails(1); // 重新请求银行信息
                        } else {
                            this.$message.error("添加银行账号信息失败");
                        }
                    }).catch(error => {
                        console.log("添加银行卡  customermanagementmyclientindex");
                    });
                }
            });
        },
        //弹出添加添加银行卡页面
        openDia3() {
            if(this.editBankCard.customerId == ""){
                this.$message.warning("请选择订单");
            }else{
                this.centerDialogVisible3 = true
            }
        },
        // 银行信息
        getorderCollectMoneyDetails(val) { // 传过来的customerId
            listCustomerBankCardByCustomerId({customerId: this.editBankCard.customerId}).then(res => {
                if (res.status == 200) {
                    this.bankInfo = res.data;
                    this.bankInfo = this.bankInfo.map(item => {
                        item.customerBankCard = `用户名:${item.accountName} 所属银行: ${ item.openingBankName } 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber}`;
                        return item;
                    });
                    if(val && val == 1){
                        this.regoods.customerBankCardId = this.bankInfo[0].customerBankCardId
                    }
                }
            }).catch(err => {
                console.log("仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue",err);
            });
        },
        // 退货订单验证
        verifyOrderCanBack(orderId){
            let data = {
                orderId: orderId,
            }
            verifyOrderCanBack(data).then(res => {
				if(res.status == 200) {
                    if(res.data == "1") {
                        this.flag = true;
                    }else {
                        this.flag = false;
                        this.$message.warning(res.data);
                    }
				}
			}).catch(err => {
                console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
            })
        },
        // 点击添加商品
        addProduct() {
            if (this.elsectVal.length > 0) {
                this.$message({
                    message: "请勿选择商品",
                    type: "warning"
                });
                return;
            }
            this.productDialog = true;
            this.productList.selectedCommodities = this.commodityIds;
        },
        // 选择商品的确定操作按钮
        selectProductConfirm() {
			getUUID({ serialNumber: 'DO' }).then(res => {
				if(res.status == 200) {
					this.taskDutyNumber = res.data;
					this.submission();
				}
			}).catch(err => {
				console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
			})
            if (this.selectedProducts.length) {
                // let arr = [];
                this.selectedProducts.forEach(item => {
                    // arr.push({
                    //     commodityId: item.commodityId,
                    //     organizationId: this.formInline.organizationId
                    // });
                });

            } else {
                this.$message.warning("请选择商品");
            }
        },
        // 选择商品 复选框
        selectionChange(val) {
            this.selectedProducts = val;
        },
		//关闭订单选择弹框
		orderdiaClose(){
			this.orderdia_vis = false;
		},
		//确认选择订单
		selOrderid(val){
			this.orderdia_vis = false;
			this.id = val;
		},
        // 单页条数改变
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.getList();
        },
        // 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            // let data = this.searchdatas();
            this.getList();
        },
        // 提交
        submitFun(formName,type) {
            if( this.$refs.addGoods.elsectVal.length < 1 ) {
                this.$message.warning("请选择退货商品");
                return;
            }
            if(this.regoods.payMoney == "" || this.regoods.payMoney < 0){
                this.$message.warning("退货金额输入有误");
                return;
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.regoods.payType == 3221 && this.regoods.customerBankCardId == ""){
                        this.$message.warning("请选择银行信息");
                        return;
                    }
                    if(this.regoods.payType == 3224 && this.regoods.buildingReceiptNumber == ""){
                        this.$message.warning("请填写建材城收据号");
                        return;
                    }
                    // if(this.regoods.payType == 3224 && this.imgArr1.length == 0) {
                    //     this.$message.warning("请上传附件");
                    //     return;
                    // }
                    if(this.regoods.payType == 3222 && this.transferOrderId == ""){
                        this.$message.warning("请选择内部转账单");
                        return;
                    }
                    if(this.regoods.remark == ""){
                        this.$message.warning("请输入退货退款原因");
                        return;
                    }
                    this.btnloading = true;
                    let orderCommodities = this.$refs.addGoods.elsectVal.map(item => {
                        return {
                            orderCommodityId: item.orderCommodityId,
                            amount: item.chargeBackNum,
                            isGroup: 0,   //是否组套
                        }
                    })
                    let data = {
                        orderId: this.orderId,   //退货订单
                        payMoney: this.regoods.payMoney,  // 退货金额
                        payType: this.regoods.payType,   // 付款方式
                        remark: this.regoods.remark, //备注
                        isSubmit: type,   // 0、保存，1、提交
                        orderCommodities, //退货商品列表
                        // orderCommodities: [{ //退货商品列表
                        //     orderCommodityId: 1,//商品ID
                        //     amount: 1,   //退货数量
                        //     isGroup: 0   //是否组套
                        // }]
                    }

                    if(this.regoods.payType == 3221){//银行信息
                        data.customerBankCardId = this.regoods.customerBankCardId
                    }
                    if(this.regoods.payType == 3224){//建材城收据号
                        data.buildingReceiptNumber = this.regoods.buildingReceiptNumber
                        let companyPisc = this.imgArr1.map(file => {
                            return {
                                fileUrl: file.url,
                                sourceName: file.name
                            };
                        });
                        data.companyPisc = companyPisc;
                    }
                    if(this.regoods.payType == 3222){//转移单号
                        data.transferOrderId = this.transferOrderId
                    }
                    console.log(data);
                    if(this.isAdd) { // 新增
                        getUUID({ serialNumber: 'RT' }).then(res => {
                            if(res.status == 200) {
                                data.orderNumber = res.data; //退货单号
                                insertOrderChargeBack(data).then(res => {
                                    if(res.status == 200) {
                                        this.$message.success("操作成功");
                                        this.$router.push("/regoodspermit/regoodsapply");
                                    }else{
                                        this.$message.error(res.message);
                                    }
                                    this.btnloading = false;
                                }).catch(err => {
                                    this.btnloading = false;
                                    console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
                                })
                            }
                        })
                    }else if(this.isEdit) { // 编辑
                        data.chargeBackId = this.$route.query.chargeBackId;

                        insertOrderChargeBack(data).then(res => {
                            if(res.status == 200) {
                                this.$message.success("操作成功");
                                this.$router.push("/regoodspermit/regoodsapply");
                            }else{
                                this.$message.error(res.message);
                            }
                            this.btnloading = false;
                        }).catch(err => {
                            this.btnloading = false;
                            console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
                        })
                    }
                } else {
                    return false;
                }
            });
        },
        closeFun() {
            this.$router.go(-1);
        },
        // 下单员标注是否排产
        submitOrderFun(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // if( this.$refs.addGoods.elsectVal.length < 1 ) {
                    //     this.$message.warning("请选择退货商品");
                    //     return;
                    // }
                    let flag = this.$refs.goodsTable2.tabList.map(item => {   
                        if(item.productionStatus == 1 || item.productionStatus == 0){//是否排产，1排产，0未排产
                            return true;
                        }else {
                            return false;
                        }     
                    })

                    if(!flag) { // 每一个都选择了排产状态
                        this.$message.warning("请选择排产状态");
                        return;
                    }
                    this.btnloading = true;
                    let orderCommodities = this.$refs.goodsTable2.tabList.map(item => {
                        return {
                            orderCommodityId: item.orderCommodityId, //商品ID
                            productionStatus: item.productionStatus, //是否排产，1排产，0未排产
                            // isGroup: 0,   //是否组套
                        }
                    })
                    let data = {
                        chargeBackId: this.$route.query.chargeBackId, //退货ID
                        auditType: 2, //审核类型，1行政，2下单员
                        chargeBackOrderId: this.orderId, //退货订单ID
                        auditOpinion: "",//审核意见
                        orderCommodities, 
                        storeId: this.$refs.orderdetail.detaildata.storeId
                        // orderCommodities: [{//退货商品详情
                        //     orderCommodityId: 1,//商品ID
                        //     productionStatus: 1//是否排产，1排产，0未排产
                        // }],
                    }
                    auditOrderChargeBack(data).then(res => {
                        if(res.status == 200) {
                            this.$message.success("操作成功");
                            this.$router.push("/regoodspermit/regoodsorder");
                        }else{
                            this.$message.error(res.message);
                        }
                        this.btnloading = false;
                    }).catch(err => {
                        this.btnloading = false;
                        console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
                    })
                } else {
                    return false;
                }
            });
        },

        // 行政审核页的审核
        submitAuditFun() {
            let vals = this.$refs.auditcomponent.audit
            if(vals.auditStatus == ""){
                this.$message.warning("请选择审批结果");
                return;
            }
            // 领导审核的时候选择领导人
            if(vals.auditStatus == 3 && vals.userId == "") {
                this.$message.warning("请选择领导人");
                return;
            }
            this.btnloading = true;
            // auditStatus 操作状态 1通过 2拒绝 3退回上一步
            let data = {
                chargeBackId: this.$route.query.chargeBackId, //退货ID
                auditType: 1, //审核类型，1行政，2下单员
                auditStatus: vals.auditStatus,//审核结果
                userId: vals.userId,//领导ID
                auditOpinion: vals.auditOpinion,//审核意见
                // chargeBackOrderId: this.orderId, //退货订单ID
                // storeId: this.$refs.orderdetail.detaildata.storeId
                // orderCommodities: [{//退货商品详情
                //     orderCommodityId: 1,//商品ID
                //     productionStatus: 1//是否排产，1排产，0未排产
                // }],
            }
            if(vals.auditStatus == 2){
                data.payMoney = this.regoods.payMoney;//金额
            }
            console.log(data);
            // return false
            if(vals.auditStatus == 2){
                getUUID({serialNumber: 'AE'}).then(res => {
                    if(res.status == 200) {
                        data.applyCode = res.data;
                        // return false
                        auditOrderChargeBack(data).then(res => {
                            if(res.status == 200) {
                                this.$message.success("操作成功");
                                // this.$router.push("/regoodspermit/regoodsadmin");
                                this.$router.go(-1)
                            }else{
                                this.$message.error(res.message);
                            }
                            this.btnloading = false;
                        }).catch(err => {
                            this.btnloading = false;
                            console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
                        })
                    }
                }).catch(err => {
                    console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
                })
            }else{
                auditOrderChargeBack(data).then(res => {
                    if(res.status == 200) {
                        this.$message.success("操作成功");
                        this.$router.go(-1)
                    }else{
                        this.$message.error(res.message);
                    }
                    this.btnloading = false;
                }).catch(err => {
                    this.btnloading = false;
                    console.log('退货管理:新增退货 administrationCenter/regoodspermit/regoodsapply/addRegoods.vue', err);	
                })
            }
        },
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
        // 获取表格数据
		getList(){
            let data = {
                page: this.currentPage,
                limit: this.pageSize,
            }
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tabList = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
		//tab切换
		handleClick(tab) {
			this.status = tab.name
			console.log(tab.name);
        },
        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
	}
};
</script>
<style scoped lang='scss'>
.addRegoods{
    .titlecals{
        top: 0;
    }
    .apply_regoods{
        position: relative;
        .gift_title_btom{
            // border-bottom: 1px solid rgb(151, 150, 150);
            padding-bottom: 8px;
            width: 250px;
            .status {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 14px;
                color: #999;
                white-space: nowrap;
                .statusContent {
                    font-size: 14px;
                    color:#FF9900;
                }
            }
        }
    .order_info{
        .input_250{
        width: 250px;
        }
        .order_info_input{
        margin-left: 2.5%;
        }
    }  
    }
    .btn_btn {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }

    .demo_ruleForm{
        margin-right: 40px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        >div{
            width: 45%;
        }
        .widmax{
            width: 100%;
        }
        .bankclass{
            width: 100%;
            display: flex;
            align-items: center;
            .bankselect{
                flex: 1;
            }
            .newbtn{
                text-align: right;
                width: 100px;
            }
        }
    }
}
</style>
<style lang="scss">
.apply_regoods {
    .el-input-number .el-input__inner {
        text-align: left;
    }
}
</style>

