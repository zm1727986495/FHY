<template>
<!-- 采购申请单弹出框 -->
    <div class="applica_pop">
    
        <el-dialog title="选择采购申请" width="64%" custom-class="customDialogTitle" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
            <!-- <div class="titlecals">{{title}}</div> -->
                <div class="applicafrom">
                    <el-form :label-position="labelPosition" 
                    :model="formline" 
                    class="demo-form-inline">

                    <!-- label-width="120px"  -->
                    <el-form-item label="" required  class="search_item">
                        <el-input placeholder="备货采购单号/申请人" v-model="formline.names" size="medium" maxlength="50"></el-input>
                    </el-form-item>

                    <el-form-item label=""  required  class="search_item">
                        <el-date-picker
                            size="medium" v-model="applyData" type="daterange" 
                            value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                            range-separator="-"
                            start-placeholder="申请 年/月/日" end-placeholder="申请 年/月/日">
                        </el-date-picker>
                    </el-form-item>

                    
                    <el-form-item label="" required  class="search_item">
                        <el-select v-model="formline.applyStatus" :disabled="disabled" placeholder="选择状态" size="medium">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label=""   class="search_item">
                        <el-select v-model="formline.brandId"  placeholder="选择商品品牌" size="medium" :disabled="disabled">
                            <el-option
                                v-for="item in brandList" :key="item.brandId"
                                :label="item.brandName" :value="item.brandId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label=""   class="search_item">
                        <el-select v-model="formline.commodityCategoryId"  placeholder="选择商品品类" size="medium" :disabled="disabled">
                            <el-option
                                v-for="item in categoryList" :key="item.commodityCategoryId"
                                :label="item.categoryName" :value="item.commodityCategoryId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label=""   class="search_item">
                        <el-select v-model="formline.storeId" placeholder="选择所属门店" size="medium">
                            <el-option
                                v-for="item in storeList" :key="item.storeId"
                                :label="item.storeName" :value="item.storeId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                    <div class="dialog-center">
                        <el-button  class="button-fc" type="warning" size="medium"  @click="searchfun">查询</el-button>
                        <el-button  class="el-button--medium" type="primary" size="medium"  @click="resetFun">重置</el-button>
                    </div>
                </el-form>
                
                </div>
                

               <div class="table_list lvs attribute m-top20 stockTable" v-loading="loading">
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
                        <el-table-column prop="createName" label="申请人"  width="240" sortable align="center"></el-table-column>
                        <!-- <el-table-column prop="applyRemark" label="申请理由"  width="240" sortable align="center" show-overflow-tooltip></el-table-column> -->
                        <el-table-column prop="createTime" label="申请时间" width="240" sortable align="center"></el-table-column>
                        <el-table-column prop="predictArrivalTime" label="预计到货日期" width="240" sortable align="center"></el-table-column>
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

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" v-if="!isView" @click="submitBtn">提交</el-button>
                    <el-button  @click="colseBtn">取消</el-button>
                </div>
        </el-dialog>
                 
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
    listStockUpApply, // 备货审核列表
    getStockUpPurchaseOrder,
} from 'api/administrationCenter/stockmanagement/index';

