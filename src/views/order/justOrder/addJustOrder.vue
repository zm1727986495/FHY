<template>
    <div class="addJustOrder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs" v-cloak>
            <!-- 客户基本信息 -->
            <div class="bordermodel">
                <div class="textitle">
                    <div class="titlecals">订单基本信息</div>
                    <div class="table_action_span" @click="retractone">{{retractbox1 ? "收起" : "展开"}}</div>
                </div>
                <div class="orderfrom" v-if="retractbox1">
                    <el-form :label-position="labelPosition" 
                        label-width="120px" 
                        :model="khtabdata" 
                        class="demo_form_inline">
                        <el-form-item label="客户姓名" required class="posirkeh">
                            <el-input v-model="khtabdata.customerName" :disabled="customerdas || customeswatch" size="medium" placeholder="客户姓名"></el-input>
                            <!-- <span class="posiakeh table_action_span" v-if="!customerdas" @click="selectcustomers">选择客户</span>
                            <span class="posiakehs table_action_span" v-if="!customerdas" @click="resetfun">重置</span> -->
                            <el-button size="mini" type="text" class="posiakeh" v-if="!customerdas" @click="selectcustomers">选择客户</el-button>
                            <el-button size="mini" type="text" class="posiakehs" v-if="!customerdas" @click="resetfun">重置</el-button>
                        </el-form-item>
                        <el-form-item label="客户电话" required>
                            <div class="disflex">
                                <el-input v-model="khtabdata.customerPhone" size="medium" :disabled="customerdas || customeswatch" maxlength="11" placeholder="客户电话"></el-input>
                                <el-input v-model="khtabdata.otherPhone" size="medium" :disabled="customerdas || customeswatch" maxlength="11" placeholder="备用电话"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="所属门店" required>
                            <el-input v-model="storeName" size="medium" disabled></el-input>
                            <!-- <el-select clearable filterable v-model="khtabdata.storeId" placeholder="选择所属门店" class="selewi">
                                <el-option
                                    v-for="item in dotList" :key="item.value"
                                    :label="item.storeName" :value="item.storeId">
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                        <el-form-item label="业务员">
                            <!-- <el-input v-model="business" size="medium" disabled></el-input> -->
                            <el-select filterable v-model="business" :disabled="businessswatch" placeholder="请选择业务员" class="selewi" size="medium">
                                <el-option v-for="item in salesmanlist" :key="item.value"
                                    :label="item.username" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="销售员" :required="!salesmanswatch">
                            <!-- <el-input v-model="salesman" size="medium" disabled></el-input> -->
                            <el-select filterable v-model="salesman" :disabled="salesmanswatch" placeholder="请选择销售员" class="selewi" size="medium">
                                <el-option v-for="item in salesmanlist" :key="item.value"
                                    :label="item.username" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单来源" required class="selewi">
                            <div class="disflex150">
                                <el-select clearable filterable v-model="orderSourceId" placeholder="请选择订单来源" class="selewi" @change="storeSourceChange" size="medium">
                                    <el-option v-for="item in orderl" :key="item.value"
                                        :label="item.sourceName" :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select clearable filterable v-model="storeSourceId" placeholder="请选择" class="selewi" v-if="storeSourceIdList.length" size="medium">
                                    <el-option v-for="item in storeSourceIdList" :key="item.value"
                                        :label="item.sourceName" :value="item.storeSourceId">
                                    </el-option>
                                </el-select>
                                <el-input v-if="sourceswath == 2" size="medium" v-model="showStoreName" @focus="openTree" placeholder="请选择组织机构"></el-input>
                                <el-select clearable filterable v-model="bindInfo.insideReferee" placeholder="请选择人员" v-if="sourceswath == 2" size="medium">
                                    <el-option v-for="item in userList" :key="item.id"
                                        :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-input v-if="sourceswath == 3" size="medium" :disabled="recommendswitch" v-model="externalReferee" placeholder="外部推荐人"></el-input>
                                <el-input v-if="sourceswath == 3" size="medium" :disabled="recommendswitch" v-model="externalRecommendPhone" placeholder="手机"></el-input>
                                <el-input v-if="sourceswath == 3" size="medium" :disabled="recommendswitch" v-model="externalRecommendCompany" placeholder="推荐人所属公司"></el-input>
                                <el-input v-if="sourceswath == 53" maxlength="10" placeholder="请输入10字以内" v-model="otherChannel"></el-input>
                                <div v-if="sourceswath == 3" class="addbtn">
                                    <el-button size="mini" type="primary" @click="openredia">选择</el-button>
                                    <el-button size="mini" type="primary" @click="addrecommend">新增</el-button>
                                    <el-button size="mini" type="text" @click="resetrecommend">重置</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="渠道商" required v-if="sourceswath == 50 || sourceswath == 51 || sourceswath == 52">
                            <el-select clearable filterable v-model="companyId" placeholder="选择渠道商" size="medium" class="selewi">
                                <el-option v-for="item in channellist" :key="item.value"
                                    :label="item.companyName" :value="item.companyId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单货品类型" required>
                            <el-radio-group v-model="orderGoodsType" :disabled="orderGoodsswath">
                                <el-radio :label="1">成品</el-radio>
                                <el-radio :label="2">定制</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="品牌" required>
                            <el-select clearable filterable v-model="brandId" placeholder="请选择品牌" class="selewi" size="medium">
                                <el-option :label="itm.brandName" :value="itm.brandId" 
                                    v-for="itm in Brandli"  :key="itm.brandId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="品类" required>
                            <el-select clearable filterable v-model="commodityCategoryId" placeholder="请选择品类" class="selewi" size="medium">
                                <el-option :label="itm.categoryName" :value="itm.categoryId" 
                                    v-for="itm in category" :key="itm.categoryId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预算金额">
                            <el-input v-model="orderExpectMoney" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="C类报备" v-if="smbrandId == brandId">
                            <el-input v-model="cReported" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="客户地址" class="selewi" required>
                            <ul class="addresslist">
                                <li class="addresselec"><el-input placeholder='地图定位' size="medium" v-model="maps" maxlength="50" readonly @focus='maplocation'></el-input></li>
                                <li><el-input placeholder="楼号/区" size="medium" v-model="buildingNumber" maxlength="10"></el-input><span>楼号/区</span></li>
                                <li><el-input placeholder="单元/号楼" size="medium" v-model="unitNumber" maxlength="10"></el-input><span>单元/楼号</span></li>
                                <li><el-input placeholder="室" size="medium" v-model="roomNumber" maxlength="10"></el-input><span>室</span></li>
                                <div class="explaintxttwo">
                                    <span @click="addressaler" class="table_action_span" v-if="customerId !== ''">地址管理</span>
                                </div>
                            </ul>
                        </el-form-item>
                        <el-form-item label="订单备注" class="selewi">
                            <el-input type="textarea" v-model="orderRemark"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- 推荐人信息 -->
            <!-- 需求信息 -->
            <div class="bordermodel">
                <div class="textitle">
                    <div class="txtlef">
                        <span class="titlecals">需求信息</span>
                        <span class="clitxt table_action_span" @click="demandfun">选择需求</span>
                    </div>
                    <div class="table_action_span" @click="retracttwo">{{retractbox2 ? "收起" : "展开"}}</div>
                </div>
                <div class="orderfrom" v-if="retractbox2">
                    <demandassembly :customerDemand="this.customerDemand"></demandassembly>
                </div>
            </div>
            <!-- 推荐人信息 -->
            <recommenderdia :visible="re_visible" @add_recomm="addrecomm" @close_recomm="closerecomm"></recommenderdia>
            <div class="tapbox">
                <div></div>
                <div>
                    <el-button type="primary" size="medium" @click="submitaddorder" :loading="loadingbtn">保存</el-button>
                    <el-button size="medium" @click="cancal">取消</el-button>
                </div>
            </div>
        </el-card>

        <!-- 地址弹框 -->
        <el-dialog title="地址管理" class="customDialogTitle" :visible.sync="dialogVisible" width="50%">
            <div>
                <addresselection ref="adddatas" :customerId="customerId" v-if="dialogVisible"></addresselection>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminaddchange">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 需求管理 -->
        <el-dialog title="需求管理" class="customDialogTitle" :visible.sync="demandswitch" width="60%">
            <div class="lvs">
                <el-table border :row-style="tableBodycolor" :row-class-name="tableRowClassName" 
                    @selection-change="handleSelectionChangexq" :data="xqtabledata">
                    <el-table-column type="selection" width="40" align="center"></el-table-column>
                    <el-table-column prop="housingTypeId" align="center" label="需求标题" sortable></el-table-column>
                    <el-table-column prop="createAt" align="center"  label="操作人" sortable></el-table-column>
                    <el-table-column prop="createTime" align="center"  label="操作时间"></el-table-column>
                </el-table>
                <div class="pagination_wrap">
                    <pagination :current-page="currentPage2" :pageSize="pageSize2" :total="total2"
                    @sizeChange="sizeChange2" @currentChange="currentChange2">
                    </pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="xqlistclick">确 定</el-button>
                <el-button @click="demandswitch = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 选择客户 -->
        <el-dialog title="选择客户" class="customDialogTitle"
            v-if="selectcustomersmass"
            :visible.sync="selectcustomersmass" custom-class="customDialogTitle"
            width="1000px">
            <div class="selecusclas lvs attribute">
                <div class="scarchclass">
                    <el-input placeholder="客户ID/姓名/电话/地址" v-model="searchphoto" size="medium" class="marcal scachinp"></el-input>
                    <div><el-button @click="cxkehu(1)" type="warning" class="button-fc" size="medium">查询</el-button></div>
                </div>
                <div class="customertab">
                    <div class="titlecals marcal">客户列表</div>
                    <el-table border :row-key="getRowKeys" :row-style="tableBodycolor" :row-class-name="tableRowClassName" 
                        @selection-change="handleSelectionChange" :data="tablekehu">
                        <el-table-column type="selection" width="40" :reserve-selection="true" align="center"></el-table-column>
                        <el-table-column prop="customerName" align="center" label="客户姓名" show-overflow-tooltip sortable></el-table-column>
                        <el-table-column prop="customerPhone" align="center" label="客户电话" show-overflow-tooltip sortable></el-table-column>
                        <el-table-column prop="address" align="center" show-overflow-tooltip label="客户地址"></el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination :current-page="currentPage" :page-size="pageSize" :total="total"
                        @sizeChange="sizeChange" @currentChange="currentChange">
                        </pagination>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changekehu">确 定</el-button>
                <el-button @click="closekhdia">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 客户信息地址 -->
        <el-dialog title="地图定位" top='0' :close-on-click-modal='false' :visible.sync="mapDialogVisible" width="700px" class="customDialogTitle" v-if="mapDialogVisible">
            <baidu-map class="map" :center="center" :zoom="15" :keyboard="true" :scroll-wheel-zoom="true" :double-click-zoom="true">
                <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-control>
                    <el-input type="text" v-model="keyword" size="medium" placeholder="请输入搜索关键字" style="width:300px"></el-input>
                    <bm-local-search class="map_searchinfo" :keyword="keyword" 
                        :auto-viewport="true" @infohtmlset="infohtmlsets" :panel="true">
                    </bm-local-search>
                </bm-control>
            </baidu-map>
            <div slot="footer" style="margin-top: 0px;">
                <el-button type="primary" size="medium" @click="confirm">保存</el-button>
                <el-button size="medium" @click="cancel">取消</el-button>
            </div>
        </el-dialog>
        <!-- 所属机构组件 -->
        <organizationdia :visible="organizationdia_vis" v-if="organizationdia_vis" :defaultOpenArr="defaultOpenArr" @close_org="closetree"></organizationdia>

        <!-- 门店列表弹框 -->
        <storedia :visible="store_visible" v-if="store_visible" @close_store="closeStore"></storedia>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "../../components/breadcrumb";
