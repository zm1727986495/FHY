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
        <!-- <genepunish :visible="genepunishVisible" @close_dialog="closedialog" @confirm_dialog="confirmdialog"></genepunish> -->
        
        <!-- 上传赔偿单弹框 -->
        <uploaddia v-if="uploadVisible" :dutyCompensationId="this.elsectVal[0].dutyCompensationId"  @close_dialog="uploadclose" @confirm_dialog="uploadconfirm"  @get_list="searchFun"></uploaddia>

        <!-- 查看、编辑弹框 -->
        <editdia v-if="editVisible"  :disabled = "disabled" :title = "title" :rowData="rowData" @close_dialog="editclose" @confirm_dialog="editconfirm"  @get_list="searchFun"></editdia>

        <!-- 按钮组 -->
        <el-card>
            <div class="warp_head_list">  
                <div class="list_top"> 
                    <div class="search_item">
                        <el-input class="width-100" placeholder="赔偿单号/定责单号/定责人" v-model="searchForm.dutyCompensationGroup" maxlength="50" @keydown.enter.native="searchfun"></el-input>
                    </div>

                    <div class="search_item">
                        <el-date-picker
                            style="width:100%"
                            v-model="searchDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="年/月/日"
                            end-placeholder="年/月/日">
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
                <!-- <el-button size="small" class="button-96" @click="addcompen">新增</el-button> -->
                <el-button size="small" class="button-96"  @click="addcompen"  v-if="btnJurisdiction.compen_add">发起赔偿</el-button>
                <el-button size="small" class="button-96" @click="uploadcompen"  v-if="btnJurisdiction.compen_upload">上传赔偿单</el-button>
                <!-- <el-button size="small" class="button-96" @click="auditHandle">提交审批</el-button> -->
            </div>

            <!-- table表格 -->
            <div class="table_list lvs attribute m-top20" v-loading="loading">
                <el-table
                    border  :row-key="getRowKeys"  @row-click="rowClick"
                    :row-class-name="tableRowClassName"
                    :row-style="tableBodycolor"
                    @selection-change="handleSelectionChange"
                    :data="tabList"  ref="tableMulti"
                    style="width: 100%;">
                    <el-table-column type="selection" width="55" :reserve-selection="true" fixed="left"></el-table-column>
                    <el-table-column prop="compensationNumber" label="赔偿单号" width="240" sortable align="center"  fixed="left">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content" class="tips tipFon">
                                        <p @click="viewButton(scope.row)" class="operaItems">查看</p>
                                        <p @click="editButton(scope.row)" class="operaItems" v-if="scope.row.status == '2' || scope.row.status == '3' ">编辑</p>
                                        <p @click="scrapButton(scope.row)" class="operaItems">作废</p>
                                    </div>
                                    <img :src="spot" alt="" class="attributesTips">
                                </el-tooltip>

                                <p class="text">{{scope.row.compensationNumber}}</p>
                            </div>       
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="taskDutyNumber" label="定责单号" width="240" sortable align="center">
                        <!-- <template slot-scope="scope">
                            <div>
                                <p class="operation table_action_span">{{scope.row.name}}</p>
                            </div>
                        </template> -->
                    </el-table-column>

                    <el-table-column prop="status" label="状态" width="240" sortable align="center" :formatter="statusformatter"></el-table-column>

                    <el-table-column prop="initiateName" label="发起人" width="240" sortable align="center"></el-table-column>

                    <el-table-column prop="initiateCompensationTime" label="发起赔偿时间" width="240" sortable align="center"></el-table-column>

                    <el-table-column prop="compensationMoney" label="赔偿金额" width="240" sortable align="center"></el-table-column>

                    <el-table-column prop="compensationWay" label="赔偿方式" width="240" sortable align="center" :formatter="typeformatter"></el-table-column>

                    <el-table-column prop="compensationCause" label="赔偿原因" width="240" sortable align="center"></el-table-column>
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
import uploaddia from "./components/uploaddia"; // 上传赔偿单
import editdia from "./components/editdia"; // 查看编辑

import  {
    listDutyCompensation, // 赔偿管理列表
    editDutyCompensation, // 编辑
    dutyCompensationDeatil, // 查看回显
    editDutyCompensationStatus, // 修改状态（提交审批，作废,驳回,通过）
} from "api/entrepotSet/compensationmanage/index";

