<template>
    <div class="screencompon">
        <el-card class="m-bottom">
            <div class="warp_head_list">
                <div class="list_top">
                    <div>
                        <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" 
                            maxlength="50" @keydown.enter.native="searchfun(1)" clearable></el-input>
                    </div>
                    <div>
                        <el-date-picker
                            prefix-icon="el-icon-date"
                            size="medium" v-model="searchData" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            start-placeholder="选择创建订单时间" end-placeholder="选择创建订单时间">
                        </el-date-picker>
                    </div>
                    <div>
                        <el-select v-model="orderStatus" multiple placeholder="选择状态" size="medium"  clearable filterable >
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-select v-model="commodityCategoryId" multiple placeholder="选择产品类别" size="medium"  clearable filterable >
                            <el-option
                                v-for="item in typeList" :key="item.categoryId"
                                :label="item.categoryName" :value="item.categoryId">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select v-model="settlementStatus" placeholder="选择款清状态" size="medium"  clearable filterable >
                            <el-option
                                v-for="item in settlementlist" :key="item.value"
                                :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select v-model="orderSourceId" placeholder="选择订单来源" size="medium"  clearable filterable >
                            <el-option
                                v-for="item in orderl" :key="item.value"
                                :label="item.sourceName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select v-model="storeId" placeholder="选择所属网点" size="medium" clearable filterable >
                            <el-option
                                v-for="item in dotList" :key="item.value"
                                :label="item.storeName" :value="item.storeId">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select v-model="salesmanId" placeholder="选择销售员" size="medium" clearable filterable >
                            <el-option
                                v-for="item in xsList" :key="item.value"
                                :label="item.designerName" :value="item.designerId">
                            </el-option>
                        </el-select>
                    </div>
                    <!-- <div v-if="isShow">
                        <el-select v-model="surveyorId" placeholder="选择测量员" size="medium">
                            <el-option
                                v-for="item in clList" :key="item.value"
                                :label="item.surveyorName" :value="item.surveyorId">
                            </el-option>
                        </el-select>
                    </div> -->
                    <div v-if="isShow">
                        <el-select v-model="designerId" placeholder="选择设计师" size="medium" clearable filterable >
                            <el-option
                                v-for="item in sjList" :key="item.value"
                                :label="item.designerName" :value="item.designerId">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-date-picker
                            size="medium" v-model="qdsearchData" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            start-placeholder="选择合同签订时间" end-placeholder="选择合同签订时间">
                        </el-date-picker>
                    </div>
                    <div v-if="isShow">
                        <el-date-picker
                            size="medium" v-model="zpsearchData" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            start-placeholder="选择指派测量时间" end-placeholder="选择指派测量时间">
                        </el-date-picker>
                    </div>
                    <div v-if="isShow">
                        <el-date-picker
                            size="medium" v-model="sjsearchData" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            start-placeholder="选择指派设计时间" end-placeholder="选择指派设计时间">
                        </el-date-picker>
                    </div>
                </div>
                <div class="head_nav_btn">
                    <span class="fontMore cursors margright" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                    <el-button @click="searchfun(1)" :loading="loading" type="warning" class="button-fc" size="medium">查询</el-button>
                    <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                </div>
            </div>
        <!-- </el-card>
        <el-card class="lvs"> -->
            <div class="h-widths m-bottom10"></div>
            <slot></slot>
            <div class="pagination_wrap orderPagination">
              <el-pagination
                background
                @current-change="currentChange"
                :current-page="currentPage"
                :page-size="20"
                layout="prev, next"
                prev-text="上一页"
                next-text="下一页">
              </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
import { 
    listStore, 
    listCategory, 
    listBaseDict,
    getSalesmanList,//获取本门店下所有的销售员
    getSurveyorList,//获取本门店下所有的测量员
    getDesignerList,//获取本门店下所有的设计员
    getStore,// 获取门店相关信息
} from 'api/order/order/order';
import pagination from '../../components/pagination'
import { mapGetters } from "vuex"

