<template>
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="备货采购单号/申请人" v-model="names" size="medium" maxlength="50"></el-input>
                </div>
                <div>
                    <el-date-picker
                        size="medium" v-model="searchData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="申请年/月/日" end-placeholder="申请年/月/日">
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
                    <el-select v-model="commodityCategoryId" multiple placeholder="选择商品品牌" size="medium">
                        <el-option
                            v-for="item in brandList" :key="item.brandId"
                            :label="item.brandName" :value="item.brandId">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="orderChannel" placeholder="选择商品品类" size="medium">
                        <el-option
                            v-for="item in categoryList" :key="item.commodityCategoryId"
                            :label="item.categoryName" :value="item.commodityCategoryId">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="storeId" placeholder="选择所属门店" size="medium">
                        <el-option
                            v-for="item in storeList" :key="item.storeId"
                            :label="item.storeName" :value="item.storeId">
                        </el-option>
                    </el-select>
                </div>
               
                <div v-if="isShow">
                    <el-date-picker
                        size="medium" v-model="qdsearchData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="预计到货日期年/月/日" end-placeholder="预计到货日期年/月/日">
                    </el-date-picker>
                </div>
                
                <div :class="[{'head_nav_btn': !isShow},'head_nav_datapick']">
                    <span class="fontMore cursors" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                    <el-button  class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                    <el-button  class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
                </div>
            </div>
        </div>

        <slot></slot>
        
        <!-- table表格 -->
                <div class="table_list lvs attribute m-top20" v-loading="loading">

                    <el-table
                        border :row-key="getRowKeys"
                        :row-class-name="tableRowClassName"
                        :row-style="tableBodycolor"
                        @selection-change="handleSelectionChange"
                        :data="tabList"
                        style="width: 100%;">

                        <el-table-column type="selection" width="55"></el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请状态"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="备货采购单号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请类型"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请机构"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请人"
                            width="240" sortable align="center">
                        </el-table-column>

                        <!-- <el-table-column
                            prop="name"
                            label="申请理由"
                            width="240" sortable align="center">
                        </el-table-column> -->

                        <el-table-column
                            prop="name"
                            label="申请时间"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="要求完成时间"
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
import pagination from "@/views/components/pagination";

import { 
    listCategory,  // 获取品类
    listBrand,  // 获取品牌
    listStore, // 获取门店
    listCommodity, 
    
  
    
} from 'api/pulicJava'


import { 
    
} from 'api/order/order/order';




export default {
    components: {
        pagination,
        
    },
    data() {
        return {

            // 条件
            stateList: [], // 状态
            brandList: [], // 品牌
            categoryList: [], // 品类
            storeList: [], // 门店
            
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
            tabList:[], // 表格数据
			loading: true, // table的loading控制
        }
    },
    props: {
        total:{
            type: Number,
            default: 0
        }
    },
    
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };

        this.getList(data);   
        
        // 获取全部品牌列表
        this.getBrandList();

        // 获取全部品类列表
        this.getCategoryList()
        // 获取门店
        this.getStore()

       

    },
    methods: {
        getRowKeys(row) {
            // return row.stockUpApplyId;
        },

        // 获取全部品牌列表
        getBrandList() {
            listBrand().then(res => {
                if(res.status == 200) {
                    this.brandList = res.data;
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 列表页 views/stockmanagement/stockpurchase/components/querycompon', error);
            })
        },

        // 获取全部品类列表
        getCategoryList() {
            listCategory().then(res => {
                if(res.status == 200){
                    this.categoryList = res.data;
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 列表页 views/stockmanagement/stockpurchase/components/querycompon', error);
            })
        },
         // 获取门店
        getStore() {
            listStore().then(res => {
                if(res.status == 200){
                    this.storeList = res.data;
                }
            }).catch(error =>{
                console.log('备货采购申请管理 备货管理 列表页 views/stockmanagement/stockpurchase/components/querycompon', error);
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
            //         this.loading = false;
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