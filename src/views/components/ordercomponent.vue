<template>
    <div class="ordercomponent">
        <!-- 查询条件组 -->
        <el-dialog  title="选择订单"  custom-class="customDialogTitle" :visible.sync="centerDialogVisible" width="80%" :before-close="closefun" top="5vh">
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="head_nav_search">
                        <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50"  @keydown.enter.native="searchfun"></el-input>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker
                            size="medium" v-model="searchData" type="datetimerange" value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-" start-placeholder="选择创建订单时间" end-placeholder="选择创建订单时间">
                        </el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="orderStatus" multiple placeholder="选择状态" size="medium" clearable filterable>
                            <el-option v-for="item in stateList" :key="item.value" :label="item.dictName" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="storeId" placeholder="选择门店" clearable size="medium" filterable>
                          <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_datapick btns_center">
                        <el-button class="button-fc" type="warning" size="medium"  @click="searchFun">查询</el-button>
                        <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="order_table">
                <el-table border :row-key="getRowKeys"
                    ref="multipleTable" :data="tableData" tooltip-effect="dark" max-height="400"
                    :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="55" :reserve-selection="true" fixed="left"></el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="订单号" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatusName" align="center" label="订单状态" width="130" show-overflow-tooltip></el-table-column>
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
                    <el-table-column prop="customerName" align="center" label="客户名称" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="客户电话" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="brandName" align="center" label="产品品牌" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="categoryName" align="center" label="品类" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderGoodsType" align="center" label="货品类型" width="100" show-overflow-tooltip>
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
                    <el-table-column prop="reportedTypeName" align="center" label="报备类型" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="salesmanName" align="center" label="销售员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessName" align="center" label="业务员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorName" align="center" label="测量员" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderSourceName" align="center" label="订单来源" width="130" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorAssignedTime" align="center" label="指派测量时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerAssignedTime" align="center" label="指派设计时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap orderPagination">
                <el-pagination
                  background
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-size="pageSize"
                   @size-change="handleSizeChange"
                   layout="prev, next"
                   prev-text="上一页"
                   next-text="下一页">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminbtn">确 定</el-button>
                <el-button @click="closefun">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import pagination from './pagination';