export default {
  components: {
    breadcrumb,
    pagination,
    // genepunish,
    uploaddia, // 上传赔偿单
    editdia, // 查看、编辑弹出框
    // appealdia
  },
  // name: 'compensationmanage',
  data() {
    return {
        searchDate: [],
        searchForm: {
            dutyCompensationGroup: '',
        },
        // 分页
        currentPage: 1, //当前页数
        pageSize: 20, //总页数
        total: 100, //总条数

        spot, //操作图片
        navList: [], //头部面包屑

        elsectVal: [], //选中组成的数组
        tabList: [{
            status: '2',
        }], //table数据
		loading: true, // table的loading控制
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
        genepunishVisible: false,
        uploadVisible: false, // 上传赔偿单弹出框
        editVisible: false, // 查看、编辑弹出框
        disabled: true, // 查看、编辑弹出框的input值
        title: "查看", // 查看、编辑弹出框的title值
        rowData: {}, //  查看、编辑弹出框的行数据
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
      getRowKeys(row) {
        return row.dutyCompensationId;
      },
       rowClick(row) {
            this.$refs.tableMulti.toggleRowSelection(row)
        },
	  //  0审批中 1审批通过 2待上传 3驳回 4作废
    statusformatter(row, column) {
        let status = '';
        
        switch (row.status) {
            case 0:
                status = "审批中"
                break;
            case 1:
                status = "审批通过"
                break;
            case 2:
                status = "待上传"            
                break;
            case 3:
                status = "驳回"
                break;
            case 4:
                status = "作废"
                break;  
            default: 
                status = ""
        }
        return  status;
    },
    typeformatter(row, column) {
        let type = '';
        
        switch (row.compensationWay) {
            case 1:
                type = "转账"
                break;
            case 2:
                type = "现金"
                break;
            case "3":
                type = "其他"            
                break;  
            default: 
                type = ""
        }
        return  type;
    },
    // 查询
    searchFun() {
        console.log("12323334");
        
		this.currentPage = 1;

        let data = this.searchdatas();
        this.getList(data);
    },
    // 重置
    resetFun() {
      this.searchForm.dutyCompensationGroup = '';
      this.searchDate = [];
	  
	  let data = this.searchdatas();
	  this.getList(data);
	  
    },
     // 查看 -- 操作按钮2
    viewButton(rowData) {
        this.title = "查看";
        this.rowData = rowData;
        console.log(this.rowData,"this. rowData");

        // let data = {
        //     dutyCompensationId: rowData.dutyCompensationId
        // };

        // dutyCompensationDeatil(data).then(res => {
        //     if(res.status == 200) {
        //         this.
        //     }
        // }).catch(err =>{
        //     console.log('仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue', error);
        // })

        // editDutyCompensation(data).then(res => {
        //     if(res.status == 200) {

        //     }
        // }).catch(err =>{
        //     console.log('仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue', error);
        // })
        
        this.disabled = true;
		this.editVisible = true;
    },
    // 编辑 -- 操作按钮2
    editButton(rowData) {
        this.title = "编辑";
        this.rowData = rowData;
        this.disabled = false;
		this.editVisible = true;
    },
    // 作废 -- 操作按钮2
    scrapButton(rowData) {

        let data = {
            status: '4',
            dutyCompensationId: rowData.dutyCompensationId
        };

        editDutyCompensationStatus(data).then(res =>{
            if(res.status  == 200) {
                this.$message({
                    message: '作废成功',
                    type: 'success'
                });

                this.getList(); // 刷新列表
            }
        }).catch(err => {
            console.log('仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue', error);
        })
		
    },
    // 上传赔偿单 -- 操作按钮
    uploadcompen() {
        if(this.elsectVal.length < 1) {
            this.$message({
                message: '请勾选',
                type: 'warning'
            });

            return;
        }
        if(this.elsectVal.length > 1) {
            this.$message({
                message: '请勿勾选多于一个',
                type: 'warning'
            });

            return;
        }
        this.uploadVisible = true;
    },
    // 提交审批 -- 操作按钮
    auditHandle() {
      this.genepunishVisible = true;
    },
    // 发起赔偿  -- 操作按钮
    addcompen(row) {
        if(this.elsectVal.length > 0) {
            this.$message({
                message: '请勿勾选',
                type: 'warning'
            });

            return;
        }

      this.$router.push({
        path: "addcompensation"
        // query: {
        // 	activityId: row.activityId
        // }
      });
    },
    // 关闭操作按钮 -- 上传赔偿单弹出框 -- 子组件触发
    uploadclose() {
      this.uploadVisible = false;
    },
    // 确认操作按钮 -- 上传赔偿单弹出框 -- 子组件触发
    uploadconfirm() {
      this.uploadVisible = false;
    },

    // 关闭操作按钮 -- 查看、编辑弹出框 -- 子组件触发
    editclose() {
      this.editVisible = false;
    },
    // 确认操作按钮 -- 查看、编辑弹出框 -- 子组件触发
    editconfirm() {
      this.editVisible = false;
    },

    

    // 搜索条件获取
    searchdatas(){
        return {
            dutyCompensationGroup: this.searchForm.dutyCompensationGroup, 
            initiateCompensationStartTime:  this.searchDate ? this.searchDate[0] : '',  // 发起开始时间
            initiateCompensationEndTime: this.searchDate ? this.searchDate[1] : '', // 发起结束时间
    
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
        listDutyCompensation(data).then(res =>{
            console.log(res);
            if(res.status == 200){
                this.total = res.data.total;
                this.tabList = res.data.rows;
                this.loading = false;
            }
        }).catch(error =>{
            this.loading = false;
            console.log('仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue', error);
        })
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      console.log(this.elsectVal);
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      //   return "height: 80px";
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

