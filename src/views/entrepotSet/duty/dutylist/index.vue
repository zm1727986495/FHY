<template>
  <div class="wrapper">
    <div class="apper">
      <!-- 导航栏 -->
		<div class="head_nav">
			<breadcrumb :navList="navList"></breadcrumb>
		</div>
 
        <!-- 申诉弹框 -->
        <!-- <appealdia :visible="appeal_vis" @close_app="closeapp" @send_app="sendapp"></appealdia> -->

        <!-- 生成处罚单弹框 -->
        <!-- <genepunish v-if="genepunishVisible" @close_dialog="closedialog" @confirm_dialog="confirmdialog"></genepunish> -->

        <!-- 按钮组 -->
        <el-card>
            <div class="warp_head_list">  
                <div class="list_top"> 
                    <div class="search_item">
                        <el-input class="width-100" placeholder="定责单号/赔偿单号/被定责人/被定责部门/人/发起部门" v-model="searchForm.taskGroup" maxlength="50"  @keydown.enter.native="searchFun"></el-input>
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
            <div class="h-width"></div>
            <div class="btn_list_1">
                <!-- <el-button size="small" class="button-96" @click="addDuty">新增</el-button> -->
                <el-button size="small" class="button-96"  @click="addDuty"  v-if="btnJurisdiction.dutylist_add">发起定责</el-button>
                <el-button size="small" class="button-96" @click="auditHandle"  v-if="btnJurisdiction.dutylist_audit">申诉处理</el-button>
                <el-button size="small" class="button-96" @click="punishHandle"  v-if="btnJurisdiction.dutylist_punish">生成处罚单</el-button>
            </div>

            <!-- table表格 -->
            <div class="table_list lvs attribute m-top20" v-loading="loading">
                <el-table
                    border  :row-key="getRowKeys"  @row-click="rowClick"
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    :data="tabList"  ref="tableMulti"
                    style="width: 100%;">
                    <el-table-column type="selection" width="55" :reserve-selection="true" fixed='left'></el-table-column>
                    <el-table-column prop="taskDutyNumber" label="定责单号" width="240" sortable align="center" fixed='left'>
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p  @click="operaButton(scope.row)" class="operaItems">查看</p>
                                    </div>
                                    <img :src="spot" alt="" class="attributesTips">
                                </el-tooltip>

                                <p class="text" v-html="sourceformatter(scope.row)">{{scope.row.taskDutyNumber}}</p>
                            </div>       
                        </template>
                    </el-table-column>
                    <el-table-column prop="source" label="来源" width="240" sortable align="center" >
                        <!-- <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p  @click="operaButton(scope.row)" class="operaItems">查看</p>
                                    </div>
                                    <img :src="spot" alt="" class="attributesTips">
                                </el-tooltip>

                                <p class="text" v-html="sourceformatter(scope.row)">{{scope.row.source}}</p>
                            </div>       
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="orderNumber" label="来源单号" width="240" sortable align="center"></el-table-column>
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
        </el-card>

      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>
import spot from "@/assets/images/spot.png";
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import { 
    listTaskDutyByPage, // 定责申请日志
} from 'api/entrepotSet/duty/index';

// import appealdia from "./appealdia";
// import genepunish from "../components/genepunish";

export default {
  components: {
    breadcrumb,
    pagination,
    // genepunish
    // appealdia
  },
  // name: 'brandmanagement',
  data() {
    return {
        searchDate: [],
        searchForm: {
            taskGroup: '',
        },
        // 分页
        currentPage: 1, //当前页数
        pageSize: 20, //总页数
        total: 100, //总条数

        spot, //操作图片
        navList: [], //头部面包屑

        elsectVal: [], //选中组成的数组
        tabList: [], //table数据
        loading: true, // table的loading控制

        btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
        genepunishVisible: false
    };
  },

    activated(){
        // 头部面包屑
        this.navList = this.$route.meta;

        let data = {
            page: 1,
            limit: this.pageSize,
        };
        this.getList(data);
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
//   created() {
// 	  	let data = {
//             page: 1,
//             limit: this.pageSize,
//         };
//         this.getList(data);
//   },

//   mounted() {
//     // 头部面包屑
//     this.navList = this.$route.meta;
//   },
  methods: {
      getRowKeys(row) {
        return row.taskDutyId;
      },
      rowClick(row) {
            this.$refs.tableMulti.toggleRowSelection(row)
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
    addDuty(row) {
        if(this.elsectVal.length >= 1){
            this.$message({
                message: '抱歉，请勿选择定责',
                type: 'warning'
            });
            return;
        }
        this.$router.push({
            path: "addduty"
            // query: {
            // 	activityId: row.activityId
            // }
        });
    },
    // 查询
    searchFun() {
        this.currentPage = 1;

        let data = this.searchdatas();
        this.getList(data);
    },
    // 重置
    resetFun() {
        this.currentPage = 1;
        this.searchForm.taskGroup = '',
        this.searchDate = [];

        let data = this.searchdatas();
        this.getList(data);
    },
     // 查看
    operaButton(rowData) {
        // let taskDutyId = rowData.taskDutyId;

        this.$router.push({
            path: "dutydetails",
            query: {
                taskDutyId:rowData.taskDutyId
            }
        });
        
    },
    // 表格选中警示信息 -- 只能选择一个订单并且必须选择
    warnMessage() {
        if (this.elsectVal.length > 1) {
            this.$message({
                message: "抱歉， 只能选择一个",
                type: "warning"
            });
            return;
        } else if (this.elsectVal.length < 1) {
            this.$message({
                message: "抱歉， 请进行选择",
                type: "warning"
            });
            return;
        }
        return true;
    },
    // 申诉处理
    auditHandle() {
        if(!this.warnMessage()) {
            return;
        }
        if(!(this.elsectVal[0].status == "2")){
            this.$message({
                message: "抱歉， 只有状态是处理中的定责才可以进行申诉处理",
                type: "warning"
            });
            return;
        }
        this.$router.push({
          path: "dutydeal",
          query:{taskDutyId: this.elsectVal[0].taskDutyId}
        });
    },
    punishHandle() {
        if(!this.warnMessage()) {
            return;
        }
        if(!(this.elsectVal[0].status == "3" || this.elsectVal[0].status == "4")){
            this.$message({
                message: "抱歉， 只有状态是处理完成或全部接受的定责才可以进行申诉处理",
                type: "warning"
            });
            return;
        }
        this.$router.push({
            path: "genepunish",
            query: {taskDutyId: this.elsectVal[0].taskDutyId, statuses: "2,5" },
        })

    //   this.genepunishVisible = true;
    },
        // 关闭生成处罚单弹出框 -- 子组件触发
        closedialog() {
            this.genepunishVisible = false;
        },
        // 确认生成处罚单弹出框 -- 子组件触发
        confirmdialog() {
            this.genepunishVisible = false;
        },

        // 搜索条件获取
        searchdatas(){
            return {
                taskGroup: this.searchForm.taskGroup,
                initiatorStartTime:this.searchDate ? this.searchDate[0] : '',
                initiatorEndTime: this.searchDate ?  this.searchDate[1] : '',
		
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
            this.loading = true;
            listTaskDutyByPage(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    this.loading = false;
                }
            }).catch(error =>{
                    this.loading = false;
                console.log('定责管理:定责列表 duty/dutylist/index.vue', error);
            })
		},
		//勾选函数回调
		handleSelectionChange(val) {
			this.elsectVal = val;
			console.log(this.elsectVal);
		},


    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
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
    
    
</style>

