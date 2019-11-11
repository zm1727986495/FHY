<template>
    <div class="order_box orderlvs">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <!-- 查询条件组件 -->
        <screencompon ref="screencompondata" :loading='loading' @searchfun="searchfun" :total="total">
            <div class="order_btn_list">
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_add" @click="addFun">新增订单</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_set" @click="getorder">修改订单</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_point" @click="pointFun">订单指派</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_upmeasuring" @click="upmeasuring">上传量尺单</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_placeorder" @click="upplaceorder">上传下单图</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_proedit" @click="proedit">收款</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_gifts" @click="givegift">赠送礼品</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_project" @click="pointFunproject">指派测量设计</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_newbudget" @click="newbudget">新增预算清单</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_sendbudget" @click="sendbudget">发送预算清单</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_invitationshop" @click="invitationShop">邀约到店</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_inventory" @click="Inventoryfun">商品明细</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_signcontra" @click="signcontra">签合同</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_refund" @click="refundfun">退款</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_tapesheet" @click="tapesheetfun">带单</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_addcustom" @click="addcustomfun">新增客增单</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_marketrereturn" @click="marketrefun(1)">样品回库</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.order_marketreout" @click="marketrefun(2)">样品出库</el-button>
            </div>
            <div class="order_table table_list">
                <el-table border :row-key="getRowKeys" ref="multipleTable" highlight-current-row @current-change="handleCurrentChange" :data="tableData" max-height="480"
                    :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" v-loading="loading">
                    <el-table-column type="selection" align="center" fixed="left" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column prop="orderNumber" align="center" fixed="left" label="订单编号" width="180" sortable>
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow>
                                    <div slot="content" class="tips tipFon">
                                        <!-- <p class="operaItems">带单</p> -->
                                        <p class="operaItems" v-if="btnJurisdiction.order_cancel" @click="orderCancellation(scope.row)">订单作废</p>
                                        <!-- <p class="operaItems" v-if="btnJurisdiction.order_newproblems" @click="newProblems(scope.row)">新增问题</p> -->
                                        <p class="operaItems" v-if="btnJurisdiction.order_getaddress" @click="getaddres(scope.row)">变更订单地址</p>
                                        <p class="operaItems" v-if="btnJurisdiction.order_upload" @click="uploadOrder(scope.row)">附件管理</p>
                                        <p class="operaItems" v-if="btnJurisdiction.order_tofollow" @click="ordertoFollow(scope.row)">订单跟进</p>
                                    </div>
                                    <img :src="spot" alt="" class="attributesTips">
                                </el-tooltip>
                                <el-button type="text" @click="orderdetails(scope.row)">{{scope.row.orderNumber}}</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="storeName" align="center" label="所属门店" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderStatusName" align="center" label="订单状态" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerName" align="center" label="客户名称" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="客户电话" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="purchaseContractCode" align="center" label="采购合同号" width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="settlementStatus" align="center" label="款清状态" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.settlementStatus == 1">款未清</div>
                            <div v-if="scope.row.settlementStatus == 2">收费款清</div>
                            <div v-if="scope.row.settlementStatus == 3">财务款清</div>
                            <div v-if="scope.row.settlementStatus == 4">家装款清</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractMoney" align="center" label="合同金额/元" width="130" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{scope.row.contractMoney | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paymentAmount" align="center" label="实收金额/元" width="130" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{scope.row.paymentAmount | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportedTypeName" align="center" label="报备类型" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderSourceName" align="center" label="订单来源" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="referrerName" align="center" label="推荐人姓名" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="phone" align="center" label="推荐人电话" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="companyName" align="center" label="推荐人公司" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="salesmanName" align="center" label="销售员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessName" align="center" label="业务员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorName" align="center" label="测量员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderType" align="center" label="订单类型" width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderType == 451">正单</div>
                            <div v-if="scope.row.orderType == 452">增单</div>
                            <div v-if="scope.row.orderType == 453">遗留单</div>
                            <div v-if="scope.row.orderType == 972">补单</div>
                            <div v-if="scope.row.orderType == 973">退货单</div>
                            <div v-if="scope.row.orderType == 974">上样</div>
                            <div v-if="scope.row.orderType == 975">撤样</div>
                            <div v-if="scope.row.orderType == 976">换货</div>
                            <div v-if="scope.row.orderType == 977">第三方订单</div>
                            <div v-if="scope.row.orderType == 978">售后问题</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorAssignedTime" align="center" label="指派测量时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerAssignedTime" align="center" label="指派设计时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createName" align="center" label="创建人" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="brandName" align="center" label="产品品牌" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="categoryName" align="center" label="品类" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderGoodsType" align="center" label="货品类型" width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderGoodsType == 1">成品</div>
                            <div v-if="scope.row.orderGoodsType == 2">定制</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </screencompon>
        <!-- 弹框页面 -->
        <div class="dialog_con_box">
            <el-dialog :title="Dialogtitle" custom-class="customDialogTitle" :visible.sync="centerDialogVisible" :width="width" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
                <div class="content_box">
                    <cancellation ref='cancell' v-if="Dialogtitle == '订单作废'"></cancellation>
                    <back  ref='back' v-if="Dialogtitle == '订单退货'"></back>
                    <problems ref='prodialog' v-if="Dialogtitle == '新增问题'"></problems>
                    <invitation ref='invitalog' 
                        v-if="Dialogtitle == '邀约到店' || Dialogtitle == '发送预算清单'" 
                        :timeswatch="timeswatch"
                        :orderId="orderId">
                    </invitation>
                </div>
                <div slot="footer" class="dialog-footer" v-if="Dialogtitle !== '上传下单图'">
                    <el-button type="primary" @click="sendJava">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 附件管理组件
        orderId：订单id 不传默认为空
        accessoryTypes：(传Number类型)附件类型(根据模块传对应的参数)不传默认为1  -->
        <el-dialog :visible.sync="visibleDialog" width="960px" title="附件管理" class="customDialogTitle" :before-close="accessoryclose">
            <accessory v-if="visibleDialog" :orderId="orderId" :btns="btns" 
                :btnswatch="btnswatch" :accessoryTypes="accessoryTypes">
            </accessory>
        </el-dialog>
        <!-- 地址弹框 -->
        <el-dialog title="地址管理" :visible.sync="orderdialogVisible" width="60%" class="customDialogTitle">
            <div><addresselection v-if="orderdialogVisible" :customerId="customerId" :storeId="onetabledata"  ref="addressMap"></addresselection></div>
            <div>
                <el-button type="primary" @click="addAddres">新增地址</el-button>
                <div class="addresslist" v-if="addresVisible">
                    <div class="input_box">
                        <el-input placeholder='地图定位' v-model="maps" maxlength="50" readonly @focus='maplocation'></el-input>
                    </div>
                    <div class="input_box">
                        <el-input placeholder="楼号/区" v-model.number="buildingNumber" maxlength="10"></el-input>
                    </div>
                    <div class="input_box">
                        <el-input placeholder="单元/号楼" v-model.number="unitNumber" maxlength="10"></el-input>
                    </div>
                    <div class="input_box">
                        <el-input placeholder="室" v-model.number="roomNumber" maxlength="10"></el-input>
                    </div>
                    <div slot="footer" class="addres-footer">
                        <el-button type="primary"  @click="addSave">保 存</el-button>
                        <el-button  @click="addCancel">取 消</el-button>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confimAddres">确 定</el-button>
                <el-button @click="orderdialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 客户信息地址 -->
        <el-dialog title="地图定位" class="customDialogTitle" :visible.sync="mapDialogVisible" width="60%" v-if="mapDialogVisible">
            <!-- <div class="titlecals" style="margin-left:15px">地图定位</div> -->
            <baidu-map class="map" :center="center" :zoom="15" :keyboard="true" @moving="syncCenterAndZoom" @moveend="syncCenterAndZoom" 
                @zoomend="syncCenterAndZoom" @click="getClickInfo" :scroll-wheel-zoom="true" :double-click-zoom=false>
                <bm-marker :position="center"></bm-marker>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-control>
                    <input type="text" v-model="keyword"  placeholder="请输入搜索关键字" style="width:350px;">
                    <bm-local-search :keyword="keyword" :auto-viewport="true" @infohtmlset="infohtmlsets" style="width:350px;max-height:450px;overflow:auto;" :panel="true"></bm-local-search>
                </bm-control>
            </baidu-map>
            <div slot="footer" style="margin-top: 0px;">
                <el-button @click="cancel"  class="el-button--medium" type="primary"  size="medium">取消</el-button>
                <el-button  @click="confirm" class="button-fc" type="warning"  size="medium" >确定</el-button>
            </div>
        </el-dialog>
        <!-- 订单跟进 -->
        <ordFollow ref='followlog' v-if="follVisible" :orderId="orderId"
            :tabledata="onetabledata" @close-change='closeFollow'>
        </ordFollow>

        <!-- 点击指派--操作按钮的弹出框 -->
        <pointdia @close-dialog="closeDialog" v-if="pointVisible" :tableSelect="selectData[0]" :storeId="selectData[0].storeId"></pointdia>

        <!-- 指派测量设计 -->
        <assignmeasure
            v-if="assignmeasureval"
            ref="assignmeasure"
            :dialogvisibletwo="assignmeasureval"
            :asssinstatus="asssinstatus"
            :assignmeasuredata="assignmeasuredata"
            @assignmeasurefun="assignmeasurefun"
            @getDataFun="getData">
        </assignmeasure>

        <!-- 商品明细 -->
        <el-dialog title="商品明细" class="customDialogTitle" :visible.sync="InventoryVisible" width="70%" top="1vh">
            <div v-if="InventoryVisible">
                <commodity :orderId="orderId"></commodity>
            </div>
            <div slot="footer" style="margin-top: 0px;">
                <el-button @click="cancel"  class="el-button--medium" type="primary" size="medium">取消</el-button>
            </div>
        </el-dialog>

        <marketretrieval :marketvisible="marketvisible" 
            :marketredata="marketredata"
            @marketclosefun="marketclosefun">
        </marketretrieval>
        <!-- 带单 -->
        <tapesheetcompon :tapesheetvisible="tapesheetvisible" v-if="tapesheetvisible"
            :tapesheetdata="tapesheetdata" @tapesheetclosefun="tapesheetclosefun">
        </tapesheetcompon>
    </div>
</template>
<script>
import commodity from '@/views/administrationCenter/contractmanagement/components/commodity';//商品明细接组件
import assignmeasure from "@/views/components/assignmeasure";//指派测量设计弹窗
import spot from '@/assets/images/spot.png';
import breadcrumb from "../../components/breadcrumb";
import cancellation from "./components/cancellation";
import tapesheetcompon from "../components/tapesheetcompon";
import problems from "./components/problems";
import seeannex from "../../components/seeannex";
import invitation  from './components/invitation'; // 邀约到店
import back from "./components/back"; // 订单退货
import ordFollow from "./components/ordFollow"; // 订单跟进
import pointdia from "./components/pointdia"; // 指派的弹出框
import marketretrieval from "./components/marketretrieval"; // 销售出库
import addresselection from './components/addresselection';
import { baiduMap } from 'src/api/pulicJava.js';
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
import screencompon from "@/views/order/components/screencompon"//筛选条件

import { getOrderDetailAssignedVO } from "api/order/measuremanage/measuremanage";
import { 
    listOrder, 
    listStore, 
    listCategory, 
    orderCancel, 
    listBaseDict,
    getSalesmanList,//获取本门店下所有的销售员
    getSurveyorList,//获取本门店下所有的测量员
    getDesignerList,//获取本门店下所有的设计员
    addProblem, 
    orderInvitation,
    insertCustomerAddress,
    changeOrderAddress, // 变更订单地址
} from 'api/order/order/order';
import { 
    verifyExistContract,//验证订单是否存在有效合同接口
    } from 'api/order/contract/contract';
import { log } from 'util';

export default {
    name: 'order',
    components: {
        cancellation, problems, seeannex, breadcrumb, 
        tapesheetcompon,//带单
        back, // 退货
        pointdia, // 指派
        invitation,
        ordFollow,  // 订单跟进
        addresselection,
        accessory,
        screencompon,
        assignmeasure,//指派测量设计弹框
        commodity,
        marketretrieval,
    },
    data(){
        return {
            loading: true,
            marketredata: {},//出库回库按钮
            onetabledata: {},//单选操作存数据
            btns: [],
            btnswatch: false,//上传按钮开关
            marketvisible: false,//销售出库开关
            tapesheetvisible: false,//带单
            tapesheetdata: {},
            assignmeasureval: false, //指派测量设计开关
            assignmeasuredata: {},//指派设计测量回显
            asssinstatus: 1, //指派上门状态：1、指派 2、变更
            width: "40%",
            total: 0,
            visibleDialog: false,
            orderId: "",
            accessoryTypes: 1,
            mapText:'',
            keyword: '',
            center: {lng: 116.404, lat: 39.915},//经纬度
            customerId: "",
            maps: "",
            buildingNumber: "",
            unitNumber: "",
            roomNumber: "",
            orderdialogVisible: false,
            mapDialogVisible: false,//地图弹框
            khaddressdata: {},
            mapData: {},//省市区
            spot,
            navList: [],
            Dialogtitle:'',//弹框标头
            centerDialogVisible: false,//弹框show
            timeswatch: true,//邀约到店展示内容
            tableData:[],
            maxHeight: null,
            tableSelectList: [],
            currentRow: [],
            switchSalesperson: "",
            follVisible: false,  // 订单跟进
            pointVisible: false,// 指派弹出框的显示与否
            addresVisible: false,
            InventoryVisible: false,//商品明细
            rowData: null,
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
        }
    },
    computed: {
        selectData(){
            if(this.tableSelectList.length){
                return this.tableSelectList
            }else{
                return this.currentRow
            }
        }
    },
    watch: {
        Dialogtitle(val){
            if(val  == '邀约到店' || val  == '发送预算清单'){
                this.width = "60%";
            }else {
                this.width = "50%";
            }
        },
        // 监听订单渠道是否为电商
        orderChannel(val){
            if(val == ""){
                return false;
            }
            // 判断订单渠道是不是电商
            if(val === this.orderqids){
                this.isretailers = true;
                let data={
                    dataType: "ORDER_SOURCE",
                    belongId: 95
                };
                listBaseDict(data).then(res =>{
                    if(res.status == 200){
                        this.orderl = res.data;
                    }
                }).catch(error =>{
                    console.log('订单管理:基础字典查询 order/justOrder/addJustOrder.vue', error);
                })
            }else{
                this.isretailers = false;
                let data={
                    dataType: "ORDER_SOURCE",
                    belongId: 95
                };
                listBaseDict(data).then(res =>{
                    if(res.status == 200){
                        this.orderl = res.data;
                    }
                }).catch(error =>{
                    console.log('订单管理:基础字典查询 order/justOrder/addJustOrder.vue', error);
                })
            }
        },
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
            return (val*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
    },
    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        // let data = {
        //     page: this.$refs.screencompondata.currentPage,
        //     limit: this.$refs.screencompondata.pageSize,
        //     orderType: 451,
        // };
        // this.orderdatafun(data);
        this.$refs.screencompondata.searchfun()
    },
    // mounted() {
    //     // 头部面包屑
    //     this.navList = this.$route.meta;
    //     // let data = {
    //     //     page: this.$refs.screencompondata.currentPage,
    //     //     limit: this.$refs.screencompondata.pageSize,
    //     //     orderType: 451,
    //     // };
    //     // this.orderdatafun(data);
    //     this.$refs.screencompondata.searchfun()
    // },
    // created() {

    // },
    methods: {
        orderdetails(val){
            this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId, orderNumber: val.orderNumber}})
        },
        getRowKeys(row) {
            return row.orderId;
        },
        // 指派弹出框的关闭--子组件触发
        closeDialog() {
            this.$refs.screencompondata.searchfun()
            this.pointVisible = false;
        },
        // 加载表格
        orderdatafun(data){
            this.loading = true;
            listOrder(data).then(res =>{
                if(res.status == 200){
                    // this.total = res.data.total;
                    this.tableData = res.data;
                    this.loading = false;
                }
            }).catch(error =>{
                this.loading = false;
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        sendJava(){ // 弹框确定按钮
            if(this.Dialogtitle == '订单作废') {
                if(!this.$refs.cancell.ruleForm.whether) {
                    this.$message({
                        message: '请确定勾选了是否确定作废按钮',
                        type: 'warning'
                    });
                    return;
                }else {
                    
                    // if(this.rowData.paymentAmount) { // 有收款信息--走退货流程
                    //     // 关闭当前订单作废的弹出框
                    //     // this.centerDialogVisible = false
                    //     // this.Dialogtitle = '订单退货'
                    //     // 开启订单退货的弹出框
                    //     // this.centerDialogVisible = true
                    //     this.$message({
                    //         message: '当前订单有收款信息,无法作废',
                    //         type: 'warning'
                    //     });
                    //     this.centerDialogVisible = false;
                    //     this.Dialogtitle = ''
                    // }else  { // 无收款信息--直接作废
                        // 调用订单作废的接口
                        this.orCancel();
                    // }
                }
            }else if(this.Dialogtitle == '订单退货'){
            
                if(!this.$refs.back.ruleForm.whether || !this.$refs.back.ruleForm.desc) {
                    this.$message({
                        message: '请确定勾选了按钮和填写了退单原因',
                        type: 'warning'
                    });
                }else {
                    
                }
                this.Dialogtitle = ''
            }else if(this.Dialogtitle == '新增问题'){
                if(!this.newPro()) {
                    return;
                }
                this.newPro();
                this.Dialogtitle = ''
            }else if(this.Dialogtitle == '邀约到店' || this.Dialogtitle == '发送预算清单'){
                this.inviShop();
            }  
            this.$refs.multipleTable.clearSelection();
            this.$refs.screencompondata.searchfun()
        },
        // 样品回库 出库
        marketrefun(val){
            if(this.warnMessage()){
                // this.selectData[0]
                this.marketredata = {
                    orderId: this.selectData[0].orderId,
                    // orderId: 246060,
                    processMode: val,
                    storeId: this.selectData[0].storeId,
                }
                this.marketvisible = true;
            }
        },
        marketclosefun(){
            this.marketvisible = false;
        },
        // 带单关闭
        tapesheetclosefun(val){
            if(val){
                this.$refs.screencompondata.searchfun()
            }
            this.tapesheetvisible = false;
        },
        // 订单作废功能
        orCancel() {
            let data = {
                orderType: 0,  //订单类型
                orderId: this.orderId,  //  订单ID
                reason:  this.$refs.cancell.ruleForm.desc   //  作废原因
            };
            orderCancel(data).then(res =>{
                if(res.status == 200){
                    // 重新加载表格
                    this.$message.success("操作成功");
                    this.centerDialogVisible = false;
                    this.Dialogtitle = '';
                    this.$refs.screencompondata.searchfun();
                    this.$refs.multipleTable.clearSelection();
                }else {
                    this.$message.warning(res.message);
                    
                    this.centerDialogVisible = false;
                    this.Dialogtitle = '';
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 订单作废 order/order/order.vue', error);
            })
        },
        // 新增问题 -- 确定操作按钮
        newPro(){
            if(!this.$refs.prodialog.questiontype) {
                this.$message.warning("请选择问题类型");
                return false;
            }
            let arr = this.$refs.prodialog.imgArr1.map(item => {
                return {
                    fileUrl: item.url,
                    sourceName: item.name,
                };
            });

            let data = {
                orderId: this.orderId,  // 订单ID
                problemType: this.$refs.prodialog.questiontype, // 问题类型
                problemDesc: this.$refs.prodialog.desc, // 问题描述
                newProblemsFile: arr,      //如果上传的是图片就用这个集合
            };
            addProblem(data).then(res =>{
                if(res.status == 200){
                    this.$message.success("新增问题成功");
                    this.Dialogtitle = ''
                    this.centerDialogVisible = false;
                    this.$refs.multipleTable.clearSelection();
                    this.$refs.screencompondata.searchfun()
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        // 邀约到店
        inviShop() {
            if(this.timeswatch){
                if(!this.$refs.invitalog.fromdatas.handoverDate) {
                    this.$message.warning("请填写邀约到店时间");
                    return false;
                }else if(!this.$refs.invitalog.fromdatas.sendWay) {
                    this.$message.warning("请填写邀请方式");
                    return false;
                }
            }
            let budgetId = '';
            budgetId = this.$refs.invitalog.fromdatas.budgetId; // 预算清单id
            // 附件
            let accessoryId = this.$refs.invitalog.elsectFile.map(item => {
                return item.accessoryId
            })
            let data = {
                orderId: this.orderId,  // 订单ID
                invitationTime:  this.$refs.invitalog.fromdatas.handoverDate,
                sendWay: this.$refs.invitalog.fromdatas.sendWay,
                // invitationContent: this.$refs.invitalog.fromdatas.remarks,
                budgetId,  // 预算清单id
                isShowPrice: this.$refs.invitalog.fromdatas.isShowPrice, // 是否显示价格信息
                accessoryId: accessoryId[0], // 附件
                // isBudget:  this.$refs.invitalog.isBudget,
                // isDesign:  this.$refs.invitalog.isDesign,
            };
            orderInvitation(data).then(res =>{
                if(res.status == 200){
                    this.$message.success('成功'+ this.Dialogtitle +'');
                    this.centerDialogVisible = false;
                    this.Dialogtitle = '';
                    this.$refs.screencompondata.searchfun()
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 邀约到店 order/order/order.vue', error);
            })
        },
        // 上传附件关闭
        accessoryclose(){
            this.$refs.screencompondata.searchfun()
            this.visibleDialog = false;
        },
        cancel(){ // 弹框取消
            this.mapDialogVisible=false
            this.centerDialogVisible = false;
            this.InventoryVisible = false;
            this.Dialogtitle = '';
        },
        searchfun(val){    //搜索
            this.orderdatafun(val);
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
        },
        handleCurrentChange(val) {
            let arr = [];
            arr.push(val);
            this.currentRow = arr;
        },
        addFun(){   // 新建订单
            this.$router.push({path: '/ordermm/addJustOrder'});
        },
        getorder(){
            if(this.warnMessage()){
                let val = this.selectData
                this.$router.push({path: '/ordermm/getorder', query: {'orderId': val[0].orderId, 'customerId': val[0].customerId}});
            }
        },
        downFun(){  // 下载

        },
        importhFun(){   // 导入

        },
        pointFun(){  // 指派
            if(this.warnMessage()){
                this.pointVisible = true;
            }
        },
        newbudget(){
            if(this.warnMessage()){
                let val = this.selectData[0]
                let brandId = val.brandId;
                let commodityCategoryId = val.commodityCategoryId; 
                let orderGoodsType = val.orderGoodsType;
                let orderId = val.orderId;
                let storeId = val.storeId;
                this.$router.push({ path:'/ordermm/addTranslate',query: {orderId: orderId, orderGoodsType: orderGoodsType, brandId: brandId, commodityCategoryId: commodityCategoryId,storeId:storeId }});                
            }
        },
        orderCancellation(val){ // 订单作废
            this.orderId = val.orderId;
            this.rowData = val;
            this.Dialogtitle = '订单作废';
            this.centerDialogVisible = true;
        },
        // 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.selectData.length > 1){
                this.$message.warning("只能选择一个订单");
                return;
            } else if (this.selectData.length < 1){
                this.$message.warning("请选择订单");
                return;
            }
            let isAbandons = this.selectData.some(item =>{
                return item.isAbandon == 1
            })
            if (isAbandons) {
                this.$message.warning("包含作废订单，不可操作！");
                return;
            }
            // datas.isAbandon != 1
            return true;
        },
        getData(){
            this.$refs.screencompondata.searchfun()
        },
        // 关闭指派测量设计
        assignmeasurefun() {
            this.assignmeasureval = false;
        },
        //指派测量设计
        pointFunproject(){
            if(this.warnMessage()){
                let val = this.selectData[0]
                let obj={
                    assignedMeasureId: val.assignedMeasureId,
                    orderId: val.orderId,
                }
                getOrderDetailAssignedVO(obj).then(res => {
                if (res.status === 200) {
                    this.assignmeasuredata = res.data;//测量设计回显
                    this.$refs.assignmeasure.staff(this.assignmeasuredata.storeId);//调用获取人员接口
                    this.asssinstatus = 1;
                }
                }).catch(error => {
                    console.log("指派测量:指派测量设计获取订单信息 order/measuremanage/index.vue");
                });
                this.assignmeasureval = true;
            }
        },
        newProblems(val){ // 新增问题
            this.orderId = val.orderId
            this.centerDialogVisible = true
            this.Dialogtitle = '新增问题'
        },
        uploadOrder(val){ // 附件管理
            this.visibleDialog = true
            this.orderId = val.orderId
            this.accessoryTypes = 1
            this.btns = [];
            this.btnswatch = false;
        },
        upmeasuring(){ // 上传量尺单
            if(this.warnMessage()){
                this.visibleDialog = true
                this.orderId = this.selectData[0].orderId
                this.accessoryTypes = 11
                this.btns = [11];
                this.btnswatch = true;
            }
        },
        upplaceorder(){ // 上传下单图
            if(this.warnMessage()){
                this.visibleDialog = true
                this.orderId = this.selectData[0].orderId
                this.accessoryTypes = 6
                this.btns = [6];
                this.btnswatch = true;
            }
        },
        givegift(){
            if(this.warnMessage()){
                this.orderId = this.selectData[0].orderId
                this.$router.push({path: "/gift/givegift", query: {orderId: this.orderId}})
            }
        },
        // 收款
        proedit(){
            // if(this.warnMessage()){
            //     let val = this.tableSelectList[0]
            //     this.$store.dispatch('SET_ORDER_SELECT_LIST', val);
            //     this.$router.push({path: "/collection/proedit", query: {source: "order"}})
            // }
            if (this.selectData.length < 1){
                this.$message.warning("请选择订单");
            }else{
                let customerId = this.selectData[0].customerId
                let customerIds = this.selectData.some(itm =>{
                    return customerId != itm.customerId
                })
                let isAbandons = this.selectData.some(item =>{
                    return item.isAbandon == 1
                })
                if (isAbandons) {
                    this.$message.warning("包含作废订单，不可操作！");
                    return;
                }else if(customerIds){
                    this.$message.warning("客户必须一致");
                }else{
                    let arr = []
                    this.selectData.forEach(itm =>{
                        arr.push(itm.orderId)
                    })
                    this.$store.dispatch('SET_ORDER_SELECT_LIST', arr);
                    this.$router.push({path: "/collection/proedit", query: {source: "order"}})
                }
            }
        },
        // 商品明细
        Inventoryfun(){
            if(this.warnMessage()){
                let val = this.selectData[0]
                this.orderId = val.orderId
                this.InventoryVisible = true;
            }
        },
        // 发送预算清单
        sendbudget(){
            if(this.warnMessage()){
                let val = this.selectData[0]
                this.orderId = val.orderId;
                this.timeswatch = false;
                this.centerDialogVisible = true
                this.Dialogtitle = '发送预算清单'
            }
        },
        // 邀约到店
        invitationShop() {
            if(this.warnMessage()){
                let val = this.selectData[0]
                this.orderId = val.orderId;
                this.timeswatch = true;
                this.centerDialogVisible = true
                this.Dialogtitle = '邀约到店'
            }
        },
        // 订单跟进
        ordertoFollow(val) {
            this.onetabledata = val;
            this.orderId = val.orderId;
            
            this.Dialogtitle = '订单跟进';
            this.follVisible = true;
        },
        // 关闭订单跟进
        closeFollow() {
            this.follVisible = false;

            this.$refs.multipleTable.clearSelection();
            this.$refs.screencompondata.searchfun()

        },
        // 变更订单地址
        getaddres(val){
            this.onetabledata = val;
            this.customerId = val.customerId;
            this.orderdialogVisible = true;
        },
        // 退款
        refundfun(){
            if(this.warnMessage()){
                let datas = this.selectData[0]
                this.$router.push({
                    path: "/refundpermit/addapplication", 
                    query: {
                        pageStatus: 4, 
                        orderId: datas.orderId,
                        orderNumber: datas.orderNumber,
                        storeCustomerId: datas.storeCustomerId,
                    }
                })
            }
        },
        tapesheetfun(){
            if(this.warnMessage()){
                let datas = this.selectData[0]
                if(datas.isAbandon != 1){
                    this.tapesheetdata = {
                        customerId: datas.customerId,
                        orderId: datas.orderId,
                        orderNumber: datas.orderNumber,
                    }
                    this.tapesheetvisible = true;
                }else{
                    this.$message.warning("该订单已作废不可操作！");
                }
            }
        },
        // 新增客增单
        addcustomfun(){
            if(this.warnMessage()){
                let datas = this.selectData[0]
                let brandId = datas.brandId;
                let commodityCategoryId = datas.commodityCategoryId; 
                let orderGoodsType =datas.orderGoodsType;
                let orderId = datas.orderId;
                let customerId = datas.customerId;
                this.$router.push({
                    path: '/ordermm/operateorder', 
                    query: {
                        orderId: orderId, 
                        customerId: customerId, 
                        orderGoodsType: orderGoodsType, 
                        brandId: brandId, 
                        commodityCategoryId: commodityCategoryId, 
                        type: 1
                    }
                });
                // if(datas.orderStatusCode == 159 || datas.orderStatusCode > 159){
                // }else{
                //     this.$message.warning("下单完成的订单才可以新增客增单");
                // }
            }
        },
        //签合同
        signcontra(){
            if(this.warnMessage()){
                let val = this.selectData[0]
                let brandId = val.brandId;
                let commodityCategoryId = val.commodityCategoryId;
                let orderGoodsType =val.orderGoodsType;
                let orderId = val.orderId;
                // this.$router.push({path: "/ordermm/signcontract",query:{orderId: orderId, orderGoodsType: orderGoodsType, brandId: brandId, commodityCategoryId: commodityCategoryId }})
                // return
                verifyExistContract({orderId: orderId}).then(res =>{
                    if(res.status == 200){
                        this.$router.push({
                            path: "/ordermm/signcontract",
                            query:{
                                orderId: orderId, 
                                orderGoodsType: orderGoodsType, 
                                brandId: brandId, 
                                commodityCategoryId: commodityCategoryId, 
                                signGoodsType: orderGoodsType, 
                            }
                        })
                    }else{
                        this.$message.warning(res.message);
                    }
                }).catch(error =>{
                    console.log('订单管理：验证合同是否可签订 order/order/order.vue', error);
                })
            }
        },
        // 确定 -- 变更订单地址
        confimAddres() {  
            let data = {
                orderId: this.onetabledata.orderId,   // 订单Id
                customerAddressId: this.$refs.addressMap.selections.length != 0 ? this.$refs.addressMap.selections[0].customerAddressId : '', //  变更后的地址Id 
            };
            changeOrderAddress(data).then(res =>{
                if(res.status === 200){
                    this.$refs.screencompondata.searchfun();
                    this.$refs.multipleTable.clearSelection();
                    this.$message.success("变更订单地址成功");
                    this.orderdialogVisible = false;
                }
            }).catch(error =>{
                console.log('客户地址_获取列表 views/components/addresselection.vue', error);          
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },

        //弹出地图框
        maplocation(){
            this.mapDialogVisible=true
        },
        syncCenterAndZoom (e) {
            // this.center={};
            // this.$nextTick(()=>{
            //     const {lng, lat} = e.target.getCenter()
            //     // this.center.lng = lng
            //     // this.center.lat = lat
            //     this.zoom = e.target.getZoom()
            // })
        },
        //地图点击事件
        getClickInfo (e) {
            this.center.lng = e.point.lng
            this.center.lat = e.point.lat
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
            baiduMap(this.center.lng, this.center.lat).then(res=>{
                this.mapData = res;
                
                // str+=this.mapData.formatted_address+this.mapData.sematic_description+"#"+this.buildingNumber+"#"+this.unitNumber+"#"+this.roomNumber;
                this.khaddressdata = {
                    provinceId: parseInt(this.mapData.addressComponent.adcode.substring(0,2)+"0000"),//省
                    cityId: parseInt(this.mapData.addressComponent.adcode.substring(0,4)+"00"),//市
                    areaId: parseInt(this.mapData.addressComponent.adcode),//区
                    longitude: this.center.lng+"",//经度
                    latitude: this.center.lat+"",//纬度   110102 110100  110000
                    // address: str,//地址
                }
                this.maps = this.mapData.formatted_address + this.mapData.sematic_description;
                this.center = res.location;
            }).catch(error =>{
                console.log(error)
            })
            this.mapDialogVisible=false
        },
        addAddres() {
            this.addresVisible = true;
        },
        // 保存新增地址
        addSave() {
            let str = "";
            str += this.mapData.formatted_address + this.mapData.sematic_description + "#" + this.buildingNumber + "#" + this.unitNumber +"#"+ this.roomNumber;
            this.khaddressdata.address = str;// 地址
            let data = {
                customerId: this.customerId,				//客户id
                storeCustomerId: this.onetabledata.storeCustomerId,//门店客户id
                storeId:  this.onetabledata.storeId, 
                provinceId:	this.khaddressdata.provinceId,//省
                cityId:	this.khaddressdata.cityId, //市,
                areaId:	this.khaddressdata.areaId,	//区/县,
                address:	this.khaddressdata.address,	//地址
                longitude:	this.khaddressdata.longitude, //经度
                latitude:	this.khaddressdata.latitude	//纬度
            }
            // 保存地址
            insertCustomerAddress(data).then(res =>{
                if(res.status == 200){
                    this.$message({
                        message: '地址新增成功',
                        type: 'success'
                    });
                    this.$refs.addressMap.getListData();
                }
            }).catch(error =>{
                console.log('订单管理：保存地址 order/order/order.vue', error);
            })
            this.addresVisible = false;
            this.maps = '';
            this.buildingNumber = ''; 
            this.unitNumber  = '';
            this.roomNumber = '';
        },
        addCancel() {

        },
        // 弹出框的提交 -- 子组件触发
        closeChange() {
            this.currentPage = 1;
            let data = {
                page: (this.currentPage - 1) * 20,
                limit: this.pageSize
            };
            this.orderdatafun(data); // 获取表格数据
            this.follVisible = false; // 关闭弹出框
            this.dateDate= [];
            this.$refs.followlog.fromdatas = {};
        }
    }
}
</script>
<style scoped lang="scss">
.order_box{
    .dialog_con_box .content_box{
        display: flex;
        flex-wrap: wrap;
    }
    .dialog_con_box .left_form{
        width: 60%;
    
    }
    .dialog_con_box .right_logo{
        width: 40%;
    }
    .dialog_con_box .Dialog_input_cell .Dialog_input_cell_title{
        width: 100px;
        text-align: right;
        padding-right: 10px;
    }
    .el-range-separator{
        color: #bfbfbf;
    }
    .order_btn_list{
        display: flex;
        flex-wrap: wrap;
        >button{
            margin: 0px 10px 10px 0px;
        }
        .blue{
            background: #96bdde;
            color: #fff;
            width: 100px;
            padding-left: 0;
            padding-right: 0;
        }
    }
    .order_table{
        width: 100%;
        .cell, .el-tooltip{
            text-align: center;
        }
    }
    .text{
        float: left;
        margin-left: 20px;
    }
    .discount, .emergency{
        color: #fff;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        border-radius: 50%;
        box-sizing: border-box;
        white-space: nowrap;
        margin: 0;
        padding: 0;
        background: #b43e4c;
        float: right;
        margin: 0 1px;
    }
    .map{
        width: 100%;
        height: 300px;
        .anchorBL{
            display: none;
        }
    }
    .addresslist{
        flex: 1;
        display: flex;
        position: relative;
        flex-wrap: wrap;
        >div{
            margin: 5px;
        }
        .input_box{
            display: flex;
            flex: 1;
            align-items: center;
            margin: 0px 5px;
            >div{
                min-width: 100px;
            }
        }
    }
}
</style>
