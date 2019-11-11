<template>
    <div class="signcontract">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <!-- 订单编号组件 -->
        <orderdetail ref="orderdetaildata" :orderId="$route.query.orderId"></orderdetail>
        <collapsecompoent :isShow="false">
            <div slot="titles">合同信息</div>
            <div class="ziyshopclas" slot="btnlist">
                <div></div>
                <div class="btnlist">
                    <el-button size="mini" class="button-96" :disabled="!signedwatch" @click="selectbudgetlist" v-if="this.$route.query.orderGoodsType == 2">选择预算清单</el-button>
                    <!-- <el-button size="small" class="button-96" :disabled="!signedwatch" @click="selectivedesign" v-if="this.$route.query.orderGoodsType == 2">选择设计图</el-button> -->
                    <el-button size="mini" class="button-96" @click="preview">合同预览</el-button>
                    <el-button size="mini" class="button-96" @click="previewfun">清单预览</el-button>
                </div>
            </div>
            <div slot="content">
                <el-form :label-position="labelPosition" 
                    label-width="130px" size="small"
                    class="demoforminline">
                    <el-form-item label="合同签订时间">
                        <el-date-picker class="widmax" prefix-icon="el-icon-date"
                            v-model="signingTime" type="date"  @change="signingTimefun"
                            value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss' :disabled="!signedwatch"
                            placeholder="年/月/日">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="产品保修说明">
                        <el-input placeholder="" :disabled="!signedwatch" v-model="productWarrantyContent"></el-input>
                    </el-form-item>
                    <el-form-item label="商品原价">
                        <el-input placeholder="" disabled v-model="goodsOriginalPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="折后金额">
                        <el-input placeholder="" disabled v-model="goodsAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="其他费用金额">
                        <div>{{otherCost}}</div>
                    </el-form-item>
                    <el-form-item label="合同金额" required>
                        <div class="flexdis inpdis input_number">
                            <el-input-number placeholder="合同金额" :disabled="!signedwatch" v-model="contractMoney" :controls="false"></el-input-number>
                            <!-- <el-input placeholder="" :disabled="!signedwatch" v-model="contractMoney"></el-input> -->
                            <!-- <el-input placeholder="" disabled v-model="maLingAmount"></el-input> -->
                        </div>
                    </el-form-item>
                    <el-form-item label="合同金额备注" class="widmax singsTextarea" required>
                        <el-input type="textarea" placeholder="请输入合同金额备注" class="textareaclass" :autosize="{minRows: 1,maxRows: 7}" v-model="contractMoneyRemark"></el-input>
                    </el-form-item>
                    <el-form-item label="预计工期">
                        <div class="posirkeh">
                            <el-input placeholder="请输入预计工期" v-model="predictGq" disabled></el-input>
                            <div>天</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="预计安装日期" required>
                        <div class="posirkeh">
                            <el-date-picker prefix-icon="el-icon-date" @change="changeitmefun"
                                v-model="predictInstallTime" type="date" 
                                value-format='yyyy-M-dd' format='yyyy-M-dd'
                                placeholder="年/月/日" :disabled="!signedwatch">
                            </el-date-picker>
                            <div class="timediffclass" v-if="predictInstallTime">
                                <div class="fontwith">工期差: </div>
                                <div :class="{'red': timedifferences < 0, 'green': timedifferences > 0}">{{timedifferences}}</div>
                            </div>
                        </div>
                    </el-form-item>

                </el-form>
            </div>
        </collapsecompoent>
        <!-- 预算清单 -->
        <div>
            <editbudgetlist ref="editbudgetlistdata" @getPrice="getPrice" :signedwatch="signedwatch" :orderBudgetId="budgetId" ></editbudgetlist>
        </div>
        <!-- <collapsecompoent>
            <div slot="titles">预算清单</div>
            <div slot="content" style="padding-bottom: 40px">
            </div>
        </collapsecompoent> -->
        <!-- <el-card class="btn_box">
                <el-button size="small" type="primary" v-if="signedwatch" @click="activeFn(1)">新增房间</el-button>
                <el-button size="small" type="primary" v-if="signedwatch" @click="activeFn(6)">复制房间</el-button>
                <el-button size="small" type="primary" v-if="signedwatch" @click="activeFn(3)">复制</el-button>
                <el-select size="small" v-model="value" filterable placeholder="分类" :disabled="!signedwatch" class="classification" @change="seteditBudge">
                    <el-option
                    v-for="item in styleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button size="small" type="primary" v-if="signedwatch" @click="activeFn(4)">更换房间</el-button> -->
                <!-- <el-button size="small" type="primary" v-if="signedwatch" @click="activeFn(5)">清单预览</el-button> -->
                <!-- <el-button size="small" type="primary" v-if="signedwatch" @click="activeFn(2)">删除房间</el-button>
            <el-button size="small" type="primary" plain @click="gobar">返回</el-button>
            <el-button size="small" type="primary" @click="getbudfun(0, false)" :loading="loadingbtn">保存</el-button>
            <el-button size="small" type="primary" :disabled="!signedwatch" @click="getbudfun(1, false)" :loading="loadingbtn">生成合同</el-button>
        </el-card> -->
 
        <div class="btn_lists flex-div">
           <div class="flex-div btn_item btn_select" v-if="signedwatch">
               <el-select size="small" v-model="value" filterable placeholder="分类" :disabled="!signedwatch" class="classification" @change="seteditBudge">
                    <el-option
                    v-for="item in styleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="flex-div btn_item" v-if="signedwatch" @click="activeFn(1)">
                <img :src="xinzeng" class="btn_img">
                <P>新增房间</P>
            </div>
            <div class="flex-div btn_item" v-if="signedwatch" @click="activeFn(6)">
                <img :src="fuzhi" class="btn_img">
                <P>复制房间</P>
            </div>
            <div class="flex-div btn_item" v-if="signedwatch" @click="activeFn(3)">
                <img :src="fuzhi" class="btn_img">
                <P>复制</P>
            </div>
            <div class="flex-div btn_item" v-if="signedwatch" @click="activeFn(4)">
                <img :src="genghuan" class="btn_img">
                <P>更换房间</P>
            </div>
            <div class="flex-div btn_item" v-if="signedwatch" @click="activeFn(2)">
                <img :src="shanchu" class="btn_img">
                <P>删除房间</P>
            </div>
            <div class="flex-div btn_item"  @click="gobar">
                <img :src="fanhui" class="btn_img">
                <P>返回</P>
            </div>
            <div class="flex-div btn_item"  @click="getbudfun(0, false)">
                <img :src="setLocal" class="btn_img">
                <P>保存</P>
            </div>
            <div class="flex-div btn_item" v-if="signedwatch" @click="getbudfun(1, false)">
                <img :src="shengchengdingdan" class="btn_img">
                <P>生成合同</P>
            </div>
        </div>
        <!-- <el-collapse-item title="库取单" name="4">
            <div v-show="this.orderGoodsType != 2 && showWarehouse">
                <WarehouseListTable ref="warecomponent" @productfun="productfun"></WarehouseListTable>
            </div>
        </el-collapse-item> -->

        <!-- <el-card class="lvs" v-if="this.orderGoodsType != 2">
            <div class="titlecals">自有商品</div>
            <div class="btnlist" v-if="!signedwatch">
                <el-button size="small" class="button-96" @click="checkshop">添加自有商品</el-button>
                <el-button size="small" class="button-96" @click="deleshop">删除自有商品</el-button>
                <el-button size="small" class="button-96" @click="preservationfun">保存</el-button>
            </div>
            <div class="order_table">
                <el-table border key="zytable"
                    ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="zyhandleSelectionChange">
                    <el-table-column type="selection" align="center" width="55" fixed></el-table-column>
                    <el-table-column prop="roomId" align="center" width="200" label="房间号">
                        <template slot-scope="scope">
                                <el-select v-model="scope.row.roomId" placeholder="选择房间号" size="medium">
                                    <el-option v-for="item in stateList" :key="item.value"
                                        :label="item.dictName" :value="item.id">
                                    </el-option>
                                </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="commodityCode" align="center" width="200" label="自有商品编码"></el-table-column>
                    <el-table-column prop="commodityName" align="center" width="200" label="自有商品名称" sortable></el-table-column>
                    <el-table-column prop="brandName" align="center" width="200" label="品牌"></el-table-column>
                    <el-table-column prop="categoryName" align="center" width="200" label="品类"></el-table-column>
                    <el-table-column prop="classifyName" align="center" width="200" label="分类" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="amount" align="center" width="200" label="数量">
                        <template slot-scope="scope">
                            <el-input placeholder="数量" type="number" v-model="scope.row.amount" size="medium" maxlength="50"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remarks" align="center" width="200" label="备注">
                        <template slot-scope="scope">
                            <el-input placeholder="备注" v-model="scope.row.remarks" size="medium" maxlength="50"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
                <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange">
                </pagination>
            </div>
        </el-card> -->
        
        <!-- 选择商品 -->
        <el-dialog title="商品列表" :visible.sync="productDialog2" width="90%" top="2vh" class="customDialogTitle lvs dialogCommodity"><!--width="1024px"-->
            <div>
                <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList"></select-commodity>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subchanshop">确 定</el-button>
                <el-button @click="productDialog2 = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 选择预算清单和设计图 -->
        <el-dialog :title="visibletitle" width="800px" :visible.sync="budgetlistvisbal" class="lvs customDialogTitle">
            <div>
                <el-table border ref="multipleTable" :data="budgetlistdata" 
                    tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" v-if="visibletitle === '选择预算清单'"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="budgetNumber" width="130" align="center" label="预算清单编号"></el-table-column>
                    <el-table-column prop="orderNumber" width="130" align="center" label="订单号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" width="150" align="center" label="创建时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderType" width="120" align="center" label="订单类型" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="totalAmount" width="150" align="center" label="合计金额" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerName" width="120" align="center" label="客户姓名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" width="120" align="center" label="客户电话" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" width="200" label="订单地址" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="salesman" align="center" width="120"  label="销售员" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyor" align="center" width="120"  label="测量员" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designer" align="center" width="120"  label="设计师" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="business" align="center" width="120"  label="业务员" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" width="150"  label="所属网点" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderStatus" align="center" width="130"  label="订单状态" show-overflow-tooltip></el-table-column>
                </el-table>
                <el-table bordertooltip-effect="dark"  v-if="visibletitle === '选择设计'"
                    @selection-change="sjhandleSelectionChange" 
                    :data="desgintabledata" style="width: 100%;">
                    <el-table-column type="selection" align="center" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column prop="sourceName" align="center" width="200" label="附件类型" sortable></el-table-column>
                    <el-table-column prop="sourceName" align="center" width="200" label="附件名称" sortable></el-table-column>
                    <el-table-column prop="contactsName" align="center" width="200" label="上传时间" sortable></el-table-column>
                    <el-table-column prop="isMain" align="center" width="200" label="上传人" sortable></el-table-column>
                </el-table>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="budgetcurrentPage"
                        :pageSize="budgetpageSize"
                        :total="budgettotal"
                        @sizeChange="budgetsizeChange"
                        @currentChange="budgetcurrentChange">
                    </pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectbudget">确 定</el-button>
                <el-button @click="budgetlistvisbal = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 清单预览弹框组件 -->
        <shoppreview :shoppreVisible="shoppreVisible" v-if="shoppreVisible" :orderId="orderId" @previewclosefun="previewclosefun"></shoppreview>
    </div>
