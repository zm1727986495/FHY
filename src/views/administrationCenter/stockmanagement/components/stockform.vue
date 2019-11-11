<template>
    <!-- 备货的Form -->
    <div class="stockform">
        <div class="purchasefrom list_top">

            <el-form
                :model="purchase" :label-position="labelPosition"
                ref="ruleForm"
                class="demo-form-inline"
                :rules="rules"
                label-width="140px"
            >
                <el-form-item :label="stockLabel.applyCode" class="search_item" v-if="isNum" prop="applyCode" style="marginLeft: 0px;">
                    <el-input
                        v-model="purchase.applyCode"
                        :placeholder="stockLabel.applyCode"
                        :size="size"
                        :readonly="true"
                    ></el-input>
                </el-form-item>

                <!-- 采购机构 -->
                <!-- <el-form-item  v-if="isPurchase"
                    :label="stockLabel.applyOrganizationId"
                    class="search_item"
                    prop="applyOrganizationId"
                >
                    <el-input
                        v-model="purchase.applyOrganizationId"
                        :placeholder="stockLabel.applyOrganizationId"
                        size="medium"
                        :readonly="true"
                    ></el-input>
                </el-form-item> -->
                <!-- 采购人 -->
                <!-- <el-form-item
                    :label="stockLabel.applyUserId"
                    class="search_item"
                    prop="applyUserId"
                >
                    <el-input
                        v-model="purchase.applyUserId"
                        :placeholder="stockLabel.applyUserId"
                        size="medium"
                        :readonly="true"
                    ></el-input>
                </el-form-item> -->
                <!-- <li class="search_item">
                    <el-date-picker
                        size="medium" v-model="scrapDate" type="datetime" 
                        format= "yyyy-MM-dd hh:mm" value-format='yyyy-MM-dd hh:mm'
                        range-separator="-"
                        placeholder="年/月/日 时/分">
                    </el-date-picker>
                </li> -->

                <el-form-item label="预计到货日期" class="search_item" prop="predictArrivalTime">
                    <el-date-picker   :size="size"
                        class="width-100"
                        v-model="purchase.predictArrivalTime"
                        type="date"
                        value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        placeholder="预计到货日期 年/月/日"
                        :readonly="readonly"
                    ></el-date-picker>
                </el-form-item>

                <el-form-item label="品牌" :class='[isPurchase ? "search_item purchaseWidth" : "search_item"]' prop="brandId">
                    <el-select  filterable  :size="size" @change="brandChange"
                        v-model="purchase.brandId"
                        placeholder="品牌"
                        :disabled="readonly" 
                    >
                        <el-option
                            v-for="item in brandList"
                            :label="item.brandName"
                            :value="item.brandId"
                            :key="item.brandId"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="品类" class="search_item" prop="commodityCategoryId">
                    <el-select filterable 
                        v-model="purchase.commodityCategoryId"  @change="commodityChange"
                        placeholder="品类"
                        :size="size"
                        :disabled="readonly"
                    >
                        <el-option
                            v-for="item in categoryList"
                            :label="item.categoryName"
                            :value="item.commodityCategoryId"
                            :key="item.commodityCategoryId"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="供应商" class="search_item"   prop="companyId">
					<el-select filterable  v-model="purchase.companyId" placeholder="供应商"  :size="size" class="width-100" :disabled="readonly"  @change="companyChange">
						<el-option 
                            v-for="item in listCompany" :key="item.companyId"
                            :label="item.companyName" :value="item.companyId">
						</el-option>
					</el-select>
                </el-form-item>

                <el-form-item label="选择采购申请" class="search_item"  v-if="isPurchase"  prop="applications">
                    <el-input   :size="size"
                        :readonly="readonly"
                        v-model="purchase.applications"
                        placeholder="选择采购申请"
                        @focus="selePurchase"
                    ></el-input>
                </el-form-item>

                <el-form-item label="仓库" class="search_item"  v-if="isPurchase"  prop="storageId">
                    <el-select  v-model="purchase.storageId" filterable placeholder="请选择"  :size="size" :disabled="readonly">
                        <el-option
                            v-for="item in storageOptions"
                            :key="item.storageId"
                            :label="item.storageName"
                            :value="item.storageId">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="对应组织结构" class="search_item" prop="organizationName">
                    <!-- :readonly="readonlyOraganiza" -->
                    <el-input v-model="purchase.organizationName" placeholder="请选择组织结构" :readonly="true" @focus="selectOrganization"  :size="size"></el-input>
                </el-form-item>

                <el-form-item label="采购合同号" class="search_item purchaseCode" v-if="isPurchase" prop="purchaseContractCode">
                    <el-input 
                        v-model="purchase.purchaseContractCode"
                        :size="size"
                        :readonly="readonly"
                        placeholder="请输入采购合同号"
                        @blur = "purchaseContractBlur"
                    ></el-input>
                    <!-- <el-button class="button-96  m-left10" style="margin-top: 3px" :size="size" @click="savePurchaseOrder">保存</el-button> -->
                </el-form-item>

                <!-- <el-form-item :label="stockLabel.applyRemark" class="input_100 remarkTextarea" prop="applyRemark" label-width="120px"  v-if="!isPurchase">
                    <el-input type="textarea" v-model="purchase.applyRemark" :readonly="readonly"></el-input>
                </el-form-item>

                <el-form-item label="上传附件" class="input_100" prop="referrerName" label-width="120px"  v-if="!isPurchase">
                    <el-upload
                        list-type="text"
                        class="upload-demo"
                        action="string"
                        :http-request="uploadSectionFile"
                        :file-list="fileList"
                        :on-remove="handleRemove"  v-if="!isView"
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>

                    <ul class="el-upload-list el-upload-list--text downlists"  v-if="isView">
                        <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
                            <a class="el-upload-list__item-name">
                                <i class="el-icon-document"></i> {{item.name}}
                            </a>
                            <a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
                        </li>
                    </ul>
                </el-form-item> -->
            </el-form>
        </div>
        <!--  选择采购申请 -->
        <!-- :commodityCategoryId="purchase.commodityCategoryId" :brandId="purchase.brandId" :companyId = "purchase.companyId" -->
        <applicadia v-if="appliVisible" :stockUpApplyIdsarr="purchase.stockUpApplyIdsarr"  :commodityCategoryId="purchase.commodityCategoryId" :brandId="purchase.brandId" :companyId="purchase.companyId"  @submit_dialog="submitDialog" @close_dialog="closeDialog"></applicadia>

         <!--组织机构弹出层-->
        <organizationdia
            :visible="organizationDialogVisible"
            v-if="organizationDialogVisible"
            :defaultOpenArr="defaultOpenArr"
            @close_org="closetree"
        ></organizationdia>

    </div>