import pagination from '../../components/pagination';
import addresselection from '../../components/addresselection';
import demandassembly from '../components/demandassembly';
import recommenderdia from "@/views/customermanagement/myclient/components/recommenderdia";
import storedia from "@/views/customermanagement/myclient/components/storedia"; //门店弹框组件
import organizationdia from "@/views/systemcenter/department/components/organizationdia";
import { baiduMap } from 'src/api/pulicJava.js';
import { 
    listCompanyByAll,//渠道商列表
    listCompanyByService,//渠道商列表
    getStoreCustomerInfo, //获取客户信息
    listCategory, //获取品类
    listBrand, //获取品牌
    addOrder, //提交新增订单
    listBaseDict, //基础字典查询
    listStoreCustomer, //我的客户TAB_列表查询
    listCustomerDemand,//获取客户需求列表
    getCustomerDemand,//获取客户需求信息
    getCustomerByNameOrPhone,//根据客户姓名或手机号获取客户信息
    insertCustomerDemand,//新增客户需求
    insertCustomer,//新增客户基本信息
    getCustomerAddress,//查询地址信息
    listStore,//获取门店列表
    getUserStore,//获取门店列表
    getStore,// 获取门店相关信息
    // getSalesmanList,//获取本门店下所有的业务员、销售员等
    getDesignerList,//获取本门店下所有的业务员、销售员等
    addReferrer,//新增外部推荐人
    getReferrerInfoByPhone,//根据推荐人手机号查询推荐人
    listOrganizationStaff,//获取组织机构人员
    listSalesmanPost,//获取门店下和大区下的销售员和业务员
    } from 'api/order/order/order';
  import { listStoreSource } from '@/api/systemcenter/storemanagement';
