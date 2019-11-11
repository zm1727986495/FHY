<template>
    <div class="customerorder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <!-- 客增单管理 -->
        <!-- 查询条件组件 -->
        <screencompon ref="screencompondata" 
            @searchfun="searchfun" :total="total" :loading='loading' :orderType="orderType">
            <!-- 插槽 -->
            <div>
                <div class="order_btn_list">
                    <div v-for="(itm, idx) in btnlistdata" :key="idx">
                         <!-- v-if="btnJurisdiction[itm.jurisdiction]" -->
                        <el-button size="small" v-if="btnJurisdiction[itm.jurisdiction]"
                            class="button-96" @click="benlistfun(itm.name)">{{itm.name}}
                        </el-button>
                    </div>
                </div>
                <div class="order_table orderlvs">
                    <el-table border v-loading="loading"
                        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :max-height="maxHeight"
                        :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" align="center" width="55" ></el-table-column>
                        <el-table-column prop="orderNumber" align="center" label="订单编号" width="150" sortable>
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip placement="right" visible-arrow>
                                        <div slot="content" class="tips tipFon">
                                            <p class="operaItems" v-if="btnJurisdiction.customerorder_cancel" @click="orderCancellation(scope.row)">客增单作废</p>
                                            <p class="operaItems" v-if="btnJurisdiction.customerorder_newproblems" @click="newProblems(scope.row)">新增问题</p>
                                            <!-- <p class="operaItems" @click="getaddres(scope.row)">变更订单地址</p> -->
                                            <p class="operaItems" v-if="btnJurisdiction.customerorder_upload" @click="uploadOrder(scope.row)">附件管理</p>
                                            <p class="operaItems" v-if="btnJurisdiction.customerorder_tofollow" @click="ordertoFollow(scope.row)">订单跟进</p>
                                        </div>
                                        <img :src="spot" alt="" class="attributesTips">
                                    </el-tooltip>
                                    <el-button type="text" @click="suborderdetails(scope.row)">{{scope.row.orderNumber}}</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderStatusName" align="center" label="订单状态" width="130"></el-table-column>
                        <el-table-column prop="orderSubsidiaryNumber" align="center" label="主单号" width="150" sortable>
                            <template slot-scope="scope">
                                <el-button type="text" @click="orderdetails(scope.row)">{{scope.row.orderSubsidiaryNumber}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderType" align="center" label="单据类型" width="120">
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
                        <el-table-column prop="customerName" align="center" label="客户名称" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="客户电话" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="备用电话" width="120" show-overflow-tooltip></el-table-column>
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
                    <el-table-column prop="brandName" align="center" label="产品品牌" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="categoryName" align="center" label="品类" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderGoodsType" align="center" label="订单货品类型" width="130" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderGoodsType == 1">成品</div>
                            <div v-if="scope.row.orderGoodsType == 2">定制</div>
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
                    <el-table-column prop="salesmanName" align="center" label="销售员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessName" align="center" label="业务员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorName" align="center" label="测量员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderSourceName" align="center" label="订单来源" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
        </screencompon>
        <div>
            <!-- 弹框页面 -->
            <ordercomponent v-if="newcenterDialogVisible"
                :centerDialogVisible="newcenterDialogVisible" 
                @orderclosefun="orderclosefun">
            </ordercomponent>

            <el-dialog :title="Dialogtitle" class="customDialogTitle" 
                :visible.sync="centerDialogVisible" width="60%" :close-on-press-escape="false" 
                :close-on-click-modal="false" :show-close="false">
                <div class="content_box">
                    <cancellation ref='cancell' v-if="Dialogtitle == '客增单作废'"></cancellation>
                    <problems ref='prodialog' v-if="Dialogtitle == '新增问题'"></problems>
                    <invitation ref='invitalog' v-if="Dialogtitle == '邀约到店' || Dialogtitle == '发送预算清单'" 
                        :timeswatch="timeswatch" :orderId="orderId">
                    </invitation>
                </div>
                <div slot="footer" class="dialog-footer" v-if="Dialogtitle !== '上传下单图'">
                    <el-button type="primary" @click="sendJava">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </el-dialog>

            <!-- 附件管理组件
            orderId：订单id 不传默认为空
            accessoryTypes：(传Number类型)附件类型(根据模块传对应的参数)不传默认为1  -->
            <el-dialog :visible.sync="visibleDialog" width="960px" title="附件管理" class="customDialogTitle">
                <accessory v-if="visibleDialog" :orderId="orderId" :btns="btns" 
                    :btnswatch="btnswatch" :accessoryTypes="accessoryTypes"></accessory>
            </el-dialog>

            <!-- 订单跟进组件 -->
            <ordFollow ref='followlog' v-if="follVisible" :orderId="orderId"
                :tabledata="tableSelectList" @close-change='closeFollow'>
            </ordFollow>

            <!-- 商品明细 -->
            <el-dialog title="商品明细" class="customDialogTitle" :visible.sync="InventoryVisible" width="70%">
                <div v-if="InventoryVisible">
                    <commodity :orderId="orderId"></commodity>
                </div>
                <div slot="footer" style="margin-top: 0px;">
                    <el-button @click="cancel"  class="el-button--medium" type="primary" size="medium">取消</el-button>
                </div>
            </el-dialog>

            <!-- 指派测量设计 -->
            <assignmeasure v-if="assignmeasureval" ref="assignmeasure" :dialogvisibletwo="assignmeasureval"
                :asssinstatus="asssinstatus" :assignmeasuredata="assignmeasuredata" 
                @assignmeasurefun="assignmeasurefun" @getDataFun="getData">
            </assignmeasure>

            <!-- 点击指派--操作按钮的弹出框 -->
            <pointdia @close-dialog="closeDialog" v-if="pointVisible" :tableSelect="tableSelectList[0]"></pointdia>
        </div>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import commodity from '@/views/administrationCenter/contractmanagement/components/commodity';//商品明细接组件
import assignmeasure from "@/views/components/assignmeasure";//指派测量设计弹窗
import cancellation from "../order/components/cancellation";//作废
import problems from "../order/components/problems";//新增问题
import invitation from "../order/components/invitation";//新增问题
import ordercomponent from "../../components/ordercomponent";
import breadcrumb from "@/views/components/breadcrumb";
import screencompon from "@/views/order/components/screencompon"//筛选条件
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
import ordFollow from "../order/components/ordFollow"; // 订单跟进组件
import pointdia from "../order/components/pointdia"; // 指派的弹出框
import { 
    listOrder, 
    addInvalidOrderCancel,
    orderCancel, 
    addProblem, 
    orderInvitation,
    } from 'api/order/order/order';
import { getUUID } from "api/pulicJava";
import { getOrderDetailAssignedVO } from "api/order/measuremanage/measuremanage";
export default {
    components: {
        breadcrumb, screencompon, ordercomponent, cancellation, problems, invitation,
        accessory, ordFollow, commodity, assignmeasure, pointdia, 
    },
    data() {
        return {
            assignmeasureval: false, //指派测量设计开关
            pointVisible: false, //订单指派
            asssinstatus: 1, //指派上门状态：1、指派 2、变更
            assignmeasuredata: {},//指派设计测量回显
            btns: [],
            btnswatch: false,//上传按钮开关
            InventoryVisible: false,//商品明细
            spot,
            follVisible: false,
            orderId: "",
            orderdetildata: {},
            accessoryTypes: "",
            visibleDialog: false,//附件管理组件
            Dialogtitle:'',//弹框标头
            centerDialogVisible: false,
            newcenterDialogVisible: false,
            total: 0,
            orderType: 452,
            navList: [],
            btnlistdata: [
                {name: "新增客增单", jurisdiction: "customerorder_addcustomer"},
                {name: "修改客增单", jurisdiction: "customerorder_setcustomer"},
                {name: "订单指派", jurisdiction: "customerorder_point"},
                // {name: "上传量尺单", jurisdiction: "customerorder_upmeasuring"},
                {name: "收款", jurisdiction: "customerorder_proedit"},
                {name: "指派测量设计", jurisdiction: "customerorder_project"},
                {name: "发送预算清单", jurisdiction: "customerorder_sendbudget"},
                {name: "新增预算清单", jurisdiction: "customerorder_newbudget"},
                {name: "邀约到店", jurisdiction: "customerorder_invitationshop"},
                {name: "商品明细", jurisdiction: "customerorder_inventory"},
                {name: "签合同", jurisdiction: "customerorder_signcontra"},
                {name: "退款", jurisdiction: "customerorder_refund"},
                {name: "批量下载", jurisdiction: "customerorder_batchload"},
                {name: "变更订单地址", jurisdiction: "customerorder_getaddress"},
                {name: "导入", jurisdiction: "customerorder_export"},
            ],//按钮列表
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
            tableData: [],//表格数据
            maxHeight: 500,
            tableSelectList: [],//选中数据
            loading: true,
        }
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

        this.$refs.screencompondata.searchfun()
        // this.creafundata();
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     // 头部面包屑
    //     this.navList = this.$route.meta;

    //     this.$refs.screencompondata.searchfun()
    //     // this.creafundata();
    // },
    // created() {
        

    // },
    methods: {
        // 订单列表按钮
        benlistfun(val){
            this.Dialogtitle = val;
            let orderdatas = this.tableSelectList[0]
            if(val === "新增客增单"){
                this.newcenterDialogVisible = true;
            }else if(val === "修改客增单"){
                if(this.newbudget()){
                    this.$router.push({path: "/ordermm/operateorder",query: {orderId: orderdatas.orderId,  customerId: orderdatas.customerId}})
                }
            }else if(val === "邀约到店" || val == '发送预算清单'){
                if(this.newbudget()){
                    this.orderId = this.tableSelectList[0].orderId;
                    this.centerDialogVisible = true;
                    if(val == "邀约到店"){
                        this.timeswatch = true;
                    }else{
                        this.timeswatch = false;
                    }
                }
            }else if(val == "新增预算清单"){
                if(this.newbudget()){
                    let brandId = this.tableSelectList[0].brandId;
                    let commodityCategoryId = this.tableSelectList[0].commodityCategoryId; 
                    let orderGoodsType =this.tableSelectList[0].orderGoodsType;
                    let orderId = this.tableSelectList[0].orderId;
                    this.$router.push({ path:'/ordermm/addTranslate',query: {orderId: orderId, orderGoodsType: orderGoodsType, brandId: brandId, commodityCategoryId: commodityCategoryId }});
                }
            }else if(val == "签合同"){
                if(this.newbudget()){
                    let brandId = this.tableSelectList[0].brandId;
                    let commodityCategoryId = this.tableSelectList[0].commodityCategoryId; 
                    let orderGoodsType =this.tableSelectList[0].orderGoodsType;
                    let orderId = this.tableSelectList[0].orderId;
                    this.$router.push({path: "/ordermm/signcontract",query:{orderId: orderId, orderGoodsType: orderGoodsType, brandId: brandId, commodityCategoryId: commodityCategoryId, signGoodsType: orderGoodsType }})
                }
            }else if(val == "上传量尺单"){
                if(this.newbudget()){
                    this.visibleDialog=true
                    this.orderId = this.tableSelectList[0].orderId
                    this.accessoryTypes = 11
                    this.btns = [11];
                    this.btnswatch = true;
                }
            }else if(val == "收款"){
                if (this.tableSelectList.length < 1){
                    this.$message.warning("请选择订单");
                }else{
                    let customerId = this.tableSelectList[0].customerId
                    let customerIds = this.tableSelectList.some(itm =>{
                        return customerId != itm.customerId
                    })
                    if(customerIds){
                        this.$message.warning("客户必须一致");
                    }else{
                        let arr = []
                        this.tableSelectList.forEach(itm =>{
                            arr.push(itm.orderId)
                        })
                        console.log(arr);
                        this.$store.dispatch('SET_ORDER_SELECT_LIST', arr);
                        this.$router.push({path: "/collection/proedit", query: {source: "order"}})
                    }
                }
            }else if(val == "商品明细"){
                if(this.newbudget()){
                    this.InventoryVisible = true;
                    this.orderId = this.tableSelectList[0].orderId;  // 订单ID
                }
            }else if(val == "指派测量设计"){
                if(this.newbudget()){
                    this.pointFunproject(this.tableSelectList[0])
                }
            }else if(val == "订单指派"){
                if(this.newbudget()){
                    this.pointVisible = true;
                }
            }else if(val == "退款"){
                if(this.newbudget()){
                    let datas = this.tableSelectList[0]
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
            }
        },
        // 跳转主单详情
        orderdetails(val){
            this.$router.push({path: "/ordermm/details", query:{orderId: val.orderSubsidiaryId}})
        },
        //跳转客增单详情
        suborderdetails(val){
            this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId}})
        },
        // 订单跟进
        ordertoFollow(val) {
            this.orderId = val.orderId
            this.Dialogtitle = '订单跟进';
            this.follVisible = true;
        },
        uploadOrder(val){ // 附件管理
            this.orderdetildata = val
            this.visibleDialog = true
            this.orderId = val.orderId
            this.accessoryTypes = 1
            this.btns = [];
            this.btnswatch = false;
        },
        newProblems(val){ // 新增问题
            this.orderdetildata = val
            this.orderId = val.orderId
            this.centerDialogVisible = true
            this.Dialogtitle = '新增问题'
        },
        orderCancellation(val){ // 客增单作废
            this.orderdetildata = val
            this.orderId = val.orderId;
            this.centerDialogVisible = true
            this.Dialogtitle = '客增单作废';
        },
        // 订单作废功能
        orCancel() {
            let data = {
                orderType: 452,  //订单类型
                orderId: this.orderId,  //  订单ID
                reason:  this.$refs.cancell.ruleForm.desc   //  作废原因
            };
            orderCancel(data).then(res =>{
                if(res.status == 200){
                    this.$message.success("订单作废");
                    // 重新加载表格
                    this.centerDialogVisible = false;
                    this.Dialogtitle = '';
                    this.$refs.screencompondata.searchfun()
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 订单作废 order/order/order.vue', error);
            })
        },
        // 指派弹出框的关闭--子组件触发
        closeDialog() {
            this.$refs.multipleTable.clearSelection();
            this.pointVisible = false;
        },
        getData(){
            this.$refs.screencompondata.searchfun()
        },
        // 关闭指派测量设计
        assignmeasurefun() {
            this.assignmeasureval = false;
        },
        //指派测量设计
        pointFunproject(val){
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
        },
        // 关闭订单跟进
        closeFollow() {
            this.follVisible = false;
            this.$refs.multipleTable.clearSelection();
        },
        cancel(){ // 弹框取消
            this.centerDialogVisible = false;
            this.InventoryVisible = false;
        },
        sendJava(){ // 弹框确定按钮
            if(this.Dialogtitle == '客增单作废') {
                if(!this.$refs.cancell.ruleForm.whether) {
                    this.$message({
                        message: '请确定勾选了是否确定作废按钮',
                        type: 'warning'
                    });
                }else {
                    console.log(this.orderdetildata.paymentAmount,"orderdetildata.paymentAmount");
                    
                    if(this.orderdetildata.paymentAmount) { // 有收款信息--走退货流程
                        // 关闭当前客增单作废的弹出框
                        // this.centerDialogVisible = false
                        // this.Dialogtitle = '订单退货'
                        // 开启订单退货的弹出框
                        // this.centerDialogVisible = true
                        this.$message({
                            message: '当前订单有收款信息,无法作废',
                            type: 'warning'
                        });
                        this.centerDialogVisible = false;
                    }else  { // 无收款信息--直接作废
                        // 调用客增单作废的接口
                        this.orCancel();
                    }
                }
            }else if(this.Dialogtitle == '新增问题'){
                this.newPro();
                this.centerDialogVisible = false;
            }else if(this.Dialogtitle == '邀约到店' || this.Dialogtitle == '发送预算清单'){
                this.inviShop()
            }   
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
            this.centerDialogVisible = false;
            budgetId = this.$refs.invitalog.fromdatas.budgetId; // 预算清单id
            // 附件
            let accessoryId = this.$refs.invitalog.elsectFile.map(item => {
                return item.accessoryId
            })
            let data = {
                orderId: this.orderId,  // 订单ID
                invitationTime:  this.$refs.invitalog.fromdatas.handoverDate,
                // invitationContent: this.$refs.invitalog.fromdatas.remarks,
                sendWay: this.$refs.invitalog.fromdatas.sendWay,
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
                    this.Dialogtitle = ''
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 邀约到店 order/order/order.vue', error);
            })
        },
        // 新增问题 -- 确定操作按钮
        newPro(){
            let data = {
                orderId: this.orderdetildata.orderId,  // 订单ID
                problemType: this.$refs.prodialog.questiontype, // 问题类型
                problemDesc: this.$refs.prodialog.desc, // 问题描述
                newProblemsFile: this.$refs.prodialog.newProblemsFile,      //如果上传的是图片就用这个集合
            };
            addProblem(data).then(res =>{
                console.log(res);
                if(res.status == 200){
                    this.$message.warning("新增问题成功");
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        orderclosefun(val){
            if(val && val.length > 0){
                console.log(val)
                let datas = val[0]
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
            }else{
                this.newcenterDialogVisible = false;
            }
        },
        searchfun(data){    //搜索
            this.loading = true;
            // console.log(data)
            listOrder(data).then(res =>{
                if(res.status == 200){
                    // this.total = res.data.total;
                    this.tableData = res.data;
                    this.loading = false;
                }
            }).catch(error =>{
                this.loading = false;
                console.log('订单管理:订单列表 order/customerorder/index.vue', error);
            })
        },
        newbudget(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个订单',
                    type: 'warning'
                });
                return false
            } else if (this.tableSelectList.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
                return false
            } else {
                return true
            }
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
    },
}
</script>
<style lang="scss">
.customerorder{
    .order_btn_list{
        // margin: 10px 0px;
        display: flex;
        flex-wrap: wrap;
        button{
            margin: 0px 10px 10px 0px;
        }
    }
}
</style>
