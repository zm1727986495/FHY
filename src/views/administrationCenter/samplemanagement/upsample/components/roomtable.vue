
<template>
    <div class="roomtable">
		<el-button  size="small" class="button-96" @click="addRoom" v-if="!isDetail">新增房间</el-button>
		<el-button  size="small" class="button-96" @click="deleteRoom" v-if="!isDetail">删除房间</el-button>

		<div v-for="(item, index) in orderBudgetDTOList" :key="index">
			
			<div class="h-width"></div>

			<div class="btnList">
				<div class="roomList">
					<el-checkbox v-model="item.checked"></el-checkbox>
					<span class="cSuccess">{{item.roomName}}</span>
					<el-select
						v-model="item.roomId"
						placeholder="选择房间"
						size="medium"  :disabled="readonly"
					>
						<el-option
							v-for="item in rooms"
							:key="item.id"
							:label="item.dictName"
							:value="item.id">
						</el-option>
					</el-select>
				</div>
				<div  v-if="!isDetail" style="marginLeft: 10px;">
					<el-button v-for="(item, indexs) in actionBtnList" :key="indexs" :type="item.style" :size="btnSize" class="button-96" @click="btnGroupAction(item.url,item.type,index)" >{{item.name}}</el-button>
				</div>
			</div>

			<div  class="table_list lvs attribute m-top20 goodlists">
				<el-table
					border
					:row-class-name="tableRowClassName"
					:data="item.orderCommodityDTOList"
					@selection-change="handleSelectionChange" ref="roomGoods"
					style="width: 100%;">
						<el-table-column align="center"  type="selection"  width="55" fixed="left"></el-table-column>
						<el-table-column align="center"  type="index"  width="55" label="序号" fixed="left"></el-table-column>
						<el-table-column label="商品编码" prop="commodityCode" sortable  align="center" width="150" fixed="left"></el-table-column>
						<el-table-column
							width="240" prop="amount"
							label="数量"
							sortable align="center">
							<template  slot-scope="scope">
								<el-input-number class="width-100" :controls="false"  placeholder="数量" v-model="scope.row.amount" :precision="0" :min="1" :disabled="readonly" size="mini"  @change="colourmaterialseriesChange(scope.row)"></el-input-number>
							</template>
						</el-table-column>
						<el-table-column label="名称" prop="commodityName" sortable  align="center" width="250" show-overflow-tooltip></el-table-column>
						<el-table-column label="品牌" prop="brand_name" sortable  align="center" width="140" show-overflow-tooltip></el-table-column>
						<el-table-column label="品类" prop="category_name" sortable  align="center" width="140" show-overflow-tooltip></el-table-column>
						<el-table-column prop="commodityNumber" label="货号" v-if="isFinished || isAll" align="center" width="180"
										sortable show-overflow-tooltip></el-table-column>
						<el-table-column prop="commodityModel" label="规格" v-if="isFinished" align="center" width="180" sortable
										show-overflow-tooltip></el-table-column>
						<el-table-column label="型号" prop="commodityModel"  v-if="isUnfinished || isAll" sortable  align="center" width="180"></el-table-column>
						<el-table-column 
							width="240" prop="seriesId"
							label="系列"  v-if="isUnfinished || isAll"
							sortable align="center">
							<template  slot-scope="scope">
								<el-select :size="size" v-model="scope.row.seriesId"  placeholder="请选择系列" :disabled="readonly" @change="colourmaterialseriesChange(scope.row)">
									<el-option 
										v-for="(item,index) in scope.row.commodityseriesList" 
										:key="index" 
										:label="item.seriesName" :value="item.seriesId">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						
						<!-- <el-table-column prop="materialName" label="材质" v-if="isUnfinished || isAll" :align="columnAlign" width="120"
										sortable show-overflow-tooltip></el-table-column>
						<el-table-column prop="seriesName" label="系列" v-if="isUnfinished || isAll" :align="columnAlign" width="120"
										sortable show-overflow-tooltip></el-table-column> -->
						<el-table-column
							width="240" prop="materialId"  v-if="isUnfinished || isAll"
							label="材质"
							sortable align="center">
							<template  slot-scope="scope">
								<el-select :size="size" v-model="scope.row.materialId"  placeholder="请选择材质"  :disabled="readonly" @change="colourmaterialseriesChange(scope.row)">
									<el-option 
										v-for="item in scope.row.commoditymaterialList" 
										:key="item.materialId" 
										:label="item.materialName" :value="item.materialId">
									</el-option>
								</el-select>
							</template>
						</el-table-column>

						<el-table-column
							width="240" prop="colourId"
							label="颜色"
							sortable align="center">
							<template  slot-scope="scope">
								<!-- <div>---{{scope.row.commoditycolourList}}---</div> -->
								<el-select :size="size" v-model="scope.row.colourId"  placeholder="请选择颜色" :disabled="readonly" @change="colourmaterialseriesChange(scope.row)">
									<el-option  
										v-for="(item,index) in scope.row.commoditycolourList" 
										:key="index" 
										:label="item.colourName" :value="item.colourId">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						
						<el-table-column width="100" prop="commodityUnit" label="单位" sortable align="center" show-overflow-tooltip></el-table-column>

						 <el-table-column
							width="120" prop="width"
							label="宽"
							sortable align="center">
							<template  slot-scope="scope">
								<el-input-number class="width-100" :controls="false"  placeholder="宽" v-model="scope.row.width" :precision="2" :min="0" size="mini" :disabled="readonly" @change="colourmaterialseriesChange(scope.row)"></el-input-number>
							</template>
						</el-table-column>

						<el-table-column
							width="120" prop="high"
							label="高"
							sortable align="center">
							<template  slot-scope="scope">
								<el-input-number class="width-100" :controls="false"  placeholder="高" v-model="scope.row.high" :precision="2" :min="0" size="mini" :disabled="readonly"  @change="colourmaterialseriesChange(scope.row)"></el-input-number>
							</template>
						</el-table-column>

						<el-table-column
							width="120" prop="deep"
							label="深"
							sortable align="center">
							<template  slot-scope="scope">
								<el-input-number class="width-100" :controls="false"  placeholder="深" v-model="scope.row.deep" :precision="2" :min="0" :disabled="readonly" size="mini"  @change="colourmaterialseriesChange(scope.row)"></el-input-number>
							</template>
						</el-table-column>

						<el-table-column
							width="120" prop="thick"
							label="厚"  v-if="isUnfinished"
							sortable align="center">
							<template  slot-scope="scope">
								<el-input-number class="width-100" :controls="false"  placeholder="厚" v-model="scope.row.thick" :precision="2" :min="0" :disabled="readonly" size="mini"  @change="colourmaterialseriesChange(scope.row)"></el-input-number>
							</template>
						</el-table-column>
				</el-table>
			</div>	
		</div>

		<el-dialog title="商品列表" :visible.sync="productDialog" width="90%" class="selectCommodity customDialogTitle" top="2vh">
            <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="productList" v-if="productDialog"></select-commodity>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectProductConfirm">确 定</el-button>
                <el-button @click="productDialog = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
  