</template>
<script>
import shoppreview from "@/views/components/shoppreview";//清单预览弹框组件
import WarehouseListTable from '@/views/administrationCenter/contractmanagement/components/WarehouseListTable';//库取单
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "@/views/order/components/orderdetail";
import collapsecompoent from "@/views/components/collapsecompoent";//收起展开组件
import editbudgetlist from "@/views/order/budgetdetailed/add/editBudgetList";
import selectCommodity from '@/views/components/selectCommodity'
import xinzeng from '@/assets/images/xinzeng.png'
import fuzhi from '@/assets/images/fuzhi.png'
import genghuan from '@/assets/images/genghuan.png'
import shanchu from '@/assets/images/shanchu.png'
import fanhui from '@/assets/images/fanhui.png'
import setLocal from '@/assets/images/icon-save.png'
import shengchengdingdan from '@/assets/images/shengchengdingdan.png'
import { 
    getCustomerContract,//查询合同基本信息
    insertContractDetail, //合同基本信息保存
    listOrderOwnGoods, //自有商品列表
    insertOrderBudgetOwnGoods, //保存自有商品
    listBaseDict, //基础字典查询
    listOrderBudget,//选择预算清单
    getDesignAccessory,//选择设计附件
    getOrderBudget,//编辑预算清单
    getPreviewContract,//预览合同
    verifyExistContract,//验证订单是否存在有效合同接口
    verifyContractIsCanUpdate,//验证订单是否存在有效合同接口
    updateContractMoneyRemark,//编辑合同金额备注接口
    } from 'api/order/contract/contract';