export default {
    components: {
        pagination,
        
    },
    // 品牌 品类 供应商
    props: ["commodityCategoryId","brandId","companyId","stockUpApplyIdsarr"],

    data(){
        return {
            labelPosition: 'right',
            readonly: true,
            searchData: [], //  日期 
            applica: { 
                num : '', // 备货采购单号/申请人
                status : '', // 选择状态
                brand  : '', // 品牌
                classify: '', // 品类
                store: '', // 门店
            },// 上样信息

            applyData: [], // 申请日期
            goodsData: [], // 预计到货日期
            formline: {
                names: '',   // 备货采购单号/申请人
                applyStatus: 2, // 状态
                isPurchase: 0, // 未采购的
                brandId: '', // 品牌
                commodityCategoryId:  '', // 品类
                storeId: '', // 门店
                companyId: '', // 供应商
                
                brandId: this.brandId, // 品牌
                commodityCategoryId:  this.commodityCategoryId, // 品类
                storeId: '', // 门店
                companyId: this.companyId, // 供应商
            },
            disabled: true,
            // 条件
            // 条件
            stateList: [{
                label: '待提交', value: 0
            },{
                label: '已提交', value: 1
            },{
                label: '通过', value: 2
            },{
                label: '驳回', value: 3
            },], // 状态
            brandList: [],  //品牌
            categoryList: [],  // 品类
            storeList:[], // 门店
            isView: false,
            // 控制弹出框是否显示
            visible: true,

            // 表格数据
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
            echoTable:[], // 回显的table的数据
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 10,
            loading: true, // table的loading控制
        }
    },
    created(){
        let data = this.searchdatas();
        this.getList(data);   
        
        // 获取全部品牌列表
        this.getBrandList();

        // 获取全部品类列表
        this.getCategoryList()
        // 获取门店
        this.getStore()

        if(this.$route.path == "/stockmanagement/editpurchase") {
            this.getStockUpPurchaseOrder(); // 回显 -- 针对于选择采购申请弹框
        }

        if(this.$route.path == "/stockmanagement/viewpurchase") {
            this.isView = true;
        }

    },
    watch: {
        tabList(val) { 
            if(this.stockUpApplyIdsarr && this.stockUpApplyIdsarr.length != 0) {
                this.$nextTick(() => {
                    console.log(this.stockUpApplyIdsarr,"this.stockUpApplyIdsarr watch中");
                    
                    if(this.stockUpApplyIdsarr && this.stockUpApplyIdsarr.length != 0) {

                        this.tabList.forEach(item => {
                            this.stockUpApplyIdsarr.forEach(attr => {
                                if(item.stockUpApplyId == attr) {
                                    this.$refs.multipleTable.toggleRowSelection(item);
                                }
                            })
                        })
                    }
                });
            }
        }
    },
    methods: {
        getRowKeys(row) {
            return row.stockUpApplyId;
        },
        // 查询备货采购详情
        getStockUpPurchaseOrder() {
             let data = {
                StockUpPurchaseOrderId: this.$route.query.stockUpPurchaseOrderId,
            }
            getStockUpPurchaseOrder(data).then(res => {
                if (res.status == 200) {
                    this.echoTable = res.data.stockUpApplies;
                    
                    this.echoTable.forEach(item => {
                        this.tabList.forEach(itm => {
                            if(item.stockUpApplyId == itm.stockUpApplyId) {
                                 this.$refs.multipleTable.toggleRowSelection(itm,true);
                            }
                        })
                    })
                }
            }).catch(error => {
                console.log("备货采购申请管理 备货管理 查看备货申请 views/stockmanagement/stockpurchase/components/stockform",error);
            });
        },

         // 备货申请单号
        clickApplycode(rowData) {
            console.log(rowData,"rowData");
            
            this.$router.push({
                path: "/stockmanagement/viewstockpurchase",
                query: { 
                    stockUpApplyId: rowData.stockUpApplyId
                }
            })
        },

        // 0 待提交 1申请中 2 已通过 3 未通过
        statusformatter(row) {
            let status = '';
            switch(row.applyStatus) {
                case 0: 
                    status =  "待提交" 
                    break;
                case 1:
                    status =  "申请中" 
                    break;
                case 2:
                    status =  "已通过" 
                    break;
                case 3:
                    status =  "未通过" 
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
        // 弹框的确定操作按钮
        submitBtn() {
            if( this.elsectVal &&  this.elsectVal.length < 1) {
                this.$message.warning("请进行选择");
                return;
            }else {
                this.$emit("submit_dialog",this.elsectVal);
            }
            // else if( this.elsectVal &&  this.elsectVal.length > 1) {
            //     this.$message.warning("只能选择一个");
            //     return;
            // }
            
        },
        colseBtn() {
            this.$emit("close_dialog");
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
                predictArrivalStart: this.goodsData[0], // 预计到货起始时间
                predictArrivalEnd: this.goodsData[1], // 预计到货结束时间

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
                applyStatus: 2, // 状态
                isPurchase: 0, // 未采购的
                brandId: this.brandId, // 品牌
                commodityCategoryId:  this.commodityCategoryId, // 品类
                storeId: '', // 门店
                companyId: this.companyId, // 供应商

                // brandId: '', // 品牌
                // commodityCategoryId: '', // 品类
                // storeId: '', // 门店
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

            listStockUpApply(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    
                    this.tabList.forEach(item => {
                        Number(item.applyStatus)
                    })
                    this.loading = false;
                }
            }).catch(error =>{
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
<style scoped lang="scss">
    .stockTable{
        max-height: 260px;
        overflow-y: auto;
    }
    .applica_pop {
        .applicafrom {
            width: 100%;
            .demo-form-inline {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                >div {
                    margin: 10px 0px;
                    padding: 0px 5px;
                    width: 25%;
                }
                >div.input_100 {
                    width: 100% !important;
                }
                /*.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner{*/
                /*    width: 100%;*/
                /*}*/
            }
        }
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
        
    }
    .fontMore{
            color:#d0cfcf;
        }
        .btnone{
            margin-left: 10px;
        }
        .head_nav_btn{
            width: 100% !important;
            text-align: center;
            .fontMore{
                color:#d0cfcf;
            }
            .btnone{
                margin-left: 10px;
            }
        }


    .el-range-editor.el-input__inner {
        width: 100%;
    }
    .dialog-center {
        display: flex;
        flex-wrap: nowrap;
    }
</style>
