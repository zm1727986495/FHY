<template>
    <!-- 行政审核列表 -->
    <div class="regoodsapply">
         <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
		<el-card class="lvs">
            <div class="warp_head_list">
                <div class="list_top">
                    <div>
                        <el-input placeholder="退货编号/订单编号/客户合同号/客户姓名/客户电话" v-model="regoods.names" size="medium" maxlength="50" @keydown.enter.native="searchfun">
                        </el-input>
                    </div>
                    <div>
                        <el-date-picker
                            size="medium" v-model="searchData" type="daterange" 
                            value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                            range-separator="-"
                            start-placeholder="年/月/日" end-placeholder="年/月/日">
                        </el-date-picker>
                    </div>
                    <!-- <div>
                        <el-select v-model="regoods.auditer" multiple placeholder="审核状态" size="medium">
                            <el-option
                                v-for="item in auditList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div> -->
                    <div>
                        <el-select v-model="regoods.storeId" placeholder="选择所属门店" size="medium" clearable filterable>
                            <el-option
                                v-for="item in storeList" :key="item.storeId"
                                :label="item.storeName" :value="item.storeId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_datapick">
                        <el-button class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                        <el-button  class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
                    </div>
                    
                </div>
            </div>
            <div class="h-width"></div>
            <div class="order-btn-list">
                <el-button size="small" class="button-96" @click="addFun" v-if="isApply">新增退货退款</el-button>
                <!-- 未入库 -->
                <el-button size="small" class="button-96" @click="orderAuditFun" v-if="isOrder">下单员审核</el-button> 
                <!-- 已入库 -->
                <el-button size="small" class="button-96" @click="adminAuditFun" v-if="isAdmin">行政部审核</el-button>
            </div>
            <!-- table表格 -->
            <div class="table_list lvs attribute m-top20">
                <el-table v-loading="loading" border :row-key="getRowKeys" :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;" @cell-click="clickCell">
                    <el-table-column type="selection" width="55" :reserve-selection="true" fixed='left'></el-table-column>
                    <el-table-column prop="chargeBackNumber" label="退货单号" width="150" sortable align="center"  fixed='left'>
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <!-- <p @click="editbHandle(scope.row)" class="operaItems" v-if="scope.row.auditStatus == 0 || scope.row.auditStatus == 3">编辑</p> -->
                                        <p @click="delebHandle(scope.row)" class="operaItems" v-if="scope.row.auditStatus == 0">删除</p>
                                        <p @click="auditRecord(scope.row)" class="operaItems">审核记录</p>
                                    </div>
                                    <img :src="spot" alt="" class="attributesTips">
                                </el-tooltip>
                                <p class="operation table_action_span">{{scope.row.chargeBackNumber}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditStatus" align="center" label="审核状态" width="120">
                        <template slot-scope="scope">
                            <div>
                                <p class="text" v-if="scope.row.auditStatus == 0">待提交</p>
                                <p class="text" v-if="scope.row.auditStatus == 1">待审核</p>
                                <p class="text" v-if="scope.row.auditStatus == 2">审核通过</p>
                                <p class="text" v-if="scope.row.auditStatus == 3">审核驳回</p>
                            </div>       
                        </template>
                    </el-table-column>
                    <el-table-column  prop="remark" label="退货原因"  width="180" align="center" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column  prop="name" label="退货类型" width="240" align="center"></el-table-column> -->
                    <el-table-column  prop="payMoney" label="退货金额/元" width="150" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.payMoney | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" label="订单号" width="150" align="center">
                        <template slot-scope="scope">
                            <div><p class="operation table_action_span">{{scope.row.orderNumber}}</p></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderType" label="订单类型" width="120" align="center"></el-table-column>
                    <el-table-column prop="brandName" label="产品品牌" width="100" align="center"></el-table-column>
                    <el-table-column prop="commodityCategoryName" label="产品类别" width="100" align="center"></el-table-column>
                    <el-table-column prop="customerName" label="客户姓名" width="120" align="center"></el-table-column>
                    <el-table-column prop="contractSerialNumber" label="客户合同号" width="150" align="center"></el-table-column>
                    <el-table-column prop="customerPhone"  label="客户电话" width="150" align="center"></el-table-column>
                    <el-table-column prop="storeName" label="所属门店" width="150" align="center"></el-table-column>
                    <el-table-column prop="address" label="订单地址" width="200" align="center" show-overflow-tooltip></el-table-column>
                </el-table>    
            </div>
            <!-- 点击单元格--申请单号的弹出框 -->
            <!-- <applydetail @close-dialog = "closeDialog" v-if="diaVisible"></applydetail> -->
            <!-- 点击审核记录的操作按耨--审核记录 -->
            <examinedia v-if="examVisible" @close_examin="examineclose" @examin_ok="examinok" :chargeBackId="chargeBackId"></examinedia>

            <!-- 分页 -->
            <div class="pagination_wrap">
                <pagination :current-page="currentPage" :pageSize="pageSize" :total="total"
                    @sizeChange="sizeChange" @currentChange="currentChange">
                </pagination>
            </div>
		</el-card>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
// import applydetail from './applydetail'; // 申请详情
import examinedia from "./examinedia"; //审核记录
import { 
    listStore, // 获取门店
} from 'api/pulicJava'
import { 
    listOrderChargeBack, // 查询—退货列表接口
    listAuditOrderChargeBack, // 查询—退货（审核）列表接口
    deleteOrderChargeBack, //  删除退货申请
} from '@/api/administrationCenter/regoodspermit/index';
export default {
    components: {
        breadcrumb,
        pagination,
        // applydetail,
        examinedia
    },
    data() {
        return {
            spot,
            navList: [],//头部面包屑
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,
            isApply: false, // 申请人
            isAdmin: false, // 退货行政管理
            isOrder: false, // 退货下单管理
            searchData: [],
            // 搜索条件
            regoods: {
                names: '', // 条件搜索
                auditer: '', // 审核状态
                storeId: '', // 所属门店
            },
            // 条件
            auditList: [],  // 选择审核条件
            storeList: [], // 门店
            // 申请详情弹出框的显示与否
            diaVisible: false,
            examVisible: false, // 审核记录弹框是否显示
            // 表格
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
			loading: true, // table的loading控制
			chargeBackId: '',
        }
    },
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.getList(data);
        // 获取门店
        this.getStore()
        if(this.$route.path == "/regoodspermit/regoodsapply"){ // 退货下单申请人列表
            this.isApply = true;
        }else if(this.$route.path == "/regoodspermit/regoodsadmin"){ // 退货行政管理
            this.isAdmin = true;
        }else if(this.$route.path == "/regoodspermit/regoodsorder"){ // 退货下单管理
            this.isOrder = true;
        }
    },
    mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
    },
    filters: {
        fenge(amount) {
            const validateNumber = n =>!isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n;
            if (!validateNumber(+amount)) {
                return amount;
            }
            return (+amount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
        },

    },
    methods: {
        getRowKeys(row) {
            return row.chargeBackId;
        },
        // 新增退货退款
        addFun() {
            this.$router.push("/regoodspermit/addapplication");
        },
        // 下单员审核 标注是否排产
        orderAuditFun() {
            if(this.elsectVal.length > 1) {
                this.$message.warning("只能选择一个订单");
                return;
            }else if(this.elsectVal.length < 1) {
                this.$message.warning("请选择订单");
                return;
            }
            this.$router.push({
                path: "/regoodspermit/orderaudit",
                query: {
                    chargeBackId: this.elsectVal[0].chargeBackId
                }
            })
        },
        // 行政员审核
        adminAuditFun() {
            if(this.elsectVal.length > 1) {
                this.$message.warning("只能选择一个订单");
                return;
            }else if(this.elsectVal.length < 1) {
                this.$message.warning("请选择订单");
                return;
            }
            // isAuditClerk：//1，代表行政部审核过，0代表没审核过
            if(this.elsectVal[0].isAuditClerk == 0) { // 行政一审核
                this.$router.push({
                    path: "/regoodspermit/adminfiraudit",
                    query: {
                        chargeBackId: this.elsectVal[0].chargeBackId
                    }
                })
            }else if(this.elsectVal[0].isAuditClerk == 1) { // 行政二审核
                this.$router.push({
                    path: "/regoodspermit/adminsecaudit",
                    query: {
                        chargeBackId: this.elsectVal[0].chargeBackId
                    }
                })
            }
        },
        // 获取门店
        getStore() {
            listStore().then(res => {
                if(res.status == 200){
                    this.storeList = res.data;
                }
            }).catch(error =>{
                console.log('退货退款 列表页 views/stockmanagement/stockpurchase/components/querycompon', error);
            })
        },
        // 审核记录 --- 打开审核记录弹框 
        auditRecord (val) {
            this.chargeBackId = val.chargeBackId;
            this.examVisible = true;
        },
        //关闭弹框   审核记录
        examineclose() {
            this.examVisible = false;
        },
        //确认关闭弹框   审核记录
        examinok() {
            this.examVisible = false;
            // this.$message("审核信息成功");
        },
        // 点击表格单元格
        clickCell(row,column,event,cell) {
            // var id = row.priceStrategyId;
            if(column.label === "申请单号"){
                // this.getinStoreList(id);
                this.diaVisible = true;
            }
        },
        closeDialog() {
            this.diaVisible = false;
        },
        // 编辑 -- 操作按钮2
        editbHandle(val) {
            this.$router.push({
                path: "/regoodspermit/editapplication",
                query: {
                    chargeBackId: val.chargeBackId,
                }
            })
            // this.currentPage = val;
            // this.searchfun()
        },
        // 删除
        delebHandle (val) {
            if(this.elsectVal && this.elsectVal.length > 0) {
                this.$message.warning("请勿选择");
                return;
            }
            this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    chargeBackId: val.chargeBackId
                }
                deleteOrderChargeBack(data).then(res => {
                    if(res.status == 200) {
                        let data = this.searchdatas();
                        this.getList(data);

                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                }).catch(err => {
                    console.log('退货申请 退货申请列表 删除 views/administrationCenter/regoodspermit/regoodsapply/index', err);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                }); 
            });
        },
        // 审核
        auditHandle(val) {
            this.currentPage = val;
            this.searchfun();
        },
         // 改变页码
        currentChange(val) {
            this.currentPage = val;
            let data = this.searchdatas();
            this.getList(data);
        },
        // 改变单页条数
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            let data = this.searchdatas();
            this.getList(data);
        },
       
        // 搜索条件获取
        searchdatas(){
            return {
                names: this.names,//订单编号
                createTimeStart: this.searchData ? this.searchData[0] : '',//创建时间
                createTimeEnd: this.searchData ? this.searchData[1] : '',
                // applyerIds: this.applyer.join(","),// 申请人状态
                // applyTypes: this.applyType.join(","), // 申请类型别
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        searchfun(){    //搜索
            this.currentPage = 1;

            let data = this.searchdatas();
            this.getList(data);
        },
        resetFun() {// 重置
            this.currentPage = 1;
            this.formline = {
                names: '',   // 备货采购单号/申请人
                applyStatus: '', // 状态
                brandId: '', // 品牌
                categoryId: '', // 品类
                organizationId: '', // 门店
            };
            this.applyData = [];
            this.goodsData = [];

            let data = this.searchdatas();
            this.getList(data);
        },
         // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
        
       // 获取表格数据
		getList(data){
            // auditType // 审核人。1、行政部文员，2、下单人员
            if(this.$route.path == "/regoodspermit/regoodsapply") { // 退货退款申请
                this.listOrderChargeBack(data);
            }else if(this.$route.path == "/regoodspermit/regoodsadmin") { // 退货行政管理
                data.auditType = 1;

                // 审核人列表
                this.listAuditOrderChargeBack(data);
            }else if(this.$route.path == "/regoodspermit/regoodsorder") { // 退货下单管理
                data.auditType = 2;

                // 审核人列表
                this.listAuditOrderChargeBack(data);
            }
        },
        // 申请人列表
        listOrderChargeBack(data) {
            listOrderChargeBack(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                }
                this.loading = false;
            }).catch(error =>{
				this.loading = false;
                console.log('退货申请 退货申请列表 删除 views/administrationCenter/regoodspermit/regoodsapply/index', error);
            })
        },

        // 审核人列表 auditType // 审核人。1、行政部文员，2、下单人员
        listAuditOrderChargeBack(data) {
            listAuditOrderChargeBack(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                }
                this.loading = false;
            }).catch(error =>{
				this.loading = false;
                console.log('退货申请 退货申请列表 删除 views/administrationCenter/regoodspermit/regoodsapply/index', error);
            })
        },
        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
    },
}
</script>
<style lang="scss">
.regoodsapply{
    .tips{
        margin-bottom: 0px;
    }
    .list_top{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        >div{
            margin: 10px 0px;
            padding: 0px 5px;
            width: 25%;
            >div{
                width: 100%;
            }
        }
        .head_nav_datapick {
            display: flex;
            flex-wrap: nowrap; 
        }

    }
}
</style>