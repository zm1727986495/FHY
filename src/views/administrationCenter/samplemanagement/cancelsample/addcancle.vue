<template>
  <div class="smapleCancleTable">
    <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="lvs cards">
        <!-- 客户基本信息 -->
        <div class="bordermodel">
            <div class="iconBox m-bottom">
                <i class="Icon"></i>
                <span>撤样信息</span>
            </div>

            <!-- 撤样的输入框列表 -->
            <sampleform ref="ruleForm"></sampleform>


            <!-- 地址弹框 -->
            <el-dialog
                title="地址管理"
                :visible.sync="dialogVisible"
                width="50%">
                <div>
                    <addresselection ref="adddatas" :customerId="customerId" v-if="dialogVisible"></addresselection>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="subminaddchange">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 地址弹框 -->
            <el-dialog
                title="地址管理"
                :visible.sync="orderdialogVisible"
                width="50%">
                <div>
                    <addresselection ref="orderadddatas" :customerId="customerId" v-if="orderdialogVisible"></addresselection>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="orderdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="ordersubminaddchange">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 客户信息地址 -->
            <el-dialog
                title=""
                :visible.sync="mapDialogVisible"
                width="50%"
                v-if="mapDialogVisible">
                <div class="titlecals" style="margin-left:15px">地图定位</div>
                
                    <baidu-map class="map"
                        :center="center"
                        :zoom="15"
                        :keyboard="true"
                        @moving="syncCenterAndZoom" 
                        @moveend="syncCenterAndZoom" 
                        @zoomend="syncCenterAndZoom"
                        @click="getClickInfo"
                        :scroll-wheel-zoom="true"
                        :double-click-zoom=false>
                        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                            <!-- v-on:keyup.enter="mapEnter()" v-on:keyup.38="mapEnter" v-on:keyup.40="mapEnter"    -->
                        <bm-control>
                            <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}"  >
                                <input type="text" v-model="mapText"  placeholder="请输入搜索关键字"  class="serachinput">
                            </bm-auto-complete>
                        </bm-control>
                        <bm-local-search :keyword="keyword" :auto-viewport="true" @infohtmlset="infohtmlsets" style="display:none"></bm-local-search>
                    </baidu-map>
                <div slot="footer" style="margin-top: 0px;">
                    <Button @click="cancel" type="ghost" style="width: 60px;height: 36px;">取消</Button>
                    <Button type="primary" style="width: 60px;height: 36px;" @click="confirm">确定</Button>
                </div>
            </el-dialog>

        </div>

        <!-- 撤样清单 -->
        <div class="bordermodel">
            <div class="iconBox m-bottom">
                <i class="Icon"></i>
                <span>撤样清单</span>
            </div>

             <div class="btn_list_1 m-bottom10" v-if="!isView">
                <el-button size="small" class="button-96" @click="addProduct">添加商品</el-button>   
                <el-button size="small" class="button-96" @click="deleteGoods">删除</el-button>
            </div>
            <div class="totalSalesPrice">
                <span>总售价：</span>
                <el-input v-model.number="totalPrices"></el-input>
                <p>元</p>
            </div>
            <el-dialog title="商品列表"   custom-class="customDialogTitle" :visible.sync="productDialog" width="1024px" top="2vh" class="lvs">
                <!-- <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="productList" v-if="productDialog"></select-commodity> -->
                <div class="queryForm">
                    <el-row :gutter="10" ref="queryForm">
                    <el-col :span="span">
                        <el-input v-model.trim="queryForm.names" clearable placeholder="商品名称 / 商品编码" :size="size"></el-input>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="queryForm.colourId" clearable placeholder="颜色" :size="size">
                        <el-option v-for="item in colorList" :key="item.id" :value="item.id" :label="item.dictName"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="queryForm.materialId" clearable placeholder="材质" :size="size">
                        <el-option v-for="item in materialList" :key="item.id" :value="item.id" :label="item.dictName"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="queryForm.seriesId" clearable placeholder="系列" :size="size">
                        <el-option v-for="item in seriesList" :key="item.id" :value="item.id" :label="item.dictName"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="queryForm.brandId" clearable placeholder="品牌" :size="size">
                        <el-option v-for="item in brandList" :key="item.brandId" :value="item.brandId" :label="item.brandName"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="queryForm.commodityCategoryId" clearable placeholder="品类" :size="size">
                        <el-option v-for="item in categoryList" :key="item.commodityCategoryId" :value="item.commodityCategoryId" :label="item.categoryName"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-button type="warning" @click="searchSubmit" :size="size">查询</el-button>
                        <el-button type="primary" @click="resetSubmit" :size="size">重置</el-button>
                    </el-col>
                    </el-row>
                </div>

                <div class="table_list lvs attribute">
                    <el-table 
                    border 
                    :row-key="getRowKeys"
                    :row-class-name="tableRowClassName"
                    @selection-change="selectionChange"
                    :data="tableData">
                    <el-table-column type="selection" width="55"  :reserve-selection="true"></el-table-column>
                    <el-table-column type="index" width="55"></el-table-column>
                    <el-table-column prop="commodityCode" label="商品编码" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commodityName" label="商品名称" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commodityModel" label="型号" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commodityPrice" label="单价" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="valuationMethod" label="计价方式" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="classifyName" label="分类" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="constructionPeriod" label="工期" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column 
							width="240" prop="seriesId"
							label="系列"
							sortable align="center">
							<template  slot-scope="scope">
								<el-select :size="size" v-model="scope.row.seriesId"  placeholder="请选择系列">
									<el-option 
										v-for="(item,index) in scope.row.commodityseriesList" 
										:key="index" 
										:label="item.seriesName" :value="item.seriesId">
									</el-option>
								</el-select>
							</template>
						</el-table-column>

						<el-table-column
							width="240" prop="materialId"
							label="材质"
							sortable align="center">
							<template  slot-scope="scope">
								<el-select :size="size" v-model="scope.row.materialId"  placeholder="请选择材质">
									<el-option 
										v-for="item in scope.row.commoditymaterialList" 
										:key="item.materialId" 
										:label="item.materialName" :value="item.materialId">
									</el-option>
								</el-select>
							</template>
						</el-table-column>

						<el-table-column
							width="240" prop="colourId"
							label="颜色"
							sortable align="center">
							<template  slot-scope="scope">
								<!-- <div>---{{scope.row.commoditycolourList}}---</div> -->
								<el-select :size="size" v-model="scope.row.colourId"  placeholder="请选择颜色">
									<el-option  
										v-for="(item,index) in scope.row.commoditycolourList" 
										:key="index" 
										:label="item.colourName" :value="item.colourId">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
                    <el-table-column prop="commodityUnit" label="单位" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commodityWide" label="宽" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commodityHigh" label="高" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commodityLong" label="深" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commodityThick" label="厚" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="状态" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                        <span v-if='scope.row.status==0'>在产</span>
                        <span v-else-if='scope.row.status==1'>预计停产</span>
                        <span v-else>停产</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="commodityDescribe" label="备注" :width="columnWidth" :align="columnAlign" sortable show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="currentPage1"
                        :pageSize="pageSize1"
                        :total="total1"
                        @sizeChange="sizeChange1"
                        @currentChange="currentChange1">
                    </pagination>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="selectProductConfirm">确定</el-button>
                    <el-button  @click="productDialog = false">取消</el-button>
                </div>
            </el-dialog>

            <!-- table表格 -->
            <div class="table_list lvs attribute m-top20 samplecancle_table">
                <el-table 
                    border   :row-key="getRowKeys"
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    :data="tabList" 
                    style="width: 100%;" ref="cancleSampleTable">
                    <el-table-column type="selection" width="55"  :reserve-selection="true"></el-table-column>
                    <el-table-column type="index" width="55"></el-table-column>
                    <el-table-column width="240" prop="purchaseNumber" label="数量" sortable align="center">
                        <template  slot-scope="scope">
                            <el-input-number
                                class="width-100"
                                :controls="false"  placeholder="数量"
                                v-model="scope.row.purchaseNumber"
                                :precision="0"
                                :min="1"
                                size="mini"
                            ></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column width="240" prop="commodityCode" label="商品编码" sortable align="center"></el-table-column>
                    <el-table-column width="240" prop="commodityName" label="名称" sortable align="center"></el-table-column>
                    <el-table-column width="240" prop="brand_name" label="品牌" sortable align="center"></el-table-column>
                    <el-table-column width="240" prop="category_name" label="品类" sortable align="center"></el-table-column>
                    <el-table-column width="240" prop="commodityModel" label="型号" sortable align="center"></el-table-column>
                    <el-table-column  width="240" prop="seriesId" label="系列" sortable align="center">
                        <template  slot-scope="scope">
                            <el-select :size="size" v-model="scope.row.seriesId"  placeholder="请选择系列">
                                <el-option 
                                    v-for="(item,index) in scope.row.commodityseriesList" 
                                    :key="index" 
                                    :label="item.seriesName" :value="item.seriesId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column width="240" prop="materialId" label="材质" sortable align="center">
                        <template  slot-scope="scope">
                            <el-select :size="size" v-model="scope.row.materialId"  placeholder="请选择材质">
                                <el-option 
                                    v-for="item in scope.row.commoditymaterialList" 
                                    :key="item.materialId" 
                                    :label="item.materialName" :value="item.materialId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column width="240" prop="colourId" label="颜色" sortable align="center">
                        <template  slot-scope="scope">
                            <!-- <div>---{{scope.row.commoditycolourList}}---</div> -->
                            <el-select :size="size" v-model="scope.row.colourId"  placeholder="请选择颜色">
                                <el-option  
                                    v-for="(item,index) in scope.row.commoditycolourList" 
                                    :key="index" 
                                    :label="item.colourName" :value="item.colourId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column width="240" prop="commodityUnit" label="单位" sortable align="center"></el-table-column>
                    <el-table-column width="240" prop="commodityWide" label="宽" sortable align="center">
                        <template  slot-scope="scope">
                            <el-input-number
                                class="width-100"
                                :controls="false"  placeholder="深"
                                v-model="scope.row.commodityWide"
                                :precision="2"
                                :min="0"
                                size="mini"
                            ></el-input-number>
                            <!-- <el-input v-model="scope.row.commodityWide" :size="size" placeholder="宽"></el-input> -->
                        </template>
                    </el-table-column>
                    <el-table-column width="240" prop="commodityHigh" label="高" sortable align="center">
                        <template  slot-scope="scope">
                            <el-input-number
                                class="width-100"
                                :controls="false"  placeholder="深"
                                v-model="scope.row.commodityHigh"
                                :precision="2"
                                :min="0"
                                size="mini"
                            ></el-input-number>
                            <!-- <el-input v-model="scope.row.commodityHigh" :size="size" placeholder="高"></el-input> -->
                        </template>
                    </el-table-column>
                    <el-table-column width="240" prop="commodityLong" label="深" sortable align="center">
                        <template  slot-scope="scope">
                            <el-input-number
                                class="width-100"
                                :controls="false"  placeholder="深"
                                v-model="scope.row.commodityLong"
                                :precision="2"
                                :min="0"
                                size="mini"
                            ></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column width="240" prop="commodityThick" label="厚" sortable align="center">
                        <template  slot-scope="scope">
                            <el-input-number
                                class="width-100"
                                :controls="false"  placeholder="厚"
                                v-model="scope.row.commodityThick"
                                :precision="2"
                                :min="0"
                                size="mini"
                            ></el-input-number>
                        </template>
                    </el-table-column>
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



        <!-- 附件管理 -->
        <div class="bordermodel">
            <div class="iconBox m-bottom">
                <i class="Icon"></i>
                <span>附件管理</span>
            </div>

            <el-upload
                class="upload-demo"
                action="string"
                :http-request="upEffectFile"
                :file-list="fileList"
                :on-remove="effectRemove"
                >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>

        </div>

    </el-card>
 
    <div class="bottom_btnlist">
        <el-button type="primary" @click="submitForm('sampleForm',1)" :loading="btnLoading">保 存</el-button>
        <el-button type="primary" @click="submitForm('sampleForm',2)" :loading="btnLoading">提 交</el-button>
        <el-button @click="cancle('sampleForm')">取 消</el-button>
    </div>

  </div>
    
  
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import addresselection from '../../../components/addresselection';
import sampleform from "../components/sampleform";
import spot from '@/assets/images/spot.png';
import selectCommodity from "@/views/components/selectCommodity"; // 选择商品弹框
import {
  baiduMap,
} from 'src/api/pulicJava.js';

