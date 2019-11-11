<template>
    <div class="getorder" v-cloak>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <div class="tapbox">
                <div></div>
                <div>
                    <el-button type="primary" size="medium" @click="submitaddorder" :loading="loadingbtn">保存</el-button>
                    <el-button size="medium" @click="clanc">取消</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="lvs cards">
            <div class="orderbox">
                <div class="titlecals">订单信息</div>
                <div class="orderfrom">
                    <el-form :label-position="labelPosition" 
                        label-width="130px" 
                        :model="fromdata" 
                        class="demo-form-inline">
                        <el-form-item label="订单编号">
                            <el-input v-model="fromdata.orderNumber" disabled size="medium" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="订单日期">
                            <el-date-picker  disabled v-model="fromdata.orderDate" value-format='yyyy-M-dd HH:mm:ss' 
                                format='yyyy-M-dd HH:mm:ss' size="medium" type="datetime" placeholder="选择日期"  class="selewi">
                             </el-date-picker>
                        </el-form-item>
                        <el-form-item label="客户姓名">
                            <el-input v-model="fromdata.customerName" disabled size="medium" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="客户电话">
                            <el-input v-model="fromdata.customerPhone" disabled size="medium" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="备用电话">
                            <el-input v-model="fromdata.otherPhone" :disabled="contractState != 0" size="medium" placeholder="请输入备注电话"></el-input>
                        </el-form-item>
                        <el-form-item label="所属门店">
                            <el-input v-model="fromdata.storeName" disabled size="medium"></el-input>
                        </el-form-item>
                        <!-- 判断订单来源是否为外部推荐人 -->
                        <el-form-item label="推荐人" v-if="recommendid == fromdata.orderSourceId">
                            <el-input v-model="fromdata.user" disabled size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="预计订单金额">
                            <el-input v-model="fromdata.orderExpectMoney" :disabled="contractState != 0" size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="业务员">
                            <el-input size="medium" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="销售员">
                            <el-input v-model="fromdata.salesmanName" size="medium" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="品类">
                            <el-select v-model="fromdata.commodityCategoryId" disabled placeholder="请选择产品类别" size="medium" class="selewi">
                                <el-option :label="itm.categoryName" :value="itm.categoryId" v-for="itm in category" :key="itm.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="品牌">
                            <el-select v-model="fromdata.brandId" disabled placeholder="请选择品牌" size="medium" class="selewi">
                                <el-option :label="itm.brandName" :value="itm.brandId" v-for="itm in Brandli" :key="itm.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 判断订单来源是否为外部推荐人 -->
                        <el-form-item label="推荐门店" v-if="recommendid == fromdata.orderSourceId">
                            <el-input v-model="fromdata.user" disabled size="medium"></el-input>
                        </el-form-item>
                        <el-form-item label="订单来源" class="selewi">
                            <div class="disflex">
                                <el-select v-model="fromdata.orderSourcePid" placeholder="请选择订单来源" disabled class="selewi" @change="storeSourceChange">
                                    <el-option v-for="item in orderl" :key="item.value"
                                        :label="item.sourceName" :value="item.storeSourceId">
                                    </el-option>
                                </el-select>
                                <el-select v-model="fromdata.orderSourceId" placeholder="请选择" class="selewi" disabled v-if="fromdata.orderSourceId">
                                    <el-option v-for="item in storeSourceIdList" :key="item.value"
                                        :label="item.sourceName" :value="item.storeSourceId">
                                    </el-option>
                                </el-select>
                                <el-input v-if="sourceswath == 2" size="medium" v-model="fromdata.map.organizationName" disabled placeholder="请选择组织机构"></el-input>
                                <el-input v-if="sourceswath == 2" size="medium" v-model="fromdata.referrerName" disabled placeholder="请选择人员"></el-input>
                                <el-input v-if="sourceswath == 3" size="medium" :disabled="recommendswitch" v-model="fromdata.referrerName" placeholder="外部推荐人"></el-input>
                                <el-input v-if="sourceswath == 3" size="medium" :disabled="recommendswitch" v-model="fromdata.phone" placeholder="手机"></el-input>
                                <el-input v-if="sourceswath == 3" size="medium" :disabled="recommendswitch" v-model="fromdata.companyName" placeholder="推荐人所属公司"></el-input>
                                <el-input v-if="sourceswath == 53" maxlength="10" placeholder="请输入10字以内" v-model="fromdata.otherChannel" size="medium"></el-input>
                                <div v-if="sourceswath == 3 && !existsRebates" class="addbtn">
                                    <el-button size="mini" type="primary" @click="openredia">选择</el-button>
                                    <el-button size="mini" type="primary" @click="addrecommend">新增</el-button>
                                    <el-button size="mini" type="text" @click="resetrecommend">重置</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="渠道商" v-if="sourceswath == 50 || sourceswath == 51 || sourceswath == 52">
                            <el-input v-model="companyName" disabled placeholder="选择渠道商" size="medium"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="客户地址" class="selewi">
                            <ul class="addresslist">
                                <li class="addresselec"><el-input placeholder='地图定位' v-model="maps" :disabled="countOrderBudget != 0" maxlength="50" readonly @focus='maplocation'></el-input></li>
                                <li><span>楼号/区</span><el-input placeholder="楼号/区" :disabled="countOrderBudget != 0" v-model="buildingNumber"></el-input></li>
                                <li><span>单元/楼号</span><el-input placeholder="单元/号楼" :disabled="countOrderBudget != 0" v-model="unitNumber"></el-input></li>
                                <li><span>室</span><el-input placeholder="室" :disabled="countOrderBudget != 0" v-model="roomNumber"></el-input></li>
                                <div class="explaintxttwo">
                                    <span @click="addressaler" class="table_action_span">地址管理</span>
                                </div>
                            </ul>
                        </el-form-item> -->
                        <el-form-item label="客户地址" class="selewi">
                            <ul class="addresslist">
                                <li class="addresselec"><el-input placeholder='地图定位' v-model="maps" disabled maxlength="50" readonly @focus='maplocation'></el-input></li>
                                <li><el-input placeholder="楼号/区" disabled v-model="buildingNumber"></el-input><span>楼号/区</span></li>
                                <li><el-input placeholder="单元/号楼" disabled v-model="unitNumber"></el-input><span>单元/楼号</span></li>
                                <li><el-input placeholder="室" disabled v-model="roomNumber"></el-input><span>室</span></li>
                                <!-- <div class="explaintxttwo">
                                    <span @click="addressaler" class="table_action_span">地址管理</span>
                                </div> -->
                            </ul>
                        </el-form-item>
                        <el-form-item label="订单备注" class="selewi">
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="fromdata.orderRemark"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="froms">
                        <span class="explaintxt">需求信息</span>
                        <div class="borclas">
                            <demandassembly :customerDemand="customerDemand" :contractState="contractState != 0"></demandassembly>
                        </div>
                        <span class="explaintxttwo table_action_span" @click="demandfun" v-if="contractState == 0">需求管理</span>
                    </div>
                </div>
            </div>
        </el-card>
        <!-- 地址弹框 -->
        <el-dialog class="customDialogTitle" title="地址管理" :visible.sync="dialogVisible" width="50%">
            <div><addresselection ref="adddatas" :customerId="customerId" v-if="dialogVisible"></addresselection></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminaddchange">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 需求管理 -->
        <el-dialog title="需求管理" class="customDialogTitle" :visible.sync="demandswitch" width="60%">
            <div class="lvs">
                <el-table border :row-style="tableBodycolor" :row-class-name="tableRowClassName" @selection-change="handleSelectionChangexq" :data="xqtabledata" style="width: 100%;" >
                    <el-table-column type="selection" width="40" align="center"></el-table-column>
                    <el-table-column prop="housingTypeId" align="center" label="需求标题" sortable></el-table-column>
                    <el-table-column prop="createAt" align="center"  label="操作人" sortable></el-table-column>
                    <el-table-column prop="createTime" align="center"  label="操作时间"></el-table-column>
                </el-table>
                <div class="pagination_wrap">
                    <pagination :current-page="currentPage1" :pageSize="pageSize1" :total="total1" @sizeChange="sizeChange1" @currentChange="currentChange1"></pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="xqlistclick">确 定</el-button>
                <el-button @click="demandswitch = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 选择客户 -->
        <el-dialog title="选择客户" class="customDialogTitle" :visible.sync="selectcustomersmass" width="50%">
            <div class="selecusclas">
                <el-input placeholder="客户ID/姓名/电话/地址" v-model="searchtext" size="medium" class="scachinp">
                    <el-button slot="append" icon="el-icon-search" size="medium"></el-button>
                </el-input>
                <div class="customertab">
                    <p class="customertxt">客户列表</p>
                    <el-table border :row-key="getRowKeys"
                        :row-style="tableBodycolor" 
                        :row-class-name="tableRowClassName" 
                        @selection-change="handleSelectionChange" 
                        :data="tabList" style="width: 100%;" >
                        <el-table-column type="selection" width="40" :reserve-selection="true" align="center"></el-table-column>
                        <el-table-column prop="contactsName" align="center"  label="客户姓名" sortable></el-table-column>
                        <el-table-column prop="contactsName" align="center"  label="客户电话" sortable></el-table-column>
                        <el-table-column prop="contactsName" align="center"  label="客户地址"></el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectcustomersmass = false">确 定</el-button>
                <el-button @click="selectcustomersmass = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 客户信息地址 -->
        <el-dialog class="customDialogTitle" title="地图定位" :visible.sync="mapDialogVisible" width="800px" v-if="mapDialogVisible">
            <baidu-map class="map" :center="center" :zoom="15" :keyboard="true" 
                :scroll-wheel-zoom="true" :double-click-zoom="true">
                <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-control>
                    <el-input type="text" v-model="keyword" size="medium" placeholder="请输入搜索关键字" style="width:300px"></el-input>
                    <bm-local-search class="map_searchinfo" :keyword="keyword" :auto-viewport="true" 
                        @infohtmlset="infohtmlsets" :panel="true">
                    </bm-local-search>
                </bm-control>
            </baidu-map>
            <div slot="footer" style="margin-top: 0px;">
                <el-button type="primary" size="medium" @click="confirm">保存</el-button>
                <el-button size="medium" @click="cancel">取消</el-button>
            </div>
        </el-dialog>

        <!-- 推荐人信息 -->
        <recommenderdia :visible="re_visible" @add_recomm="addrecomm" @close_recomm="closerecomm"></recommenderdia>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "../../components/breadcrumb";
