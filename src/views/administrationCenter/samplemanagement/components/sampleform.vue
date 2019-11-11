<template>
    <!-- 上样撤样的的Form集合 -->
        <div class="bordermodel samplefrom">
            <div class="list_top">
                <el-form  label-width="140px" 
                    :model="sample"  :label-position="labelPosition"
                    class="demo-form-inline"  ref="sampleForm">
                
                <!-- <el-form-item class="search_item"  prop="num" v-if="isView" label="撤样单号">
                    <el-input v-model="sample.num"  placeholder="撤样单号" size="medium"  :readonly = "true"></el-input>
                </el-form-item>

                <el-form-item class="search_item"  prop="date" v-if="isView" label="申请时间">
                    <el-date-picker
                        v-model="sample.date"
                        type="date"
                        placeholder="申请时间">
                    </el-date-picker>
                </el-form-item> -->

                <el-form-item class="search_item" prop="storeId"  label="申请店面">
                    <el-select v-model="sample.storeId" placeholder="申请店面" size="medium" :disabled="readonly" @change="storeChange" clearable filterable>
                        <el-option 
                            v-for="item in storeList" 
                            :label="item.storeName" :value="item.storeId" :key="item.storeId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item  class="search_item" prop="address" label="店面地址"> 
                    <div class="addresslist">
                        <div class="input_box">
                            <el-input placeholder='店面地址' v-model="sample.address" maxlength="50" :readonly = "true" ></el-input>
                            <!-- @focus='maplocation' -->
                        </div>
                        <!-- <div class="input_box">
                            <el-input placeholder="楼号/区" v-model.number="buildingNumber" maxlength="10"></el-input>
                        </div>
                        <div class="input_box">
                            <el-input placeholder="单元/号楼" v-model.number="unitNumber" maxlength="10"></el-input>
                        </div>
                        <div class="input_box">
                            <el-input placeholder="室" v-model.number="roomNumber" maxlength="10"></el-input>
                        </div> -->
                    </div>
                </el-form-item>

                <el-form-item label="品牌" class="search_item"   prop="brandId" :rules="{
                    required: true, message: '不能为空', trigger: 'change'
                }">
                    <el-select  @change="brandChange" clearable filterable
                        v-model="sample.brandId"
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

                <el-form-item label="品类" class="search_item" prop="commodityCategoryId" :rules="{
                    required: true, message: '不能为空', trigger: 'change'
                }">
                    <el-select    @change="commodityChange" clearable filterable
                        v-model="sample.commodityCategoryId"
                        placeholder="品类"
                        size="medium"
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

                <el-form-item class="search_item" prop="applicant" label="申请人">
                    <el-input v-model="sample.applicant" size="medium" placeholder="申请人"  :readonly = "true" clearable></el-input>
                </el-form-item>

                <el-form-item class="search_item" prop="customerPhone" label="申请人电话">
                    <el-input v-model="sample.customerPhone" size="medium" placeholder="申请人电话"  :readonly = "true" clearable></el-input>
                </el-form-item>

                <el-form-item class="search_item"  :label="sampleLabel.type" prop="type" :rules="{
                    required: true, message: '不能为空', trigger: 'change'
                }">
                    <el-select v-model="sample.type" :placeholder="sampleLabel.type" size="medium" :disabled="readonly" clearable filterable>
                        <el-option 
                            v-for="item in typeList" 
                            :label="item.dictName" :value="item.id" :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item class="search_item"  prop="searchData" :rules="{
                    required: true, message: '不能为空', trigger: 'change'
                }">
                    <el-date-picker
                        size="medium" v-model="sample.searchData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        :start-placeholder="`${sampleLabel.datelabel}年/月/日`" :end-placeholder="`${sampleLabel.datelabel}年/月/日`"   :readonly = "readonly">
                    </el-date-picker> -->
                    <!-- <el-date-picker
                        v-model="sample.searchData"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="预计撤样时间">
                    </el-date-picker>
                </el-form-item> -->

                <el-form-item class="search_item"  :label="`${sampleLabel.datelabel}`"  prop="searchData" :rules="{
                    required: true, message: '不能为空', trigger: 'change'
                }">
                    <el-date-picker
                        size="medium" v-model="sample.searchData" type="date" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd'
                        placeholder="年/月/日"   :readonly = "readonly">
                    </el-date-picker>
                </el-form-item>

                <el-form-item v-if="isUp && sample.brandId == 2" label="审批人" prop="approval" class="search_item" :rules="{
                    required: true, message: '不能为空', trigger: 'change'
                }">
                 <!-- @change="approvalChange" @focus="approvalFocus" -->
                    <el-select v-model="sample.approval" placeholder="审批人" size="medium" :disabled="readonly">
                        <el-option  
                            v-for="item in approvalList" 
                            :label="item.name" :value="item.user_id" :key="item.user_id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="customerView"  label="客户姓名" class="search_item"  prop="customerName" :rules="{
                    required: true, message: '不能为空', trigger: 'change'
                }">
                    <!-- <el-input v-model="sample.customerName" size="medium" placeholder="客户姓名"  :readonly = "readonly"></el-input> -->
                    <div class="Customers">
                        <el-input v-model="sample.customerName" placeholder="客户姓名" size="medium" clearable></el-input>
                        <span class="posiakeh table_action_span" v-if="!customerdas" @click="selectcustomers">选择客户</span>
                    </div>
                </el-form-item>

                <el-form-item v-if="customerView" class="search_item"  label="客户电话" prop="customerotherPhone">
                    <el-input v-model="sample.customerotherPhone" size="medium" placeholder="客户电话" clearable :readonly = "readonly"></el-input>
                </el-form-item>

                <el-form-item v-if="customerView" class="search_item"  label="客户备用电话"  prop="otherPhone">
                    <el-input v-model="sample.otherPhone" size="medium" placeholder="客户备用电话" clearable :readonly = "readonly"></el-input>
                </el-form-item>
                
                
                <el-form-item v-if="customerView" label="客户地址" required  class="search_item width_100 addressInput">
                    <el-form-item prop="maps">
                        <el-input placeholder="地图定位" v-model="maps" maxlength="50" :readonly = "readonly" @focus="maplocation" :title="maps"></el-input>
                    </el-form-item>

                    <el-form-item prop="buildingNumber">
                      <el-input placeholder="楼号/区" v-model="sample.buildingNumber" maxlength="50" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="unitNumber">
                        <el-input placeholder="单元/号楼" v-model="sample.unitNumber" maxlength="50" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="roomNumber">
                        <el-input placeholder="室" v-model="sample.roomNumber" maxlength="50" clearable></el-input>
                    </el-form-item>
                </el-form-item>

                <!-- <el-form-item v-if="customerView" label="客户地址" required label-width="140px" class="search_item width_100 addressInput">
                    <el-form-item prop="provinceId">
                        <el-select v-model="sample.provinceId" @change="provinceChange" placeholder="省" >
                            <el-option v-for="item in provinceList" :key="item.provinceid" :value="item.provinceid" :label="item.province"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="cityId">
                        <el-select v-model="sample.cityId" @change="cityChange" placeholder="市">
                            <el-option v-for="item in cityList" :key="item.city" :value="item.cityid" :label="item.city"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="areaId">
                        <el-select v-model="sample.areaId" placeholder="县">
                            <el-option v-for="item in areaList" :key="item.area" :value="item.areaid" :label="item.area"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="address">
                        <el-input v-model.trim="sample.address" clearable placeholder="请输入详细地址"></el-input>
                    </el-form-item>
                </el-form-item> -->

                <el-form-item v-if="customerView" label="客户备注"  class="search_item width_100 remarkTextarea"  >
                    <el-input type="textarea" v-model="sample.customerdesc"  :readonly = "readonly"></el-input>
                </el-form-item>

                <el-form-item label="是否需要测量" class="search_item width_100"  prop="measure" v-if="isUp" >
                    <el-radio-group v-model="sample.measure" :disabled="readonly">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="订单货品类型" class="search_item width_100"  prop="orderGoodsType" v-if="isUp" >
                    <el-radio-group v-model="sample.orderGoodsType" :disabled="readonly" @change="goodsChange">
                        <el-radio :label="1">成品</el-radio>
                        <el-radio :label="2">订制品</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="sampleLabel.desc" class="search_item width_100 remarkTextarea"  prop="desc">
                    <el-input type="textarea" v-model="sample.desc"  :readonly = "readonly"></el-input>
                </el-form-item>

                <!-- <el-form-item label="上传附件"  required  class="search_item width_100"  label-width="140px">
                    <el-upload
                        action="string"
                        list-type="text"
                        :http-request="uploadSectionFile">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item> -->

            </el-form>

            </div>

            <div class="dialog_con_box">
                <!-- 选择客户 -->
                <el-dialog title="选择客户" class="customDialogTitle"
                    v-if="selectcustomersmass"
                    :visible.sync="selectcustomersmass" custom-class="customDialogTitle"
                    width="800px">
                    <div class="selecusclas lvs attribute">
                        <div class="scarchclass">
                            <el-input placeholder="客户ID/姓名/电话/地址" v-model="searchphoto" size="medium" class="scachinp"></el-input>
                            <div>
                                <el-button @click="cxkehu(1)" type="warning" class="button-fc" size="medium">查询</el-button>
                            </div>
                        </div>
                        <div class="customertab">
                            <div class="titlecals marcal">客户列表</div>
                            <el-table border :row-key="getRowKeys"
                                :row-style="tableBodycolor" 
                                :row-class-name="tableRowClassName" 
                                @selection-change="handleSelectionChange"
                                :data="tablekehu" style="width: 100%;">
                                <el-table-column type="selection" width="40" :reserve-selection="true" align="center"></el-table-column>
                                <el-table-column prop="customerName" align="center" label="客户姓名" show-overflow-tooltip sortable></el-table-column>
                                <el-table-column prop="customerPhone" align="center" label="客户电话" show-overflow-tooltip sortable></el-table-column>
                                <el-table-column prop="address" align="center" show-overflow-tooltip label="客户地址"></el-table-column>
                            </el-table>
                            <div class="pagination_wrap">
                                <pagination
                                :current-page="currentPage"
                                :page-size="pageSize"
                                :total="total"
                                @sizeChange="sizeChange"
                                @currentChange="currentChange">
                                </pagination>
                            </div>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="changekehu">确 定</el-button>
                        <el-button @click="closekhdia">取 消</el-button>
                    </span>
                </el-dialog>


                <el-dialog :title="Dialogtitle" :visible.sync="mapDialogVisible" width="70%" v-if="mapDialogVisible">
                    <baidu-map
                    class="map"
                    :center="center"
                    :zoom="15"
                    :keyboard="true"
                    @click="getClickInfo"
                    :scroll-wheel-zoom="true"
                    :double-click-zoom="false"
                    >
                    <bm-marker :position="center"></bm-marker>
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    <bm-control>
                        <input type="text" v-model="keyword" placeholder="请输入搜索关键字" style="width:350px;" />
                        <bm-local-search
                        :keyword="keyword"
                        :auto-viewport="true"
                        @infohtmlset="infohtmlsets"
                        style="width:350px;max-height:450px;overflow:auto;"
                        :panel="true"
                        ></bm-local-search>
                    </bm-control>
                    </baidu-map>
                    <div slot="footer" style="margin-top: 0px;">
                        <el-button @click="cancel" class="el-button--medium" type="primary" size="medium">取消</el-button>
                        <el-button @click="confirm" class="button-fc" type="warning" size="medium">确定</el-button>
                    </div>
                </el-dialog>
            </div>
        
        </div>
    
