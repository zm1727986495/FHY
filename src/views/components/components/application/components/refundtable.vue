<template>
<!-- 退款的Table -->
    <div class="refunddetail">
        <div class="iconBox m-bottom">
            <i class="Icon"></i>
            <span>订单详情</span>
        </div>

        <div class="refundtable">
            <!-- <div class="priPrice">
                <div class="title">
                    <span>价格策略：</span>
                    <span>2019年售价</span>
                </div>
                <div class="activity">
                    <span>参加活动：</span>
                    <span>欧派厨房嗨购节</span>
                    <span>活动详情</span>
                </div>
            </div> -->

            <!-- <div class="subtitle">
                <span>商品清单</span>
            </div> -->
            <!-- table表格 -->
            <!-- <div class="table_list lvs attribute">
                <el-table
                    border
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    :data="tabList"
                    style="width: 100%;">
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column
                        prop="name"
                        label="商品编号"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="商品名称"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="商品型号"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="优惠"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="商品原价"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="活动价"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="颜色"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="材质"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="系列"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="商品分类"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="供应商"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="计价方式"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="宽"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="高"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="深"
                        sortable align="center">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="数量"
                        sortable align="center">
                    </el-table-column>

                </el-table>   
            </div> -->

            <!-- 分页 -->
            <!-- <div class="pagination_wrap">
                <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                </pagination>
            </div> -->

            <!-- 整单优惠 -->
            <!-- <div class="discount">
                <div class="subtitle">
                    <span>整单优惠</span>
                </div>
                <div class="content">
                    <div class="disdetail">
                        <span class="full">
                            <span>满:</span> 
                            <span>12,000</span>
                        </span>
                        <span class="minus">
                            <span>减:</span> 
                            <span>200</span>
                        </span>
                        <span class="add">
                            <span>加:</span> 
                            <span>800</span>
                        </span>
                    </div>
                    <div class="refunddetails">
                        <div class="refundbox">
                            <div class="list">
                                <div class="listleft">
                                    <ul class="refundlsit">
                                        <li>商品编号</li>
                                        <li>1010119000001</li>
                                        <li>商品型号</li>
                                        <li>xxxxddd</li>
                                        <li>供应商</li>
                                        <li>广州欧派</li>
                                    </ul>

                                    <ul class="refundlsit">
                                        <li>商品名称</li>
                                        <li>吊柜</li>
                                        <li>商品分类</li>
                                        <li>XXXX>XXXX>XXXX</li>
                                        <li></li>
                                        <li></li> -->
                                        <!-- <el-tooltip class="item" effect="dark" content="超期定责巴啦啦" placement="top">
                                            <li>超期定责巴啦啦</li>
                                        </el-tooltip> -->
                                    <!-- </ul>
                                </div>

                                <div class="listleft">
                                    <ul class="refundlsit goodssale">
                                        <li>商品售价</li>
                                        <li>320,000</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <ul class="refundlsit">
                                <li>颜色</li>
                                <li>红</li>
                                <li>材质</li>
                                <li>实木</li>
                                <li>系列</li>
                                <li>经典</li>
                                <li>系列</li>
                                <li>经典</li>
                                <li>数量</li>
                                <li>1</li> -->
                                <!-- <el-tooltip class="item" effect="dark" content="超期定责巴啦啦" placement="top">
                                    <li>超期定责巴啦啦</li>
                                </el-tooltip> -->
                            <!-- </ul>

                            <ul class="refundlsit">
                                <li>计价方式</li>
                                <li>宽*高</li>
                                <li>宽</li>
                                <li>1</li>
                                <li>高</li>
                                <li>1</li>
                                <li>深</li>
                                <li>1</li>
                                <li>非标系数</li>
                                <li>1.000</li>
                                <li>折扣率</li>
                                <li>1.00</li>
                            </ul>

                            <ul class="refundlsit">
                                <li>备注</li>
                                <el-tooltip class="item" effect="dark" content="hasakiodsafew4tgfeqhrsjmthnzdvaseffaeae3serfthrhtrhtr" placement="top-start">
                                    <li>hasakiodsafew4tgfeqhrsjmthnzdvaseffaeae3serfthrhtrhtr</li>
                                </el-tooltip>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> -->

            <!-- 订单金额 -->
            <div class="ordermoney">
                <div class="subtitle">
                    <span>订单金额</span>
                </div>
                <!-- <div class="content" >
                    <div class="disdetail">
                        <span class="contmoney">
                            <span>合同金额:</span> 
                            <span>12,389</span>
                        </span>
                        <span class="realmoney">
                            <span>实收金额:</span> 
                            <span>12，250</span>
                            <span>元</span>
                        </span>
                        <span class="repmoney">
                            <span>代金券金额:</span> 
                            <span>100</span>
                            <span>元</span>
                        </span>
                    </div>
                </div> -->
            </div>

            <!-- 折扣详情 -->
            <div class="discountrate">
                <el-form :model="formDiscount" :rules="rules" ref="ruleForm" label-width="120px" class="demo-discdetail">
                    <el-form-item label="退款方式" prop="refundType" class="refundType">
                        <el-select v-model="formDiscount.refundType" placeholder="请选择退款方式" :disabled="readonly">
                            <el-option
                                v-for="item in typeList" :key="item.id"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                    
                    <el-form-item label="上传附件" v-if="formDiscount.refundType == 3224">
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
                    </el-form-item>
                     
                    <el-form-item label="银行信息" prop="customerBankCardId" v-if="formDiscount.refundType == 3221">
                        <el-select v-model="formDiscount.customerBankCardId" placeholder="银行信息" :disabled="readonly">
                            <el-option
                                v-for="item in bankInfo"
                                :key="item.customerBankCardId"
                                :label="item.customerBankCard"
                                :value="item.customerBankCardId"
                                class="optionSelf"
                            >
                                <span>用户名: {{ item.accountName }}</span>
                                <span>开户行:{{ item.openingBankName }}</span>
                                <span>卡号:{{ item.bankCardNumber }}</span>
                            </el-option>
                            <!-- 用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber} -->
                        </el-select>
                        <el-button type="primary" @click="openDia3">新增</el-button>
                    </el-form-item>
                    <el-form-item label="订单"  prop="orderNumber" v-if="formDiscount.refundType == 3222">
                        <el-input v-model="formDiscount.orderNumber" placeholder="订单" :readonly="true" @focus="openOrderDia"></el-input>
                    </el-form-item>

                    <!-- discountRate -->
                    <!-- <el-form-item label="原折扣率" prop="discountRate"> 
                        <el-input-number class="width-100" placeholder="原折扣率/折" :disabled="true" :controls="false" v-model="formDiscount.discountRate" :precision="1" :min="0.1" size="medium"></el-input-number>
                    </el-form-item> -->
                    <el-form-item label="退折扣率" prop="discount">
                         <!-- :precision="1" -->
                        <el-input-number class="width-84" placeholder="退折扣率/折" :disabled="readonly" :controls="false" step-strictly v-model="formDiscount.discount" :min="0" :max="10" size="medium"></el-input-number>
                        <span>/折</span>
                    </el-form-item>
                    <el-form-item label="退折扣金额" prop="refundMoney">
                        <el-input-number class="width-100" placeholder="退折扣金额/元" :disabled="readonly" :controls="false" v-model="formDiscount.refundMoney" :precision="2" :min="0" size="medium" :max="collectMoney"></el-input-number>
                    </el-form-item>
                    <el-form-item label="退折扣原因" prop="refundReason">
                        <el-input type="textarea" v-model="formDiscount.refundReason" placeholder="退折扣原因" :readonly="readonly"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 订单的弹框 -->
				<ordercomponent
					v-if="newcenterDialogVisible"
					:centerDialogVisible="newcenterDialogVisible" 
					@orderclosefun="orderclosefun"
					:orderId="formDiscount.orderId">
				</ordercomponent>

                <!-- 新增银行信息弹框页面 -->
                <div class="dialog_con_box">
                    <el-dialog  title="银行账号"  custom-class="customDialogTitle"  :visible.sync="centerDialogVisible3" width="40%" :before-close="closeDia3">
                        <!-- <div class="content_box"> -->
                            <el-form :model="editBankCard" :rules="editBankCardRules" ref="editBankCard" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="开户行" prop="openingBank">
                                    <el-select v-model="editBankCard.openingBank" placeholder="请选择银行">
                                        <el-option v-for="item in bankList3" :key="item.id" :label="item.dictName" :value="item.id"
                                        ></el-option>
                                    </el-select>
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

        </div>
        
    </div>
