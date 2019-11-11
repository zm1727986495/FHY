<template>
    <div class="addrecommender">
        <div class="head_nav">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>

        <el-card class="lvs cards">
          
             <!-- 输入框集合 -->
            <stockform ref="stockform" @getStockUpGoods_Info="getStockUpGoodsInfo" @purchaseContractNum_Blur="purchaseContractNumBlur" @brand_change="brandChange" @commodity_change="commodityChange" @company_change="companyChange"></stockform>

            <!-- table 
            <div class="addgoods">
                <purchaseTable></purchaseTable>
            </div> -->

            <!-- table  -->
            <div class="addgoods">
                <div class="iconBox m-bottom">
                    <i class="Icon"></i>
                    <span>选择商品</span>
                </div>
                <!-- <stockTable  ref="stockTable"></stockTable> -->
                <div class="stockTable">
        <div class="btn_list_1" v-if="!isView">
            <el-button size="small" class="button-96" @click="addProduct">添加商品</el-button>   
            <el-button size="small" class="button-96" @click="deleteGoods">删除</el-button>
        </div>
        <!-- 商品弹框 -->
        <el-dialog title="商品列表"   custom-class="customDialogTitle" :visible.sync="productDialog" width="80%" top="2vh" class="lvs">
            <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="productList" v-if="productDialog"></select-commodity>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectProductConfirm">确定</el-button>
                <el-button  @click="productDialog = false">取消</el-button>
            </div>
        </el-dialog>

        <!-- <div class="fl">
            <label class="label fl">采购合同号</label>
            <div class="fl">
                <el-input v-model="purchaseContractCode" clearable placeholder="请输入采购合同号" :size="size"></el-input>
            </div>
            <el-button class="button-96 fl m-left10" style="margin-top: 3px" :size="btnSize" @click="savePurchaseOrder">保存</el-button>
        </div> -->

        <div class="moduleHeader  m-bottom15">
            <div class="purchaseLeft">
                <label class="label">采购单号</label>
                <div class="">
                    <!-- v-model="purchaseNumber" -->
                    <el-input v-model="purchaseNumber"  placeholder="请输入采购单号" :size="size"></el-input>
                </div>
                <!-- <el-button class="button-96  m-left10" style="margin-top: 3px" :size="btnSize" @click="savePurchaseOrder">保存</el-button> -->
            </div>
            <div class="btnList">
                <label class="label">采购金额</label>
                 <!-- class="width-100" -->
                 <!-- v-model="moneyNum" -->
                 <div class="">
                    <el-input-number 
                        :controls="false"  placeholder="采购金额"
                        v-model="purchaseCost"
                        :precision="2"
                        :min="0" :disabled="readonly"
                        :size="moneySize"
                    ></el-input-number>
                 </div>
            </div>
        </div>

        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20 stock_table">
            <el-table 
                border   :row-key="getRowKeys"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;" ref="stockTable">
                <el-table-column type="selection" width="55"  :reserve-selection="true" fixed='left'></el-table-column>
                <el-table-column type="index" width="55" fixed='left'></el-table-column>
                <el-table-column width="180" prop="commodityName" label="名称" show-overflow-tooltip sortable align="center" fixed='left'></el-table-column>
                <el-table-column width="180" prop="brand_name" label="品牌" sortable align="center"></el-table-column>
                <el-table-column width="180" prop="category_name" label="品类" sortable align="center"></el-table-column>
                <el-table-column width="180" prop="classifyName" label="分类" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column width="180" prop="purchaseNumber"  label="数量" sortable align="center">
                    <template  slot-scope="scope">
                        <!-- :min="0" -->
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="数量"
                            v-model="scope.row.purchaseNumber"
                            :precision="0" :min="1"
                            :disabled="readonly"
                            size="mini"
                        ></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityUnit" label="单位" sortable align="center"></el-table-column>
                <el-table-column width="180" prop="commodityModel"  label="型号" sortable align="center" v-if="isUnfinished || isAll" ></el-table-column>
                <el-table-column width="180" prop="commodityNumber" label="货号" align="center" sortable show-overflow-tooltip  v-if="isFinished || isAll"></el-table-column>
                <el-table-column prop="commodityModel" label="规格" align="center" width="200" sortable show-overflow-tooltip  v-if="isFinished"></el-table-column>
                <!-- <el-table-column prop="commodityPrice" label="单价" width="180" align="center" sortable></el-table-column> -->
                <el-table-column prop="costPrice" label="成本单价" width="180" align="center" sortable></el-table-column>
                <el-table-column width="180" prop="commodityCode" label="商品编码" sortable align="center"></el-table-column>
                <el-table-column width="180" prop="commoditySeriesId" label="系列" sortable align="center"  v-if="isUnfinished || isAll">
                    <template  slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.commoditySeriesId"  placeholder="请选择系列" :disabled="readonly">
                            <el-option 
                                v-for="(item,index) in scope.row.commodityseriesList" 
                                :key="index" 
                                :label="item.seriesName" :value="item.seriesId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityMaterialId" label="材质" sortable align="center" v-if="isUnfinished || isAll">
                    <template  slot-scope="scope"> 
                        <el-select :size="size" v-model="scope.row.commodityMaterialId"  placeholder="请选择材质"  :disabled="readonly">
                            <el-option 
                                v-for="item in scope.row.commoditymaterialList" 
                                :key="item.materialId" 
                                :label="item.materialName" :value="item.materialId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityColourId" label="颜色" sortable align="center">
                    <template  slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.commodityColourId"  placeholder="请选择颜色" :disabled="readonly">
                            <el-option  
                                v-for="(item,index) in scope.row.commoditycolourList" 
                                :key="index" 
                                :label="item.colourName" :value="item.colourId">
                            </el-option>
                        </el-select>

                        <!-- <p v-else>{scope.row.colourName}</p> -->
                    </template>
                </el-table-column>
                <!-- <el-table-column width="180" prop="commodityWide"  label="宽" sortable align="center">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="深"
                            v-model="scope.row.commodityWide"
                            :precision="2"
                            :min="0"
                            size="mini" :disabled="readonly"
                        ></el-input-number>
                    </template>
                </el-table-column>

                <el-table-column  width="180" prop="commodityHigh" label="高" sortable align="center">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="深"
                            v-model="scope.row.commodityHigh"
                            :precision="2"
                            :min="0"
                            size="mini" :disabled="readonly"
                        ></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column  width="180" prop="commodityLong"  label="深" sortable align="center">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="深"
                            v-model="scope.row.commodityLong"
                            :precision="2"
                            :min="0" :disabled="readonly"
                            size="mini"
                        ></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityThick" label="厚" sortable align="center"  v-if="isUnfinished">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="厚"
                            v-model="scope.row.commodityThick"
                            :precision="2"
                            :min="0" :disabled="readonly"
                            size="mini"
                        ></el-input-number>
                    </template>
                </el-table-column> -->
            </el-table>    
        </div>
        
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
    </div>
    </div>
    </el-card>
        <div class="bottom_btnlist">
            <el-button type="primary" @click="submitForm('ruleForm',0)" v-if="!isView" :loading="btnLoading">保 存</el-button>
            <el-button type="primary" @click="submitForm('ruleForm',1)" v-if="!isView" :loading="btnLoading">提 交</el-button>
            <el-button @click="cancel('ruleForm')" >取 消</el-button>
        </div>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";