</template>
<script>
import spot from "@/assets/images/spot.png";
import organizationdia from "@/views/systemcenter/department/components/organizationdia";

import applicadia from "./applicadia"; // 选择采购申请
import { getStoreInfo } from "api/common/common"; // 当前登录人门店
import { mapGetters ,mapMutations, mapActions} from 'vuex';
import { put, getBuffer } from "@/utils/pubilcFn";
import {
    listCategory, // 获取品类
    listBrand, // 获取品牌
    listStore, // 获取门店
} from "api/pulicJava";

import {
	listCompanyByAll, // 获取供应商即公司列表
} from 'api/entrepotSet/scrapmanagement/index';

import {
    getStockUpApply, // 回显备货申请信息
    removeAccessoryImg, // 删除图片
    getStockUpPurchaseOrder, // 查询备货采购详情回显
    getStockUpGoodsInfo, // 备货采购 选择备货采购申请后的商品
    listStockUpStorage, // 备货采购订单 订单的仓库列表
    getOrganizationByPresent, // 获取当前登陆人组织结构接口
} from 'api/administrationCenter/stockmanagement/index';

import { 
    listParentOrganizedId, // 组织机构 根据当前节点获取所有父节点（含自己）
} from 'api/pulicJava';


export default {
    components: {
        applicadia,
        organizationdia
    },
    
    computed: { 
      ...mapGetters([
        'name', 'id'
      ]),
    },
    // name: 'brandmanagement',
    data() {
        return {
            labelPosition: "right",
            readonly: true,
            listCompany: [], // 供应商列表
            storageOptions: [], // 仓库列表
            stockUpApplyIdsline: '', // 采购申请id组成的字符串
            size: 'medium',

            fileView: false, // 上传的显示
            isView: false, // 是否是查看 -- 主要针对于附件
            viewstockObj: {}, // 回显备货申请信息
            viewpurchaseObj: {}, // 回显采购订单信息
            isPurchase: false, //是否是采购订单管理
            isNum: false, // 单号是否存在
            appliVisible: false,
            readonlyOraganiza: false,
            productList: [], // 获取采购申请下的商品
            // 组织机构
            multipleSelection: [],
            organizationId: '',
            organizationName: '',
            defaultOpenArr: [], // 组织机构回显
            organizationDialogVisible: false, // 组织机构弹出层

            defaultProps: {
                children: 'children',
                label: 'label'
            },

            // 采购信息
            purchase: {
                storeId: '',  // 采购机构id
                applyOrganizationId: "", // 采购机构
                applyUserId: "", // 采购人
                applyUserIdNum: '', // 采购人id
                predictArrivalTime: "", //  预计到货日期
                companyId: '', // 供应商
                applications: "", // 选择采购申请
                storageId:'', // 仓库
                purchaseContractCode: '', // 采购合同号
                organizationId: '', // 组织机构id
                organizationName: '', // 组织机构
                stockUpApplyIdsarr: [], // 选择采购申请id
                brandId: "", // 品牌
                commodityCategoryId: "", // 品类
                applyRemark: "" // 备注
            },
            stockLabel: {
                applyOrganizationId: "", // 采购机构
                applyUserId: "", // 采购人
                applications: "", // 选择采购申请
                // brand  : '', // 品牌
                // classify: '', // 品类
                applyRemark: "" // 备注
            },
            // 条件
            typeList: [], // 上样类型
            organList: [], // 采购机构
            applyUserIdList: [], // 采购人
            brandList: [], // 品牌数据
            categoryList: [], // 品类数据
            categorys: [], // 组织机构
            // 上传
            fileList: [],
            imgArr: [],
            delImgArr: [],

            dialogVisible: false,
            dialogImageUrl: "",
            urls: "",
            isExit: false,
            rules: {
                // applyOrganizationId: [
                //     {required: true,message: "请输入申请机构",trigger: "blur"}
                // ],
                // applyUserId: [
                //     { required: true, message: "请输入申请人", trigger: "blur" }
                // ],
                predictArrivalTime: [
                    {required: true,message: "请选择日期", trigger: "blur"}
                ],
                brandId: [
                    { required: true, message: "请选择品牌", trigger: "blur" }
                ],
                commodityCategoryId: [
                    { required: true, message: "请选择品类", trigger: "blur" }
                ],
                companyId: [
                    { required: true, message: "请选择供应商", trigger: "blur"  }
                ],
                applications: [
                    { message: "请选择采购申请", trigger: "blur" }
                ],
                storageId: [{
                     required: true, message: "请选择仓库", trigger: "change"
                }],
                organizationName:  [{
                     required: true, message: "请选择对应的组织机构", trigger: "blur"
                }],
                purchaseContractCode:  [{
                     required: true, message: "请输入采购合同号", trigger: "blur"
                }],

                applyRemark: [{ message: "请填写申请理由", trigger: "blur" }]
            },

            brandIndex: 0,
            commodityIndex: 0,
            comIndex: 0,
        };
    },

    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    created() {
        // 获取品牌
        this.getBrandList();
        // 获取品类
        this.getCategoryList();
        // 获取供应商
        this.listCompanyByAll();
        if(this.$route.path == "/stockmanagement/addpurchase") {
            // 仓库列表
            this.listStockUpStorage();
        }
        
        
        if(this.$route.path == "/stockmanagement/addstockpurchase") {
            this.readonlyOraganiza = true;
        }


        this.getStoreInfo(); // 采购机构

        // this.purchase.applyUserId = this.name; // 当前登录人
        this.purchase.applyUserIdNum = this.id; // 当前登录人
        console.log(this.name,"this.name",this.id,"this.id");
        

        if(this.$route.path == "/stockmanagement/editstockpurchase" || this.$route.path == "/stockmanagement/viewstockpurchase" || this.$route.path == "/stockmanagement/auditstock") {// 修改备货申请 and 查看备货申请 and 备货审核
            this.getStockUpApply(); // 修改备货申请 and 查看备货申请 and 备货审核 回显信息
        }

        if(this.$route.path == "/stockmanagement/editpurchase" || this.$route.path == "/stockmanagement/viewpurchase" ) { // 修改备货采购订单 and 查看备货采购订单
            this.listStockUpStorage();  // 仓库列表
            this.getStockUpPurchaseOrder(); // 修改备货采购订单 and 查看备货采购订单 回显信息
        }

        

        // 备货管理
        if (
            this.$route.path == "/stockmanagement/addstockpurchase" ||
            this.$route.path == "/stockmanagement/editstockpurchase" ||
            this.$route.path == "/stockmanagement/viewstockpurchase"
        ) {
            this.stockLabel.applyOrganizationId = "申请机构"; // 采购机构
            this.stockLabel.applyUserId = "申请人"; // 采购人
            // this.stockLabel.applications = "申请理由"; // 选择采购申请
            this.stockLabel.applyRemark = "申请理由"; // 备注

            


        } else if ( // 采购管理
            this.$route.path == "/stockmanagement/addpurchase" ||
            this.$route.path == "/stockmanagement/editpurchase" ||
            this.$route.path == "/stockmanagement/viewpurchase"
        ) {
            this.stockLabel.applyOrganizationId = "采购机构"; // 采购机构
            // this.stockLabel.applyUserId = "采购人"; // 采购人
            // this.stockLabel.applications = "备注"; // 选择采购申请
            this.stockLabel.applyRemark = "申请理由"; // 备注
            this.isPurchase = true; // 是否是采购订单 -- 选择采购申请是够存在

        }

        // 单号是否存在
        // if (
        //     this.$route.path == "/stockmanagement/auditstock" || 
        //     this.$route.path == "/stockmanagement/editstockpurchase" || 
        //     this.$route.path == "/stockmanagement/viewstockpurchase"
        // ) {
        //     this.isNum = true;
        //     this.stockLabel.applyCode = "申请单号";
        // } else if (this.$route.path == "/stockmanagement/viewpurchase") {
        //     this.isNum = true;
        //     this.stockLabel.applyCode = "采购单号";
        // }

        // 是否只读
        if (
            this.$route.path == "/stockmanagement/viewpurchase" ||
            this.$route.path == "/stockmanagement/viewstockpurchase" ||
            this.$route.path == "/stockmanagement/auditstock"
        ) {
            this.readonly = true;
            
        } else {
            this.readonly = false;
        }

        if( this.$route.path == "/stockmanagement/editpurchase") { // 申请的修改
            this.fileView = true;
        }
        if(this.$route.path == "/stockmanagement/viewstockpurchase" || this.$route.path == "/stockmanagement/auditstock" || this.$route.path == "/stockmanagement/viewpurchase" ) { // 是否是查看  -- 针对于附件
            this.isView = true;
        }

        
        new Promise((resolve, reject) => {
            // 获取当前登陆人组织结构接口
            // this.getOrganizationByPresent();
            getOrganizationByPresent().then(res => {
                if(res.status == 200) {
                    this.purchase.organizationName = res.data.organizationName;
                    this.purchase.organizationId =  res.data.organizationId;
                    resolve( this.purchase.organizationId );
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 获取当前登陆人组织结构接口 views/stockmanagement/stockpurchase/components/stockform', error);
            });
            
        }).then((res)=>{
            console.log(res,"ressssssssssssss");
            
            this.getOrganizationParentList(res);
        });
        
        console.log(this.purchase,"在created中 purchase");
        

        // /stockmanagement/editstockpurchase 修改
    },

    watch: {
        'purchase.commodityCategoryId'(val,attr) {// val 现在 attr 过去
            if(attr) {
                this.isExit = true;
            }

            this.$emit("commodity_change",val,attr,this.isExit)
        },
        'purchase.brandId'(val,attr) {// val 现在 attr 过去
            if(attr) {
                this.isExit = true;
            }

            this.$emit("brand_change",val,attr,this.isExit)
        },
        'purchase.companyId'(val,attr) {// val 现在 attr 过去
            if(attr) {
                this.isExit = true;
            }

            this.$emit("company_change",val,attr,this.isExit)
        },


    },

    mounted() {
        new Promise((resolve, reject) => {
            // 获取当前登陆人组织结构接口
            // this.getOrganizationByPresent();
            getOrganizationByPresent().then(res => {
                if(res.status == 200) {
                    this.purchase.organizationName = res.data.organizationName;
                    this.purchase.organizationId =  res.data.organizationId;
                    resolve( this.purchase.organizationId );
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 获取当前登陆人组织结构接口 views/stockmanagement/stockpurchase/components/stockform', error);
            });
            
        }).then((res)=>{
            console.log(res,"ressssssssssssss");
            
            this.getOrganizationParentList(res);
        });
        
        console.log(this.purchase,"在mounted中 purchase");
    },
    methods: {
        brandChange(val) {
            // if(this.brandIndex) {
            //     this.isExit = true;
            // }
            // this.brandIndex += 1;



            this.$emit("brand_change",val,this.isExit)
        },
        commodityChange(val) {
            // if(this.commodityIndex) {
            //     this.isExit = true;
            // }
            // this.commodityIndex += 1;

            this.$emit("commodity_change",val,this.isExit)
        }, 
        companyChange(val) {
            // if(this.comIndex) {
            //     this.isExit = true;
            // }
            // this.comIndex += 1;

            
            this.$emit("company_change",val,this.isExit)
        },

        // 保存操作按钮 -- 采购合同号
        purchaseContractBlur() {
            if (!this.purchase.purchaseContractCode) {
                this.$message.warning('请输入采购合同号');
            } else {
                this.$emit("purchaseContractNum_Blur",this.purchase.purchaseContractCode)

                // let data = {
                //     purchaseContractCode: this.purchase.purchaseContractCode,
                // };
                // // insertPurchaseContractCode(data).then(res => {
                // //     if(res.status == 200) {
                // //         this.$message.success('保存成功');
                // //     }
                // // }) .catch(error => {
                // //     console.log("备货采购申请管理 备货管理 保存备货采购合同合同号 views/stockmanagement/purchasemanagement/stockpurchase",error)
                // // })
            }
        },

        // 选择组织结构
      selectOrganization() {
           
        if(this.$route.path == "/stockmanagement/addstockpurchase" 
            || this.$route.path == "/stockmanagement/editstockpurchase"
            || this.$route.path == "/stockmanagement/viewstockpurchase" 
            || this.$route.path == "/stockmanagement/auditstock" ) {
            return;
        }
        if(this.readonly) {
            return;
        }
        this.organizationDialogVisible = true;
      },
      // 组织机构获取当前节点所有父节点
      getOrganizationParentList(organizedId) {
        let params = {
          organizedId
        }
        listParentOrganizedId(params)
          .then(response => {
            this.defaultOpenArr = response.data.split(',').map(Number).reverse();
            console.log(this.defaultOpenArr,"this.defaultOpenArr");
            
          })
          .catch(error => {
            console.log('addShop-公共接口获取当前组织机构所有父节点')
          })
      },
      // 选择组织结构确认
      closetree(obj, arr) {
        if (obj) {
          this.purchase.organizationName = obj.label;
          this.purchase.organizationId = obj.id;
          this.defaultOpenArr = arr;
        }
        console.log(obj,arr,"obj arr");
        
        this.organizationDialogVisible = false;
      },

        // 仓库列表
        listStockUpStorage() {
            listStockUpStorage().then(res => {
                if(res.status == 200) {
                    this.storageOptions = res.data;
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 仓库列表 views/stockmanagement/stockpurchase/components/stockform', error);
            });
        },

        
        // 获取当前登陆人组织结构接口
        getOrganizationByPresent() {
            getOrganizationByPresent().then(res => {
                if(res.status == 200) {
                    this.purchase.organizationName = res.data.organizationName;
                    this.purchase.organizationId =  res.data.organizationId;
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 获取当前登陆人组织结构接口 views/stockmanagement/stockpurchase/components/stockform', error);
            });
        },

        // 查询备货采购详情
        getStockUpPurchaseOrder() {
             let data = {
                StockUpPurchaseOrderId: this.$route.query.stockUpPurchaseOrderId,
            }
            getStockUpPurchaseOrder(data).then(res => {
                if (res.status == 200) {
                    this.viewpurchaseObj = res.data;

                    this.purchase.predictArrivalTime =  res.data.predictArrivalTime; // 时间
                    this.purchase.brandId =  res.data.brandId ? String(res.data.brandId) : ''; // 品牌
                    this.purchase.commodityCategoryId =  res.data.categoryId ? String(res.data.categoryId) : ''; // 品类
                    // this.purchase.applyRemark = res.data.remark;
                    this.purchase.companyId = res.data.companyId; // 供应商
                    this.purchase.storageId = res.data.storageId  ? Number(res.data.storageId) : '';; // 仓库
                    this.purchase.purchaseContractCode = res.data.purchaseContractCode; // 采购合同号
                    
                    this.purchase.applications = res.data.stockUpApplies.map(item => {
                        return item.applyCode
                    }).join(",")

                    new Promise((resolve, reject) => {
                        // 获取当前登陆人组织结构接口
                        // this.getOrganizationByPresent();
                        getOrganizationByPresent().then(res => {
                            if(res.status == 200) {
                                this.purchase.organizationName = res.data.organizationName;
                                this.purchase.organizationId =  res.data.organizationId;
                                resolve( this.purchase.organizationId );
                            }
                        }).catch(error => {
                            console.log('备货采购申请管理 备货管理 获取当前登陆人组织结构接口 views/stockmanagement/stockpurchase/components/stockform', error);
                        });
                        
                    }).then((res)=>{
                        this.getOrganizationParentList(res);
                    });

                    // this.viewstockObj = res.data;

                    // this.purchase = this.viewstockObj.stockUpApply; // 对象
                    // // this.$nextTick(() => {
                    //     this.purchase.brandId = this.purchase.brandId ? String(this.purchase.brandId) : '';
                    //     this.purchase.commodityCategoryId = this.purchase.commodityCategoryId ? String(this.purchase.commodityCategoryId) : '';
                    // });

                    
                    
                    // this.fileList = res.data.stockUpApplyFile; // 附件
                    // this.$nextTick(() => {
                    //     this.fileList = this.fileList.map(item => {
                    //         return {
                    //             ...item,
                    //             name: item.sourceName,
                    //             url: item.fileUrl
                    //         }
                    //     })
                    // });
                    

                }
            }).catch(error => {
                console.log("备货采购申请管理 备货管理 查看备货申请 views/stockmanagement/stockpurchase/components/stockform",error);
            });
        },
        // 当前登录人门店
        getStoreInfo() {
            getStoreInfo().then(res => {
                if (res.data) {
                    this.info = res.data;
                    this.purchase.storeId = res.data.storeId; // 采购机构id
                    // this.purchase.applyOrganizationId = res.data.storeName;// 采购机构
                    // let data = {
                    //     storeId: res.data.storeId,
                    //     storeName: res.data.storeName
                    // };
                    // this.storeOptions.push(data);
                } else {
                    // listStore().then(res => {
                    //     this.storeOptions = res.data;
                    // });
                }
            }).catch(error => {
                console.log(error + "views/customermanagement/customerquery/index");
            });
        },
        // 供应商列表
        listCompanyByAll() {
            let data = {
                companyType: "1", // 0 是正常的 1是供应商
            };
            listCompanyByAll(data).then(res => {
                if(res.status == 200) {
                    this.listCompany = res.data;
                }
            }).catch(error => {
                console.log('报废管理:报废管理 供应商列表 entrepotSet/scrapmanagement/components/prolist.vue', error);
            });
        },
        // 修改 and 查看备货申请 and 备货审核 回显信息
        getStockUpApply() {
            let data = {
                stockUpApplyId: this.$route.query.stockUpApplyId,
            }
            getStockUpApply(data).then(res => {
                if (res.status == 200) {
                    this.viewstockObj = res.data;

                    // this.purchase = this.viewstockObj.stockUpApply; // 对象
                    this.purchase.predictArrivalTime =  res.data.stockUpApply.predictArrivalTime; // 时间
                    this.purchase.brandId =  res.data.stockUpApply.brandId ? String(res.data.stockUpApply.brandId) : ''; // 品牌
                    this.purchase.commodityCategoryId =  res.data.stockUpApply.commodityCategoryId ? String(res.data.stockUpApply.commodityCategoryId) : ''; // 品类
                    // this.purchase.applyRemark = res.data.stockUpApply.remark;
                    this.purchase.companyId = res.data.stockUpApply.supplierId; // 供应商

                    this.purchase.brandId = this.purchase.brandId ? String(this.purchase.brandId) : '';
                    this.purchase.commodityCategoryId = this.purchase.commodityCategoryId ? String(this.purchase.commodityCategoryId) : '';
                    
                   
                    new Promise((resolve, reject) => {
                        
                        // 获取当前登陆人组织结构接口
                        // this.getOrganizationByPresent();
                        getOrganizationByPresent().then(res => {
                            if(res.status == 200) {
                                this.purchase.organizationName = res.data.organizationName;
                                this.purchase.organizationId =  res.data.organizationId;
                                resolve( this.purchase.organizationId );
                            }
                        }).catch(error => {
                            console.log('备货采购申请管理 备货管理 获取当前登陆人组织结构接口 views/stockmanagement/stockpurchase/components/stockform', error);
                        });
                        
                    }).then((res)=>{
                        console.log(res,"ressssssssssssss");
                        
                        this.getOrganizationParentList(res);
                    });
                    
                    // this.fileList = this.viewstockObj.accessoryList; // 附件
                    // this.$nextTick(() => {
                    //     this.fileList = this.fileList.map(item => {
                    //         return {
                    //             ...item,
                    //             name: item.sourceName,
                    //             url: item.fileUrl
                    //         }
                    //     })
                    // });
                    

                }
            }).catch(error => {
                console.log("备货采购申请管理 备货管理 查看备货申请 views/stockmanagement/stockpurchase/components/stockform",error);
            });
        },

        


        //文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile(res) {
            put(res).then(data => {
                this.imgArr.push(data);
                console.log(this.imgArr,"this.imgArr 52366");
                
            });
        },

        //文件删除操作
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

        // 获取全部品牌列表
        getBrandList() {
            listBrand()
                .then(res => {
                    if (res.status == 200) {
                        this.brandList = res.data;
                    }
                })
                .catch(error => {
                    console.log(
                        "备货采购申请管理 备货管理 品牌列表 views/stockmanagement/stockpurchase/components/stockform",
                        error
                    );
                });
        },

        // 获取全部品类列表
        getCategoryList() {
            listCategory()
                .then(res => {
                    if (res.status == 200) {
                        this.categoryList = res.data;
                    }
                })
                .catch(error => {
                    console.log(
                        "备货采购申请管理 备货管理 品类列表 views/stockmanagement/components/stockform",
                        error
                    );
                });
        },

        // 选择采购申请
        selePurchase() {
            if(this.readonly) {
                return;
            }

            if(this.purchase.commodityCategoryId && this.purchase.brandId && this.purchase.companyId) { // 品牌 品类 供应商
                this.appliVisible = true;
            }else {
                this.$message.warning("请选择品牌，品类，供应商");
            }
        },
        // 采购申请弹框的确定按钮
        submitDialog(val) { // val 是在采购申请弹框选择的数据组成的数组
            this.purchase.applications = val.map(item => { // 采购申请单号组成的字符串
                return item.applyCode
            }).join(",")

            this.purchase.stockUpApplyIdsarr = val.map(item => { // 采购申请id组成的数组
                return item.stockUpApplyId
            })

            this.stockUpApplyIdsline = val.map(item => { // 采购申请id组成的字符串
                return item.stockUpApplyId
            }).join(",")

            let params = {
                stockUpApplyIds: this.stockUpApplyIdsline,
            }
            // 备货采购 选择备货采购申请后的商品
            // this.stockUpApplyIds(params);


            new Promise((resolve, reject) => {
                getStockUpGoodsInfo(params).then(res => {
                    if (res.status == 200) {
                        this.productList = res.data.rows;
                        this.productList.forEach(item => {
                            if(!item.costPrice) {
                                item.costPrice = 0;
                            }
                        })
                        resolve( this.productLis );
                    }
                }).catch(error => {
                    console.log(
                        "备货采购申请管理 备货管理 品类列表 views/stockmanagement/components/stockform",
                        error
                    );
                });

                
            }).then((res)=>{
                console.log(this.productList,"选择备货采购申请后的商品集合");
                
                this.$emit("getStockUpGoods_Info",this.productList);;
            }); 

            
            
            // this.purchase.applications = val[0].applyCode;
            // this.purchase.stockUpApplyId= val[0].stockUpApplyId;

            this.appliVisible = false;
        },
        // 备货采购 选择备货采购申请后的商品
        getStockUpGoodsInfo(data) {
            getStockUpGoodsInfo(data).then(res => {
                if (res.status == 200) {
                    this.productList = res.data;
                }
            })
            .catch(error => {
                console.log(
                    "备货采购申请管理 备货管理 品类列表 views/stockmanagement/components/stockform",
                    error
                );
            });
        },

        closeDialog() {
            this.appliVisible = false;
        }
    }
};
</script>
<style scoped lang='scss'>
.list_top{
    .demo-form-inline{
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        >div {
            width: 50%;
            margin: 10px 0px;
            padding: 0px 5px;
        }
        > div.input_100 {
            width: 100% !important;
        }
    }
    
    
}

.downlists {
    >li {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }
}

</style>

<style lang="scss">
    .stockform {
        .search_item{
            .el-date-editor.el-input{
                width: 100%;
            }
            .el-select{
                width: 100%;
            }
        }
        .purchaseCode {
            // display: flex;
            // flex-wrap: nowrap;
            // align-items: center;
            .el-form-item__content {
                display: flex;
                flex-wrap: nowrap;
                .el-input {
                    flex: 1;
                }
            }
        }
    }
</style>


