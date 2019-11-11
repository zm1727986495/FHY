<template>
    <div class="addabandonorder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <orderdetail></orderdetail>
        <el-card>
            <!-- <el-radio-group v-model="radio" :disabled="orderType ? true : false">
                <el-radio :label="1">遗留单</el-radio>
                <el-radio :label="2">补货单</el-radio>
            </el-radio-group> -->
            <el-form :inline="true" class="demo_form_inline">
                <el-form-item label="判责" v-if="setdata">
                    <el-input v-model="sentencedRoleName" disabled size="medium"></el-input>
                </el-form-item>
                <el-form-item label="判责" v-else>
                    <el-select v-model="sentencedRoleId" multiple placeholder="请选择责任人" size="medium" clearable filterable>
                        <el-option v-for="item in responsibilitylist" :key="item.value" :label="item.dictName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下单员判责" v-if="setdata">
                    <el-select v-model="sentencedRoleId2" multiple placeholder="请选择责任人" size="medium" clearable filterable>
                        <el-option v-for="item in responsibilitylist" :key="item.value" :label="item.dictName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div v-if="!setdata">
                <el-button type="primary" size="mini" @click="addTab(editableTabsValue)">下单</el-button>

                <el-table border ref="multipleTable" class="martop" :row-style="tableBodycolor" :row-class-name="tableRowClassName" 
                    @selection-change="handleSelectionChange" :data="purchasingdata" style="width: 100%;">
                    <el-table-column type="selection" width="40" align="center" fixed="left"></el-table-column>
                    <el-table-column prop="purchaseNumber" align="center" label="采购单号" width="150" sortable fixed="left"></el-table-column> 
                    <el-table-column prop="purchaseContractCode" align="center" label="合同号" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="brandName" align="center" label="品牌" width="80"></el-table-column>
                    <el-table-column prop="categoryName" align="center" label="品类" width="90" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="companyName" align="center" label="供应商" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="roomName" align="center" label="房间名称" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="purchaseStatus" align="center" label="是否下单完成" width="110">
                        <template slot-scope="scope">
                            <div>
                                <p v-if="scope.row.purchaseStatus==1">否</p>
                                <p v-if="scope.row.purchaseStatus==2">是</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchaseAt" align="center" label="下单人" width="80" ></el-table-column>
                    <el-table-column prop="purchaseTime" align="center" label="下单完成时间" width="160"></el-table-column>
                </el-table>
            </div>
            <div v-if="editableTabs.length">
                <div class="titlecals martop">商品列表</div>
                <el-tabs v-model="editableTabsValue" type="border-card" @tab-click="handleClick" :closable="!setdata" @tab-remove="removeTab" class="martop">
                    <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.purchaseNumber" :name="item.name">
                        <el-form :label-position="labelPosition" label-width="100px" class="from_class">
                            <el-form-item label="采购单号">
                                <el-input v-model="item.purchaseNumber" :disabled="!setdata" size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="采购合同号">
                                <!-- <el-input v-model="item.purchaseNumber" :disabled="!setdata" size="medium"></el-input> -->
                                <div>{{item.purchaseContractCode}}</div>
                            </el-form-item>
                            <el-form-item label="采购单金额" v-if="setdata">
                                <div class="priceclass">{{item.price}}</div>
                            </el-form-item>
                        </el-form>
                        <!-- <div v-if="setdata">
                            <el-table border :row-class-name="tableRowClassName" :data="item.purchaseOrderCommodityVOList" style="width: 100%;">
                                <el-table-column type="index" width="55" fixed="left" align="center"></el-table-column>
                                <el-table-column  width="150" prop="commodityCode" label="商品编码" sortable align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column width="180" prop="commodityName" label="名称" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column width="80" prop="brandName" label="品牌" align="center"></el-table-column>
                                <el-table-column width="80" prop="categoryName" label="品类" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column width="110" prop="costPrice" label="成本单价" align="center"></el-table-column>
                                <el-table-column width="110" prop="purchaseAmount" label="采购金额" align="center"></el-table-column>
                                <el-table-column width="130" prop="commodityModel" label="型号" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column width="180" prop="seriesName" label="系列" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column width="180" prop="materialName" label="材质" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column width="180" prop="colourName" label="颜色" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column width="120" prop="commodityUnit" label="单位" align="center"></el-table-column>
                                <el-table-column width="80" prop="width" label="宽" align="center"></el-table-column>
                                <el-table-column width="80" prop="high" label="高" align="center"></el-table-column>
                                <el-table-column width="80" prop="deep" label="深" align="center"></el-table-column>
                                <el-table-column width="80" prop="thick" label="厚" align="center"></el-table-column>
                                <el-table-column width="80" prop="amount" label="数量" align="center"></el-table-column>
                            </el-table>
                        </div>
                        <div v-else> -->
                            <stockTable :ref="item.stockTable" :purchaseOrderCommodityVOList='item.purchaseOrderCommodityVOList' @getprice="getprice"></stockTable>
                        <!-- </div> -->
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="tapbox">
                <div></div>
                <div v-if="orderType">
                    <el-button type="primary" size="medium" @click="submitbandonorder(3)">提交</el-button>
                </div>
                <div v-else>
                    <el-button type="primary" size="medium" @click="submitbandonorder(0)">保存</el-button>
                    <el-button type="primary" size="medium" @click="submitbandonorder(1)">提交</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "../components/orderdetail";
