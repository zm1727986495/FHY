<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

    
      <el-card>
          <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="head_list">
                    <div class="search_item">
                        <el-input class="width-100" placeholder="申请人/申请电话/申请门店/申请门店地址" v-model="formline.applyGroup" maxlength="50" @keyup.enter.native="onSearch()"></el-input>
                    </div>
                    <div class="search_item">
                        <el-date-picker
                        style='width:100%'
                         v-model="searchData" type="daterange" 
                            value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                            range-separator="-"
                            start-placeholder="年/月/日" end-placeholder="年/月/日">
                        </el-date-picker>
                    </div>
                    <!-- <div class="search_item">
                        <el-select v-model="formline.orderStatus" multiple placeholder="选择订单状态" class="width-100">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div> -->
                    <div class="search_item">
                        <el-select v-model="formline.brandId"  placeholder="选择品牌" class="width-100" clearable filterable>
                            <el-option
                                v-for="item in brandList"
                                :key="item.brandId"
                                :label="item.brandName"
                                :value="item.brandId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search_item">
                        <el-select v-model="formline.commodityCategoryId"  placeholder="选择品类" class="width-100"  clearable filterable>
                            <el-option
                                v-for="item in categoryList"
                                :key="item.commodityCategoryId"
                                :label="item.categoryName"
                                :value="item.commodityCategoryId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="queryStyle">
						<el-button class="button-fc" type="warning"   @click="onSearch">查询</el-button>
						<el-button class="el-button--medium" type="primary"   @click="resetFun">重置</el-button>
					</div>
                    <div class="search_item"></div>
                    <div class="search_item"></div>
                </div>
            </div>

      		<div class="h-width"></div>
      
			<div class="btn_list_1">
				<el-button size="small" class="button-96" @click="addpoint"  v-if="btnJurisdiction.cancelsample_add">新增</el-button>   
				<el-button size="small" class="button-96" @click="editpoint"  v-if="btnJurisdiction.cancelsample_edit">修改</el-button> 
				<el-button size="small" class="button-96" @click="auditFun"  v-if="btnJurisdiction.cancelsample_audit">审核</el-button> 
				<el-button size="small" class="button-96"  @click="scrapFun"  v-if="btnJurisdiction.cancelsample_scrap">作废</el-button> 
				<el-button size="small" class="button-96" @click="submitFun"  v-if="btnJurisdiction.cancelsample_submit">提交</el-button> 
				<el-button size="small" class="button-96" @click="seeannexfun"  v-if="btnJurisdiction.cancelsample_accessory">附件管理</el-button> 
				<!-- <el-button size="small" class="button-96" >审核记录</el-button>  -->
				<!-- @click="examinelog" -->
				<el-button size="small" class="button-96" @click="exportFun"  v-if="btnJurisdiction.cancelsample_export">导出</el-button> 
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
 
			<!-- table表格 -->
			<div class="table_list lvs attribute m-top20"  v-loading="loading">
				<el-table ref="sampleMultiTable"
					border  :row-key="getRowKeys"  @row-click="rowClick"
					:row-class-name="tableRowClassName"
					@selection-change="handleSelectionChange"
					:data="tabList"
					style="width: 100%;">
					<el-table-column type="selection" width="55" fixed='left'></el-table-column>
					<el-table-column prop="status" label="审核状态" width="240" sortable align="center" fixed='left'>
                        <template slot-scope="scope">
                            <div>
                                <!-- 状态  0待审核 1审核通过 2驳回 3审核中 4待提交-->
                                <p v-if="scope.row.status == 0">待审核</p>
                                <p v-if="scope.row.status == 1">审核通过</p>
                                <p v-if="scope.row.status == 2">驳回</p>
                                <p v-if="scope.row.status == 3">审核中</p>
                                <p v-if="scope.row.status == 4">待提交</p>
                            </div>
                        </template>
                    </el-table-column>
					<el-table-column prop="cancelSampleSingleCode" label="撤样单号" width="240" sortable align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>
                                <p class="operation table_action_span" @click="clickCancleCode(scope.row)">{{scope.row.cancelSampleSingleCode}}</p>
                            </div>
                        </template>
                    </el-table-column>
					<el-table-column prop="cancelSampleSingleStatus" label="订单状态" width="240" sortable align="center">
                        <template slot-scope="scope">
                            <div>
                                <!-- cancelSampleSingleStatus 
                                状态 1待提交 2待审核 3审核通过 4驳回 5已入库 6已出库 7审核中 -->
                                <p v-if="scope.row.cancelSampleSingleStatus == 1">待提交</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 2">待审核</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 3">审核通过</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 4">驳回</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 5">已入库</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 6">已出库</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 7">审核中</p>
                            </div>
                        </template>
                    </el-table-column>
					<el-table-column prop="createTime" label="订单创建时间" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="processModelName" label="撤样处理方式" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="brandName" label="品牌" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="categoryName" label="品类" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="storeName" label="申请店面" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="address" label="店面地址" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="applyName" label="申请人" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="applyPhone" label="申请人电话" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="predictDate" label="预计撤样时间" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="cancalCause" label="撤样原因" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
					<!-- <el-table-column prop="remark" label="备注" width="240" sortable align="center"></el-table-column> -->
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
		</el-card>  


    </div>
  
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {listCancelSampleSingle} from 'api/administrationCenter/samplemanagement/index'
import {listCategory, listBrand } from 'api/pulicJava';
import spot from '@/assets/images/spot.png';
import { 
    editCancellationStatus, // 作废
} from 'api/administrationCenter/samplemanagement/index';
import module from '../../../../../config/index.js';

