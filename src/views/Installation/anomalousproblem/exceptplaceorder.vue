<template>
    <div class="exceptplaceorder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs m-bottom">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="head_nav_search">
                        <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50"></el-input>
                    </div>
                    <div class="head_nav_select">
                        <el-input placeholder="商品名称" v-model="names" size="medium"></el-input>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker
                            size="medium" v-model="searchData" type="datetimerange" 
                            value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss' 
                            range-separator="-"
                            start-placeholder="年/月/日" end-placeholder="年/月/日">
                        </el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="orderStatus" multiple placeholder="订单状态" size="medium">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="orderChannel" placeholder="选择订单渠道" size="medium">
                            <el-option
                                v-for="item in channelList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="orderSourceId" placeholder="选择订单来源" size="medium">
                            <el-option
                                v-for="item in orderl" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="commodityCategoryId" multiple placeholder="选择产品类别" size="medium" v-if="isShow">
                            <el-option
                                v-for="item in typeList" :key="item.value"
                                :label="item.categoryName" :value="item.commodityCategoryId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="commodityCategoryId" multiple placeholder="北京各区" size="medium">
                            <el-option
                                v-for="item in typeList" :key="item.value"
                                :label="item.categoryName" :value="item.commodityCategoryId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="storeId" placeholder="选择所属网点" size="medium">
                            <el-option
                                v-for="item in dotList" :key="item.value"
                                :label="item.storeName" :value="item.storeId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="salesmanId" placeholder="选择接单安装部" size="medium">
                            <el-option
                                v-for="item in xsList" :key="item.value"
                                :label="item.salesmanName" :value="item.salesmanId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="salesmanId" placeholder="选择所在仓库" size="medium">
                            <el-option
                                v-for="item in xsList" :key="item.value"
                                :label="item.salesmanName" :value="item.salesmanId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="salesmanId" placeholder="选择订单类型" size="medium">
                            <el-option
                                v-for="item in xsList" :key="item.value"
                                :label="item.salesmanName" :value="item.salesmanId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="head_nav_select" v-if="isShow">
                        <el-select v-model="salesmanId" placeholder="备货查询" size="medium">
                            <el-option
                                v-for="item in xsList" :key="item.value"
                                :label="item.salesmanName" :value="item.salesmanId">
                            </el-option>
                        </el-select>
                    </div>
                    <div :class="[{'head_nav_btn': !isShow},'head_nav_datapick']">
                        <span class="fontMore cursors" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                        <el-button @click="searchFun" class="button-fc" type="warning" size="medium">查询</el-button>
                        <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card class="lvs">
            <div class="order-btn-list">
                <el-button size="small" class="button-96" @click="invitation">导出</el-button>
            </div>
            <div class="order_table">
                <el-table border
                    ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="操作" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="来源" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="所属网点" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="订单状态" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="物流状态" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="指派安装次数" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="安装任务预警" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="合同号" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="客户姓名" width="200" sortable></el-table-column>
                    <el-table-column prop="customerName" align="center" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="备用电话" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址备注" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="设计师" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="预计安装时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="预约安装时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="物流送货时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="查货备注" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单类型" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="合同金额/元" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单货品类型" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="产品品类" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="产品类别" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="礼品名称" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="礼品数量" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="赠送方式" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="合同扣款/元" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="扣款原因" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="初始状态" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="报备类型" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="C类报备" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="销售员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单渠道" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="指派测量时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="指派设计时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="合同签订时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="优惠卷编码" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="优惠卷金额/元" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="实收金额/元" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>

            <div class="pagination_wrap">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>

        <!-- 查看附件 -->
        <el-dialog center
            :visible.sync="dialogVisible"
            width="500px">
            <div class="titlecals">作废</div>
            <div class="zuopclas">确定作废？</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import breadcrumb from "../../components/breadcrumb";