import stockTable from "./components/stockTable";
import { 
    addLegacyOfSingleOrder,
    placeOrder, 
    listBaseDict,
    getCustomerContractInfo, 
    listPurchaseOrder, 
    getLegacyOfSingleOrderInfo,
    getPurchaseOrder
} from 'api/order/order/order';
import { getUUID } from "api/pulicJava";

export default {
    components: {
        breadcrumb,
        orderdetail,
        stockTable,
    },
    data() {
        return {
            sentencedRoleName: "",
            navList: [],
            datas: [],
            sentencedRoleId: [],
            sentencedRoleId2: [],
            responsibilitylist: [],
            labelPosition: 'right',
            purchasingdata: [],
            selections: [],
            radio: 1,
            setdata: false,
            orderType: this.$route.query.orderType,
            orderId: this.$route.query.orderId,
            editableTabsValue: '1',
            editableTabs: [
                // {
                //     title: '采购单' + newTabName,
                //     name: newTabName,
                //     purchaseNumber: item.purchaseNumber,//采购单号
                //     price: 0,//价格
                //     stockTable: "stockTable" + newTabName,//商品组件ref
                // }
            ],
            purchaseList:[],//采购单明细列表
            tabIndex: ""
        }
    },
    mounted() {
        this.tabIndex = this.editableTabs.length
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    created() {

        listBaseDict({dataType: "BLAME_OTHERS"}).then(res =>{
            if(res.status == 200){
                console.log(res,"判责人");
                this.responsibilitylist = res.data
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询房屋总面积 order/components/demandassembly.vue', error);
        })

        // if(this.orderType == 972){
        //     this.radio = 2
        // }else{
        //     this.radio = 1
        // }
        let data = {
            orderId: this.orderId
        }
        if(this.$route.query.orderType) { // 查看备货申请 修改备货申请
            this.setdata = true;
            this.getStockUpApply(data); // 回显信息
        }else{
            this.setdata = false;
        }
        //查询客户合同号
        getCustomerContractInfo(data).then(res => {
            if(res.status == 200) {
                let plsedata = {
                    customerContractId: res.data.comtractId,
                    billType: 1,
                }
                // 正单下的采购单
                listPurchaseOrder(plsedata).then(res => {
                    console.log(res,"正单下的采购单");
                    if(res.status == 200) {
                        this.purchasingdata = res.data
                    }
                }).catch(err => {
                    console.error('修改遗留补货单 views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
                })
            }
        }).catch(err => {
            console.error('查询客户合同号  views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
        })
    },
    methods: {
        getStockUpApply(data){
            getLegacyOfSingleOrderInfo(data).then(res => {
                console.log(res);
                if(res.status == 200) {
                    // this.sentencedRoleName = res.data.sentencedRoleName;
                    let plesedata = res.data;
                    let str=''
                    plesedata.forEach((val, idx) =>{
                        str+=val.sentencedRoleName+',';
                        this.sentencedRoleId2.push(val.sentencedRoleId)
                        let arr = [];
                        val.relLegacyOrderPurchaseOrderVOList.forEach((item,index)=>{
                            let newTabName = index+1;
                            let obj = {
                                title: '采购单' + newTabName,
                                name: newTabName+"",
                                purchaseNumber: item.purchaseNumber,//采购单号
                                price: item.settlementMoney,//价格
                                stockTable: "stockTable" + newTabName,//商品组件ref
                                purchaseOrderId: item.purchaseOrderId,//采购单号id
                                purchaseContractCode:item.purchaseContractCode,//采购合同号
                                purchaseOrderCommodityVOList: item.purchaseOrderCommodityVOList
                            }
                            arr.push(obj)
                        })
                        this.editableTabs = arr;
                    })
                    this.$nextTick(()=>{
                        this.handleClick()
                    })
                    this.sentencedRoleName = str;
                }
            }).catch(err => {
                console.error('修改遗留补货单回显 views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
            })
        },
        // 计算价格
        getprice(val){
            console.log(val,'==========');
            
            this.editableTabs.forEach(item =>{
                if(item.name == this.editableTabsValue){
                    item.price = val
                }
            })
        },
        //tabsClick
        handleClick(){
            let index = parseFloat(this.editableTabsValue)-1;
            let {stockTable,purchaseOrderId} = this.editableTabs[index];
            if(this.$refs[stockTable]){
                this.$refs[stockTable][0].getData(purchaseOrderId,index);
            }
        },
        // 下单按钮
        addTab(targetName) {
            this.editableTabs = []
            this.tabIndex = 0
            let seledata = this.selections;
            if(seledata.length < 1){
                this.$message.warning("请选择采购单");
                return false
            }
            seledata.forEach((item, index) =>{
                ++this.tabIndex
                let newTabName = this.tabIndex+''
                this.editableTabs.push({
                    // title: '采购单' + newTabName,
                    title: '采购单号',
                    name: newTabName,
                    purchaseNumber: item.purchaseNumber,//采购单号
                    price: 0,//价格
                    stockTable: "stockTable" + newTabName,//商品组件ref
                    purchaseContractCode:item.purchaseContractCode,//采购合同号
                    purchaseOrderId:item.purchaseOrderId
                });
                this.editableTabsValue = '1';
            })
            this.$nextTick(() => {
                let {stockTable,purchaseOrderId} = this.editableTabs[0];
                this.$refs[stockTable][0].getData(purchaseOrderId,0); 
            })


        },
        // 删除采购单
        removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }
            this.editableTabsValue = activeName;   
            this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        },
        // 验证
        testing(){
            let yan = this.editableTabs.some(itms =>{
                let stockdata = this.$refs[itms.stockTable][0].tabList
                return stockdata.length == 0
            })
            if(yan){
                this.$message.warning("请选择商品");
                return false;
            }
            if(this.editableTabs.length == 0){
                this.$message.warning("请选择采购单");
                return false;
            }
            let xilie = this.editableTabs.some(itms =>{
                let stockdata = this.$refs[itms.stockTable][0].tabList
                let flag = stockdata.every(item => {
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
                return !flag
            })
            if(xilie) { // 每一个商品的材质颜色系列有可选项并且选中了
                this.$message.warning("请添加商品的材质颜色系列");
                return false;
            }
            return true
        },
        // 保存新增修改
        submitbandonorder(val){
            console.log(this.sentencedRoleId);
            // 修改
            if(val == 3){
                if(this.sentencedRoleId2.length == 0){
                    this.$message.warning("请选择下单员判责");
                    return false;
                }
                let pleasedata = {
                    orderId: this.$route.query.orderId,
                    orderType: this.$route.query.orderType,
                    purchaseOrderDTOList: [],
                    orderSentencedRole: [],
                }
                this.sentencedRoleId2.forEach(item =>{
                    pleasedata.orderSentencedRole.push({
                        sentencedRoleId: item,//判责角色
                        sentencedRoleType: 2,//判责类型 1判责  2下单员判责
                    })
                })
                this.editableTabs.forEach(item =>{
                    let obj = {
                        purchaseNumber: item.purchaseNumber,//采购单号
                        purchaseOrderId: item.purchaseOrderId,//采购单号id
                    }
                    pleasedata.purchaseOrderDTOList.push(obj)
                })
                placeOrder(pleasedata).then(res => {
                    if(res.status == 200) {
                        this.$message.success("下单成功");
                        this.$router.push({path: "/Installation/abandonorder"})
                        return false;
                    }else{
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    console.log('修改遗留补货单 views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
                })
            }else{
                if(this.sentencedRoleId.length == 0){
                    this.$message.warning("请选择责任人");
                    return false;
                }
                if(!this.testing()){
                    return false
                }
                let data = {
                    orderId: this.$route.query.orderId,
                    isSubmit: val,
                    orderSentencedRole: [],
                    purchaseOrderDTOList: []
                }
                this.sentencedRoleId.forEach(item =>{
                    data.orderSentencedRole.push({
                        sentencedRoleId: item,//判责角色
                        sentencedRoleType: 1,//判责类型 1判责  2下单员判责
                    })
                })
                let purchaseOrderDTOList = [];
                let yan = this.editableTabs.forEach(itms =>{
                    let objs = {
                        purchaseNumber: itms.purchaseNumber,//采购单号
                        settlementMoney: itms.price,//采购单号
                        purchaseOrderCommodities: [],
                    }
                    let stockdata = this.$refs[itms.stockTable][0].tabList
                    stockdata.forEach(item =>{
                        let obj = {}
                        obj.commodityId = item.commodityId;//商品Id
                        obj.width = item.commodityWide;//宽
                        obj.high = item.commodityHigh;//高
                        obj.deep = item.commodityLong;//深
                        obj.thick = item.commodityThick;//厚
                        obj.colourId = item.commodityColourId;//颜色id
                        obj.seriesId = item.commoditySeriesId;//系列Id
                        obj.materialId = item.commodityMaterialId;//材质Id
                        obj.amount = item.purchaseNumber;//数量
                        obj.commodityNumber = item.commodityNumber;//数量
                        obj.commoditySkuId = item.commoditySkuId;//商品skuID
                        objs.purchaseOrderCommodities.push(obj)
                    })
                    data.purchaseOrderDTOList.push(objs)
                })
                console.log(data);
                //新增遗留单补货单
                // radio 1:遗留单 2：补货单
                if(this.radio == 1){
                    getUUID({serialNumber: "LS"}).then(dastas =>{
                        if(dastas.status == 200){
                            data.orderNumber = dastas.data
                            data.orderType = 453
                            addLegacyOfSingleOrder(data).then(res => {
                                if(res.status == 200) {
                                    this.$message.success("新增遗留单成功");
                                    this.$router.push({path: "/Installation/abandonorder"})
                                }
                            }).catch(err => {
                                console.log('新增遗留单 views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
                            })
                        }
                    }).catch(error =>{
                        console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                    })
                }else if(this.radio == 2){
                    getUUID({serialNumber: "RO"}).then(dastas =>{
                        if(dastas.status == 200){
                            data.orderNumber = dastas.data
                            data.orderType = 972
                            addLegacyOfSingleOrder(data).then(res => {
                                if(res.status == 200) {
                                    this.$message.success("新增补货单成功");
                                    this.$router.push({path: "/Installation/abandonorder"})
                                }
                            }).catch(err => {
                                console.log('新增遗留单 views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
                            })
                        }
                    }).catch(error =>{
                        console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                    })
                }
            }

        },
        //勾选函数回调
        handleSelectionChange(val){
           this.selections = val;
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    }
}
</script>
<style lang="scss" scoped>
    .addabandonorder{
        .titlecals{
            top: 0;
        }
        .martop{
            margin-top: 20px;
        }
        .tapbox{
            padding: 20px;
            // border: 1px solid #e4e4e4;
            border-radius: 2px;
            display: flex;
            justify-content: space-between;
        }
        .from_class{
            display: flex;
            justify-content: space-between;
            >div{
                width: 45%;
            }
            .priceclass{
                margin-top:0;
                font-size: 17px;
                color: red;
            }
           
        }
        .demo_form_inline{
            margin-top: 10px;
            >div{
                margin-bottom: 10px;
            }
        }
    }
</style>
<style lang="scss">
.addabandonorder{
    .from_class{
        .el-form-item{
            margin-bottom:0;
        }
    }
}
</style>