import { 
    listCommodityColour, // 商品颜色查询
    listCommoditySeries, // 商品系列查询
    listCommodityMaterial, // 商品材质查询
} from 'api/administrationCenter/stockmanagement/index';

import { 
    addCancelSampleSingle, // 新增撤样
    editCancelSampleSingle, // 修改撤样
    listCancelCommodity//获取门店商品
} from 'api/administrationCenter/samplemanagement/index';

import {listBaseDict,listCategory, listBrand, getUUID } from 'api/pulicJava';
import { put } from "@/utils/pubilcFn";


export default {
    components: {
        breadcrumb,
        pagination,
        addresselection,
        sampleform,
        selectCommodity, // 选择商品弹框 
    },
  // name: 'brandmanagement',
  data() {
    return {
       navList: [],  //头部面包屑
    cancelSampleSingleCode: '', // 撤样的编辑用
        // 分页
		currentPage:1,
		pageSize:10,
        total:0,
        btnLoading: false, // 按钮的loading Flag
        // 添加商品弹框列表分页
        currentPage1:1,
		pageSize1:10,
        total1:0,

        productDialog: false, // 商品弹框

        elsectVal: [], // 表格选中的数据组成的数组
        // 商品
        span: 6,
        size: 'medium',
        tableData:[],//添加商品
        colorList: [],//颜色
        seriesList: [],//系列
        materialList: [],//材质
        brandList: [],//品牌
        categoryList: [],//品类
        totalPrices:'',//总售价
        columnAlign: 'center',
        columnWidth: 220,
        queryForm:{},//添加商品查询条件
        effectmapList:[],//上传文件
        productDialog: false,
        productList: {
            selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
            height: '350px', // 设置表格高度 可不传（弹出层最好传下）
            isDialog: true // 是否为弹出层（不传默认为页面）
        },
        selectedProducts: [], // 选择商品

       canclesample: {
            measure: 1,

        },// 撤样信息
        searchData: [],// 预计上样时间
        isView: false,
        tabList: [], // 表格
        labelPosition: 'right',
        
        typedata:[], // 撤样处理方式数据

        maps:'',//地图信息
        mapDialogVisible: false,
        ordermaps:'',//订单信息地图信息
        buildingNumber:'',//楼号
        unitNumber:'',//单元
        roomNumber:'',//室

        orderbuildingNumber:'',//楼号
        orderunitNumber:'',//单元
        orderroomNumber:'',//室
        orderdialogVisible: false,//订单信息地址列表按钮
        customerId: "",
        dialogVisible: false,
        orderdialogVisible: false,//订单信息地址列表按钮
        //百度地图
        mapText:'',
        center: {lng: 116.404, lat: 39.915},//经纬度
        ordercenter: {lng: 116.404, lat: 39.915},//经纬度
        zoom: 15,
       
     
        mapDialogVisible: false,
        ordermapDialogVisible: false,
        keyword: '',
        xqdataid: "",
        xqdatas: {},
        xqtabledata: [],
        storeCustomerId: "",

        fileList: [],
    };
  },
  
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    created(){
        this.getBaseDict('COMMODITY_COLOR');
        this.getBaseDict('COMMODITY_SERIES');
        this.getBaseDict('COMMODITY_MATERIAL');
        this.getBrandList()
        this.getCategoryList()
        
        if(this.$route.path ==  "/samplemanagement/editcancle") {
            this.getDetails(); //获取撤样详情
        } 
    },
    computed: {
        commodityIds() {
            let arr = [];
            this.tabList.forEach(item => {
                arr.push(item.commodityId);
            })
            return arr;
        }
    },
    methods: {
        // 基础字典查询（颜色、材质、系列）
        getBaseDict(dataType) {
          let params = {
            dataType: dataType
          }
          listBaseDict(params)
            .then(response => {
              if (dataType === 'COMMODITY_COLOR') {
                this.colorList = response.data;
              }
              if (dataType === 'COMMODITY_SERIES') {
                this.seriesList = response.data;
              }
              if (dataType === 'COMMODITY_MATERIAL') {
                this.materialList = response.data;
              }
            })
            .catch(error => {
              console.log('选择商品组件：getBaseDict' + error)
            })
        },
        // 获取全部品牌列表
        getBrandList() {
          listBrand()
            .then(response => {
              this.brandList = response.data;
            })
            .catch(error => {
              console.log('选择商品组件:getBrandList', error);
            })
        },
        // 获取全部品类列表
        getCategoryList() {
          listCategory()
            .then(response => {
              this.categoryList = response.data;
            })
            .catch(error => {
              console.log('选择商品组件:getCategoryList', error);
            })
        },
        getRowKeys(row) {
            return row.commodityId;
        },
        // 点击添加商品
    //   addProduct() {
    //     this.productDialog = true;
    //     this.selectList.selectedCommodities = this.commodityIds;
    //   },
    //   // 选择商品
    //   selectProductConfirm() {
    //     if (this.selectedProducts.length) {
    //       this.selectedProducts.forEach(item => {
    //         this.datas.push(item);
    //       })
    //       this.productDialog = false;
    //     } else {
    //       this.$message.warning('请选择商品');
    //     }
    //   },
    //   // 删除商品
    //   deleteProduct() {
    //     if (!this.selectedProductsPunish.length) {
    //       this.$message.warning('请选择要删除的商品');
    //       return;
    //     }
    //   },
    //   // 选择商品 复选框
    //   selectionChange(val) {
    //     this.selectedProducts = val;
    //   },
    //   // 选择商品 少选
    //   selectionChangePunish(val) {
    //     this.selectedProductsPunish = val;
    //   },
    //获取撤样详情
        getDetails(){
            let data = {
                cancelSampleSingleId : this.$route.query.cancelSampleSingleId
            }
            cancelSampleSingleDetail(data).then(res=>{
                this.cancelSampleSingleCode = res.data.cancelSampleSingleCode;// 编码

                this.fileList = res.data.cancelSampleSingleAcc; // 附件处理 
                this.fileList = this.fileList.map(item => {
                    return {
                        ...item,
                        name: item.sourceName,
                        url: item.fileUrl
                    }
                })

                // this.maps
            }).catch(error=>{
                console.error('获取撤样详情',error);
                
            })
        },
    
        //查询
        searchSubmit(){
            this.addProduct()
        },
        //重置
        resetSubmit(){
            this.queryForm = {}
        },
        // 获取弹框列表商品
        addProduct() {
            if(this.elsectVal.length > 0) {
                this.$message({
                    message: '请勿选择商品',
                    type: 'warning'
                });
                return;
            }
            if(!this.$refs.ruleForm.sample.storeId){
                this.$message.error('当前没有选择门店')
                return
            }
            let data = {
                ...this.queryForm,
                page:this.currentPage1,
                limit:this.pageSize1,
                storeId:this.$refs.ruleForm.sample.storeId
                // storeId: 182
            }
            listCancelCommodity(data).then(res=>{
                this.tableData = res.data.rows;
                this.total1 = res.data.total;
                
            }).catch(error=>{
                console.error('获取门店商品',error);
                
            })
            this.productDialog = true;
            this.productList.selectedCommodities = this.commodityIds;
        },
        // 选择商品 复选框
        selectionChange(val) {
            this.selectedProducts = val;
        },
        // 选择商品
        selectProductConfirm() {
            console.log(this.selectedProducts,this.tabList,"this.tabList 11111112343");
            if (this.selectedProducts.length) {
                this.selectedProducts.forEach(item => {

                    let data = {
                        commodityId: item.commodityId
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
                        this.tabList.push({
                            inventoryNumber: 0,
                            commoditycolourList: res[0].data,
                            commodityseriesList: res[1].data,
                            commoditymaterialList: res[2].data,
                            ...item
                        });

                    });
                })  
                this.total = this.selectedProducts.length;
                this.productDialog = false;
            } else {
                this.$message.warning('请选择商品');
            }
        },
         // 删除
        deleteGoods() {
            if(this.elsectVal.length < 1) {
                this.$message.warning("抱歉，请进行选择");
                return;
            }

            this.elsectVal.forEach(item => {
                this.tabList = this.tabList.filter(itm => {
                    return item.inventory_goods_id != itm.inventory_goods_id
                })
            })
            // this.$refs.cancleSampleTable.clearSelection()


        },

        //上传效果图
        upEffectFile(res) {
            put(res).then(data => {
                this.effectmapList.push(data);
            });
        },
        //删除效果图
        effectRemove(file) {
            let lengs = String(file.raw.lastModified).length;
            this.effectmapList = this.effectmapList.filter(item => {
                let str = item.name.substring(0, lengs);
                return str !== String(file.raw.lastModified);
            });
        }, 
        //提交 or 保存  isType 1保存 2提交
        submitForm(formName,isType) {
            if(!this.totalPrices || isNaN(this.totalPrices)){
                this.$message.error('填写总售价有误!')
                return
            }

            if((this.tabList.length == 0)) {                
                this.$message.warning("请选择商品");
                return;
            }
            this.$refs.ruleForm.$refs[formName].validate((valid) => {
                if (valid) {
                    /**
                     * 库存商品ID
                     * @param inventoryGoodsId
                     * 
                     * 数量
                     * @param cancelNumber
                     */
                    let arr = [];
                    this.tabList.forEach(item=>{
                        arr.push({
                            inventoryGoodsId:item.inventory_goods_id,
                            cancelNumber:item.purchaseNumber
                        })
                    })

                    // 处理附件
                    let ary= [];
                    this.effectmapList.forEach(item=>{
                        ary.push({
                            fileUrl: item.url,
                            sourceName: item.name
                        })
                    })
                    //结构赋值
                    let {
                        storeId,//门店id
                        brandId,//品牌id
                        commodityCategoryId,//品类id
                        type,//撤样处理方式
                        searchData,//预计撤样时间
                        desc,//撤样原因
                        customerdesc,//客户备注
                        buildingNumber,//楼号/区
                        unitNumber,//单元/号楼
                        roomNumber,//室
                        customerPhone,//申请人电话
                        customerName,//客户姓名
                        customerotherPhone,//客户电话
                        otherPhone//客户备用电话
                    } = this.$refs.ruleForm.sample;

                    let data = {
                        storeId,
                        brandId,
                        commodityCategoryId,
                        processMode:type,
                        predictDate:searchData,
                        storeCustomerId:'',//门店客户id
                        cancalCause:desc,
                        cancelSampleSingleAcc:ary,//附件
                        totalPrices:this.totalPrices,//总售价
                        cancelSampleDetails:arr,//商品信息
                        storageId:this.tabList[0].storageId//仓库ID
                    }

                    /**
                     * @params
                     * type  1撤样回库  2撤样销售
                     */
                    if(type == 2){ // 如果是2撤样销售
                        
                        //结构赋值
                        let {
                            provinceId,//省id
                            cityId,//市id
                            areaId//市id
                        } = this.$refs.ruleForm.khaddressdata;

                        data.customerRemark = customerdesc;
                        data.customerAddress = {
                            provinceId,//省id
                            cityId,//市id
                            areaId,//区/县id
                            address: this.$refs.ruleForm.maps+"#"+buildingNumber+"#"+unitNumber+"#"+roomNumber,//地址
                            longitude:this.$refs.ruleForm.khaddressdata.longitude,//经度
                            latitude:this.$refs.ruleForm.khaddressdata.latitude//纬度
                        }

                        data.customer = {
                            customerId:this.$refs.ruleForm.customerId,//客户ID
                            customerName,//客户姓名
                            customerPhone:customerotherPhone,//客户电话
                            otherPhone,//客户备用电话
                        }
                    }
                    this.btnLoading = true;
                    // isType 1保存 2提交 判断提交还是保存传的状态
                    if(isType == 1){
                        data.status = 4;
                    }else if(isType == 2){ // 提交
                        data.status = 2;
                        data.cancelSampleSingleStatus = 2;
                        data.status = 0;
                    }
                   
            
                    getUUID({serialNumber:'WS'}).then(res=>{
                        data.cancelSampleSingleCode = res.data;
                        addCancelSampleSingle(data).then(res => {
                            
                            if(res.status==200){
                                if(isType == 1){
                                    this.$message.success('保存成功!')
                                    this.btnLoading = false;
                                }else{
                                    this.$message.success('提交成功!')
                                    this.btnLoading = false;
                                }
                                this.$router.go(-1)
                            }else{
                                this.$message.error('提交失败!')
                                this.btnLoading = false;
                            }
                        }).catch(error => {
                            this.btnLoading = false;
                            console.error('样品管理:新增撤样 views/administrationCenter/samplemanagement/cancelsample/sampleform.vue', error);
                        });
                    })


                } else {
                    return false;
                }
            });
            

            // console.log(this.$refs.ruleForm.khaddressdata);
        
            // if(this.$route.path == "/samplemanagement/editcancle") { // 修改
            //     data.cancelSampleSingleCode = this.cancelSampleSingleCode;
            //     editCancelSampleSingle(data).then(res => {
            //         if(res.status==200){
            //             if(isType == 1){
            //                 this.$message.success('保存成功!')
            //             }else{
            //                 this.$message.success('提交成功!')
            //             }
            //             this.$router.go(-1)
            //         }else{
            //             this.$message.error('提交失败!')
            //         }
            //     }).catch(error => {
            //         console.error('样品管理:修改撤样 views/administrationCenter/samplemanagement/cancelsample/sampleform.vue', error);
            //     });
            // }else { // 保存
            // }
        },

        //弹出地图框
        maplocation(){
            this.mapDialogVisible=true
        },

        addressaler(){
            this.dialogVisible = true;
        },

        // 提交勾选地址列表
        subminaddchange(){
            let addarr = this.$refs.adddatas.selections
            if(addarr === undefined){
                this.$message({
                    message: '请选择地址信息',
                    type: 'warning'
                });
                return false;
            }
            if(addarr.length > 1){
                this.$message({
                    message: '只能选择一个地址信息',
                    type: 'warning'
                });
            }else if(addarr.length === 0){
                this.$message({
                    message: '请选择地址信息',
                    type: 'warning'
                });
            }else{
                this.dialogVisible = false;
                let datas = {
                    customerAddressId: addarr[0].customerAddressId
                }
                console.log(datas,"地址详情请求");
                getCustomerAddress(datas).then(res =>{
                    console.log(res);
                    if(res.status == 200){
                        this.khaddressdata = {
                            provinceId: parseInt(res.data.provinceId),//省
                            cityId: parseInt(res.data.cityId),//市
                            areaId: parseInt(res.data.areaId),//区
                            longitude: res.data.longitude+"",//经度
                            latitude: res.data.latitude+"",//纬度
                            address: res.data.address,//地址
                        }
                        let adddata = res.data.address
                        this.maps = adddata.substring(0,adddata.indexOf("#"));
                        this.buildingNumber = this.addsplicfun(adddata)[0];
                        this.unitNumber = this.addsplicfun(adddata)[1];
                        this.roomNumber = this.addsplicfun(adddata)[2];
                    }
                }).catch(error =>{
                    console.log(error,'订单管理:根据客户姓名获取客户信息 order/justOrder/addJustOrder.vue');
                })
                
            }
        },
        ordersubminaddchange(){
            let addarr = this.$refs.orderadddatas.selections
            if(addarr === undefined){
                this.$message({
                    message: '请选择地址信息',
                    type: 'warning'
                });
                return false;
            }
            if(addarr.length > 1){
                this.$message({
                    message: '只能选择一个地址信息',
                    type: 'warning'
                });
            }else if(addarr.length === 0){
                this.$message({
                    message: '请选择地址信息',
                    type: 'warning'
                });
            }else{
                this.dialogVisible = false;
                let datas = {
                    customerAddressId: addarr[0].customerAddressId
                }
                console.log(datas,"地址详情请求");
                getCustomerAddress(datas).then(res =>{
                    console.log(res);
                    if(res.status == 200){
                        this.ddaddressdata = {
                            provinceId: parseInt(res.data.provinceId),//省
                            cityId: parseInt(res.data.cityId),//市
                            areaId: parseInt(res.data.areaId),//区
                            longitude: res.data.longitude+"",//经度
                            latitude: res.data.latitude+"",//纬度
                            address: res.data.address,//地址
                        }
                        let adddata = res.data.address
                        this.ordermaps = adddata.substring(0,adddata.indexOf("#"));
                        this.orderbuildingNumber = this.addsplicfun(adddata)[0];
                        this.orderunitNumber = this.addsplicfun(adddata)[1];
                        this.orderroomNumber = this.addsplicfun(adddata)[2];
                    }
                }).catch(error =>{
                    console.log(error,'订单管理:根据客户姓名获取客户信息 order/justOrder/addJustOrder.vue');
                })
                
            }
        },
        syncCenterAndZoom (e) {
            
        },
        // 订单信息
        ordersyncCenterAndZoom (e) {
            
        },
        //地图点击事件
        getClickInfo (e) {
            console.log(e,12);
            this.center.lng = e.point.lng
            this.center.lat = e.point.lat
        },
        //点击所搜索红点
        infohtmlsets(poi){
            this.center = {};
            this.center.lat = poi.point.lat;
            this.center.lng = poi.point.lng;
        },
        //取消
        cancel() {
            this.mapDialogVisible = false
        },
        //地图确认按钮  
        confirm() {
            this.$emit('map-confirm', this.center)
            console.log(this.center);
            baiduMap(this.center.lng, this.center.lat).then(res=>{
                this.mapData = res;
                let str = "";
                str+=this.mapData.formatted_address+this.mapData.sematic_description+"#"+this.buildingNumber+"#"+this.unitNumber+"#"+this.roomNumber;
                this.khaddressdata = {
                    provinceId: parseInt(this.mapData.addressComponent.adcode.substring(0,2)+"0000"),//省
                    cityId: parseInt(this.mapData.addressComponent.adcode.substring(0,4)+"00"),//市
                    areaId: parseInt(this.mapData.addressComponent.adcode),//区
                    longitude: this.center.lng+"",//经度
                    latitude: this.center.lat+"",//纬度
                    address: str,//地址
                }
                this.maps = this.mapData.formatted_address+this.mapData.sematic_description;
                this.center = res.location;
                console.log(this.maps);
            }).catch(error =>{
                console.log(error)
            })
            this.mapDialogVisible=false
        },

        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
        },
        //订单信息地址取消
        ordercancel() {
            this.ordermapDialogVisible = false
        },
        // 表格勾选函数回调
        handleSelectionChange(val){
            this.elsectVal = val;

            console.log(this.elsectVal,"elsectVal");
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
        // 搜索条件获取
        searchdatas(){
            return {
                names: this.names,//订单编号
                createTimeStart: this.searchData[0],//创建时间
                createTimeEnd: this.searchData[1],
                orderStatusIds: this.orderStatus.join(","),//订单状态
        
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
            this.currentPage = 1;
            this.pageSize = val;
            
            let data = this.searchdatas();
            this.getList(data);
        },
        // 弹框列表分页函数回调
        currentChange1(val) {
            this.currentPage1 = val;
            this.addProduct()
        },
        // 弹框列表单页条数改变
        sizeChange1(val){
            this.currentPage1 = 1;
            this.pageSize1 = val;
            this.addProduct()

        },
        // 表格勾选函数回调
        // handleSelectionChange(val){
        //     this.tabSelect = val;
            
        //     console.log(this.tabSelect,"tabSelect");
        // },
        // 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.tabSelect.length > 1){
                this.$message({
                    message: '抱歉 只能选择一个',
                    type: 'warning'
                });
                return;
            } else if (this.tabSelect.length < 1){
                this.$message({
                    message: '抱歉， 请进行选择',
                    type: 'warning'
                });
                return;
            }
            return true;
        },
        //表格斑马线设置
        tableRowClassName({row, rowIndex}) {
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    }
};
</script>
<style scoped lang='scss'>
.totalSalesPrice{
    span{
        min-width: 60px;
    }
    p{
		padding-left: 12px;
	}
    display: flex;
    align-items: center;
    max-width: 200px;
}
.queryForm .el-select{
    width: 100%;
  }
    .cards{
        .bordermodel{
            .textitle{
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                .titlecals{
                    top: 0px;
                    padding: 20px 0;
                } 
            }
            .samplefrom{
                .el-form-item__label{
                    font-weight: 400;
                }
                .demo-form-inline{
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    >div{
                        width: 40%;
                    }
                }
                .input_100 {
                    width: 100% !important;
                }
            }
            .upload-demo{
                padding:20px 60px;
            }
        }
    }

    .bottom_btnlist{
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        // border: 1px solid red;
    }

    
    .map {
        width: 100%;
        height: 300px;
    }

    

        
</style>

<style lang="scss">
    .smapleCancleTable{
        .samplecancle_table {
            .el-input__inner {
                height: 23px;
                line-height: 23px;
                border: 0px;
                appearance: none;
                background: transparent;
            }
            .el-input__suffix {
                display: none;
            }
            tr {
                div.cell {
                    div.el-select--small{
                        box-sizing: border-box;
                        height: 23px;
                        div.el-input--suffix{
                            box-sizing: border-box;
                            height: 23px;
                            .el-input__inner{
                                box-sizing: border-box;
                                height: 23px;
                                border: 0;
                                appearance: none;
                                // background: #f0f5f9;
                            }
                            span.el-input__suffix {
                                display: none;
                            }
                        }
                    }
                    div.el-input--small{
                        box-sizing: border-box;
                        height: 23px;   
                        .el-input__inner{
                            box-sizing: border-box;
                            height: 23px;
                            border: 0;
                            appearance: none;
                            // background: #f0f5f9;
                        }
                    }
                    div.el-input-number {
                        box-sizing: border-box;
                        height: 23px;
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
</style>
