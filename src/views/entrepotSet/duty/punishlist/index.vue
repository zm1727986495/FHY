<template>
  <div class="punishlist">
    <div class="apper">
      <!-- 导航栏 -->
		<div class="head_nav">
			<breadcrumb :navList="navList"></breadcrumb>
		</div>
 
       

        <!-- 申诉弹框 -->
        <!-- <appealdia :visible="appeal_vis" @close_app="closeapp" @send_app="sendapp"></appealdia> -->

        <!-- 处罚单详情弹框 -->
        <punishdialog v-if="genepunishVisible" :ticketPeopleId="ticketPeopleId" @close_dialog="closedialog" @confirm_dialog="confirmdialog"></punishdialog>

        <!-- 按钮组 -->
        <el-card>
            <div class="warp_head_list">  
                <div class="list_top"> 
                    <div class="search_item">
                        <el-input class="width-100" placeholder="处罚单号/定责单号/被处罚人" v-model="searchForm.ticketGroup" maxlength="50" @keydown.enter.native="searchfun"></el-input>
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
                <el-button size="small" class="button-96 " @click="exportFun"  v-if="btnJurisdiction.dutylist_punish">导出</el-button>
            </div>

            <!-- table表格 -->
            <div class="table_list lvs attribute m-top20" v-loading="loading">
                <el-table
                    border   :row-key="getRowKeys"  @row-click="rowClick"
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    :data="tabList"  ref="tableMulti"
                    style="width: 100%;">
                    <el-table-column type="selection" width="40" :reserve-selection="true" fixed></el-table-column>
                    <el-table-column prop="ticketNumber" label="处罚单号" width="240" sortable align="center" fixed>
                         <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p  @click="operaButton(scope.row)" class="operaItems">查看</p>
                                    </div>
                                    <img :src="spot" alt="" class="attributesTips">
                                </el-tooltip>

                                <p class="text">{{scope.row.ticketNumber}}</p>
                            </div>       
                        </template>
                    </el-table-column>
                    <el-table-column prop="groupName" label="被处罚部门" width="240" sortable align="center"></el-table-column>
                    <el-table-column prop="dutyName" label="被处罚人" width="240" sortable align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" width="240" sortable align="center" :formatter="statusformatter"></el-table-column>
                    <el-table-column prop="initiatorName" label="发起人" width="240" sortable align="center"></el-table-column>
                    <el-table-column prop="initiatorTicketTime" label="发起处罚时间" width="240" sortable align="center"></el-table-column>
                    <el-table-column prop="punishType" label="处罚方式" width="240" sortable align="center" :formatter="typeformatter"></el-table-column>
                    <el-table-column prop="punishMoneyCountType" label="处罚计算公式" width="240" sortable align="center"></el-table-column>
                    <el-table-column prop="punishMoney" label="处罚金额" width="240" sortable align="center"></el-table-column>
                    <el-table-column prop="punishCause" label="处罚原因" width="240" sortable align="center"></el-table-column>
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
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import spot from "@/assets/images/spot.png";
// import appealdia from "./appealdia";
// import genepunish from "../components/genepunish";

import punishdialog from "./components/punishdialog";
import module from '../../../../../config/index.js';

import { 
    listTicket, // 处罚页列表
} from 'api/entrepotSet/duty/index';
import { log } from 'util';

export default {
  components: {
    breadcrumb,
    pagination,
    // genepunish,
    punishdialog
    // appealdia
  },
  // name: 'brandmanagement',
  data() {
    return {
        searchDate: [],
        searchForm: {
            ticketGroup: '', // 处罚单号/定责单号/被处罚人
        },
        loading: true, // table的loading控制
        downFile: '',
        
        btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
        // 分页
        currentPage: 1, //当前页数
        pageSize: 20, //总页数
        total: 0, //总条数

        spot, //操作图片
        navList: [], //头部面包屑

        elsectVal: [], //选中组成的数组
        tabList: [], //table数据
        genepunishVisible: false,
        ticketPeopleId: '',
    };
  },
  created() {
        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/ticket/exportTicket?ticketPeopleIds=';

        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };

        this.getList(data);   
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    getRowKeys(row) {
        return row.ticketPeopleId;
    },
    
    rowClick(row) {
        this.$refs.tableMulti.toggleRowSelection(row)
    },

    statusformatter(row, column) {
        let status = "";
        switch(row.status) {
            case 1: 
                status = "已接受"
                break;
            case 0:
                status = "未接受"
                break;
            default: 
                status = ""
        }
        return status;
    },
    // 处罚方式 1罚款 2暂扣 3其他 4不处罚 ,
    typeformatter(row, column) {
        // return row.source;
        let punishType = '';
        switch (row.punishType) {
            case 1:
                punishType = "罚款"
                break;
            case 2:
                punishType = "暂扣"
                break;
            case 3:
                punishType = "其他"
                                    
                break;
            case 4:
                punishType = "不处罚"
                break;
            default: 
                punishType = ""
        }
        return  punishType;
    },
    // 查询
    searchFun() {
        this.currentPage = 1;
        
        let data = this.searchdatas();
        this.getList(data);
    },
     
    // 导出
    exportFun() {
        if (this.elsectVal.length == 0) {
          this.$message.error("请勾选数据后再进行导出");
        } else {
          let data = this.elsectVal
            .map(item => {
              return item.ticketPeopleId;
            })
            .join(",");
          window.location.href = this.downFile + data;

          this.$refs.tableMulti.clearSelection();
        }


        // let ids = this.elsectVal.map(item => {
        //    return item.ticketPeopleId;
        // }).join(",");
        // console.log(ids,"ids 55555555");
        
        // this.downFile = this.downFile + ids;
        // console.log(this.downFile,"dowen 88899")
    },
     // 查看
    operaButton(rowData) {
        this.ticketPeopleId = rowData.ticketPeopleId;
		this.genepunishVisible = true;
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
            ticketGroup: this.searchForm.ticketGroup, 
            initiatorStartTime: this.searchDate ? this.searchDate[0] : '',
            initiatorEndTime:  this.searchDate ?  this.searchDate[1] : '',
    
            page: this.currentPage,
            limit: this.pageSize,
        };
    },
        
        // 重置
    resetFun() {
        this.currentPage = 1;

        this.searchForm.ticketGroup = '',
        this.searchDate = [];

        let data = this.searchdatas();
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

    // 获取表格数据
    getList(data) {
        this.loading = true;
        listTicket(data).then(res =>{
            if(res.status == 200){
                this.total = res.data.total;
                this.tabList = res.data.rows;
                this.loading = false;
            }
        }).catch(error =>{
                this.loading = false;
            console.log('定责管理:处罚列表 duty/punishlist/index.vue', error);
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
    .punishlist {
        .recordActions {
            padding : 0px;
            span{
                display: block;
                width: 100%;
                height: 100%;
                a{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            
        }
    }

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


<style lang="scss">
    .recordActions {     
        span{
            display: block;
            width: 100%;
            height: 100%;
            padding : 9px 10px;
        }
        
    }
    .downActions {
        span{
            display: block;
            width: 100%;
            height: 100%;
            padding : 0px;
            a{
                display: block;
                width: 100%;
                height: 100%;
                padding : 9px 10px;
            }
        }
    }
</style>