export default {
    components: {
      breadcrumb,
      pagination,
      // orderdetail,
      // contractdetails
  },
  // name: 'brandmanagement',
  data() {
    return {
	  navList: [],//头部面包屑
	    // 分页
		currentPage:1,
		pageSize:10,
        total:0,
        
        brandList:[],//品牌
        categoryList:[],//品类
		searchData: [],// 创建订单时间
		downFile: '',
		// 条件搜索
		formline: {
			applyGroup: '',//订单编号
            brandId:  '',//品牌
            commodityCategoryId:  '',//品类
        },
		// 条件
		stateList: [],  // 状态条件

		tabList:[], // 表格数据
        tabSelect: [], // 表格选中的数组
        
        // 附件管理
        seeannexval: false,//查看附件开关
        accessoryTypes: 1,
        orderId: 1,
        
        loading: true, // table的loading控制
        btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
    };
  },

    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        this.getBrandList();
        this.getCategoryList();
        this.onSearch()

        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/cancelSampleSingle/exportCustomerService?cancelSampleSingleId=';
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
  
//   mounted() {
//     // 头部面包屑
//     this.navList = this.$route.meta;
//     this.getBrandList();
//     this.getCategoryList();
//     this.onSearch()
//   },
//   created() { 
//    	this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/cancelSampleSingle/exportCustomerService?cancelSampleSingleId=';
//   },
  methods: {
      clickCancleCode(rowData) {
          this.$router.push({
              path: "viewcancle",
              query: {
                    cancelSampleSingleId : rowData.cancelSampleSingleId
              },
          })
      },
    // 获取全部品牌列表
    getBrandList() {
        listBrand()
        .then(response => {
            this.brandList = response.data;
        })
        .catch(error => {
            console.log('选择商品组件:getBrandList', error);
        })
    },
    // 获取全部品类列表
    getCategoryList() {
        listCategory()
        .then(response => {
            this.categoryList = response.data;
        })
        .catch(error => {
            console.log('选择商品组件:getCategoryList', error);
        })
    },
	getRowKeys(row) {
		return row.cancelSampleSingleId;
	},
    rowClick(row) {
        this.$refs.sampleMultiTable.toggleRowSelection(row)
    },
    // 新增撤样单
    addpoint(){
        if(this.tabSelect.length > 0){
            this.$message.warning('请勿选择!')
            return;
        }
		this.$router.push({
			path: "addcancle",
		});
    },
    
    // 修改
    editpoint(){
        if(this.tabSelect.length < 1){
            this.$message.warning('请进行选择!')
        }else if(this.tabSelect.length > 1){
            this.$message.warning('选择切勿多于一个!')
        }else{
            // status == 1 待提交
            // 状态  0待审核 1审核通过 2驳回 3审核中 4待提交
            if(this.tabSelect[0].status == 4) {
                this.$router.push({
                    path: "editcancle",
                    query: {
                        cancelSampleSingleId : this.tabSelect[0].cancelSampleSingleId
                    }
                });
            }else {
                this.$message.warning("只有待提交状态才可修改")
            }
        }
	},
	// 审核
	auditFun() {
        if(this.warnMessage()){
            // status == 0">待审核 3 审核中
            // 状态  0待审核 1审核通过 2驳回 3审核中 4待提交
            if(this.tabSelect[0].status == 0 || this.tabSelect[0].status ==  3) {
                this.$router.push({
                    path: "auditcancle",
                    query: {
                        cancelSampleSingleId : this.tabSelect[0].cancelSampleSingleId
                    }
                });
            }else {
                this.$message.warning("只有待审核状态,审核中状态才可审核")
            }
        }
    },
    
    // 作废
    scrapFun() { 
        // 状态  0待审核 1审核通过 2驳回 3审核中 4待提交
        if(this.tabSelect[0].status == 4){
            this.$confirm('是否确定作废?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let flag = this.tabSelect.every(item => {
                    return item.status == 1;
                })
                if(flag) { // 选择的都是未提交的
                    let cancelSampleSingles = this.tabSelect.map(item => {
                        return item.cancelSampleSingleId
                    })
                    
                    let data = {
                        cancelSampleSingles,
                        isDelete: 1,
                    }

                    editCancellationStatus(data).then(res => {
                        if(res.status == 200) {
                            this.$message({
                                message: '作废成功',
                                type: 'success'
                            });
                            this.$refs.sampleMultiTable.clearSelection();
                            let data = this.searchdatas();
                            this.getList(data);
                        }
                    }).catch(err => {
                        console.log('备货采购申请管理 备货管理 作废 views/stockmanagement/stockpurchase/index', err);
                    })
                }else {
                    this.$message.warning("只有未提交的可以作废");
                }
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消作废'
                }); 
            });
        }else {
            this.$message({
                message: '此订单状态不能作废',
                type: 'warning'
            });
        }
    },
		// 提交
		submitFun() {
            // 状态  0待审核 1审核通过 2驳回 3审核中 4待提交
            if(this.warnMessage()) {
				if(this.tabSelect[0].status == 4){
                    this.$confirm('是否确定提交?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let cancelSampleSingles = this.tabSelect.map(item => {
                                return item.cancelSampleSingleId
                            })
                            
                            let data = {
                                cancelSampleSingles,
                                status: 0,
                            }

                            editCancellationStatus(data).then(res => {
                                if(res.status == 200) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs.sampleMultiTable.clearSelection();
                                    let data = this.searchdatas();
		                            this.getList(data);
                                }
                            }).catch(err => {
                                console.log('备货采购申请管理 备货管理 提交 views/stockmanagement/stockpurchase/index', err);
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消作废'
                            }); 
                        });
               }else {
					this.$message({
						message: '选中的状态不可提交',
						type: 'warning'
					});
				}
			}
		},
        // 附件查看
		seeannexfun(){ 
            if(this.warnMessage()){
                this.orderId = this.tabSelect[0].orderId;
                this.seeannexval = true;
            }
        },
        // 导出操作按钮
		exportFun() {
            if (this.tabSelect.length == 0) {
                this.$message.warning("请勾选数据后再进行导出");
            } else {
                let data = this.tabSelect
                    .map(item => {
                        return item.customerServiceId;
                    })
                    .join(",");
                window.location.href = this.downFile + data;
            }
		},

    // 搜索条件获取
    searchdatas(){
        return {
            applyGroup: this.formline.applyGroup,//订单编号
            createTimeStart: this.searchData ? this.searchData[0] : '',//创建时间
            createTimeEnd: this.searchData ? this.searchData[1] : '',
            // orderStatusIds: this.orderStatus.join(","),//订单状态
            brandId:  this.formline.brandId,//品牌
            commodityCategoryId:   this.formline.commodityCategoryId,//品类
            page: this.currentPage,
            limit: this.pageSize,
        };
    },
		
	onSearch(){    //搜索
        this.currentPage = 1;
        
        let data = this.searchdatas();
        this.getList(data);
    },
    // 重置
    resetFun(){     
        this.formline = {
			applyGroup: '',//订单编号
            brandId:  '',//品牌
            commodityCategoryId:  '',//品类
        };
        this.searchData = [];
        this.currentPage = 1;
		
		let data = this.searchdatas();
		this.getList(data);
    },


    // 分页函数回调
    currentChange(val) {
		this.currentPage = val;
		
        let data = this.searchdatas();
        this.getList(data);
    },
    // 单页条数改变
    sizeChange(val){
		this.currentPage = 1;
		this.pageSize = val;
		
        let data = this.searchdatas();
        this.getList(data);
    },
    // 表格勾选函数回调
    handleSelectionChange(val){
		this.tabSelect = val;
		
        console.log(this.tabSelect,"tabSelect");
    },
    // 表格选中警示信息 -- 只能选择一个订单并且必须选择
    warnMessage() {
        if(this.tabSelect.length > 1){
            this.$message({
                message: '抱歉 只能选择一个',
                type: 'warning'
            });
            return;
        } else if (this.tabSelect.length < 1){
            this.$message({
                message: '抱歉， 请进行选择',
                type: 'warning'
            });
            return;
        }
        return true;
    },
    
    // 获取表格数据
    getList(data){
        this.loading = true;
        listCancelSampleSingle(data).then(res=>{
            this.tabList = res.data.rows;
            this.total = res.data.total;
            
            this.loading = false;
        }).catch(error=>{
            console.error('获取撤样列表',error);
            this.loading = false;
            
        })
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

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },

    
  }
};
</script>
<style scoped lang='scss'>
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.search_item{
    width: calc(((92.5vw - 250px)) / 4);
    margin-bottom: 20px;
    float: left;
    position: relative;
    display: flex;
    align-items: center;
}
.queryStyle{
    display: flex;
    width: 100%;
    justify-content: center;
}
	// .warp_head_list{
	// 	width: 100%;
	// 	.list_top{
	// 		width: 100%;
	// 		display: flex;
	// 		flex-wrap: nowrap;
	// 		justify-content: center;
	// 		align-items: center;
    // .search_item{
    // margin: 10px 0px;
    // padding: 0px 5px;
    // width: 30%;
    // display: flex;
    // flex-wrap: nowrap;
    // >div{
    // 	width: 100%;
    // }
    //     width: calc(((92.5vw - 250px)) / 4);
    //     margin-bottom: 20px;
    //     float: left;
    //     position: relative;
    //     display: flex;
    //     align-items: center;
    // }
	// 	}
	// }
	.btn_list_1{ 
		display: flex;
		flex-wrap: nowrap;
	}
</style>