import { 
    listOrder, 
    listBaseDict,
} from 'api/order/order/order';
import {
    listOrderByHome, // 家装代收合同订单列表
} from 'api/administrationCenter/decorationpermit/index'; // 家装代收合同申请
import {
    listOrderTransfer, // 订单列表2
    listOrderContract, // 退款订单列表(type = 1) / 工期加急 / 开票申请 / 折扣申请
    listOrderCollect
} from 'api/marketing/refundpermit/index';
import {
    listBlitem, // 盘点的订单列表
} from "api/entrepotSet/duty/index";
import { listLoginUserStore } from '@/api/pulicJava';
export default {
    components: {
        pagination,
    },
    data() {
        return {
            storeList: [],
            names: "",
            searchData: [],
            orderStatus: [],
            storeId: '',
            tableData:[],
            stateList: [],
            total: 0,    // 总数
            pageSize: 20,  // 单页条数
            currentPage: 1, // 当前页
            tableSelectList: []
        };
    },
    // props: ["centerDialogVisible"],
    props: {
        applyType: {
            type: String,
            default() {
                return ""
            }
        },
        centerDialogVisible: {
            type: Boolean,
        },
        orderId: {
            default() {
                return ''
            }
        },
        orderRefund: {
            default() {
                return ''
            }
        },
        refundType: {
            type: String,
        },
    },
    filters: {
        // 千分号过滤方法
        // fenge(val){
        //     return (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',')
        // }
        fenge(amount) {
            const validateNumber = n =>
                !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;

            if (!validateNumber(+amount)) {
                return amount;
            }
            return (+amount)
                .toFixed(2)
                .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
        }

    },
    created() {
        // let data = {
        //     page: this.currentPage,
        //     limit: this.pageSize,
        // };
        // this.orderdatafun(data);
        
        //获取订单状态
        let datasa={
            dataType: "ORDER_STATUS"
        };
        listBaseDict(datasa).then(res =>{
            if(res.status == 200){
                this.stateList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询获取订单状态 order/justOrder/addJustOrder.vue', error);
        })
        // 获取门店列表以及门店默认选中
        this.storeList = JSON.parse(this.$loca.getItem('Store'))
        let storeids = JSON.parse(this.$loca.getItem('activeStoreId'))
        if(storeids && storeids.storeId){
            // this.getstorfun(storeids.storeId)//根据门店获取相关回显
            this.storeId = storeids.storeId
        }
    },
    mounted() {
        new Promise((resolve, reject) => {
            let data = {
                page: this.currentPage,
                limit: this.pageSize
            };
            if(this.applyType == "8") {   // 家装代收合同申请列表 
                listOrderByHome(data).then(res =>{
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('家装代收合同管理: 订单弹框列表 家装代收合同订单列表 components/ordercomponent.vue', error);
                })
            }else if(this.applyType == "4") { // 退款申请
                listOrderCollect(data).then(res =>{
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "3") { // 开票申请
                data.invoice = 1;
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 开票申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "1") { // 工期加急申请
                data.delay = 1;
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "2") { // 返点
                // data.invoice = 1;
                data.referrer = 1;
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 返点申请 order/order/order.vue', error);
                })
            }else if(this.refundType == "2") { // 退款申请的订单列表2
                data.orderId = this.orderRefund;
                listOrderTransfer(data).then(res =>{ 
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 退款申请列表2 order/order/order.vue', error);
                })
            }else if( this.$route.path == "/regoodspermit/addapplication" ){ // 退货管理 新增退货
                data.charge = 1;//拆单之后的
                data.addSingle = 1;//不包含订单作废的
                data.guestAddSingle = 1;//正单和客增单
                data.isChargeOrderList = 1;//是退货列表
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 order/order/order.vue', error);
                })
            }else {
                data.orderType = 451;
                if(this.$route.path == "/ordermm/customerorder"){
                    data.addSingle = 1
                }
                let start = new Date()
                start.setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
                data.createTimeStart = start
                data.createTimeEnd = new Date((new Date).getTime() + 24*60*60*1000)
                this.searchData[0] = start
                this.searchData[1] = new Date((new Date).getTime() + 24*60*60*1000)
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{ // 普通订单
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 order/order/order.vue', error);
                })
            }
        }).then((res)=>{
            if(this.orderId) {
                this.$nextTick(() => {
                    if(this.orderId) {
                        // 如果已经选择orderId那么这个组件再次被打开 该条就会被选中
                        res.forEach(item => {
                            if(item.orderId == this.orderId) {
                                this.$refs.multipleTable.toggleRowSelection(item);
                            }
                        })
                    }
                });
            }
        });
    },
    methods: {
        getRowKeys(row) {
            return row.orderId;
        },
        // 获取全部门店
        getStoreList() {
          listLoginUserStore()
            .then(response => {
              this.storeList = response.data;
            })
            .catch(error => {
              console.log('获取带单列表views/order/tapesheet/index:getStoreList' + error);
            });
        },
        // 搜索条件获取
        searchdatas(){
            return {
                names: this.names,//订单编号
                createTimeStart: this.searchData ? this.searchData[0] : "",//创建时间
                createTimeEnd: this.searchData ? this.searchData[1] : "",
                orderStatusIds: this.orderStatus.join(","),//订单状态
                storeId: this.storeId,
                page: this.currentPage,
                limit: this.pageSize
            }
        },
        // 关闭弹窗
        closefun(){
            this.$emit("orderclosefun");
        },
        // 提交勾选
        subminbtn(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个订单',
                    type: 'warning'
                });
            } else if (this.tableSelectList.length < 1){
                this.$message({
                    message: '请选择订单',
                    type: 'warning'
                });
            } else {
                this.$emit("orderclosefun",this.tableSelectList)
            }
        },
        // 订单列表接口
        orderdatafun(data){
            // (1.折扣申请) 0 (2.工期加急申请) 1 (3.返点申请) 2 (4.开票申请) 3 (5.退款申请) 4 (6.退货退款申请) 5 (7.换货申请) 6 (8.家装代收合同申请列表) 8 
            if(this.applyType == "8") {   // 家装代收合同申请列表 
                listOrderByHome(data).then(res =>{
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                    }
                }).catch(error =>{
                    console.log('家装代收合同管理: 订单弹框列表 家装代收合同订单列表 components/ordercomponent.vue', error);
                })
            }else if(this.applyType == "4") { // 退款申请
                listOrderCollect(data).then(res =>{
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "3") { // 开票申请
                data.invoice = 1;
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 开票申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "1") { // 工期加急申请
                data.delay = 1;
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
                })
            }else if(this.applyType == "2") { // 返点
                // data.invoice = 1;
                data.referrer = 1;
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{ 
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 返点申请 order/order/order.vue', error);
                })
            }else if(this.refundType == "2") { // 退款申请的订单列表2
                data.orderId = this.orderRefund;
                listOrderTransfer(data).then(res =>{ 
                    if(res.status == 200){
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                        resolve(this.tableData);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 返点申请 order/order/order.vue', error);
                })
            }else if( this.$route.path == "/regoodspermit/addapplication" ){ // 退货管理 新增退货
                data.charge = 1;//拆单之后的
                data.addSingle = 1;//不包含订单作废的
                data.guestAddSingle = 1;//正单和客增单
                data.isChargeOrderList = 1;//是退货列表
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 order/order/order.vue', error);
                })
            }else {
                data.orderType = 451;
                if(this.$route.path == "/ordermm/customerorder"){
                    data.addSingle = 1;
                }
                // 获取门店列表以及门店默认选中
                // this.storeList = JSON.parse(this.$loca.getItem('Store'))
                // let storeids = JSON.parse(this.$loca.getItem('activeStoreId'))
                // if(storeids && storeids.storeId){
                //     // this.getstorfun(storeids.storeId)//根据门店获取相关回显
                //     this.storeId = storeids.storeId
                // }
                data.page = (this.currentPage - 1) * 20;
                listOrder(data).then(res =>{ // 普通订单
                    if(res.status == 200){
                        // this.total = res.data.total;
                        this.tableData = res.data;
                    }
                }).catch(error =>{
                    console.log('订单管理:订单列表 order/order/order.vue', error);
                })
            }

            // else if( this.sponsorType == 2 ){ // 定责的盘点订单

            //     listBlitem(data).then(res =>{ // 定责的盘点订单列表
            //         if(res.status == 200){
            //             this.total = res.data.total;
            //             this.tableData = res.data.rows;
            //         }
            //     }).catch(error =>{
            //         console.log('订单管理:订单列表 order/order/order.vue', error);
            //     })
            // }

            // else if(this.applyType == "4" || this.applyType == "1" ||  this.applyType == "3" || this.applyType == "0") { // 退款订单列表(type = 1) / 工期加急 / 开票申请 / 折扣申请
            //     if(this.applyType == "4") {
            //         data.type = 1;
            //     }
            //     listOrderContract(data).then(res =>{
            //         if(res.status == 200){
            //             this.total = res.data.total;
            //             this.tableData = res.data.rows;
            //         }
            //     }).catch(error =>{
            //         console.log('家装代收合同管理: 订单弹框列表 退款订单列表 components/ordercomponent.vue', error);
            //     })
            // }

            // else if(this.applyType == "8") { // 家装代收合同申请
            //     data.delay = 1;

            //     listOrder(data).then(res =>{ 
            //         if(res.status == 200){
            //             this.total = res.data.total;
            //             this.tableData = res.data.rows;
            //         }
            //     }).catch(error =>{
            //         console.log('订单管理:订单列表 退款申请 order/order/order.vue', error);
            //     })
            // }

        },
        // 查询
        searchFun(){
            this.currentPage = 1;
            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        // 清空
        resetFun(){
            this.names = "";
            this.searchData = []
            this.orderStatus = [];
            this.currentPage = 1;
            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        // 单页条数改变
        handleSizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;
            let data = this.searchdatas();
            this.orderdatafun(data);
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
        }
    }
  }
</script>

<style lang="scss" scoped>
.ordercomponent{
    .warp_head_list{
        flex-wrap: wrap;
    }
    .btns_center {
        display: flex;
        flex-wrap: nowrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        >div{
            margin: 10px 0px;
            padding: 0px 5px;
            width: 20%;
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
}
</style>

