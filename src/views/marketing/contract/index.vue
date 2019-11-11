<template>
    <div class="contract">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="orderlvs">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="head_nav_search">
                        <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" 
                            size="medium" maxlength="50" @keydown.enter.native="searchFun" clearable>
                        </el-input>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker prefix-icon="el-icon-date" size="medium" v-model="searchData" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' range-separator="-"
                            start-placeholder="选择合同签订时间" end-placeholder="选择合同签订时间">
                        </el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="orderStatus" clearable filterable placeholder="选择合同状态" size="medium">
                            <el-option v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select">
                        <el-button @click="searchFun" class="button-fc" type="warning" size="medium" :loading="loadingbtn">查询</el-button>
                        <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="h-width"></div>
            <div class="order-btn-list">
                <el-button size="small" class="button-96" @click="seesigncontra">签合同</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.contract_pushsigncont" @click="signcontractfun">推送电子合同</el-button>
                <!-- <el-button size="small" class="button-96" v-if="btnJurisdiction.contract_printing" @click="invitation">打印</el-button> -->
                <el-button size="small" class="button-96" v-if="btnJurisdiction.contract_sign" @click="signature">合同签署</el-button>
                <el-button size="small" class="button-96" @click="preview">合同预览</el-button>
                <el-button size="small" class="button-96" @click="cancla">作废</el-button>
                <el-button size="small" class="button-96" @click="upplaceorder">上传下单图</el-button>
                <el-button size="small" class="button-96" @click="previewfun">清单预览</el-button>
                 <!-- v-if="btnJurisdiction.contract_cancle" -->
            </div>
            <div class="order_table">
                <el-table border max-height="500" v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" fixed align="center" fixed="left" width="55"></el-table-column>
                    <el-table-column prop="contractState" align="center" label="合同状态" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.contractState == 0">合同待生成</div>
                            <div v-if="scope.row.contractState == 1">待签署</div>
                            <div v-if="scope.row.contractState == 2">合同生效</div>
                            <div v-if="scope.row.contractState == 3">合同作废</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="settlementStatus" align="center" label="款清状态" width="100">
                        <template slot-scope="scope">
                            <p v-if="scope.row.settlementStatus == 1">款未清</p>
                            <p v-else-if="scope.row.settlementStatus == 2">收费款清</p>
                            <p v-else-if="scope.row.settlementStatus == 3">财务款清</p>
                            <p v-else-if="scope.row.settlementStatus == 4">家装款清</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractSerialNumber" align="center" label="合同编号" width="130" sortable>
                        <template slot-scope="scope">
                            <div><el-button type="text" @click="signcontra(scope.row)">{{scope.row.contractSerialNumber}}</el-button></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customerName" align="center" label="客户姓名" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="客户电话" width="130"></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="existContractMoneyRemark" align="center" label="合同金额备注" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.existContractMoneyRemark == 1">是</div>
                            <div v-if="scope.row.existContractMoneyRemark == 0">否</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="existPlaceOrderAccessory" align="center" label="上传下单图" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.existPlaceOrderAccessory == 1">是</div>
                            <div v-if="scope.row.existPlaceOrderAccessory == 0">否</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="signingMode" align="center" label="合同签订方式" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.signingMode == 1">公众号</div>
                            <div v-if="scope.row.signingMode == 2">销售代签</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="signingTime" align="center" label="签合同日期" width="160"></el-table-column>
                    <el-table-column prop="signingName" align="center" label="签订操作人" width="100"></el-table-column>
                    <el-table-column prop="contractMoney" align="center" label="合同金额" width="120"></el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="订单编号" width="130">
                        <template slot-scope="scope">
                            <div><el-button type="text" @click="orderdetils(scope.row)">{{scope.row.orderNumber}}</el-button></div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="signingTime" align="center" label="下单时间" width="160"></el-table-column> -->
                    <el-table-column prop="cancelTime" align="center" label="作废时间" width="160"></el-table-column>
                    <el-table-column prop="cancelName" align="center" label="作废操作人" width="100"></el-table-column>
                    <el-table-column prop="orderType" align="center" label="订单类型" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderGoodsType" align="center" label="订单货品类型" width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderGoodsType == 1">成品</div>
                            <div v-if="scope.row.orderGoodsType == 2">定制</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isTogetherOrder" align="center" label="是否合作订单" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="brandName" align="center" label="品牌" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="categoryName" align="center" label="品类" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="salesmanName" align="center" label="销售员" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessName" align="center" label="业务员" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorName" align="center" label="测量员" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="备用电话" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" label="所属网点" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                </el-table>
                <ul class="priceclass">
                    <li>合同合计金额： {{contractMoney | fenge}}</li>
                </ul>
            </div>
            <div class="pagination_wrap">
                <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    @size-change="handleSizeChange" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog :visible.sync="visibleDialog" width="960px" title="附件管理" class="customDialogTitle" :before-close="accessoryclose">
            <accessory v-if="visibleDialog" :orderId="orderId" :btns="btns" 
                :btnswatch="btnswatch" :accessoryTypes="accessoryTypes">
            </accessory>
        </el-dialog>

        <!-- 弹框页面 -->
        <ordercomponent 
            v-if="centerDialogVisible" 
            :centerDialogVisible="centerDialogVisible" 
            @orderclosefun="orderclosefun">
        </ordercomponent>
        <!-- 清单预览弹框组件 -->
        <shoppreview :shoppreVisible="shoppreVisible" v-if="shoppreVisible" :orderId="orderId" @previewclosefun="previewclosefun"></shoppreview>

    </div>