</template>
<script>


import spot from "@/assets/images/spot.png";
import pagination from '@/views/components/pagination';
import { listCompanyByAll } from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import { listProvince, listCity, listAreas,} from 'api/pulicJava';
import addresselection from '../../../components/addresselection';
import { baiduMap } from "src/api/pulicJava.js";
import { mapGetters } from "vuex";
import {
    listCategory, // 获取品类
    listBrand, // 获取品牌
} from "api/pulicJava";

import {
    taskDutyDetails, // 回显
} from "api/entrepotSet/duty/index";

import { 
    getStoreList, // 获取门店
    getStoreUser, // 获取申请人信息
    listOrderCommodityByPage, // 获取上样清单列表
    listBaseDict, // 字典类型
    getSample, // 查看样品详情
    cancelSampleSingleDetail, //获取撤样详情
    sampleReviewer, // 审批人
} from 'api/administrationCenter/samplemanagement/index';

import {
    getStoreCustomerInfo, //获取客户信息
    getCustomerAddress,//查询地址信息
    listStoreCustomer, //我的客户TAB_列表查询
} from 'api/order/order/order';


export default {
    components: {
      addresselection,
      pagination,
    },
    computed: {
        ...mapGetters(["id"])
    },
    name: 'sampleform',
    data() {
        return {
            labelPosition: 'right',
            customerdas:false,//选择客户
            tablekehu: [],
            selectkdata: [],//选择客户信息
            searchphoto:'',//选择客户查询条件
            currentPage: 1,//当前页数
            pageSize: 10,//每页显示个数
            total: 0,//总条数
            customerId: "",
            storeCustomerId: "",
            selectcustomersmass:false,//选择客户
            khaddressdata: {},
            readonly: true, // 是否只读
            isView: false, // 单号和申请时间是否存在
            isAudit: false, // 审核页面
            isView: false, // 详情页面

            isUp: false, // 是否是上样模块
            isCancle: false, // 是否是撤样模块
            customerView: false, // 是否显示照片
            sponsorName:'',
            mobilePhone:'',
            // 上样信息
            sample: {
                num: '', //   撤样单号
                date: '', //   申请时间
                storeId: '', // 申请店面
                brandId: '', // 品牌
                commodityCategoryId: '', // 品类
                resource: 1,
                customerdesc: '',// 客户备注
                measure: '',// 是否需要测量
                orderGoodsType: 1, // 订单货品类型  
                searchData: '', //  预计上样日期 or 预计撤样日期
                
                address: '', //  店面地址
                maps: '', //  店面地址


                applicant: '', //  申请人
                applicantId: '',
                customerPhone: '', //  申请人电话 
                approval: '', // 审批人，只有选择的品牌是顾家的时候才会有
                customerName: '',  // 客户姓名
                customerotherPhone: '', // 客户电话
                type: '', // 上样类型 or 撤样处理方式 
                          
                otherPhone: "",           
                desc: '', // 上样描述 or 撤样原因
                provinceId: '', // 省
                cityId: '', // 市
                areaId: '', // 区

                buildingNumber: "", //楼号
                unitNumber: "", //单元
                roomNumber: "", //室

            },

            sampleLabel: {
                type: '', // 上样类型 or 撤样处理方式 
                datelabel: '',//  预计上样日期 or 预计撤样日期
                desc: '', // 上样描述 or 撤样原因
            },
            // 条件
            storeList: [],  // 申请店面
            samplerList: [], // 申请人
            approvalList: [], // 审批人
            typeList: [], // // 上样类型 or 撤样处理方式 
            brandList: [], // 品牌数据
            categoryList: [], // 品类数据
            provinceList: [], // 省
            cityList: [], // 市
            areaList: [], // 区
           

            customerAddressId: "", //客户地址id  编辑客户地址信息时使用

            changeAddress: "", //判断是编辑还是修改地址信息

            Dialogtitle: "",
             // 百度地图
            mapDialogVisible: false, // 地图flag 
            keyword: "",
            center: { lng: 116.404, lat: 39.915 }, //经纬度
            zoom: 15,
            maps: "", //地图信息
            buildingNumber: "", //楼号
            unitNumber: "", //单元
            roomNumber: "", //室

            checklist: [],
            mapData: [],
            isreadonly: false,

            rules: {
                // store: [
                //     {required: true,message: "请输入申请机构",trigger: "blur"}
                // ],
                // applicant: [
                //     { required: true, message: "请选择申请人", trigger: "blur" }
                // ],
                // supplierId: [
                //     { required: true, message: "请选择供应商", trigger: "blur" }
                // ],
                // searchData: [
                //     {type: "date",required: true,message: "请选择日期",trigger: "blur"}
                // ],
                // // type: [
                // //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                // // ],
                // desc: [
                //     {required: true,message: "请填写申请理由",trigger: "blur"}
                // ]
            },
       
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
        // 获取门店
        this.getStoreList();
        
        // 类型条件
        if(this.$route.path == "/samplemanagement/addsample" || this.$route.path ==  "/samplemanagement/editsample" || this.$route.path == "/samplemanagement/auditupsample") { 
            // 获取上样类型
            this.listBaseDict();
        }else if(this.$route.path == "/samplemanagement/addcancle" || this.$route.path ==  "/samplemanagement/editcancle" || this.$route.path ==  "/samplemanagement/auditcancle" || this.$route.path ==  "/samplemanagement/viewcancle"  ) {
            // 1撤样回库 2撤样销售
            this.typeList = [{
                dictName: "撤样回库", id: '1'
            },{
                dictName: "撤样销售", id: '2'
            }]
        }

        
        
        // 获取省份
        this.getProvince();
        // 回显当前登录人信息
        this.gettaskDutyDetails(); 
        // 供应商
        // this.getSupplier();
        // 上样/撤样管理
        if(this.$route.path == "/samplemanagement/addsample" || this.$route.path ==  "/samplemanagement/editsample" || this.$route.path == "/samplemanagement/auditupsample" || this.$route.path == "/samplemanagement/viewupsample"){ // 上样的新增和修改
            this.sampleLabel.type = '上样类型' ;// 上样类型
            this.sampleLabel.datelabel =  '预计上样日期' ;// 预计上样日期
            this.sampleLabel.desc =  '上样描述' ;// 上样描述
            this.isUp = true;  // 是否是上样模块 --- 测量是否存在

        }else if(this.$route.path == "/samplemanagement/addcancle" || this.$route.path ==  "/samplemanagement/editcancle" || this.$route.path ==  "/samplemanagement/auditcancle" || this.$route.path ==  "/samplemanagement/viewcancle" ) { // 撤样的新增和修改
            this.sampleLabel.type = '撤样处理方式' ;// 撤样处理方式
            this.sampleLabel.datelabel =  '预计撤样日期' ;// 预计撤样日期
            this.sampleLabel.desc =  '撤样原因' ;// 撤样原因
            
            this.isCancle = true;  // 是否是撤样模块 --- 客户信息是否存在
        }

        if(this.$route.path ==  "/samplemanagement/editcancle" || this.$route.path ==  "/samplemanagement/auditcancle" || this.$route.path ==  "/samplemanagement/viewcancle" ) {
            // this.isView = true; // 单号和申请时间是否存在
            this.getDetails(); //获取撤样详情
            
            this.gettaskDutyDetails(); // 回显当前登录人信息
        }

       
       // 是否只读
        if(this.$route.path == "/stockmanagement/viewsample" || this.$route.path == "/stockmanagement/viewstocksample"){
            this.readonly = true;
        }else {
            this.readonly = false;
        }

        if(this.$route.path == "/samplemanagement/auditcancle") { // 审核撤样页面
            this.isAudit = true;
            this.readonly = true;
        }

        if(this.$route.path == "/samplemanagement/viewcancle") { // 详情撤样页面
            this.isView = true;
            this.readonly = true;
        }

        if(this.$route.path == "/samplemanagement/editsample") { // 修改上样样品
            this.getSample(); // 回显信息
            this.gettaskDutyDetails(); // 回显当前登录人信息
        }else if(this.$route.path == "/samplemanagement/viewupsample"){ // 上样详情
            this.readonly = true;
            this.getSample(); // 回显信息
            this.gettaskDutyDetails(); // 回显当前登录人信息
        }

        if(this.$route.path == "/samplemanagement/auditupsample"){ // 上样审核
            this.getSample(); // 回显信息
            this.gettaskDutyDetails(); // 回显当前登录人信息
            this.readonly = true;
            this.isAudit = true;
        }

        // 审批人
        this.sampleReviewer();
    },
    watch: {
        'sample.type'(val) {
            if(this.isCancle) {
                if(val == "2") {
                    this.customerView = true;
                }else {
                    this.customerView = false;
                    this.maps = '';
                    this.sample.customerName = '';
                    this.sample.customerotherPhone = '';
                    this.sample.otherPhone = '';
                    this.sample.buildingNumber = '';
                    this.sample.unitNumber = '';
                    this.sample.roomNumber = '';
                    this.sample.customerdesc = '';
                }
            }
        }
    },
    methods: {
        // 审批人
        sampleReviewer() {
            sampleReviewer().then(res => {
                if(res.status == 200) {
                    this.approvalList = res.data;
                }
            }).catch(err => {
                console.log('样品管理:审批人 views/administrationCenter/samplemanagement/components/sampleform.vue', err);   
            })
        },

        // 上样回显信息
        getSample() {
            let data = {
                sampleId: this.$route.query.sampleId,
                orderId:  this.$route.query.orderId,
            };
            getSample(data).then(res => {
                if(res.status == 200) {
                    // this.sample = res.data;
                    
                    this.gettaskDutyDetails(); // 回显当前登录人信息

                    this.sample.storeId = res.data.storeId;
                    this.sample.address = res.data.address; // 门店地址
                    this.sample.brandId = String(res.data.brandId); // 品牌
                    this.sample.commodityCategoryId = String(res.data.commodityCategoryId); // 品类
                    this.sample.type = Number(res.data.pushSampleType);// 上样类型Id
                    this.sample.searchData = res.data.sampleExpectChangeTime; // 时间
                    this.sample.measure = Number(res.data.isNeedMeasure); // 是否需要测量
                    this.sample.orderGoodsType = res.data.orderGoodsType; // 货品类型Id
                    this.sample.approval =  Number(res.data.approverId); // 审批人id

                    this.sample.desc = res.data.sampleRemark; // 备注
                }
            }).catch(error =>{
                console.log('样品管理:表单 信息回显 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            })
        },

        // 获取撤样详情 -- 回显
        getDetails(){
            let data = {
                cancelSampleSingleId : this.$route.query.cancelSampleSingleId
            }
            cancelSampleSingleDetail(data).then(res=>{
                this.sample.num = res.data.cancelSampleSingleCode;//撤样单号
                this.sample.date = res.data.createTime;//申请时间
                this.sample.storeId = res.data.storeId;//店面
                this.sample.address = res.data.address;//店面地址
                this.sample.brandId = String(res.data.brandId);//品牌
                this.sample.commodityCategoryId = String(res.data.commodityCategoryId);//品类
                // this.sample.applicant = res.data.applyName;//申请人
                // this.sample.customerPhone = res.data.mobilePhone;//申请人电话
                this.sample.type = String(res.data.processMode);//处理方式
                this.sample.searchData = res.data.predictDate;//预计撤样时间

                // this.sample.customerName = res.data.customerName;//客户姓名
                this.$set(this.sample,'customerName',res.data.customerName)
                this.sample.customerotherPhone = res.data.customerPhone;//客户电话
                this.sample.otherPhone = res.data.otherPhone;//客户备用电话
                this.sample.desc = res.data.cancalCause; // 备注
                this.sample.customerdesc = res.data.customerRemark; // 客户备注
                console.log(this.sample,res.data,"this.sample 552+++++");
                
                // 地图回显
                if(res.data.customerAddress) {
                    this.maps = res.data.customerAddress.address.split("#")[0];
                    this.sample.buildingNumber = res.data.customerAddress.address.split("#")[1];
                    this.sample.unitNumber = res.data.customerAddress.address.split("#")[2];
                    this.sample.roomNumber = res.data.customerAddress.address.split("#")[3];
                    this.center = { lng: res.data.customerAddress.latitude, lat: res.data.customerAddress.longitude }; // 经纬度
                }

                
            }).catch(error=>{
                console.error('获取撤样详情',error);
                
            })
        },
        // 查询客户信息
        cxkehu(val){
            if(val){
                this.currentPage = val;
            }
            let data = {
                names: this.searchphoto,
                page: this.currentPage,
                limit: this.pageSize
            }
            listStoreCustomer(data).then(res =>{
                console.log(res,"我的客户TAB_列表查询");
                if(res.status == 200){
                    this.tablekehu = res.data.rows
                    this.total = res.data.total;
                }
            }).catch(error =>{
                console.log('订单管理:我的客户TAB_列表查询', error);
            })
        },
        // 选择客户
        selectcustomers(){
            this.searchphoto = "";
            this.cxkehu()
            this.selectcustomersmass = true;
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //勾选函数回调
        handleSelectionChange(val){
            console.log(val)
            this.selectkdata = val;
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.cxkehu()
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            this.cxkehu();
        },
        getRowKeys(row) {
            return row.storeCustomerId;
        },
        // 选择提交客户信息
        changekehu(){
            if(this.selectkdata.length > 1){
                this.$message({
                    message: '只能选择一个客户信息',
                    type: 'error'
                });
            }else if(this.selectkdata.length === 0){
                this.$message({
                    message: '请选择客户信息',
                    type: 'error'
                });
            }else{
                let datasuser = this.selectkdata[0]
                this.storeCustomerId = datasuser.storeCustomerId;
                this.customfun(this.storeCustomerId)
                this.selectcustomersmass = false;
            }
        },
        closekhdia(){
            this.tablekehu = [];
            this.selectcustomersmass = false;
            this.searchphoto = '';
        },
        // 客户信息请求
        customfun(routerdata){
            getStoreCustomerInfo({storeCustomerId: routerdata}).then(res =>{
                if(res.status == 200){
                    // this.khtabdata = res.data;-------------

                    this.sample.customerName = res.data.customerName
                    this.sample.customerotherPhone = res.data.customerPhone; // 客户电话
                    this.sample.otherPhone = res.data.otherPhone; // 备用电话

                    this.storeCustomerId = res.data.storeCustomerId
                    this.customerId = res.data.customerId
                    let datas = {
                        customerAddressId: res.data.customerAddressId
                    }
                    console.log(datas,"地址详情请求");
                    getCustomerAddress(datas).then(res =>{
                        console.log(res);
                        if(res.status == 200){
                            if(res.data != null) {
                                this.khaddressdata = {
                                    provinceId: parseInt(res.data.provinceId),//省
                                    cityId: parseInt(res.data.cityId),//市
                                    areaId: parseInt(res.data.areaId),//区
                                    longitude: res.data.longitude+"",//经度
                                    latitude: res.data.latitude+"",//纬度
                                    address: res.data.address, //地址
                                }
                                let adddata = res.data.address
                                this.maps = adddata.substring(0,adddata.indexOf("#"));
                                // this.$set(this.sample,'buildingNumber',this.addsplicfun(adddata)[0])
                                
                                this.sample.buildingNumber = this.addsplicfun(adddata)[0];
                                this.sample.unitNumber = this.addsplicfun(adddata)[1];
                                this.sample.roomNumber = this.addsplicfun(adddata)[2];
                            }
                        }
                    }).catch(error =>{
                        console.log(error,'订单管理:根据客户姓名获取客户信息');
                    })
                }
            }).catch(error =>{
                console.log('订单管理:获取客户信息 ', error);
            })
        },
        // 截取地址信息方法
        addsplicfun(val){
            if(val){
                return val.substring(val.indexOf("#")+1).split('#')
            }
        },
        // 获取门店
		getStoreList() {
			getStoreList().then(res =>{
                if(res.status == 200){
                    this.storeList = res.data;
                }
            }).catch(error =>{
                console.log('样品管理:表单 获取门店 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            })
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
                    console.log('样品管理:表单 获取全部品牌列表 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
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
                    console.log('样品管理:表单 获取全部品类列表 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
                });
        },
        // 获取申请人信息
		// getStoreUser() {
        //     let data = {
        //         storeId: this.sample.storeId
        //     }
		// 	getStoreUser(data).then(res =>{
        //         if(res.status == 200){
        //             this.samplerList = res.data;
        //         }
        //     }).catch(error =>{
        //         console.log('样品管理:上样管理 views/administrationCenter/samplemanagement/upsample/index.vue', error);
        //     })
        // },
        
        // 获取上样清单列表
		listOrderCommodityByPage() {
			listOrderCommodityByPage().then(res =>{
                if(res.status == 200){
                    this.samplerList = res.data;
                }
            }).catch(error =>{
                console.log('样品管理:表单 获取上样清单列表 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            })
        },

        // 获取上样类型
		listBaseDict() {
            let data = {
                dataType: "SAMPLE_TYPE",		//字典类型，
            }

			listBaseDict(data).then(res =>{
                if(res.status == 200){
                    this.typeList = res.data;
                }
            }).catch(error =>{
                console.log('样品管理:表单 获取上样类型 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            })
        },
        //获取供应商
        // getSupplier() {
        //     listCompanyByAll()
        //         .then(res => {
        //             this.supplierList = res.data;
        //         })
        //         .catch(error => {
        //             console.error("获取供应商", error);
        //         });
        // },
        // 获取省份
        getProvince() {
            listProvince().then(res => {
                this.provinceList = res.data;
            }).catch(error => {
                console.log('样品管理:表单 调取公共方法获取省 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            });
        },
        // 获取市
        getCity(id) {
            listCity({ id }).then(res => {
                this.cityList = res.data;
            }).catch(error => {
                console.log('样品管理:表单 调取公共方法获取市 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            });
        },
        // 获取县
        getArea(id) {
            listAreas({ id }).then(res => {
                this.areaList = res.data;
            }).catch(error => {
                console.log('样品管理:表单 调取公共方法获取区 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            });
        },
        // 选择省
        provinceChange(id) {
            this.sample.cityId = '';
            this.sample.areaId = '';
            this.getCity(id);
        },
        // 选择市
        cityChange(id) {
            this.sample.areaId = '';
            this.getArea(id);
        },
        // 当申请店面变化时触发的函数
        storeChange(val) {
            this.storeList.forEach(item => {
                if(item.storeId == val) {
                    this.sample.address = item.address;
                }
            });
            // 获取申请人信息
            // this.getStoreUser();
        },
        // 当品牌值发生变化时触发的函数
        brandChange(val) {
            if(this.sample.brandId == 2) {
                this.sample.approval = '';
            }

            this.$emit("brand_change",val);
        },
        // 当品类值发生变化时触发的函数
        commodityChange(val) {

            this.$emit("commodity_change",val);
        }, 
        goodsChange(val) {
            this.$emit("goods_change",val);
        },
        // 当申请人被选中时触发的函数
        applicantFocus() {
            if(!this.sample.storeId) {
                this.$message.warning("请选择申请店面");
                return;
            }
        },
        // 当申请人值发生变化时触发的函数
        applicantChange(val) {
            this.samplerList.forEach(item => {
                if(item.storeUserId == val) {
                    this.sample.customerPhone = item.mobilePhone;
                }
            });
            
        },
        // 当审批人被选中时触发的函数
        approvalFocus() {
            if(!this.sample.storeId) {
                this.$message.warning("请选择品牌");
                return;
            }
        },
        // 当审批人值发生变化时触发的函数
        // approvalChange(val) {
        //     this.samplerList.forEach(item => {
        //         if(item.storeUserId == val) {
        //             this.sample.customerPhone = item.mobilePhone;
        //         }
        //     });
            
        // },
        // 回显当前登录人信息
        gettaskDutyDetails() {
            taskDutyDetails().then(res => {
                if (res.status == 200) {
                    this.sponsorName = res.data.sponsorName; // 当前登录人
                    this.mobilePhone = res.data.mobilePhone; // 当前登录人电话
                    this.sample.applicantId = this.id; // 当前登录人id

                    this.sample.applicant = res.data.sponsorName; // 当前登录人 //  申请人
                    this.sample.customerPhone = res.data.mobilePhone;  //  申请人电话 

                    // this.groupName = res.data.groupName;  // 发起部门
                    // this.sponsorTime = res.data.sponsorTime;  // 发起部门
                    // this.sponsorAt = res.data.sponsorAt;
                    // this.groupId = res.data.groupId
                }
                console.log(this.sample.applicant,"this.sample.applicant222222222222222");
                
            }).catch(error => {
                console.log('样品管理:表单 回显当前登录人信息 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            });
        },
        // 上传图片
        uploadSectionFile(res){ 
            put(res).then(data=>{
                console.log(data);
            })
        },
        
        //弹出地图框
        maplocation(){
            this.mapDialogVisible = true;
        },
        //地图点击事件
        getClickInfo (e) {
            this.center = {};
            this.center.lng = e.point.lng;  
            this.center.lat = e.point.lat;
        },
        //取消
        cancel() {
            this.mapDialogVisible = false
        },
        //点击所搜索红点
        infohtmlsets(poi){
            this.center = {};
            this.center.lat = poi.point.lat;
            this.center.lng = poi.point.lng;
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
                    provinceId: parseInt(this.mapData.addressComponent.adcode.substring(0,2)+"0000"),// 省
                    cityId: parseInt(this.mapData.addressComponent.adcode.substring(0,4)+"00"),// 市
                    areaId: parseInt(this.mapData.addressComponent.adcode),// 区
                    longitude: this.center.lng+"",// 经度
                    latitude: this.center.lat+"",// 纬度
                    address: str,// 地址
                }
                this.maps = this.mapData.formatted_address+this.mapData.sematic_description;
                this.center = res.location;
                console.log(this.maps);
            }).catch(error =>{
                console.log(error)
            })
            this.mapDialogVisible = false
        },
      
    }
};
</script>
<style scoped lang='scss'>
.Customers{
    display:flex;
    span{
        padding-left:20px;
        min-width: 80px;
    }
}
.bordermodel{
    .titlecals{
        top: 0;
    }
    .marcal{
        padding: 10px 0px;
    }
    .selecusclas{
        .scarchclass{
            width: 100%;
            padding-right: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .scachinp{
                width: 300px;
            }
        }
        .customertxt{
            padding: 10px 0px;
            font-size: 14px;
        }
    }
 
    .samplefrom{
        .el-form{
            width: 80%;
            display: flex;
            flex-wrap: wrap;
            // justify-content: center;
            align-items: center;
                .search_item{
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    margin: 10px 0px;
                    padding: 0px 5px;
                    width: 50%;
                    >div{
                        width: 100%;
                        >div {
                            width: 100%;
                        }
                    }
                    .el-form-item__content{
                        width: 100%;
                    }
                }
                .width_100{
                    width: 100%;
                }
                
                .remarkTextarea {
                    margin-top: 20px;
                }
        }
    }
    
    .addressLeft{
        width: calc(50% - 65px);
    }
    .addressRight{
        width: calc(50% + 65px);
    }
    


.samplefrom {
    .purchasefrom {
        .demo-form-inline {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            > div {
                width: 25%;
            }
            > div.input_100 {
                width: 100% !important;
            }
        }
    }
    .upload-demo {
        padding: 20px 60px;
    }
}


    // .bordermodel {
    //     .samplefrom {
    //         .demo-form-inline {
    //             display: flex;
    //             flex-wrap: wrap;
    //             align-items: center;
    //             >div {
    //                 width: 48%;
    //             }
    //             >div.input_100 {
    //                 width: 100% !important;
    //             }
    //         }
    //     }
    //     .upload-demo {
    //         padding: 20px 60px;
    //     }
    // }

    .map {
        width: 100%;
        height: 400px;
        .anchorBL {
    　　　　display: none;
        }
    }
}
</style>

<style lang="scss">
    .samplefrom {
        .search_item{
            
            .el-form-item__content{
                width: 100%;
                margin-left: 0px !important;
            }
        }
    }

    .addressInput{
        >div {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            >div {
                width: 14% !important;
                margin-right: 6px;
                &:nth-of-type(1){
                    flex: 1;
                }
                &:nth-of-last-type(1) {
                    margin-right: 0px;
                }
            }
        }
    }
</style>