import pagination from '../../components/pagination';
import addresselection from '../../components/addresselection';
import demandassembly from '../components/demandassembly';
import recommenderdia from "@/views/customermanagement/myclient/components/recommenderdia";
import { getUUID } from "api/pulicJava";
import { 
    getOrderInfo, //编辑订单
    listCategory, //获取品类列表
    listBrand, //获取品牌
    editOrder, //编辑订单_提交
    listBaseDict, //基础字典查询
    getCustomerAddress,//查询地址信息
    listCustomerDemand,//获取客户需求列表
    getCustomerDemand,//获取客户需求信息
    listStore,//获取门店
    getUserStore,//获取门店列表
    addReferrer,//新增外部推荐人
    getStore,// 获取门店相关信息
     } from 'api/order/order/order';
import {
  baiduMap,
} from 'src/api/pulicJava.js';
  import { listStoreSource } from '@/api/systemcenter/storemanagement';


export default {
    components: {
        breadcrumb,
        pagination,
        addresselection,
        demandassembly,
        recommenderdia,
    },
    data(){
        return {
            loadingbtn: false,
            storeId: "",
            countOrderBudget: "",
            contractState: "",
            dotList: [], // 网点列表
            xqdatas: [],
            customerAddressId: "",//地址id
            customerDemandId: "",//客户需求id
            mapDialogVisible: false,
            khaddressdata: {},
            mapData: {},//省市区
            keyword: '',
            poiObj: {},
            center: {lng: 116.404, lat: 39.915},//经纬度
            customerId: this.$route.query.customerId,
            maps:'',//地图信息
            buildingNumber:'',//楼号
            unitNumber:'',//单元
            roomNumber:'',//室
            mapText:'',
            orderl: [],//订单来源列表
            recommendid: "",//外部推荐人id
            orderSourceId: "",//订单来源选中
            companyName: "",//渠道商
            existsRebates: false,//是否存在返点
            fromdata:{
                orderSourcePid: "",
                referrerName: "",
                phone: "",
                companyName: "",//推荐人公司
                commodityCategoryId: "",
                orderChannel: "",
                commodityName: "",
                map: {}
            },
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
            category: [],//品类列表
            commodityCategoryId: "",//产品品类
            Brandli: [],//品牌列表
            brandId: "",//品牌
            orderExpectMoney: '',
            orderRemark: '',
            searchtext: '',
            selectcustomersmass: false,//选择客户
            demandswitch: false,//需求管理开关
            tabList: [],//列表数据
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 0,//总条数
            currentPage1: 1,//当前页数
            pageSize1: 5,//每页显示个数
            total1: 0,//总条数
            xqtabledata: [],
            navList: [],
            dialogVisible: false,
            labelPosition: 'right',
            companyId: "",//渠道商id
            otherChannel: "",//其他渠道备注
            sourceswath: "",//订单来源状态 2：内部推荐人 3：外部推荐人
            storeSourceIdList: [],//订单来源二级列表
            storeSourceId: "",//订单来源二级选中
            addredata: "",
            externalRefereeid: "",//推荐人id
            recommendswitch: true,//外部推荐人禁用开关
            re_visible: false,
        }
    },
    watch: {
        "fromdata.orderSourcePid"(val){
            this.storeSourceChange(val)
        }
    },
    created() {
        let data = {
            orderId: this.$route.query.orderId 
        }
        getOrderInfo(data).then(res =>{
            console.log(res);
            if(res.status == 200){
                this.storeId = res.data.storeId;
                this.getstorfun(this.storeId)
                this.countOrderBudget = res.data.countOrderBudget;//是否生成预算清单
                this.contractState = res.data.contractState;//是否签订电子合同
                this.companyName = res.data.companyName//渠道商
                this.externalRefereeid = res.data.referrerId//推荐人id
                this.existsRebates = res.data.existsRebates == 1 ? true : false//是否存在返点，1存在，0不存在
                this.fromdata = {
                    ...res.data,
                    ...res.data.map,
                    commodityCategoryId: res.data.commodityCategoryId*1,
                    brandId: res.data.brandId*1,
                };

                if(!res.data.map){
                    this.fromdata.orderSourcePid = res.data.orderSourceId
                    this.fromdata.orderSourceId = ""
                }

                this.fromdata.customerName = res.data.customer.customerName;
                this.fromdata.customerPhone = res.data.customer.customerPhone;
                this.fromdata.otherPhone = res.data.otherPhone;
                this.customerAddressId = res.data.customerAddressId;
                let adddata = res.data.address;
                this.addredata = res.data.address;
                //地址输入框信息转化展示
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
                    cityId: parseInt(res.data.cityId),//市********
                    areaId: parseInt(res.data.areaId),//区********
                    longitude: res.data.longitude+"",//经度********
                    latitude: res.data.latitude+"",//纬度********
                    address: res.data.address,//地址
                }
                console.log(this.khaddressdata,"this.khaddressdata")
                if(res.data.customerDemandVO){
                    this.customerDemand = res.data.customerDemandVO;
                    this.customerDemandId = res.data.customerDemandId;
                    if(this.customerDemand.styletId){
                        this.customerDemand.styletId = this.customerDemand.styletId.split(',').map(Number);//意向风格转化格式
                    }else{
                        this.customerDemand.styletId = []
                    }
                    if(this.customerDemand.productId){
                        this.customerDemand.productId = this.customerDemand.productId.split(',').map(Number);//意向产品转化格式
                    }else{
                        this.customerDemand.productId = []
                    }
                }
            }
        }).catch(error =>{
            console.log('订单管理:修改订单 order/order/getorder.vue', error);
        })
        // 获取门店
        // getUserStore().then(res =>{
        //     if(res.status == 200){
        //         this.dotList = res.data.rows;
        //     }
        // }).catch(error =>{
        //     console.log('订单管理:获取门店列表 order/justOrder/addJustOrder.vue', error);
        // })

        //获取品牌
        // listBrand().then(res =>{
        //     if(res.status == 200){
        //         this.Brandli = res.data;
        //     }
        // }).catch(error =>{
        //     console.log('订单管理:获取品牌列表 order/order/getorder.vue', error);
        // })

        // 获取品类列表
        // listCategory().then(res =>{
        //     if(res.status == 200){
        //         this.category = res.data;
        //     }
        // }).catch(error =>{
        //     console.log('订单管理:获取品类列表 order/order/getorder.vue', error);
        // })

        // 订单来源
        listStoreSource({pid: 0,page: 1,limit: 99}).then(res =>{
            if(res.status == 200){
                this.orderl = res.data.rows;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询订单来源 order/justOrder/addJustOrder.vue', error);
        })
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        // 推荐人重置
        resetrecommend(){
            this.recommendswitch = false;
            this.externalRefereeid = "";//推荐人id
            this.fromdata.referrerName = "";//推荐人姓名
            this.fromdata.phone = "";//推荐人手机
            this.fromdata.companyName = "";//推荐人公司
        },
        // 新增推荐人
        addrecommend(){
            if(this.fromdata.referrerName == ""){
                this.$message.warning("请输入推荐人姓名");
            }else if(this.fromdata.phone == ""){
                this.$message.warning("请输入推荐人手机");
            }else if(this.fromdata.companyName == ""){
                this.$message.warning("请输入推荐人公司");
            }else{
                let data = {
                    applySn: "",
                    referrerName: this.fromdata.referrerName,//推荐人姓名
                    companyName: this.fromdata.companyName,//推荐人公司
                    phone: this.fromdata.phone,//推荐人手机
                    referrerStatus: 4
                }
                getUUID({serialNumber: "RR"}).then(dastas =>{
                    if(dastas.status == 200){
                        data.applySn = dastas.data
                        addReferrer(data).then(res =>{
                            this.$message.success("新增推荐人成功");
                            if(res.status == 200){
                                this.recommendswitch = true;
                                this.externalRefereeid = res.data;//推荐人id
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
        addrecomm(obj) {
            this.re_visible = false;
            console.log(obj,"推荐人信息");
            this.externalRefereeid = obj.referrerId;
            this.fromdata.referrerName = obj.referrerName;
            this.fromdata.companyName = obj.companyName;
            this.fromdata.phone = obj.phone;
            this.recommendswitch = true;
        },
        closerecomm() {
            this.re_visible = false;
        },
        //打开推荐人弹框
        openredia(){
            this.re_visible = true;
        },
        getstorfun(val){
            getStore({storeId: val}).then(res =>{
                if(res.status == 200){
                    let storedata = res.data
                    this.category = storedata.cateMap;
                    this.Brandli = storedata.brandMap
                }
            }).catch(error =>{
                console.log('订单管理:获取门店列表 order/justOrder/addJustOrder.vue', error);
            })
        },
        // 获取订单来源二级
        storeSourceChange(val){
            this.companyId = "";//清空渠道id
            this.storeSourceIdList = []
            this.storeSourceId = ""//清空二级来源id
            this.sourceswath = val
            console.log(val);
            listStoreSource({pid: val}).then(res =>{
                if(res.status == 200){
                    this.storeSourceIdList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:基础字典查询订单来源 order/justOrder/addJustOrder.vue', error);
            })
        },
        getRowKeys(row) {
            return row.storeCustomerId;
        },
        //选择提交需求管理
        xqlistclick(){
            if(this.xqdatas.length > 1){
                this.$message({
                    message: '只能选择一个需求信息',
                    type: 'warning'
                });
            }else if(this.xqdatas.length === 0){
                this.$message({
                    message: '请选择需求信息',
                    type: 'warning'
                });
            }else{
                let datas = {
                    customerDemandId: this.xqdatas[0].customerDemandId
                }
                getCustomerDemand(datas).then(res =>{
                    console.log(res,"获取客户需求信息");
                    if(res.status == 200){
                        // this.customerDemandId = this.xqdataid;
                        this.customerDemand = res.data;
                        this.customerDemand.productId = res.data.productId.split(',').map(Number);
                        this.customerDemand.styletId = res.data.styletId.split(',').map(Number);
                        this.demandswitch = false;
                        this.xqdatas = [];
                    }
                }).catch(error =>{
                    console.log('订单管理:获取客户需求信息 order/order/getorder.vue', error);
                })
            }
        },
        // 截取地址信息方法
        addsplicfun(val){
            if(val){
                return val.substring(val.indexOf("#")+1).split('#')
            }
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
                        this.customerAddressId = addarr[0].customerAddressId
                        this.khaddressdata = {
                            provinceId: parseInt(res.data.provinceId),//省
                            cityId: parseInt(res.data.cityId),//市
                            areaId: parseInt(res.data.areaId),//区
                            longitude: res.data.longitude+"",//经度
                            latitude: res.data.latitude+"",//纬度
                            address: res.data.address,//地址
                        }
                        this.addredata = res.data.address;
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
                    console.log(error,'订单管理:根据客户姓名获取客户信息 order/order/getorder.vue');
                })
                
            }
        },
        //点击所搜索红点
        infohtmlsets(poi){
            this.poiObj = poi;
            this.center = poi.point;
        },
        //取消
        cancel() {
            this.mapDialogVisible = false
        },
        //地图确认按钮  
        confirm() {
            if(this.poiObj.address == undefined){
                this.$message.warning("请通过地图搜索位置")
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
                    this.center = res.location;
                }).catch(error =>{
                    console.log(error)
                })
            }
        },
        // 客户信息校验
        customcheckfun(){
            if(this.maps == ""){ 
                this.$message.error("尚未地图选取位置，请在弹出的地图界面点击确认操作")  
                return false;
            }else if(this.buildingNumber == "" ){ 
                this.$message.error("请输入楼号")  
                return false;
            }else if(this.unitNumber == "" ){
                this.$message.error("请输入单元号")  
                return false;
            }else if(this.roomNumber == "" ){
                this.$message.error("请输入门牌号")  
                return false;
            }
            return true;
        },
        //提交新增订单操作
        submitaddorder(){
            // 客户信息校验
            // if(!this.customcheckfun()){
            //     return false;
            // }
            if(this.sourceswath == 3 && (this.externalRefereeid == "" || !this.externalRefereeid)){
                this.$message.warning("请输入推荐人信息")
                return false
            }
            let str = "";
            str+=this.maps+"#"+this.buildingNumber+"#"+this.unitNumber+"#"+this.roomNumber;
            this.khaddressdata.address = str

            let custdata = {
                customerDemandId: this.customerDemand.customerDemandId,
                housingTypeId: this.customerDemand.housingTypeId,
                housingBuildTypeId: this.customerDemand.housingBuildTypeId,
                handoverDate: this.customerDemand.handoverDate,
                estimatedDecorationTime: this.customerDemand.estimatedDecorationTime,
                totalAreaOfHousingId: this.customerDemand.totalAreaOfHousingId,
                decoratedHousingAreaId: this.customerDemand.decoratedHousingAreaId,
                decorationProgressId: this.customerDemand.decorationProgressId,
                finishingTimeOfDecoration: this.customerDemand.finishingTimeOfDecoration,
                projectId: this.customerDemand.productId,
                styletId: this.customerDemand.styletId,
                remarks: this.customerDemand.remarks,//备注
            }
            let data = {
                ...this.khaddressdata,//地址信息
                ...custdata,//客户需求相关信息
                customerId: this.customerId,
                storeId: this.storeId,
                contractState: this.contractState,
                orderId: this.$route.query.orderId,//订单编号
                // commodityCategoryId: this.fromdata.commodityCategoryId,//品类********************
                orderExpectMoney: this.fromdata.orderExpectMoney,//订单金额备注
                otherPhone: this.fromdata.otherPhone,//备用电话
                // brandId: this.fromdata.brandId,//品牌
                // customerAddressId: this.customerAddressId,//地址id
                orderRemark: this.fromdata.orderRemark,//备注
                // contractState: this.fromdata.contractState,
                // countOrderBudget: this.fromdata.countOrderBudget,//
            }
            if(this.sourceswath == 3){
                data.referrerId = this.externalRefereeid
            }
            if(this.addredata != this.khaddressdata.address){
                data.customerAddressId = ""
            }
            console.log(data)
            this.loadingbtn = true;
            editOrder(data).then(res =>{
                console.log(res,"编辑订单提交");
                if(res.status == 200){
                    this.$message.success("修改订单成功");
                    this.$router.push({path: '/ordermm/order'});
                }
                this.loadingbtn = false;
            }).catch(error =>{
                this.loadingbtn = false;
                console.log('订单管理:编辑订单提交 order/order/getorder.vue', error);
            })
        },
        clanc(){
            this.$router.go(-1);
        },
        //需求管理
        demandfun(){
            //获取客户需求列表
            let data = {
                customerId: this.customerId,
                page: this.currentPage,
                limit: this.pageSize
            };
            listCustomerDemand(data).then(res =>{
                console.log(res,"获取客户需求列表");
                if(res.status == 200){
                    this.xqtabledata = res.data.rows
                    this.demandswitch = true;
                }
            }).catch(error =>{
                console.log('订单管理:获取客户需求列表 order/order/getorder.vue', error);
            })
        },
        addressaler(){
            this.dialogVisible = true;
        },
        //弹出地图框
        maplocation(){
            this.mapDialogVisible=true
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
           this.selections = val;
        },
        handleSelectionChangexq(val){
            this.xqdatas = val;
        },
        sizeChange(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize = val;
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            // this.getListData();
        },
        sizeChange1(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize1 = val;
        },
        currentChange1(val) {//翻页方法
            this.currentPage1 = val;
            // this.getListData();
        },
    }
}
</script>
<style scoped lang="scss">
    .getorder{
        font-size: 12px;
        .cards{
            margin-top: 20px;
        }
        .tapbox{
            padding: 10px;
            border: 1px solid #e4e4e4;
            border-radius: 2px;
            display: flex;
            justify-content: space-between;
        }
        .orderbox{
            margin-top: 30px;
        }
        .orderfrom{
            padding: 10px 70px 10px 20px;
            border-top: none;
            .demo-form-inline{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                >div{
                    width: 40%;
                }
                .selewi{
                    width: 100%;
                }
                .disflex{
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
            }
        }
        .orderfrom .el-form-item__label{
            font-weight: 400;
        }
        .orderfrom .demo-form-inline .addressclas{
            width: 100%;
        }
        .froms{
            position: relative;
            display: flex;
            margin-bottom: 20px;
        }
        .aleratimc{
            align-items: center;
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
                    margin: 0 5px;
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
        // .addresslist{
        //     flex: 1;
        //     display: flex;
        //     position: relative;
        //     >div{
        //         margin: 5px;
        //     }
        //     .input_box{
        //         display: flex;
        //         flex: 1;
        //         align-items: center;
        //         margin: 0px 5px;
        //         >div{
        //             min-width: 100px;
        //         }
        //     }
        // }
        // .addresslist .addresele{
        //     min-width: 120px;
        // }
        // .addresslist .input-with-select{
        //     max-width: 200px;
        // }
        .explaintxt{
            font-size: 14px;
            width: 130px;
            min-width: 130px;
            padding-right: 10px;
            text-align: right;
            font-weight: 700;
            color: #606266;
        }
        .explaintxttwo{
            font-size: 14px;
            margin-left: 20px;
            position: absolute;
            right: -65px;
        }
        .heicenter{
            top: 50%;
            transform: translateY(-80%);
        }
        .borclas{
            border: 1px solid #dcdfe6;
        }
        .nextradio{
            display: flex;
            flex-direction: column;
            width: 130px;
            margin: 0 auto;
            .el-radio{
                padding: 10px 0px;
            }
        }
        .clinewclas{
            padding: 0px 20px;
            color: #1ABC9C;
            font-size: 14px;
        }
        .delebox{
            font-size: 16px;
            text-align: center;
        }

        .addgitcenbox{
            padding: 0px 20px;
            overflow: hidden;
            .warp_head_list{
                flex-wrap: wrap;
                float: left;
            }
            .el-icon-search{
                width: 36px;
                background: #d0cfcf;
                border-radius: 0 4px 4px 0;
                transform: translateX(5px);
            }
            .el-icon-search::before{
                content: '';
                display: block;
                width: 100%;
                height: 100%;
                background: url(../../../assets/images/search.png) no-repeat center center;
                background-size: 17px 17px;
            }
            .el-range-separator{
                color: #bfbfbf;
            }
            .list_top{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: baseline;
                >div{
                    margin: 5px;
                }
            }
            .head_nav_btn{
                width: 100%;
                text-align: center;
                margin-top: 20px;
            }
        }
        .selecusclas{
            .scachinp{
                width: 300px;
            }
            .customertxt{
                padding: 10px 0px;
                font-size: 14px;
            }
        }
        .map {
            width: 100%;
            height: 550px;
            .map_input{
                width: 350px;
                height: 30px;
            }
            .map_searchinfo{
                width: 350px;
                max-height: 450px;
                overflow: auto;
            }
        }
    }
</style>