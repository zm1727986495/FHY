<template>
    <div class="recommenman">
		<!-- 查询条件组 -->

		<el-card style="marginTop:20px">
			<div class="warp_head_list">
				<div class="list_top">
					<div class="search_item">
						<!-- <span>借出单号</span> -->
					
						<el-input placeholder="借出单号" v-model="lendnum" size="medium" maxlength="50" disabled>
							<el-button slot="append" size="mini" icon="el-icon-search" @click="selectType"></el-button>
						</el-input>
							<!-- <el-button size="small" class="button-96" @click="selectType">选择订单</el-button> -->
					
					</div>
					<div class="search_item">
						<!-- <span>借入单号</span> -->
						<el-input placeholder="借入单号" v-model="borrownum" size="medium" maxlength="50">
						</el-input>
					</div>
				</div>
			</div>

			<!-- tableTitle 表格上面的题目 isCheckbox 是否有checkbox 
				isPurchase 第二列是采购合同还是库取单号 //fixed
				isPlace 货区货位是否拥有checkbox
				isLengend 最后一列的借入借出
			-->
			<goodsTable 
				tableTitle = "采购合同"
				isCheckbox = false
				isPlace = false
				isLengend = false
				isPurchase  = true>
			</goodsTable>

			<goodsTable 
				tableTitle = "库取单号"
				isCheckbox = true
				isPlace = false
				isLengend = false
				isPurchase  = false>
			</goodsTable>
		</el-card>

        <!-- 订单 -->
        <div v-if="visible">
          <!-- <orderlist></orderlist> -->
		  	<el-dialog title="" :visible.sync="visible" >
				<orderlist></orderlist>
		  	</el-dialog>
        </div>

    </div>
  
</template>
<script>

import pagination from "@/views/components/pagination";
import goodsTable from './components/goodsTable';
import prolist from "../../entrepotSet//allocationmanage/tobeallocated/prolist";
import choseord from "./components/choseord";
import orderlist from "./components/orderlist";

import spot from '@/assets/images/spot.png';

import { 
    listBaseDict,
} from 'api/samplemanagement/upsample/upsample';

export default {
	components: {
		pagination,
		goodsTable,
		prolist,
		choseord,
		orderlist
	},
	props:["isCheckbox","isPlace","isLengend"],
  // name: 'borrowedmanage',
	data() {
		return {
            navList: [],//头部面包屑
            // begin
         	// 查询条件
			lendnum: '', // 借出单号
			borrownum: '', // 借入单号
			visible: false,
			// 分页
			currentPage:1,
			pageSize:10,
			total:100,
			show: 0,
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
		
		onSearch(){    //搜索
            let data = this.searchdatas();
            console.log(data);
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
            //     console.log(res);
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


        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},

		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
			// return "height: 80px";
		},

  

		// 选择订单
		selectType(){
			this.visible= true;
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
					>div{
						width: 100%;
					}
				}
			
		}
		
	}
	.typesel{
		width: 40%;
		margin: 0 auto;
		display: flex;
		justify-content: space-around;
		margin-bottom: 50px;
	}
	.btn_list_1 {
		margin-top: 20px;
	}
</style>

