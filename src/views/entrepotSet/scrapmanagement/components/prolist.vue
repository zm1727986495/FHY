<template>
	<div class="prolist">

		<div class="search_box">
				<div class="search_item">
					<el-input
						placeholder="订单号/合同号/采购合同号/商品名称/货位码"
						v-model="searchForm.commodityName"
						size="medium"
						class="width-100">
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
				<!-- <div class="search_item">
					<el-select  v-model="searchForm.value" placeholder="库存状态">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div> -->
				<div class="search_item">
					<el-select v-model="searchForm.storageId" placeholder="所属仓库" size="medium" class="width-100">
						<el-option
						v-for="item in warehouseList" :key="item.storageId"
						:label="item.storageName" :value="item.storageId">
						</el-option>
					</el-select>
				</div>
				<div class="search_item">
					<el-select v-model="searchForm.storeId" placeholder="所属门店" size="medium" class="width-100">
						<el-option
						v-for="item in listStoreList" :key="item.storeId"
						:label="item.storeName" :value="item.storeId">
						</el-option>
					</el-select>
				</div>
				<div class="search_item">
					<el-select v-model="searchForm.companyId" placeholder="供应商" size="medium" class="width-100">
						<el-option
						v-for="item in listCompany" :key="item.companyId"
						:label="item.companyName" :value="item.companyId">
						</el-option>
					</el-select>
				</div>
				<div class="search_item">
					<el-select v-model="searchForm.commodityCategoryId" placeholder="商品类型" size="medium" class="width-100">
						<el-option
						v-for="item in listsCategory" :key="item.commodityCategoryId"
						:label="item.categoryName" :value="item.commodityCategoryId">
						</el-option>
					</el-select>
				</div>
				<div class="search_item">
					<el-button class="button-fc" type="warning" size="medium"  @click="searchFun">查询</el-button>
					<el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
				</div>
		</div>

		<!-- table表格 -->
		<div class="table_list lvs attribute scrapTable">
			<el-table
				border
				:row-class-name="tableRowClassName"
				@selection-change="handleSelectionChange"
				:data="tabList"
				style="width: 100%;">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column
				prop="storageName"
				label="所属仓库"
				width="240" sortable align="center">
			</el-table-column>

			<!-- <el-table-column
				prop="type"
				label="库存状态"
				width="240" sortable align="center">

				<template slot-scope="scope">
				<div class="typeBg">
					<p v-if="scope.row.type==0" class="labelicon labelI">库存不足</p>
					<p v-if="scope.row.type==1" class="labelicon2 labelI2">库存过多</p>
					<p v-if="scope.row.type==2" class="labelicon3 labelI3">呆滞品</p>
					<p v-if="scope.row.type==3" class="labelicon4 labelI4">正常</p>
				</div>
				</template>
			</el-table-column> -->

			<el-table-column
				prop="commodityName"
				label="商品名称" show-overflow-tooltip
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="commodityCode"
				label="商品编码" show-overflow-tooltip
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="specification"
				label="商品规格"
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="commodityModel"
				label="商品型号"
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="classifyName"
				label="商品类型"
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="materialName"
				label="商品材质"
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="colourName"
				label="商品颜色"
				width="240" sortable align="center">
			</el-table-column>

			<!-- <el-table-column
				prop="status"
				label="商品属性"
				width="240" sortable align="center">
			</el-table-column> -->

			<el-table-column
				prop="commodityUnit"
				label="计量单位"
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="inventoryNumber"
				label="实际库存"
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="regionName"
				label="货区"
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="siteCode"
				label="货位" show-overflow-tooltip
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
				prop="remark"
				label="备注" show-overflow-tooltip
				width="240" sortable align="center">
			</el-table-column>

			<el-table-column
              prop="scrapNumber"
              label="报废数量"
              width="240" sortable align="center">
				<template slot-scope="scope">
					<el-input-number
						class="width-100"
						:controls="false"
						v-model="scope.row.scrapNumber"
						:min="0"
						size="mini"
					></el-input-number>
				</template>
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
import breadcrumb from "@/views/components/breadcrumb";
import { mapGetters } from "vuex";
import spot from '@/assets/images/spot.png';

import { 
	listStockUpGoodsByPage, // 查询备货库存查询列表 -- 即商品列表
	getStorageList,
	listStore,
	listCompanyByAll, // 获取供应商即公司列表
	listCategory, // 商品品类
	listPurchaseOrderGoods, // 采购单列表后的商品列表
} from 'api/entrepotSet/scrapmanagement/index';
import { setTimeout } from 'timers';
import { log } from 'util';

