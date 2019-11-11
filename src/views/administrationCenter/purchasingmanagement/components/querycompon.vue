<template>
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50">
                    </el-input>
                </div>
                <div class="search_item">
                    <el-date-picker
                        size="medium" v-model="searchData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="年/月/日" end-placeholder="年/月/日">
                    </el-date-picker>
                </div>
                <div>
                    <el-select v-model="orderStatus" multiple placeholder="选择状态" size="medium">
                        <el-option
                            v-for="item in stateList" :key="item.value"
                            :label="item.dictName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-select v-model="commodityCategoryId" multiple placeholder="选择产品类别" size="medium">
                        <el-option
                            v-for="item in typeList" :key="item.value"
                            :label="item.categoryName" :value="item.commodityCategoryId">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="orderChannel" placeholder="选择订单渠道" size="medium">
                        <el-option
                            v-for="item in channelList" :key="item.value"
                            :label="item.dictName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="orderSourceId" placeholder="选择订单来源" size="medium">
                        <el-option
                            v-for="item in orderl" :key="item.value"
                            :label="item.dictName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="storeId" placeholder="选择所属网点" size="medium">
                        <el-option
                            v-for="item in dotList" :key="item.value"
                            :label="item.storeName" :value="item.storeId">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="salesmanId" placeholder="选择销售员" size="medium">
                        <el-option
                            v-for="item in xsList" :key="item.value"
                            :label="item.salesmanName" :value="item.salesmanId">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="surveyorId" placeholder="选择测量员" size="medium">
                        <el-option
                            v-for="item in clList" :key="item.value"
                            :label="item.surveyorName" :value="item.surveyorId">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="designerId" placeholder="选择设计师" size="medium">
                        <el-option
                            v-for="item in sjList" :key="item.value"
                            :label="item.designerName" :value="item.designerId">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-date-picker
                        size="medium" v-model="qdsearchData" type="datetimerange" 
                        value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss' 
                        range-separator="-"
                        start-placeholder="选择合同签订时间" end-placeholder="选择合同签订时间">
                    </el-date-picker>
                </div>
                <div v-if="isShow">
                    <el-date-picker
                        size="medium" v-model="zpsearchData" type="datetimerange" 
                        value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss' 
                        range-separator="-"
                        start-placeholder="选择指派测量时间" end-placeholder="选择指派测量时间">
                    </el-date-picker>
                </div>
                <div v-if="isShow">
                    <el-date-picker
                        size="medium" v-model="sjsearchData" type="datetimerange" 
                        value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss' 
                        range-separator="-"
                        start-placeholder="选择指派设计时间" end-placeholder="选择指派设计时间">
                    </el-date-picker>
                </div>
                <div :class="[{'head_nav_btn': !isShow},'head_nav_datapick']">
                    <span class="fontMore cursors" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                    <el-button class="button-fc" type="warning" size="medium"    @click="searchfun">查询</el-button>
                    <el-button class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
                </div>
            </div>
        </div>
        <div class="h-width"></div>
        <div class="btn_list_1">
            <el-button size="small" class="button-96" @click="compFun">执行完成</el-button>   
            <el-button size="small" class="button-96" @click="attachManagement">附件管理</el-button> 
            <el-button size="small" class="button-96" @click="exportFun">导出</el-button>
        </div>
        <!-- 
            附件管理组件
            orderId：订单id 不传默认为空
            accessoryTypes：(传Number类型)附件类型(根据模块传对应的参数)不传默认为1 
        -->
        <el-dialog :visible.sync="seeannexval" width="960px">
            <accessory 
                v-if="seeannexval" 
                :orderId="orderId" 
                :accessoryTypes="accessoryTypes">
            </accessory>
        </el-dialog>

        <slot></slot>

        <!-- 分页 -->
        <div class="pagination_wrap">
            <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>
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
} from 'api/order/order/order';

import pagination from '../../../components/pagination';
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入

export default {
    components: {
        pagination,
        accessory
    },
    data() {
        return {
            accessoryTypes: 1,
            orderId: 1,
            currentPage: 1,
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
            tableData:[],
            tableSelectList: [],
            isShow: false,
            seeannexval: false,
            
        }
    },
    props: {
        total:{
            type: Number,
            default: 0
        }
    },
    watch: {
        //监听门店id获取门店下的销售员、测量员、设计员、
        storeId(val){
            if(val == ""){
                return false;
            }
            getSalesmanList({storeId: val}).then(res =>{
                console.log(res,"获取本门店下所有的销售员");
                if(res.status == 200){
                    this.xsList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:获取本门店下所有的销售员 order/order/order.vue', error);
            })

            getSurveyorList({storeId: val}).then(res =>{
                console.log(res,"获取本门店下所有的测量员");
                if(res.status == 200){
                    this.clList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:获取本门店下所有的测量员 order/order/order.vue', error);
            })

            getDesignerList({storeId: val}).then(res =>{
                console.log(res,"获取本门店下所有的设计员");
                if(res.status == 200){
                    this.sjList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:获取本门店下所有的设计员 order/order/order.vue', error);
            })
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
                    console.log(res,"根据订单渠道为电商查订单来源");
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
                    console.log(res,"根据订单渠道为非电商查订单来源");
                    if(res.status == 200){
                        this.orderl = res.data;
                    }
                }).catch(error =>{
                    console.log('订单管理:基础字典查询 order/justOrder/addJustOrder.vue', error);
                })
            }
        },
    },
    created() {
        listStore().then(res =>{
            console.log(res,"获取门店");
            if(res.status == 200){
                this.dotList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:获取门店 order/order/order.vue', error);
        })

        listCategory().then(res =>{
            console.log(res,"获取产品类别列表");
            if(res.status == 200){
                this.typeList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:获取产品类别列表 order/order/order.vue', error);
        })


        //获取订单渠道
        let datas={
            dataType: "ORDER_CHANNEL"
        };
        listBaseDict(datas).then(res =>{
            console.log(res,"基础字典查询获取订单渠道");
            if(res.status == 200){
                this.channelList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询获取订单渠道 order/justOrder/addJustOrder.vue', error);
        })

        //获取订单状态
        let datasa={
            dataType: "ORDER_STATUS"
        };
        listBaseDict(datasa).then(res =>{
            console.log(res,"基础字典查询获取订单状态");
            if(res.status == 200){
                this.stateList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询获取订单状态 order/justOrder/addJustOrder.vue', error);
        })
    },
    methods: {
        // 执行完成
        compFun() {

        },
        // 导出
        exportFun() {

        },
        // 附件查看
        attachManagement() {
             // if(this.checkfun()){
                this.seeannexval = true;
            // }
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
        searchfun(){    //搜索
            let data = this.searchdatas();
            this.$emit("searchfun",data)
        },
        resetFun(){// 重置
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
        },
    },
}
</script>
<style lang="scss">
.screencompon{
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
}
.btn_list_1 {
    margin-top: 20px;
}
</style>