import stockform from "../components/stockform";
import purchaseTable from "../components/purchaseTable";
// import stockTable from "../components/stockTable";
import applicadia from "../components/applicadia";

import { 
    listCommodityColour, // 商品颜色查询
    listCommoditySeries, // 商品系列查询
    listCommodityMaterial, // 商品材质查询
} from 'api/administrationCenter/stockmanagement/index';

import {
    getStockUpApply, // 回显备货申请信息
} from 'api/administrationCenter/stockmanagement/index';
import selectCommodity from '@/views/components/selectCommodity'
import { listCompanyByAll } from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import {
  getUUID
} from 'src/api/pulicJava.js';
import { 
    listBaseDict,
    deleteStockUpApply, // 撤销备货申请
    insertStockUpPurchaseOrder, // 新增备货
	updateStockUpPurchaseOrder, // 修改备货
	getStockUpPurchaseOrder, // 查询备货采购详情回显
    // getStockUpGoodsInfo, // 备货采购 选择备货采购申请后的商品
} from 'api/administrationCenter/stockmanagement/index';
export default {
    components: {
        breadcrumb,
        pagination,
        stockform,
        purchaseTable,
        // stockTable, // table
        applicadia,
        selectCommodity
    },
    name: 'stockpurchase',
    data() {
        return {
            stockUpApplyIdsline: '',
            moneySize: 'medium',
            btnSize: 'small',
            purchaseNumber: '', // 采购单号
            moneyNum: 0,
            btnLoading: false, // 按钮的loading Flag
            companyIndex: 0,
            commodityIndex: 0,
            brandIndex : 0,

            navList: [], //头部面包屑
            isEdit: false,
            appliVisible: false,
            stockUpPurchaseOrderId: this.$route.query.stockUpPurchaseOrderId,
            labelPosition: 'right',
            // readonly: true,
            searchData: [], //  需求日期
            // 采购信息
            purchase: {  
                organ: [], // 采购机构
                purchaser: '', // 采购人
                applications: '', // 选择采购申请
                brand  : '', // 品牌
                classify: '', // 品类
                desc: '', // 备注
            },
            // 条件
            typeList: [],  // 上样类型
            organList: [],  // 采购机构
            purchaserList: [],  // 采购人
            brandList: [],  //品牌
            classifyList: [],  // 品类

            // 开始
            size: "small",
            // 表格数据
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
            num: '',
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 10,
            isAudit: false,
            isView: false,
            // 下拉框数据
            // commoditycolourList: [], // 商品颜色
            // commodityseriesList: [], // 商品系列
            // commoditymaterialList: [], // 商品材质
            purchaseCost: 0,
            // 商品
            productDialog: false,
            productList: {
                brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
                categoryList: [], // 品类数组 可不传（不传默认为全部品类）
                selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
                height: '350px', // 设置表格高度 可不传（弹出层最好传下）
                isDialog: true, // 是否为弹出层（不传默认为页面）
                brandId: 0,
                commodityCategoryId: 0,
                disabled: true,
                companydisabled:  true, // 供应商
                companyId: 0,
                goodsType: 1// 货品类型： 1成品 2定制品
            },
            selectedProducts: [], // 选择商品
            readonly: false, // 是否只读
            tabList: [],
        };
    },
    watch: {
        stockUpApplyIdsline(val) {
            console.log(11111111111111);
        },
        // tabList(val) {
        //     console.log(val,val.length,Array.isArray(val),"val 金钱");
            
        //     val.forEach(item => {
        //         console.log(item.purchaseNumber * item.costPrice,this.purchaseCost,"每一行的金钱数");
                
        //         this.purchaseCost = this.purchaseCost + item.purchaseNumber * item.costPrice
        //     });
        //     console.log(this.purchaseCost,"temp 这个是金钱");
            
        // },

        //引用类型变量、采用深度监听
        tabList: {
            // 实时计算表格数据的总金额
            handler: function (newVal, oldVal) {
                this.purchaseCost = 0;
                newVal.forEach(item => {
                    console.log(item.purchaseNumber * item.costPrice,this.purchaseCost,"每一行的金钱数");
                    let purchaseNumber = item.purchaseNumber;
                    let costPrice = item.costPrice;

                    if(!item.purchaseNumber) {
                        purchaseNumber = 0;
                    }
                    if(!item.costPrice) {
                        costPrice = 0;
                    }

                    // this.purchaseCost = this.purchaseCost + item.purchaseNumber * item.costPrice
                    this.purchaseCost = this.purchaseCost + purchaseNumber * costPrice;
                });
                //   this.purchaseCost = this.purchaseCost + item.purchaseNumber * item.costPrice
           },
           deep: true
        },


    },
    computed: {
        // 是否是成品
		isFinished() {
			return this.productList.goodsType == 1;
		},
		// 是否是定制品
		isUnfinished() {
			return this.productList.goodsType == 2;
		},
		isAll() {
			return !this.productList.goodsType;
		},

        commodityIds() {
            let arr = [];
            this.tabList.forEach(item => {
                arr.push(item.commodityId);
            })
            return arr;
        },
        // purchaseNumbers() {
        //     return this.$refs.stockform.purchase.purchaseContractCode;
        // },
        // Allelection: {
        //     get() {
        //         let str = this.dataList.every(item => {
        //          return item.checked;
        //         });
        //         return str;
        //     },
        //     set(val) {
        //         this.dataList.forEach(item => {
        //          item.checked = val;
        //         });
        //         this.dataList.forEach(item => {
            //         item.unpackingDataVOS.forEach(attr => {
            //             attr.flag = item.checked;
            //         });
        //         });
        //     }
        // },

        totalMoney: {
            get() {
                let temMoney = 0;
                this.tabList.forEach(item => {
                    temMoney = temMoney + item.purchaseNumber * item.costPrice
                })

                return temMoney;
            },
            set(val) {
                console.log(val,"totalMoney total222222");
                
            }
        },
    },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    created() {

        if(this.$route.path === "/stockmanagement/editpurchase" || this.$route.path === "/stockmanagement/viewpurchase"){
            this.readonly = true;
        }else if(this.$route.path === "/stockmanagement/addpurchase"){
            this.readonly = false;
        }

        if(this.$route.path === "/stockmanagement/viewpurchase"){
            this.isView = true;
        }
        
        if(this.$route.path === "/stockmanagement/editpurchase"){
            this.isEdit = true;
        }

		if(this.$route.path == "/stockmanagement/editpurchase" || this.$route.path == "/stockmanagement/viewpurchase" ) { // 修改备货采购订单 and 查看备货采购订单
            this.getStockUpPurchaseOrder(); // 修改备货采购订单 and 查看备货采购订单 回显信息
        }


        if(this.$route.path == "/stockmanagement/viewstockpurchase" || this.$route.path == "/stockmanagement/editstockpurchase" || this.$route.path == "/stockmanagement/auditstock") { // 查看备货申请 修改备货申请
            this.getStockUpApply(); // 回显信息
        }
       
        if(this.$route.path == "/stockmanagement/viewstockpurchase" || this.$route.path == "/stockmanagement/auditstock") {
            this.isView = true;
            this.readonly = true;
        }


    },
    methods: {
        // 保存操作按钮 -- 采购合同号
        // savePurchaseOrder() {
        //     if (!this.contractDetails.purchaseContractCode) {
        //         this.$message.warning('请输入采购合同号');
        //     } else {
        //         let data = {
        //             purchaseContractCode: this.purchaseContractCode,
        //             // customerContractId: this.$route.query.contractId
        //         };
        //         insertPurchaseContractCode(data) .then(res => {
        //             if(res.status == 200) {
        //                 this.$message.success('保存成功');
        //             }
        //         }) .catch(error => {
        //             console.log("备货采购申请管理 备货管理 保存备货采购合同合同号 views/stockmanagement/purchasemanagement/stockpurchase",error)
        //         })
        //     }
        // },


		// 查询备货采购详情
        getStockUpPurchaseOrder() {
             let data = {
                StockUpPurchaseOrderId: this.$route.query.stockUpPurchaseOrderId,
            }
            getStockUpPurchaseOrder(data).then(res => {
                if (res.status == 200) {
                    this.purchaseNumber = res.data.purchaseNumber;
                    this.purchaseCost = res.data.purchaseCost;

					let tabListStorage = res.data.stockUpPurchaseOrderGoodsVOS;
					
					if(tabListStorage && tabListStorage.length != 0) {
                        tabListStorage.forEach(item => {
                            let data = {
                                commodityId: item.commodityId ? item.commodityId : ''
                            };
                            
                            let p1 = new Promise((resolve, reject) => {
                                listCommodityColour(data).then(attr => {
                                    resolve(attr);
                                });
                            });

                            let p2 = new Promise((resolve, reject) => {
                                listCommoditySeries(data).then(attr => {
                                    resolve(attr);
                                });
                            });

                            let p3 = new Promise((resolve, reject) => {
                                listCommodityMaterial(data).then(attr => {
                                    resolve(attr);
                                });
                            });

                            Promise.all([p1, p2, p3]).then(res => {
                                if(item.commodityColourId) {
                                    item.commodityColourId = Number(item.commodityColourId)
                                }

                                if(item.commodityMaterialId) {
                                    item.commodityMaterialId = Number(item.commodityMaterialId)
                                }

                                if(item.commoditySeriesId) {
                                    item.commoditySeriesId = Number(item.commoditySeriesId)
                                }

                                // if(!item.costPrice) {
                                //     item.costPrice = 0;
                                // }
                                
                                this.tabList.push({
                                    commoditycolourList: res[0].data,
                                    commodityseriesList: res[1].data,
                                    commoditymaterialList: res[2].data,
                                    brand_name: item.brandName,
                                    category_name: item.categoryName,
                                    ...item,
                                    // commodityColourId: Number(item.commodityColourId),
                                    // commodityMaterialId: Number(item.commodityMaterialId),
                                    // commoditySeriesId: Number(item.commoditySeriesId),
                                });
                            });
                        })
                    }
                }
            }).catch(error => {
                console.log("备货采购申请管理 备货管理 查看备货申请 views/stockmanagement/purchasemanagement/stockpurchase",error);
            });
        },

        // 选择采购申请
        selePurchase() {
            this.appliVisible = true;
        },
        submitDialog() {
            this.appliVisible = false;
        },
        closeDialog() {
            this.appliVisible = false;
        },
        // 上传图片
        uploadSectionFile(res){ 
            put(res).then(data=>{
                console.log(data);
            })
        },
        // 输入采购合同号失焦时触发的函数
        purchaseContractNumBlur(val) {
            this.purchaseNumber = val;
        },

        // 备货采购 选择备货采购申请后的商品 -- 子组件触发
        getStockUpGoodsInfo(productList) {

            if(productList && productList.length != 0) { // 选择备货采购申请后的商品有数据
                productList.forEach(item => {
                    let data = {
                        commodityId: item.commodityId ? item.commodityId : ''
                    };
                    
                    
                    let p1 = new Promise((resolve, reject) => {
                        listCommodityColour(data).then(attr => {
                            resolve(attr);
                        });
                    });

                    let p2 = new Promise((resolve, reject) => {
                        listCommoditySeries(data).then(attr => {
                            resolve(attr);
                        });
                    });

                    let p3 = new Promise((resolve, reject) => {
                        listCommodityMaterial(data).then(attr => {
                            resolve(attr);
                        });
                    });

                    Promise.all([p1, p2, p3]).then(res => {
                        if(this.tabList && this.tabList.length == 0) { // tabList 没有数据
                                // if(item.costing) {     
                                    item.costPrice = item.costing
                                // }

                                if(!item.costPrice) { // 成本单价
                                    item.costPrice = 0;
                                }

                                // 颜色
                                if(res[0].data && res[0].data.length != 0 && (!item.commodityColourId)) {
                                    item.commodityColourId = res[0].data[0].colourId
                                }
                                // 材质
                                if(res[2].data && res[2].data.length != 0 && (!item.commodityMaterialId)) {
                                    item.commodityMaterialId = res[2].data[0].materialId
                                }
                                // 系列
                                if(res[1].data && res[1].data.length != 0 && (!item.commoditySeriesId)) {
                                    item.commoditySeriesId = res[1].data[0].seriesId
                                }
                            
                                this.tabList.push({
                                    commoditycolourList: res[0].data,
                                    commodityseriesList: res[1].data,
                                    commoditymaterialList: res[2].data,
                                    brand_name: item.brandName,
                                    category_name: item.categoryName,
                                    ...item
                                });
                        }else if(this.tabList && this.tabList.length != 0){ // tabList 有数据
                            
                            let flag = this.tabList.some(attr => { // 要添加的这一条数据与tabList的数据至少有一条相同
                                return   (attr.commodityColourId ==  item.commodityColourId 
                                    && attr.commodityMaterialId == item.commodityMaterialId 
                                    && attr.commoditySeriesId == item.commoditySeriesId
                                    && attr.commodityCode == item.commodityCode);
                            });

                            if(flag) {// 至少有一条相同
                                this.tabList.forEach(attr => {
                                    if( attr.commodityColourId ==  item.commodityColourId 
                                        && attr.commodityMaterialId == item.commodityMaterialId 
                                        && attr.commoditySeriesId == item.commoditySeriesId
                                        && attr.commodityCode == item.commodityCode
                                    ) { // 材质颜色系列编号
                                        
                                        attr.purchaseNumber += item.purchaseNumber; // tabList的数量 += 采购申请的数量
                                    }
                                })
                            }else {
                                if(!item.costPrice) { // 成本单价
                                    item.costPrice = 0;
                                }
                                // 颜色
                                if(res[0].data && res[0].data.length != 0 && (!item.commodityColourId)) {
                                    item.commodityColourId = res[0].data[0].colourId
                                }
                                // 材质
                                if(res[2].data && res[2].data.length != 0 && (!item.commodityMaterialId)) {
                                    item.commodityMaterialId = res[2].data[0].materialId
                                }
                                // 系列
                                if(res[1].data && res[1].data.length != 0 && (!item.commoditySeriesId)) {
                                    item.commoditySeriesId = res[1].data[0].seriesId
                                }

                                this.tabList.push({
                                    commoditycolourList: res[0].data,
                                    commodityseriesList: res[1].data,
                                    commoditymaterialList: res[2].data,
                                    brand_name: item.brandName,
                                    category_name: item.categoryName,
                                    ...item,

                                });
                            }



                            // this.tabList.forEach(attr => {
                            //     if( attr.commodityColourId ==  item.commodityColourId 
                            //         && attr.commodityMaterialId == item.commodityMaterialId 
                            //         && attr.commoditySeriesId == item.commoditySeriesId
                            //         && attr.commodityCode == item.commodityCode
                            //     ) { // 材质颜色系列编号
                            //         console.log("有数据且相同",attr,item);
                                    
                            //         attr.purchaseNumber += item.purchaseNumber; // tabList的数量 += 采购申请的数量
                            //     }else {
                            //         console.log("有数据但不相同",attr,item);
                            //         this.tabList.push({
                            //             commoditycolourList: res[0].data,
                            //             commodityseriesList: res[1].data,
                            //             commoditymaterialList: res[2].data,
                            //             brand_name: item.brandName,
                            //             category_name: item.categoryName,
                            //             ...item
                            //         });
                            //     }
                            // })
                        


                        }
                    });
                })
            }
          // this.tabList.push(res.data.rows);
        },


        // 保存 and 提交
        submitForm(formName,type) {
            if(this.tabList.length == 0) {
                this.$message.warning("请选择商品");
                return;
            }
            
            // 附件
            // let stockUpApplyFile = this.$refs.stockform.imgArr.map(file => {
            //     return {
            //         fileUrl: file.url,
            //         sourceName: file.name
            //     };
            // });
                
             if(this.isEdit) {
                //  if ( this.$refs.stockform.delImgArr.length > 0) {
                //     //有删除旧图片
                //     console.log("有删除旧图片",this.$refs.stockform.delImgArr);
                //      this.$refs.stockform.delImgArr.forEach(item => {
                //         removeAccessoryImg(item).then(res => {});
                //     });
                // }
             }
            
             let flag = this.tabList.every(item => {
                let flag1 = false;
                let flag2 = false;
                let flag3 = false;
                 
                if(item.commoditycolourList.length != 0) { // 颜色
                    if(item.commodityColourId) {
                        flag1 = true;
                    }
                }else {
                    flag1 = true;
                }

                if(item.commoditymaterialList.length != 0) { // 材质
                    if(item.commodityMaterialId) {
                        flag2 = true;
                    }
                }else {
                    flag2 = true;
                }

                if(item.commodityseriesList.length != 0) { // 系列
                    if(item.commoditySeriesId) {
                        flag3 = true;
                    }
                }else {
                    flag3 = true;
                }

                return flag1 && flag2 && flag3;
            })

            if(flag) { // 每一个商品的材质颜色系列有可选项并且选中了

            }else {
                this.$message.warning("请添加商品的材质颜色系列");
                return;
            }

            let purnumFlag = this.tabList.every(item => {
                if(item.purchaseNumber < 1) {
                    return false;
                }else {
                    return true;
                }

                // return item.purchaseNumber;
            });

            if(purnumFlag) { // table的每一个purchaseNumber都有

            }else {
                this.$message.warning("数量不得为空或者小于1");
                return;
            }
            console.log(purnumFlag,"purnumFlag");
            

            this.$refs.stockform.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let data = { 
                        organizationId:  Number(this.$refs.stockform.purchase.storeId), // //采购机构
                        purchaseAt: Number(this.$refs.stockform.purchase.applyUserIdNum), //采购人ID
                        brandId :  Number(this.$refs.stockform.purchase.brandId) , // 品牌ID 
                        categoryId :  Number(this.$refs.stockform.purchase.commodityCategoryId) , // 品类ID  
                        // remark: this.$refs.stockform.purchase.applyRemark, // 申请理由
                        companyId: this.$refs.stockform.purchase.companyId, // 供应商
                        predictArrivalTime  :  this.$refs.stockform.purchase.predictArrivalTime, // 预计到货开始时间 
                        stockUpApplyId: this.$refs.stockform.purchase.stockUpApplyIdsarr, //采购申请ID数组
                        isSubmit: type,    //是否提交，0保存、1提交
                        isPurchase: type,   //是否采购，当提交的时候，传1，保存传0

                        storageId: this.$refs.stockform.purchase.storageId, // 仓库
                        purchaseContractCode:  this.$refs.stockform.purchase.purchaseContractCode, // 采购合同号
                        organizationId:  this.$refs.stockform.purchase.organizationId, // 组织结构
                        // applyUserId :  this.$refs.stockform.purchase.applyUserId , // 申请人ID
                        purchaseNumber: this.purchaseNumber,
                        purchaseCost: this.purchaseCost,
                        

                        // applyStatus: this.isEdit ?  null : Number(type), // 新增的保存和提交按钮 如果是编辑页面就是null
                        // applyCode: this.isEdit ? this.$refs.stockform.purchase.applyCode : null, // 申请单号
                        
                        // stockUpApplyFile, // 附件集合
                        stockUpGoodsList:  this.tabList.length != 0 ? this.tabList : null, // 商品列表
                    };

                    this.btnLoading = true;

                    if(this.isEdit) { // 编辑页面
                        // console.log(JSON.stringify(data),"data++++++++++++");
                        data.stockUpPurchaseOrderId = this.stockUpPurchaseOrderId;

                        updateStockUpPurchaseOrder(data).then(res => {
                            if(res.status == 200) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.btnLoading = false;
                                this.$router.push("/stockmanagement/purchasemanagement"); // 跳转到采购订单页面
                            }
                        }).catch(err => {
                            this.btnLoading = false;
                            console.log('备货采购申请管理 备货管理 修改备货申请 views/stockmanagement/stockpurchase/stockpurchase', err);
                        })
                    }else { // 新增
                        getUUID({ serialNumber: 'PO' }).then(res => {
                            if(res.status == 200) {
                                data.stockUpPurchaseOrderCode = res.data;

                                insertStockUpPurchaseOrder(data).then(res => {
                                    if(res.status == 200) {
                                            if(res.message == '拆单成功') {
                                                this.$message({
                                                    message: '操作成功',
                                                    type: 'success'
                                                });
                                                this.btnLoading = false;
                                            }else if(res.message == '采购单号已存在'){
                                                this.$message.warning("采购单号已存在");
                                                this.btnLoading = false;
                                            }

                                            this.$router.push("/stockmanagement/purchasemanagement"); // 跳转到采购订单页面
                                    }
                                }).catch(err => {
                                    this.btnLoading = false;
                                    console.log('备货采购申请管理 备货管理 新增备货申请 views/stockmanagement/stockpurchase/stockpurchase', err);
                                })
                            }
                        })
                    }
                } else {
                    return false;
                }
            });
        },
        // 取 消
        cancel(formName) {
            this.$router.push("/stockmanagement/purchasemanagement"); // 跳转到采购订单页面
        },

        getRowKeys(row) {
            return row.commodityId;
        },

        companyChange(val,attr) {
            // console.log(val,attr,"在父组件供应商");
            
            // if(this.$refs.stockform.isExit && this.tabList && this.tabList.length != 0) { // 删除列表数据
            //     this.$confirm('是否确定删除列表数据?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.tabList = [];
            //     }).catch(() => {
            //         this.$refs.stockform.purchase.companyId = attr;

            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         }); 
            //     });    

            //     return;
            // }
            this.companyIndex += 1; 

            if(this.isEdit && this.companyIndex != 1) {
                this.tabList = [];
            }else if(this.$route.path == "/stockmanagement/addpurchase") {
                this.tabList = [];
            }
            this.$refs.stockTable.clearSelection();
        },
        brandChange(val,attr) {
            // console.log(val,attr,"在父组件品牌");

            //  if(this.$refs.stockform.isExit && this.tabList && this.tabList.length != 0) { // 删除列表数据
            //     this.$confirm('是否确定删除列表数据?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.tabList = [];
            //     }).catch(() => {
            //         this.$refs.stockform.purchase.brandId = attr;

            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         }); 
            //     });    

            //     return;
            // }
            this.brandIndex += 1; 

            if(this.isEdit && this.brandIndex != 1) {
                this.tabList = [];
            }else if(this.$route.path == "/stockmanagement/addpurchase") {
                this.tabList = [];
            }
            this.$refs.stockTable.clearSelection();
        }, 
        commodityChange(val,attr) {
            // console.log(val,attr,"在父组件品类");

            // if(this.$refs.stockform.isExit && this.tabList && this.tabList.length != 0) { // 删除列表数据
            //     this.$confirm('是否确定删除列表数据?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.tabList = [];
            //     }).catch(() => {
            //         this.$refs.stockform.purchase.commodityCategoryId = attr;

            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         }); 
            //     });    

            //     return;
            // }
            this.commodityIndex += 1; 

            if(this.isEdit && this.commodityIndex != 1) {
                this.tabList = [];
            }else if(this.$route.path == "/stockmanagement/addpurchase") {
                this.tabList = [];
            }
            this.$refs.stockTable.clearSelection();

        },

        // 点击添加商品
        addProduct() {
            // if(this.$refs.stockform.isExit && this.tabList && this.tabList.length != 0) { // 删除列表数据
            //     this.$confirm('是否确定删除列表数据?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.tabList = [];
            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         }); 
            //     });    

            //     return;
            // }
            
            if(this.$refs.stockform.purchase.brandId && this.$refs.stockform.purchase.commodityCategoryId && this.$refs.stockform.purchase.companyId) {
                this.productList.brandId =  this.$refs.stockform.purchase.brandId; // 品牌
                this.productList.commodityCategoryId = this.$refs.stockform.purchase.commodityCategoryId; // 品类
                this.productList.companyId = this.$refs.stockform.purchase.companyId; // 供应商

            }else {
                this.$message.warning("请选择品牌品类供应商");
                return;
            }

            // if(this.$refs.stockform.brandId && this.$refs.stockform.commodityCategoryId && this.$refs.stockform.companyId) {
            //     this.productList.brandList.push(brandId)// 品牌数组 可不传（不传默认为全部品牌）
            //     this.productList.categoryList.push(commodityCategoryId) // 品类数组 可不传（不传默认为全部品类）
                
            // }else {
            //     this.$message.warning("请选择品牌品类供应商");
            // }

            if(this.elsectVal.length > 0) {
                this.$message({
                    message: '请勿选择商品',
                    type: 'warning'
                });
                return;
            }
            this.productDialog = true;
            this.productList.selectedCommodities = this.commodityIds;
        },
        // 选择商品 复选框
        selectionChange(val) {
            this.selectedProducts = val;
        },
        // 选择商品的确定操作按钮
        selectProductConfirm() {
            if (this.selectedProducts.length) {
                this.selectedProducts.forEach(item => {
                   
                    let data = {
                        commodityId: item.commodityId ? item.commodityId : ''
                    };
                    
                    
                    let p1 = new Promise((resolve, reject) => {
                        listCommodityColour(data).then(attr => {
                            resolve(attr);
                        });
                    });

                    let p2 = new Promise((resolve, reject) => {
                        listCommoditySeries(data).then(attr => {
                            resolve(attr);
                        });
                    });

                    let p3 = new Promise((resolve, reject) => {
                        listCommodityMaterial(data).then(attr => {
                            resolve(attr);
                        });
                    });

                    Promise.all([p1, p2, p3]).then(res => {
                        if(this.tabList && this.tabList.length != 0) {// // 如果tabList有数据
                            
                            let flag = this.tabList.some(attr => { // 要添加的这一条数据与tabList的数据至少有一条相同
                                return   (attr.commodityColourId ==  item.commodityColourId 
                                    && attr.commodityMaterialId == item.commodityMaterialId 
                                    && attr.commoditySeriesId == item.commoditySeriesId
                                    && attr.commodityCode == item.commodityCode);
                            });

                            if(flag) {// 至少有一条相同
                                this.tabList.forEach(attr => {
                                    if( attr.commodityColourId ==  item.commodityColourId 
                                        && attr.commodityMaterialId == item.commodityMaterialId 
                                        && attr.commoditySeriesId == item.commoditySeriesId
                                        && attr.commodityCode == item.commodityCode
                                    ) { // 材质颜色系列编号
                                        
                                        attr.purchaseNumber += item.purchaseNumber; // tabList的数量 += 采购申请的数量
                                    }
                                })
                            }else { // 一条也不相同
                                if(!item.costPrice) {
                                    item.costPrice = 0;
                                }
                                item.costing = item.costPrice;
                                // 颜色
                                if(res[0].data && res[0].data.length != 0 &&(!item.commodityColourId)) {
                                    item.commodityColourId = res[0].data[0].colourId
                                }
                                // 材质
                                if(res[2].data && res[2].data.length != 0 &&(!item.commodityMaterialId)) {
                                    item.commodityMaterialId = res[2].data[0].materialId
                                }
                                // 系列
                                if(res[1].data && res[1].data.length != 0 &&(!item.commoditySeriesId)) {
                                    item.commoditySeriesId = res[1].data[0].seriesId
                                }

                                this.tabList.push({
                                    commoditycolourList: res[0].data,
                                    commodityseriesList: res[1].data,
                                    commoditymaterialList: res[2].data,
                                    brand_name: item.brandName,
                                    category_name: item.categoryName,
                                    // purchaseNumber: 1,
                                    // purchaseNumber: '',
                                    ...item
                                });

                                console.log(this.tabList,"一条也不相同");
                                
                            }


                            // this.tabList.forEach(attr => {
                            //     if( attr.commodityColourId ==  item.commodityColourId 
                            //         && attr.commodityMaterialId == item.commodityMaterialId 
                            //         && attr.commoditySeriesId == item.commoditySeriesId
                            //         && attr.commodityCode == item.commodityCode
                            //     ) { // 材质颜色系列编号
                            //         attr.purchaseNumber += 1;
                            //     }else {
                            //         if(!item.costPrice) {
                            //             item.costPrice = 10;
                            //         }

                            //         // 颜色
                            //         if(res[0].data && res[0].data.length != 0) {
                            //             item.commodityColourId = res[0].data[0].colourId
                            //         }
                            //         // 材质
                            //         if(res[2].data && res[2].data.length != 0) {
                            //             item.commodityMaterialId = res[2].data[0].materialId
                            //         }
                            //         // 系列
                            //         if(res[1].data && res[1].data.length != 0) {
                            //             item.commoditySeriesId = res[1].data[0].seriesId
                            //         }

                            //         this.tabList.push({
                            //             inventoryNumber: 0,
                            //             commoditycolourList: res[0].data,
                            //             commodityseriesList: res[1].data,
                            //             commoditymaterialList: res[2].data,
                                        
                            //             ...item,
                            //             purchaseNumber: 0,
                            //         });
                            //     }
                            // })
                        }else { // 如果tabList没有数据
                            if(!item.costPrice) {
                                item.costPrice = 0;
                            }
                            item.costing = item.costPrice;
                            // 默认的给颜色材质系列给第一条数据
                            // 颜色
                            if(res[0].data && res[0].data.length != 0 && (!item.commodityColourId)) {
                                item.commodityColourId = res[0].data[0].colourId
                            }
                            // 材质
                            if(res[2].data && res[2].data.length != 0 && (!item.commodityMaterialId)) {
                                item.commodityMaterialId = res[2].data[0].materialId
                            }
                            // 系列
                            if(res[1].data && res[1].data.length != 0 && (!item.commoditySeriesId)) {
                                item.commoditySeriesId = res[1].data[0].seriesId
                            }
                            // console.log(this.tabList,item,"如果tabList没有数据2222222222");
                            this.tabList.push({
                                inventoryNumber: 0,
                                commoditycolourList: res[0].data,
                                commodityseriesList: res[1].data,
                                commoditymaterialList: res[2].data,
                                ...item,
                                // purchaseNumber: 0,
                                // purchaseNumber: '',
                            });

                            // console.log(this.tabList,item,"如果tabList没有数据");
                        }


                    });

                    
                    // this.listCommodityColour(item);  // 商品颜色
                    // this.listCommoditySeries(item);  // 商品系列
                    // this.listCommodityMaterial(item);  // 商品材质

                    // console.log(this.tabList,"this.tabList 563454");
                })
                // console.log(this.selectedProducts,this.tabList,"this.tabList 8888888899");
                
                
                // this.tabList.forEach(item => {
                //     this.moneyNum = this.moneyNum + item.purchaseNumber * item.costPrice
                // })

                this.productDialog = false;
            } else {
                this.$message.warning('请选择商品');
            }
        },
        // 删除
        deleteGoods() {
            if(this.elsectVal && this.elsectVal.length < 1) {
                this.$message.warning("抱歉，请进行选择");
                return;
            }

            this.elsectVal.forEach(item => {
                this.tabList = this.tabList.filter(itm => {
                    return item.commodityId != itm.commodityId
                })
            })
            this.$refs.stockTable.clearSelection();


        },

        // 修改 and 查看备货申请 and 备货审核 回显信息
        getStockUpApply() {
            console.log("yunxinglema  ***mama");
            
            let data = {
                stockUpApplyId: this.$route.query.stockUpApplyId,
            }
            getStockUpApply(data).then(res => {
                if (res.status == 200) {
                    
                    this.viewstockObj = res.data;
                    // this.tabList = this.viewstockObj.stockUpGoodsVOList;

                    if(this.viewstockObj.stockUpGoodsVOList && this.viewstockObj.stockUpGoodsVOList.length != 0) {
                        console.log("执行了",this.viewstockObj.stockUpGoodsVOList.length,"this.viewstockObj.stockUpGoodsVOList.length");
                        
                        this.viewstockObj.stockUpGoodsVOList.forEach(item => {
                            let data = {
                                commodityId: item.commodityId ? item.commodityId : ''
                            };
                            if(data.commodityId != '') {
                                let p1 = new Promise((resolve, reject) => {
                                    listCommodityColour(data).then(attr => {
                                        resolve(attr);
                                    });
                                });

                                let p2 = new Promise((resolve, reject) => {
                                    listCommoditySeries(data).then(attr => {
                                        resolve(attr);
                                    });
                                });

                                let p3 = new Promise((resolve, reject) => {
                                    listCommodityMaterial(data).then(attr => {
                                        resolve(attr);
                                    });
                                });

                                Promise.all([p1, p2, p3]).then(res => {
                                    this.tabList.push({
                                        inventoryNumber: 0,
                                        commoditycolourList: res[0].data,
                                        commodityseriesList: res[1].data,
                                        commoditymaterialList: res[2].data,
                                        costPrice: item.costing,
                                        ...item
                                    });
                                });
                            }
                        })
                    }
                    // this.purchase = this.viewstockObj.stockUpApply; // 对象
                    // this.fileList = this.viewstockObj.accessoryList; // 附件
                }
            }).catch(error => {
                console.log("备货采购申请管理 备货管理 查看备货申请 views/stockmanagement/stockpurchase/components/stockTable",error);
            });
        },
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;

            console.log(this.elsectVal,"elsectVal");
        },

        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},



    }
};
</script>
<style scoped lang='scss'>
    .addrecommender {
        .purchasefrom {
            .demo-form-inline {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                >div {
                    width: 48%;
                }
                >div.input_100 {
                    width: 100% !important;
                }
            }
        }
    }