</template>
<script>
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
import breadcrumb from "@/views/components/breadcrumb";
import shoppreview from "@/views/components/shoppreview";//清单预览弹框组件
import ordercomponent from "@/views/components/ordercomponent";
import { listCustomerContract, signContract, invalidContract, getPreviewContract } from 'api/order/contract/contract';

export default {
    components: {
        breadcrumb,
        shoppreview,
        ordercomponent,
        accessory,
    },
    data(){
        return {
            shoppreVisible: false,
            btns: [],
            btnswatch: false,//上传按钮开关
            accessoryTypes: 1,
            loadingbtn: false,
            visibleDialog: false,
            fromdatas: {
                housingTypeId: 1,
            },
            loading: true,
            checked: false,
            navList: [],
            labelPosition: 'right',
            typeList: [],
            names: '', // 条件搜索
            searchData: [],// 时间搜索
            changedata: "",
            orderStatus: "", // 状态搜索
            centerDialogVisible: false,
            stateList: [
                {dictName: "合同待生成", id: "0"},
                {dictName: "待签署", id: "1"},
                {dictName: "合同生效", id: "2"},
                {dictName: "合同作废", id: "3"},
            ],  // 状态条件
            commodityCategoryId: [], // 类别搜索
            tableData:[],
            tableSelectList: [],
            isShow: false,
            total: 0,    // 总数
            pageSize: 20,  // 单页条数
            currentPage: 1, // 当前页
            switchSalesperson: "",
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
        }
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
            return (val*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
    },
    computed: {
        // 合同金额总和
        contractMoney(){
            let num = 0
            this.tableData.forEach(item =>{
                num+=Number(item.contractMoney)
            })
            return num
        },
    },
    activated(){
        this.navList=this.$route.meta;
        // let start = new Date()
        // start.setTime(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1))
        // this.searchData[0] = start
        // this.searchData[1] = new Date((new Date).getTime() + 24*60*60*1000)
        
        this.orderdatafun();
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     // 头部面包屑
    //     this.navList=this.$route.meta;
    // },
    // created() {
    //     let start = new Date()
    //     start.setTime(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1))
    //     this.searchData[0] = start
    //     this.searchData[1] = new Date((new Date).getTime() + 24*60*60*1000)
    //     this.orderdatafun();
    // },
    methods: {
        previewfun(){
            if(this.warnMessage()){
                let selectdata = this.tableSelectList[0]
                if(selectdata.contractState == 3){
                    this.$message.warning("合同作废！！不可操作");
                    return
                }
                this.orderId = selectdata.orderId
                this.shoppreVisible = true;
                // if(selectdata.contractState == 1 || selectdata.contractState == 2){
                // }else{
                //     this.$message.warning("待签署和生效的合同才可以预览");
                // }
            }
        },
        previewclosefun(){
            this.shoppreVisible = false;
        },
        orderdetils(val){
            this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId}})
        },
        orderclosefun(val){
            this.centerDialogVisible = false;
            if(val && val.length > 0){
                console.log(val)
            }
        },
        warnMessage() {
            if(this.tableSelectList.length > 1){
                this.$message.warning("只能选择一个订单");
                return false;
            } else if (this.tableSelectList.length < 1){
                this.$message.warning("请选择订单");
                return false;
            }
            return true;
        },
        // 签合同
        seesigncontra(){
            if(this.warnMessage()){
                let val = this.tableSelectList[0]
                if(val.contractState == 3){
                    this.$message.warning("改合同已作废，不可签订！");
                    return
                }
                let orderId = val.orderId;
                let orderGoodsType = val.orderGoodsType;
                let brandId = val.brandId;
                let commodityCategoryId = val.commodityCategoryId;
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
            }
        },
        signcontra(val){
            let orderId = val.orderId;
            if(val.contractState == 3){
                this.$message.warning("改合同已作废，不可签订！");
                return
            }
            let orderGoodsType = val.orderGoodsType;
            let brandId = val.brandId;
            let commodityCategoryId = val.commodityCategoryId;
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
        },
        // 推送电子合同
        signcontractfun(){
            // if(this.warnMessage()){
            //     let orderId = this.tableSelectList[0].orderId;
            //     this.$router.push({path: "/ordermm/signcontract",query:{orderId: orderId}})
            // }
        },
        invitation(){
            this.centerDialogVisible = true;
        },
        // 上传附件关闭
        accessoryclose(){
            this.visibleDialog = false;
            this.orderdatafun();
        },
        upplaceorder(){ // 上传下单图
            if(this.warnMessage()){
                if(this.tableSelectList[0].contractState == 3){
                    this.$message.warning("合同已作废，不可操作！！");
                    return
                }
                this.visibleDialog = true
                this.orderId = this.tableSelectList[0].orderId
                this.accessoryTypes = 6
                this.btns = [6];
                this.btnswatch = true;
            }
        },
        // 合同预览
        preview(){
            if(this.warnMessage()){
                let customerdata = this.tableSelectList[0];
                let data = {
                    orderId: customerdata.orderId,
                    customerContractId: customerdata.customerContractId,
                }
                getPreviewContract(data).then(res =>{
                    if(res.status == 200){
                        window.open("https://fanhuayiju.oss-cn-beijing.aliyuncs.com/"+ res.data)
                    }else{
                        this.$message.warning(res.message);
                    }
                }).catch(error =>{
                    console.log('订单管理:合同预览 order/contract/index.vue', error);
                })
            }
        },
        cancla(){
            if(this.warnMessage()){
                let data = {
                    customerContractId: this.tableSelectList[0].customerContractId,
                    orderId: this.tableSelectList[0].orderId
                }
                if(this.tableSelectList[0].contractState == 3){
                    this.$message.warning("合同已作废，不可再作废！！");
                    return
                }
                invalidContract(data).then(res =>{
                    if(res.status == 200){
                        this.$message.success("作废成功！！！");
                        this.orderdatafun();
                    }else{
                        this.$message.warning(res.message);
                    }
                }).catch(error =>{
                    console.log('订单管理:合同列表 作废 order/contract/index.vue', error);
                })
            }
        },
        signature(){
            if(this.warnMessage()){
                let data = {
                    customerContractId: this.tableSelectList[0].customerContractId,
                    orderId: this.tableSelectList[0].orderId
                }
                signContract(data).then(res =>{
                    if(res.status == 200){
                        if(this.tableSelectList[0].contractState == 1){
                            this.$message.success(res.data);
                            this.orderdatafun();
                        }else{
                            this.$message.warning(res.data+"！，不可签署");
                        }
                    }else{
                        this.$message.warning(res.data);
                    }
                }).catch(error =>{
                    console.log('订单管理:合同列表 order/contract/index.vue', error);
                })
            }
        },
        orderdatafun(){
            this.loading = true;
            if(this.searchData == null){
                this.searchData = []
            }
            let data = {
                searchText: this.names,
                signingTimeStart: this.searchData[0],
                signingTimeEnd: this.searchData[1],
                contractState: this.orderStatus,
                page: this.currentPage,
                limit: this.pageSize,
            };
            listCustomerContract(data).then(res =>{
                console.log(res);
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.loading = false;
                    this.loadingbtn = false;
                }
            }).catch(error =>{
                this.loading = false;
                this.loadingbtn = false;
                console.log('订单管理:合同列表 order/contract/index.vue', error);
            })
        },
        searchFun(){//搜索
            this.loadingbtn = true;
            this.currentPage = 1;
            this.orderdatafun();
        },
        resetFun(){// 重置
            this.names= '';// 
            this.searchData = [];// 
            this.orderStatus = "";// 
            this.searchFun()
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList,"tableSelectList1234");
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 表格行样式
        tableRowStyle({row, rowIndex}){
            // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
        },
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            this.orderdatafun();
        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            this.orderdatafun();
        }
    }
}
</script>
<style scoped lang="scss">
.contract{
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
    .order_title{
        border-bottom: 1px solid #d9d9d9;
    }
    .warp_head_list{
        flex-wrap: wrap;
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
        background-size: 15px 15px;
    }
    .el-range-separator{
        color: #bfbfbf;
    }
    .list_top,.list_bottom{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        >div{
            margin: 10px 0px;
            padding: 0px 5px;
            width: 25%;
            >div{
                width: 100%;
            }
        }
        .fontMore{
            color:#d0cfcf;
        }
        .btnone{
            margin-left: 10px;
        }
        .head_nav_btn{
            width: 100%;
            text-align: center;
            .fontMore{
                color:#d0cfcf;
            }
            .btnone{
                margin-left: 10px;
            }
        }
    }
    .head_nav_datapick{
        width: 100%;
    }
    .list_bottom{
        margin-top: 20px;
    }
    .head_nav_search{
        width: 400px;
    }
    .head_nav_select{
        width: 170px;
        margin: 5px;
    }
    .reset_btn{
        background: none;
        color: #f2c27b;
        border: 1px solid #f2c27b;
    }
    .order-btn-list .blue{
        background: #96bdde;
        color: #fff;
        width: 100px;
        padding-left: 0;
        padding-right: 0;
    }
    .order_table{
        margin-top: 10px;
        width: 100%;
    }
    .order_table .el-tooltip{
        text-align: center;
    }
    .order_table .cell{
        text-align: center;
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
    .el-tag--aa{
        color: #000;
        text-align: center;
        width: unset;
        height: 32px;
        line-height: 30px;
        font-size: 12px;
        border-radius: 0;
        box-sizing: border-box;
        border: unset;
        white-space: nowrap;
        margin: 0;
        padding: 0;
        background: none;
        position: absolute;
        transform: translate(0px,-16px);
    }
    .el-tag--bb{
        color: #e1a6ac;
        text-align: center;
        width: 32px;
        height: 32px;
        line-height: 30px;
        font-size: 12px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 1px solid rgba(64,158,255,.2);
        border-color: #e1a6ac;
        white-space: nowrap;
        margin: 0;
        padding: 0;
        background: none;
        position: absolute;
        transform: translate(-16px,-16px)
    }
    .pagination_wrap .btn-prev{
        background: #efefef;
    }
    .pagination_wrap .el-pagination .btn-next,
    .pagination_wrap .el-pagination .btn-prev{
        background: #efefef;
    }
    .pagination_wrap .el-pager li{
        background: #efefef;
        margin: 0 5px;
        border-radius: 4px;
    }
    .pagination_wrap .el-pager li.active{
        background: #96bdde;
        color: #fff;
    }
}
</style>