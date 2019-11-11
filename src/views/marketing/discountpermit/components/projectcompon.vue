<template>
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50">
                        <el-button slot="append" size="mini" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
                <div>
                    <el-date-picker
                        size="medium" v-model="searchData" type="datetimerange" 
                        value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss' 
                        range-separator="-"
                        start-placeholder="选择创建订单时间" end-placeholder="选择创建订单时间">
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
                    <el-button class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                    <el-button class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
                </div>
            </div>
        </div>

        <slot></slot>

        <!-- table表格 -->
                <div class="table_list lvs attribute m-top20">

                    <el-table
                        border
                        :row-class-name="tableRowClassName"
                        :row-style="tableBodycolor"
                        @selection-change="handleSelectionChange"
                        :data="tabList"
                        style="width: 100%;">

                        <el-table-column type="selection" width="55"></el-table-column>

                        <el-table-column
                            prop="name"
                            label="审核状态"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="当前节点"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请单号"
                            width="240" sortable align="center">
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.name}}</p>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单号"
                            width="240" sortable align="center">
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.name}}</p>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单类型"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="差异天数"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="预计交货日期"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请交货日期"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="所属网点"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="客户姓名"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="客户电话"
                            width="240" sortable align="center">
                        </el-table-column>

                        
                        <el-table-column
                            prop="name"
                            label="备用电话"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单地址"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请时间"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请人"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="审核时间"
                            width="240" sortable align="center">
                        </el-table-column>

                         <el-table-column
                            prop="name"
                            label="审核人"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="备注"
                            width="240" sortable align="center">
                        </el-table-column>

                    </el-table>    

                </div>



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

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";


export default {
    components: {
        pagination,
        
    },
    data() {
        return {
            
            // 分页
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
            // 表格数据
            elsectVal: [], // 表格选中的数据
            tabList:[{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            },], // 表格数据
			
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
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };

        this.getList(data);   

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
         // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
		

        
        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tabList = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
	

        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},

		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
			// return "height: 80px";
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
</style>