<template>
    <div class="borrowedmanage">
        <!-- 导航栏 -->
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
		<el-card>
			<!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="search_item">
                        <el-input placeholder="订单号/合同号/采购单/商品名称" v-model="borrow.names" size="medium" maxlength="50" @keydown.enter.native="onSearch">
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
                    <div class="search_item">
                        <el-select v-model="borrow.storageId" placeholder="所属仓库" size="medium" class="width-100"  clearable filterable >
						    <el-option
                                v-for="item in warehouseList"
                                :key="item.storageId"
                                :label="item.storageName"
                                :value="item.storageId"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="search_item">
                        <el-select v-model="borrow.storeId" placeholder="所属门店" size="medium" class="width-100"  clearable filterable >
                            <el-option
                            v-for="item in listStoreList" :key="item.storeId"
                            :label="item.storeName" :value="item.storeId">
                            </el-option>
                        </el-select>
                    </div>
                    <!-- <div class="search_item ">
                        <el-select v-model="borrow.brand" placeholder="品牌" size="medium">
                            <el-option
                                v-for="item in brandList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search_item ">
                        <el-select v-model="borrow.designation" placeholder="商品名称" size="medium">
                            <el-option
                                v-for="item in designationList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search_item">
                        <el-select v-model="borrow.type" placeholder="产品类型" size="medium">
                            <el-option
                                v-for="item in typeList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div> -->
                    <div class="search_item">
                        <div class="btn">
                            <el-button class="button-fc" type="warning" size="medium"  @click="onSearch">查询</el-button>
                            <el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
                        </div>
					</div>
                </div>
            </div>
            <div class="h-width"></div>

			<div class="btn_list_1">
				<el-button size="small" class="button-96" v-if="btnJurisdiction.borrowedmanage_borrowgoods" @click="lendingGoods">借货</el-button>   
				<el-button size="small" class="button-96" v-if="btnJurisdiction.borrowedmanage_returngoods" @click="returnGoods">还货</el-button> 
				<el-button size="small" class="button-96" v-if="btnJurisdiction.borrowedmanage_otherreturngoods" @click="otherGoods">其他还货</el-button>
			</div>
			<!-- table表格 -->
			<div class="table_list lvs attribute m-top10">
				<el-table border :row-key="getRowKeys" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
					<el-table-column type="selection" :reserve-selection="true"></el-table-column>
					<el-table-column prop="borrowCode" width="150" label="借入单号" align="center">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow>
                                    <div slot="content" class="tips tipFon">
                                        <p @click="viewButton(scope.row)" class="operaItems">查看</p>
                                    </div>
                                    <img :src="spot" alt="" class="attributesTips">
                                </el-tooltip>
                                <p class="text">{{scope.row.borrowCode}}</p>
                            </div>       
                        </template>
					</el-table-column>
					<el-table-column prop="lendCode" width="150" label="借出单号" align="center"></el-table-column>
					<el-table-column prop="lendingMoneyTime" width="160" label="借货时间" align="center"></el-table-column>
					<el-table-column prop="status" label="状态" align="center" :formatter="statusformatter" width="100"></el-table-column>
                    <el-table-column prop="theGoodsTime" label="预计还货时间" align="center" width="160"></el-table-column>
					<el-table-column prop="remark" label="备注" align="center" width="120" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<div class="pagination_wrap">
                <pagination :current-page="currentPage" :pageSize="pageSize" :total="total"
                    @sizeChange="sizeChange" @currentChange="currentChange">
                </pagination>
			</div>
      	</el-card>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { 
	getStorageList, // 仓库
    listStore, // 门店
    lendingMoneyByPage, // 借还货列表查询
} from 'api/entrepotSet/borrowedmanage/index';
export default {
	components: {
		breadcrumb,
		pagination,
	},
	data() {
		return {
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
            spot,
            navList: [],//头部面包屑
            // 查询条件
            borrow:{
                names: '', // 订单号/合同号/采购合同号/商品名称/货位码
                storageId : '', // 所属仓库
                storeId : '', // 所属门店
            },
            searchData: [], // 查询条件--时间
            warehouseList: [],  // 仓库条件
            listStoreList: [],  // 门店条件
            brandList : [],  // 品牌条件
            designationList : [], // 商品名称条件
            typeList : [], // 产品类型
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
			currentPage: 1,
			pageSize: 20,
			total: 0,
			
		};
    },
	// mounted() {
	// // 头部面包屑
	// 	this.navList = this.$route.meta;
	// },
	// created() {
    //     let data = {
    //         page: this.currentPage,
    //         limit: this.pageSize,
    //     };
    //     this.getList(data);
    //     this.getWarehouse(); // 获取仓库
    //     this.getListStore(); // 获取门店
    // },
    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.getList(data);
        this.getWarehouse(); // 获取仓库
        this.getListStore(); // 获取门店
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
	methods: {
        statusformatter(row) {
            let status = '';
            if(row.status == 1) {
                status = '未还';
            }else if(row.status == 2) {
                status = '已还';
            }
            return status;
        },
        getRowKeys(row) {
            // return row.dutyCompensationId;
        },
        // 借货
        lendingGoods () {
            this.$router.push({path: '/borrowedmanage/lendingdetails'});
        }, 
        // 还货
        returnGoods () {
            if(this.warnMessage()){
                this.$router.push({path: '/borrowedmanage/returndetails',query: {lendingMoneyId: this.elsectVal[0].lendingMoneyId}});
            }
        },
        // 其他换货
        otherGoods () {
            this.$router.push({path: '/borrowedmanage/otherdetails'});
        },
        viewButton(val){
            this.$router.push({path: '/borrowedmanage/returndetails',query: {lendingMoneyId: val.lendingMoneyId, see: 1}});
        },
		// 搜索条件获取
        searchdatas(){
            return {
                // names: this.borrow.names,//订单编号
                // createTimeStart: this.searchData[0],//创建时间
				// createTimeEnd: this.searchData[1],
				// orderStatusIds: this.orderStatus.join(","),//订单状态
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
		// 搜索
        onSearch(){   
            this.currentPage = 1;
            let data = this.searchdatas();
            this.getList(data);
		},

		// 重置
        resetFun(){     
            this.borrow = {
                names: '', // 订单号/合同号/采购合同号/商品名称/货位码
                ware : '', // 所属仓库
                branch : '', // 所属门店
                brand: '', // 品牌
                designation : '', // 商品名称
                type: '', //  产品类型
            },
            this.searchData = [];
            let data = this.searchdatas();
            this.getList(data);
        },
        // 获取表格数据
		getList(data){
            lendingMoneyByPage(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                }
            }).catch(error =>{
            	console.log('借还货管理:借还货管理 列表 entrepotSet/borrowedmanage/index.vue', error);
            })
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
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal1234");
        },
		// 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.elsectVal.length > 1){
                this.$message({
                    message: '只能选择一个订单 新增预算清单',
                    type: 'warning'
                });
                return;
            } else if (this.elsectVal.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
                return;
            }
            return true;
        },
        // 获取仓库
		getWarehouse() {
			getStorageList().then(res => {
                if(res.status == 200) {
				    this.warehouseList = res.data;
                }
			})
			.catch(error => {
				console.log('借还货管理:借还货管理 获取仓库 entrepotSet/borrowedmanage/index.vue', error);
			});
        },
        // 获取门店
        getListStore() {
            listStore().then(res => {
                if(res.status == 200) {
                    this.listStoreList = res.data;
                }
            }).catch(error => {
                console.log('借还货管理:借还货管理 门店列表 entrepotSet/borrowedmanage/index.vue', error);
            });
        },
        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
	}
};
</script>
<style scoped lang='scss'>
.borrowedmanage{
	.warp_head_list{
		width: 100%;
		.list_top{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
            .search_item{
                margin: 10px 0px;
                padding: 0px 5px;
                width: 20%;
                >div{
                    width: 100%;
                }

                .btn{
                    min-width: 155px;
                }
            }
		}
		
	}
	.btn_list_1 {
		margin-top: 5px;
	}
}
</style>