import { getUUID } from "api/pulicJava";
import pagination from '@/views/components/pagination'
  import { 
    contractAccessoryManagement, // 合同附件管理列表
  } from 'api/order/order/order';
import { log } from 'util';
// import { listClassify } from 'api/pulicJava';
export default {
    name: "signcontract",
    components: {
        breadcrumb,
        shoppreview,
        orderdetail,
        WarehouseListTable,
        pagination,
        editbudgetlist,
        selectCommodity,
        collapsecompoent,
    },
    data(){
        return {
            signedwatch: true,//签合同开关 true:可用 false 不可用
            shoppreVisible: false,
            loadingbtn: false,
            styleList:[//下拉
                {'label':'房间',"value":1},
                {'label':'商品',"value":0},
            ],
            value:1 , //下来默认选中值
            orderGoodsType: this.$route.query.orderGoodsType,
            urgentGq: "",
            editbudgetkey: 0,
            customerContractId: "",
            contractSerialNumber: "",
            changeshopdata: [],
            maLingAmount: "",
            contractMoney: "",
            navList: [],
            selectList: {
                selectedCommodities: [], // 选中的商品 可不传
                brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
                categoryList: [], // 品类数组 可不传（不传默认为全部品类）
                priceStrategyId: '', // 价格策略 不是必填
                height: '350px', // 设置表格高度 可不传（弹出层最好传下）
                isDialog: true // 是否为弹出层（不传默认为页面）
            },
            deviseid: [],//设计附件id
            tableSelectList: [],//勾选预算清单 设计图信息
            sjtableSelectList: [],//勾选设计图信息
            zytableSelectList: [],//勾选自有
            budgetId: "",//预算清单id
            visibletitle: "选择预算清单",
            changeshopdata: [],//选择商品列表数据
            stateList: [],//房间列表
            budgetlistvisbal: false,//选择预算清单
            signingTime: '',//合同签订日期
            productWarrantyContent: '',//产品保修说明
            contractMoneyRemark: '',//合同金额备注
            predictInstallTime: '',//预计安装时间
            timedifference: '',//存储正常工期
            timedifferences: "",//工期差
            goodsOriginalPrice: '',//商品原价
            goodsAmount: '',//商品金额
            predictGq: 0,//预计工期
            minPeriod: '',//最快工期
            otherCost: '0.00',//其他费用
            orderId: "",
            signconfals: false,
            productDialog2: false,
            labelPosition: 'right',
            desgintabledata: [],//选择设计表格
            budgetlistdata: [],//预算清单表格
            tableData:[],//自有商品列表
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
            budgettotal: 0,    // 总数
            budgetpageSize: 10,  // 单页条数
            budgetcurrentPage: 1, // 当前页
            showWarehouse: false,//是否显示库取组件
            productdata: [],//子组件库取组件列表数据
            notifyval: null,//通知组件变量
            xinzeng,//icon
            fuzhi,//icon
            shanchu,//icon
            genghuan,//icon
            fanhui,//icon
            setLocal,//icon
            shengchengdingdan,//icon
        }
    },
    created() {
        let curDate = new Date();
        this.signingTime = new Date(curDate.getTime() + 8*60*60*1000).toJSON().substr(0, 19).replace('T', ' ')
        // 预算清单商品数据
        this.orderId = this.$route.query.orderId;
        // 自有商品列表接口
        this.OwnGoodsfun()
        let datas={
            dataType: "ROOM_TYPE"
        };
        listBaseDict(datas).then(res =>{
            if(res.status == 200){
                this.stateList = res.data
            }
        }).catch(error =>{
            console.log('合同详情:自有商品列表 order/order/order.vue', error);
        })

        // 获取合同信息
        this.getcustomer()
        // console.log(this.countfun(12350.55))
        
    },
    mounted() {
        if(this.$route.query.budgetId){
            this.budgetId = this.$route.query.budgetId
            this.$refs.editbudgetlistdata.getData({budgetId: this.budgetId})
        }
        // 头部面包屑
        this.navList=this.$route.meta;

        const setfun = setInterval(()=>{
            this.getbudfun(0, true)
        },60*1000)
        this.$once('hook:beforeDestroy', () => {            
            clearInterval(setfun);                                    
        })
    },
    methods: {
        /**
         * 预算清单方法调用
         * activeFn
         */
        activeFn(type){
            if(type == 1){
                this.$refs.editbudgetlistdata.addRooms();
            }else if(type == 2){
                this.$refs.editbudgetlistdata.rovmeRooms();
            }else if(type == 3){
                this.$refs.editbudgetlistdata.choiceRoom('复制商品', 1)
            }else if(type == 4){
                this.$refs.editbudgetlistdata.choiceRoom('更换房间', 2)
            }else if(type == 5){
                this.$refs.editbudgetlistdata.shopprevidw();
            }else {
                this.$refs.editbudgetlistdata.copyRomm();
            }
        },
        changeitmefun() {
          let curDate = new Date(this.signingTime)
          this.timedifference = new Date(curDate.getTime() + this.predictGq * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toJSON().substr(0, 19).replace('T', ' ');
          this.timedifferences = Math.ceil((new Date(this.predictInstallTime).getTime() - new Date(this.timedifference).getTime()) / 24 / 60 / 60 / 1000);
        },
        signingTimefun(val) {
          let curDate = new Date(val)
          this.timedifference = new Date(curDate.getTime() + this.predictGq * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toJSON().substr(0, 19).replace('T', ' ');
          this.timedifferences = Math.ceil((new Date(this.predictInstallTime).getTime() - new Date(this.timedifference).getTime()) / 24 / 60 / 60 / 1000);
        },
        // 更新库取列表数据
        productfun(val){
            this.productdata = val;
            if(val.length != 0){
                this.showWarehouse = true;
            }else{
                this.showWarehouse = false;
            }
        },
        // 验证合同是否可签订
        verifycontract(val){
            verifyContractIsCanUpdate({customerContractId: val}).then(res =>{
                if(res.status == 200){
                    if(res.data == 0 || res.data == 3){
                        this.signedwatch = true;
                    }else{
                        this.signedwatch = false;
                    }
                }
            }).catch(error =>{
                console.log('合同详情:获取合同信息 order/order/order.vue', error);
            })
        },
        // 获取合同信息接口
        getcustomer(){
            let orderId = this.orderId
            getCustomerContract({orderId: orderId}).then(res =>{
                if(res.status == 200){
                    // 合同id有的时候回显
                    if(res.data){
                        // if(res.data.contractState == 3){
                        //     this.$refs.editbudgetlistdata.singType = 1;
                        //     return
                        // }
                        this.customerContractId = res.data.customerContractId;
                        if(res.data.customerContractId != "" && res.data.customerContractId){
                            this.verifycontract(res.data.customerContractId)
                        }
                        if(res.data.customerContractId == ""){
                            this.$refs.editbudgetlistdata.singType = 1;
                        }
                        this.contractSerialNumber = res.data.contractSerialNumber;//合同流水号
                        if(res.data.contractState == 3){
                            this.contractSerialNumber = ""
                        }
                        this.budgetId = res.data.orderBudgetId;//预算清单ID
                        this.signingTime = res.data.signingTime;//合同签订日期
                        this.predictGq = res.data.predictGq;//预计工期
                        this.contractMoneyRemark = res.data.contractMoneyRemark;//合同金额备注
                        this.goodsAmount = res.data.goodsAmount;//商品金额
                        this.urgentGq = res.data.urgentGq;//加急工期回显
                        this.goodsOriginalPrice = res.data.goodsOriginalPrice;//商品原价
                        this.productWarrantyContent = res.data.productWarrantyContent;//产品保修说明
                        this.predictInstallTime = res.data.predictInstallTime;//预计安装时间
                        this.contractMoney = res.data.contractMoney;//合同金额
                        let curDate = new Date(res.data.signingTime);
                        this.timedifference = new Date(curDate.getTime() + this.predictGq*24*60*60*1000 + 8*60*60*1000).toJSON().substr(0, 19).replace('T', ' ');
                        this.timedifferences = Math.ceil((new Date(this.predictInstallTime).getTime()-new Date(this.timedifference).getTime())/24/60/60/1000);
                        this.$refs.editbudgetlistdata.getData({budgetId: res.data.orderBudgetId, type: 2});//type 1更改合同价格 2 不更改合同价格
                        this.maLingAmount = res.data.maLingAmount;//抹零金额
                        this.otherCost = res.data.otherCost;//其他费用
                    }else {
                        this.$refs.editbudgetlistdata.singType = 1;
                    }
                }
            }).catch(error =>{
                console.log('合同详情:获取合同信息 order/order/order.vue', error);
            })
        },
        countfun(val){
            if(val > 100){
                return (parseInt(val) - parseInt(val % 100)).toFixed(2)
            }else{
                return val
            }
        },
        /**
         * 切换 房间 商品 展示下拉列表
         * @func
         */
        seteditBudge(val){
            this.$refs.editbudgetlistdata.value = val;
        },
        obtain(){
            this.showWarehouse = true;
            this.$refs.warecomponent.getData()
        },
        // 获取金额
        getPrice(val, type){
            let price = val.orderPrice.toFixed(2)
            let discountPrice = val.discountsPrice.toFixed(2)
            let data = val.tiems
            this.goodsOriginalPrice = price
            this.goodsAmount = discountPrice
            if(discountPrice){
                if(type ==1){
                    if (this.orderGoodsType == 1) { // 成品计算金额，定制品不计算
                      this.contractMoney = discountPrice;
                    }
                    // this.contractMoney = discountPrice;
                    // this.contractMoney = this.countfun(discountPrice)
                    this.maLingAmount = discountPrice - this.contractMoney;
                    this.predictGq = data.ratedPeriod || 0;
                    this.minPeriod = data.minPeriod || 0;
                    let curDate = new Date(this.signingTime);
                    this.timedifference = new Date(curDate.getTime() + this.predictGq * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toJSON().substr(0, 19).replace('T', ' ');// 商品原安装日期
                    this.timedifferences = Math.ceil((new Date(this.predictInstallTime).getTime() - new Date(this.timedifference).getTime()) / 24 / 60 / 60 / 1000);
                }else {
                    this.$refs.editbudgetlistdata.singType = 1;
                }
            }
        },
        // 自有商品列表接口
        OwnGoodsfun(){
            let data = {
                orderId: this.orderId,
                orderType: 2
            }
            listOrderOwnGoods(data).then(res =>{
                if(res.status == 200){
                    this.tableData = res.data;
                }
            }).catch(error =>{
                console.log('订单管理:自有商品列表接口 order/contract/index.vue', error);
            })
        },
        deleshop(){
            this.zytableSelectList.forEach((item, index) =>{
                this.tableData.forEach((itm, idx) =>{
                    if (item.commodityId === itm.commodityId) {
                        this.tableData.splice(idx, 1)
                    }
                })
            })
        },
        // 保存自有
        preservationfun(){
            let data = [];
            this.tableData.forEach((itm) =>{
                if(!itm.roomId || itm.roomId == "" || !itm.amount || itm.amount == ""){
                    this.$message({
                        message: '填写信息有误',
                        type: 'error'
                    });
                }else{
                    let obj = {
                        roomId: itm.roomId,
                        amount: itm.amount,
                        remarks: itm.remarks ? itm.remarks : "",
                        commodityId: itm.commodityId,
                    }
                    data.push(obj)
                }
            })

            if(this.tableData.length === data.length){
                let fromdata = {
                    orderId: this.orderId,
                    orderType: 2,
                    orderBasinList: data
                }
                insertOrderBudgetOwnGoods(fromdata).then(res =>{
                    if(res.status == 200){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.OwnGoodsfun()
                    }
                }).catch(error =>{
                    console.log('订单管理:保存自有 order/contract/index.vue', error);
                })
            }
        },
        // 选择商品select
        selectionChange(val) {
            // this.changeshopdata.forEach(itm =>{
            //     // 在商品数据的基础上添加自有默认字段
            //     itm.roomId = "";//商品id
            //     itm.amount = "";//数量
            //     itm.remarks = "";//备注
            // })
            this.changeshopdata = val;
        },

        // 选择商品确定操作
        subchanshop(){
            this.tableData.push(...this.changeshopdata)
            this.productDialog2 = false;
        },
        selefun(){
            let data = {
                orderId: this.orderId,
                page: this.budgetcurrentPage,
                limit: this.budgetpageSize,
            }
            if (this.visibletitle == "选择设计") {
                getDesignAccessory(data).then(res =>{
                    if(res.status == 200){
                        this.desgintabledata = res.data;
                        this.budgettotal = res.total
                    }
                }).catch(error =>{
                    console.log('选择设计 administrationCenter/contractmanagement/components/accessory.vue', error);
                })
            }else{
                listOrderBudget(data).then(res =>{
                    if(res.status == 200){
                        this.budgetlistdata = res.data.rows;
                        this.budgettotal = res.data.total
                    }
                }).catch(err =>{
                    console.log('选择预算清单 order/contract/signcontract.vue', error);
                })
            }
        },
        // 勾选确定框
        selectbudget(){
            if(this.visibletitle == "选择设计"){
                if(this.sjtableSelectList.length < 1){
                    this.$message({
                        message: '请选择订单',
                        type: 'error'
                    });
                }else{
                    this.deviseid = [];
                    this.sjtableSelectList.forEach(item=>{
                        this.deviseid.push((item.accessoryId)*1)
                    })
                    this.budgetlistvisbal = false;
                }
            }else{
                if(this.tableSelectList.length < 1){
                    this.$message({
                        message: '请选择订单',
                        type: 'error'
                    });
                }else if (this.tableSelectList.length > 1) {
                    this.$message({
                        message: '只能选择一个订单',
                        type: 'error'
                    });
                }else{
                    // this.editbudgetkey++;
                    // 选择预算清单方法
                    this.budgetId = this.tableSelectList[0].budgetId
                    this.$refs.editbudgetlistdata.getData({budgetId: this.budgetId})
                    this.budgetlistvisbal = false
                }
            }
        },
        giftfun(){
            this.$router.push({path: "/gift/giftgrant"})
        },
        // 选择设计图按钮
        selectivedesign(){
            this.visibletitle = "选择设计"
            this.budgetlistvisbal = true;
            this.selefun()
        },
        // 选择预算清单
        selectbudgetlist(){
            this.visibletitle = "选择预算清单"
            this.budgetlistvisbal = true;
            this.selefun()
        },
        setprovingfun(){
            if(this.signingTime == ""){
                return false
            }else if(this.goodsAmount === ""){
                return false
            }else if(this.predictInstallTime == ""){
                return false
            }
            return true
        },
        //提交校验
        provingfun(settimeval){
            if(this.signingTime == ""){
                if(!settimeval){
                    this.$message.error('请选择合同签订日期');
                }
                return false
            }else if(this.goodsAmount === ""){
                if(!settimeval){
                    this.$message.error("商品金额不能为空");
                }
                return false
            }
            // else if(this.deviseid.length == 0){
            //     this.$message({
            //         message: '请选择设计附件',
            //         type: 'error'
            //     });
            //     return false
            // }
            return true
        },
        // 清单预览关闭
        previewclosefun(){
            this.shoppreVisible = false;
        },
        // 清单预览
        previewfun(){
            this.shoppreVisible = true;
        },
        // 预览合同
        preview(){
            if(this.customerContractId == ""){
                this.$message.error("未签订的合同不能预览");
                return false;
            }
            let orderdata = this.$refs.orderdetaildata.detaildata
            let data = {
                orderId: this.orderId,
                customerContractId: this.customerContractId,
            }
            getPreviewContract(data).then(res =>{
                if(res.status == 200){
                    window.open("https://fanhuayiju.oss-cn-beijing.aliyuncs.com/"+ res.data)
                }else{
                    this.$message.error(res.message);
                }
            }).catch(error =>{
                console.log('订单管理:合同预览 order/contract/index.vue', error);
            })
        },
        // 返回
        gobar(){
            this.$router.push({path: '/ordermm/contract'});
        },
        // 保存合同 参数1：0为保存 1为生成 参数2：true为计时器 false为手动
        getbudfun(val, settimeval){
            if(this.loadingbtn){
                return
            }
            // val: 0 保存 1生成 settimeval：true自动生成 false手动操作
            // 合同生效后自动保存不执行
            if(settimeval && !this.signedwatch){
                return
            }
            let isbudgetId = this.budgetId == "" ? 2 : 1;
            if(isbudgetId == 2){
                this.$refs.editbudgetlistdata.getUid().then(res=>{
                    this.submitbtn(val, settimeval);
                })
            }else{
                this.submitbtn(val, settimeval);
            }
        },
        // 保存合同
        submitbtn(contractState, settimeval){
            // 不可签的时候点击保存只能修改合同金额备注
            if(!this.signedwatch){
                let data = {
                    customerContractId: this.customerContractId,
                    contractMoneyRemark: this.contractMoneyRemark,//合同金额备注
                }
                this.loadingbtn = true;
                updateContractMoneyRemark(data).then(res =>{
                    if(res.status == 200){
                        this.$message.success("合同保存成功！！");
                        // this.$router.push({path: '/ordermm/contract'});
                    }else{
                        this.$message.error("操作失败！请联系系统管理员");
                    }
                    this.loadingbtn = false;
                }).catch(error =>{
                    this.loadingbtn = false;
                    console.log('订单管理:只能提交备注 order/contract/index.vue', error);
                })
            }else{
                if(!this.provingfun(settimeval)){
                    return false
                }
                this.loadingbtn = true;
                // this.$refs.editbudgetlistdata.addBudget();
                // 没有预算清单为2
                // let isbudgetId = this.budgetId == "" ? 2 : 1;
                // if(isbudgetId == 2){
                //     this.$refs.editbudgetlistdata.getUid()
                // }
                let orderBudgetIds = this.$refs.editbudgetlistdata.addBudget();
                orderBudgetIds.then(res =>{
                    if(!res){
                        this.$message.error("生成预算清单失败！");
                        this.loadingbtn = false;
                        return 
                    }else{
                        this.budgetId = res;
                    }
                    let datas = this.predictInstallTime ? this.predictInstallTime.split(' ')[0] : '';
                    // let signingTimes = this.signingTime.split(' ')[0]
                    let data = {
                        contractSerialNumber: this.contractSerialNumber,
                        minPeriod: this.minPeriod+"",//最快工期
                        customerContractId: this.customerContractId,
                        contractState: contractState,
                        orderId: this.orderId,//订单id
                        orderBudgetId: res,//预算清单id
                        signingTime: this.signingTime,//合同签订时间
                        productWarrantyContent: this.productWarrantyContent,//产品保修说明
                        contractMoneyRemark: this.contractMoneyRemark,//合同金额备注
                        predictInstallTime: datas ? datas+" 00:00:00" : null,//预计安装时间
                        contractMoney: this.contractMoney,//合同金额
                        // maLingAmount: this.maLingAmount,//抹零金额
                        // maLingAmount: 100,//抹零金额
                        goodsOriginalPrice: this.goodsOriginalPrice,//商品原价
                        goodsAmount: this.goodsAmount,//商品金额
                        predictGq: this.predictGq,//预计工期
                        designAccessories: this.deviseid,//设计附件
                    };
                    // 保存
                    if(contractState == 0){
                        insertContractDetail(data).then(res =>{
                            if(res.status == 200){
                                // 自动保存不跳转不提示
                                if(settimeval){
                                    // this.notifyval = this.$notify({title: '提示',message: '系统已为您自动保存合同',duration: 0,type: 'success'});
                                }else{
                                    // this.$router.push({path: '/ordermm/contract'});
                                    this.$message.success("合同保存成功！！");
                                }
                                this.customerContractId = res.message;
                            }else{
                                this.$message.error("操作失败！请联系系统管理员");
                            }
                            this.loadingbtn = false;
                        }).catch(error =>{
                            this.loadingbtn = false;
                            console.log('订单管理:合同列表 order/contract/index.vue', error);
                        })
                        return
                    }
                    //  || this.customerContractId == ""
                    if (!Number(data.contractMoney)) {
                      this.$message.error('请输入合同金额');
                      this.loadingbtn = false;
                      return;
                    }
                    if(!this.predictInstallTime) {
                      if (!settimeval) {
                        this.$message.error("请选择预计安装时间");
                        this.loadingbtn = false;
                        return;
                      }
                    }
                    if(contractState == 1){
                        getUUID({serialNumber: "CC"}).then(dastas =>{
                            if(dastas.status == 200){
                                data.contractSerialNumber = dastas.data;
                                insertContractDetail(data).then(res =>{
                                    if(res.status == 200){
                                        this.$router.push({path: '/ordermm/contract'});
                                        if(res.message == 1){
                                            this.$message.success("合同签订成功！！当前订单款未清，请及时录入收款");
                                        }
                                        this.signedwatch = false;
                                    }else{
                                        this.$message.error(res.message || "操作失败！请联系系统管理员");
                                    }
                                    this.loadingbtn = false;
                                }).catch(error =>{
                                    this.loadingbtn = false;
                                    console.log('订单管理:合同列表 order/contract/index.vue', error);
                                })
                            }
                        }).catch(error =>{
                            this.loadingbtn = false;
                            console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                        })
                    }
                })
            }
        },
        signconfun(){
            this.signconfals = false;
        },
        // 选择商品
        checkshop(){
            this.productDialog2 = true;
        },
        currentChange(val) {
            this.currentPage = val;
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        // 预算清单弹窗页数改变
        budgetcurrentChange(val) {
            this.budgetcurrentPage = val;
            this.selefun()
        },
        budgetsizeChange(val) {
            this.budgetcurrentPage = 1;
            this.budgetpageSize = val;
            this.selefun()
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
        },
        sjhandleSelectionChange(val){
            this.sjtableSelectList = val;
        },
        zyhandleSelectionChange(val){
            this.zytableSelectList = val;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        }
    }
}
</script>
<style lang="scss">
.signcontract{
    width:100%;
    // padding-bottom: 80px;
    position: relative;
    padding-bottom: 56px;
    .btn_box{
        // width: 100%;
        // background: #fff;
        // // text-align: right;
        // position: fixed;
        // bottom: 0px;
        // right: 0px;
        // display: flex;
        // z-index: 999;
        // justify-content: flex-end;
        // >button{
        //     margin: 5px;
        // }
    }
    .btn_lists{
        width: calc((100vw - 230px));
        height: 40px;
        line-height: 40px;
        background: #6f6f6f;
        color: #ffffff;
        position: fixed;
        bottom: 10px;
        right: 10px;
        border-radius: 5px;
        display: flex;
        justify-content: flex-end;
        z-index: 999;
        img{
            width: 20px;
            height: 20px;
            margin-right: 5px;
        }
        .btn_item{
            height:80%;
            // width: calc((100vw - 230px) / 9);
            cursor:pointer;
            margin-right:20px;
            justify-content: center;
            // border-right: 1px solid #fff;
        }
    }
    .btnlist{
        display: flex;
        flex-wrap: wrap;
        >button{
            margin: 0px 5px;
        }
    }
    .operations{
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: flex-start;
    }
    .classification{
        width: 105px;
        margin: 0 10px;
    }
    .commodity-checkbox span{
        font-size: 14px;
        color: #aeaeae;
    }
    .rooms-heade{
        display: flex;
        align-items: center;
    }
    .rooms-item{
        background: #fcfcfc;
        border: 1px solid #e6e6e6;
    }
    .commodity-checkbox{
        height: 30px;
        padding: 0 10px; 
        border-bottom: 1px solid #e6e6e6; 
    }
    .commodity-title{
        display: flex;
        height:144px;
        padding-top:25px; 
        padding:  24px 10px 20px 10px ;
    }
    .room-checkbox{
        margin-top: 14px;
    }
    .commodity-group{
        flex-flow: wrap;
    }
    .commodity-number{
        width: calc((100% - 44px)/4);
    }
    .commodity-select{
        width: 17%;
    }
    .h-w80{
    width: calc(100% - 88px);
    height: 1px;
    margin: 0 0 25px 44px;
    background: #d9d9d9;    
    }
    .rooms-input{
        padding: 0 54px 0 50px;
        display: flex;
        align-items: center;
    }
    .rooms-color{
        color: #0963b8;
    }
    .rooms-measure{
        width: 8%;
        display: flex;
        align-items: center;
        margin-left: 2%;
    }
    .rooms-calculation{
        width: 16%;
        display: flex;
        align-items: center;
        margin-left:2%; 
    }
    .rooms-size{
        width: 160px;
        text-align: center;
    }
    .mus-left{
        margin-left: calc(6% + 4px);
    }
    .nums-size{
        width: 80px;
    }
    .rooms-remarks{
        display: flex;
        padding: 0 44px 0 54px;
        margin-bottom: 20px;
    }
    .remarks-title{
        width: 60px;
    }
    .titlecals{
        top: 0px;
        margin: 0px 15px;
    }
    .order_table{
        margin-top: 20px;
        width: 100%;
    }
    .titleone{
        color: #169BD5;
        padding: 10px 0px;
    }
    .widban{
        width: 50%;
    }

    .demoforminline{
        margin-top: 10px;
        padding-right: 70px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .el-form-item{
            margin-bottom: 10px;
        }
        >div{
            width: 45%;
            // &:nth-child(odd){
            //     width: 40%
            // }
            // &:nth-child(even){
            //     width: 55%;
            // }
        }
        .widmax{
            width: 100% !important;
        }
    }
    .flexdis{
        display: flex;
        justify-content: space-around;
        
    }
    .jclas{
        justify-content: flex-start;
        >span{
            width: 80px;
            margin-right: 10px;
        }
    }
    .inpdis{
        >span{
            width: 40px;
            text-align: right;
            margin: 0px 10px;
        }
        >div{
            flex: 1;
        }
        .texwidbox{
            width: 80px;
        }
    }
    .texcol{
        color: #53a8ff;
        cursor:pointer;
    }
    .posirkeh{
        // position: relative;
        display: flex;
        align-items: center;
        >div{
            margin-left: 10px;
        }
        .timediffclass{
            min-width: 120px;
            display: flex;
            
        }
        .fontwith{
            font-weight: 550;
            color: #606266;
        }
        .red{
            color: #ff0000;
        }
        .green{
            color: #01b401;
        }
    }
    // .posiakeh{
    //     position: absolute;
    //     right: -20px;
    //     top: 0px;
    // }
    .tabboxclas{
        margin-bottom: 20px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border: 1px solid #EBEEF5;
    }
    .ziyshopclas{
        display: flex;
        justify-content: flex-start;
        div{
            margin: 0px;
        }
    }
    .el-card{
        &+.el-card{
            margin-bottom: 20px;
        }
    }
    .el-input-number .el-input__inner {
        text-align: left;
    }
    .classification{
        width: 105px;
        margin: 0 10px;
    }
}
</style>

