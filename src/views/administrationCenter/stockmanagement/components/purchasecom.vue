<template>
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="备货采购单号/申请人" v-model="formline.names" size="medium" maxlength="50" @keydown.enter.native="searchfun"></el-input>
                </div>
                <div>
                    <el-date-picker
                        size="medium" v-model="applyData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="申请 年/月/日" end-placeholder="申请 年/月/日">
                    </el-date-picker>
                </div>
                <div>
                    <el-select v-model="formline.isPurchase"  placeholder="选择状态" size="medium" clearable filterable>
                        <el-option
                            v-for="item in stateList" :key="item.value"
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-select v-model="formline.brandId"  placeholder="选择商品品牌" size="medium" clearable filterable>
                        <el-option
                            v-for="item in brandList" :key="item.brandId"
                            :label="item.brandName" :value="item.brandId">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-select v-model="formline.categoryId" placeholder="选择商品品类" size="medium" clearable filterable>
                        <el-option
                            v-for="item in categoryList" :key="item.commodityCategoryId"
                            :label="item.categoryName" :value="item.commodityCategoryId">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-select v-model="formline.organizationId" placeholder="选择所属门店" size="medium" clearable filterable>
                        <el-option
                            v-for="item in storeList" :key="item.storeId"
                            :label="item.storeName" :value="item.storeId">
                        </el-option>
                    </el-select>
                </div>
               
                <div>
                    <el-date-picker
                        size="medium" v-model="goodsData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="预计到货日期 年/月/日" end-placeholder="预计到货日期 年/月/日">
                    </el-date-picker>
                </div>
                
                <div class="head_nav_datapick">
                    <el-button  class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                    <el-button  class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
                </div>
            </div>
        </div>

        <slot></slot>

        <!-- table表格 -->
            <div class="table_list lvs attribute m-top20">

                <el-table
                    border   :row-key="getRowKeys" @row-click="rowClick"
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    :data="tabList" ref="multipleTable"
                    style="width: 100%;">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="isPurchase" label="采购订单状态" :formatter="statusformatter" sortable align="center"></el-table-column>
                    <el-table-column prop="stockUpPurchaseOrderCode" label="备货采购单号" sortable align="center">
                    <template slot-scope="scope">
                        <div>
                            <p class="table_action_span"
                                @click="clickApplycode(scope.row)"
                                >{{scope.row.stockUpPurchaseOrderCode}}
                            </p >
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column prop="organizationName" label="采购机构" sortable align="center"></el-table-column>
                    <el-table-column prop="purchaseAtName" label="采购人" sortable align="center"></el-table-column>
                    <!-- <el-table-column prop="remark" label="采购理由" sortable align="center"></el-table-column> -->
                    <el-table-column prop="createTime" label="创建时间" sortable align="center"></el-table-column>
                    <el-table-column  prop="predictArrivalTime" label="预计到货时间" sortable align="center"></el-table-column>
                </el-table> 

            </div>

        
        <!-- table表格
                <div class="table_list lvs attribute m-top20" v-loading="loading">
                    <el-table
                        border   :row-key="getRowKeys"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange"
                        :data="tabList" ref="multipleTable"
                        style="width: 100%;">
                        <el-table-column type="selection" width="55"  :reserve-selection="true"></el-table-column>
                        <el-table-column prop="applyStatus" label="申请状态" width="240" sortable align="center" :formatter="statusformatter"></el-table-column>
                        <el-table-column
                            prop="applyCode"
                            label="备货申请单号"
                            width="240" sortable align="center">
                            <template slot-scope="scope">
                                <div>
                                    <p class="table_action_span"
                                        @click="clickApplycode(scope.row)"
                                        >{{scope.row.applyCode}}
                                    </p >
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="groupName" label="申请机构" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="createAt" label="申请人"  width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="applyRemark" label="申请理由"  width="240" sortable align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createTime" label="申请时间" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="predictArrivalTime" label="预计到货日期" width="240" sortable align="center"></el-table-column>
                    </el-table>    
                </div> -->
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
} from 'api/pulicJava'


import { 
    listStockUpPurchaseOrder, // 备货审核列表
} from 'api/administrationCenter/stockmanagement/index';

export default {
    components: {
        pagination,
        
    },
    data() {
        return {

            
            applyData: [], // 申请日期
            goodsData: [], // 预计到货日期
            formline: {
                names: '',   // 备货采购单号/申请人
                applyStatus: '', // 状态
                brandId: '', // 品牌
                categoryId: '', // 品类
                organizationId: '', // 门店
                isPurchase: '',
            },
            

            // 条件
            stateList: [{
                label: '未采购', value: 0
            },{
                label: '已采购', value: 1
            }], // 状态
            brandList: [], // 品牌
            categoryList: [], // 品类
            storeList: [], // 门店
            
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,

            // 表格数据
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
			loading: true, // table的loading控制
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
            return row.stockUpApplyId;
        },
        // 0 待提交 1申请中 2 已通过 3 未通过'
        statusformatter(row) {
            let status = '';
            switch(row.isPurchase) {
                case 0: 
                    status =  "未采购" 
                    break;
                case 1:
                    status =  "已采购" 
                    break;   
                default: 
                    status = ""
            }
            return status;
        },
        // 获取全部品牌列表
        getBrandList() {
            listBrand().then(res => {
                if(res.status == 200) {
                    this.brandList = res.data;
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 品牌列表 views/stockmanagement/stockpurchase/components/querycompon', error);
            })
        },

        // 获取全部品类列表
        getCategoryList() {
            listCategory().then(res => {
                if(res.status == 200){
                    this.categoryList = res.data;
                }
            }).catch(error => {
                console.log('备货采购申请管理 备货管理 品类列表 views/stockmanagement/stockpurchase/components/querycompon', error);
            })
        },
        // 获取门店
        getStore() {
            listStore().then(res => {
                if(res.status == 200){
                    this.storeList = res.data;
                }
            }).catch(error =>{
                console.log('备货采购申请管理 备货管理 门店列表 views/stockmanagement/stockpurchase/components/querycompon', error);
            })
        },

        // 备货订单单号
        clickApplycode(rowData) {
            console.log(rowData,"rowData");
            
            this.$router.push({
                path: "/stockmanagement/viewpurchase",
                query: { 
                    stockUpPurchaseOrderId: rowData.stockUpPurchaseOrderId
                }
            })
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
                ...this.formline,
                createTimeStart: this.applyData[0], // 申请起始时间
                createTimeEnd: this.applyData[1], // 申请结束时间
                predictArrivalTimeStart: this.goodsData[0], // 预计到货起始时间
                predictArrivalTimeEn: this.goodsData[1], // 预计到货结束时间

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
            this.formline = {
                names: '',   // 备货采购单号/申请人
                applyStatus: '', // 状态
                brandId: '', // 品牌
                categoryId: '', // 品类
                organizationId: '', // 门店
            };
            this.applyData = [];
            this.goodsData = [];

            this.currentPage = 1;
            let data = this.searchdatas();
            this.getList(data);
        },
         // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },

        getRowKeys(row) {
            return row.stockUpPurchaseOrderId;
        },
        rowClick(row) {
            this.$refs.multipleTable.toggleRowSelection(row)
        },
		
        // 获取表格数据
		getList(data){
            this.loading = true;
            listStockUpPurchaseOrder(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    
                    this.tabList.forEach(item => {
                        Number(item.applyStatus)
                    })
                    this.loading = false;
                }
            }).catch(error =>{
                this.loading = false;
                console.log('备货采购申请管理 备货管理 列表页 views/stockmanagement/stockpurchase/components/querycompon', error);
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