import { listStoreUser } from "api/common/common";
import { getUUID } from "api/pulicJava";
import { mapGetters } from "vuex"

export default {
    components: {
        breadcrumb,
        pagination,
        addresselection,
        demandassembly,
        recommenderdia,
        organizationdia, //组织机构弹框
        storedia
    },
    computed: {
        ...mapGetters(['name','id',"activeStoreId"])
    },
    data(){
        return {
            recommendswitch: false,//外部推荐人禁用开关
            loadingbtn: false,//提交loading
            bindInfo: {
                insideReferee: "",
                insideRecommendStore: "",
                externalReferee: ""
            },
            customeswatch: false,
            showStoreName: "",
            formInline: {},
            channellist: [], //渠道商
            defaultOpenArr: [], //组织机构默认展开的数组
            organizationdia_vis: false,//组织机构
            requestswitch: false,//推荐人请求开关
            requestid: "",//推荐人绑定id
            re_visible: false,
            customerdas: false,//判断是否为客户进入的新增页面
            khaddressdata: {},
            customerAddressId: "",//客户地址id
            cReported: "",//c类报备
            storeName: "",
            orderGoodsType: "",//订单货品类型
            orderGoodsswath: false,//订单货品类型开关
            salesman: "",//销售员
            salesmanlist: [],//销售员列表
            business: "",//业务员
            businessswatch: false,
            salesmanswatch: false,
            isretailers: false,//根据订单渠道是否为电商展示页面内容不同
            customerId: "",
            customerCode: "",
            mapData: {},//省市区
            ordermapData: {},//省市区
            customerDemand: {
                customerDemandId: "",//客户需求id
                housingTypeId: "",//房屋类型
                housingBuildTypeId: "",//房屋户型
                handoverDate: "",//交房日期,
                estimatedDecorationTime: "",//预计装修时间
                totalAreaOfHousingId: "",//房屋总面积
                decoratedHousingAreaId: "",//装修房屋面积
                decorationProgressId: "",//装修进度
                finishingTimeOfDecoration: "",//装修完成时间
                productId: [],//意向产品
                styletId: [],//意向风格
                remarks: "",//备注
            },
            buildingNumber:'',//楼号
            unitNumber:'',//单元
            roomNumber:'',//室
            //百度地图
            mapText:'',
            poiObj: {},
            center: {lng: 116.404, lat: 39.915},//经纬度
            zoom: 15,
            maps:'',//地图信息
            mapDialogVisible: false,
            keyword: '',
            xqdataid: "",
            xqdatas: {},
            xqtabledata: [],
            storeCustomerId: "",
            storeId: "",//所属门店
            dotList: [], // 网点列表
            khtabdata: {
                resource: 1,
                otherPhone: "",
                storeId: ""
            },//选择客户信息
            selectkdata: [],//选择客户信息
            searchphoto: "",
            category: [],//品类列表
            commodityCategoryId: "",//产品品类
            Brandli: [],//品牌列表
            brandId: "",//品牌
            smbrandId: "",//品牌(诗尼曼id)
            orderl: [],//订单来源列表
            companyId: "",//渠道商id
            otherChannel: "",//其他渠道备注
            sourceswath: "",//订单来源状态 2：内部推荐人 3：外部推荐人
            orderSourceId: "",//订单来源选中
            storeSourceIdList: [],//订单来源二级列表
            storeSourceId: "",//订单来源二级选中
            store_visible: false,
            userList: [],//人员列表
            externalReferee: "", //外部推荐人姓名
            externalRecommendCompany: "", //外部推荐人公司
            externalRecommendPhone: "", //外部推荐人电话
            orderExpectMoney: '',
            orderRemark: '',//订单备注
            contractDeductions: '',//合同扣款
            deductionsReasons: '',//扣款原因
            retractbox1: true,
            retractbox2: true,
            retractbox3: true,
            radiovals: 1,
            selectcustomersmass: false,//选择客户
            demandswitch: false,//需求管理开关
            currentPage: 1,//当前页数
            pageSize: 10,//每页显示个数
            total: 0,//总条数
            currentPage2: 1,//需求列表当前页数
            pageSize2: 5,//需求列表每页显示个数
            total2: 0,//需求列表总条数
            tablekehu: [],
            navList: [],
            dialogVisible: false,
            labelPosition: 'right',
            value: '',
        }
    },
    watch: {
        // 订单来源为电商时，业务员默认为当前登陆人
        orderSourceId(val){
            if(val == 4){
                this.business = this.id*1
                this.salesman = ""
                this.salesmanswatch = true;
                this.businessswatch = false;
            }else{
                this.business = ""
                // this.salesman = this.id*1
                this.salesmanswatch = false;
                this.businessswatch = true;
            }
        },
        // 推荐人手机号
        externalRecommendPhone(val){
            let testphot = /^1(3|4|5|7|8)\d{9}$/;
            let testphots = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
            if (testphot.test(val) || testphots.test(val)) {
                let data = {
                    phone: val
                }
                getReferrerInfoByPhone(data).then(res =>{
                    if(res.status == 200){
                        if(res.data){
                            this.recommendswitch = true;//有内容带出数据
                            this.bindInfo.externalReferee = res.data.referrerId;//推荐人id
                            this.externalReferee = res.data.referrerName;//推荐人姓名
                            this.externalRecommendPhone = res.data.phone;//推荐人手机
                            this.externalRecommendCompany = res.data.companyName;//推荐人公司
                        }
                    }
                }).catch(error =>{
                    console.log('订单管理:根据推荐人手机号查询推荐人 order/justOrder/addJustOrder.vue', error);
                })
            }
        },
        //根据客户电话获取客户信息
        "khtabdata.customerPhone"(val){
            let testphot = /^1(3|4|5|7|8)\d{9}$/;
            let testphots = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
            if(testphot.test(val) || testphots.test(val)){
                let data = {
                    customerPhone: val,
                    storeId: this.storeId
                }
                getCustomerByNameOrPhone(data).then(res =>{
                    if(res.status == 200){
                        if(res.data){
                            this.customeswatch = true;
                            this.khtabdata = res.data;
                            this.storeCustomerId = res.data.storeCustomerId;
                            this.customerId = res.data.customerId
                            this.customerAddressId = res.data.customerAddressId
                            this.customerCode = res.data.customerCode
                            let adddata = res.data.address
                            if(adddata){
                                if(adddata.indexOf("#") != -1){
                                    this.maps = adddata.substring(0,adddata.indexOf("#"));
                                    this.buildingNumber = this.addsplicfun(adddata)[0];
                                    this.unitNumber = this.addsplicfun(adddata)[1];
                                    this.roomNumber = this.addsplicfun(adddata)[2];
                                }else{
                                    this.maps = adddata
                                }
                                this.khaddressdata = {
                                    provinceId: parseInt(res.data.provinceId),//省
                                    cityId: parseInt(res.data.cityId),//市
                                    areaId: parseInt(res.data.areaId),//区
                                    longitude: res.data.longitude+"",//经度
                                    latitude: res.data.latitude+"",//纬度
                                    address: res.data.address,//地址
                                }
                            }
                        }
                        //this.addsplicfun()
                    }
                }).catch(error =>{
                    console.log('订单管理:获取品类列表 order/justOrder/addJustOrder.vue', error);
                })
            }
        },
        // 门店监听
        activeStoreId(val){
            if(val){
                this.getstorfun(val.storeId)
            }
        },
    },
    created() {
        let storeids = JSON.parse(this.$loca.getItem('activeStoreId'))
        if(storeids && storeids.storeId){
            this.getstorfun(storeids.storeId)//根据门店获取相关回显
        }
        // 客户跳转需要的逻辑
        let routerdata = this.$route.query.storeCustomerId
        if(routerdata){
            this.customerdas = true;
            this.customfun(routerdata)
        }

        //渠道商
        listCompanyByService({type: 1}).then(res =>{
            if(res.status == 200){
                this.channellist = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:获取门店列表 order/justOrder/addJustOrder.vue', error);
        })

        //获取门店下和大区下的销售员和业务员
        listSalesmanPost().then(res =>{
            if(res.status == 200){
                this.salesmanlist = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:获取门店列表 order/justOrder/addJustOrder.vue', error);
        })

        // 订单来源
        // listStoreSource({pid: 0,page: 1,limit: 99}).then(res =>{
        //     if(res.status == 200){
        //         this.orderl = res.data.rows;
        //         this.storeSourceChange(1);
        //     }
        // }).catch(error =>{
        //     console.log('订单管理:基础字典查询订单来源 order/justOrder/addJustOrder.vue', error);
        // })
        
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        // 推荐人重置
        resetrecommend(){
            this.recommendswitch = false;
            this.bindInfo.externalReferee = "";//推荐人id
            this.externalReferee = "";//推荐人姓名
            this.externalRecommendPhone = "";//推荐人手机
            this.externalRecommendCompany = "";//推荐人公司
        },
        // 新增推荐人
        addrecommend(){
            if(this.externalReferee == ""){
                this.$message.error("请输入推荐人姓名");
            }else if(this.externalRecommendPhone == ""){
                this.$message.error("请输入推荐人手机");
            }else if(this.externalRecommendCompany == ""){
                this.$message.error("请输入推荐人公司");
            }else{
                let data = {
                    applySn: "",
                    referrerName: this.externalReferee,//推荐人姓名
                    companyName: this.externalRecommendCompany,//推荐人公司
                    phone: this.externalRecommendPhone,//推荐人手机
                    referrerStatus: 4
                }
                getUUID({serialNumber: "RR"}).then(dastas =>{
                    if(dastas.status == 200){
                        data.applySn = dastas.data
                        addReferrer(data).then(res =>{
                            this.$message.success("新增推荐人成功");
                            if(res.status == 200){
                                this.recommendswitch = true;
                                this.bindInfo.externalReferee = res.data;//推荐人id
                            }
                        }).catch(error =>{
                            console.log('订单管理:根据推荐人手机号查询推荐人 order/justOrder/addJustOrder.vue', error);
                        })
                    }
                }).catch(error =>{
                    console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                })
            }
        },
        //根据门店获取相关回显
        getstorfun(val){
            this.storeId = val
            getStore({storeId: val}).then(res =>{
                if(res.status == 200){
                    let storedata = res.data
                    this.orderl = storedata.sourceIds
                    if(storedata.brandMap.length > 0){
                        this.brandId = storedata.brandMap[0].brandId
                    }
                    this.orderGoodsType = storedata.goodsType
                    if(storedata.goodsType && storedata.goodsType != ""){
                        this.orderGoodsswath = true;
                    }else{
                        this.orderGoodsswath = false;
                    }
                    this.storeName = storedata.storeName
                    this.category = storedata.cateMap;
                    if(storedata.cateMap.length > 0){
                        this.commodityCategoryId = storedata.cateMap[0].categoryId
                    }
                    this.Brandli = storedata.brandMap
                    storedata.sourceIds.forEach(item =>{
                        if(item.isMain == 1){
                            this.orderSourceId = item.id
                            this.storeSourceChange(item.id);
                        }
                    })
                    this.storeSourceId = storedata.storeSourceId
                    this.Brandli.forEach((itm)=>{
                        if(itm.brandName == "诗尼曼"){
                            this.smbrandId = itm.brandId
                        }
                    })
                }
            }).catch(error =>{
                console.log('订单管理:获取门店列表 order/justOrder/addJustOrder.vue', error);
            })
        },
        addrecomm(obj) {
            this.re_visible = false;
            this.bindInfo.externalReferee = obj.referrerId;
            this.externalReferee = obj.referrerName;
            this.externalRecommendCompany = obj.companyName;
            this.externalRecommendPhone = obj.phone;
            this.recommendswitch = true;
        },
        closerecomm() {
            this.re_visible = false;
        },
        //打开推荐人弹框
        openredia() {
            this.re_visible = true;
        },
        //打开组织机构树弹框
        openTree() {
            this.organizationdia_vis = true;
        },
        //关闭组织机构树弹框
        closetree(obj, arr) {
            if (obj) {
                this.bindInfo.insideReferee = ""
                this.showStoreName = obj.label;//展示在页面用的组织机构的名字
                this.bindInfo.insideRecommendStore = obj.id;
                this.defaultOpenArr = arr;
                let data = {
                    organizationId: obj.id
                }
                listOrganizationStaff(data).then(res => {
                    if (res.status == "200") {
                        this.userList = res.data.staff;
                    }
                }).catch(error => {
                    console.error("获取人员列表  -----  customermanagementcustomerqueryCustomerSharing",error);
                });
            }
            this.organizationdia_vis = false;
        },
        //打开门店列表弹出层
        // openDia() {
        //     this.store_visible = true;
        // },
        //关闭门店列表弹出层    有val说明有选择门店  根据门店id获取门店下面导购人
        // closeStore(val) {
        //     if (val) {
        //         console.log(val,"门店信息");
        //         this.showStoreName = val.storeName;
        //         this.bindInfo.insideRecommendStore = val.storeId;
        //         this.bindInfo = { ...this.bindInfo, insideReferee: "" }; //清空导购人选中内容
        //         this.getStoreUser(val.storeId);
        //     }
        //     this.store_visible = false;
        // },
        //根据门店id获取门店导购人
        getStoreUser(id) {
            let data = {
                storeId: id
            };
            listStoreUser(data).then(res => {
                if (res.status == "200") {
                    this.userList = res.data;
                } else {
                    this.$message.error("获取门店负责人失败");
                }
            }).catch(error => {
                console.error("获取门店人员列表  -----  customermanagementcustomerqueryCustomerSharing",error);
            });
        },
        // 获取订单来源二级
        storeSourceChange(val){
            this.resetrecommend()
            this.companyId = "";//清空渠道id
            this.storeSourceIdList = []
            this.storeSourceId = ""//清空二级来源id
            this.sourceswath = val
            listStoreSource({pid: val}).then(res =>{
                if(res.status == 200){
                    this.storeSourceIdList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:基础字典查询订单来源 order/justOrder/addJustOrder.vue', error);
            })
        },
        // 客户信息请求
        customfun(routerdata){
            // storeId: this.storeId
            let data = {
                storeCustomerId: routerdata,
                storeId: this.storeId
            }
            getStoreCustomerInfo(data).then(res =>{
                if(res.status == 200){
                    this.khtabdata = res.data;
                    this.storeCustomerId = res.data.storeCustomerId
                    this.customerId = res.data.customerId
                    this.customerCode = res.data.customerCode
                    if(res.data.customerAddressId && res.data.customerAddressId != ""){
                        this.customerAddressId = res.data.customerAddressId
                    }
                    this.khaddressdata = {
                        provinceId: parseInt(res.data.provinceId),//省
                        cityId: parseInt(res.data.cityId),//市
                        areaId: parseInt(res.data.areaId),//区
                        longitude: res.data.longitude+"",//经度
                        latitude: res.data.latitude+"",//纬度
                        address: res.data.address,//地址
                    }
                    let adddata = res.data.address
                    if(adddata.indexOf("#") != -1){
                        this.maps = adddata.substring(0,adddata.indexOf("#"));
                        this.buildingNumber = this.addsplicfun(adddata)[0];
                        this.unitNumber = this.addsplicfun(adddata)[1];
                        this.roomNumber = this.addsplicfun(adddata)[2];
                    }else{
                        this.maps = adddata
                    }
                    this.customeswatch = true;
                }
            }).catch(error =>{
                console.log('订单管理:获取客户信息 order/justOrder/addJustOrder.vue', error);
            })
        },
        getRowKeys(row) {
            return row.storeCustomerId;
        },
        // 截取地址信息方法
        addsplicfun(val){
            if(val){
                return val.substring(val.indexOf("#")+1).split('#')
            }
        },
        // 客户信息校验
        customcheckfun(){
            let testphot = /^1(3|4|5|7|8)\d{9}$/;
            let testphots = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        //     if(testphot.test(this.khtabdata.customerPhone) || testphots.test(val)){
            if(this.khtabdata.customerName == "" || this.khtabdata.customerName == undefined){
                this.$message.error('请填写客户姓名');
                return false;
            }else if(!testphot.test(this.khtabdata.customerPhone) && !testphots.test(this.khtabdata.customerPhone)){
                this.$message.error('客户电话格式有误');
                return false;
            }else if(this.maps == ""){ 
                this.$message.error("尚未地图选取位置，请在弹出的地图界面点击确认操作")
                return false;
            }else if(this.buildingNumber == "" ){ 
                this.$message.error("请输入客户地址楼号")  
                return false;
            }else if(this.unitNumber == "" ){
                this.$message.error("请输入客户地址单元号")  
                return false;
            }else if(this.roomNumber == "" ){
                this.$message.error("请输入客户地址门牌号")  
                return false;
            }
            return true;
        },
        // 订单信息校验
        ordercheckfun(){
            if(this.orderSourceId == ""){
                this.$message({message: '请选择订单来源',type: 'error'});
                return false;
            }else if(this.storeSourceIdList.length && this.storeSourceId  == ""){
                this.$message({message: '请选择二级订单来源',type: 'error'});
                return false;
            }else if(this.brandId == ""){
                this.$message({message: '请选择品牌',type: 'error'});
                return false;
            }else if(this.orderGoodsType == ""){
                this.$message({message: '请选择货品类型',type: 'error'});
                return false;
            }else if(this.commodityCategoryId == ""){
                this.$message({message: '请选择品类',type: 'error'});
                return false;
            }
            if(this.sourceswath == 2 && (this.bindInfo.insideReferee == "" || this.bindInfo.insideRecommendStore == "")){
                this.$message({message: '内部推荐人信息不完整',type: 'error'});
                return false;
            }
            if((this.sourceswath == 50 || this.sourceswath == 51 || this.sourceswath == 52 || this.sourceswath == 53) && this.companyId == ""){
                this.$message({message: '请选择渠道商',type: 'error'});
                return false;
            }
            if(this.sourceswath == 3 && this.bindInfo.externalReferee == ""){
                this.$message({message: '外部推荐人信息不完整',type: 'error'});
                return false;
            }
            if(this.isretailers){
                if(this.contractDeductions == ""){
                    this.$message({message: '请填写合同扣款',type: 'error'});
                    return false;
                }
                if(this.deductionsReasons == ""){
                    this.$message({message: '请填写扣款原因',type: 'error'});
                    return false;
                }
            }
            return true;
        },
        // 提交勾选地址列表
        subminaddchange(){
            let addarr = this.$refs.adddatas.selections
            if(addarr.length > 1){
                this.$message({
                    message: '只能选择一个地址信息',
                    type: 'error'
                });
            }else if(addarr.length < 0){
                this.$message({
                    message: '请选择地址信息',
                    type: 'error'
                });
            }else{
                this.dialogVisible = false;
                let datas = {
                    customerAddressId: addarr[0].customerAddressId
                }
                getCustomerAddress(datas).then(res =>{
                    if(res.status == 200){
                        this.khaddressdata = {
                            provinceId: parseInt(res.data.provinceId),//省
                            cityId: parseInt(res.data.cityId),//市
                            areaId: parseInt(res.data.areaId),//区
                            longitude: res.data.longitude+"",//经度
                            latitude: res.data.latitude+"",//纬度
                            address: res.data.address,//地址
                        }
                        this.customerAddressId = res.data.customerAddressId
                        let adddata = res.data.address
                        if(adddata.indexOf("#") != -1){
                            this.maps = adddata.substring(0,adddata.indexOf("#"));
                            this.buildingNumber = this.addsplicfun(adddata)[0];
                            this.unitNumber = this.addsplicfun(adddata)[1];
                            this.roomNumber = this.addsplicfun(adddata)[2];
                        }else{
                            this.maps = adddata
                        }
                    }
                }).catch(error =>{
                    console.log(error,'订单管理:根据客户姓名获取客户信息 order/justOrder/addJustOrder.vue');
                })
            }
        },
        //取消
        cancel() {
            this.keyword = ""
            this.mapDialogVisible = false
        },
        //弹出地图框
        maplocation(){
            this.mapDialogVisible=true
        },
        confirm() {
            if(this.poiObj.address == undefined){
                this.$message.error("请通过地图搜索位置")
            }else{
                this.maps = this.poiObj.address +"_"+ this.poiObj.title;
                baiduMap(this.center.lng, this.center.lat).then(res=>{
                    this.mapData = res;
                    this.khaddressdata = {
                        provinceId: parseInt(this.mapData.addressComponent.adcode.substring(0,2)+"0000"),//省
                        cityId: parseInt(this.mapData.addressComponent.adcode.substring(0,4)+"00"),//市
                        areaId: parseInt(this.mapData.addressComponent.adcode),//区
                        longitude: this.center.lng+"",//经度
                        latitude: this.center.lat+"",//纬度
                    }
                    this.keyword = "";
                    this.mapDialogVisible=false
                }).catch(error =>{
                    console.log(error)
                })
            }
        },
        //点击所搜索红点
        infohtmlsets(poi) {
            this.poiObj = poi;
            this.center = poi.point;
        },
        //取消选择客户
        closekhdia(){
            this.tablekehu = [];
            this.selectcustomersmass = false;
            this.searchphoto = '';
        },
        resetfun(){//重置客户等信息
            this.customeswatch = false;
            this.storeCustomerId = "";
            this.khtabdata.customerName = ""
            this.khtabdata.customerPhone = ""
            this.khtabdata.otherPhone = ""
            this.customerId = ""
            this.maps = ""
            this.buildingNumber = ""
            this.unitNumber = ""
            this.roomNumber = ""
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
                // this.khtabdata = this.selectkdata[0];
                let datasuser = this.selectkdata[0]
                this.storeCustomerId = datasuser.storeCustomerId;
                this.customerAddressId = datasuser.customerAddressId;
                this.customfun(this.storeCustomerId)
                this.selectcustomersmass = false;

                // this.storeId = datasuser.storeId;
                // this.customerId = datasuser.customerId
                // this.khaddressdata = {
                //     provinceId: parseInt(datasuser.provinceId),//省
                //     cityId: parseInt(datasuser.cityId),//市
                //     areaId: parseInt(datasuser.areaId),//区
                //     longitude: datasuser.longitude+"",//经度
                //     latitude: datasuser.latitude+"",//纬度
                //     address: datasuser.address,//地址
                // }
                // console.log(datasuser)
                // console.log(this.khaddressdata)
                // let adddata = datasuser.address
                // if(adddata){
                //     this.maps = adddata.substring(0,adddata.indexOf("#"));
                //     this.buildingNumber = this.addsplicfun(adddata)[0];
                //     this.unitNumber = this.addsplicfun(adddata)[1];
                //     this.roomNumber = this.addsplicfun(adddata)[2];
                // }

                // this.selectcustomersmass = false;
                // this.tablekehu = [];
                // this.currentPage = 1;//当前页数
                // this.pageSize = 5;//每页显示个数
                // this.total = 0;//总条数
            }
        },
        // 查询客户信息
        cxkehu(val){
            if(val){
                this.currentPage = val;
            }
            let data = {
                names: this.searchphoto,
                page: this.currentPage,
                limit: this.pageSize,
                storeId: this.storeId
            }
            listStoreCustomer(data).then(res =>{
                if(res.status == 200){
                    this.tablekehu = res.data.rows
                    this.total = res.data.total;
                }
            }).catch(error =>{
                console.log('订单管理:我的客户TAB_列表查询 order/justOrder/addJustOrder.vue', error);
            })
        },
        cancal(){
            this.$router.push({path: "/ordermm/order"})
        },
        //提交新增订单操作
        submitaddorder(){
            // 客户信息校验
            if(!this.customcheckfun()){
                return false;
            }
            // 订单信息校验
            if(!this.ordercheckfun()){
                return false;
            }
            if(!this.salesmanswatch && this.salesman == ""){
                this.$message.error("请选择销售员！")
                return
            }
            this.khaddressdata.address = this.maps+"#"+this.buildingNumber+"#"+this.unitNumber+"#"+this.roomNumber;
            //新增客户基本信息参数
            let khdata = {
                storeCustomerId: this.storeCustomerId,//门店客户id
                storeId: this.storeId,//所属门店
                customerName: this.khtabdata.customerName,//客户姓名
                customerPhone: this.khtabdata.customerPhone,//客户电话
                otherPhone: this.khtabdata.otherPhone,//备用电话
                customerAddresses: [this.khaddressdata],
                address: this.khaddressdata.address,
                salesmanId: this.salesman,//所属销售员
                businessId: this.business,//所属业务员
                customerAddressId: this.customerAddressId,
            }
            // if(this.orderSourceId == 4){
            //     khdata.businessId = this.id//所属业务员
            //     khdata.salesmanId = ""//所属销售员
            // }else{
            //     khdata.businessId = ""//所属业务员
            //     khdata.salesmanId = this.id//所属销售员
            // }
            //新增客户需求参数
            let axqdata = {
                customerId: this.customerId,//客户id
                customerDemandId: this.customerDemand.customerDemandId,//客户需求id
                housingTypeId: this.customerDemand.housingTypeId,//房屋类型
                housingBuildTypeId: this.customerDemand.housingBuildTypeId,//房屋户型
                handoverDate: this.customerDemand.handoverDate,//交房日期
                estimatedDecorationTime: this.customerDemand.estimatedDecorationTime,//预计装修时间
                totalAreaOfHousingId: this.customerDemand.totalAreaOfHousingId,//房屋总面积
                decoratedHousingAreaId: this.customerDemand.decoratedHousingAreaId,//装修房屋面积
                decorationProgressId: this.customerDemand.decorationProgressId,//装修进度
                finishingTimeOfDecoration: this.customerDemand.finishingTimeOfDecoration,//装修完成时间
                projectId: this.customerDemand.productId,//意向产品**************************
                styletId: this.customerDemand.styletId,//意向风格
                remarks: this.customerDemand.remarks,//备注
            };
            // 没有客户id的时候需要做新增客户需求操作
            let orderdata = {
                ...khdata,
                ...axqdata,
                customerCode: this.customerCode,//客户编号
                orderSourceId: this.orderSourceId,//订单来源
                brandId: parseInt(this.brandId),//品牌
                orderGoodsType: this.orderGoodsType,//订单货品类型
                commodityCategoryId: parseInt(this.commodityCategoryId),//品类/产品类别
                orderExpectMoney: this.orderExpectMoney,//预计金额
                orderRemark: this.orderRemark,//备注
                contractDeductions: this.contractDeductions,//合同扣款
                deductionsReasons: this.deductionsReasons,//扣款原因
            }
            if(this.storeSourceIdList.length){//判断来源有二级的时候传二级
                orderdata.orderSourceId = this.storeSourceId
            }else{
                orderdata.orderSourceId = this.orderSourceId
            }
            if(this.sourceswath == 2){
                orderdata.referrerId = this.bindInfo.insideReferee;//内部推荐人ID
                orderdata.internalReferrerStoreId = this.bindInfo.insideRecommendStore;//内部推荐人门店ID
            }
            if(this.sourceswath == 3){
                orderdata.referrerId = this.bindInfo.externalReferee;//外部推荐人ID
            }
            if(this.sourceswath == 50 || this.sourceswath == 51 || this.sourceswath == 52 || this.sourceswath == 55){
                orderdata.companyId = this.companyId
            }
            if(this.sourceswath == 53){
                orderdata.otherChannel = this.otherChannel
            }

            // 品牌为诗尼曼的时候填写c类报备参数
            if(this.smbrandId == this.brandId){//c类报备
                orderdata.cReported = parseInt(this.cReported)
            }
            // return false
            this.loadingbtn = true;
            if(this.customerId == ""){//判断客户是否新增
                new Promise((resolve, reject) => {
                    getUUID({ serialNumber: "C" }).then(res => {
                        resolve(res);
                    });
                }).then(res => {
                    orderdata.customerCode = res.data;
                     getUUID({serialNumber: "SO"}).then(dastas =>{
                        if(dastas.status == 200){
                            orderdata.orderNumber = dastas.data
                            addOrder(orderdata).then(vals =>{
                                if(vals.status == 200){
                                    this.$message.success("新增订单成功");
                                    this.$router.push({path: '/ordermm/order'});
                                }else{
                                    this.$message.error(vals.message);
                                }
                            }).catch(error =>{
                                this.loadingbtn = false;
                                console.log('订单管理:新增订单 order/justOrder/addJustOrder.vue', error);
                            })
                        }
                    }).catch(error =>{
                        console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                    })
                });
            }else{
                getUUID({serialNumber: "SO"}).then(dastas =>{
                    if(dastas.status == 200){
                        orderdata.orderNumber = dastas.data
                        addOrder(orderdata).then(res =>{
                            if(res.status == 200){
                                this.$message.success("新增订单成功");
                                this.$router.push({path: '/ordermm/order'});
                            }else{
                                this.$message.error(res.message);
                            }
                        }).catch(error =>{
                            this.loadingbtn = false;
                            console.log('订单管理:新增订单 order/justOrder/addJustOrder.vue', error);
                        })
                    }
                }).catch(error =>{
                    console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                })
            }
        },
        //需求管理
        demandfun(){
            if(this.customerId !== ""){
                //获取客户需求列表
                let data = {
                    customerId: this.customerId,
                    page: this.currentPage2,
                    limit: this.pageSize2
                };
                listCustomerDemand(data).then(res =>{
                    if(res.status == 200){
                        this.xqtabledata = res.data.rows
                        this.demandswitch = true;
                    }
                }).catch(error =>{
                    console.log('订单管理:获取客户需求列表 order/justOrder/addJustOrder.vue', error);
                })
            }else{
                this.$message({
                    message: '请填写客户信息',
                    type: 'error'
                });
            }
            
        },
        //选择提交需求管理
        xqlistclick(){
            if(this.xqdatas.length > 1){
                this.$message({
                    message: '只能选择一个需求信息',
                    type: 'error'
                });
            }else if(this.xqdatas.length === 0){
                this.$message({
                    message: '请选择需求信息',
                    type: 'error'
                });
            }else{
                let datas = {
                    customerDemandId: this.xqdataid
                }
                getCustomerDemand(datas).then(res =>{
                    if(res.status == 200){
                        this.customerDemand = res.data
                        if(this.customerDemand.productId){
                            this.customerDemand.productId = res.data.productId.split(',').map(Number);
                        }else{
                            this.customerDemand.productId = [];
                        }
                        if(this.customerDemand.styletId){
                            this.customerDemand.styletId = res.data.styletId.split(',').map(Number);
                        }else{
                            this.customerDemand.productId = []
                        }
                        this.demandswitch = false;
                        this.customerDemand.customerDemandId = this.xqdataid;
                    }
                }).catch(error =>{
                    console.log('订单管理:获取客户需求信息 order/justOrder/addJustOrder.vue', error);
                })
            }
        },
        addressaler(){
            this.dialogVisible = true;
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
            this.selectkdata = val;
        },
        handleSelectionChangexq(val){
            this.xqdataid = val[0].customerDemandId;
            this.xqdatas = val;
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
        sizeChange2(val) {
            this.currentPage2 = 1;
            this.pageSize2 = val;
            this.demandfun()
        },
        currentChange2(val) {//需求信息翻页方法
            this.currentPage2 = val;
            this.demandfun()
        },
        retractone(){
            this.retractbox1 = !this.retractbox1
        },
        retracttwo(){
            this.retractbox2 = !this.retractbox2
        },
        retracttre(){
            this.retractbox3 = !this.retractbox3
        },
        selectcustomers(){
            this.searchphoto = "";
            this.cxkehu()
            this.selectcustomersmass = true;
        },
    }
}
</script>
<style scoped lang="scss">
    .addJustOrder{
        font-size: 12px;
        .el-card+.el-card{
            margin-top: 20px;
        }
        .tapbox{
            display: flex;
            justify-content: space-between;
        }
        .bordermodel{
            border: 1px solid #e6e6e6;
            margin-bottom: 20px;
            padding: 10px 0px;
        }
        .textitle{
            display: flex;
            justify-content: space-between;
            padding: 10px 20px;
            font-size: 14px;
            .txtlef{
                font-weight: 600;
                color: #606266;
            }
            .clitxt{
                margin-left: 20px;
            }
        }
        .posirkeh{
            position: relative;
        }
        .posiakeh{
            position: absolute;
            right: -60px;
            top: 7px;
        }
        .posiakehs{
            position: absolute;
            right: -100px;
            top: 7px;
        }
        .orderfrom{
            padding: 10px 70px;
            .demo_form_inline{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                >div{
                    width: 40%;
                }
                .selewi{
                    width: 100%;
                }
                .disflex,.disflex150{
                    display: flex;
                    align-items: center;
                    >div{
                        max-width: 250px;
                    }
                    >div+div{
                        margin-left: 10px;
                    }
                    .addbtn{
                        min-width: 160px;
                        button+button{
                            margin-left: 5px;
                        }
                    }
                }
                .disflex150{
                    >div{
                        flex: 1;
                        max-width: 200px;
                    }
                }
            }
        }
        .addresslist{
            display: flex;
            position: relative;
            flex-wrap: wrap;
            .addresselec{
                width: 100% !important;
            }
            >li{
                width: calc((100% - 10px)/3);
                display: flex;
                align-items: center;
                box-sizing: border-box;
                span{
                    display: block;
                    white-space: nowrap;
                    margin: 0px 5px;
                }
                +li{
                    // margin-right: 5px;
                    margin-top: 10px;
                }
                >div{
                    min-width: 80px;
                }
            }
            li:last-of-type{
                margin-right: 0px;
            }
        }
        // .explaintxt{
        //     font-size: 14px;
        //     width: 100px;
        //     min-width: 100px;
        //     padding-right: 10px;
        //     text-align: right;
        // }
        .explaintxttwo{
            font-size: 14px;
            margin-left: 20px;
            color: #1ABC9C;
            position: absolute;
            right: -65px;
        }
        .selecusclas{
            .scarchclass{
                width: 100%;
                padding-right: 20px;
                display: flex;
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
        .map {
            width: 100%;
            height: 450px;
            .map_input{
            width:350px;
            height:30px;
            }
            .map_searchinfo{
            width:350px;max-height:450px;overflow:auto;
            }
        }
        .titlecals{
            top: 0;
        }
        .marcal{
            margin-bottom: 10px;
        }
    }
</style>