</template>
<script>

import pagination from "@/views/components/pagination";
import { getAllData } from '@/utils/pubilcFn'
import selectCommodity from '@/views/components/selectCommodity';
import {insertCommoditySku} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import spot from '@/assets/images/spot.png';
import { listBaseDict } from "@/api/order/budgetdetailed/budgetdetailed";
import { 
    listCommodityColour, // 商品颜色查询
    listCommoditySeries, // 商品系列查询
    listCommodityMaterial, // 商品材质查询
} from 'api/administrationCenter/stockmanagement/index';

import { 
	getGoodsSKUId, // SKUId 根据颜色，材质，系列
	// listOrderCommodityByPage, // 上样清单列表
	getSample, // 回显上样清单列表
} from 'api/administrationCenter/samplemanagement/index';
import { removeBudget } from "@/utils/pubilcFn";
import { resolve } from 'url';
export default {
	components: {
		pagination,
		selectCommodity,
	},
  // name: 'roomtable',
  props: ["brandId","commodityCategoryId","companyId"],
	data() {
		return {
			size: "small",
			navList: [],//头部面包屑
			readonly: false, // 是否只读
			isEdit: false, // 是否是编辑页
			isDetail: false, // 是否是详情页
			// 商品
			tabList: [],
            productDialog: false,
            productList: {
                selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
                height: '350px', // 设置表格高度 可不传（弹出层最好传下）
				isDialog: true, // 是否为弹出层（不传默认为页面）
				brandId: 0,
                commodityCategoryId: 0,
                disabled: true,
                companyId: 0,
                goodsType: 1// 货品类型： 1成品 2定制品
            },
            selectedProducts: [], // 选择商品
			
			tableList: [], // table数据
			selectList: [], // table所选数据
			roomIndex:0,
			btnSize: 'small',
			room: '', // 房间
			checked: false,
			// 条件
			orderBudgetDTOList: [],
			actionBtnList: [
				{ name: '添加商品', style: 'default', url: '', type: 1 },
				// { name: '保存', style: 'default', url: '', type: 2 },
				{ name: '删除', style: 'default', url: '', type: 3 },
			],
			roomList: [], //  房间
		};
	},
  
	mounted() {
		// 头部面包屑
		this.navList = this.$route.meta;
		this.baseDict('ROOM_TYPE',1);//房间类型字典查询
	},
	computed: {
		// 是否是成品
		isFinished() {
			return this.productList.goodsType == 1;
		},
		// 是否是定制品
		isUnfinished() {
			return this.productList.goodsType == 2;
		},
		isAll() {
			return !this.productList.goodsType;
		},
		commodityIds() {
			let arr = [];
			this.tabList.forEach(item => {
				arr.push(item.commodityId);
			})
			return arr;
		}
	},
	created() {
		if(this.$route.path == "/samplemanagement/editsample") { // 修改上样样品
			// this.listOrderCommodityByPage(); // 回显信息
			this.isEdit = true;
			this.getSample(); // 回显信息
		}else if(this.$route.path == "/samplemanagement/viewupsample" || this.$route.path == "/samplemanagement/auditupsample"){ // 上样详情
			this.isDetail = true;
			this.readonly = true;
            this.getSample(); // 回显信息
        }
		
	},
  	methods: {
		//   上样清单列表
	  	// listOrderCommodityByPage() {
		// 	listOrderCommodityByPage().then(res => {
		// 		if(res.status == 200) {
		// 			this.orderBudgetDTOList = res.data;
		// 		}
		// 	}).catch(err => {
		// 		console.error('新增预算清单 字典查询 order/budgetdetailed/add/addTranslate', error) 
		// 	})
		// },
		  
		// 上样回显信息
        getSample() {
            let data = {
                sampleId: this.$route.query.sampleId,
                orderId:  this.$route.query.orderId,
            };
            getSample(data).then(res => {
                if(res.status == 200) {
					// this.orderBudgetDTOList = res.data.orderBudgetDTOList;
					
					// 处理数据 -- 房间
					this.storageOrderBudgetDTOList = res.data.orderBudgetDTOList; 
					
					this.storageOrderBudgetDTOList.forEach(itm => { // 房间
						itm.checked = false;
						
						let storageorderCommodityDTOList = [];

						itm.orderCommodityDTOList.forEach((item, index)=> { // 房间的商品集合
							// item.commodityCode = (new Date().getTime()) ^ Math.random() + index;
							item.colourId = item.colourId ? Number(item.colourId) : '';
							item.seriesId = item.seriesId ? Number(item.seriesId) : '';
							item.materialId = item.materialId ? Number(item.materialId) : '';

							let data = {
								commodityId: item.commodityId ? item.commodityId : ''
							};
							
							let p1 = new Promise((resolve, reject) => {
								listCommodityColour(data).then(attr => {
									resolve(attr);
								});
							});

							let p2 = new Promise((resolve, reject) => {
								listCommoditySeries(data).then(attr => {
									resolve(attr);
								});
							});

							let p3 = new Promise((resolve, reject) => {
								listCommodityMaterial(data).then(attr => {
									resolve(attr);
								});
							});
							
							Promise.all([p1, p2, p3]).then(res => {
								storageorderCommodityDTOList.push({ // 商品集合  将颜色,材质,系列添加到该商品里,品牌品类进行转换
									...item,
									brand_name: item.brandName,
									category_name: item.categoryName,
									commoditycolourList: res[0].data,
									commodityseriesList: res[1].data,
									commoditymaterialList: res[2].data,
								})
								
								 // 
								 
								if(this.orderBudgetDTOList.length != 0) { // 总集合房间
									
									let flag = this.orderBudgetDTOList.some(att =>{ // 总集合的每个房间 和回显的房间至少有一个是相同的
										return att.roomId == itm.roomId; // 总集合的每个房间 和回显的 roomId
									})

									if(flag) {// 总集合的每个房间 和回显的房间至少有一个是相同的
										this.orderBudgetDTOList.forEach(att =>{ // 总集合的每个房间
											if(att.roomId == itm.roomId) { // 总集合的roomId 和 回显的集合的roomId
												att.orderCommodityDTOList = storageorderCommodityDTOList;// 总集合的商品
											}
										})
									}else { // 总集合的每个房间 和回显的房间一个也不相同的
										this.orderBudgetDTOList.push({// 总集合房间
											...itm,
											orderCommodityDTOList: storageorderCommodityDTOList,
										})
									}

									// this.orderBudgetDTOList.forEach(att =>{ // 总集合的每个房间
									// 	if(att.roomId == itm.roomId) { // 总集合的roomId 和 回显的集合的roomId
									// 		att.orderCommodityDTOList = storageorderCommodityDTOList;// 总集合的商品
									// 	}else {
									// 		this.orderBudgetDTOList.push({// 总集合房间
									// 			...itm,
									// 			orderCommodityDTOList: storageorderCommodityDTOList,
									// 		})
									// 	}
									// })
								}else {
									this.orderBudgetDTOList.push({ // 总集合房间
										...itm,
										orderCommodityDTOList: storageorderCommodityDTOList,
									})
									console.log(this.orderBudgetDTOList,"this.orderBudgetDTOList this.orderBudgetDTOList.length == 0")
								}
								// item.commoditycolourList = res[0].data;
								// item.commodityseriesList = res[1].data;
								// item.commoditymaterialList = res[2].data;
							});
							// this.orderBudgetDTOList[this.roomIndex].commodity.push(item);//将选择的商品添加到对应的房间
						});


						
					})
                }
            }).catch(error =>{
                console.log('样品管理:表单 信息回显 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
            })
		},
		
	  	
		//颜色系列材质改变
		colourmaterialseriesChange(row) {
			let obj = {
				commoditySeriesId: row.seriesId, // 系列 
				commodityMaterialId: row.materialId, // 材质  
				commodityColourId: row.colourId, // 颜色
				commodityId: row.commodityId,
				// 新增字段
				commodityWide: row.width,
				commodityHigh: row.high,
				commodityLong: row.deep,
				commodityThick: this.isUnfinished ? row.thick : '',
				commodityNumber: (this.isFinished || this.isAll) ? row.amount : '',
			};
			new Promise((resolve, reject) => {
				getGoodsSKUId(obj).then(res => {
					resolve(res);
				});
			}).then(res => {
				if (res.data) {
					row.commoditySkuId = res.data.commoditySKUId;
				}
			});
		},
	    /**
		 * 添加房间
		 * @method addRoom
		 * 复选框
		 * @param checked
		 * 商品集合
		 * @param orderCommodityDTOList
		 * 商品id
		 * @param roomId
		 */
	  	addRoom() {
			if(this.brandId && this.commodityCategoryId) {
                this.productList.brandId =  this.brandId; // 品牌
                this.productList.commodityCategoryId = this.commodityCategoryId; // 品类
            }else {
                this.$message.warning("请选择品牌品类");
                return;
            }

            this.orderBudgetDTOList.push({checked: false, orderCommodityDTOList:[], roomId:""});
		},
		// 删除房间
		deleteRoom() {
			this.orderBudgetDTOList = removeBudget(this.orderBudgetDTOList)[0];
            !removeBudget(this.orderBudgetDTOList)[1] ? this.message('请勾选房间') : null;
		},
        /**
         * 弹框消息
         * @method message 
         */
        message(item) {
            this.$message({
                message: item,
                type: 'warning'
            });
		},
        /**
         * 房间类型字典查询
         * @method baseDict 
         */
        baseDict(item) {
            listBaseDict({
                dataType: item	
            }).then(res => {
                    this.rooms = res.data;
            }).catch(error => {
                console.error('新增预算清单 字典查询 order/budgetdetailed/add/addTranslate', error) 
            })
        },
		// 按钮组函数
		/**
		 * 按钮组函数
		 * @method btnGroupAction
		 * 此index为房间索引不是按钮索引
		 * @param index
		 * 此indexs为按钮索引
		 * @param indexs
		 */
		btnGroupAction(url, type,index, indexs) {
			window.newArr = [];
			this.selectedProducts = getAllData(this.$store.getters.tablesData, true);
			if (type == 1) { // 添加商品
				this.roomIndex = index;//将添加商品的房间索引赋值到this.rommIndex用将选择商品添加到对应的房间
				this.addProduct(index);
			} else if (type == 2) { // 保存
				window.newArr = [];
				this.allProducts = getAllData(this.$store.getters.tablesData);
				this.savePurchaseList();
			} else if (type == 3) { // 删除
				this.deleteProduct(index);
			}
		},
		 // 保存
		savePurchaseList() {

		},
		// 点击删除商品
		deleteProduct(index) {
			// if (!this.selectedProducts.length) {
			// 	this.$message.warning('请选择要删除的商品');
			// 	return;
			// }

			// if(this.elsectVal && this.elsectVal.length < 1) {
            //     this.$message.warning("抱歉，请进行选择");
            //     return;
            // }

            // this.elsectVal.forEach(item => {
            //     this.tabList = this.tabList.filter(item => {
            //         return res.checked != true;
            //     })
			// })
			// this.$refs.roomGoods.clearSelection()		
			let list = [];
			let roomList = this.orderBudgetDTOList[index].orderCommodityDTOList;
			// // this.elsectVal.forEach(res => {
			//	// 	list.push(res.commodityCode)
			//	// })
			this.elsectVal.forEach(res => {
				 this.orderBudgetDTOList[index].orderCommodityDTOList=this.orderBudgetDTOList[index].orderCommodityDTOList.filter(item=>{
					return item.commodityId != res.commodityId
				})
			})

			// this.elsectVal.forEach(res => {
			// 	 this.orderBudgetDTOList[index].orderCommodityDTOList=this.orderBudgetDTOList[index].orderCommodityDTOList.filter(item=>{
			// 		return item.commodityCode != res.commodityCode
			// 	})
			// })
		},
		// 添加商品操作按钮
		addProduct(index) {
			this.productDialog = true;
		},
	  
		selectProduct() {
			this.productDialog = false;
		},
		// 选择商品 复选框
		selectionChange(val) {
			this.selectedProducts = val;
		},
		/**
		 * 选择商品的确定操作按钮 将商品添加到房间
		 * @method selectProductConfirm
		 * 生成商品唯一主键用于删除
		 * @param commodityCode
		 */
        selectProductConfirm() {
			this.selectedProducts.forEach((item, index)=>{
				// item.commodityCode = (new Date().getTime()) ^ Math.random() + index;

				let data = {
					commodityId: item.commodityId ? item.commodityId : ''
				};
				
				
				let p1 = new Promise((resolve, reject) => {
					listCommodityColour(data).then(attr => {
						resolve(attr);
					});
				});

				let p2 = new Promise((resolve, reject) => {
					listCommoditySeries(data).then(attr => {
						resolve(attr);
					});
				});

				let p3 = new Promise((resolve, reject) => {
					listCommodityMaterial(data).then(attr => {
						resolve(attr);
					});
				});
				
				Promise.all([p1, p2, p3]).then(res => {
					new Promise((resolve,reject) => {
						if(item.colourId || item.seriesId || item.materialId || item.commodityWide || item.commodityHigh || item.commodityLong  || item.commodityId) {
							let data = {
								commoditySeriesId: item.seriesId, // 系列 
								commodityMaterialId: item.materialId, // 材质  
								commodityColourId: item.colourId, // 颜色
								commodityId: item.commodityId,
								// 新增字段
								commodityWide: item.commodityWide,
								commodityHigh: item.commodityHigh,
								commodityLong: item.commodityLong,
								commodityThick: this.isUnfinished ? item.commodityThick : '',
								commodityNumber:  (this.isFinished || this.isAll) ? item.amount : '',
								// commodityNumber: 1,
							}
							
							getGoodsSKUId(data).then(respon => {
								if(respon.status == 200) {
									if(respon.data) {
										resolve(respon.data.commoditySKUId);
									}else {
										resolve('');
									}
								}
							}).catch(err => {
								console.error('新增预算清单 字典查询 order/budgetdetailed/add/addTranslate', err) 
							})
						}
					}).then(response => {
						new Promise((relve,rej)=>{
							if(response){
								relve(response)
							}else{
								 let data = {
									commoditySeriesId: item.seriesId, // 系列 
									commodityMaterialId: item.materialId, // 材质  
									commodityColourId: item.colourId, // 颜色
									commodityId: item.commodityId,
									// 新增字段
									commodityWide: item.commodityWide,
									commodityHigh: item.commodityHigh,
									commodityLong: item.commodityLong,
									commodityThick: this.isUnfinished ? item.commodityThick : '',
									commodityNumber:  (this.isFinished || this.isAll) ? item.amount : '',
								// commodityNumber: 1,
							}
                insertCommoditySku(data).then(ress => {
                  // item.commoditySKUId = res.data;
                  relve(ress.data);
                });
							}
						}).then(ress=>{
							this.orderBudgetDTOList[this.roomIndex].orderCommodityDTOList.push({ //将选择的商品添加到对应的房间
								commoditycolourList: res[0].data,
								commodityseriesList: res[1].data,
								commoditymaterialList: res[2].data,
								width: item.commodityWide,
								high: item.commodityHigh,
								deep: item.commodityHigh,
								thick: item.commodityThick,
								amount: 1,
								commoditySkuId: ress, // skuid
								...item
							});
						})
						
					})


				});
				// this.orderBudgetDTOList[this.roomIndex].commodity.push(item);//将选择的商品添加到对应的房间
			});

			
			this.productDialog = false;
            this.productList.selectedCommodities = this.commodityIds;
        },
     

    // table 颜色切换
    tableRowClassName({row, rowIndex}) {//表格斑马线设置
        return rowIndex % 2 != 0 ? 'el-f0' : '';
    },

    // 多选改变
    handleSelectionChange(val) {
        this.multipleSelection = val;
        this.$emit('selection-change', this.multipleSelection);
    },

	//勾选函数回调
	handleSelectionChange(val) {
		this.elsectVal = val;
		console.log(this.elsectVal);
	},
    
  },
  watch:{
	orderBudgetDTOList(item){
		if(this.orderBudgetDTOList.length != 0) {
			this.orderBudgetDTOList.forEach((res,index) => {
				res.roomName = `房间：0${index+1}--`;
				res.roomCode = index;
			})
		}
    },
  }
};
</script>
<style scoped lang='scss'>
	.roomtable {
		.btnList {
			display: flex;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: center;
			.roomList {
				display: flex;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: center;
				.cSuccess {
					padding-right: 8px;
					padding-left: 8px;
					white-space: nowrap;
				}
			}
			>button:nth-of-type(1) {
				margin-left: 20px;
			}
		}
		.el-input-number {
            line-height: 23px;
        }
	}
  
 

</style>

<style lang="scss">
.goodlists {
    .el-input__inner {
        // height: 23px;
        // line-height: 23px;
        // border: 0px;
        // appearance: none;
        background: transparent;
    }
    // .el-input__suffix {
    //     // display: none;
    // }
}
</style>

