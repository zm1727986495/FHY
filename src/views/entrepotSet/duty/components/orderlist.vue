<template>
  <div class="orderlist">
	  	<div class="warp_head_list">
			<div class="list_top">
					<!-- 第一行 -->
					<div class="search_item">
						<el-input placeholder="订单号/采购合同号" v-model="searchForm.name" maxlength="50" style="display:inline-block;flex:1"></el-input>
					</div>

					<div class="search_item" >
						<el-date-picker
							style="width:100%"
							v-model="searchForm.time"
							type="monthrange"
							range-separator="-"
							start-placeholder="年/月/日"
							end-placeholder="年/月/日">
						</el-date-picker>
					</div>

					<div class="search_item">
						<el-select v-model="searchForm.value" placeholder="商品品牌">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>

					<div class="search_item">
						<el-select v-model="searchForm.value" placeholder="商品名称">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>

					<div class="search_item">
						<el-select v-model="searchForm.value" placeholder="所属门店">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>

					<div class="search_item">
						<el-select v-model="searchForm.value" placeholder="商品类型">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>

					<div class="search_item">
						<el-button class="button-fc" type="warning" size="medium"  @click="searchFun">查询</el-button>
						<el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
					</div>
			</div>
	  	</div>
        <!-- table表格 -->
        <div class="table_list lvs attribute">

          <el-table
            border
            :row-class-name="tableRowClassName"
            :row-style="tableBodycolor"
            @selection-change="handleSelectionChange"
            :data="tabList"
            style="width: 100%;">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column
              prop="name"
              label="订单号"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="采购合同号"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="订单创建时间"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品品牌"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品名称"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="所属门店"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="状态"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="所属仓库"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="备注"
              width="240" sortable align="center">
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

        <div class="subclick">
            <el-button class="el-button--medium" type="primary" size="medium"   @click="subclick">提交</el-button>
        </div>


  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,
    

      
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1,//当前页数
      pageSize: 20,//总页数
      total: 100,//总条数
      spot,//操作图片
      navList: [],//头部面包屑

      elsectVal:[],//选中框
      tabList:[],//table数据
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      value: '',
      show:"",
      searchForm:{ //查询条件
        name:"",
        value:"",
        time:[],
      },
       

      



      
    };
  },
  	created() {
		let data = {
			page: this.currentPage,
			limit: this.pageSize,
		};
		this.getList(data);

	},
 
  methods: {

    // 查询按钮
    searchFun(){
      

    },

    // 重置按钮
    resetFun(){
        this.searchForm = {};
    },

    //  提交按钮
    subclick(){
        // this.$emit("sub_click")
        this.$router.push({
          path: "choseord",
          query:{
            
          }
        });
    },
		// 表格勾选函数回调
		handleSelectionChange(val) {
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },

    	// 搜索条件获取
        searchdatas(){
            return {
                // names: this.names, 
                // searchData: this.searchData[0], 
                // dutyReason: this.dutyReason[0],
                // dutyType: this.dutyType[0], 
                // goodsSource: this.goodsSource[0],
		
                page: this.currentPage,
                limit: this.pageSize,
            };
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
    
		tableRowClassName({row, rowIndex}) {//表格斑马线设置
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},
	
		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
		//   return "height: 80px";
		},
    
    
  }
};
</script>
<style scoped lang='scss'>
.orderlist{
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
     .subclick{
        width: 10%;
        margin: 20px auto;
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
}

</style>

