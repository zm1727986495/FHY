<template>
    <div class="customerorder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <!-- 遗留单管理 -->
        <!-- 查询条件组件 -->
        <screencompon ref="screencompondata" @searchfun="searchfun" :total="total" :orderType="orderType">
            <!-- 插槽 -->
            <div>
                <div class="order_btn_list m-bottom10 m-top10">
                  <el-button size="small" v-if="btnJurisdiction[itm.jurisdiction]" class="button-96" @click="benlistfun(itm.name)" v-for="(itm, idx) in btnlistdata" :key="idx">{{itm.name}}</el-button>
                </div>
                <div class="order_table">
                    <el-table border ref="multipleTable" :data="tableData" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" align="center" fixed="left" width="40"></el-table-column>
                        <el-table-column prop="orderStatusName" align="center" label="订单状态" width="140" sortable show-overflow-tooltip fixed="left"></el-table-column>
                        <el-table-column prop="orderNumber" align="center" label="单号" width="160" sortable></el-table-column>
                        <el-table-column prop="orderSubsidiaryNumber" align="center" label="主单号" width="160" sortable></el-table-column>
                        <el-table-column prop="orderType" align="center" label="单据类型" width="120" sortable>
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
                    <el-table-column prop="brandName" align="center" label="产品品牌" width="120" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="categoryName" align="center" label="品类" width="120" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderGoodsType" align="center" label="货品类型" width="120" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderGoodsType == 1">成品</div>
                            <div v-if="scope.row.orderGoodsType == 2">定制</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractMoney" align="center" label="合同金额/元" width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{scope.row.contractMoney | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paymentAmount" align="center" label="实收金额/元" width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{scope.row.paymentAmount | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportedType" align="center" label="报备类型" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="creported" align="center" label="c类报备" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="salesmanName" align="center" label="销售员" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessName" align="center" label="业务员" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorName" align="center" label="测量员" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderChannelName" align="center" label="订单渠道" width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderSourceName" align="center" label="订单来源" width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" align="center" label="创建订单时间" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyor_assigned_time" align="center" label="指派测量时间" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designer_assigned_time" align="center" label="指派设计时间" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="visit_time" align="center" label="自定义回访时间" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </div>
        </screencompon>
        <!-- 弹框页面 -->
        <ordercomponent 
            v-if="centerDialogVisible" 
            :centerDialogVisible="centerDialogVisible" 
            @orderclosefun="orderclosefun">
        </ordercomponent>

        <!-- 作废 -->
        <el-dialog :title="Dialogtitle" custom-class="customDialogTitle" :visible.sync="DialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
            <div class="content_box">
                <cancellation ref='cancell' v-if="Dialogtitle == '订单作废'"></cancellation>
            </div>
            <div slot="footer" class="dialog-footer" v-if="Dialogtitle !== '上传下单图'">
                <el-button type="primary" @click="sendJava">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 商品明细 -->
        <el-dialog title="商品明细" class="customDialogTitle" :visible.sync="InventoryVisible" width="70%">
            <div v-if="InventoryVisible">
                <commodity :orderId="orderId"></commodity>
            </div>
            <div slot="footer" style="margin-top: 0px;">
                <el-button @click="cancel"  class="el-button--medium" type="primary" size="medium">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="提示" class="customDialogTitle" :visible.sync="tipsdialogVisible" width="30%">
            <span>是否确定提交保存?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tipsdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="subtips">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 附件管理组件
        orderId：订单id 不传默认为空
        accessoryTypes：(传Number类型)附件类型(根据模块传对应的参数)不传默认为1  -->
        <el-dialog :visible.sync="visibleDialog" width="960px" title="附件管理" class="customDialogTitle">
            <accessory v-if="visibleDialog" :orderId="orderId" :btns="btns" 
                :btnswatch="btnswatch" :accessoryTypes="accessoryTypes">
            </accessory>
        </el-dialog>
    </div>
</template>
<script>
import ordercomponent from "../../components/ordercomponent";
import breadcrumb from "@/views/components/breadcrumb";
import screencompon from "@/views/order/components/screencompon"//筛选条件
import { 
    listOrder, 
    addInvalidOrderCancel,
    orderCancel, 
    submitOrder, 
    invalidOrderCancel, 
     } from 'api/order/order/order';
import { getUUID } from "api/pulicJava";
import cancellation from "../order/components/cancellation";
import commodity from '@/views/administrationCenter/contractmanagement/components/commodity';//商品明细接组件
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入

export default {
    components: {
        breadcrumb,
        screencompon,
        ordercomponent,
        cancellation,
        commodity,
        accessory,
    },
    data() {
        return {
            selecdata: [],
            orderId: "",
            Dialogtitle: "",
            accessoryTypes: "",
            btnswatch: false,
            btns: [],
            tipsdialogVisible: false,
            visibleDialog: false,
            centerDialogVisible: false,
            DialogVisible: false,
            InventoryVisible: false,
            total: 0,
            orderType: 1,
            navList: [],
            // btnlistdata: ["新增遗留单","修改遗留单","提交","作废","商品明细","附件管理","下单","批量下载","导出",],//按钮列表
            btnlistdata: [
                {name: "新增遗留单", jurisdiction: "abandonorder_newadd"},
                // {name: "修改遗留单", jurisdiction: "abandonorder_modify"},
                {name: "下单", jurisdiction: "abandonorder_placeorder"},
                {name: "提交", jurisdiction: "abandonorder_submit"},
                {name: "作废", jurisdiction: "abandonorder_cancal"},
                {name: "商品明细", jurisdiction: "abandonorder_Inventory"},
                {name: "附件管理", jurisdiction: "abandonorder_enclosure"},
                {name: "批量下载", jurisdiction: "abandonorder_batchdownload"},
                {name: "导出", jurisdiction: "abandonorder_export"},
            ],//按钮列表
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
            tableData: [],//表格数据
            tableSelectList: [],//选中数据
        }
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
            return (val*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
    },
    created() {
        },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        this.$refs.screencompondata.searchfun()
    },
    methods: {
        orderclosefun(val){
            if(val && val.length > 0){
                console.log(val)
                this.$router.push({path: "/Installation/addabandonorder", query: {orderId: val[0].orderId}})
            }else{
                this.centerDialogVisible = false;
            }
        },
        benlistfun(val){
            let orderdatas = []
            if (this.tableSelectList[0]) {
                this.orderId = this.tableSelectList[0].orderId
                this.selecdata = this.tableSelectList[0]
                orderdatas = this.tableSelectList[0]
            }
            if(val === "新增遗留单"){
                this.centerDialogVisible = true;
            }else if(val === "下单"){
                if(this.newbudget()){
                    this.$router.push({path: "/Installation/addabandonorder",query: {orderId: orderdatas.orderId, orderType: orderdatas.orderType}})
                }
            }else if(val == "提交"){
                if(this.newbudget()){
                    if(orderdatas.orderType == 100){
                        this.tipsdialogVisible = true;
                    }else{
                        this.$message.warning("该订单已提交");
                    }
                }
            }else if(val == "作废"){
                if(this.newbudget()){
                    this.orderId = orderdatas.orderId;
                    this.DialogVisible = true
                    this.Dialogtitle = '订单作废';
                }
            }else if(val == "商品明细"){
                if(this.newbudget()){
                    this.orderId = orderdatas.orderId
                    this.InventoryVisible = true;
                }
            }else if(val == "附件管理"){
                if(this.newbudget()){
                    this.visibleDialog = true
                    this.orderId = val.orderId
                    this.accessoryTypes = 1
                    this.btns = [];
                    this.btnswatch = false;
                }
            }
        },
        // 提交保存新增单
        subtips(){
            // this.selecdata
            let data = {
                orderId: this.selecdata.orderId,
                orderNumber: this.selecdata.orderNumber,
            }
            submitOrder(data).then(res =>{
                if(res.status == 200){
                    this.$message.success("提交成功");
                    this.tipsdialogVisible = false;
                    this.$refs.screencompondata.searchfun()
                }
            }).catch(error =>{
                console.log('提交保存 order/order/order.vue', error);
            })
        },
        newbudget(){
            if(this.tableSelectList.length > 1){
                this.$message.warning("只能选择一个订单");
                return false
            } else if (this.tableSelectList.length < 1){
                this.$message.warning("请选择订单");
                return false
            } else {
                return true
            }
        },
        sendJava(){ // 弹框确定按钮
            if(this.Dialogtitle == '订单作废') {
                if(!this.$refs.cancell.ruleForm.whether) {
                    this.$message.warning("请确定勾选了是否确定作废按钮");
                    return;
                }else {
                    console.log(this.tableSelectList[0].paymentAmount,"this.tableSelectList[0].paymentAmount");
                    if(this.tableSelectList[0].paymentAmount) { // 有收款信息--走退货流程
                        this.$message.warning("当前订单有收款信息,无法作废");
                        this.DialogVisible = false;
                        this.Dialogtitle = ''
                    }else  { // 无收款信息--直接作废
                        // 调用订单作废的接口
                        this.orCancel();
                    }
                }
            }
        },
        cancel(){ // 弹框取消
            this.DialogVisible = false
            this.InventoryVisible = false
            this.Dialogtitle = '';
        },
        // 订单作废功能
        orCancel() {
            let data = {
                orderType: 453,  //订单类型
                orderId: this.orderId,  //  订单ID
                reason:  this.$refs.cancell.ruleForm.desc   //  作废原因
            };
            orderCancel(data).then(res =>{
                if(res.status == 200){
                    this.$message.success("订单作废");
                    // 重新加载表格
                    this.DialogVisible = false;
                    this.Dialogtitle = '';
                    this.$refs.screencompondata.searchfun()
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 订单作废 order/order/order.vue', error);
            })
        },
        searchfun(data){    //搜索
            console.log(data)
            listOrder(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableData = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        }
    }
}
</script>
