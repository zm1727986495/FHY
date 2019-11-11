<template>
    <div class="recommenman">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

		<el-card>
			<!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="search_item">
                        <el-input placeholder="申请人/申请电话/申请门店/申请门店地址" v-model="formline.names" size="medium" maxlength="50" @keyup.enter.native="onSearch"></el-input>
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
                        <el-select v-model="formline.orderStatus"  placeholder="选择订单状态" size="medium" clearable filterable>
                            <el-option
                                v-for="item in orderStauts" :key="item.id"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
					<div  class="search_item">
						<el-select v-model="formline.brandId"  placeholder="选择商品品牌" size="medium" clearable filterable>
							<el-option
								v-for="item in brandList" :key="item.brandId"
								:label="item.brandName" :value="item.brandId">
							</el-option>
						</el-select>
					</div>
					<div class="search_item">
						<el-select v-model="formline.commodityCategoryId" placeholder="选择商品品类" size="medium" clearable filterable>
							<el-option
								v-for="item in categoryList" :key="item.commodityCategoryId"
								:label="item.categoryName" :value="item.commodityCategoryId">
							</el-option>
						</el-select>
					</div>
                    <div class="search_item">
						<el-button class="button-fc" type="warning" size="medium"  @click="onSearch">查询</el-button>
						<el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
					</div>
                </div>
            </div>
			<div class="h-width"></div>
			<div class="btn_list_1">
				<el-button size="small" class="button-96" @click="addSample" v-if="btnJurisdiction.upsample_add">新增</el-button>   
				<el-button size="small" class="button-96" @click="editpoint" v-if="btnJurisdiction.upsample_edit">修改</el-button>  
				<el-button size="small" class="button-96" @click="auditFun"  v-if="btnJurisdiction.upsample_audit">审核</el-button> 
				<el-button size="small" class="button-96" @click="scrapFun"  v-if="btnJurisdiction.upsample_scrap">作废</el-button> 
				<el-button size="small" class="button-96" @click="submitFun" v-if="btnJurisdiction.upsample_submit">提交</el-button> 
				<!-- <el-button size="small" class="button-96"  @click="invalidpoint">拆单</el-button>  -->
				<el-button size="small" class="button-96" @click="seeannexfun"  v-if="btnJurisdiction.upsample_accessory">附件管理</el-button> 
				<!-- <el-button size="small" class="button-96" >审核记录</el-button>  -->
				<!-- @click="examinelog" -->
				<el-button size="small" class="button-96" @click="exportFun"  v-if="btnJurisdiction.upsample_export">导出</el-button> 
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
				<el-table
					border   :row-key="getRowKeys"  @row-click="rowClick"
					:row-class-name="tableRowClassName"
					@selection-change="handleSelectionChange"
					:data="tabList"
					style="width: 100%;" ref="sampleMultiTable">
					<el-table-column type="selection" width="55"   :reserve-selection="true" fixed="left"></el-table-column>
					<el-table-column prop="sampleResult" label="审核状态" width="240" sortable align="center"  fixed="left">
						<template slot-scope="scope">
							 <!-- 0待提交 1通过 2驳回 3审核中 4待审核-->
                            <span v-if="scope.row.sampleResult == 0">待提交</span>
                            <span v-if="scope.row.sampleResult == 1">通过</span>
                            <span v-if="scope.row.sampleResult == 2">驳回</span>
							<span v-if="scope.row.sampleResult == 3">审核中</span>
                            <span v-if="scope.row.sampleResult == 4">待审核</span>
                        </template>						
					</el-table-column>
					<el-table-column prop="orderNumber" label="上样单号" width="240" sortable align="center" fixed="left">
						<template slot-scope="scope">
                            <div>
                                <p class="operation table_action_span" @click="clickCancleCode(scope.row)">{{scope.row.orderNumber}}</p>
                            </div>
                        </template>
					</el-table-column>
					<el-table-column prop="orderStatusName" label="订单状态" width="240" sortable align="center">
						<!-- <template slot-scope="scope">
                            <div> -->
                                <!-- cancelSampleSingleStatus 
                                状态 1待提交 2待审核 3审核通过 4驳回 5已入库 6已出库 7审核中 -->
                                <!-- <p v-if="scope.row.cancelSampleSingleStatus == 1">待提交</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 2">待审核</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 3">审核通过</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 4">驳回</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 5">已入库</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 6">已出库</p>
                                <p v-if="scope.row.cancelSampleSingleStatus == 7">审核中</p>
                            </div>
                        </template> -->
					</el-table-column>
					<el-table-column prop="createTime" label="订单创建时间" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="pushSampleTypeName" label="上样类型" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="isNeedMeasure" label="是否需要测量" width="240" sortable align="center">
						<template slot-scope="scope">
                            <span>{{scope.row.isNeedMeasure == 1 ? '是' : '否'}}</span>
                        </template>
					</el-table-column>
					<el-table-column prop="storeName" label="申请店面" width="240" sortable align="center"  show-overflow-tooltip></el-table-column>
					<el-table-column prop="address" label="店面地址" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="applicantName" label="申请人" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="applicantPhone" label="电话" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="sampleExpectChangeTime" label="预计上样时间" width="240" sortable align="center"></el-table-column>
					<el-table-column prop="sampleRemark" label="上样描述" width="240" sortable align="center"  show-overflow-tooltip></el-table-column>
					<!-- <el-table-column prop="applyRemark" label="备注" width="240" sortable align="center"  show-overflow-tooltip></el-table-column> -->
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
import { listBaseDict } from "src/api/administrationCenter/samplemanagement/index";
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
import spot from '@/assets/images/spot.png';