export default {
    components: {
        pagination,
    },
    data() {
        return {
            currentPage: 1,
            orderTypes: this.orderType,
            pageSize: 20,
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
            settlementStatus: "",
            settlementlist: [
                {name: "款未清", id: 1},
                {name: "收费款清", id: 2},
                {name: "财务款清", id: 3},
            ], //来源列表
            tableData:[],
            tableSelectList: [],
            isShow: false,
        }
    },
    computed: {
        ...mapGetters(["activeStoreId"])
    },
    props: {
        total:{
            type: Number,
            default: 0
        },
        // orderType订单类型： 451正单 452增单 681补单 453遗留单 
        orderType:{
            type: Number,
            default: 451
        },
        loading:{
            type:Boolean,
            default:false
        }
    },
    watch: {
        // 门店监听
        activeStoreId(val){
            if(val && val.storeId){
                this.getstorfun(val.storeId)
            }
        },
        //监听门店id获取门店下的销售员、测量员、设计员、
        storeId(val){
            if(val == ""){
                return false;
            }
            getDesignerList({storeId: val,dataCode: "G070"}).then(res =>{
                if(res.status == 200){
                    this.xsList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:获取本门店下所有的销售员 order/order/order.vue', error);
            })

            getDesignerList({storeId: val,dataCode: "G080"}).then(res =>{
                if(res.status == 200){
                    this.sjList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:获取本门店下所有的设计员 order/order/order.vue', error);
            })
        },
    },
    created() {
        // let start = new Date()
        // start.setTime(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1))
        // this.searchData[0] = start
        // this.searchData[1] = new Date((new Date).getTime() + 24*60*60*1000)

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

        this.dotList = JSON.parse(this.$loca.getItem('Store'))
        let storeids = JSON.parse(this.$loca.getItem('activeStoreId'))
        if(storeids && storeids.storeId){
            this.getstorfun(storeids.storeId)//根据门店获取相关回显
        }
    },
    methods: {
        //根据门店获取相关回显
        getstorfun(val){
            this.storeId = val
            getStore({storeId: val}).then(res =>{
                if(res.status == 200){
                    let storedata = res.data
                    this.orderl = storedata.sourceIds;//订单来源列表
                    this.typeList = storedata.cateMap;//品类列表
                }
            }).catch(error =>{
                console.log('订单管理:获取门店列表 order/justOrder/addJustOrder.vue', error);
            })
        },
        currentChange(val) {
            this.currentPage = val;
            this.searchfun()
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.searchfun()
        },
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
        },
        // 搜索条件获取
        searchdatas(){
            if(this.searchData === null){
                this.searchData = [];
            }
            if(this.qdsearchData === null){
                this.qdsearchData = [];
            }
            if(this.zpsearchData === null){
                this.zpsearchData = [];
            }
            if(this.sjsearchData === null){
                this.sjsearchData = [];
            }
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
                // surveyorId: this.surveyorId,//测量员
                designerId: this.designerId,//设计员
                orderSourceId: this.orderSourceId,
                settlementStatus: this.settlementStatus,
                page: (this.currentPage - 1) * 20,
                limit: this.pageSize,
                orderType: this.orderTypes
            };
        },
        searchfun(val){    //搜索
            if(val){
                this.currentPage = val;
            }
            let data = this.searchdatas();
            if(this.orderTypes == 1){
                delete data.orderType;
                data.exception = 1
            }
            this.$emit("searchfun",data)
        },
        resetFun(){// 重置
            this.currentPage = 1;

            this.names= '' // 条件搜索
            this.searchData = [];// 时间搜索
            this.qdsearchData = [];// 签订合同时间
            this.zpsearchData = [];// 指派测量时间
            this.sjsearchData = [];// 指派设计时间
            this.orderStatus = []; // 状态搜索
            this.commodityCategoryId = []; // 类别搜索
            this.orderChannel = ""; //渠道
            this.storeId = ''; // 网点搜索
            this.salesmanId = ''; // 销售员搜索
            this.surveyorId = ''; // 测量员
            this.designerId = ''; // 设计员
            this.orderSourceId = ''; // 来源搜索
            this.settlementStatus = ''; // 款清状态
            
            this.searchfun();
        },
    },
}
</script>
<style lang="scss">
.screencompon{
    .el-card__body{
        padding: 10px;
    }
    .warp_head_list{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        .list_top{
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            >div{
                margin-bottom: 10px;
                padding: 0px 5px;
                width: 25%;
                >div{
                    width: 100%;
                }
            }
            .fontMore{
                color:#d0cfcf;
            }
            .margright{
                margin-right: 5px;
            }
        }
        .head_nav_btn{
            width: 220px;
            text-align: center;
            margin-bottom: 0px;
            .fontMore{
                color:#d0cfcf;
            }
            button+button{
                margin-left: 10px;
            }
        }
    }
}
</style>