export default {
    components: {
        breadcrumb,
    },
    data(){
        return {

            names: '', // 条件搜索
            searchData: [],// 创建订单时间
            qdsearchData: [],// 签订合同时间
            zpsearchData: [],// 指派测量时间
            sjsearchData: [],// 指派设计时间
            orderStatus: [], // 状态搜索
            stateList: [],  // 状态条件
            commodityCategoryId: [], // 类别搜索
            typeList: [], // 类别条件
            orderChannel: "", //渠道选择
            channelList: [], //渠道条件
            storeId: '', // 网点搜索
            dotList: [], // 网点列表
            xsList: [], // 销售员
            salesmanId: '', // 销售员id
            clList: [], // 测量员列表
            surveyorId: "", // 测量员id
            sjList: [], // 设计员列表
            designerId: "", // 设计员id
            salespersonList: [], // 销售员列表
            orderSourceId: '', // 来源搜索
            orderl: [], //来源列表
            isShow: false,

            dialogVisible: false,
            activeName: 'first',
            navList: [],
            names: '', // 条件搜索
            searchData: [],// 时间搜索
            orderStatus: "", // 状态搜索
            stateList: "",  // 状态条件
            tableData:[{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },
            ],
            tableSelectList: [],
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
        }
    },
    filters: {
        // 千分号过滤方法
        fenge(val){
            return (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',')
        }
    },
    activated(){
         // 头部面包屑
        this.navList=this.$route.meta;

        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.orderdatafun(data);
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     // 头部面包屑
    //     this.navList=this.$route.meta;
    // },
    // created() {
    //     let data = {
    //         page: this.currentPage,
    //         limit: this.pageSize,
    //     };
    //     this.orderdatafun(data);

    // },
    methods: {
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
        },
        tolocotion(){
            this.$router.push({path: "/Installation/exceptiondetails"})
        },
        invitation(){
            if (this.tableSelectList.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
            }else{
                // this.dialogVisible = true;
            }
        },
        changefun(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个订单 新增预算清单',
                    type: 'warning'
                });
                return false;
            } else if (this.tableSelectList.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
                return false;
            } else {
                return true;
            }
        },
        orderdatafun(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
        // 搜索条件获取
        searchdatas(){
            return {
                names: this.names,//订单编号
                createTimeStart: this.searchData[0],//创建时间
                createTimeEnd: this.searchData[1],
                signingTimeStart: this.qdsearchData[0],//签订合同时间
                signingTimeEnd: this.qdsearchData[1],
                surveyorAssignedTimeStart: this.zpsearchData[0],//指派测量时间
                surveyorAssignedTimeEnd: this.zpsearchData[1],
                designerAssignedTimeStart: this.sjsearchData[0],//指派设计时间
                designerAssignedTimeEnd: this.sjsearchData[1],
                orderStatusIds: this.orderStatus.join(","),//订单状态
                commodityCategoryIds: this.commodityCategoryId.join(","),//产品类别
                orderChannel: this.orderChannel,//订单渠道
                storeId: this.storeId,//网点
                salesmanId: this.salesmanId,//销售员
                surveyorId: this.surveyorId,//测量员
                designerId: this.designerId,//设计员
                orderSourceId: this.orderSourceId,
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        searchFun(){    //搜索
            let data = this.searchdatas();
        },
        resetFun(){// 重置
            // this.names= '' // 条件搜索
            // this.searchData = [];// 时间搜索
            // this.qdsearchData = [];// 签订合同时间
            // this.zpsearchData = [];// 指派测量时间
            // this.sjsearchData = [];// 指派设计时间
            // this.orderStatus = []; // 状态搜索
            // this.commodityCategoryId = []; // 类别搜索
            // this.orderChannel = []; //渠道
            // this.storeId = ''; // 网点搜索
            // this.salesmanId = ''; // 销售员搜索
            // this.surveyorId = ''; // 测量员
            // this.designerId = ''; // 设计员
            // this.orderSourceId = ''; // 来源搜索
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList);
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                name: this.names,
                createTimeStart: this.searchData[0],
                createTimeEnd: this.searchData[1],
                orderStatus: this.orderStatus,
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun();
        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            let data = {
                name: this.names,
                createTimeStart: this.searchData[0],
                createTimeEnd: this.searchData[1],
                orderStatus: this.orderStatus,
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun();
        }
    }
}
</script>
<style scoped lang="scss">
.exceptplaceorder{
    .warp_head_list{
        flex-wrap: wrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
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
        .fontMore{
            color:#d0cfcf;
        }
        .btnone{
            margin-left: 10px;
        }
        .head_nav_btn{
            width: 100%;
            text-align: center;
            margin-bottom: 0px;
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
    .reset_btn{
        background: none;
        color: #f2c27b;
        border: 1px solid #f2c27b;
    }
    .order-btn-list{
        margin-top: 20px;
    }
    .order_table{
        margin-top: 20px;
        width: 100%;
    }
    .order_table .el-tooltip{
        text-align: center;
    }
    .order_table .cell{
        text-align: center;
    }
    .titlecals{
        top: 0;
    }
    .zuopclas{
        margin: 20px 0px 10px 0px;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
    }
    .tablebox{
        width: 100%;
    }
}
</style>