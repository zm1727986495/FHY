<template>
    <div class="tableRegion">
			<!-- 采购合同table表格 -->
			<div class="table_list lvs attribute m-top20">
				<div class="titlecals">{{tableTitle}}</div>
				<el-table
					border
					:row-class-name="tableRowClassName"
					@selection-change="handleSelectionChange"
					:data="tabList"
					style="width: 100%;">

					<el-table-column  v-if="isCheckbox" type="selection"  width="36"></el-table-column>

					<el-table-column prop="name" label="订单号" sortable align="center"></el-table-column>

					<el-table-column v-if = "isPurchase" prop="name" label="采购合同" sortable align="center"></el-table-column>

					<el-table-column v-else prop="name" label="库取单号" sortable align="center"></el-table-column>

					<el-table-column prop="name" label="商品" sortable align="center"></el-table-column>

					<el-table-column prop="name" label="数量" sortable align="center"></el-table-column>

					<el-table-column prop="name" label="货区货位" sortable align="center">
						<template slot-scope="scope">
							<div class="" v-if = "isPlace">
                                <div  v-for="(item,index) in scope.row.name" :key="index">
                                    <el-checkbox
                                        v-model="checkBox">{{item}}
                                    </el-checkbox>
                                </div>
                            </div>
							<div v-else>
                                <div
                                    v-for="(item,index) in scope.row.name"
                                    :key="index">
                                    {{item}}
                                </div>
                            </div>
						</template>
					</el-table-column>

					<!-- 借出数量 -->
					<el-table-column v-if="isLengend" prop="name" label="借出数量" sortable align="center">
						<template slot-scope="scope">
							<el-input v-model="scope.row.name"></el-input>
						</template>
					</el-table-column>
					<!-- 借入数量 -->
					<el-table-column v-else prop="name" label="借入数量" sortable align="center">
						<!-- <template slot-scope="scope">
							<div
								class=""
								v-for="(item,index) in scope.row.name"
								:key="index"
							><el-checkbox v-model="checkBox">{{item}}</el-checkbox></div>

							<div v-else>{{scope.row.item}}</div> 
						</template> -->
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

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';

export default {
	components: {
		pagination,
	},
	props:["isCheckbox","isPlace","isLengend","isPurchase","tableTitle"],
  // name: 'borrowedmanage',
	data() {
		return {
            navList: [],//头部面包屑
           
            // 查询条件
            lendnames: '',
            searchData: [], // 查询条件--时间

            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
			
			// 分页
			currentPage:1,
			pageSize:10,
			total:100,
			
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

    },
	methods: {
        
        lendingGoods () {
            this.$router.push({
                path: '/borrowedmanage/lendingdetails',
                // query: {
                //     activityId: row.activityId
                // }
            });
        }, 
        returnGoods () {

        },
        otherGoods () {

        },
		// 搜索条件获取
        searchdatas(){
            return {
                names: this.borrow.names,//订单编号
                createTimeStart: this.searchData[0],//创建时间
				createTimeEnd: this.searchData[1],
				// orderStatusIds: this.orderStatus.join(","),//订单状态
		
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
		//搜索
		onSearch(){ 
			this.currentPage = 1;

            let data = this.searchdatas();
            this.getList(data);
		},

		// 重置
        resetFun(){     
            this.borrow = {},
			// this.names = '';
            this.searchData = [];

            let data = this.searchdatas();
            this.getList(data);
        },
        
        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
		
		// 分页函数回调
        currentChange(val) {
			this.currentPage = val;
			
            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
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


        // 表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
	}
};
</script>
<style scoped lang='scss'>
    .tableRegion {
        margin-top: 20px;
    }

</style>