export default {
    components: {
      breadcrumb,
      pagination,
    
  },
  computed: {
    ...mapGetters(["productList"])
  },
	props: {
		isArrivalOrder: {
			type: Number,
			default() {
				return 0;
			},
		},
		purchaseOrderId: {
			type: null,
		}
	},
  // name: 'prolist',
  data() {
    return {
		spot,//操作图片
		navList: [],//头部面包屑

		// 条件
		warehouseList: [], // 仓库
		listStoreList: [], // 门店
		listCompany: [], // 供应商
		listsCategory: [], // 商品品类


		searchData: [],
		searchForm:{ //查询条件
			commodityName: "", // 商品名称/商品编码
			storageId: '', // 仓库id
			companyId: '', //  供应商id
			storeId: '', // 门店id
			commodityCategoryId: '', // 品类id
		},

		elsectVal:[],//选中框
		tabList:[],//table数据
		// 分页
		currentPage: 1,//当前页数
		pageSize: 20,//总页数
		total: 0,//总条数
       
    };
  },
	created() {
		console.log(this.isArrivalOrder,"isArrivalOrder");
		
		// 查询备货库存查询列表 -- 即商品列表
		if(this.isArrivalOrder == 0) {
			this.listStockUpGoodsByPage();
		}else if(this.isArrivalOrder == 2) {
			this.listPurchaseOrderGoods();  
		}
		
		this.getWarehouse(); // 获取仓库
		this.getListStore(); // 获取门店
		this.listCompanyByAll(); // 供应商列表
		this.listCategory(); // 商品品类
	},
	watch: {
		isArrivalOrder(val) {
			console.log(val,"val +++")
			if(val == 2) {
				this.listPurchaseOrderGoods();
			}else if(val == 0) {
				this.listStockUpGoodsByPage();
			}
		}
	},
 
  methods: {
		// 查询按钮
		searchFun(){
			this.currentPage = 1;
			if(this.isArrivalOrder == 0) {
				this.listStockUpGoodsByPage();
			}else if(this.isArrivalOrder == 2) {
				this.listPurchaseOrderGoods();  
			}
		},

	// 查询备货库存查询列表 -- 即商品列表
	listStockUpGoodsByPage() {
		let  data = {
			commodityName: this.searchForm.commodityName ? this.searchForm.commodityName : null,  // 商品名称/商品编码
			startTime: this.searchData[0] ? this.searchData[0] : null, // 开始时间
			endTime: this.searchData[1] ? this.searchData[1] : null ,// 结束时间
			storageId: this.searchForm.storageId ? this.searchForm.storageId : null, // 仓库id
			companyId: this.searchForm.companyId ? this.searchForm.companyId : null, // 供应商
			storeId: this.searchForm.storeId ? this.searchForm.storeId : null, // 门店id
			commodityCategoryId: this.searchForm.commodityCategoryId ? this.searchForm.commodityCategoryId : null, // 品类id

			page: this.currentPage,
			limit: this.pageSize
		}
		listStockUpGoodsByPage(data).then(res => {
			if(res.status == 200) {
				this.total  = res.data.total;
				this.tabList = res.data.rows;

				let that = this;
				setTimeout(function() {
					that.tabList.forEach(item => {
						item.scrapNumber = 0;
					})
				},100);
			}
		}).catch(err =>{
			console.log('报废管理:报废管理 商品列表 entrepotSet/scrapmanagement/components/prolist.vue', err);
		})
	},

	// 查询备货库存查询列表 -- 即商品列表
	listPurchaseOrderGoods() {
		let  data = {
			commodityName: this.searchForm.commodityName ? this.searchForm.commodityName : null,  // 商品名称/商品编码
			startTime: this.searchData[0] ? this.searchData[0] : null, // 开始时间
			endTime: this.searchData[1] ? this.searchData[1] : null ,// 结束时间
			storageId: this.searchForm.storageId ? this.searchForm.storageId : null, // 仓库id
			companyId: this.searchForm.companyId ? this.searchForm.companyId : null, // 供应商
			storeId: this.searchForm.storeId ? this.searchForm.storeId : null, // 门店id
			commodityCategoryId: this.searchForm.commodityCategoryId ? this.searchForm.commodityCategoryId : null, // 品类id

			purchaseOrderId: this.purchaseOrderId,
			page: this.currentPage,
			limit: this.pageSize
		}
		listPurchaseOrderGoods(data).then(res => {
			if(res.status == 200) {
				this.total  = res.data.total;
				this.tabList = res.data.rows;

				let that = this;
				setTimeout(function() {
					that.tabList.forEach(item => {
						item.scrapNumber = 0;
					})
				},100);
			}
		}).catch(err =>{
			console.log('报废管理:报废管理 商品列表 entrepotSet/scrapmanagement/components/prolist.vue', err);
		})
	},

	 //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          this.warehouseList = res.data;
        })
        .catch(error => {
        	console.log('报废管理:报废管理 仓库列表 entrepotSet/scrapmanagement/components/prolist.vue', error);
        });
    },
    //获取门店
    getListStore() {
      listStore()
        .then(res => {
          this.listStoreList = res.data;
        })
        .catch(error => {
        	console.log('报废管理:报废管理 门店列表 entrepotSet/scrapmanagement/components/prolist.vue', error);
        });
	},
	// 供应商列表
	listCompanyByAll() {
		let data = {
			companyType: "1", // 0 是正常的 1是供应商
		};
		listCompanyByAll(data).then(res => {
			if(res.status == 200) {
          		this.listCompany = res.data;
			}
        }).catch(error => {
        	console.log('报废管理:报废管理 供应商列表 entrepotSet/scrapmanagement/components/prolist.vue', error);
        });
	},

	// 商品品类
	listCategory() {
		listCategory().then(res => {
			if(res.status == 200) {
          		this.listsCategory = res.data;
			}
        }).catch(error => {
        	console.log('报废管理:报废管理 商品品类 entrepotSet/scrapmanagement/components/prolist.vue', error);
        });
	},

    // 重置按钮
    resetFun(){
        this.searchData = [];
		this.searchForm = { //查询条件
			commodityName: "", // 商品名称/商品编码
			storageId: '', // 仓库id
			brandId: '', // 品牌id,
			storeId: '', // 门店id
			commodityCategoryId: '', // 品类id
		};
			
		if(this.isArrivalOrder == 0) {
			this.listStockUpGoodsByPage();
		}else if(this.isArrivalOrder == 2) {
			this.listPurchaseOrderGoods();  
		}
    },

    // 改变单页条数
    sizeChange(val) {
		this.currentPage = 1;
		
		this.pageSize = val;
        if(this.isArrivalOrder == 0) {
			this.listStockUpGoodsByPage();
		}else if(this.isArrivalOrder == 2) {
			this.listPurchaseOrderGoods();  
		}
    },

    // 翻页方法
    currentChange(val) {
		this.currentPage = val;
		
        if(this.isArrivalOrder == 0) {
			this.listStockUpGoodsByPage();
		}else if(this.isArrivalOrder == 2) {
			this.listPurchaseOrderGoods();  
		}
    },

    //勾选函数回调
    handleSelectionChange(val) {
	  this.elsectVal = val;
	  
      console.log(this.elsectVal)
    },
    
    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
    
    
  }
};
</script>
<style scoped lang='scss'>
.prolist{
	
	.search_box{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		// justify-content: center;
		align-items: center;
			.search_item{
				display: flex;
				flex-wrap: nowrap;
				// justify-content: center;
				align-items: center;
				margin: 10px 0px;
				padding: 0px 5px;
				width: 25%;
				>div{
					width: 100%;
				}
			}
		
	}
	

    .labelicon {
      padding: 2px 0px;
      background: red;
      color: #ffffff;
      font-size: 12px;
      position: relative;
      width: 130px;
    }
    .labelI::after {
      display: block;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-right: 15px solid transparent;
      border-left: 16px solid transparent;
      border-bottom: 10px solid #ff0000;
      bottom: 9px;
      right: -20px;
      transform: rotate(90deg);
    }
    .labelicon2 {
      padding: 2px 0px;
      background: #ffa847;
      color: #ffffff;
      font-size: 12px;
      position: relative;
      width: 130px;
    }
    .labelI2::after {
      display: block;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-right: 15px solid transparent;
      border-left: 16px solid transparent;
      border-bottom: 10px solid #ffa847;
      bottom: 9px;
      right: -20px;
      transform: rotate(90deg);
    }
    .labelicon3 {
      padding: 2px 0px;
      background: #999999;
      color: #ffffff;
      font-size: 12px;
      position: relative;
      width: 130px;
    }
    .labelI3::after {
      display: block;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-right: 15px solid transparent;
      border-left: 16px solid transparent;
      border-bottom: 10px solid #999999;
      bottom: 9px;
      right: -20px;
      transform: rotate(90deg);
    }
    .labelicon4 {
      padding: 2px 0px;
      background: #1abc9c;
      color: #ffffff;
      font-size: 12px;
      position: relative;
      width: 130px;
    }
    .labelI4::after {
      display: block;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-right: 15px solid transparent;
      border-left: 16px solid transparent;
      border-bottom: 10px solid #1abc9c;
      bottom: 9px;
      right: -20px;
      transform: rotate(90deg);
    }
    .typeBg {
      display: flex;
      justify-content: center;
    }

}


</style>

<style lang="scss">
.scrapTable .el-table__body-wrapper {
	max-height: 320px;
	overflow-y: auto;
}
</style>