import { 
    listCategory,  // 获取品类
    listBrand,  // 获取品牌
} from 'api/pulicJava'

import module from '../../../../../config/index.js';

import { 
	listSampleByPage, // 获取样品管理列表
	getStoreList, // 获取门店
	cancelSample, // 作废
	getSample,//查询样品详情
	submitSample, // 提交
} from '@/api/administrationCenter/samplemanagement/index';
import { type } from 'os';

export default {
	components: {
		breadcrumb,
		pagination,
		accessory,
		// orderdetail,
		// contractdetails
	},
  // name: 'brandmanagement',
	data() {
		return {
			navList: [],//头部面包屑
			loading: true, // table的loading控制
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
			searchData: [],// 创建订单时间
			// 搜索
			formline: {
				names: '', // 条件搜索
				orderStatus: [], // 状态搜索
				brandId: '', // 品牌
				commodityCategoryId: '', // 品类
			},
			downFile: '',
			
			tabList:[], // 表格数据
			elsectVal:[], // 表格选中数据
			// 条件
			stateList: [],  // 状态条件
			brandList: [], // 品牌
			categoryList: [], // 品类
			orderStauts:[],//订单状态
			// 分页
			currentPage:1,
			pageSize: 20,
			total: 0,
			
			seeannexval: false,//查看附件开关
			accessoryTypes: 1,
			orderId: '',
		};
	},
  
	mounted() {
	// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.getList(data);
		this.getOrderStaust();//获取订单状态
		// 获取全部品牌列表
        this.getBrandList();
        // 获取全部品类列表
        this.getCategoryList()
		// 获取门店
		this.getStoreList();

		this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/sample/exportSample?sampleIds=';
    },
	methods: {
		// 时间的数据处理
		dataChange() {
			console.log(this.searchData,"this.searchData");
			
			this.searchForm.createTimeStart = this.searchData ? this.searchData[0] : "";
			this.searchForm.createTimeEnd = this.searchData ? this.searchData[1] : "";
		},
		/**
		 * 获取订单状态
		 * @method getOrderStaust
		 */
		getOrderStaust(){
			listBaseDict({dataType:'ORDER_STATUS'}).then(res=> {
				this.orderStauts = res.data;
			}).catch(error =>{
				console.log('样品管理 上样管理 品牌列表 views/administrationCenter/samplemanagement/upsample/index')
			})
		},
		getRowKeys(row) {
			return row.sampleId;
		},
		rowClick(row) {
			this.$refs.sampleMultiTable.toggleRowSelection(row)
		},
		clickCancleCode(rowData) {
          this.$router.push({
              path: "viewupsample",
              query: {
				sampleId: rowData.sampleId,
				orderId:  rowData.orderId,
			},
          })
      	},

		// 搜索条件获取
        searchdatas(){
            return {
                names: this.formline.names,//订单编号
                createTimeStart: this.searchData ? this.searchData[0] : '',//创建时间
				createTimeEnd: this.searchData ? this.searchData[1] : '',
				orderStatusIds: String(this.formline.orderStatus),//订单状态
				brandId: this.formline.brandId,//品牌
				commodityCategoryId: this.formline.commodityCategoryId,//品类

                page: this.currentPage,
                limit: this.pageSize,
            };
		},
		// 获取全部品牌列表
        getBrandList() {
            listBrand().then(res => {
                if(res.status == 200) {
                    this.brandList = res.data;
                }
            }).catch(error => {
                console.log('样品管理 上样管理 品牌列表 views/administrationCenter/samplemanagement/upsample/index', error);
            })
        },

        // 获取全部品类列表
        getCategoryList() {
            listCategory().then(res => {
                if(res.status == 200){
                    this.categoryList = res.data;
                }
            }).catch(error => {
                console.log('样品管理 上样管理 品类列表 views/administrationCenter/samplemanagement/upsample/index', error);
            })
        },
		
		onSearch(){    //搜索
			this.currentPage = 1;

			let data = this.searchdatas();
			console.log(data);

            this.getList(data);
		},

		// 重置
        resetFun(){     
			this.searchData = [];
			this.formline = {
				names: '', // 条件搜索
				orderStatus: '', // 状态搜索
				brandId: '', // 品牌
				commodityCategoryId: '', // 品类
			};
			this.currentPage = 1;
			
			let data = this.searchdatas();
			console.log(data,"lll");

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
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal1234");
        },
		// 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if(this.elsectVal.length > 1){
                this.$message({
                    message: '抱歉，只能选择一个',
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
		
		// 新增样品
		addSample(){
			if(this.elsectVal.length > 0){
                this.$message({
                    message: '请取消选择的订单',
                    type: 'warning'
                });
                return;
            } 
			this.$router.push({
				path: "addsample",
			});

		},

		// 修改
		editpoint(){
			if(this.warnMessage()) {
				if(this.elsectVal[0].sampleResult == 0) { // 待提交
					this.$router.push({
						path: "editsample",
						query: {
							sampleId: this.elsectVal[0].sampleId,
							orderId:  this.elsectVal[0].orderId,
						},
					});
				}else {
					this.$message({
						message: '选中的状态不能修改',
						type: 'warning'
					});
				}
			}
		},
		// 作废
		scrapFun() { 
			if(this.warnMessage()) {
				if(this.elsectVal[0].sampleResult == 0 ||  this.elsectVal[0].sampleResult == 3){
					this.$confirm('是否确定作废?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let data = {
							sampleId: this.elsectVal[0].sampleId
						}

						cancelSample(data).then(res => {
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
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消作废'
						}); 
					});
				}else {
					this.$message({
						message: '选中的状态不能作废',
						type: 'warning'
					});
				}

			}
		},
		// 审核
		auditFun() {
			// 0待提交 1通过 2驳回 3审核中 4待审核
			if(this.warnMessage()) {
				// sampleResult == 1 待审核
				if(this.elsectVal[0].sampleResult == 4 || this.elsectVal[0].sampleResult == 3) {
					this.$router.push({
						path: "auditupsample",
						query: {
							sampleId: this.elsectVal[0].sampleId,
							orderId:  this.elsectVal[0].orderId,
							orderNumber: this.elsectVal[0].orderNumber,
						},
					});

				}else {
					this.$message({
						message: '选中的状态不可审核',
						type: 'warning'
					});
				}
			}
		},
		// 提交
		submitFun() {
			if(this.warnMessage()) {
				if(this.elsectVal[0].sampleResult == 0){
					this.$confirm('是否确定提交?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
							let data = {
								sampleId: this.elsectVal[0].sampleId,
								brandId:  this.elsectVal[0].brandId,
							}

							submitSample(data).then(res => {
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
							message: '已取消提交'
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

		// 拆单
		invalidpoint() {
			// if(this.warnMessage()) {
				this.$router.push({
					path: "splitSample",
				});
			// }
			
		},
		// 导出操作按钮
		exportFun() {
			if(this.elsectVal.length < 1){
                this.$message({
                    message: '抱歉，请进行选择',
                    type: 'warning'
                });
                return;
            }
			let data = this.elsectVal
				.map(item => {
					return item.sampleId;
				})
				.join(",");
			window.location.href = this.downFile + data;
			this.$refs.sampleMultiTable.clearSelection();
		},
		
		// 附件查看
		seeannexfun(){ 
            if(this.warnMessage()) {
				this.orderId = this.elsectVal[0].orderId;
                this.seeannexval = true;
            }
        },

		// 获取表格数据
		getList(data){
            this.loading = true;
            listSampleByPage(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
					this.tabList = res.data.rows;
					this.loading = false;
                }
            }).catch(error =>{
				this.loading = false;
                console.log('样品管理:上样管理 views/administrationCenter/samplemanagement/upsample/index.vue', error);
            })
		},
		// 获取门店
		getStoreList() {
			getStoreList().then(res =>{
                if(res.status == 200){

                }
            }).catch(error =>{
                console.log('样品管理:上样管理 views/administrationCenter/samplemanagement/upsample/index.vue', error);
            })
		},
		
		//表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},

	}
};
</script>
<style scoped lang='scss'>
	.warp_head_list{
		width: 100%;
		.list_top{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			// justify-content: center;
			align-items: center;
				.search_item{
					margin: 10px 0px;
					padding: 0px 5px;
					width: 25%;
					display: flex;
					flex-wrap: nowrap;
					>div{
						width: 100%;
					}
				}
			
		}
		
	}
	.btn_list_1 {
		display: flex;
		flex-wrap: nowrap;
	}
</style>

