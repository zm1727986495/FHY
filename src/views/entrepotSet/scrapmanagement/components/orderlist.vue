<template>
  <div class="orderlist">
    <div class="apper">

        <div class="search_box">
                <div class="search_item">
					<el-input
						placeholder="订单号/合同号/采购合同号"
						v-model="searchForm.text"
						size="medium"
						class="width-100"
					></el-input>
                </div>
                <div class="search_item">
					<el-date-picker
						size="medium" v-model="searchData" type="daterange" 
						value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
						range-separator="-"
						start-placeholder="年/月/日" end-placeholder="年/月/日">
					</el-date-picker>
				</div>
                <div class="search_item">
                    <el-select
						v-model="searchForm.storageId"
						placeholder="所属仓库"
						size="medium"
						class="width-100"
					>
						<el-option
						v-for="item in warehouseList"
						:key="item.storageId"
						:label="item.storageName"
						:value="item.storageId"
						></el-option>
					</el-select>
                </div>
                <div class="search_item">
                     <el-select
						v-model="searchForm.storeId"
						placeholder="所属门店"
						size="medium"
						class="width-100"
					>
						<el-option
						v-for="item in listStoreList"
						:key="item.storeId"
						:label="item.storeName"
						:value="item.storeId"
						></el-option>
					</el-select>
                </div>
                <div class="search_item searchBtn">
                    <el-button class="button-fc" type="warning" size="medium"  @click="searchFun">查询</el-button>
                    <el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
                </div>
        </div>

        <!-- table表格 -->
        <div class="table_list lvs attribute">
          	<el-table
				border max-height="250"
				:row-class-name="tableRowClassName"
				@selection-change="handleSelectionChange"
				:data="tabList"
				style="width: 100%;">
				<el-table-column type="selection" width="40"></el-table-column>
				<el-table-column prop="orderNumber" label="订单号" width="240" sortable align="center"> </el-table-column>
				<el-table-column prop="factoryContractNo" label="采购合同号" width="240" sortable align="center"></el-table-column>
				<el-table-column prop="createTime" label="订单创建时间" width="240" sortable align="center"> </el-table-column>
				<el-table-column prop="brandName" label="商品品牌" width="240" sortable align="center"></el-table-column>
				<el-table-column prop="commodityName" label="商品名称" width="240" sortable align="center"></el-table-column>
				<el-table-column prop="storeName" label="所属门店" width="240" sortable align="center"></el-table-column>
				<el-table-column prop="status" label="状态" width="240" sortable align="center" :formatter="statusformatter"> </el-table-column>
				<el-table-column prop="storageName" label="所属仓库" width="240" sortable align="center"></el-table-column>
				<el-table-column prop="remark" label="备注" width="240" sortable align="center"></el-table-column>
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

        
      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import { 
	listStoragePurchaseOrderByPage, // 查询订单库存查询列表 -- 即订单列表
	getStorageList, // 仓库
	listStore, // 门店
} from 'api/entrepotSet/scrapmanagement/index';

import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,

  },
  // name: 'orderlist',
  data() {
    return {
		spot,//操作图片

		elsectVal:[],//选中框
		tabList:[],//table数据

		searchData: [],
		searchForm:{ // 查询条件
			text: "", // 订单号/合同号/采购合同号
			storageId: '', // 所属仓库
			storeId: '', // 所属门店
		},
		listStoreList: [], //门店
     	warehouseList: [], //仓库
	   
		// 分页
		currentPage: 1,//当前页数
		pageSize: 20,//总页数
		total: 100,//总条数
    };
  },
	created() {
		// 查询订单库存查询列表 -- 即订单列表
		this.listStoragePurchaseOrderByPage();
		this.getWarehouse(); // 获取仓库
		this.getListStore(); // 获取门店
	},
 
  methods: {
	  statusformatter(row) {
		  let status = '';
		  if(row.status == 0) {
			  status = '未到货';
		  }else if(row.status == 1) {
			  status = '全部到货';
		  }else {
			  status = '';
		  }
		  return status;
	  },
    // 查询按钮
    searchFun(){
		this.currentPage = 1;

		this.listStoragePurchaseOrderByPage();
    },

    // 重置按钮
    resetFun(){
        this.searchForm = { //查询条件
			text: "", // 订单号/合同号/采购合同号
			storageId: '', // 所属仓库
			storeId: '', // 所属门店
		};
		this.searchData = [];
		this.listStoragePurchaseOrderByPage();
    },

    //  提交按钮
    // subclick(){
    //     // this.$emit("sub_click")
    //     this.$router.push({
    //       path: "choseord",
    //       query:{
            
    //       }
    //     });
	// },
	
		// 查询订单库存查询列表 -- 即订单列表
		listStoragePurchaseOrderByPage() {
			let data = {
				text: this.searchForm.text ? this.searchForm.text : null, 
				startTime: this.searchData[0] ? this.searchData[0] : null, // 开始时间
				endTime: this.searchData[1] ? this.searchData[1] : null,// 结束时间
				storageId: this.searchForm.storageId ? this.searchForm.storageId : null,  // 所属仓库
				storeId: this.searchForm.storeId ? this.searchForm.storeId : null,  // 所属门店

				page: this.currentPage,
				limit: this.pageSize
			};
			listStoragePurchaseOrderByPage(data).then(res => {
				if(res.status == 200) {
					this.total  = res.data.total;
					this.tabList = res.data.rows;
					this.tabList.forEach(item => {
						item.status = item.status ? Number(item.status) : null;
					})
				}
			}).catch(err =>{
				console.log('报废管理:报废管理 订单列表 entrepotSet/scrapmanagement/components/orderlist.vue', err);
			})
		},

		//获取仓库
		getWarehouse() {
			getStorageList().then(res => {
				this.warehouseList = res.data;
			})
			.catch(error => {
				console.log('报废管理:报废管理 获取仓库 entrepotSet/scrapmanagement/components/orderlist.vue', err);
			});
		},
		// 获取门店
		getListStore() {
			listStore().then(res => {
				this.listStoreList = res.data;
			})
			.catch(error => {
				console.log('报废管理:报废管理 获取门店 entrepotSet/scrapmanagement/components/orderlist.vue', err);
			});
		},

    // 单页的条数改变的方法
    sizeChange(val) {
		this.currentPage = 1;
		
        this.pageSize = val;
        this.listStoragePurchaseOrderByPage();
    },

    //翻页方法
    currentChange(val) {
        this.currentPage = val;
        this.listStoragePurchaseOrderByPage();
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
	.orderlist{
		.search_box{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			// justify-content: center;
			align-items: center;
				.search_item{
					display: flex;
					flex-wrap: nowrap;
					justify-content: center;
					align-items: center;
					margin: 10px 0px;
					padding: 0px 5px;
					width: 25%;
					>div{
						width: 100%;
					}
				}
				.searchBtn {
					width: 100%;
				}
		}
	}

</style>