.cards {
    margin-top: 20px;
    
}
.moduleHeader {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    .purchaseLeft {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        .el-input__inner {
            min-width: 120px;
        }
    }
    .btnList {
        display: flex;
        flex-wrap: nowrap;

    }
}
.moduleHeader .label{
    text-align: right;
    white-space: nowrap;
    padding-right: 12px;
}

.bottom_btnlist {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid red;
}
.btn_list_1 {
    margin-bottom: 20px;
}


</style>


<style lang="scss">
    .stockTable{
        .stock_table {
            .el-input__inner {
                // height: 23px;
                // line-height: 23px;
                // border: 0px;
                // appearance: none;
                background: transparent;
            }
            // .el-input__suffix {
            //     // display: none;
            // }
            tr {
                div.cell {
                    div.el-select--small{
                        box-sizing: border-box;
                        // height: 23px;
                        div.el-input--suffix{
                            box-sizing: border-box;
                            // height: 23px;
                            .el-input__inner{
                                box-sizing: border-box;
                                // height: 23px;
                                // border: 0;
                                // appearance: none;
                                // background: #f0f5f9;
                            }
                            // span.el-input__suffix {
                            //     // display: none;
                            // }
                        }
                    }
                    div.el-input--small{
                        box-sizing: border-box;
                        // height: 23px;   
                        .el-input__inner{
                            box-sizing: border-box;
                            // height: 23px;
                            // border: 0;
                            // appearance: none;
                            // background: #f0f5f9;
                        }
                    }
                    div.el-input-number {
                        box-sizing: border-box;
                        // height: 23px;
                    }
                }
                &.el-f0 {
                    div.cell {
                        div.el-select--small{
                            div.el-input--suffix{
                                .el-input__inner{
                                    background: #f0f5f9;
                                }
                            }
                        }
                        div.el-input--small{
                            .el-input__inner{
                                background: #f0f5f9;
                            }
                        }
                        div.el-input-number {
                            box-sizing: border-box;
                            height: 23px;
                            background: #f0f5f9;
                        }
                    }
                }
            }
            .el-table--enable-row-hover .el-table__body tr:hover>td {
                div.el-select--small{
                    div.el-input--suffix{
                        .el-input__inner{
                            transition: background-color .25s ease;
                            background-color: #F5F7FA;
                        }
                    }
                }
                div.el-input--small{
                    .el-input__inner{
                        transition: background-color .25s ease;
                        background-color: #F5F7FA;
                    }
                }
            }
        }
    }
    .purchaseLeft {
        .el-input__inner {
            min-width: 120px;
        }
    }
</style>