</template>

<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import ordercomponent from "@/views/components/ordercomponent";  //选择订单弹框

import { put, getBuffer } from "@/utils/pubilcFn";
import {
    listBaseDict,
} from 'api/order/order/order';
import {
    insertCustomerBankCard, //客户银行账号_新增
} from "api/customermanagement/myclient/myclient";

import {
    orderCollectMoneyDetails, // 客户银行信息表
} from "api/entrepotSet/compensationmanage/index";

import {
    listCustomerBankCardByCustomerId, // 银行信息回显
} from 'api/marketing/refundpermit/index';
export default {
    components: {
        pagination,
        ordercomponent, // 选择订单弹出框
    },
   
    data() {
        return {
             // 上传
            fileList: [],
            imgArr: [],
            delImgArr: [],
            // 订单
            newcenterDialogVisible: false, // 选择订单flag


            // 新增银行信息弹框
            centerDialogVisible3: false,
            bankList3: [],
            editBankCard: {
                isDefaultFlag: false,
                isDefault: "", //添加银行卡是否是默认
                customerId: "", //客户id
                accountName: "", //开户名
                openingBank: "", //开户行,
                bankCardNumber: "" //银行卡号
            },

            //  表格
            elsectVal:[],//选中框
            tabList:[],//table数据
            formDiscount: {
                refundType: '', // 退款方式
                orderNumber: '', // 订单号
                orderId: '', // 订单id
                customerBankCardId: '', // 银行信息
                discountRate: this.discountRate, // 原折扣率
                discount: '', //  现折扣率
                refundMoney: '', //  退折扣金额
                refundReason: '', //  退折扣原因
            },
            readonly: false,// 是否只读
            typeList: [{ // 退款方式
                label: '现金',value: '1',
            },{
                label: '转账',value: '2',
            },{
                label: '内部转账',value: '3',
            },{
                label: '商场退款',value: '4',
            },{
                label: '建材城退款',value: '5',
            }],
            rules: {
                discountRate: [
                    { message: '请输入原折扣率', trigger: 'blur' },
                ],
                discount: [
                    { required: true, message: '请输入现折扣率', trigger: 'blur' },
                ],
                refundMoney: [
                    { required: true, message: '请输入退折扣金额', trigger: 'blur' },
                ],
                refundReason: [
                    { required: true, message: '请输入退折扣原因',trigger: 'blur'}, 
                ]
            },
            bankInfo: {}, // 银行信息
            editBankCardRules: {
                openingBank: [
                    { required: true, message: '请选择开户行', trigger: 'change' },
                ],
                accountName: [
                    { required: true, message: '请输入开户名', trigger: 'blur' }
                ],
                bankCardNumber: [
                    { required: true, message: '请输入银行卡号', trigger: 'blur' }
                ],
            },
            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//总页数
            total: 0,//总条数
        };
    },
    props: ["discountRate","customerId","collectMoney","storeCustomerId"],
    mounted() {
        
    },
    
    created() {
		let data = {
			page: this.currentPage,
			limit: this.pageSize,
		};
        this.getList(data);
        if(this.$route.path == "/refundpermit/auditmanagement") { // 审批页
            this.readonly = true;
        }
        //字典获取 退款申请退款方式
        this.listBaseDict(); 
        // 所有银行信息获取
        this.getYinHangFun('opening_bank');
    },
    watch: {
        customerId(val) {
            
            this.getorderCollectMoneyDetails();
        },
    },
    methods: {
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
                bankCardNumber: "" //银行卡号
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
                        this.getorderCollectMoneyDetails(); // 重新请求银行信息
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

        // 银行信息
        getorderCollectMoneyDetails() { // 回显过来的customerId
            let data = {
                customerId: this.customerId,
            };

            listCustomerBankCardByCustomerId(data).then(res => {
                if (res.status == 200) {
                    this.bankInfo = res.data.rows;

                    this.bankInfo = this.bankInfo.map(item => {
                        item.customerBankCard = `用户名:${item.accountName} 开户行:${item.openingBankName} 卡号: ${item.bankCardNumber}`;
                        return item;
                    });

                
                }
            }).catch(err => {
                console.log("仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue",err);
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
				this.formDiscount.orderId = val[0].orderId;
                this.formDiscount.orderNumber = val[0].orderNumber;
                this.formDiscount.storeCustomerId = val[0].storeCustomerId; // 门店客户id
				this.newcenterDialogVisible = false;
            }else{
                this.newcenterDialogVisible = false;
            }
        },
        //弹出订单选择弹框
		openOrderDia(){
			this.newcenterDialogVisible = true;
			// this.orderdia_vis = true;
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

       // 搜索条件获取
        searchdatas(){
            return {
                // names: this.names, 
                // searchData: this.searchData[0], 
                // dutyReason: this.dutyReason[0],
                // dutyType: this.dutyType[0], 
                // goodsSource: this.goodsSource[0],
		
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
        
        
		
		// 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.pageSize = val;
            let data = this.searchdatas();
            this.getList(data);
		},

        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
		},

        // 表格勾选函数回调
		handleSelectionChange(val) {
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
        
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },

    },
  };
</script>

<style lang="scss" scoped>
    .width-84 {
        width: 84%;
    }
    .refunddetail {
        .refundtable {
            .subtitle{
                margin: 20px;
                position: relative;
                span{
                    font-size: 20px;
                }
                &::before{
                    display: block;
                    content: "";
                    position: absolute;
                    bottom: -6px;
                    left: 0px;
                    width: 120px;
                    height: 2px;
                    background: red;
                }
            }
            .disdetail{
                display: flex;
                flex-wrap: nowrap;
                align-items: center;    
                >span {
                    font-size: 16px;
                    padding-left: 24px;
                    span:nth-of-type(2) {
                        color: #006ec6;
                        font-weight: bold;
                    }
                    &.minus{
                        span:nth-of-type(2) {
                            color: red;
                            font-weight: bold;
                        }
                    }
                    &:nth-of-type(n+2) {
                        padding-left: 12px;
                    }
                    &.realmoney{
                        span:nth-of-type(2) {
                            color: #006ec6;
                            font-weight: bold;
                        }
                    }
                    &.repmoney{
                        span:nth-of-type(2) {
                            color: red;
                            font-weight: bold;
                        }
                    }
                }
                
            }
            .priPrice {
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-around;
                align-items: center;
                font-size: 16px;
                .title {
                    span:nth-of-type(even){
                        color: #006ec6;
                        font-weight: bold;
                    }
                }
                .activity {
                    span:nth-of-type(2){
                        color: red;
                        font-weight: bold;
                    }
                    span:nth-of-type(3){
                        padding-left: 12px;
                        color: #006ec6;
                        font-weight: bold;
                    }
                }
            }
            .discount{
                .content{
                    .disdetail{
                        display: flex;
                        flex-wrap: nowrap;
                        align-items: center;    
                        >span {
                            font-size: 16px;
                            padding-left: 24px;
                            span:nth-of-type(2) {
                                color: #006ec6;
                                font-weight: bold;
                            }
                            &.minus{
                                span:nth-of-type(2) {
                                    color: red;
                                    font-weight: bold;
                                }
                            }
                            &:nth-of-type(n+2) {
                                padding-left: 12px;
                            }
                        }
                        
                    }
                }
            }
            .discountrate{
                margin-top: 20px;
                .demo-discdetail {
                    >div {
                        >div{
                            width: 32%;
                        }
                    }
                }
            }
            .refunddetails{
                margin-top: 20px;
                width: 100%;
                border-radius: 2px;
                .refundbox{
                    width: 100%;
                    font-size: 14px;
                    border-top: 1px solid #e4e4e4;
                    border-left: 1px solid #e4e4e4;
                    .list {
                        display: flex;
                        flex-wrap: nowrap;
                        align-items: center;
                        justify-content: center;
                        .listleft:nth-of-type(1) {
                            flex:1;
                        }
                        .listleft:nth-of-type(2) {
                            width: 240px;
                            height: 62px;
                            ul.refundlsit.goodssale{
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                li{
                                    height: 100%;
                                    align-items: center;
                                    display: flex;
                                    &:nth-of-type(1) {
                                        width: 80px;
                                    }
                                }
                                
                            }
                        }
                    }
                    .refundlsit{
                        display: flex;
                        li{
                            padding: 0px 10px;
                            display: flex;
                            align-items: center;
                            border-right: 1px solid #e4e4e4;
                            border-bottom: 1px solid #e4e4e4;
                            line-height: 2.2;
                            &:nth-child(odd){
                                width: 120px;
                                text-align: center;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                overflow: hidden;
                            }
                            &:nth-child(even){
                                flex: 1;
                                color: #999;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                display: block;
                            }
                        }
                    }
                }
            } 
        }
            
    }
</style>


<style lang="scss">
    .discountrate{
        margin-top: 20px;
        .demo-discdetail {
            margin: 20px;
            >div {
                >div{
                    width: 32%;
                }
            }
        }
        .el-input-number .el-input__inner{
            text-align: left;
        }
    }
</style>


