<template>
  <div class="orderlist">
	  	<div class="warp_head_list">
			<div class="list_top">
					<!-- 第一行 -->
					<div class="search_item">
                        <el-input class="width-100" placeholder="定责单号/赔偿单号/被定责人/被定责部门" v-model="searchForm.taskGroup" maxlength="50"></el-input>
                    </div>

					<div class="search_item">
                        <el-date-picker
                            format= "yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%"
                            v-model="searchDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
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
		  		ref="multipleTable"
				border  :row-key="getRowKeys"
				:row-class-name="tableRowClassName"
				@selection-change="handleSelectionChange"
				:data="tabList"
				style="width: 100%;">
				<el-table-column type="selection" width="40"   :reserve-selection="true"></el-table-column>

				<el-table-column prop="source" label="来源" width="240" sortable align="center" >
					<template slot-scope="scope">
						<div>
							<el-tooltip placement="right" visible-arrow >
								<div slot="content" class="tips tipFon">
									<p  @click="operaButton(scope.row)" class="operaItems">查看</p>
								</div>
								<img :src="spot" alt="" class="attributesTips">
							</el-tooltip>

							<p class="text" v-html="sourceformatter(scope.row)">{{scope.row.source}}</p>
						</div>       
					</template>
				</el-table-column>

				<el-table-column prop="orderNumber" label="来源单号" width="240" sortable align="center"></el-table-column>
				<el-table-column prop="taskDutyNumber" label="定责单号" width="240" sortable align="center">
					<!-- <template slot-scope="scope">
						<div>
							<p class="operation table_action_span">{{scope.row.name}}</p>
						</div>
					</template> -->
				</el-table-column>

				<el-table-column prop="status" label="状态" width="240" sortable align="center" :formatter="statusformatter"></el-table-column>

				<el-table-column prop="groupName" label="发起部门" width="240" sortable align="center"></el-table-column>

				<el-table-column prop="sponsorName" label="发起人" width="240" sortable align="center"></el-table-column>

				<el-table-column prop="sponsorTime" label="发起定责时间" width="240" sortable align="center"></el-table-column>
				
				<el-table-column prop="remake" label="备注" width="240" sortable align="center"></el-table-column>
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

        <!-- <div class="subclick">
            <el-button class="el-button--medium" type="primary" size="medium"   @click="subclick">提交</el-button>
        </div> -->


  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import { 
    listTaskDutyByPage, // 定责申请日志
} from 'api/entrepotSet/duty/index';



import spot from '@/assets/images/spot.png';
export default {
	created() {
	  
        this.currentPage = 1;

        let data = this.searchdatas();
        this.getList(data);
  	},

    components: {
    	breadcrumb,
      	pagination,
  	},

  // name: 'dutylist',
  data() {
    return {
		currentPage: 1,//当前页数
		pageSize: 10,//总页数
		total: 100,//总条数
		
		spot,//操作图片
		
		selections: [], //选中组成的数组
        tabList: [], //table数据

      	searchDate: [],
		searchForm: {
			taskGroup: '',
		},
    };
  },
  
 
  methods: {
	  getRowKeys(row) {
        return row.taskDutyId;
	  },
	   // 来源   1安装 2维修 3入库 4出库 5物流
    sourceformatter(row) {
        // return row.source;
        let source = '';
        switch (row.source) {
            case 1:
                source = "安装"
                break;
            case 2:
                source = "维修"
                break;
            case 3:
                source = "入库"
                                    
                break;
            case 4:
                source = "出库"
                break;
            case 5:
                source = "物流"
                break; 
            default: 
                source = '' 
        }
        return  source;
    },
    // 1待处理 2处理中 3处理完成 4全部接受
    statusformatter(row, column) {
        let status = '';
        
        switch (row.status) {
            case "1":
                status = "待处理"
                break;
            case "2":
                status = "处理中"
                break;
            case "3":
                status = "处理完成"            
                break;
            case "4":
                status = "全部接受"
                break;
            // case "5":
            //     status = "有条件接受"
            //     break;  
            default: 
                status = ""
        }
        return  status;
    },
    // 查询
    searchFun() {
        this.currentPage = 1;

        let data = this.searchdatas();
        this.getList(data);
    },
    // 重置
    resetFun() {
        this.searchForm.taskGroup = '',
        this.searchDate = [];

        let data = this.searchdatas();
        this.getList(data);
    },
	
	// 搜索条件获取
        searchdatas(){
            return {
                taskGroup: this.searchForm.taskGroup,
                initiatorStartTime: this.searchDate[0],
                initiatorEndTime:  this.searchDate[1],
                orderId: this.$route.query.orderId ? this.$route.query.orderId : '',
                taskType: 1,// 针对于订单
		
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
            this.currentPage = 1;
            this.pageSize = val;
            
            let data = this.searchdatas();
            this.getList(data);
		},

        // 获取表格数据
		getList(data){
            listTaskDutyByPage(data).then(res =>{
                console.log(res);
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                }
            }).catch(error =>{
                console.log('定责管理:定责列表 duty/dutylist/index.vue', error);
            })
		},
		//勾选函数回调
        handleSelectionChange(val){
           this.selections = val;
            if(this.selections.length > 1){ // 多选变单选
                this.$refs.multipleTable.toggleRowSelection(this.selections[0]);
			}
			
			this.$emit("selectionChange",this.selections)
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
    

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
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

